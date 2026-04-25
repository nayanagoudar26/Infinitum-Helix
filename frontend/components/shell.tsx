'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Activity, BellRing, MessageSquareMore, ShieldAlert, Stethoscope, TrendingUp } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'

import { useAuth } from '@/components/auth-provider'
import { buildWebSocketUrl } from '@/lib/api'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Activity },
  { href: '/symptoms', label: 'Symptom Logger', icon: Stethoscope },
  { href: '/chat', label: 'AI Chat', icon: MessageSquareMore },
  { href: '/insights', label: 'Insights', icon: TrendingUp },
  { href: '/emergency', label: 'Emergency', icon: ShieldAlert }
]

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, token, ready, logout } = useAuth()
  const [liveAlert, setLiveAlert] = useState<string | null>(null)

  useEffect(() => {
    if (!ready) return
    if (!token || !user) {
      router.replace('/login')
    }
  }, [ready, token, user, router])

  useEffect(() => {
    if (!user?.id || process.env.NEXT_PUBLIC_ENABLE_WS !== 'true') return
    const socket = new WebSocket(buildWebSocketUrl(user.id))
    socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data)
        setLiveAlert(parsed?.data?.message || 'New alert received')
      } catch {
        setLiveAlert('New alert received')
      }
    }
    socket.onopen = () => socket.send('subscribe')
    return () => socket.close()
  }, [user?.id])

  if (!ready || !token || !user) {
    return <div className="flex min-h-screen items-center justify-center text-mist">Preparing secure workspace...</div>
  }

  return (
    <div className="min-h-screen bg-grid bg-[size:24px_24px]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row lg:px-6">
        <aside className="panel w-full p-5 lg:w-80">
          <div className="mb-8 space-y-3">
            <p className="label">Infinitum Helix</p>
            <h1 className="font-display text-3xl">Health intelligence, grounded in context.</h1>
            <p className="text-sm text-mist/80">Track symptoms, map risks, and get emergency guidance without leaving one secure workspace.</p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${active ? 'bg-white text-shell' : 'bg-white/5 text-mist hover:bg-white/10 hover:text-white'}`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="mt-8 rounded-3xl border border-coral/20 bg-coral/10 p-4 text-sm text-mist">
            <p className="label text-coral">Emergency readiness</p>
            <p className="mt-2">If severe breathing issues, chest pain, or confusion appear, use the emergency page immediately.</p>
          </div>
        </aside>

        <main className="flex-1 space-y-6 py-2">
          <header className="panel flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="label">Active profile</p>
              <h2 className="mt-2 font-display text-2xl">{user.email}</h2>
              <p className="text-sm text-mist/80">{user.location?.city}, {user.location?.country}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-mist">
                <BellRing className="mb-1 h-4 w-4 text-mint" />
                {liveAlert || 'Realtime alerts connected'}
              </div>
              <button className="button-secondary" onClick={() => { logout(); router.push('/login') }}>Logout</button>
            </div>
          </header>
          {children}
        </main>
      </div>
    </div>
  )
}
