'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { useAuth } from '@/components/auth-provider'

export default function Home() {
  const router = useRouter()
  const { ready, token } = useAuth()

  useEffect(() => {
    if (ready && token) {
      router.replace('/dashboard')
    }
  }, [ready, token, router])

  if (!ready) {
    return (
      <main className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-12">
        <div className="panel p-8 text-center text-mist">Loading workspace...</div>
      </main>
    )
  }

  if (token) {
    return null
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-12">
      <div className="panel overflow-hidden p-8 md:p-12">
        <p className="label">AI health safety stack</p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-tight text-white md:text-7xl">
          Predict disease risk, spot outbreaks early, and shorten the path to help.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-mist/85">
          Infinitum Helix combines symptom tracking, weather-linked risk modeling, outbreak intelligence,
          and emergency hospital guidance in one secure experience for web and mobile.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/signup" className="button-primary">
            Create account
          </Link>
          <Link href="/login" className="button-secondary">
            Sign in
          </Link>
        </div>
      </div>
    </main>
  )
}
