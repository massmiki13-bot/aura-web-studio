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

/**
 * Which requests have already been dealt with.
 *
 * Kept in this browser rather than in the database, deliberately: adding a
 * `handled_at` column would be the better home for it, but it would also mean
 * the inbox stops working against a database that has not had the migration
 * run — and the point of this screen is to be the thing that still works. It
 * is marked as per-device in the UI so nobody mistakes it for shared state.
 */
const HANDLED_KEY = "aura:admin:handled";

function loadHandled(): Set<string> {
  try {
    const raw = localStorage.getItem(HANDLED_KEY);
    return new Set<string>(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set<string>();
  }
}

function saveHandled(ids: Set<string>) {
  try {
    localStorage.setItem(HANDLED_KEY, JSON.stringify([...ids]));
  } catch {
    // A browser with storage blocked simply forgets between visits.
  }
}

/** Day buckets, so a long inbox reads as a timeline rather than a wall. */
function bucketOf(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const t = d.getTime();
  if (t >= startOfToday) return "Oggi";
  if (t >= startOfToday - 86_400_000) return "Ieri";
  if (t >= startOfToday - 7 * 86_400_000) return "Ultimi 7 giorni";
  if (t >= startOfToday - 30 * 86_400_000) return "Ultimi 30 giorni";
  return "Più vecchie";
}

const BUCKET_ORDER = ["Oggi", "Ieri", "Ultimi 7 giorni", "Ultimi 30 giorni", "Più vecchie"];

function nameOf(e: Entry) {
  return e.kind === "quote" ? e.full_name : e.name;
}
function emailOf(e: Entry) {
  return e.kind === "quote" ? e.contact_email : e.email;
}

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
  const [query, setQuery] = useState("");
  /**
   * Read straight out of storage on the first render rather than through an
   * effect. Nothing of this screen is server-rendered — the list only appears
   * once the session check has resolved, which happens client-side — so there
   * is no server pass for a lazy initialiser to disagree with.
   */
  const [handled, setHandled] = useState<Set<string>>(() =>
    typeof window === "undefined" ? new Set<string>() : loadHandled(),
  );
  const [showHandled, setShowHandled] = useState(false);

  const toggleHandled = (id: string) => {
    setHandled((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveHandled(next);
      return next;
    });
  };

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
  const pending = entries.filter((e) => !handled.has(e.id)).length;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((e) => {
      if (filter !== "all" && e.kind !== filter) return false;
      if (!showHandled && handled.has(e.id)) return false;
      if (!q) return true;
      return [nameOf(e), emailOf(e), e.message, e.kind === "quote" ? e.plan : ""]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [entries, filter, query, handled, showHandled]);

  /** The visible list, cut into day buckets and kept newest-first. */
  const groups = useMemo(() => {
    const map = new Map<string, Entry[]>();
    for (const e of visible) {
      const b = bucketOf(e.created_at);
      const list = map.get(b);
      if (list) list.push(e);
      else map.set(b, [e]);
    }
    return BUCKET_ORDER.filter((b) => map.has(b)).map((b) => [b, map.get(b)!] as const);
  }, [visible]);

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
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tighter">
              Richieste ricevute
            </h1>
          </div>
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 font-mono-spec text-xs text-white/40">
            <span className={pending > 0 ? "text-white" : undefined}>
              <span className="font-display text-2xl font-bold tracking-tighter">{pending}</span> da
              gestire
            </span>
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

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cerca nome, email, testo…"
              className="font-mono-spec w-56 rounded-full border border-white/10 bg-neutral-950 px-4 py-2 text-[11px] tracking-widest text-white placeholder:text-white/25 focus:border-white/30 focus:outline-none"
            />
            <button
              onClick={() => setShowHandled((v) => !v)}
              className={`font-mono-spec rounded-full border px-4 py-2 text-[11px] tracking-widest uppercase transition-colors ${
                showHandled
                  ? "border-white/40 text-white"
                  : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
              }`}
              title="Lo stato « gestita » è salvato su questo browser"
            >
              {showHandled ? "Nascondi gestite" : "Mostra gestite"}
            </button>
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-neutral-950 p-12 text-center text-white/50">
            {entries.length === 0
              ? "Nessuna richiesta ricevuta finora."
              : query.trim()
                ? "Nessun risultato per questa ricerca."
                : "Tutto gestito. Niente in sospeso."}
          </div>
        ) : (
          <div className="space-y-12">
            {groups.map(([bucket, items]) => (
              <section key={bucket}>
                <div className="mb-4 flex items-baseline gap-4">
                  <h2 className="font-mono-spec text-[10px] tracking-[0.3em] text-white/40 uppercase">
                    {bucket}
                  </h2>
                  <span className="h-px flex-1 bg-white/10" />
                  <span className="font-mono-spec text-[10px] text-white/25 tabular-nums">
                    {items.length}
                  </span>
                </div>

                <div className="space-y-4">
                  {items.map((entry) => {
                    const done = handled.has(entry.id);
                    const who = nameOf(entry);
                    const mail = emailOf(entry);
                    const reply = `mailto:${mail}?subject=${encodeURIComponent(
                      entry.kind === "quote"
                        ? `Re: richiesta piano ${entry.plan} — Aura Web Studio`
                        : "Re: la tua richiesta — Aura Web Studio",
                    )}&body=${encodeURIComponent(`Ciao ${who},

`)}`;

                    return (
                      <article
                        key={entry.id}
                        className={`space-y-4 rounded-2xl border bg-neutral-950 p-6 transition-opacity ${
                          done ? "border-white/5 opacity-45" : "border-white/10"
                        }`}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`font-mono-spec rounded-full border px-2 py-0.5 text-[9px] tracking-widest uppercase ${
                                  entry.kind === "quote"
                                    ? "border-primary/40 bg-primary/10 text-primary"
                                    : "border-white/15 text-white/50"
                                }`}
                              >
                                {entry.kind === "quote"
                                  ? `Preventivo · ${entry.plan}`
                                  : "Messaggio"}
                              </span>
                              {done && (
                                <span className="font-mono-spec rounded-full border border-white/15 px-2 py-0.5 text-[9px] tracking-widest text-white/40 uppercase">
                                  Gestita
                                </span>
                              )}
                            </div>
                            <h3 className="font-display text-xl font-semibold">{who}</h3>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                              <a
                                href={`mailto:${mail}`}
                                className="text-primary break-all hover:underline"
                              >
                                {mail}
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

                          <div className="flex flex-col items-end gap-2">
                            <time className="font-mono-spec text-[10px] tracking-widest whitespace-nowrap text-white/40 uppercase">
                              {formatDate(entry.created_at)}
                            </time>
                            {entry.kind === "quote" && (
                              <span className="font-mono-spec text-xs text-white/50">
                                {entry.requested_price != null
                                  ? `Budget proposto: €${entry.requested_price}`
                                  : "Prezzo di listino"}
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="leading-relaxed whitespace-pre-wrap text-white/80">
                          {entry.message}
                        </p>

                        {/* Actions last: the request is what matters, what to
                            do about it comes after reading it. */}
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-4">
                          <a
                            href={reply}
                            className="font-mono-spec text-[10px] tracking-widest text-white uppercase underline underline-offset-4 hover:text-white/70"
                          >
                            Rispondi
                          </a>
                          <button
                            onClick={() => toggleHandled(entry.id)}
                            className="font-mono-spec text-[10px] tracking-widest text-white/50 uppercase transition-colors hover:text-white"
                          >
                            {done ? "Segna da gestire" : "Segna gestita"}
                          </button>
                          <button
                            onClick={() => deleteEntry(entry)}
                            className="font-mono-spec text-destructive/70 hover:text-destructive ml-auto text-[10px] tracking-widest uppercase transition-colors"
                          >
                            Elimina
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
