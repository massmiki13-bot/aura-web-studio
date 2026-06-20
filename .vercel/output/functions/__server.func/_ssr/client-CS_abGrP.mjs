import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
function createSupabaseClient() {
  const SUPABASE_URL = "https://ioedorpuykjkpudbotby.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_xNSb4bMQt_O-HxTy9ldMAg_t06-YZOm";
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : void 0,
      persistSession: true,
      autoRefreshToken: true
    }
  });
}
let _supabase;
const supabase = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  }
});
export {
  supabase as s
};
