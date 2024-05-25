import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link } from 'react-router-dom'

function LoginPage() {
  return (
    <section className='flex justify-center items-center h-screen'>
        <Card className="w-full max-w-sm">
          <CardHeader>
          <CardTitle className="text-2xl mb-5">Login</CardTitle>
          <CardDescription>
              Enter your email below to login to your account.
          </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
          <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
          </div>
          </CardContent>
          <CardFooter className='flex flex-col'>
            <Button className="w-full">Sign in</Button>
            <div className="mt-4 text-center text-sm">
                  Don't have an account?{" "}
              <Link to={"/auth/Register"} className="underline">
                  Sign in
              </Link>
            </div>
          </CardFooter>
      </Card>
    </section>

  )
}

export default LoginPage