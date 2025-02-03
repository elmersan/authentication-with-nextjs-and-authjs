'use server'
import { getUserByEmail } from '@/data/user'
import { prisma } from '@/lib/prisma'
import { RegisterSchema } from '@/schemas'
import bcryptjs from 'bcryptjs'

import * as z from 'zod'

export const registerUser = async (values: z.infer<typeof RegisterSchema>) => {
  try {
    const validatedFields = RegisterSchema.safeParse(values)

    if (!validatedFields.success) {
      return {
        ok: false,
        message: 'Campos inválidos'
      }
    }

    const { name, email, password } = validatedFields.data

    const hashedPassword = await bcryptjs.hash(password, 10)

    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      return {
        ok: false,
        message: 'El correo electrónico ya está en uso'
      }
    }

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email.toLowerCase(),
        password: hashedPassword
      }
    })

    return {
      ok: true,
      user: user,
      message: 'Usuario creado'
    }
  } catch (error) {
    console.error('Error al crear el usuario:', error)

    return {
      ok: false,
      message: 'No se pudo crear el usuario'
    }
  }
}
