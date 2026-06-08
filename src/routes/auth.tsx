import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Admin Login — Aura Web Studio" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setLoading(false);
      if (error) return toast.error(error.message);
      toast.success("Account creato. Ora puoi accedere.");
      setMode("signin");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    navigate({ to: "/admin" });
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link to="/" className="font-display text-lg font-bold tracking-tight text-white">
          AURA<span className="text-primary">.</span>
        </Link>
        <h1 className="font-display text-3xl font-bold tracking-tight mt-8 mb-2">
          {mode === "signin" ? "Admin Access" : "Crea account admin"}
        </h1>
        <p className="text-white/50 text-sm mb-8 font-mono-spec uppercase tracking-widest text-[10px]">
          // Aura Web Studio dashboard
        </p>
        <form onSubmit={submit} className="glass rounded-2xl p-6 space-y-5">
          <div>
            <label className="font-mono-spec text-[10px] uppercase tracking-widest text-white/40 block mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-white/15 py-2 text-white outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="font-mono-spec text-[10px] uppercase tracking-widest text-white/40 block mb-2">Password</label>
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
            {loading ? "…" : mode === "signin" ? "Entra" : "Registrati"}
          </button>
          <button
            type="button"
            onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
            className="w-full text-center text-xs text-white/40 hover:text-white/70 transition-colors font-mono-spec uppercase tracking-widest"
          >
            {mode === "signin" ? "Crea un account" : "Hai già un account? Accedi"}
          </button>
        </form>
        <p className="mt-6 text-[11px] text-white/30 text-center font-mono-spec">
          Solo utenti con ruolo admin possono vedere i messaggi.
        </p>
      </div>
    </main>
  );
}