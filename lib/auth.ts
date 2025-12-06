import jwt from "jsonwebtoken"

const SECRET = "MI_SECRETO_SUPER_SEGURO"

export function createToken(user: { id: number; email: string; username: string }) {
  return jwt.sign(user, SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET)
  } catch {
    return null
  }
}
