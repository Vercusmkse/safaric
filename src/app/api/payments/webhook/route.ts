import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY);

const DROPOFF_REGEX = /Drop-off:\s*([^|]+)/i;
const ROUTE_REGEX = /Route:\s*([^|]+)/i;

interface PaystackChargeData {
    reference: string;
    amount: number;
    customer?: { email?: string };
    metadata?: { reference_number?: string };
}

interface BookingRecord {
    id_number?: string;
    id_type?: string;
    adults?: number;
    children?: number;
    email?: string;
    full_name?: string;
    package_title?: string;
    package_id?: string;
    date?: string;
    safari_date?: string;
    pickup_point?: string;
    notes?: string;
    total_cost_zar?: number;
}

function verifyPaystackSignature(body: string, signature: string | null): boolean {
    const secret = process.env.PAYSTACK_SECRET_KEY || '';
    const hash = crypto.createHmac('sha512', secret).update(body).digest('hex');
    return hash === signature;
}

function extractLogisticsFromNotes(notes: string = '') {
    const dropoffMatch = DROPOFF_REGEX.exec(notes);
    const routeMatch = ROUTE_REGEX.exec(notes);

    return {
        dropoffLocation: dropoffMatch ? dropoffMatch[1].trim() : 'Same as Pickup Location',
        safariRoute: routeMatch ? routeMatch[1].trim() : 'Phabeni Gate & Central Kruger (Skukuza Loop)',
    };
}

function buildReceiptHtml(
    booking: BookingRecord,
    data: PaystackChargeData,
    referenceNumber: string,
    amountPaidZAR: string
): string {
    const adults = Number(booking.adults) || 1;
    const children = Number(booking.children) || 0;
    const totalParty = adults + children;
    const guestName = booking.full_name || 'Explorer';
    const tourPackage = booking.package_title || booking.package_id || 'Kruger Safari Experience';
    const safariDate = booking.date || booking.safari_date || 'Confirmed Date';
    const pickupLocation = booking.pickup_point || 'Hazyview Lodge / Hotel';
    const { dropoffLocation, safariRoute } = extractLogisticsFromNotes(booking.notes);

    const totalCost = Number(booking.total_cost_zar) || Number(amountPaidZAR) * 5;
    const balanceDue = Math.max(0, totalCost - Number(amountPaidZAR));
    const vatPortion = ((totalCost * 0.15) / 1.15).toFixed(2);

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Safari Confirmation Receipt</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f6f5f3; margin: 0; padding: 24px; color: #1c1917;">
  <div style="max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e7e5e4; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    
    <div style="background-color: #1C3322; padding: 28px; text-align: left; color: #ffffff;">
      <span style="color: #C2933D; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 6px;">
        Official Booking Voucher &amp; Tax Receipt
      </span>
      <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.5px;">SAFARIC</h1>
      <p style="margin: 4px 0 0 0; font-size: 12px; color: #d6d3d1;">Kruger National Park Guided Safaris • South African Tourism Act Accredited</p>
    </div>

    <div style="background-color: #ecfdf5; border-bottom: 1px solid #a7f3d0; padding: 16px 28px;">
      <p style="margin: 0; color: #065f46; font-size: 14px; font-weight: bold;">
        ✓ 20% Commitment Deposit Confirmed
      </p>
      <p style="margin: 4px 0 0 0; color: #047857; font-size: 12px;">
        Payment authorized via Paystack (Ref: ${data.reference}). Your private guide and open safari vehicle are secured for <strong>${guestName}</strong>.
      </p>
    </div>

    <div style="padding: 28px;">
      <div style="background-color: #F7F4EC; border: 1px solid #C2933D40; border-radius: 12px; padding: 14px 18px; margin-bottom: 24px;">
        <span style="color: #1C3322; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 6px;">
          ✦ Complimentary Bush Inclusions (Free of Charge)
        </span>
        <table style="width: 100%; font-size: 11px; color: #44403c;">
          <tr>
            <td style="padding: 3px 0;">✓ Game-spotting binoculars per seat</td>
            <td style="padding: 3px 0;">✓ Chilled bottled spring water</td>
          </tr>
          <tr>
            <td style="padding: 3px 0;">✓ Fleece blankets &amp; wind-ponchos</td>
            <td style="padding: 3px 0;">✓ SANParks gate permit clearance</td>
          </tr>
        </table>
      </div>

      <h2 style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: #78716c; letter-spacing: 1px; margin-bottom: 10px;">
        Safari Trip Manifest &amp; Routing
      </h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 24px; background-color: #fafaf9; border-radius: 8px; border: 1px solid #f5f5f4;">
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #f0eeeb; color: #78716c;">Experience:</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #f0eeeb; font-weight: bold; color: #1c1917;">${tourPackage}</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #f0eeeb; color: #78716c;">Safari Date:</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #f0eeeb; font-weight: bold; color: #1c1917;">${safariDate}</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #f0eeeb; color: #78716c;">Registered Party:</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #f0eeeb; font-weight: bold; color: #1C3322;">
            ${totalParty} Explorer${totalParty > 1 ? 's' : ''} (${adults} Adults${children > 0 ? `, ${children} Children` : ''})
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #f0eeeb; color: #78716c;">Route &amp; Entrance:</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #f0eeeb; font-weight: bold; color: #1c1917;">${safariRoute}</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #f0eeeb; color: #78716c;">Pickup Location:</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #f0eeeb; color: #1c1917;">${pickupLocation}</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #f0eeeb; color: #78716c;">Drop-off Location:</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #f0eeeb; color: #1c1917;">${dropoffLocation}</td>
        </tr>
        <tr>
          <td style="padding: 10px 14px; color: #78716c;">Gate Permit ID:</td>
          <td style="padding: 10px 14px; font-family: monospace; color: #1c1917;">${booking.id_number || 'On File'} (${booking.id_type === 'sa_id' ? 'SA ID' : 'Passport'})</td>
        </tr>
      </table>

      <h2 style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: #78716c; letter-spacing: 1px; margin-bottom: 10px;">
        Payment Breakdown &amp; VAT Statement
      </h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
        <tr>
          <td style="padding: 6px 0; color: #57534e;">Total Safari Cost (${totalParty} Explorers):</td>
          <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #1c1917;">R ${totalCost.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #78716c; font-size: 11px;">Includes 15% South African VAT:</td>
          <td style="padding: 6px 0; text-align: right; color: #78716c; font-size: 11px;">R ${vatPortion}</td>
        </tr>
        <tr style="background-color: #ecfdf5; border-radius: 6px;">
          <td style="padding: 10px 12px; color: #065f46; font-weight: bold;">20% Deposit Paid (Paystack):</td>
          <td style="padding: 10px 12px; text-align: right; color: #065f46; font-weight: bold;">- R ${Number(amountPaidZAR).toLocaleString('en-ZA', { minimumFractionDigits: 2 })} [PAID]</td>
        </tr>
        <tr style="border-top: 1px solid #e7e5e4;">
          <td style="padding: 12px 0 4px 0; color: #1C3322; font-weight: bold; font-size: 15px;">Balance Due on Arrival:</td>
          <td style="padding: 12px 0 4px 0; text-align: right; color: #1C3322; font-weight: 900; font-size: 16px;">R ${balanceDue.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
        </tr>
      </table>
      <p style="font-size: 11px; color: #a8a29e; margin: 0 0 24px 0; font-style: italic;">
        *The remaining balance can be settled at vehicle dispatch on safari morning via card terminal or cash. Daily SANParks conservation entry fees remain payable directly at park gates.
      </p>

      <div style="background-color: #fafaf9; border: 1px solid #e7e5e4; border-radius: 12px; padding: 16px; text-align: center; font-size: 12px; color: #44403c;">
        <p style="margin: 0 0 6px 0; font-weight: bold;">Need pickup timing or gate changes?</p>
        <p style="margin: 0; color: #78716c;">
          WhatsApp Dispatch: <a href="https://wa.me/27836213226" style="color: #047857; text-decoration: none; font-weight: bold;">+27 83 621 3226</a> &nbsp;|&nbsp; 
          Email: <a href="mailto:reservations@safarictours.com" style="color: #C2933D; text-decoration: none; font-weight: bold;">reservations@safarictours.com</a>
        </p>
      </div>
    </div>

    <div style="background-color: #f5f5f4; border-top: 1px solid #e7e5e4; padding: 16px 28px; text-align: center; font-size: 11px; color: #a8a29e;">
      Booking Reference: <strong>${referenceNumber}</strong> • Safaric Tours, Hazyview / Kruger National Park, South Africa
    </div>
  </div>
</body>
</html>`;
}

async function dispatchReceiptEmail(
    booking: BookingRecord,
    data: PaystackChargeData,
    referenceNumber: string,
    amountPaidZAR: string
) {
    if (!process.env.RESEND_API_KEY) return;
    const guestEmail = booking.email || data.customer?.email;
    if (!guestEmail) return;

    try {
        await resend.emails.send({
            from: 'Safaric Reservations <reservations@safarictours.com>',
            to: [guestEmail],
            replyTo: 'reservations@safarictours.com',
            subject: `Confirmed Safari Voucher & VAT Receipt [${referenceNumber}] - SAFARIC`,
            html: buildReceiptHtml(booking, data, referenceNumber, amountPaidZAR),
        });
    } catch (emailError) {
        console.error('Failed to dispatch transactional receipt email:', emailError);
    }
}

async function processChargeSuccess(data: PaystackChargeData) {
    const referenceNumber = data.metadata?.reference_number || data.reference;
    const amountPaidZAR = (data.amount / 100).toFixed(2);

    const { data: booking, error: fetchError } = await supabaseAdmin
        .from('bookings')
        .select('*')
        .eq('reference_number', referenceNumber)
        .single();

    if (fetchError || !booking) {
        console.error('Booking not found in Supabase:', fetchError);
        return;
    }

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

    await dispatchReceiptEmail(booking, data, referenceNumber, amountPaidZAR);
}

export async function POST(req: NextRequest) {
    try {
        const bodyText = await req.text();
        const signature = req.headers.get('x-paystack-signature');

        if (!verifyPaystackSignature(bodyText, signature)) {
            return NextResponse.json({ error: 'Invalid webhook signature.' }, { status: 401 });
        }

        const event = JSON.parse(bodyText);

        if (event.event === 'charge.success') {
            await processChargeSuccess(event.data);
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Internal server error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}