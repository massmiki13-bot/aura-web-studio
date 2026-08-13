"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (data.session) router.push("/admin");
      })
      .catch(() => {
        // Supabase not reachable/configured — stay on the login form rather
        // than crashing the whole route.
      });
  }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return toast.error(error.message);
      router.push("/admin");
    } catch {
      toast.error("Impossibile contattare il server. Riprova più tardi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link href="/" className="font-display text-lg font-bold tracking-tight text-white">
          AURA<span className="text-primary">.</span>
        </Link>
        <h1 className="font-display text-3xl font-bold tracking-tight mt-8 mb-2">Admin Access</h1>
        <p className="text-white/50 text-sm mb-8 font-mono-spec uppercase tracking-widest text-[10px]">
          Aura Web Studio dashboard
        </p>
        <form
          onSubmit={submit}
          className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-5"
        >
          <div>
            <label className="font-mono-spec text-[10px] uppercase tracking-widest text-white/40 block mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-white/15 py-2 text-white outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="font-mono-spec text-[10px] uppercase tracking-widest text-white/40 block mb-2">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-white/15 py-2 text-white outline-none focus:border-primary"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full py-3 font-mono-spec text-xs uppercase tracking-[0.3em] text-black disabled:opacity-50"
            style={{ background: "var(--gradient-aura)" }}
          >
            {loading ? "…" : "Entra"}
          </button>
        </form>
        <p className="mt-6 text-[11px] text-white/30 text-center font-mono-spec">
          Accesso riservato al team Aura.
        </p>
      </div>
    </main>
  );
}
