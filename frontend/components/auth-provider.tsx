'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

type User = {
  id: string
  email: string
  location?: {
    city?: string
    state?: string
    country?: string
    coordinates?: { latitude: number; longitude: number }
  }
}

type AuthContextType = {
  token: string | null
  user: User | null
  ready: boolean
  setSession: (token: string, user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const storedToken = localStorage.getItem('ih_token')
    const storedUser = localStorage.getItem('ih_user')
    if (storedToken) setToken(storedToken)
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('ih_user')
        localStorage.removeItem('ih_token')
      }
    }
    setReady(true)
  }, [])

  const value = useMemo(
    () => ({
      token,
      user,
      ready,
      setSession: (nextToken: string, nextUser: User) => {
        localStorage.setItem('ih_token', nextToken)
        localStorage.setItem('ih_user', JSON.stringify(nextUser))
        setToken(nextToken)
        setUser(nextUser)
      },
      logout: () => {
        localStorage.removeItem('ih_token')
        localStorage.removeItem('ih_user')
        setToken(null)
        setUser(null)
      }
    }),
    [token, user, ready]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
