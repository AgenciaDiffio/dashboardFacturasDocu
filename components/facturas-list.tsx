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
}

export function FacturasList({ data, type }: FacturasListProps) {
  const [selectedFactura, setSelectedFactura] = useState<Income | Egress | null>(null)
  const isEgress = type === "egress"

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50 border-b border-gray-200">
            <TableRow className="border-gray-200 hover:bg-gray-50">
              <TableHead className="text-gray-700 font-semibold">RUC</TableHead>
              <TableHead className="text-gray-700 font-semibold">Comprobante</TableHead>
              <TableHead className="text-gray-700 font-semibold">Timbrado</TableHead>
              {isEgress && <TableHead className="text-gray-700 font-semibold">Vencimiento</TableHead>}
              {isEgress && <TableHead className="text-gray-700 font-semibold">Sucursal</TableHead>}
              <TableHead className="text-gray-700 font-semibold">Divisa</TableHead>
              <TableHead className="text-gray-700 font-semibold">Condición</TableHead>
              <TableHead className="text-gray-700 font-semibold text-right">Monto</TableHead>
              <TableHead className="text-gray-700 font-semibold text-center">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index} className="border-gray-200 hover:bg-gray-50 transition-colors">
                <TableCell className="text-gray-900 font-mono">{item.ruc}</TableCell>
                <TableCell className="text-gray-900">{item.receiptNumber}</TableCell>
                <TableCell className="text-gray-900 font-mono">{item.stamped}</TableCell>
                {isEgress && <TableCell className="text-gray-900">{(item as Egress).dueDate}</TableCell>}
                {isEgress && (
                  <TableCell className="text-gray-900">
                    <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">
                      {(item as Egress).subsidiary}
                    </Badge>
                  </TableCell>
                )}
                <TableCell className="text-gray-900">
                  <Badge
                    variant="secondary"
                    className={
                      item.currency === "Guaranies"
                        ? "bg-gray-100 text-gray-700 border-gray-300"
                        : item.currency === "DOLAR"
                          ? "bg-green-100 text-green-700 border-green-300"
                          : "bg-blue-100 text-blue-700 border-blue-300"
                    }
                  >
                    {item.currency === "Guaranies" ? "Gs." : item.currency}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-900">
                  <Badge
                    variant="outline"
                    className={
                      item.condition === "Contado"
                        ? "bg-green-100 text-green-700 border-green-300"
                        : "bg-orange-100 text-orange-700 border-orange-300"
                    }
                  >
                    {item.condition}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-900 text-right font-semibold">
                  {item.currency === "Guaranies" ? "Gs. " : ""}
                  {Number.parseFloat(item.totalAmount).toLocaleString("es-PY", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFactura(item)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    Ver detalles
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {data.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No hay facturas para mostrar</p>
          </div>
        )}
      </div>

      {selectedFactura && (
        <FacturaModal factura={selectedFactura} type={type} onClose={() => setSelectedFactura(null)} />
      )}
    </>
  )
}
