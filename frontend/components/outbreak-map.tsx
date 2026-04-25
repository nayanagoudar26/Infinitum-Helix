'use client'

import { Fragment } from 'react'
import { GoogleMap, Circle, MarkerF, useJsApiLoader } from '@react-google-maps/api'

type OutbreakPoint = {
  city?: string
  cases?: number
  high_risk_cases?: number
  coordinates?: {
    latitude: number
    longitude: number
  }
}

export function OutbreakMap({ points, center }: { points: OutbreakPoint[]; center: { lat: number; lng: number } }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return (
      <div className="flex h-[320px] items-center justify-center rounded-3xl border border-dashed border-white/15 bg-white/5 text-center text-sm text-mist/80">
        Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to render the live outbreak map.
      </div>
    )
  }

  return <LoadedOutbreakMap points={points} center={center} apiKey={apiKey} />
}

function LoadedOutbreakMap({ points, center, apiKey }: { points: OutbreakPoint[]; center: { lat: number; lng: number }; apiKey: string }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey
  })

  if (!isLoaded) {
    return <div className="h-[320px] animate-pulse rounded-3xl bg-white/5" />
  }

  return (
    <GoogleMap mapContainerClassName="h-[320px] w-full rounded-3xl overflow-hidden" center={center} zoom={10} options={{ disableDefaultUI: true, styles: [] }}>
      {points.map((point, index) => {
        if (!point.coordinates) return null
        const mapPoint = { lat: point.coordinates.latitude, lng: point.coordinates.longitude }
        const caseCount = point.cases ?? 1
        return (
          <Fragment key={`${point.city}-${index}`}>
            <MarkerF position={mapPoint} />
            <Circle center={mapPoint} radius={Math.max(caseCount, 1) * 350} options={{ fillColor: point.high_risk_cases ? '#f97360' : '#6ee7b7', strokeColor: '#ffffff', fillOpacity: 0.24, strokeOpacity: 0.25 }} />
          </Fragment>
        )
      })}
    </GoogleMap>
  )
}
