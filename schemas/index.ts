import * as z from 'zod'

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'Por favor, ingrese un correo electrónico válido.'
  }),
  password: z.string().nonempty({
    message: 'El campo es obligatorio'
  })
})

export const RegisterSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'El nombre debe tener al menos 3 caracteres.'
    })
    .max(100, {
      message: 'El nombre debe tener menos de 100 caracteres.'
    }),
  email: z.string().email({
    message: 'Por favor, ingrese un correo electrónico válido.'
  }),
  password: z
    .string()
    .min(8, {
      message: 'La contraseña debe tener al menos 8 caracteres.'
    })
    .regex(/(?=.*[0-9])/, {
      message: 'La contraseña debe contener al menos un número.'
    })
})
