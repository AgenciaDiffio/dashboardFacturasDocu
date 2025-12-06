import { verifyToken } from "./auth"

export function verifyAuth(token: string) {
  const payload = verifyToken(token)
  if (!payload) throw new Error("Token inválido")
  return payload
}
