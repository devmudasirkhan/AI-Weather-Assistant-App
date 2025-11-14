import './globals.css'
import React from 'react'

export const metadata = {
  title: 'Weather Assistant',
  description: 'AI Weather Assistant - starter'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <main className="w-full h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}
