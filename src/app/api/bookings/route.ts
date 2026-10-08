import { NextResponse } from 'next/server';
import { BookingFormData, BookingResponse } from '@/types/safari';
import { SAFARI_PACKAGES } from '@/data/packages';
import { computeSafariTotalZAR, computeGateFeesZAR } from '@/lib/currency';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

// Free built-in verification for Kruger SANParks gate permits
function verifyIdentityDocument(idType?: string, idNumber?: string): { isValid: boolean; error?: string } {
    if (!idNumber || !idNumber.trim()) {
        return { isValid: false, error: 'A valid South African ID or Passport number is required for Kruger gate access.' };
    }

    const clean = idNumber.replace(/\s+/g, '').trim();

    if (idType === 'sa_id') {
        if (!/^\d{13}$/.test(clean)) {
            return { isValid: false, error: 'South African ID must contain exactly 13 digits.' };
        }

        // 1. Validate date of birth components (YYMMDD)
        const month = parseInt(clean.substring(2, 4), 10);
        const day = parseInt(clean.substring(4, 6), 10);
        if (month < 1 || month > 12 || day < 1 || day > 31) {
            return { isValid: false, error: 'Invalid date of birth encoded in South African ID.' };
        }

        // 2. Validate Luhn checksum algorithm
        let sum = 0;
        for (let i = 0; i < 13; i++) {
            let digit = parseInt(clean.charAt(i), 10);
            if (i % 2 !== 0) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            sum += digit;
        }

        if (sum % 10 !== 0) {
            return { isValid: false, error: 'Invalid South African ID checksum. Please check for typos.' };
        }

        return { isValid: true };
    }

    // International Passport check (6 to 12 alphanumeric characters)
    if (!/^[A-Z0-9]{6,15}$/i.test(clean)) {
        return { isValid: false, error: 'Passport number must be between 6 and 15 alphanumeric characters.' };
    }

    return { isValid: true };
}

export async function POST(request: Request) {
    try {
        const payload: BookingFormData = await request.json();

        // 1. Mandatory Parameter Validation
        if (!payload.fullName || !payload.email || !payload.date || !payload.packageId) {
            return NextResponse.json<BookingResponse>(
                {
                    success: false,
                    referenceNumber: '',
                    totalZAR: 0,
                    safariTotalZAR: 0,
                    depositZAR: 0,
                    balanceZAR: 0,
                    message: 'Please provide all mandatory reservation parameters.',
                },
                { status: 400 }
            );
        }

        // 2. Kruger Gate Identity Verification
        const idCheck = verifyIdentityDocument(payload.idType || 'passport', payload.idNumber);
        if (!idCheck.isValid) {
            return NextResponse.json<BookingResponse>(
                {
                    success: false,
                    referenceNumber: '',
                    totalZAR: 0,
                    safariTotalZAR: 0,
                    depositZAR: 0,
                    balanceZAR: 0,
                    message: idCheck.error || 'Identity verification failed.',
                },
                { status: 400 }
            );
        }

        const pkg = SAFARI_PACKAGES.find((p) => p.id === payload.packageId);
        if (!pkg) {
            return NextResponse.json<BookingResponse>(
                {
                    success: false,
                    referenceNumber: '',
                    totalZAR: 0,
                    safariTotalZAR: 0,
                    depositZAR: 0,
                    balanceZAR: 0,
                    message: 'Specified safari package is invalid.',
                },
                { status: 404 }
            );
        }

        const adults = Number(payload.adults) || 1;
        const children = Number(payload.children) || 0;
        const residency = payload.residency || 'international';

        // 3. Price & Deposit Calculations
        const safariTotalZAR = computeSafariTotalZAR({
            basePriceZAR: pkg.basePriceZAR,
            isVehicleRate: pkg.isVehicleRate,
            adults,
            children,
        });

        const estimatedGateFeesZAR = computeGateFeesZAR(residency, adults, children);
        const depositZAR = Math.round(safariTotalZAR * 0.20);
        const balanceZAR = safariTotalZAR - depositZAR;
        const referenceNumber = `SAF-${Math.floor(100000 + Math.random() * 900000)}`;

        // 4. Persist Reservation to Supabase
        const { error: dbError } = await supabaseAdmin.from('bookings').insert([
            {
                reference_number: referenceNumber,
                package_id: pkg.id,
                package_title: pkg.title,
                safari_date: payload.date,
                adults,
                children,
                residency,
                pickup_point: payload.pickupPoint,
                full_name: payload.fullName,
                email: payload.email,
                phone: payload.phone,
                id_type: payload.idType || 'passport',
                id_number: payload.idNumber?.trim().toUpperCase(),
                nationality: payload.nationality || 'South Africa',
                guest_manifest: payload.guestManifest || [],
                notes: payload.notes || '',
                safari_total_zar: safariTotalZAR,
                estimated_gate_fees_zar: estimatedGateFeesZAR,
                deposit_zar: depositZAR,
                balance_zar: balanceZAR,
                status: 'pending',
            },
        ]);

        if (dbError) {
            console.error('Supabase Insertion Error:', dbError);
        }

        return NextResponse.json<BookingResponse>(
            {
                success: true,
                referenceNumber,
                totalZAR: safariTotalZAR,
                safariTotalZAR,
                estimatedGateFeesZAR,
                depositZAR,
                balanceZAR,
                message: 'Safari request successfully registered.',
                data: payload,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Booking API Error:', error);
        return NextResponse.json<BookingResponse>(
            {
                success: false,
                referenceNumber: '',
                totalZAR: 0,
                safariTotalZAR: 0,
                depositZAR: 0,
                balanceZAR: 0,
                message: 'Failed to process booking request due to server fault.',
            },
            { status: 500 }
        );
    }
}