import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/auth-context'
import type { UserRole } from '../../types'

export function ProtectedRoute() {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <div className="auth-loading">Carregando portal...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export function PublicOnlyRoute() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div className="auth-loading">Carregando portal...</div>
  }

  return user ? <Navigate to="/" replace /> : <Outlet />
}

export function RequireRole({ allowedRoles }: { allowedRoles: UserRole[] }) {
  const { user } = useAuth()

  return user && allowedRoles.includes(user.role) ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  )
}
