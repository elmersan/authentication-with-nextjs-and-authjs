'use client'

import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import Image from 'next/image'
import BtnSignInWithGoogle from '@/components/signin-with-google'
import { useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { PasswordInput } from '@/components/password-input'
import { LoginSchema } from '@/schemas'
import { login } from '@/actions'
import { toast } from '@/hooks/use-toast'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  function onSubmit(values: z.infer<typeof LoginSchema>) {
    startTransition(async () => {
      const resp = await login(values)

      if (!resp.ok) {
        toast({
          title: 'Inicio de sesión fallido',
          description: (
            <div className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
              <p className='text-white'>
                {resp.message ??
                  'Ocurrió un error inesperado, vuela a intentarlo'}
              </p>
            </div>
          )
        })
        return
      }

      await login(values)
      toast({
        title: 'Inicio de sesión exitoso 🎉'
      })
      window.location.replace('/dashboard')
    })
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='overflow-hidden'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <div className='p-6 md:p-8 flex flex-col gap-3'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='flex flex-col gap-3'
              >
                <div className='flex flex-col items-center text-center'>
                  <h1 className='text-2xl font-bold'>Bienvenido de nuevo</h1>
                  <p className='text-balance text-muted-foreground'>
                    Inicia sesión con tu cuenta.
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo electrónico</FormLabel>
                      <FormControl>
                        <Input placeholder='Correo electrónico' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <PasswordInput placeholder='Contraseña' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {isPending ? (
                  <Button disabled variant='outline' className='w-full'>
                    <Loader2 className='size-4 mr-2 animate-spin' /> Por favor
                    espere...
                  </Button>
                ) : (
                  <Button type='submit' className='w-full'>
                    Iniciar sesión
                  </Button>
                )}
              </form>
            </Form>
            <div className='relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'>
              <span className='relative z-10 bg-background px-2 text-muted-foreground'>
                O continúa con
              </span>
            </div>
            <div className=''>
              <BtnSignInWithGoogle />
            </div>
            <div className='text-center text-sm'>
              ¿No tienes cuenta?{' '}
              <Link
                href='/auth/register'
                className='underline underline-offset-4'
              >
                Registrarme
              </Link>
            </div>
          </div>

          <div className='relative hidden md:block bg-white'>
            <Image
              src={'/images/bg-login.jpg'}
              alt='Image'
              layout='fill'
              objectFit='contain'
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
