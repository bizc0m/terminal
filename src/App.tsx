import { useMemo, useState } from 'react'
import {
  copyText,
  createTicketText,
  downloadTicket,
  generateDemoCodes,
  packs,
  type PackDefinition,
  type PackKind,
} from './terminal'
import './index.css'

type IssuedPack = {
  kind: PackKind
  codes: string[]
}

type Route = '/terminal' | '/data-not-product' | '/about' | '/privacy' | '/terms'

const routes: Route[] = ['/terminal', '/data-not-product', '/about', '/privacy', '/terms']
const basePath = import.meta.env.BASE_URL === '/' ? '' : import.meta.env.BASE_URL.replace(/\/$/, '')

function getRoute(): Route {
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/terminal'
  const path =
    basePath && currentPath.startsWith(basePath)
      ? `/${currentPath.slice(basePath.length).replace(/^\//, '')}`.replace(/\/$/, '') || '/terminal'
      : currentPath
  if (routes.includes(path as Route)) return path as Route
  return '/terminal'
}

function pathForRoute(route: Route): string {
  if (!basePath) return route
  if (route === '/terminal') return `${basePath}/`
  return `${basePath}${route}`
}

function App() {
  const [route, setRoute] = useState<Route>(getRoute)
  const [issued, setIssued] = useState<IssuedPack | null>(null)
  const [activePack, setActivePack] = useState<PackDefinition | null>(null)
  const [cooproOpen, setCooproOpen] = useState(false)
  const [copyStatus, setCopyStatus] = useState<string>('READY')

  function navigate(next: Route) {
    window.history.pushState({}, '', pathForRoute(next))
    setRoute(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function issuePack(pack: PackDefinition) {
    setActivePack(pack)
    setIssued({ kind: pack.kind, codes: generateDemoCodes(pack.count) })
    setCopyStatus('READY')
  }

  return (
    <main className="app-shell">
      <div className="scanline" aria-hidden="true" />
      <Header route={route} navigate={navigate} />
      {route === '/terminal' && (
        <TerminalPage
          activePack={activePack}
          copyStatus={copyStatus}
          issued={issued}
          issuePack={issuePack}
          navigate={navigate}
          openCoopro={() => setCooproOpen(true)}
          setCopyStatus={setCopyStatus}
        />
      )}
      {route === '/data-not-product' && <DataNotProductPage navigate={navigate} />}
      {route === '/about' && <AboutPage />}
      {route === '/privacy' && <PrivacyPage />}
      {route === '/terms' && <TermsPage />}
      <Footer navigate={navigate} />
      {cooproOpen && <CooproModal close={() => setCooproOpen(false)} />}
    </main>
  )
}

function Header({ route, navigate }: { route: Route; navigate: (route: Route) => void }) {
  return (
    <header className="terminal-header">
      <button className="brand" type="button" onClick={() => navigate('/terminal')}>
        <span>TERMINAL</span>
        <small>FIELD REPORT ACCESS UNIT</small>
      </button>
      <nav aria-label="Navigation principale">
        {routes.map((item) => (
          <button
            key={item}
            aria-current={route === item ? 'page' : undefined}
            type="button"
            onClick={() => navigate(item)}
          >
            {item.replace('/', '').replaceAll('-', ' ')}
          </button>
        ))}
      </nav>
    </header>
  )
}

function TerminalPage({
  activePack,
  copyStatus,
  issued,
  issuePack,
  navigate,
  openCoopro,
  setCopyStatus,
}: {
  activePack: PackDefinition | null
  copyStatus: string
  issued: IssuedPack | null
  issuePack: (pack: PackDefinition) => void
  navigate: (route: Route) => void
  openCoopro: () => void
  setCopyStatus: (status: string) => void
}) {
  const selectedPack = activePack ?? packs[0]

  return (
    <>
      <section className="hero-panel" aria-labelledby="terminal-title">
        <div className="boot-card">
          <p className="system-line">BOOT SEQUENCE READY</p>
          <h1 id="terminal-title">TERMINAL</h1>
          <p className="subtitle">FIELD REPORT ACCESS UNIT</p>
          <div className="meters" aria-label="Compteurs de données personnelles">
            <span>PERSONAL DATA REQUESTED: 0</span>
            <span>PERSONAL DATA STORED: 0</span>
            <span>PROFILES CREATED: 0</span>
            <span>DATA SOLD: 0</span>
          </div>
        </div>
        <div className="notice-panel">
          <p>Les codes sont des codes d’usage unique destinés à une demande de transmission dans Coopro.</p>
          <p>Un code déjà utilisé ne peut pas être réactivé.</p>
          <p>Le Terminal ne crée aucun compte et ne conserve aucune donnée personnelle.</p>
          <p>Mode démonstration : aucun paiement, aucune délivrance de code réel et aucune transmission réelle.</p>
        </div>
      </section>

      <section className="packs-grid" aria-label="Choix des packs">
        {packs.map((pack) => (
          <PackCard key={pack.kind} pack={pack} issuePack={issuePack} navigate={navigate} />
        ))}
      </section>

      <section className="output-panel" aria-live="polite" aria-label="Sortie terminal">
        <div className="output-head">
          <div>
            <p className="system-line">OUTPUT BAY</p>
            <h2>{selectedPack.title}</h2>
          </div>
          <span className="status-chip">{issued ? 'ISSUED' : 'STANDBY'}</span>
        </div>
        <BootSequence lines={selectedPack.sequence} active={Boolean(issued)} />
        {issued && (
          <IssuedCodes
            copyStatus={copyStatus}
            issued={issued}
            openCoopro={openCoopro}
            setCopyStatus={setCopyStatus}
          />
        )}
      </section>
    </>
  )
}

function PackCard({
  pack,
  issuePack,
  navigate,
}: {
  pack: PackDefinition
  issuePack: (pack: PackDefinition) => void
  navigate: (route: Route) => void
}) {
  return (
    <article className="pack-card">
      <div>
        <p className="system-line">{pack.title}</p>
        <h2>{pack.line}</h2>
        <p>{pack.description}</p>
      </div>
      {pack.kind === 'solidarity' && (
        <a
          className="text-link"
          href="https://www.service-public.fr/particuliers/vosdroits/F426"
          rel="noreferrer"
          target="_blank"
        >
          Faire un don à une œuvre de votre choix
        </a>
      )}
      {pack.kind === 'soul' && (
        <button className="text-link as-button" type="button" onClick={() => navigate('/data-not-product')}>
          Lire data-not-product
        </button>
      )}
      <button className="primary-action" type="button" onClick={() => issuePack(pack)}>
        {pack.button}
      </button>
      {pack.note && <small>{pack.note}</small>}
    </article>
  )
}

function BootSequence({ lines, active }: { lines: string[]; active: boolean }) {
  return (
    <ol className="boot-sequence">
      {(active ? lines : ['SELECT PACK.', 'WAITING FOR LOCAL DEMO VALIDATION.']).map((line, index) => (
        <li key={line} style={{ animationDelay: `${index * 90}ms` }}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          {line}
        </li>
      ))}
    </ol>
  )
}

function IssuedCodes({
  copyStatus,
  issued,
  openCoopro,
  setCopyStatus,
}: {
  copyStatus: string
  issued: IssuedPack
  openCoopro: () => void
  setCopyStatus: (status: string) => void
}) {
  const ticket = useMemo(() => createTicketText(issued.kind, issued.codes), [issued])

  async function copyAll() {
    const method = await copyText(issued.codes.join('\n'))
    setCopyStatus(method === 'clipboard' ? 'COPIÉ' : 'COPIÉ VIA FALLBACK')
  }

  return (
    <div className="issued-panel">
      <p className="warning">Conservez vos codes. Aucun compte. Aucune récupération.</p>
      <ul className="code-list">
        {issued.codes.map((code) => (
          <li key={code}>
            <code>{code}</code>
          </li>
        ))}
      </ul>
      <div className="action-row">
        <button className="primary-action" type="button" onClick={copyAll}>
          COPIER
        </button>
        <button
          className="secondary-action"
          type="button"
          onClick={() => downloadTicket(`terminal-${issued.kind}-ticket.txt`, ticket)}
        >
          TÉLÉCHARGER LE TICKET .TXT
        </button>
        <button className="secondary-action" type="button" onClick={openCoopro}>
          OUVRIR COOPRO
        </button>
      </div>
      <p className="copy-status">{copyStatus}</p>
    </div>
  )
}

function CooproModal({ close }: { close: () => void }) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="coopro-title">
        <p className="system-line">COOPRO HANDOFF</p>
        <h2 id="coopro-title">Copiez vos codes puis collez-les dans Coopro</h2>
        <p>
          En production, un code réel ne doit jamais être placé dans une URL. Une future intégration pourra utiliser
          postMessage ou une URL temporaire sans exposer le code.
        </p>
        <button className="primary-action" type="button" onClick={close}>
          FERMER
        </button>
      </section>
    </div>
  )
}

function DataNotProductPage({ navigate }: { navigate: (route: Route) => void }) {
  return (
    <StaticPage title="DATA NOT PRODUCT" kicker="SOUL PROTOCOL">
      <p>
        Cette page explique brièvement pourquoi TERMINAL refuse les cookies, la publicité ciblée et le profilage. Aucun
        tracker ni source de données n’est utilisé ici.
      </p>
      <p>
        Certains services gratuits financent leur fonctionnement avec des profils publicitaires. TERMINAL ne prétend pas
        savoir ce que vous avez accepté ailleurs. Il montre seulement une alternative de démonstration sans collecte.
      </p>
      <button className="primary-action" type="button" onClick={() => navigate('/terminal')}>
        RETOUR TERMINAL
      </button>
    </StaticPage>
  )
}

function AboutPage() {
  return (
    <StaticPage title="À PROPOS" kicker="UNIT BRIEF">
      <p>
        TERMINAL est une maquette statique de borne d’accès visuel pour délivrer des codes fictifs à utiliser dans
        Coopro. Il ne prend aucune photo, ne génère aucun rapport et n’envoie aucun e-mail.
      </p>
      <p>
        Les endpoints futurs prévus sont POST /issue-paid-pack, POST /issue-soul-pack et POST
        /issue-solidarity-pack. Seule une API serveur pourra créer de vrais codes, les stocker sous hash et les rendre
        utilisables une fois.
      </p>
    </StaticPage>
  )
}

function PrivacyPage() {
  return (
    <StaticPage title="CONFIDENTIALITÉ" kicker="ZERO COLLECTION">
      <p>
        Le Terminal ne collecte ni nom, ni e-mail, ni compte, ni adresse, ni photo, ni GPS, ni donnée personnelle.
      </p>
      <p>
        Aucun cookie, aucun localStorage, aucun IndexedDB, aucun analytics, aucun pixel, aucun tracker, aucune publicité
        et aucun script tiers en production.
      </p>
    </StaticPage>
  )
}

function TermsPage() {
  return (
    <StaticPage title="CONDITIONS" kicker="DEMO TERMS">
      <p>Les codes affichés dans cette version sont fictifs et marqués visuellement DEMO.</p>
      <p>
        Mode démonstration : aucun paiement, aucune délivrance de code réel et aucune transmission réelle. Un code déjà
        utilisé ne peut pas être réactivé.
      </p>
    </StaticPage>
  )
}

function StaticPage({
  children,
  kicker,
  title,
}: {
  children: React.ReactNode
  kicker: string
  title: string
}) {
  return (
    <section className="static-page">
      <p className="system-line">{kicker}</p>
      <h1>{title}</h1>
      <div className="static-copy">{children}</div>
    </section>
  )
}

function Footer({ navigate }: { navigate: (route: Route) => void }) {
  return (
    <footer className="terminal-footer">
      <span>TERMINAL ne crée aucun compte et ne conserve aucune donnée personnelle.</span>
      <button type="button" onClick={() => navigate('/privacy')}>
        confidentialité
      </button>
    </footer>
  )
}

export default App
