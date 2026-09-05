import { NextResponse } from 'next/server';
import { BookingFormData, BookingResponse } from '@/types/safari';
import { SAFARI_PACKAGES } from '@/data/packages';
import { computeTotalZAR } from '@/lib/currency';

export async function POST(request: Request) {
    try {
        const payload: BookingFormData = await request.json();

        // Data Sanitization and Validation
        if (!payload.fullName || !payload.email || !payload.date || !payload.packageId) {
            return NextResponse.json<BookingResponse>(
                {
                    success: false,
                    referenceNumber: '',
                    totalZAR: 0,
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
                    message: 'Specified safari package is invalid.',
                },
                { status: 404 }
            );
        }

        const totalZAR = computeTotalZAR({
            basePriceZAR: pkg.basePriceZAR,
            isVehicleRate: pkg.isVehicleRate,
            adults: Number(payload.adults) || 1,
            children: Number(payload.children) || 0,
            includeBreakfast: Boolean(payload.includeBreakfast),
            includeLensRental: Boolean(payload.includeLensRental),
        });

        const referenceNumber = `SAF-${Math.floor(100000 + Math.random() * 900000)}`;

        // Ready for Supabase, PostgreSQL, or transactional email (e.g. Resend) dispatch here
        return NextResponse.json<BookingResponse>(
            {
                success: true,
                referenceNumber,
                totalZAR,
                message: 'Safari request successfully registered.',
                data: payload,
            },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json<BookingResponse>(
            {
                success: false,
                referenceNumber: '',
                totalZAR: 0,
                message: 'Failed to process booking request due to server fault.',
            },
            { status: 500 }
        );
    }
}