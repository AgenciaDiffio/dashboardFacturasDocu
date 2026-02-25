"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Income, Egress } from "@/lib/types"
import { FacturaModal } from "@/components/factura-modal"

interface FacturasListProps {
  data: Income[] | Egress[]
  type: "income" | "egress"
  variant?: "summary" | "full"
  onUpdate?: () => void
}

const incomeSummaryFields = [
  { key: "ven_clie", label: "RUC / Identificación" },
  { key: "ven_numero", label: "Comprobante" },
  { key: "rucvennrotim", label: "Timbrado" },
  { key: "ven_fecha", label: "Fecha Emisión" },
  { key: "form_pag", label: "Condición" },
  { key: "ven_clinom", label: "Nombre / Razón Social" },
  { key: "ven_totfac", label: "Total" },
  { key: "moneda", label: "Divisa" },
]

const egressSummaryFields = [
  { key: "com_provee", label: "RUC / Identificación" },
  { key: "com_numero", label: "Comprobante" },
  { key: "com_timbra", label: "Timbrado" },
  { key: "com_fecha", label: "Fecha Emisión" },
  { key: "form_pag", label: "Condición" },
  { key: "com_prvnom", label: "Nombre / Razón Social" },
  { key: "com_totfac", label: "Total" },
  { key: "moneda", label: "Divisa" },
]

const parseNumeric = (value: unknown) => {
  if (value === null || value === undefined) return null
  if (typeof value === "number") return Number.isFinite(value) ? value : null
  const cleaned = String(value).replace(/\./g, "").replace(",", ".")
  const parsed = Number(cleaned)
  return Number.isNaN(parsed) ? null : parsed
}

function formatCurrency(value: unknown, currency: unknown) {
  const parsed = parseNumeric(value)
  if (parsed === null) return value !== undefined && value !== null && value !== "" ? String(value) : "-"
  const prefix = currency === "Guaranies" || currency === "PYG" ? "Gs. " : ""
  return `${prefix}${parsed.toLocaleString("es-PY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function renderBadge(text?: string | number | null) {
  if (text === undefined || text === null || text === "") return "-"
  return (
    <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">
      {text}
    </Badge>
  )
}

export function FacturasList({ data, type, variant = "summary", onUpdate }: FacturasListProps) {
  const [selectedFactura, setSelectedFactura] = useState<(Income & { id?: number }) | (Egress & { id?: number }) | null>(null)
  const isEgress = type === "egress"
  const fields = isEgress ? egressSummaryFields : incomeSummaryFields

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta factura?")) return

    try {
      const endpoint = type === "income" ? `/api/facturas/income/${id}` : `/api/facturas/egress/${id}`
      const res = await fetch(endpoint, { method: "DELETE" })
      if (res.ok) {
        onUpdate?.()
      } else {
        alert("Error al eliminar la factura")
      }
    } catch (err) {
      console.error(err)
      alert("Error al eliminar la factura")
    }
  }

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50 border-b border-gray-200">
            <TableRow className="border-gray-200 hover:bg-gray-50">
              {fields.map((field) => (
                <TableHead key={field.key} className="text-gray-700 font-semibold">
                  {field.label}
                </TableHead>
              ))}
              <TableHead className="text-gray-700 font-semibold text-center">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => {
              const itemWithId = item as (Income & { id?: number }) | (Egress & { id?: number })
              const currency = (item as Record<string, unknown>)["moneda"]
              return (
                <TableRow key={itemWithId.id || Math.random()} className="border-gray-200 hover:bg-gray-50 transition-colors">
                  {fields.map((field) => {
                    const value = (item as Record<string, unknown>)[field.key]
                    if (field.key === "moneda") {
                      return (
                        <TableCell key={field.key} className="text-gray-900">
                          {renderBadge(value as string)}
                        </TableCell>
                      )
                    }
                    if (field.key === "ven_totfac" || field.key === "com_totfac") {
                      return (
                        <TableCell key={field.key} className="text-gray-900 text-right font-semibold">
                          {formatCurrency(value, currency)}
                        </TableCell>
                      )
                    }
                    if (field.key === "form_pag") {
                      return (
                        <TableCell key={field.key} className="text-gray-900">
                          {renderBadge(value as string)}
                        </TableCell>
                      )
                    }
                    return (
                      <TableCell key={field.key} className="text-gray-900">
                        {value !== undefined && value !== null && value !== "" ? String(value) : "-"}
                      </TableCell>
                    )
                  })}
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFactura(itemWithId)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        Ver
                      </Button>
                      {variant === "full" && itemWithId.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(itemWithId.id!)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Eliminar
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {data.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No hay facturas para mostrar</p>
          </div>
        )}
      </div>

      {selectedFactura && (
        <FacturaModal
          factura={selectedFactura}
          type={type}
          onClose={() => setSelectedFactura(null)}
          onUpdate={onUpdate}
        />
      )}
    </>
  )
}
