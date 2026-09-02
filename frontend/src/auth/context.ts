import { createContext } from 'react'
import type { User } from './AuthContext'

export type AuthContextValue = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  register: (input: { email: string; firstName: string; lastName: string; password: string }) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
