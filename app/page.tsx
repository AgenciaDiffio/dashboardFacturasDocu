"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Dashboard } from "@/components/dashboard"

export default function Home() {
  const router = useRouter()
  const { isLogged } = useAuth()

  useEffect(() => {
    if (isLogged === false) router.push("/login")
  }, [isLogged])

  if (isLogged === null) return null // loading inicial

  return <Dashboard />
}

