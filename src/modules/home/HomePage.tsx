"use client"
import { Block, BlockTitle, Page } from "konsta/react"

export const HomePage = () => {
  return (
    <Page
      colors={{ bgIos: "bg-transparent" }}
      className="text-primary bott mt-safe-8"
    >
      <BlockTitle>Welcome to Konsta UI + Next.js!</BlockTitle>
      <Block strong inset outline>
        <p>Here comes my app</p>
      </Block>
    </Page>
  )
}
