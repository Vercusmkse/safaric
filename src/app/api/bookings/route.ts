import { NextResponse } from 'next/server';
import { BookingFormData, BookingResponse } from '@/types/safari';
import { SAFARI_PACKAGES } from '@/data/packages';
import { computeSafariTotalZAR, computeGateFeesZAR } from '@/lib/currency';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const payload: BookingFormData = await request.json();

        // 1. Validation
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

        // 2. Calculations
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

        // 3. Persist to Database
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
                notes: payload.notes || '',
                safari_total_zar: safariTotalZAR,
                estimated_gate_fees_zar: estimatedGateFeesZAR,
                deposit_zar: depositZAR,
                balance_zar: balanceZAR,
                status: 'pending',
            },
        ]);

        if (dbError) {
            console.error('Database Insertion Error:', dbError);
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