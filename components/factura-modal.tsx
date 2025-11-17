"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { Income, Egress } from "@/lib/types"

interface FacturaModalProps {
  factura: Income | Egress
  type: "income" | "egress"
  onClose: () => void
}

export function FacturaModal({ factura, type, onClose }: FacturaModalProps) {
  const isEgress = type === "egress"
  const egressData = factura as Egress

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Detalles de Factura - {factura.receiptNumber}</DialogTitle>
          <DialogDescription className="text-gray-600">RUC: {factura.ruc}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información General */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 font-medium">RUC</p>
              <p className="text-lg font-semibold text-gray-900">{factura.ruc}</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 font-medium">Comprobante</p>
              <p className="text-lg font-semibold text-gray-900">{factura.receiptNumber}</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 font-medium">Timbrado</p>
              <p className="text-lg font-semibold text-gray-900 font-mono">{factura.stamped}</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 font-medium">Sucursal</p>
              <Badge variant="outline" className="mt-2 bg-gray-100 text-gray-700 border-gray-300">
                {factura.subsidiary}
              </Badge>
            </div>
          </div>

          {/* Datos Financieros */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Datos Financieros</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 font-medium">Divisa</p>
                <Badge className="mt-2 bg-blue-100 text-blue-700 border-blue-300">
                  {factura.currency === "Guaranies" ? "Guaraníes" : factura.currency}
                </Badge>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 font-medium">Condición</p>
                <Badge className="mt-2 bg-green-100 text-green-700 border-green-300">{factura.condition}</Badge>
              </div>
              {Number.parseFloat(factura.cotization) !== 1 && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 font-medium">Cotización</p>
                  <p className="text-lg font-semibold text-gray-900 mt-2">
                    {Number.parseFloat(factura.cotization).toLocaleString("es-PY", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              )}
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 font-medium">Monto Total</p>
                <p className="text-lg font-semibold text-gray-900 mt-2">
                  {factura.currency === "Guaranies" ? "Gs. " : ""}
                  {Number.parseFloat(factura.totalAmount).toLocaleString("es-PY", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Información específica de Egresos */}
          {isEgress && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Información de Egreso</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 font-medium">Vencimiento</p>
                  <p className="text-lg font-semibold text-gray-900 mt-2">{egressData.dueDate}</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 font-medium">Tipo</p>
                  <Badge className="mt-2 bg-purple-100 text-purple-700 border-purple-300">
                    {egressData.isVirtual ? "Virtual" : "Física"}
                  </Badge>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 font-medium">Retención</p>
                  <Badge
                    className={`mt-2 ${egressData.notRetain ? "bg-red-100 text-red-700 border-red-300" : "bg-green-100 text-green-700 border-green-300"}`}
                  >
                    {egressData.notRetain ? "No Retiene" : "Retiene"}
                  </Badge>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 font-medium">Gasto Deducible</p>
                  <Badge
                    className={`mt-2 ${egressData.nonDeductibleExpense ? "bg-yellow-100 text-yellow-700 border-yellow-300" : "bg-green-100 text-green-700 border-green-300"}`}
                  >
                    {egressData.nonDeductibleExpense ? "No Deducible" : "Deducible"}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
