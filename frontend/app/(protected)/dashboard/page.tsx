'use client'

import { useProtectedFetch } from '@/components/use-protected-fetch'
import { OutbreakMap } from '@/components/outbreak-map'
import { formatConfidence, getRiskTone } from '@/lib/format'

type DashboardAlert = {
  id?: string
  message?: string
  type?: string
  severity?: string
}

export default function DashboardPage() {
  const { data, loading, error } = useProtectedFetch<any>('/dashboard')

  if (loading) return <div className="panel p-6">Loading dashboard...</div>
  if (error || !data) return <div className="panel p-6 text-coral">{error || 'Unable to load dashboard.'}</div>

  const outbreakMap = Array.isArray(data.outbreak_map) ? data.outbreak_map : []
  const alerts: DashboardAlert[] = Array.isArray(data.alerts) ? data.alerts : []
  const weather = data.weather ?? {}
  const center = outbreakMap[0]?.coordinates
    ? { lat: outbreakMap[0].coordinates.latitude, lng: outbreakMap[0].coordinates.longitude }
    : { lat: 28.6139, lng: 77.209 }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-4">
        <div className="panel p-6 lg:col-span-1">
          <p className="label">Risk level</p>
          <div className={`mt-4 inline-flex rounded-full border px-4 py-2 text-lg font-semibold ${getRiskTone(data.risk_level)}`}>{data.risk_level}</div>
        </div>
        <div className="panel p-6 lg:col-span-1">
          <p className="label">Latest confidence</p>
          <p className="mt-4 font-display text-4xl">{formatConfidence(data.prediction_snapshot?.confidence)}</p>
        </div>
        <div className="panel p-6 lg:col-span-2">
          <p className="label">Daily health summary</p>
          <p className="mt-4 text-lg text-mist/90">{data.daily_summary || 'No health summary available yet.'}</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="panel p-5">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="label">Regional outbreak heatmap</p>
              <h2 className="mt-2 font-display text-2xl">Area risk clusters</h2>
            </div>
          </div>
          <OutbreakMap points={outbreakMap} center={center} />
        </div>

        <div className="space-y-6">
          <div className="panel p-5">
            <p className="label">Weather context</p>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-white/5 p-4"><p className="text-2xl font-bold">{weather.temperature ?? '--'} deg</p><p className="text-xs text-mist/70">Temp</p></div>
              <div className="rounded-2xl bg-white/5 p-4"><p className="text-2xl font-bold">{weather.humidity ?? '--'}%</p><p className="text-xs text-mist/70">Humidity</p></div>
              <div className="rounded-2xl bg-white/5 p-4"><p className="text-2xl font-bold">{weather.rainfall ?? '--'}mm</p><p className="text-xs text-mist/70">Rain</p></div>
            </div>
          </div>
          <div className="panel p-5">
            <p className="label">Active alerts</p>
            <div className="mt-4 space-y-3">
              {alerts.length === 0 && <p className="text-sm text-mist/70">No alerts yet.</p>}
              {alerts.map((alert, index) => (
                <div key={alert.id || index} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-white">{alert.message || 'Alert received'}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.25em] text-mist/60">{alert.type || 'system'} / {alert.severity || 'medium'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
