'use server'

import { signIn } from '@/auth'
import { getUserByEmail } from '@/data/user'
import { LoginSchema } from '@/schemas'
import { AuthError } from 'next-auth'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import * as z from 'zod'

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn('credentials', formData)
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.'
        default:
          return 'Something went wrong.'
      }
    }
    throw error
  }
}

export const login = async (values: z.infer<typeof LoginSchema>) => {
  try {
    const validatedFields = LoginSchema.safeParse(values)

    if (!validatedFields.success) {
      return {
        ok: false,
        message: 'Campos inválidos'
      }
    }
    const { email, password } = validatedFields.data

    //validar usuario registrado
    const user = await getUserByEmail(email)

    if (!user) {
      return {
        ok: false,
        message: 'El usuario no está registrado'
      }
    }

    await signIn('credentials', { email, password, redirect: false })

    return { ok: true }
  } catch (error) {
    console.log({ error })
    if (error instanceof Error) {
      if (isRedirectError(error)) {
        throw error
      }

      const { type, cause } = error as AuthError
      switch (type) {
        case 'CredentialsSignin':
          return {
            ok: false,
            message: 'Las credenciales no son correctas'
          }
        case 'CallbackRouteError':
          return {
            ok: false,
            message: cause?.err?.toString()
          }
        default:
          return {
            ok: false,
            message: 'Algo salió mal'
          }
      }
    }

    throw error
  }
}

export async function signIngWithGoogle() {
  await signIn('google')
}
