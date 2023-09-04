'use client'

import '@/app/global.css'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { setCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import { queries } from '@/lib/graphql-queries'
import { useLazyQuery } from '@apollo/client'

const FormSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z
    .string()
    .min(1, 'Password is required')
    //change later to 8 charachters
    .min(3, 'Password must have than 8 characters'),
})

const SignInForm = () => {
  const [getUser, { error }] = useLazyQuery(queries.GET_USER_BY_EMAIL)

  const { push } = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    const email = values.email
    const password = values.password
    const variables = { email, password }

    if (error) return `Error! ${error}`

    const {
      data: { getUserByEmail },
    } = await getUser({ variables })

    if (getUserByEmail.fullName) {
      console.warn('WELCOME', getUserByEmail.fullName)
      setCookie('user', getUserByEmail.fullName)
      push('/dashboard')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className="mx-auto block w-full mt-6" type="submit">
          Log in
        </Button>
      </form>
      <p className="text-center text-white text-sm text-gray-600 mt-2">
        If you dont have an account, please&nbsp;
        <Link className="text-emerald-200 hover:underline" href="/signup">
          Sign up
        </Link>
      </p>
    </Form>
  )
}

export default SignInForm
