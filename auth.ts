import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { authConfig } from './auth.config'
import { z } from 'zod'
import bcryptjs from 'bcryptjs'

import { prisma } from './lib/prisma'
import { LoginSchema } from './schemas'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Google,
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = LoginSchema.safeParse(credentials)

        if (!parsedCredentials.success) return null

        const { email, password } = parsedCredentials.data

        // Buscar el correo
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() }
        })
        if (!user) return null

        // Comparar las contraseñas
        if (!bcryptjs.compareSync(password, user.password ?? '')) return null

        // Regresar el usuario sin el password
        const { password: _, ...rest } = user

        return rest
      }
    })
  ]
})
