"use client"

import { useState, useEffect, useCallback } from "react"

interface User {
  id: number
  email: string
  username: string
}

export function useAuth() {
  const [isLogged, setIsLogged] = useState<boolean | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
      })

      if (!res.ok) {
        setIsLogged(false)
        setUser(null)
        return
      }

      const data = await res.json()
      if (data.user) {
        setUser(data.user)
        setIsLogged(true)
      } else {
        setIsLogged(false)
        setUser(null)
      }
    } catch {
      setIsLogged(false)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })

      if (!res.ok) return false

      await checkAuth()
      return true
    } catch {
      return false
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
    } catch {
      console.error("Logout error")
    } finally {
      setIsLogged(false)
      setUser(null)
    }
  }

  const register = async (username: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
        credentials: "include",
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Error al registrar")
      }

      await checkAuth()
      return true
    } catch (error) {
      throw error
    }
  }

  return { isLogged, user, loading, login, logout, register }
}
