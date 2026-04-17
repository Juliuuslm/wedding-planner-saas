import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const u = await prisma.user.findUnique({
    where: { email: 'andrea@amweddingstudio.com' },
    include: { planner: true },
  })
  if (!u) {
    console.log('USER NOT FOUND')
    return
  }
  const ok = u.passwordHash
    ? await bcrypt.compare('password123', u.passwordHash)
    : false
  console.log({
    userId: u.id,
    email: u.email,
    role: u.role,
    hasPassword: !!u.passwordHash,
    passwordOk: ok,
    plannerId: u.plannerId,
    plannerName: u.planner?.nombre,
  })
}

main().finally(() => prisma.$disconnect())
