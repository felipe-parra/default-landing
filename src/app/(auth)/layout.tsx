"use client"
import { ClerkProvider } from "@clerk/nextjs"
import { Page } from "konsta/react"
import type { ReactNode } from "react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <Page className="w-full h-full flex justify-center items-center mt-4">
        {children}
      </Page>
    </ClerkProvider>
  )
}
