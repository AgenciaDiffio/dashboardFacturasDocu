import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAuth } from "@/lib/verify-auth"
import { findUserByEmail } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ incomes: [], egresses: [], logs: [] })
    }

    const payload = verifyAuth(token) as any
    const user = await findUserByEmail(payload.email)

    if (!user) {
      return NextResponse.json({ incomes: [], egresses: [], logs: [] })
    }

    const incomes = await prisma.income.findMany({
      where: {
        OR: [{ userId: user.id }, { userId: null }],
      },
      orderBy: { createdAt: "desc" },
    })
    const egresses = await prisma.egress.findMany({
      where: {
        OR: [{ userId: user.id }, { userId: null }],
      },
      orderBy: { createdAt: "desc" },
    })
    const logs = await prisma.invoiceProcessLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    })

    return NextResponse.json({ incomes, egresses, logs })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error al obtener facturas" }, { status: 500 })
  }
}
