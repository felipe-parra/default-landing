"use client"

import { useUser } from "@clerk/nextjs"
import { Block, BlockTitle, Page } from "konsta/react"

export const ProfilePage = () => {
  const user = useUser()
  return (
    <Page className="" colors={{ bgIos: "bg-transparent" }}>
      <BlockTitle>Profile Page</BlockTitle>
      <Block strong inset outline>
        <p>This is the profile page content.</p>
        {user.isSignedIn ? (  
          <div>
            <p>
              Name: {user.user.firstName} {user.user.lastName}
            </p>
            <p>Email: {user.user.primaryEmailAddress?.emailAddress}</p>
          </div>
        ) : (
          <p>User is not signed in.</p>
        )}
      </Block>
    </Page>
  )
}
