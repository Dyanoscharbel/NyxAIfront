"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { LocaleSwitcher } from '@/components/ui/locale-switcher'
import { useAuth } from '@/contexts/AuthContext'
import { useI18n } from '@/hooks/useI18n'
import { 
  Telescope, 
  Loader2, 
  AlertCircle, 
  Lock, 
  User,
  ArrowLeft,
  Sparkles
} from 'lucide-react'

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login, isAuthenticated } = useAuth()
  const { locale } = useI18n()
  const router = useRouter()

  // Rediriger si déjà authentifié
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(identifier, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen cosmic-gradient relative overflow-hidden">
      {/* Animated stars background */}
      <div className="star-field absolute inset-0" />
      
      {/* Header minimal */}
      <header className="relative z-10 border-b border-sidebar-border/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <Telescope className="h-8 w-8 text-primary glow-effect" />
              <div>
                <h1 className="text-xl font-bold text-sidebar-foreground">
                  ExoScope
                </h1>
              </div>
            </Link>
            
            <div className="flex items-center space-x-2">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Login card */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
        <div className="w-full max-w-md">
          {/* Back to home button */}
          
          <Card className="border-sidebar-border/50 bg-sidebar/80 backdrop-blur-xl shadow-2xl">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-primary glow-effect" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center text-sidebar-foreground">
                {locale === 'en' ? 'Welcome Back' : 'Bienvenue'}
              </CardTitle>
              <CardDescription className="text-center text-sidebar-foreground/70">
                {locale === 'en' 
                  ? 'Sign in to access the platform' 
                  : 'Connectez-vous pour accéder à la plateforme'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Error alert */}
                {error && (
                  <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Username field */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sidebar-foreground">
                    {locale === 'en' ? 'Username or Email' : 'Nom d\'utilisateur ou Email'}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sidebar-foreground/50" />
                    <Input
                      id="username"
                      type="text"
                      placeholder={locale === 'en' ? 'admin or email@example.com' : 'admin ou email@exemple.com'}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                      disabled={isLoading}
                      className="pl-10 bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/40"
                      autoComplete="username"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sidebar-foreground">
                    {locale === 'en' ? 'Password' : 'Mot de passe'}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sidebar-foreground/50" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="pl-10 bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/40"
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                {/* Forgot password link */}
                <div className="text-right">
                  <Link 
                    href="/forgot-password" 
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    {locale === 'en' ? 'Forgot password?' : 'Mot de passe oublié ?'}
                  </Link>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-effect"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {locale === 'en' ? 'Connecting...' : 'Connexion...'}
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      {locale === 'en' ? 'Sign In' : 'Se connecter'}
                    </>
                  )}
                </Button>
              </form>

              {/* Footer info */}
              <div className="mt-6 text-center space-y-3">
                <p className="text-sm text-sidebar-foreground/70">
                  {locale === 'en' ? 'Don\'t have an account?' : 'Vous n\'avez pas de compte ?'}{' '}
                  <Link href="/register" className="text-primary hover:underline font-medium">
                    {locale === 'en' ? 'Sign up' : 'S\'inscrire'}
                  </Link>
                </p>
               
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
