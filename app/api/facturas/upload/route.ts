import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyAuth } from "@/lib/verify-auth"
import { findUserByEmail } from "@/lib/db"

const incomeFields = [
  "ven_tipimp",
  "ven_gra05",
  "ven_iva05",
  "ven_disg05",
  "cta_iva05",
  "ven_rubgra",
  "ven_rubg05",
  "ven_disexe",
  "ven_numero",
  "ven_imputa",
  "ven_sucurs",
  "generar",
  "form_pag",
  "ven_centro",
  "ven_clie",
  "ven_cuenta",
  "ven_clinom",
  "ven_tipofa",
  "ven_fecha",
  "ven_totfac",
  "ven_exenta",
  "ven_gravad",
  "ven_iva",
  "ven_aux",
  "ven_retenc",
  "ven_ctrl",
  "ven_con",
  "ven_cuota",
  "ven_fecven",
  "cant_dias",
  "origen",
  "cambio",
  "valor",
  "moneda",
  "exen_dolar",
  "concepto",
  "cta_iva",
  "cta_caja",
  "tkdesde",
  "tkhasta",
  "caja",
  "ven_disgra",
  "forma_devo",
  "ven_cuense",
  "anular",
  "reproceso",
  "cuenta_exe",
  "usu_ide",
  "rucvennrotim",
  "ventirptip",
  "clieasi",
  "ventirpgra",
  "ventirpexe",
  "irpc",
  "ivasimplificado",
  "nroFacAso",
  "TimFacAso",
]

const incomeDefaults: Record<string, unknown> = {
  ven_tipimp: "I",
  ven_sucurs: "1",
  generar: 0,
  concepto: "VENTAS",
  TimFacAso: 0,
  anular: false,
  reproceso: false,
}

const egressFields = [
  "com_numero",
  "generar",
  "cta_iva",
  "cta_caja",
  "form_pag",
  "com_imputa",
  "com_sucurs",
  "com_centro",
  "com_provee",
  "com_cuenta",
  "com_prvnom",
  "com_tipofa",
  "com_fecha",
  "com_totfac",
  "com_exenta",
  "com_gravad",
  "com_iva",
  "com_import",
  "com_aux",
  "com_con",
  "com_cuota",
  "com_fecven",
  "com_ordenp",
  "cant_dias",
  "com_x",
  "moneda",
  "cambio",
  "valor",
  "origen",
  "exen_dolar",
  "com_disexe",
  "com_disgra",
  "forma_devo",
  "retencion",
  "porcentaje",
  "reproceso",
  "cuenta_exe",
  "com_tipimp",
  "com_gra05",
  "com_iva05",
  "com_disg05",
  "cta_iva05",
  "com_rubgra",
  "com_rubgra05",
  "com_ctag05",
  "com_rubexe",
  "com_saldo",
  "com_timbra",
  "RetNroFac",
  "RetRetFec",
  "RetTim",
  "RetIva",
  "RetRen",
  "RetIvaCon",
  "RetRetCon",
  "TipoExport",
  "Retiva05",
  "IrpTip",
  "IrpInc",
  "IrpMon",
  "IrpTip2",
  "IrpInc2",
  "IrpMon2",
  "irpc",
  "ivasimplificado",
  "comnroncaso",
  "comtimnncaso",
  "comctaban",
  "combanraz",
  "comvirtual",
  "com_timven",
]

const egressDefaults: Record<string, unknown> = {
  generar: 0,
  com_fecven: "1753-01-01",
  cant_dias: 0,
  com_tipimp: "L",
  reproceso: false,
  comvirtual: false,
}

function normalizeRecord(record: Record<string, unknown>, fields: string[], defaults: Record<string, unknown>) {
  const normalized: Record<string, unknown> = {}
  fields.forEach((field) => {
    const value = record?.[field]
    normalized[field] =
      value === undefined || value === "" || value === null ? defaults[field] ?? null : value
  })
  return normalized
}

export async function POST(request: NextRequest) {
  try {
    // Obtener usuario logueado desde el token
    const token = request.cookies.get("auth-token")?.value
    let userId: number | null = null

    if (token) {
      try {
        const payload = verifyAuth(token) as any
        const user = await findUserByEmail(payload.email)
        if (user) {
          userId = user.id
        }
      } catch (err) {
        console.error("Error verificando usuario en upload:", err)
      }
    }

    // Reenviar el request directamente a PCG
    const pcgUrl = process.env.PCG_API_URL || "http://localhost:3000"
    
    // Obtener el body del request original
    const contentType = request.headers.get("content-type") || ""
    const body = await request.arrayBuffer()
    
    const response = await fetch(`${pcgUrl}/api/extractPDF`, {
      method: "POST",
      headers: {
        "Content-Type": contentType,
      },
      body: body,
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = "Error al procesar factura"
      try {
        const errorJson = JSON.parse(errorText)
        errorMessage = errorJson.error || errorMessage
      } catch {
        errorMessage = errorText || errorMessage
      }
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      )
    }

    const result = await response.json()

    const rawIncomes = Array.isArray(result.incomes)
      ? result.incomes
      : Array.isArray(result.ventas)
        ? result.ventas
        : []
    const rawEgresses = Array.isArray(result.egresses)
      ? result.egresses
      : Array.isArray(result.compras)
        ? result.compras
        : []

    const normalizedIncomes = rawIncomes.map((row: Record<string, unknown>) =>
      normalizeRecord(row, incomeFields, incomeDefaults)
    )
    const normalizedEgresses = rawEgresses.map((row: Record<string, unknown>) =>
      normalizeRecord(row, egressFields, egressDefaults)
    )

    const incomesWithUser = normalizedIncomes.map((row: Record<string, unknown>) => ({
      ...row,
      userId,
    }))

    const egressesWithUser = normalizedEgresses.map((row: Record<string, unknown>) => ({
      ...row,
      userId,
    }))

    let savedIncomes = 0
    let savedEgresses = 0

    if (incomesWithUser.length) {
      try {
        await prisma.income.createMany({ data: incomesWithUser })
        savedIncomes = incomesWithUser.length
      } catch (err) {
        console.error("Error guardando ingresos normalizados", err)
      }
    }

    if (egressesWithUser.length) {
      try {
        await prisma.egress.createMany({ data: egressesWithUser })
        savedEgresses = egressesWithUser.length
      } catch (err) {
        console.error("Error guardando egresos normalizados", err)
      }
    }

    return NextResponse.json({
      ok: true,
      incomes: normalizedIncomes,
      egresses: normalizedEgresses,
      saved: { incomes: savedIncomes, egresses: savedEgresses },
      raw: result,
    })
  } catch (error) {
    console.error("Error en upload:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al subir factura" },
      { status: 500 }
    )
  }
}

