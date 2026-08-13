"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type ContactMessage = {
  kind: "message";
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

type PlanRequest = {
  kind: "quote";
  id: string;
  plan: string;
  full_name: string;
  phone: string;
  contact_email: string;
  message: string;
  requested_price: number | null;
  created_at: string;
};

type Entry = ContactMessage | PlanRequest;

type Filter = "all" | "message" | "quote";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data: sess } = await supabase.auth.getSession();
        if (!sess.session) {
          router.push("/auth");
          return;
        }
        const uid = sess.session.user.id;
        setUserId(uid);
        setUserEmail(sess.session.user.email ?? null);
        const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", uid);
        const admin = !!roles?.some((r) => r.role === "admin");
        setIsAdmin(admin);
        if (admin) {
          const [messagesRes, quotesRes] = await Promise.all([
            supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
            supabase.from("plan_requests").select("*").order("created_at", { ascending: false }),
          ]);
          if (messagesRes.error) toast.error(messagesRes.error.message);
          if (quotesRes.error) toast.error(quotesRes.error.message);

          const messages: ContactMessage[] = (messagesRes.data ?? []).map((m) => ({
            kind: "message",
            ...m,
          }));
          const quotes: PlanRequest[] = (quotesRes.data ?? []).map((q) => ({
            kind: "quote",
            ...q,
          }));
          setEntries(
            [...messages, ...quotes].sort(
              (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
            ),
          );
        }
      } catch {
        setLoadError("Impossibile contattare il server. Riprova più tardi.");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  const deleteEntry = async (entry: Entry) => {
    try {
      const table = entry.kind === "message" ? "contact_messages" : "plan_requests";
      const { error } = await supabase.from(table).delete().eq("id", entry.id);
      if (error) return toast.error(error.message);
      setEntries((list) => list.filter((e) => e.id !== entry.id));
      toast.success(entry.kind === "message" ? "Messaggio eliminato" : "Richiesta eliminata");
    } catch {
      toast.error("Impossibile contattare il server. Riprova più tardi.");
    }
  };

  const messageCount = entries.filter((e) => e.kind === "message").length;
  const quoteCount = entries.filter((e) => e.kind === "quote").length;
  const visible = useMemo(
    () => (filter === "all" ? entries : entries.filter((e) => e.kind === filter)),
    [entries, filter],
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="font-mono-spec text-xs uppercase tracking-widest text-white/40">
          Caricamento…
        </p>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-4">
          <h1 className="font-display text-2xl font-bold">Connessione non riuscita</h1>
          <p className="text-white/60 text-sm">{loadError}</p>
          <Link
            href="/auth"
            className="inline-block text-xs text-white/40 hover:text-white underline font-mono-spec uppercase tracking-widest"
          >
            Torna al login
          </Link>
        </div>
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
          <p className="text-white/40 text-xs font-mono-spec break-all">UID: {userId}</p>
          <p className="text-white/50 text-sm">Per assegnare admin, esegui in DB:</p>
          <pre className="text-left text-[11px] bg-neutral-950 border border-white/10 rounded-lg p-3 overflow-x-auto font-mono-spec">
            {`INSERT INTO user_roles (user_id, role)\nVALUES ('${userId}', 'admin');`}
          </pre>
          <button
            onClick={signOut}
            className="text-xs text-white/40 hover:text-white underline font-mono-spec uppercase tracking-widest"
          >
            Esci
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 md:px-12 py-10">
      <header className="flex items-center justify-between mb-10 max-w-6xl mx-auto">
        <Link href="/" className="font-display text-lg font-bold tracking-tight text-white">
          AURA<span className="text-primary">.</span>
          <span className="text-white/40 text-xs ml-2 font-mono-spec uppercase tracking-widest">
            / admin
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-xs text-white/40 font-mono-spec">{userEmail}</span>
          <button
            onClick={signOut}
            className="text-xs text-white/50 hover:text-white font-mono-spec uppercase tracking-widest"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-8">
          <div>
            <p className="font-mono-spec text-[10px] uppercase tracking-[0.3em] text-primary mb-2">
              Inbox
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tighter">
              Richieste ricevute
            </h1>
          </div>
          <div className="flex gap-6 font-mono-spec text-xs text-white/40">
            <span>
              <span className="text-white">{messageCount}</span> messaggi
            </span>
            <span>
              <span className="text-white">{quoteCount}</span> preventivi
            </span>
          </div>
        </div>

        {/* Type filter */}
        <div className="flex gap-2 mb-8">
          {(
            [
              { key: "all", label: "Tutte" },
              { key: "message", label: "Messaggi" },
              { key: "quote", label: "Preventivi" },
            ] as { key: Filter; label: string }[]
          ).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-2 font-mono-spec text-[11px] uppercase tracking-widest border transition-colors ${
                filter === f.key
                  ? "border-primary/50 bg-primary/10 text-white"
                  : "border-white/10 text-white/50 hover:text-white hover:border-white/30"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="bg-neutral-950 border border-white/10 rounded-2xl p-12 text-center text-white/50">
            Nessuna richiesta da mostrare.
          </div>
        ) : (
          <div className="space-y-4">
            {visible.map((entry) => (
              <article
                key={entry.id}
                className="bg-neutral-950 border border-white/10 rounded-2xl p-6 space-y-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono-spec text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                          entry.kind === "quote"
                            ? "border-primary/40 text-primary bg-primary/10"
                            : "border-white/15 text-white/50"
                        }`}
                      >
                        {entry.kind === "quote" ? `Preventivo · ${entry.plan}` : "Messaggio"}
                      </span>
                    </div>
                    <h2 className="font-display text-xl font-semibold">
                      {entry.kind === "quote" ? entry.full_name : entry.name}
                    </h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                      <a
                        href={`mailto:${entry.kind === "quote" ? entry.contact_email : entry.email}`}
                        className="text-primary hover:underline break-all"
                      >
                        {entry.kind === "quote" ? entry.contact_email : entry.email}
                      </a>
                      {entry.kind === "quote" && (
                        <a
                          href={`tel:${entry.phone.replace(/\s/g, "")}`}
                          className="text-white/60 hover:text-white"
                        >
                          {entry.phone}
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {entry.kind === "quote" && (
                      <span className="font-mono-spec text-xs text-white/50">
                        {entry.requested_price != null
                          ? `Budget proposto: €${entry.requested_price}`
                          : "Prezzo di listino"}
                      </span>
                    )}
                    <time className="font-mono-spec text-[10px] uppercase tracking-widest text-white/40 whitespace-nowrap">
                      {formatDate(entry.created_at)}
                    </time>
                    <button
                      onClick={() => deleteEntry(entry)}
                      className="text-[10px] uppercase tracking-widest font-mono-spec text-white/40 hover:text-destructive transition-colors"
                    >
                      Elimina
                    </button>
                  </div>
                </div>
                <p className="text-white/80 whitespace-pre-wrap leading-relaxed">{entry.message}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
