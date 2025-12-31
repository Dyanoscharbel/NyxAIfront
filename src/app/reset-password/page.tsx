"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { LocaleSwitcher } from '@/components/ui/locale-switcher'
import { useI18n } from '@/hooks/useI18n'
import { 
  Telescope, 
  Loader2, 
  AlertCircle, 
  Lock,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react'

function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [validatingToken, setValidatingToken] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  
  const { locale } = useI18n()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError(locale === 'en' ? 'Invalid or missing reset token' : 'Token de réinitialisation invalide ou manquant')
        setValidatingToken(false)
        return
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/validate-reset-token/${token}`)
        const data = await response.json()

        if (response.ok) {
          setTokenValid(true)
        } else {
          setError(data.error || (locale === 'en' ? 'Invalid or expired token' : 'Token invalide ou expiré'))
        }
      } catch (err) {
        setError(locale === 'en' ? 'Error validating token' : 'Erreur lors de la validation du token')
      } finally {
        setValidatingToken(false)
      }
    }

    validateToken()
  }, [token, locale])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (newPassword.length < 8) {
      setError(locale === 'en' 
        ? 'Password must be at least 8 characters' 
        : 'Le mot de passe doit contenir au moins 8 caractères'
      )
      return
    }

    if (newPassword !== confirmPassword) {
      setError(locale === 'en' 
        ? 'Passwords do not match' 
        : 'Les mots de passe ne correspondent pas'
      )
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue')
      }

      setSuccess(true)
      
      // Rediriger vers login après 3 secondes
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la réinitialisation du mot de passe')
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

      {/* Reset Password card */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="border-sidebar-border/50 bg-sidebar/80 backdrop-blur-xl shadow-2xl">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-primary glow-effect" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center text-sidebar-foreground">
                {locale === 'en' ? 'Reset Password' : 'Réinitialiser le mot de passe'}
              </CardTitle>
              <CardDescription className="text-center text-sidebar-foreground/70">
                {locale === 'en' 
                  ? 'Enter your new password below' 
                  : 'Entrez votre nouveau mot de passe ci-dessous'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {validatingToken ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-sidebar-foreground/70">
                    {locale === 'en' ? 'Validating token...' : 'Validation du token...'}
                  </p>
                </div>
              ) : !tokenValid ? (
                <div className="space-y-4">
                  <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                  <div className="text-center">
                    <Link href="/forgot-password" className="text-primary hover:underline font-medium">
                      {locale === 'en' ? 'Request a new reset link' : 'Demander un nouveau lien'}
                    </Link>
                  </div>
                </div>
              ) : success ? (
                <div className="space-y-4">
                  <Alert className="border-green-500/50 bg-green-500/10">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-sidebar-foreground">
                      {locale === 'en' 
                        ? 'Password successfully reset! Redirecting to login...'
                        : 'Mot de passe réinitialisé avec succès ! Redirection...'
                      }
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Error alert */}
                  {error && (
                    <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* New Password field */}
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sidebar-foreground">
                      {locale === 'en' ? 'New Password' : 'Nouveau mot de passe'}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sidebar-foreground/50" />
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="pl-10 pr-10 bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/40"
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sidebar-foreground/50 hover:text-sidebar-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password field */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sidebar-foreground">
                      {locale === 'en' ? 'Confirm Password' : 'Confirmer le mot de passe'}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sidebar-foreground/50" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="pl-10 pr-10 bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/40"
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sidebar-foreground/50 hover:text-sidebar-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-sidebar-foreground/60">
                    {locale === 'en' 
                      ? 'Password must be at least 8 characters long'
                      : 'Le mot de passe doit contenir au moins 8 caractères'
                    }
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
                        {locale === 'en' ? 'Resetting...' : 'Réinitialisation...'}
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        {locale === 'en' ? 'Reset Password' : 'Réinitialiser'}
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen cosmic-gradient flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
