"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Log {
  id: number
  fileName: string
  invoiceType: string
  receiptNumber: string | null
  status: "SUCCESS" | "FAILED"
  errorMessage: string | null
  createdAt: string
}

interface LogsListProps {
  data: Log[]
}

export function LogsList({ data }: LogsListProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50 border-b border-gray-200">
          <TableRow className="border-gray-200 hover:bg-gray-50">
            <TableHead className="text-gray-700 font-semibold">Fecha</TableHead>
            <TableHead className="text-gray-700 font-semibold">Archivo</TableHead>
            <TableHead className="text-gray-700 font-semibold">Tipo</TableHead>
            <TableHead className="text-gray-700 font-semibold">Comprobante</TableHead>
            <TableHead className="text-gray-700 font-semibold">Estado</TableHead>
            <TableHead className="text-gray-700 font-semibold">Error</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((log) => (
            <TableRow key={log.id} className="border-gray-200 hover:bg-gray-50 transition-colors">
              <TableCell className="text-gray-900">
                {new Date(log.createdAt).toLocaleString("es-PY", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </TableCell>
              <TableCell className="text-gray-900 font-mono text-sm">{log.fileName}</TableCell>
              <TableCell className="text-gray-900">
                <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300">
                  {log.invoiceType}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-900 font-mono">
                {log.receiptNumber || "-"}
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    log.status === "SUCCESS"
                      ? "bg-green-100 text-green-700 border-green-300"
                      : "bg-red-100 text-red-700 border-red-300"
                  }
                >
                  {log.status === "SUCCESS" ? "✓ Éxito" : "✗ Fallo"}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-900 text-sm max-w-md">
                {log.errorMessage ? (
                  <span className="text-red-600 font-mono text-xs break-words">{log.errorMessage}</span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {data.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-gray-500">No hay logs para mostrar</p>
        </div>
      )}
    </div>
  )
}

