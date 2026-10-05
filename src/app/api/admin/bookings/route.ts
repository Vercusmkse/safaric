import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get('x-admin-pin');
        const adminPin = process.env.ADMIN_ACCESS_PIN || '#123Vercus';

        if (authHeader !== adminPin) {
            return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        const search = searchParams.get('search');

        let query = supabaseAdmin
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false });

        if (status && status !== 'all') {
            query = query.eq('status', status);
        }

        if (search) {
            query = query.or(`full_name.ilike.%${search}%,reference_number.ilike.%${search}%,phone.ilike.%${search}%`);
        }

        const { data, error } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ bookings: data ?? [] });
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown internal error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}