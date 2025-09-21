"use client"

import { useState, type ReactNode } from "react"
import { App, Page, Navbar } from "konsta/react"
import { Sidebar } from "../navbars/Sidebar"
import Link from "next/link"
import { getNavigationData } from "@/lib/metadata"
import { useTheme } from "@/hooks/useTheme"
import { CloseSidebarButton } from "../buttons/CloseSidebarButton"

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const navigation = getNavigationData()
  const [showPanel, setShowPanel] = useState(false)
  const { isDark } = useTheme()

  return (
    <App theme="ios" dark={isDark} className="k-ios " safeAreas>
      <Navbar
        className="text-primary"
        title={
          <Link href={navigation.header.dashboard.href}>
            {navigation.header.dashboard.text}
          </Link>
        }
        right={
          !showPanel && (
            <CloseSidebarButton
              showPanel={showPanel}
              setShowPanel={setShowPanel}
            />
          )
        }
      />
      <Page className="safe-areas-top mt-safe-8">{children}</Page>
      <Sidebar panelOpened={showPanel} setPanelOpened={setShowPanel} />
    </App>
  )
}
