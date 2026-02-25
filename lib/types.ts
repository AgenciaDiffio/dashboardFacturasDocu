export type FacturaRecord = {
  id?: number
  createdAt?: string | null
  [key: string]: string | number | boolean | null | undefined
}

export type Income = FacturaRecord
export type Egress = FacturaRecord
