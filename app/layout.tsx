import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'GUDO Academy｜整聊學院',
    template: '%s | GUDO Academy',
  },
  description: '整聊認證課程全系列，幫助你透過整理與溝通改變生活',
  keywords: ['整聊', '整理', '收納', '課程', '推廣大使'],
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'GUDO Academy｜整聊學院',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-TW" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
