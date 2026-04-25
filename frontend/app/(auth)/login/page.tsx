'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

import { useAuth } from '@/components/auth-provider'
import { apiFetch } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const { setSession } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(event.currentTarget)
    try {
      const response = await apiFetch<{ access_token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: {
          email: formData.get('email'),
          password: formData.get('password')
        }
      })
      setSession(response.access_token, response.user)
      router.push('/dashboard')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
  <main className="mx-auto flex min-h-screen max-w-5xl items-center px-6 py-10">
      <div className="grid w-full gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <section className="panel p-8 md:p-10">
          <p className="label">Secure access</p>
          <h1 className="mt-3 font-display text-4xl">Return to your health command center.</h1>
          <p className="mt-4 text-mist/80">Review risk forecasts, monitor symptoms, and receive emergency updates in realtime.</p>
        </section>
        <form onSubmit={handleSubmit} className="panel space-y-5 p-8">
          <div>
            <label className="label">Email</label>
            <input className="input mt-2" name="email" type="email" required />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input mt-2" name="password" type="password" required />
          </div>
          {error && <p className="rounded-2xl border border-coral/30 bg-coral/10 px-4 py-3 text-sm text-coral">{error}</p>}
          <button className="button-primary w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
          <p className="text-sm text-mist/70">No account yet? <Link href="/signup" className="text-mint">Create one</Link></p>
        </form>
      </div>
    </main>
  )
}
