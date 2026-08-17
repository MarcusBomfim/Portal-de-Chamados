import { ArrowRight, BookOpen, ClipboardList, Headset, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

export function DashboardPage() {
  return (
    <section className="dashboard-page">
      <div className="page-heading">
        <span className="eyebrow">CENTRAL DE ATENDIMENTO</span>
        <h1>Bom dia, Marcus.</h1>
        <p>
          Registre solicitações e acompanhe o suporte prestado às unidades de
          saúde em um só lugar.
        </p>
      </div>

      <div className="welcome-panel">
        <div>
          <span className="welcome-icon" aria-hidden="true">
            <Headset size={24} />
          </span>
          <h2>Como podemos ajudar?</h2>
          <p>
            Abra um chamado com as informações da ocorrência para iniciar o
            atendimento da equipe responsável.
          </p>
        </div>
        <Link className="primary-action" to="/chamados/novo">
          <Plus size={19} />
          Abrir novo chamado
        </Link>
      </div>

      <div className="shortcut-grid" aria-label="Atalhos">
        <Link className="shortcut-card" to="/chamados">
          <span className="shortcut-icon shortcut-icon--blue">
            <ClipboardList size={22} />
          </span>
          <span>
            <strong>Meus chamados</strong>
            <small>Consulte solicitações e acompanhe o andamento.</small>
          </span>
          <ArrowRight size={19} />
        </Link>

        <Link className="shortcut-card" to="/base-conhecimento">
          <span className="shortcut-icon shortcut-icon--teal">
            <BookOpen size={22} />
          </span>
          <span>
            <strong>Base de conhecimento</strong>
            <small>Encontre orientações para dúvidas frequentes.</small>
          </span>
          <ArrowRight size={19} />
        </Link>
      </div>
    </section>
  )
}
