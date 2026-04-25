const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export type ApiOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  token?: string | null
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  // If path already starts with /api, don't add it again
  const basePath = path.startsWith('/api') ? '' : '/api'
  const response = await fetch(`${API_BASE_URL}${basePath}${path}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: 'no-store'
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(error.detail || 'Request failed')
  }

  return response.json()
}

// Auth endpoints
export const authApi = {
  signup: (email: string, password: string, name: string) =>
    apiFetch<{ access_token: string; user: any }>('/api/auth/signup', {
      method: 'POST',
      body: { email, password, name }
    }),
  
  login: (email: string, password: string) =>
    apiFetch<{ access_token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: { email, password }
    })
}

// Dashboard endpoints
export const dashboardApi = {
  getSummary: (token: string) =>
    apiFetch<any>('/api/dashboard', { token })
}

// Symptoms endpoints
export const symptomsApi = {
  createLog: (token: string, symptoms: any[], notes: string, location: any) =>
    apiFetch<any>('/api/symptoms', {
      method: 'POST',
      token,
      body: { symptoms, notes, location }
    })
}

// Weather endpoints
export const weatherApi = {
  getWeather: (token: string) =>
    apiFetch<any>('/api/weather', { token })
}

// Risk endpoints
export const riskApi = {
  getForecast: (token: string) =>
    apiFetch<any>('/api/risk/forecast', { token })
}

// Hospital endpoints
export const hospitalsApi = {
  getNearby: (token: string) =>
    apiFetch<any>('/api/hospitals/nearby', { token }),
  
  triggerEmergency: (token: string) =>
    apiFetch<any>('/api/hospitals/emergency', {
      method: 'POST',
      token
    })
}

// Alerts endpoints
export const alertsApi = {
  getAlerts: (token: string) =>
    apiFetch<any>('/api/alerts', { token })
}

// Chat endpoints
export const chatApi = {
  sendMessage: (token: string, message: string) =>
    apiFetch<any>('/api/chat', {
      method: 'POST',
      token,
      body: { message }
    })
}

export function buildWebSocketUrl(userId: string) {
  const apiRoot = process.env.NEXT_PUBLIC_WS_BASE_URL || 'ws://localhost:8000/ws'
  return `${apiRoot}/${userId}`
}
