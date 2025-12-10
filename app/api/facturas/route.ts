import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // tu cliente de Prisma

export async function GET() {
  try {
    const incomes = await prisma.income.findMany({
      orderBy: { createdAt: "desc" },
    });
    const egresses = await prisma.egress.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ incomes, egresses });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al obtener facturas" }, { status: 500 });
  }
}
