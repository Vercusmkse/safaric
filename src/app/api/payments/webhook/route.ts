import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const bodyText = await req.text();
        const signature = req.headers.get('x-paystack-signature');
        const secret = process.env.PAYSTACK_SECRET_KEY || '';

        // 1. Verify cryptographic HMAC signature
        const hash = crypto.createHmac('sha512', secret).update(bodyText).digest('hex');
        if (hash !== signature) {
            return NextResponse.json({ error: 'Invalid webhook signature.' }, { status: 401 });
        }

        const event = JSON.parse(bodyText);

        // 2. Handle successful charge event
        if (event.event === 'charge.success') {
            const data = event.data;
            const referenceNumber = data.metadata?.reference_number;
            const amountPaidZAR = (data.amount / 100).toFixed(2);

            if (referenceNumber) {
                await supabaseAdmin
                    .from('bookings')
                    .update({
                        payment_status: 'deposit_paid',
                        status: 'confirmed',
                        payment_reference: data.reference,
                        amount_paid_zar: amountPaidZAR,
                        paid_at: new Date().toISOString(),
                    })
                    .eq('reference_number', referenceNumber);
            }
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Internal server error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}