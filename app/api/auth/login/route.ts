import { NextResponse } from "next/server"
import { createToken } from "@/lib/auth"
import { findUserByEmail, verifyPassword } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ message: "Faltan datos" }, { status: 400 })
    }

    const user = await findUserByEmail(email)
    if (!user) {
      return NextResponse.json({ message: "Email o contraseña inválidos" }, { status: 401 })
    }

    const isPasswordValid = await verifyPassword(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Email o contraseña inválidos" }, { status: 401 })
    }

    const token = createToken({
      id: user.id,
      email: user.email,
      username: user.username,
    })

    const res = NextResponse.json({
      message: "Login exitoso",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    })

    res.cookies.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 días
    })

    return res
  } catch (error) {
    console.error("[login] Error:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
