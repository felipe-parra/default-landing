import { SignOutButton } from "@clerk/nextjs"
import React from "react"
import { MdLogout } from "react-icons/md"

interface LogoutButtonProps {
  handleClick?: () => void
}

export const LogoutButton = ({ handleClick }: LogoutButtonProps) => {
  return (
    <SignOutButton>
      <button
        className="k-button k-button-tonal brand-red flex items-center gap-2"
        onClick={handleClick}
      >
        <MdLogout />
        Logout
      </button>
    </SignOutButton>
  )
}
