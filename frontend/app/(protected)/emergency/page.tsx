'use client'

import { useState } from 'react'

import { useAuth } from '@/components/auth-provider'
import { useProtectedFetch } from '@/components/use-protected-fetch'
import { apiFetch } from '@/lib/api'

export default function EmergencyPage() {
  const { token } = useAuth()
  const { data, loading, error } = useProtectedFetch<any>('/hospitals/nearby')
  const [status, setStatus] = useState<string | null>(null)

  async function triggerEmergency() {
    try {
      await apiFetch('/hospitals/emergency', { method: 'POST', token })
      setStatus('Emergency alert triggered. Realtime notifications have been sent to your session feed.')
    } catch (err) {
      setStatus((err as Error).message)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="panel p-6">
        <p className="label">Emergency system</p>
        <h2 className="mt-2 font-display text-2xl">Nearest hospitals and urgent guidance</h2>
        <button className="mt-6 inline-flex w-full items-center justify-center rounded-3xl bg-coral px-6 py-4 text-lg font-bold text-white transition hover:brightness-110" onClick={triggerEmergency}>
          Trigger emergency alert
        </button>
        {status && <p className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-mist">{status}</p>}
        <div className="mt-6 rounded-3xl border border-coral/20 bg-coral/10 p-5 text-sm text-mist">
          Use emergency mode for severe breathing difficulty, chest pain, confusion, uncontrolled vomiting, or rapid deterioration.
        </div>
      </div>

      <div className="panel p-6">
        <p className="label">Nearby hospitals</p>
        {loading && <p className="mt-4 text-mist/70">Finding hospitals...</p>}
        {error && <p className="mt-4 text-coral">{error}</p>}
        <div className="mt-4 space-y-4">
          {data?.hospitals?.map((hospital: any) => (
            <div key={hospital.name} className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="font-semibold text-white">{hospital.name}</p>
              <p className="mt-1 text-sm text-mist/75">{hospital.address}</p>
              <div className="mt-4 flex gap-3 text-sm text-mist/85">
                <span>{hospital.distance_km} km away</span>
                <span>{hospital.estimated_time_minutes} min ETA</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
