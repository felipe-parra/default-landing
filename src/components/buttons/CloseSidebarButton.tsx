import { cn } from "@/lib/utils"
import { Button } from "konsta/react"
import React from "react"
import { IoClose } from "react-icons/io5"
import { MdMenu } from "react-icons/md"

export const CloseSidebarButton = ({
  showPanel,
  setShowPanel,
}: {
  showPanel: boolean
  setShowPanel: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  return (
    <Button
      className={cn("transition-all duration-500")}
      clear
      rounded
      onClick={() => setShowPanel(!showPanel)}
    >
      {showPanel ? (
        <IoClose className="w-6 h-6" />
      ) : (
        <MdMenu className="w-6 h-6" />
      )}
    </Button>
  )
}
