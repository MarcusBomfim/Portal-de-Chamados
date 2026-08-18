import { createContext, useContext } from 'react'
import type { UserRole } from '../types'

export interface AuthUser {
  id: string
  fullName: string
  email: string
  role: UserRole
  unitId: string | null
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput extends LoginInput {
  fullName: string
}

export interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  login: (input: LoginInput) => Promise<void>
  register: (input: RegisterInput) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth precisa ser utilizado dentro de AuthProvider.')
  }

  return context
}
