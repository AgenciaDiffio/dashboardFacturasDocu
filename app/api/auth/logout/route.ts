import { NextResponse } from "next/server"

export async function POST() {
  const res = NextResponse.json({ message: "Logged out" })
  res.cookies.set({
    name: "auth-token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  })
  return res
}
