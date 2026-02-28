import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Outfit } from 'next/font/google'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SwellFare - Find Cheap Flights to Perfect Swells',
  description: 'Match your surf desire with cheap flights to destinations with active swells',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="min-h-screen bg-surf-bg text-slate-100 antialiased">
        {children}
      </body>
    </html>
  )
}
