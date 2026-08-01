import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Nav } from "@/components/aura/Nav";
import { Footer } from "@/components/aura/Contact";
import { pageSeo, SITE_CONFIG } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () =>
    pageSeo({
      title: "Privacy e Cookie Policy",
      path: "/privacy",
      description:
        "Informativa sulla privacy e sui cookie di Aura Web Studio, ai sensi del Regolamento UE 2016/679 (GDPR).",
    }),
  component: PrivacyPage,
});

const LAST_UPDATED = "29 luglio 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight text-white mb-4">
        {title}
      </h2>
      <div className="space-y-4 text-white/70 text-sm md:text-base font-light leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white relative">
      <Nav />
      <div className="absolute inset-0 noise-bg opacity-20 pointer-events-none" />

      <div className="relative max-w-3xl mx-auto w-full px-6 md:px-0 pt-32 pb-24">
        <div className="mb-12">
          <a
            href="/"
            className="inline-flex items-center gap-2 font-mono-spec text-[10px] uppercase tracking-[0.25em] text-white/50 hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3 w-3" /> Torna alla Home
          </a>
        </div>

        <div className="mb-14">
          <p className="font-mono-spec text-[10px] uppercase tracking-[0.3em] text-primary mb-6">
            // Privacy & Cookie
          </p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-4">
            Privacy e Cookie Policy
          </h1>
          <p className="text-white/50 text-sm font-light">Ultimo aggiornamento: {LAST_UPDATED}</p>
        </div>

        <Section title="1. Titolare del trattamento">
          <p>
            Il Titolare del trattamento dei dati raccolti tramite questo sito è{" "}
            <strong className="text-white">{SITE_CONFIG.company}</strong>, con sede in{" "}
            {SITE_CONFIG.location.street}, {SITE_CONFIG.location.city} (
            {SITE_CONFIG.location.region}
            ), Italia — P.IVA 03353150216.
          </p>
          <p>
            Per qualsiasi richiesta relativa al trattamento dei tuoi dati personali, puoi
            contattarci all'indirizzo{" "}
            <a href={`mailto:${SITE_CONFIG.companyEmail}`} className="text-primary hover:underline">
              {SITE_CONFIG.companyEmail}
            </a>
            .
          </p>
        </Section>

        <Section title="2. Quali dati raccogliamo">
          <p>
            Raccogliamo dati personali esclusivamente quando li fornisci volontariamente tramite:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-white">Modulo contatti in home page</strong>: nome, indirizzo
              email o PEC, e il contenuto del messaggio inviato.
            </li>
            <li>
              <strong className="text-white">Modulo "Richiedi un preventivo"</strong> nella pagina
              Prezzi: nome e cognome, numero di telefono, email o PEC, descrizione della richiesta
              e, facoltativamente, un budget indicativo.
            </li>
          </ul>
          <p>
            Non raccogliamo dati particolari (art. 9 GDPR — es. dati sanitari, religiosi, politici)
            e non effettuiamo profilazione automatizzata dei visitatori.
          </p>
        </Section>

        <Section title="3. Perché li trattiamo">
          <p>Utilizziamo i dati che ci fornisci esclusivamente per:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>rispondere alle tue richieste di informazioni o preventivo;</li>
            <li>predisporre proposte commerciali e gestire la relazione precontrattuale;</li>
            <li>dare seguito a un eventuale incarico professionale, se conferito.</li>
          </ul>
          <p>
            La base giuridica del trattamento è l'art. 6, par. 1, lett. b) del GDPR (misure
            precontrattuali su tua richiesta) e, ove applicabile, il tuo consenso esplicito
            all'invio del messaggio.
          </p>
        </Section>

        <Section title="4. Come e dove conserviamo i dati">
          <p>
            I dati vengono conservati elettronicamente tramite Supabase, il nostro fornitore di
            infrastruttura ed hosting, che agisce in qualità di responsabile del trattamento ai
            sensi dell'art. 28 GDPR. L'accesso ai dati è riservato esclusivamente al personale
            autorizzato di {SITE_CONFIG.company}, tramite un'area riservata protetta da
            autenticazione.
          </p>
          <p>
            Conserviamo i dati per il tempo necessario a gestire la tua richiesta e, in caso di
            avvio di un rapporto professionale, per la durata dello stesso e per il periodo
            successivo richiesto dagli obblighi di legge (es. fiscali, contabili). In assenza di
            ulteriori contatti o conferimento di incarico, i dati vengono cancellati entro 24 mesi
            dalla ricezione.
          </p>
        </Section>

        <Section title="5. Con chi condividiamo i dati">
          <p>
            Non vendiamo né condividiamo i tuoi dati con terze parti per finalità di marketing. I
            dati possono essere accessibili al nostro fornitore di hosting/infrastruttura (Supabase)
            nella sua qualità di responsabile del trattamento, unicamente per l'erogazione del
            servizio tecnico.
          </p>
        </Section>

        <Section title="6. I tuoi diritti">
          <p>
            In qualsiasi momento puoi esercitare, contattandoci all'indirizzo sopra indicato, i
            diritti previsti dagli artt. 15-22 del GDPR:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>accesso ai tuoi dati personali;</li>
            <li>rettifica di dati inesatti o incompleti;</li>
            <li>cancellazione ("diritto all'oblio"), nei limiti previsti dalla legge;</li>
            <li>limitazione del trattamento;</li>
            <li>portabilità dei dati;</li>
            <li>opposizione al trattamento.</li>
          </ul>
          <p>
            Hai inoltre il diritto di proporre reclamo all'Autorità Garante per la Protezione dei
            Dati Personali (
            <a
              href="https://www.garanteprivacy.it"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              www.garanteprivacy.it
            </a>
            ) qualora ritenga che il trattamento violi la normativa vigente.
          </p>
        </Section>

        <Section title="7. Cookie e tecnologie simili">
          <p>
            Questo sito{" "}
            <strong className="text-white">
              non utilizza cookie di profilazione o di marketing
            </strong>{" "}
            e non installa strumenti di analisi statistica di terze parti (es. Google Analytics).
            Non è quindi necessario alcun banner di raccolta del consenso per finalità
            pubblicitarie.
          </p>
          <p>
            Utilizziamo esclusivamente tecnologie di memorizzazione locale (cookie
            tecnici/localStorage), strettamente necessarie al funzionamento del sito:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-white">Preferenza di lingua</strong>: salvata nel tuo browser
              (localStorage) per ricordare la lingua scelta durante la navigazione.
            </li>
            <li>
              <strong className="text-white">Sessione di accesso riservato</strong>: un token
              tecnico utilizzato esclusivamente dal personale {SITE_CONFIG.company} per accedere
              all'area amministrativa protetta del sito; non riguarda i visitatori pubblici.
            </li>
          </ul>
          <p>
            Trattandosi di strumenti strettamente necessari all'erogazione del servizio richiesto
            (art. 122 Codice Privacy), il loro utilizzo non richiede consenso preventivo. Puoi in
            ogni momento cancellare questi dati dalle impostazioni del tuo browser.
          </p>
        </Section>

        <Section title="8. Minori">
          <p>
            Il sito non è rivolto a minori di 16 anni e non raccogliamo consapevolmente dati
            relativi a minori.
          </p>
        </Section>

        <Section title="9. Modifiche alla presente informativa">
          <p>
            Questa informativa può essere aggiornata nel tempo per riflettere modifiche normative o
            del sito. La data dell'ultimo aggiornamento è indicata in cima alla pagina.
          </p>
        </Section>
      </div>

      <Footer />
    </main>
  );
}
