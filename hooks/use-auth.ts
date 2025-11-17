"use client"

import { useState, useEffect } from "react"

export interface User {
  email: string
  name: string
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load auth state from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
        setIsAuthenticated(true)
      } catch (error) {
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Mock authentication - accept any valid email/password
    if (email && email.includes("@") && password.length >= 6) {
      const newUser = {
        email,
        name: email.split("@")[0],
      }
      setUser(newUser)
      setIsAuthenticated(true)
      localStorage.setItem("user", JSON.stringify(newUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("user")
  }

  return {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
  }
}
