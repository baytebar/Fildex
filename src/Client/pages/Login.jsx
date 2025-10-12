import React, { useState } from 'react'
import { Button } from '../../components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import FildexLogo from '../../images/FILDEX_SOLUTIONS.png'
import FildexText from '../../images/FILDEX_SOLUTIONS_TEXT.png'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, you would implement actual login logic here
    console.log('Login attempted with:', { email, password, rememberMe })
    // Redirect to home page after login
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #f0f0f0 1px, transparent 1px),
            linear-gradient(to bottom, #f0f0f0 1px, transparent 1px),
            radial-gradient(circle 600px at 0% 200px, #d5c5ff, transparent),
            radial-gradient(circle 600px at 100% 200px, #d5c5ff, transparent)
          `,
          backgroundSize: "20px 20px, 20px 20px, 100% 100%, 100% 100%",
        }}
      />
      
      {/* Top left logo and company name */}
      <div className="absolute top-6 left-6 z-20">
        <Link to={'/'} className="flex items-center gap-2">
          <img
            src={FildexLogo}
            alt="Fildex Logo"
            className="h-8 md:h-10 w-auto"
          />
          <img
            src={FildexText}
            alt="Fildex Solutions"
            className="h-5 md:h-6 w-auto hidden sm:block"
          />
        </Link>
      </div>

      {/* Floating shape decorations */}
      <div className="absolute top-1/4 right-10 w-24 h-24 rounded-full bg-primary/10 blur-xl hidden lg:block"></div>
      <div className="absolute bottom-1/4 left-10 w-32 h-32 rounded-full bg-secondary/10 blur-xl hidden lg:block"></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
            Welcome back
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>
        <div className="mt-8 bg-card shadow-lg rounded-xl p-6 sm:p-8 border border-border backdrop-blur-sm bg-background/80">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-foreground mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 sm:py-4 border border-input rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm sm:text-base"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 sm:py-4 border border-input rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm sm:text-base"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-input rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary/90">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full py-3 sm:py-4"
                size="lg"
              >
                Sign in
              </Button>
            </div>
          </form>
        </div>
        <div className="flex items-center justify-center text-sm text-muted-foreground">
          <span>Don't have an account?</span>
          <Link to="/signup" className="ml-1 font-medium text-primary hover:text-primary/90">
            Create account
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login