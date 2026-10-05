import { createClient, SupabaseClient } from '@supabase/supabase-js';

function getSanitizedUrl(): string {
    const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim().replace(/^["']|["']$/g, '');
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return 'https://xwcklxyzxpfgmgtjpqfn.supabase.co';
    }
    return url;
}

function getSanitizedKey(): string {
    const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim().replace(/^["']|["']$/g, '');
    return key || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3Y2tseHl6eHBmZ21ndGpwcWZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDg2MjAzNywiZXhwIjoyMTA2NDM4MDM3fQ._MyY02DApW5G3OxKsV1X8l4b2cHvPc9c4jvTuf3TY4I';
}

let cachedClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
    if (!cachedClient) {
        cachedClient = createClient(getSanitizedUrl(), getSanitizedKey(), {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            },
        });
    }
    return cachedClient;
}

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
    get(_target, prop: string | symbol) {
        const client = getSupabaseAdmin();
        const value = (client as unknown as Record<string | symbol, unknown>)[prop];
        return typeof value === 'function' ? value.bind(client) : value;
    },
});