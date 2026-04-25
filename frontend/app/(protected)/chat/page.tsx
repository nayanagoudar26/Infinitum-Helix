'use client'

import { FormEvent, useState } from 'react'

import { useAuth } from '@/components/auth-provider'
import { apiFetch } from '@/lib/api'

type ChatEntry =
  | { role: 'user'; content: string }
  | { role: 'assistant'; content: any }

export default function ChatPage() {
  const { token, user } = useAuth()
  const [history, setHistory] = useState<ChatEntry[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!message.trim()) return
    setLoading(true)
    try {
      const response = await apiFetch<any>('/chat', {
        method: 'POST',
        token,
        body: {
          message,
          location: user?.location
        }
      })
      setHistory((current) => [...current, { role: 'user', content: message }, { role: 'assistant', content: response }])
      setMessage('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="panel flex min-h-[560px] flex-col p-6">
        <div>
          <p className="label">AI assistant chat</p>
          <h2 className="mt-2 font-display text-2xl">Describe what you are feeling in natural language.</h2>
        </div>
        <div className="mt-6 flex-1 space-y-4 overflow-y-auto">
          {history.length === 0 && <p className="text-mist/70">Try this: I have fever, cough and body pain for 2 days.</p>}
          {history.map((entry, index) => (
            <div key={index} className={`rounded-3xl p-4 ${entry.role === 'user' ? 'ml-auto max-w-xl bg-mint text-shell' : 'max-w-2xl border border-white/10 bg-white/5 text-white'}`}>
              {entry.role === 'assistant' ? (
                <div className="space-y-3 text-sm">
                  <p><span className="font-semibold">Extracted symptoms:</span> {(Array.isArray(entry.content?.symptoms_extracted) ? entry.content.symptoms_extracted : []).map((item: any) => item.name).join(', ') || 'None detected'}</p>
                  <p><span className="font-semibold">Risk:</span> {entry.content?.risk_level || 'Unknown'}</p>
                  <p><span className="font-semibold">Top disease:</span> {entry.content?.prediction?.disease || 'Unknown'}</p>
                  <ul className="space-y-1 text-mist/85">
                    {(Array.isArray(entry.content?.prediction?.advice) ? entry.content.prediction.advice : ['No advice returned.']).map((item: string) => <li key={item}>- {item}</li>)}
                  </ul>
                </div>
              ) : entry.content}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 md:flex-row">
          <textarea value={message} onChange={(event) => setMessage(event.target.value)} className="input min-h-20 flex-1" placeholder="Describe symptoms, exposures, duration, and how intense it feels." />
          <button className="button-primary min-w-36" disabled={loading}>{loading ? 'Analyzing...' : 'Send'}</button>
        </form>
      </div>

      <div className="panel p-6">
        <p className="label">How it works</p>
        <div className="mt-4 space-y-4 text-sm text-mist/85">
          <p>The backend extracts known symptom entities from your message, combines them with weather context, and runs them through a multi-disease prediction engine.</p>
          <p>Responses include a structured risk level, disease probability ranking, weather-linked correlation insights, and emergency escalation if severe symptoms appear.</p>
        </div>
      </div>
    </div>
  )
}
