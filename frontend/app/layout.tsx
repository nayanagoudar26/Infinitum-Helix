import './globals.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { AuthProvider } from '@/components/auth-provider'

export const metadata: Metadata = {
  title: 'Infinitum Helix',
  description: 'AI-powered disease prediction and emergency assistance platform'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-shell text-white antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
