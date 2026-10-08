import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { referenceNumber } = await req.json();

        if (!referenceNumber) {
            return NextResponse.json({ error: 'Booking reference is required.' }, { status: 400 });
        }

        // 1. Fetch booking details from Supabase
        const { data: booking, error } = await supabaseAdmin
            .from('bookings')
            .select('*')
            .eq('reference_number', referenceNumber)
            .single();

        if (error || !booking) {
            return NextResponse.json({ error: 'Reservation not found.' }, { status: 404 });
        }

        // Paystack expects amount in cents (kobo/cents: R1.00 = 100 cents)
        const depositInCents = Math.round(Number(booking.deposit_zar) * 100);

        // 2. Initialize Paystack transaction
        const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: booking.email,
                amount: depositInCents,
                currency: 'ZAR',
                reference: `${booking.reference_number}_DEP_${Date.now()}`,
                callback_url: `${req.nextUrl.origin}/booking-confirmed?ref=${booking.reference_number}`,
                metadata: {
                    booking_id: booking.id,
                    reference_number: booking.reference_number,
                    guest_name: booking.full_name,
                    tour_package: booking.package_title,
                },
            }),
        });

        const paystackData = await paystackRes.json();

        if (!paystackData.status) {
            return NextResponse.json(
                { error: paystackData.message || 'Payment initialization failed.' },
                { status: 502 }
            );
        }

        return NextResponse.json({
            authorizationUrl: paystackData.data.authorization_url,
            accessCode: paystackData.data.access_code,
            reference: paystackData.data.reference,
        });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Internal Server Error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}