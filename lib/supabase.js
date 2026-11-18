import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabaseReady = Boolean(url && key);

// Placeholders keep the build from crashing if the settings are missing.
export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  key || "placeholder-key"
);
