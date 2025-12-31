"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AppLayout } from '@/components/layout/AppLayout'
import { useAuth } from '@/contexts/AuthContext'
import { useI18n } from '@/hooks/useI18n'
import { 
  Search, 
  MessageSquare, 
  Loader2, 
  AlertCircle,
  User as UserIcon
} from 'lucide-react'

interface Researcher {
  id: string
  fullName: string
  email: string
  profileImage?: string
  university?: string
}

export default function ResearchersPage() {
  const [researchers, setResearchers] = useState<Researcher[]>([])
  const [filteredResearchers, setFilteredResearchers] = useState<Researcher[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  
  const { user, isLoading: isAuthLoading } = useAuth()
  const { locale } = useI18n()
  const router = useRouter()

  useEffect(() => {
    // Wait for auth to load
    if (isAuthLoading) return
    
    // Redirect if not logged in
    if (!user) {
      router.push('/login')
      return
    }

    // Only students, researchers and admins can access
    if (user.role !== 'student' && user.role !== 'researcher' && user.role !== 'admin') {
      router.push('/dashboard')
      return
    }

    fetchResearchers()
  }, [user, isAuthLoading, router])

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = researchers.filter(r =>
        r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.university?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredResearchers(filtered)
    } else {
      setFilteredResearchers(researchers)
    }
  }, [searchQuery, researchers])

  const fetchResearchers = async () => {
    try {
      setIsLoading(true)
      setError('')

      console.log('🔍 Fetching researchers from:', `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages/researchers`)

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages/researchers`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })

      const data = await response.json()
      console.log('📊 Researchers response:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch researchers')
      }

      console.log('✅ Found researchers:', data.data?.length || 0)
      setResearchers(data.data)
      setFilteredResearchers(data.data)
    } catch (err) {
      console.error('❌ Error fetching researchers:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartConversation = (researcherId: string) => {
    router.push(`/messages?userId=${researcherId}`)
  }

  // Show loading while auth is loading
  if (isAuthLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    )
  }

  // Redirect if not authorized
  if (!user || (user.role !== 'student' && user.role !== 'researcher' && user.role !== 'admin')) {
    return null
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-sidebar-foreground mb-2">
            {locale === 'en' ? 'Find Researchers' : 'Trouver des chercheurs'}
          </h1>
          <p className="text-sidebar-foreground/70">
            {locale === 'en' 
              ? 'Connect with researchers who are available for discussion' 
              : 'Entrez en contact avec les chercheurs disponibles pour échanger'}
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6 border-sidebar-border bg-sidebar/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sidebar-foreground/50" />
              <Input
                placeholder={locale === 'en' ? 'Search by name, email or university...' : 'Rechercher par nom ou email...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-sidebar border-sidebar-border"
              />
            </div>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6 border-red-500/50 bg-red-500/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Researchers List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredResearchers.length === 0 ? (
          <Card className="border-sidebar-border bg-sidebar/50 backdrop-blur">
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-sidebar-foreground/50" />
              <p className="text-sidebar-foreground/70">
                {searchQuery 
                  ? (locale === 'en' ? 'No researchers found matching your search' : 'Aucun chercheur trouvé')
                  : (locale === 'en' ? 'No researchers are currently available for contact' : 'Aucun chercheur n\'est actuellement disponible')}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredResearchers.map((researcher) => (
              <Card key={researcher.id} className="border-sidebar-border bg-sidebar/50 backdrop-blur hover:bg-sidebar/70 transition-colors">
                <CardHeader className="p-4 md:p-6">
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <Avatar className="h-12 w-12 md:h-16 md:w-16 shrink-0">
                      <AvatarImage src={researcher.profileImage} alt={researcher.fullName} />
                      <AvatarFallback className="bg-primary/20">
                        <UserIcon className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base md:text-lg text-sidebar-foreground truncate">
                        {researcher.fullName}
                      </CardTitle>
                      <CardDescription className="text-sidebar-foreground/60 truncate text-xs md:text-sm">
                        {researcher.email}
                      </CardDescription>
                      {researcher.university && (
                        <p className="text-xs text-sidebar-foreground/50 mt-1 truncate">
                          {researcher.university}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                  <Button
                    onClick={() => handleStartConversation(researcher.id)}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm md:text-base"
                    size="sm"
                  >
                    <MessageSquare className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                    {locale === 'en' ? 'Send Message' : 'Envoyer un message'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
