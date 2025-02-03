import type { NextAuthConfig } from 'next-auth'
import { prisma } from './lib/prisma'
import { PrismaAdapter } from '@auth/prisma-adapter'

export const authConfig = {
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },
  adapter: PrismaAdapter(prisma),
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.data = user
      }

      return token
    },

    session({ session, token, user }) {
      session.user = token.data as any
      return session
    }
  },
  providers: [], // Add providers with an empty array for now,
  session: {
    strategy: 'jwt'
  }
} satisfies NextAuthConfig
