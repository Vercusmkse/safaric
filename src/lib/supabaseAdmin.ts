import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    'https://xwcklxyzxpfgmgtjpqfn.supabase.co';

const supabaseServiceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3Y2tseHl6eHBmZ21ndGpwcWZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDg2MjAzNywiZXhwIjoyMTA2NDM4MDM3fQ._MyY02DApW5G3OxKsV1X8l4b2cHvPc9c4jvTuf3TY4I';

export const supabaseAdmin: SupabaseClient = createClient(
    supabaseUrl,
    supabaseServiceKey,
    {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    }
);