import NextAuth, { type DefaultSession } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Credentials from 'next-auth/providers/credentials'
import Resend from 'next-auth/providers/resend'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

declare module 'next-auth' {
  interface Session {
    user: {
      role: 'planner' | 'client' | 'vendor'
      plannerId: string | null
      clientId: string | null
      vendorId: string | null
    } & DefaultSession['user']
  }
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (raw) => {
        const parsed = credentialsSchema.safeParse(raw)
        if (!parsed.success) return null

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        })
        if (!user?.passwordHash) return null

        const ok = await bcrypt.compare(parsed.data.password, user.passwordHash)
        if (!ok) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          image: user.image ?? undefined,
        }
      },
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.AUTH_EMAIL_FROM,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id! },
          select: {
            role: true,
            plannerId: true,
            clientId: true,
            vendorId: true,
          },
        })
        if (dbUser) {
          token.role = dbUser.role
          token.plannerId = dbUser.plannerId
          token.clientId = dbUser.clientId
          token.vendorId = dbUser.vendorId
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as 'planner' | 'client' | 'vendor') ?? 'planner'
        session.user.plannerId = (token.plannerId as string | null) ?? null
        session.user.clientId = (token.clientId as string | null) ?? null
        session.user.vendorId = (token.vendorId as string | null) ?? null
      }
      return session
    },
  },
})
