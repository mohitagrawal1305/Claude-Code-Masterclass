"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react"
import { onAuthStateChanged, User } from "firebase/auth"
import { auth } from "@/lib/firebase/auth"

interface AuthContextValue {
  user: User | null
  loading: boolean
  isUpdating: boolean
  refetchUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const firstFire = useRef(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      if (firstFire.current) {
        setLoading(false)
        firstFire.current = false
      }
    })
    return unsubscribe
  }, [])

  async function refetchUser() {
    setIsUpdating(true)
    await auth.currentUser?.reload()
    setUser(auth.currentUser)
    setIsUpdating(false)
  }

  return (
    <AuthContext.Provider value={{ user, loading, isUpdating, refetchUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useUser(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (ctx === null) {
    throw new Error("useUser must be used within an AuthProvider")
  }
  return ctx
}
