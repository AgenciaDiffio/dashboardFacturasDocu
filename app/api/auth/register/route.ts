import { NextResponse } from "next/server"
import { createToken } from "@/lib/auth"
import { findUserByEmail, findUserByUsername, createUser } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { email, username, password } = await req.json()

    if (!email || !username || !password) {
      return NextResponse.json({ message: "Todos los campos son requeridos" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 })
    }

    const existingEmail = await findUserByEmail(email)
    if (existingEmail) {
      return NextResponse.json({ message: "El email ya está en uso" }, { status: 400 })
    }

    const existingUsername = await findUserByUsername(username)
    if (existingUsername) {
      return NextResponse.json({ message: "El nombre de usuario ya está en uso" }, { status: 400 })
    }

    const newUser = await createUser(email, username, password)

    const token = createToken({
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
    })

    const response = NextResponse.json({
      message: "Usuario registrado exitosamente",
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
      },
    })

    response.cookies.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 días
    })

    return response
  } catch (error) {
    console.error("[register] Error:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
