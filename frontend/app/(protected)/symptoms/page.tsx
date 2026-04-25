'use client'

import { FormEvent, useState } from 'react'
import { apiFetch } from '@/lib/api'
import { useAuth } from '@/components/auth-provider'

const symptoms = ['fever', 'cough', 'fatigue', 'headache', 'breathing_difficulty', 'vomiting', 'diarrhea', 'rash', 'joint_pain', 'chills']

export default function SymptomsPage() {
  const { token, user } = useAuth()
  const [message, setMessage] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const selectedSymptoms = symptoms
      .filter((symptom) => formData.get(`${symptom}_enabled`))
      .map((symptom) => ({
        name: symptom,
        intensity: Number(formData.get(`${symptom}_intensity`) || 3),
        duration_days: Number(formData.get(`${symptom}_duration`) || 1)
      }))

    try {
      const response = await apiFetch('/symptoms', {
        method: 'POST',
        token,
        body: {
          symptoms: selectedSymptoms,
          notes: formData.get('notes'),
          location: user?.location
        }
      })
      setResult(response)
      setMessage('Symptoms saved and assessed successfully.')
    } catch (error) {
      setMessage((error as Error).message)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <form onSubmit={handleSubmit} className="panel space-y-5 p-6">
        <div>
          <p className="label">Symptom logger</p>
          <h2 className="mt-2 font-display text-2xl">Capture symptom intensity, duration, and notes.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {symptoms.map((symptom) => (
            <div key={symptom} className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <label className="flex items-center justify-between gap-3">
                <span className="font-semibold capitalize text-white">{symptom.replace('_', ' ')}</span>
                <input type="checkbox" name={`${symptom}_enabled`} />
              </label>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <input className="input" type="number" name={`${symptom}_intensity`} min="1" max="5" defaultValue="3" placeholder="Intensity" />
                <input className="input" type="number" name={`${symptom}_duration`} min="1" max="30" defaultValue="1" placeholder="Days" />
              </div>
            </div>
          ))}
        </div>
        <textarea className="input min-h-28" name="notes" placeholder="Optional notes about triggers, medication, or exposure history" />
        {message && <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-mist">{message}</p>}
        <button className="button-primary">Submit symptoms</button>
      </form>

      <div className="panel p-6">
        <p className="label">Latest assessment</p>
        {!result ? (
          <p className="mt-4 text-mist/75">Your prediction summary will appear here after submission.</p>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-3xl font-display">{result.prediction?.disease || 'Unknown'}</p>
              <p className="mt-2 text-mist/80">Risk: {result.prediction?.risk_level || 'Unknown'} / Confidence: {Math.round(Number(result.prediction?.confidence || 0) * 100)}%</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="label">Advice</p>
              <ul className="mt-3 space-y-2 text-sm text-mist/85">
                {(Array.isArray(result.prediction?.advice) ? result.prediction.advice : ['No advice returned.']).map((item: string) => <li key={item}>- {item}</li>)}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
