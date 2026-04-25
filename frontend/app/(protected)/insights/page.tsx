'use client'

import { useProtectedFetch } from '@/components/use-protected-fetch'

export default function InsightsPage() {
  const { data: forecastData, loading } = useProtectedFetch<any>('/risk/forecast')
  const forecast = Array.isArray(forecastData?.forecast) ? forecastData.forecast : []
  const insights = Array.isArray(forecastData?.weather?.insights) ? forecastData.weather.insights : []

  return (
    <div className="space-y-6">
      <section className="panel p-6">
        <p className="label">7-day risk forecast</p>
        <h2 className="mt-2 font-display text-2xl">Projected disease spread trend</h2>
        {loading || !forecastData ? (
          <p className="mt-4 text-mist/70">Loading forecast...</p>
        ) : forecast.length === 0 ? (
          <p className="mt-4 text-mist/70">No forecast data available.</p>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-7">
            {forecast.map((day: any) => (
              <div key={day.date} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-xs uppercase tracking-[0.25em] text-mist/60">{String(day.date || '').slice(5) || '--'}</p>
                <p className="mt-3 font-display text-3xl">{Math.round(Number(day.risk_score || 0) * 100)}</p>
                <p className="text-sm text-mist/80">{day.risk_level || 'Unknown'}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {!loading && forecastData && (
        <section className="grid gap-6 md:grid-cols-2">
          <div className="panel p-6">
            <p className="label">Weather correlation</p>
            <ul className="mt-4 space-y-3 text-sm text-mist/85">
              {(insights.length ? insights : ['No weather insights available.']).map((item: string) => <li key={item}>- {item}</li>)}
            </ul>
          </div>
          <div className="panel p-6">
            <p className="label">Decision support</p>
            <div className="mt-4 space-y-3 text-sm text-mist/85">
              <p>Current risk band: <span className="font-semibold text-white">{forecastData.current_risk}</span></p>
              <p>Use this page to guide monitoring frequency, mosquito control messaging, staffing prep, or proactive outreach in higher-risk periods.</p>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
