"use client"

import { UserButton } from '@clerk/nextjs'

export function UserButtonWrapper() {
  return (
    <UserButton 
      appearance={{
        elements: {
          avatarBox: "w-8 h-8"
        }
      }}
    />
  )
}
