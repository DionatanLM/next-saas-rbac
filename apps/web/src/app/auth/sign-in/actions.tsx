'use server'

import { signInWithPassword } from '@/http/sign-in-with-password'
import { HTTPError } from 'ky'
import { z } from 'zod'

const signInSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please, provide a valid e-mail address.' }),
  password: z.string().min(1, { message: 'Please, provide a password.' }),
})

export async function signInWithEmailAndPassword(_: unknown, data: FormData) {
  const result = signInSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { sucess: false, message: null, errors }
  }
  const { email, password } = result.data

  await new Promise((resolve) => setTimeout(resolve, 2000))

  try {
    const { token } = await signInWithPassword({
      email: String(email),
      password: String(password),
    })

    console.log(token)
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      return { success: false, message, errors: null }
    }

    console.error(error)
    return {
      success: false,
      message: 'Unexpected error, try again in a few minutes.',
      errors: null,
    }
  }

  return { success: true, message: null, errors: null }
}