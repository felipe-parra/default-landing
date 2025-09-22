import { SignOutButton } from "@clerk/nextjs"
import { Button } from "konsta/react"
import React from "react"
import { MdLogout } from "react-icons/md"

interface LogoutButtonProps {
  handleClick?: () => void
}

export const LogoutButton = ({ handleClick }: LogoutButtonProps) => {
  return (
    <SignOutButton>
      <Button
        className="brand-red flex items-center gap-2"
        onClick={handleClick}
        tonal
      >
        <MdLogout />
        Logout
      </Button>
    </SignOutButton>
  )
}
