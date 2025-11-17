export type Income = {
  ruc: string
  subsidiary: "ZONA FRANCA" | "matriz"
  receiptNumber: string
  stamped: string
  currency: "Guaranies" | "REAL" | "DOLAR"
  condition: "Contado" | "Crédito"
  cotization: string
  totalAmount: string
}

export type Egress = {
  ruc: string
  subsidiary: "ZONA FRANCA" | "matriz"
  receiptNumber: string
  stamped: string
  dueDate: string
  isVirtual: boolean
  notRetain: boolean
  nonDeductibleExpense: boolean
  currency: "Guaranies" | "REAL" | "DOLAR"
  condition: "Contado" | "Crédito"
  cotization: string
  totalAmount: string
}
