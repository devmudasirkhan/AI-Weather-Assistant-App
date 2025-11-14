import './globals.css'
import React from 'react'

export const metadata = {
  title: 'Weather Assistant',
  description: 'AI Weather Assistant - starter'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <main className="w-full p-4">
          {children}
        </main>
      </body>
    </html>
  )
}
