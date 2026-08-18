import {
  BookOpen,
  ChevronRight,
  CircleGauge,
  ClipboardList,
  Headset,
  LogOut,
  Plus,
  UsersRound,
  X,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/auth-context'
import type { UserRole } from '../../types'

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

const adminNavigation: Array<{
  label: string
  path: string
  icon: typeof Headset
  roles: UserRole[]
}> = [
  {
    label: 'Fila de atendimento',
    path: '/admin/fila',
    icon: Headset,
    roles: ['TECHNICIAN', 'ADMIN'],
  },
  {
    label: 'Usuários e unidades',
    path: '/admin/usuarios',
    icon: UsersRound,
    roles: ['ADMIN'],
  },
]

const roleLabels: Record<UserRole, string> = {
  REQUESTER: 'Solicitante',
  TECHNICIAN: 'Técnico',
  ADMIN: 'Administrador',
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth()
  const visibleAdminNavigation = adminNavigation.filter(({ roles }) =>
    user ? roles.includes(user.role) : false,
  )
  const initials = user?.fullName
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

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

        {visibleAdminNavigation.length > 0 && (
          <>
            <span className="nav-section-title nav-section-title--spaced">
              ADMINISTRAÇÃO
            </span>
            {visibleAdminNavigation.map(({ label, path, icon: Icon }) => (
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
          </>
        )}
      </nav>

      <div className="sidebar-profile">
        <span className="profile-avatar" aria-hidden="true">
          {initials}
        </span>
        <span className="profile-copy">
          <strong>{user?.fullName}</strong>
          <small>{user ? roleLabels[user.role] : ''}</small>
        </span>
        <button
          className="logout-button"
          type="button"
          aria-label="Sair da conta"
          title="Sair"
          onClick={() => void logout()}
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  )
}
