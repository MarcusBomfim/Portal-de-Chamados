import {
  BookOpen,
  ChevronRight,
  CircleGauge,
  ClipboardList,
  Headset,
  Plus,
  UsersRound,
  X,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const serviceNavigation = [
  { label: 'Visão geral', path: '/', icon: CircleGauge, end: true },
  { label: 'Meus chamados', path: '/chamados', icon: ClipboardList },
  { label: 'Novo chamado', path: '/chamados/novo', icon: Plus },
  {
    label: 'Base de conhecimento',
    path: '/base-conhecimento',
    icon: BookOpen,
  },
]

const adminNavigation = [
  { label: 'Fila de atendimento', path: '/admin/fila', icon: Headset },
  { label: 'Usuários e unidades', path: '/admin/usuarios', icon: UsersRound },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <aside className={`sidebar${isOpen ? ' sidebar--open' : ''}`}>
      <div className="sidebar-brand">
        <span className="brand-icon" aria-hidden="true">
          <Headset size={23} strokeWidth={2.2} />
        </span>
        <span>
          <strong>Portal de Chamados</strong>
          <small>Saúde · São Vicente</small>
        </span>
        <button
          className="sidebar-close"
          type="button"
          aria-label="Fechar menu"
          onClick={onClose}
        >
          <X size={21} />
        </button>
      </div>

      <nav className="sidebar-nav" aria-label="Navegação principal">
        <span className="nav-section-title">ATENDIMENTO</span>
        {serviceNavigation.map(({ label, path, icon: Icon, end }) => (
          <NavLink
            key={path}
            className={({ isActive }) =>
              `nav-link${isActive ? ' nav-link--active' : ''}`
            }
            end={end}
            to={path}
            onClick={onClose}
          >
            <Icon size={20} />
            <span>{label}</span>
            <ChevronRight className="nav-chevron" size={17} />
          </NavLink>
        ))}

        <span className="nav-section-title nav-section-title--spaced">
          ADMINISTRAÇÃO
        </span>
        {adminNavigation.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            className={({ isActive }) =>
              `nav-link${isActive ? ' nav-link--active' : ''}`
            }
            to={path}
            onClick={onClose}
          >
            <Icon size={20} />
            <span>{label}</span>
            <ChevronRight className="nav-chevron" size={17} />
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-profile">
        <span className="profile-avatar" aria-hidden="true">
          MB
        </span>
        <span>
          <strong>Marcus Bomfim</strong>
          <small>Administrador</small>
        </span>
      </div>
    </aside>
  )
}
