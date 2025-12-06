import { type NextRequest, NextResponse } from "next/server"
import { verifyAuth } from "@/lib/verify-auth"
import { findUserByEmail } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    const payload = verifyAuth(token) as any

    const user = await findUserByEmail(payload.email)
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    })
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 200 })
  }
}
