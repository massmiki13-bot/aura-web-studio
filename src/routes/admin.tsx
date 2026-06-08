import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin · Messaggi — Aura Web Studio" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type Msg = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

function AdminPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        navigate({ to: "/auth" });
        return;
      }
      const uid = sess.session.user.id;
      setUserId(uid);
      setUserEmail(sess.session.user.email ?? null);
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid);
      const admin = !!roles?.some((r) => r.role === "admin");
      setIsAdmin(admin);
      if (admin) {
        const { data, error } = await supabase
          .from("contact_messages")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) toast.error(error.message);
        else setMessages(data ?? []);
      }
      setLoading(false);
    })();
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  const deleteMsg = async (id: string) => {
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setMessages((m) => m.filter((x) => x.id !== id));
    toast.success("Messaggio eliminato");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="font-mono-spec text-xs uppercase tracking-widest text-white/40">Loading…</p>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-4">
          <h1 className="font-display text-3xl font-bold">Accesso negato</h1>
          <p className="text-white/60 text-sm">
            L'account <span className="text-white">{userEmail}</span> non ha il ruolo admin.
          </p>
          <p className="text-white/40 text-xs font-mono-spec break-all">
            UID: {userId}
          </p>
          <p className="text-white/50 text-sm">
            Per assegnare admin, esegui in DB:
          </p>
          <pre className="text-left text-[11px] glass rounded-lg p-3 overflow-x-auto font-mono-spec">
{`INSERT INTO user_roles (user_id, role)
VALUES ('${userId}', 'admin');`}
          </pre>
          <button onClick={signOut} className="text-xs text-white/40 hover:text-white underline font-mono-spec uppercase tracking-widest">
            Esci
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 md:px-12 py-10">
      <header className="flex items-center justify-between mb-10 max-w-6xl mx-auto">
        <Link to="/" className="font-display text-lg font-bold tracking-tight text-white">
          AURA<span className="text-primary">.</span><span className="text-white/40 text-xs ml-2 font-mono-spec uppercase tracking-widest">/ admin</span>
        </Link>
        <button onClick={signOut} className="text-xs text-white/50 hover:text-white font-mono-spec uppercase tracking-widest">
          Logout
        </button>
      </header>

      <div className="max-w-6xl mx-auto">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <p className="font-mono-spec text-[10px] uppercase tracking-[0.3em] text-primary mb-2">// Inbox</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tighter">
              Messaggi dal sito
            </h1>
          </div>
          <span className="font-mono-spec text-xs text-white/40">
            {messages.length} {messages.length === 1 ? "messaggio" : "messaggi"}
          </span>
        </div>

        {messages.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center text-white/50">
            Nessun messaggio ancora.
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m) => (
              <article key={m.id} className="glass rounded-2xl p-6 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl font-semibold">{m.name}</h2>
                    <a href={`mailto:${m.email}`} className="text-sm text-primary hover:underline break-all">
                      {m.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-4">
                    <time className="font-mono-spec text-[10px] uppercase tracking-widest text-white/40">
                      {new Date(m.created_at).toLocaleString("it-IT")}
                    </time>
                    <button
                      onClick={() => deleteMsg(m.id)}
                      className="text-[10px] uppercase tracking-widest font-mono-spec text-white/40 hover:text-destructive transition-colors"
                    >
                      Elimina
                    </button>
                  </div>
                </div>
                <p className="text-white/80 whitespace-pre-wrap leading-relaxed">{m.message}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}