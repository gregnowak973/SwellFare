import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SwellFare - Find Cheap Flights to Perfect Swells',
  description: 'Match your surf desire with cheap flights to destinations with active swells',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

