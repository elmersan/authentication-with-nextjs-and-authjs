import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export async function requireUserSession() {
  const session = await auth()

  if (!session?.user) {
    return redirect('/auth/login')
  }

  return session
}
