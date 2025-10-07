import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"

import { getSiteInfo } from "@/lib/metadata"
import { LayoutProvider } from "@/components/layouts/LayoutProvider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const siteInfo = getSiteInfo()

export const metadata: Metadata = {
  title: siteInfo.title,
  description: siteInfo.description,
  keywords: siteInfo.keywords,
  authors: [{ name: siteInfo.author, url: siteInfo.url }],
  openGraph: {
    title: siteInfo.title,
    description: siteInfo.description,
    url: siteInfo.url,
    siteName: siteInfo.name,
    images: [
      {
        url: siteInfo.ogImage,
        width: 1200,
        height: 630,
        alt: siteInfo.title,
      },
    ],
    locale: siteInfo.language,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteInfo.title,
    description: siteInfo.description,
    images: [siteInfo.ogImage],
  },
  icons: {
    icon: siteInfo.favicon,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang={siteInfo.language}>
        <head>
          <script
            async
            crossOrigin="anonymous"
            src="//unpkg.com/react-scan/dist/auto.global.js"
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <LayoutProvider>{children}</LayoutProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
