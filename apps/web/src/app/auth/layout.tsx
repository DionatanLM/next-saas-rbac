import { isAuthenticated } from '@/auth/auth'
import { redirect } from 'next/navigation'

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  if (isAuthenticated()) {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-xs">{children}</div>
    </div>
  )
}

export default AuthLayout
