import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { apiRequest } from '../services/api'
import {
  AuthContext,
  type AuthContextValue,
  type AuthUser,
} from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    apiRequest<{ user: AuthUser }>('/api/auth/me')
      .then((response) => setUser(response.user))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false))
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      async login(input) {
        const response = await apiRequest<{ user: AuthUser }>('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify(input),
        })
        setUser(response.user)
      },
      async register(input) {
        const response = await apiRequest<{ user: AuthUser }>(
          '/api/auth/register',
          {
            method: 'POST',
            body: JSON.stringify(input),
          },
        )
        setUser(response.user)
      },
      async logout() {
        await apiRequest<void>('/api/auth/logout', { method: 'POST' })
        setUser(null)
      },
    }),
    [isLoading, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
