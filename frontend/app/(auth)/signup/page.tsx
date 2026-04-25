'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

import { useAuth } from '@/components/auth-provider'
import { apiFetch } from '@/lib/api'

export default function SignupPage() {
  const router = useRouter()
  const { setSession } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(event.currentTarget)
    const city = String(formData.get('city'))
    const state = String(formData.get('state'))
    const latitude = Number(formData.get('latitude'))
    const longitude = Number(formData.get('longitude'))

    try {
      const response = await apiFetch<{ access_token: string; user: any }>('/auth/signup', {
        method: 'POST',
        body: {
          email: formData.get('email'),
          password: formData.get('password'),
          consent_to_processing: Boolean(formData.get('consent')),
          location: {
            city,
            state,
            country: 'India',
            coordinates: { latitude, longitude }
          }
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
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-10">
      <div className="grid w-full gap-6 md:grid-cols-[0.95fr_1.05fr]">
        <section className="panel p-8 md:p-10">
          <p className="label">Consent-first onboarding</p>
          <h1 className="mt-3 font-display text-4xl">Set up your protected health profile.</h1>
          <p className="mt-4 text-mist/80">We store symptom records with encrypted notes and anonymized coordinates before any outbreak analytics are generated.</p>
        </section>
        <form onSubmit={handleSubmit} className="panel grid gap-5 p-8 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="label">Email</label>
            <input className="input mt-2" name="email" type="email" required />
          </div>
          <div className="md:col-span-2">
            <label className="label">Password</label>
            <input className="input mt-2" name="password" type="password" minLength={8} required />
          </div>
          <div>
            <label className="label">City</label>
            <input className="input mt-2" name="city" defaultValue="New Delhi" required />
          </div>
          <div>
            <label className="label">State</label>
            <input className="input mt-2" name="state" defaultValue="Delhi" required />
          </div>
          <div>
            <label className="label">Latitude</label>
            <input className="input mt-2" name="latitude" type="number" step="0.0001" defaultValue="28.6139" required />
          </div>
          <div>
            <label className="label">Longitude</label>
            <input className="input mt-2" name="longitude" type="number" step="0.0001" defaultValue="77.2090" required />
          </div>
          <label className="md:col-span-2 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-mist">
            <input name="consent" type="checkbox" className="mt-1" defaultChecked required />
            <span>I consent to secure processing of my health data for prediction, alerts, and anonymized risk analysis.</span>
          </label>
          {error && <p className="md:col-span-2 rounded-2xl border border-coral/30 bg-coral/10 px-4 py-3 text-sm text-coral">{error}</p>}
          <button className="button-primary md:col-span-2" disabled={loading}>{loading ? 'Creating account...' : 'Create account'}</button>
          <p className="md:col-span-2 text-sm text-mist/70">Already registered? <Link href="/login" className="text-mint">Sign in</Link></p>
        </form>
      </div>
    </main>
  )
}
