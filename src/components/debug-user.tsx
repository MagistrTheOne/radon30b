"use client"

import { useUser } from '@clerk/nextjs'

export function DebugUser() {
  const { user } = useUser()
  
  if (!user) return <div>Не авторизован</div>
  
  return (
    <div className="p-4 bg-yellow-100 border border-yellow-300 rounded">
      <h3>Debug Info:</h3>
      <p><strong>Clerk ID:</strong> {user.id}</p>
      <p><strong>Email:</strong> {user.emailAddresses[0]?.emailAddress}</p>
      <p><strong>Name:</strong> {user.fullName}</p>
    </div>
  )
}
