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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/AuthContext'
import { useI18n } from '@/hooks/useI18n'
import { 
  Telescope, 
  Loader2, 
  AlertCircle, 
  User,
  Mail,
  Lock,
  ArrowLeft,
  UserPlus,
  GraduationCap,
  Microscope
} from 'lucide-react'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    role: 'researcher' as 'researcher' | 'student'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { isAuthenticated } = useAuth()
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

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError(locale === 'en' ? 'Passwords do not match' : 'Les mots de passe ne correspondent pas')
      return
    }

    if (formData.password.length < 6) {
      setError(locale === 'en' ? 'Password must be at least 6 characters' : 'Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          ...(formData.role === 'student' && formData.university && { university: formData.university })
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      // If researcher account created (no token, waiting approval)
      if (data.data.message && !data.data.token) {
        setError('')
        alert(locale === 'en' 
          ? 'Account created successfully! Your account is pending admin approval. You will be able to login once approved.'
          : 'Compte créé avec succès ! Votre compte est en attente d\'approbation par l\'administrateur. Vous pourrez vous connecter une fois approuvé.')
        router.push('/login')
        return
      }

      if (data.success && data.data.token) {
        // Sauvegarder le token et rediriger (students only)
        localStorage.setItem('auth_token', data.data.token)
        localStorage.setItem('auth_id', data.data.user.id)
        localStorage.setItem('auth_username', data.data.user.username || data.data.user.fullName)
        localStorage.setItem('auth_role', data.data.user.role)
        
        router.push('/dashboard')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
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

      {/* Register card */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
        <div className="w-full max-w-md">
     
          <Card className="border-sidebar-border/50 bg-sidebar/80 backdrop-blur-xl shadow-2xl">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <UserPlus className="h-6 w-6 text-primary glow-effect" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center text-sidebar-foreground">
                {locale === 'en' ? 'Create Account' : 'Créer un compte'}
              </CardTitle>
              <CardDescription className="text-center text-sidebar-foreground/70">
                {locale === 'en' 
                  ? 'Join the ExoScope community' 
                  : 'Rejoignez la communauté ExoScope'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as 'researcher' | 'student' })} className="mb-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="researcher" className="flex items-center space-x-2">
                    <Microscope className="h-4 w-4" />
                    <span>{locale === 'en' ? 'Researcher' : 'Chercheur'}</span>
                  </TabsTrigger>
                  <TabsTrigger value="student" className="flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4" />
                    <span>{locale === 'en' ? 'Student' : 'Étudiant'}</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Error alert */}
                {error && (
                  <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Full name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sidebar-foreground">
                    {locale === 'en' ? 'Full Name' : 'Nom complet'}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sidebar-foreground/50" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder={locale === 'en' ? 'John Doe' : 'Jean Dupont'}
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                      disabled={isLoading}
                      className="pl-10 bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/40"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sidebar-foreground">
                    {locale === 'en' ? 'Email' : 'Email'}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sidebar-foreground/50" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={locale === 'en' ? 'john@example.com' : 'jean@exemple.com'}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      disabled={isLoading}
                      className="pl-10 bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/40"
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* University - Only for students */}
                {formData.role === 'student' && (
                  <div className="space-y-2">
                    <Label htmlFor="university" className="text-sidebar-foreground">
                      {locale === 'en' ? 'University' : 'Université'}
                      <span className="text-sidebar-foreground/50 text-xs ml-1">
                        ({locale === 'en' ? 'optional' : 'facultatif'})
                      </span>
                    </Label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sidebar-foreground/50" />
                      <Input
                        id="university"
                        type="text"
                        placeholder={locale === 'en' ? 'University of Sciences' : 'Université des Sciences'}
                        value={formData.university}
                        onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                        disabled={isLoading}
                        className="pl-10 bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/40"
                      />
                    </div>
                  </div>
                )}

                {/* Password */}
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
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      disabled={isLoading}
                      className="pl-10 bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/40"
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sidebar-foreground">
                    {locale === 'en' ? 'Confirm Password' : 'Confirmer le mot de passe'}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sidebar-foreground/50" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                      disabled={isLoading}
                      className="pl-10 bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/40"
                      autoComplete="new-password"
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
                      {locale === 'en' ? 'Creating account...' : 'Création du compte...'}
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      {locale === 'en' ? 'Create Account' : 'Créer un compte'}
                    </>
                  )}
                </Button>
              </form>

              {/* Footer link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-sidebar-foreground/70">
                  {locale === 'en' ? 'Already have an account?' : 'Vous avez déjà un compte ?'}{' '}
                  <Link href="/login" className="text-primary hover:underline font-medium">
                    {locale === 'en' ? 'Sign in' : 'Se connecter'}
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
