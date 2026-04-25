'use client'

import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Shell } from '@/components/shell'
import { useAuth } from '@/components/auth-provider'

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { ready, token } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (ready && !token) router.replace('/login')
  }, [ready, token, router])

  if (!ready || !token) return null
  return <Shell>{children}</Shell>
}
