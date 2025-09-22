'"use client'

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import { Page, Navbar, Panel, Block, Link } from "konsta/react"
import { BiUser } from "react-icons/bi"
import { BsAlphabet, BsBug } from "react-icons/bs"

import { CloseSidebarButton } from "../buttons/CloseSidebarButton"
import { LogoutButton } from "../buttons/LogoutButton"

interface SidebarProps {
  panelOpened: boolean
  setPanelOpened: React.Dispatch<React.SetStateAction<boolean>>
}
export const Sidebar = ({ panelOpened, setPanelOpened }: SidebarProps) => {
  const handleLogout = () => {
    setPanelOpened(false)
  }
  return (
    <Panel
      side="left"
      floating
      opened={panelOpened}
      onBackdropClick={() => setPanelOpened(false)}
    >
      <Page
        colors={{ bgIos: "bg-transparent" }}
        className="no-safe-areas-top no-safe-areas-bottom"
      >
        <Navbar
          title="Menu"
          right={
            <CloseSidebarButton
              showPanel={panelOpened}
              setShowPanel={setPanelOpened}
            />
          }
        />
        <Block className="space-y-6">
          <SignedOut>
            <p>
              You are not signed in. Please{" "}
              <Link onClick={() => setPanelOpened(false)}>
                <SignInButton />
              </Link>
            </p>
          </SignedOut>
          <SignedIn>
            <Block className="space-y-4 grid grid-cols-1 self-start text-left w-full">
              <Link href="/dashboard" onClick={() => setPanelOpened(false)}>
                <BsAlphabet /> Dashboard
              </Link>
              <Link href="/profile" onClick={() => setPanelOpened(false)}>
                <BiUser /> Profile
              </Link>
              <Link href="/useeffect-demo" onClick={() => setPanelOpened(false)}>
                <BsBug /> useEffect Demo
              </Link>
              <LogoutButton handleClick={handleLogout} />
            </Block>
          </SignedIn>
        </Block>
      </Page>
    </Panel>
  )
}
