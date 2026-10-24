import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Nav } from "@/components/aura/Nav";
import { Footer } from "@/components/aura/Contact";
import { SITE_CONFIG } from "@/lib/seo";
import { members } from "@/lib/team-members";

const LAST_UPDATED = "24 ottobre 2026";

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

export function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white relative">
      <Nav />
      <div className="absolute inset-0 noise-bg opacity-20 pointer-events-none" />

      <div className="relative max-w-3xl mx-auto w-full px-6 md:px-0 pt-32 pb-24">
        <div className="mb-12">
          <Link
            href="/"
            className="font-mono-spec -my-4 inline-flex cursor-pointer items-center gap-2 py-4 text-[10px] tracking-[0.25em] text-white/50 uppercase transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3 w-3" /> Torna alla Home
          </Link>
        </div>

        <div className="mb-14">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-4">
            Privacy e Cookie Policy
          </h1>
          <p className="text-white/50 text-sm font-light">Ultimo aggiornamento: {LAST_UPDATED}</p>
        </div>

        {/* Aura is a brand, not a legal entity: there is no single company and
            no single VAT number behind it. The page names the three
            professionals instead, each with their own number, because that is
            who actually receives and handles the data. */}
        <Section title="1. Chi tratta i tuoi dati">
          <p>
            <strong className="text-white">{SITE_CONFIG.company}</strong> è un marchio con cui si
            identificano tre liberi professionisti indipendenti. Non è una società, né
            un&apos;associazione professionale: non esiste un soggetto giuridico unico dietro questo
            sito, e ciascuno dei tre esercita la propria attività in modo autonomo, con la propria
            partita IVA e nel proprio esclusivo interesse.
          </p>
          <p>
            I dati che invii tramite questo sito sono trattati dai tre professionisti, ciascuno in
            qualità di titolare autonomo del trattamento per i dati che riceve e per il rapporto che
            ne nasce:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            {members.map((m) => (
              <li key={m.email}>
                <strong className="text-white">
                  {m.name} {m.surname}
                </strong>
                {m.vat ? ` — P.IVA ${m.vat}` : ""} —{" "}
                <a href={`mailto:${m.email}`} className="text-primary hover:underline">
                  {m.email}
                </a>
              </li>
            ))}
          </ul>
          <p>
            Ogni incarico ha un solo referente fra i tre, che lo contrattualizza e lo fattura con la
            propria partita IVA e che risponde in via esclusiva del trattamento dei dati relativi a
            quel rapporto. Operiamo da {SITE_CONFIG.location.city} ({SITE_CONFIG.location.region}),
            senza una sede aperta al pubblico.
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
          <p>
            Solo con il tuo consenso raccogliamo anche dati di navigazione in forma statistica,
            tramite gli strumenti descritti al punto 7.
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
          <p>
            Solo se presti il consenso tramite il banner cookie, i dati di navigazione descritti al
            punto 7 sono raccolti da Google Ireland Limited (Google Analytics e Google Ads). Google
            può trasferire tali dati negli Stati Uniti, dove è certificata ai sensi dell&apos;EU-US
            Data Privacy Framework.
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
            Questo sito non utilizza cookie di profilazione propri. Utilizza strumenti tecnici,
            sempre attivi, e strumenti di misurazione di terze parti, attivati{" "}
            <strong className="text-white">solo se li accetti</strong> tramite il banner che compare
            alla prima visita.
          </p>
          <p>
            <strong className="text-white">Strumenti tecnici</strong> (non richiedono consenso, art.
            122 Codice Privacy):
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-white">Preferenza di lingua</strong>: salvata nel tuo browser
              (localStorage) per ricordare la lingua scelta durante la navigazione.
            </li>
            <li>
              <strong className="text-white">Scelta sui cookie</strong> (aura-cookie-consent,
              localStorage): ricorda se hai accettato o rifiutato, per 6 mesi.
            </li>
            <li>
              <strong className="text-white">Sessione di accesso riservato</strong>: un token
              tecnico utilizzato esclusivamente dal personale {SITE_CONFIG.company} per accedere
              all&apos;area amministrativa protetta del sito; non riguarda i visitatori pubblici.
            </li>
          </ul>
          <p>
            <strong className="text-white">Strumenti di misurazione</strong> (solo con il tuo
            consenso):
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-white">Google Analytics 4</strong> (cookie _ga e _ga_*, durata
              fino a 2 anni): statistiche aggregate sulle visite, come pagine viste, provenienza e
              dispositivo. Gli indirizzi IP non vengono registrati.
            </li>
            <li>
              <strong className="text-white">Google Ads</strong> (cookie _gcl_*, durata fino a 90
              giorni): misura se una visita arriva da un nostro annuncio e se porta a una richiesta
              di contatto.
            </li>
          </ul>
          <p>
            Base giuridica: il tuo consenso (art. 6, par. 1, lett. a GDPR). Se rifiuti o non fai
            alcuna scelta, questi strumenti non vengono caricati e il sito funziona normalmente.
            Puoi cambiare scelta in qualsiasi momento dal link{" "}
            <strong className="text-white">«Preferenze cookie»</strong> in fondo a ogni pagina; se
            revochi il consenso, i relativi cookie vengono cancellati. Informativa di Google:{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              policies.google.com/privacy
            </a>
            .
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
