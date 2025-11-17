"use client"

import { useState, useEffect } from "react"

export function useAuth() {
  const [isLogged, setIsLogged] = useState<boolean | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("logged")
    setIsLogged(stored === "true")
  }, [])

  const login = async (email: string, password: string) => {
    if (!email || password.length < 6) return false

    localStorage.setItem("logged", "true")
    setIsLogged(true)
    return true
  }

  const logout = () => {
    localStorage.removeItem("logged")
    setIsLogged(false)
  }

  return { isLogged, login, logout }
}
