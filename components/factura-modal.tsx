"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import type { Income, Egress } from "@/lib/types"

interface FacturaModalProps {
  factura: (Income & { id?: number }) | (Egress & { id?: number })
  type: "income" | "egress"
  onClose: () => void
  onUpdate?: () => void
}

type FieldDef = { key: string; label: string }

const incomeFields: FieldDef[] = [
  { key: "ven_tipimp", label: "Tipo Impuesto" },
  { key: "ven_gra05", label: "Monto Gravado 5%" },
  { key: "ven_iva05", label: "IVA 5%" },
  { key: "ven_disg05", label: "Descuento Gravado 5%" },
  { key: "cta_iva05", label: "Cuenta IVA 5%" },
  { key: "ven_rubgra", label: "Monto Gravado 10%" },
  { key: "ven_rubg05", label: "Monto Gravado 5% (Rubros)" },
  { key: "ven_disexe", label: "Descuento Exento" },
  { key: "ven_numero", label: "Número de Comprobante" },
  { key: "ven_imputa", label: "Imputación" },
  { key: "ven_sucurs", label: "Sucursal" },
  { key: "generar", label: "Generar" },
  { key: "form_pag", label: "Condición" },
  { key: "ven_centro", label: "Centro" },
  { key: "ven_clie", label: "RUC / Identificación" },
  { key: "ven_cuenta", label: "Cuenta" },
  { key: "ven_clinom", label: "Nombre o Razón Social" },
  { key: "ven_tipofa", label: "Tipo de Comprobante" },
  { key: "ven_fecha", label: "Fecha de Emisión" },
  { key: "ven_totfac", label: "Total Comprobante" },
  { key: "ven_exenta", label: "Monto No Gravado / Exento" },
  { key: "ven_gravad", label: "Monto Gravado 10%" },
  { key: "ven_iva", label: "IVA 10%" },
  { key: "ven_aux", label: "Auxiliar" },
  { key: "ven_retenc", label: "Retención" },
  { key: "ven_ctrl", label: "Control" },
  { key: "ven_con", label: "Con" },
  { key: "ven_cuota", label: "Cuota" },
  { key: "ven_fecven", label: "Fecha de Vencimiento" },
  { key: "cant_dias", label: "Cantidad de Días" },
  { key: "origen", label: "Origen" },
  { key: "cambio", label: "Cotización" },
  { key: "valor", label: "Valor" },
  { key: "moneda", label: "Moneda" },
  { key: "exen_dolar", label: "Exento en Dólar" },
  { key: "concepto", label: "Concepto" },
  { key: "cta_iva", label: "Cuenta IVA 10%" },
  { key: "cta_caja", label: "Cuenta Caja" },
  { key: "tkdesde", label: "Ticket Desde" },
  { key: "tkhasta", label: "Ticket Hasta" },
  { key: "caja", label: "Caja" },
  { key: "ven_disgra", label: "Descuento Gravado" },
  { key: "forma_devo", label: "Forma de Devolución" },
  { key: "ven_cuense", label: "Cuenta Vencida" },
  { key: "anular", label: "Anular" },
  { key: "reproceso", label: "Reproceso" },
  { key: "cuenta_exe", label: "Cuenta Exenta" },
  { key: "usu_ide", label: "Usuario" },
  { key: "rucvennrotim", label: "Timbrado del Comprobante" },
  { key: "ventirptip", label: "Tipo IRP" },
  { key: "clieasi", label: "Cliente Asociado" },
  { key: "ventirpgra", label: "IRP Gravado" },
  { key: "ventirpexe", label: "IRP Exento" },
  { key: "irpc", label: "IRPC" },
  { key: "ivasimplificado", label: "IVA Simplificado" },
  { key: "nroFacAso", label: "Número Factura Asociada" },
  { key: "TimFacAso", label: "Timbrado Factura Asociada" },
  { key: "createdAt", label: "Creado" },
]

const egressFields: FieldDef[] = [
  { key: "com_numero", label: "Número de Comprobante" },
  { key: "generar", label: "Generar" },
  { key: "cta_iva", label: "Cuenta IVA 10%" },
  { key: "cta_caja", label: "Cuenta Caja" },
  { key: "form_pag", label: "Condición" },
  { key: "com_imputa", label: "Imputación" },
  { key: "com_sucurs", label: "Sucursal" },
  { key: "com_centro", label: "Centro" },
  { key: "com_provee", label: "Proveedor / RUC" },
  { key: "com_cuenta", label: "Cuenta" },
  { key: "com_prvnom", label: "Nombre / Razón Social" },
  { key: "com_tipofa", label: "Tipo de Comprobante" },
  { key: "com_fecha", label: "Fecha de Emisión" },
  { key: "com_totfac", label: "Total Comprobante" },
  { key: "com_exenta", label: "Monto No Gravado / Exento" },
  { key: "com_gravad", label: "Monto Gravado 10%" },
  { key: "com_iva", label: "IVA 10%" },
  { key: "com_import", label: "Importe Convertido" },
  { key: "com_aux", label: "Auxiliar" },
  { key: "com_con", label: "Código" },
  { key: "com_cuota", label: "Cuota" },
  { key: "com_fecven", label: "Fecha Vencimiento" },
  { key: "com_ordenp", label: "Orden de Pago" },
  { key: "cant_dias", label: "Cantidad de Días" },
  { key: "com_x", label: "Campo X" },
  { key: "moneda", label: "Moneda" },
  { key: "cambio", label: "Cotización" },
  { key: "valor", label: "Valor" },
  { key: "origen", label: "Origen" },
  { key: "exen_dolar", label: "Exento en Dólar" },
  { key: "com_disexe", label: "Descuento Exento" },
  { key: "com_disgra", label: "Descuento Gravado" },
  { key: "forma_devo", label: "Forma de Devolución" },
  { key: "retencion", label: "Retención" },
  { key: "porcentaje", label: "Porcentaje" },
  { key: "reproceso", label: "Reproceso" },
  { key: "cuenta_exe", label: "Cuenta Exenta" },
  { key: "com_tipimp", label: "Tipo Impuesto" },
  { key: "com_gra05", label: "Monto Gravado 5%" },
  { key: "com_iva05", label: "IVA 5%" },
  { key: "com_disg05", label: "Descuento Gravado 5%" },
  { key: "cta_iva05", label: "Cuenta IVA 5%" },
  { key: "com_rubgra", label: "Rubros Gravado 10%" },
  { key: "com_rubgra05", label: "Rubros Gravado 5%" },
  { key: "com_ctag05", label: "Cuenta Gravado 5%" },
  { key: "com_rubexe", label: "Rubros Exento" },
  { key: "com_saldo", label: "Saldo" },
  { key: "com_timbra", label: "Timbrado" },
  { key: "RetNroFac", label: "Retención Nro Fac" },
  { key: "RetRetFec", label: "Fecha Retención" },
  { key: "RetTim", label: "Retención Timbrado" },
  { key: "RetIva", label: "Retención IVA" },
  { key: "RetRen", label: "Retención Renta" },
  { key: "RetIvaCon", label: "Retención IVA Concepto" },
  { key: "RetRetCon", label: "Retención Concepto" },
  { key: "TipoExport", label: "Tipo Exportación" },
  { key: "Retiva05", label: "Retención IVA 5%" },
  { key: "IrpTip", label: "IRP Tipo" },
  { key: "IrpInc", label: "IRP Ingreso" },
  { key: "IrpMon", label: "IRP Moneda" },
  { key: "IrpTip2", label: "IRP Tipo 2" },
  { key: "IrpInc2", label: "IRP Ingreso 2" },
  { key: "IrpMon2", label: "IRP Moneda 2" },
  { key: "irpc", label: "IRPC" },
  { key: "ivasimplificado", label: "IVA Simplificado" },
  { key: "comnroncaso", label: "Nro Caso" },
  { key: "comtimnncaso", label: "Timbrado Caso" },
  { key: "comctaban", label: "Cuenta Banco" },
  { key: "combanraz", label: "Banco Razón" },
  { key: "comvirtual", label: "Virtual" },
  { key: "com_timven", label: "Timbrado Vencimiento" },
  { key: "createdAt", label: "Creado" },
]

function formatValue(value: unknown) {
  if (value === undefined || value === null || value === "") return "-"
  if (typeof value === "boolean") return value ? "Sí" : "No"
  if (typeof value === "number") return value.toString()
  return String(value)
}

export function FacturaModal({ factura, type, onClose }: FacturaModalProps) {
  const isEgress = type === "egress"
  const fields = isEgress ? egressFields : incomeFields

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-5xl bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-900 flex items-center justify-between">
            <span>Detalle {isEgress ? "Egreso" : "Ingreso"}</span>
            {factura.id && <span className="text-sm text-gray-500">ID: {factura.id}</span>}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {isEgress ? "Factura de Compras" : "Factura de Ventas"} — se muestran todos los campos disponibles.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {fields.map((field) => (
            <div key={field.key} className="border border-gray-200 rounded-lg p-4">
              <Label className="text-sm text-gray-600 font-medium">{field.label}</Label>
              <p className="text-base font-semibold text-gray-900 mt-2">
                {formatValue((factura as Record<string, unknown>)[field.key])}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
