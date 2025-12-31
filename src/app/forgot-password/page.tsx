"use client"

import { useState } from 'react'
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
  Mail,
  CheckCircle,
  ArrowLeft
} from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const { locale } = useI18n()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue')
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'envoi de l\'email')
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

      {/* Forgot Password card */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
        <div className="w-full max-w-md">
          {/* Back to login button */}
          <Link 
            href="/login" 
            className="inline-flex items-center text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {locale === 'en' ? 'Back to login' : 'Retour à la connexion'}
          </Link>
          
          <Card className="border-sidebar-border/50 bg-sidebar/80 backdrop-blur-xl shadow-2xl">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-primary glow-effect" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center text-sidebar-foreground">
                {locale === 'en' ? 'Forgot Password?' : 'Mot de passe oublié ?'}
              </CardTitle>
              <CardDescription className="text-center text-sidebar-foreground/70">
                {locale === 'en' 
                  ? 'Enter your email and we\'ll send you a reset link' 
                  : 'Entrez votre email et nous vous enverrons un lien de réinitialisation'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {!success ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Error alert */}
                  {error && (
                    <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Email field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sidebar-foreground">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sidebar-foreground/50" />
                      <Input
                        id="email"
                        type="email"
                        placeholder={locale === 'en' ? 'your-email@example.com' : 'votre-email@exemple.com'}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        className="pl-10 bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/40"
                        autoComplete="email"
                      />
                    </div>
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
                        {locale === 'en' ? 'Sending...' : 'Envoi...'}
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        {locale === 'en' ? 'Send Reset Link' : 'Envoyer le lien'}
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="space-y-4">
                  {/* Success alert */}
                  <Alert className="border-green-500/50 bg-green-500/10">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-sidebar-foreground">
                      {locale === 'en' 
                        ? 'If an account exists with this email, you will receive a password reset link shortly.'
                        : 'Si un compte existe avec cet email, vous recevrez bientôt un lien de réinitialisation.'
                      }
                    </AlertDescription>
                  </Alert>

                  <div className="text-center text-sm text-sidebar-foreground/70">
                    <p className="mb-2">
                      {locale === 'en' 
                        ? 'Check your inbox and spam folder.'
                        : 'Vérifiez votre boîte de réception et vos spams.'
                      }
                    </p>
                    <Link href="/login" className="text-primary hover:underline font-medium">
                      {locale === 'en' ? 'Return to login' : 'Retour à la connexion'}
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
