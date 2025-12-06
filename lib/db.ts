import { prisma } from "@/lib/prisma" // asegúrate de exportar PrismaClient desde lib/prisma

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } })
}

export async function findUserByUsername(username: string) {
  return prisma.user.findUnique({ where: { username } })
}


import bcrypt from "bcryptjs"

export async function verifyPassword(plainPassword: string, hash: string) {
  return bcrypt.compare(plainPassword, hash)
}



export async function createUser(email: string, username: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10)
  return prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
    },
  })
}
