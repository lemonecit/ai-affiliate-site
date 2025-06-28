import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Affiliate Store - Smart Product Recommendations',
  description: 'AI-driven affiliate marketing platform with Amazon and AliExpress integration',
  keywords: 'affiliate, amazon, aliexpress, AI, product recommendations, deals',
  authors: [{ name: 'AI Affiliate Store' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
}
