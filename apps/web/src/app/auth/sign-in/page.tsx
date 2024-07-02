import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Label } from '@radix-ui/react-label'
import Link from 'next/link'
import React from 'react'

import gitHubIcon from '@/assets/github-icon.svg'
import Image from 'next/image'

const SignInPage = () => {
  return (
    <form action="" className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input name="email" type="email" id="email" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input name="password" type="password" id="password" />

        <Link
          href="/auth/forgot-password"
          className="text-xs font-medium text-foreground hover:underline"
        >
          Forgot your password?
        </Link>
      </div>

      <Button type="submit" className="w-full">
        Sign in with e-mail
      </Button>

      <Separator />

      <Button type="submit" variant="outline" className="w-full">
        <Image
          src={gitHubIcon}
          alt="GitHub icon"
          className="mr-2 size-4 dark:invert"
        />
        Sign in with GitHub
      </Button>
    </form>
  )
}

export default SignInPage
