import { createClient } from "@supabase/supabase-js";

import type { Database } from "./types";

/**
 * The browser Supabase client.
 *
 * Everything this app does with Supabase runs here, in the browser, against
 * row-level security: the contact form inserts, the plan-request inserts, and
 * the admin screen's reads. There is no server client and no service-role key
 * anywhere in this repo — the database's own policies are the authorization,
 * not a trusted server tier.
 *
 * Both variables are NEXT_PUBLIC_ because both are genuinely public: the URL
 * is the project's address and the publishable key is the anon key, which is
 * designed to ship to browsers and is useless without a policy that admits it.
 *
 * They used to be read through `import.meta.env` with a `process.env` fallback
 * for SSR — a Vite-ism with no meaning here. Next inlines NEXT_PUBLIC_ values
 * at build time on both sides of the render, so one name works everywhere.
 */
function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    const missing = [
      ...(!url ? ["NEXT_PUBLIC_SUPABASE_URL"] : []),
      ...(!key ? ["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"] : []),
    ];
    throw new Error(
      `Missing Supabase environment variable(s): ${missing.join(", ")}. ` +
        `Set them in .env.local for development and in the host's environment for deploys.`,
    );
  }

  return createClient<Database>(url, key, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

let client: ReturnType<typeof createSupabaseClient> | undefined;

/**
 * Constructed on first property access, not at import time.
 *
 * The admin and auth screens import this module, and Next evaluates their
 * module graph during the build to prerender the shell. Building the client
 * eagerly would throw there — at build time, on a machine that legitimately
 * has no Supabase credentials — and fail the whole build over a page that
 * only ever talks to Supabase in the browser. Deferring it means the throw
 * happens where it is actionable: in front of someone actually using the page.
 */
export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_target, prop, receiver) {
    client ??= createSupabaseClient();
    return Reflect.get(client, prop, receiver);
  },
});
