import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Infinitum Helix',
    short_name: 'Helix Health',
    description: 'AI-powered disease prediction and emergency assistance',
    start_url: '/',
    display: 'standalone',
    background_color: '#07131f',
    theme_color: '#07131f'
  }
}
