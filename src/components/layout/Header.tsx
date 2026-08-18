import { Bell, Menu } from 'lucide-react'
import { useLocation } from 'react-router-dom'

interface HeaderProps {
  onMenuOpen: () => void
}

const pageTitles: Record<string, string> = {
  '/': 'Visão geral',
  '/chamados': 'Meus chamados',
  '/chamados/novo': 'Novo chamado',
  '/base-conhecimento': 'Base de conhecimento',
  '/admin/fila': 'Fila de atendimento',
  '/admin/usuarios': 'Usuários e unidades',
}

export function Header({ onMenuOpen }: HeaderProps) {
  const { pathname } = useLocation()
  const title = pathname.startsWith('/chamados/')
    ? pathname === '/chamados/novo'
      ? 'Novo chamado'
      : 'Detalhes do chamado'
    : (pageTitles[pathname] ?? 'Portal de Chamados')

  return (
    <header className="app-header">
      <button
        className="header-menu"
        type="button"
        aria-label="Abrir menu"
        onClick={onMenuOpen}
      >
        <Menu size={22} />
      </button>

      <div className="header-title">
        <small>PAINEL OPERACIONAL</small>
        <strong>{title}</strong>
      </div>

      <button className="notification-button" type="button" aria-label="Notificações">
        <Bell size={20} />
        <span aria-hidden="true" />
      </button>
    </header>
  )
}
