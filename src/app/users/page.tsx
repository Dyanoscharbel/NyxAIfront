"use client"

import { useState, useEffect } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/contexts/AuthContext'
import { useI18n } from '@/hooks/useI18n'
import { useRouter } from 'next/navigation'
import {
  Loader2,
  CheckCircle,
  XCircle,
  Trash2,
  User as UserIcon,
  Clock,
  Mail,
  GraduationCap
} from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface User {
  id: string
  email: string
  fullName: string
  role: 'student' | 'researcher'
  university?: string
  isApproved: boolean
  createdAt: string
  lastLogin?: string
  profileImage?: string
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'researchers' | 'students'>('researchers')
  const { user, isLoading: isAuthLoading } = useAuth()
  const { locale } = useI18n()
  const router = useRouter()

  useEffect(() => {
    // Wait for auth to load
    if (isAuthLoading) return
    
    if (!user) {
      router.push('/login')
      return
    }

    if (user.role !== 'admin') {
      router.push('/dashboard')
      return
    }

    fetchUsers()
  }, [user, isAuthLoading, router])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      setError('')

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch users')
      }

      setUsers(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const approveUser = async (userId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${userId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to approve user')
      }

      // Refresh users list
      fetchUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete user')
      }

      // Refresh users list
      fetchUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
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

  // Redirect if not admin
  if (!user || user.role !== 'admin') return null

  const pendingResearchers = users.filter(u => u.role === 'researcher' && !u.isApproved)
  const approvedResearchers = users.filter(u => u.role === 'researcher' && u.isApproved)
  const students = users.filter(u => u.role === 'student')

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-sidebar-foreground mb-2">
            {locale === 'en' ? 'Users Management' : 'Gestion des utilisateurs'}
          </h1>
          <p className="text-sidebar-foreground/70">
            {locale === 'en' 
              ? 'Manage user accounts, approve researchers and monitor activity' 
              : 'Gérer les comptes utilisateurs, approuver les chercheurs et surveiller l\'activité'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-sidebar-border">
          <button
            onClick={() => setActiveTab('researchers')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'researchers'
                ? 'text-primary border-b-2 border-primary'
                : 'text-sidebar-foreground/70 hover:text-sidebar-foreground'
            }`}
          >
            {locale === 'en' ? 'Researchers' : 'Chercheurs'} ({pendingResearchers.length + approvedResearchers.length})
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'students'
                ? 'text-primary border-b-2 border-primary'
                : 'text-sidebar-foreground/70 hover:text-sidebar-foreground'
            }`}
          >
            {locale === 'en' ? 'Students' : 'Étudiants'} ({students.length})
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-sidebar-border bg-sidebar/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-sidebar-foreground/70">
                {locale === 'en' ? 'Pending Approval' : 'En attente d\'approbation'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500">{pendingResearchers.length}</div>
            </CardContent>
          </Card>
          <Card className="border-sidebar-border bg-sidebar/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-sidebar-foreground/70">
                {locale === 'en' ? 'Researchers' : 'Chercheurs'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{approvedResearchers.length}</div>
            </CardContent>
          </Card>
          <Card className="border-sidebar-border bg-sidebar/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-sidebar-foreground/70">
                {locale === 'en' ? 'Students' : 'Étudiants'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{students.length}</div>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <Card className="border-red-500/50 bg-red-500/10">
            <CardContent className="py-6">
              <p className="text-red-500 text-center">{error}</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Researchers Tab Content */}
            {activeTab === 'researchers' && (
              <>
                {/* Pending Researchers */}
                {pendingResearchers.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-sidebar-foreground flex items-center gap-2">
                      <Clock className="h-6 w-6 text-orange-500" />
                      {locale === 'en' ? 'Pending Approval' : 'En attente d\'approbation'}
                    </h2>
                    <div className="grid gap-4">{pendingResearchers.map((researcher) => (
                    <Card key={researcher.id} className="border-sidebar-border bg-sidebar/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={researcher.profileImage} />
                              <AvatarFallback className="bg-primary/20">
                                <UserIcon className="h-6 w-6 text-primary" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-sidebar-foreground">{researcher.fullName}</h3>
                              <p className="text-sm text-sidebar-foreground/60 flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {researcher.email}
                              </p>
                              <p className="text-xs text-sidebar-foreground/50">
                                {locale === 'en' ? 'Registered: ' : 'Inscrit le: '}
                                {new Date(researcher.createdAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'fr-FR')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  className="bg-green-500 hover:bg-green-600 text-white"
                                  size="sm"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  {locale === 'en' ? 'Approve' : 'Approuver'}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    {locale === 'en' ? 'Approve researcher?' : 'Approuver le chercheur ?'}
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {locale === 'en'
                                      ? 'This will allow the researcher to access the platform and start using all features.'
                                      : 'Cela permettra au chercheur d\'accéder à la plateforme et d\'utiliser toutes les fonctionnalités.'}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    {locale === 'en' ? 'Cancel' : 'Annuler'}
                                  </AlertDialogCancel>
                                  <AlertDialogAction onClick={() => approveUser(researcher.id)} className="bg-green-500 hover:bg-green-600">
                                    {locale === 'en' ? 'Approve' : 'Approuver'}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    {locale === 'en' ? 'Delete user?' : 'Supprimer l\'utilisateur ?'}
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {locale === 'en'
                                      ? 'This action cannot be undone. This will permanently delete the user account.'
                                      : 'Cette action est irréversible. Le compte utilisateur sera définitivement supprimé.'}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    {locale === 'en' ? 'Cancel' : 'Annuler'}
                                  </AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteUser(researcher.id)} className="bg-red-500 hover:bg-red-600">
                                    {locale === 'en' ? 'Delete' : 'Supprimer'}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Approved Researchers */}
            {approvedResearchers.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-sidebar-foreground flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  {locale === 'en' ? 'Researchers' : 'Chercheurs'}
                </h2>
                <div className="grid gap-4">
                  {approvedResearchers.map((researcher) => (
                    <Card key={researcher.id} className="border-sidebar-border bg-sidebar/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={researcher.profileImage} />
                              <AvatarFallback className="bg-primary/20">
                                <UserIcon className="h-6 w-6 text-primary" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-sidebar-foreground flex items-center gap-2">
                                {researcher.fullName}
                                <Badge variant="outline" className="border-green-500 text-green-500">
                                  {locale === 'en' ? 'Approved' : 'Approuvé'}
                                </Badge>
                              </h3>
                              <p className="text-sm text-sidebar-foreground/60 flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {researcher.email}
                              </p>
                              {researcher.lastLogin && (
                                <p className="text-xs text-sidebar-foreground/50">
                                  {locale === 'en' ? 'Last login: ' : 'Dernière connexion: '}
                                  {new Date(researcher.lastLogin).toLocaleDateString(locale === 'en' ? 'en-US' : 'fr-FR')}
                                </p>
                              )}
                            </div>
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4 mr-1" />
                                {locale === 'en' ? 'Delete' : 'Supprimer'}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  {locale === 'en' ? 'Delete user?' : 'Supprimer l\'utilisateur ?'}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  {locale === 'en'
                                    ? 'This action cannot be undone. This will permanently delete the user account and all related data.'
                                    : 'Cette action est irréversible. Le compte utilisateur et toutes les données associées seront définitivement supprimés.'}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  {locale === 'en' ? 'Cancel' : 'Annuler'}
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteUser(researcher.id)} className="bg-red-500 hover:bg-red-600">
                                  {locale === 'en' ? 'Delete' : 'Supprimer'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
              </>
            )}

            {/* Students Tab Content */}
            {activeTab === 'students' && (
              <>
                {students.length > 0 ? (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-sidebar-foreground flex items-center gap-2">
                      <GraduationCap className="h-6 w-6 text-green-500" />
                      {locale === 'en' ? 'Students' : 'Étudiants'}
                    </h2>
                    <div className="grid gap-4">
                      {students.map((student) => (
                        <Card key={student.id} className="border-sidebar-border bg-sidebar/50">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src={student.profileImage} />
                                  <AvatarFallback className="bg-primary/20">
                                    <UserIcon className="h-6 w-6 text-primary" />
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-semibold text-sidebar-foreground">{student.fullName}</h3>
                                  <p className="text-sm text-sidebar-foreground/60 flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    {student.email}
                                  </p>
                                  {student.university && (
                                    <p className="text-xs text-sidebar-foreground/50 flex items-center gap-1">
                                      <GraduationCap className="h-3 w-3" />
                                      {student.university}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="sm">
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    {locale === 'en' ? 'Delete' : 'Supprimer'}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      {locale === 'en' ? 'Delete user?' : 'Supprimer l\'utilisateur ?'}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {locale === 'en'
                                        ? 'This action cannot be undone. This will permanently delete the user account and all related data.'
                                        : 'Cette action est irréversible. Le compte utilisateur et toutes les données associées seront définitivement supprimés.'}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      {locale === 'en' ? 'Cancel' : 'Annuler'}
                                    </AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteUser(student.id)} className="bg-red-500 hover:bg-red-600">
                                      {locale === 'en' ? 'Delete' : 'Supprimer'}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Card className="border-sidebar-border bg-sidebar/50">
                    <CardContent className="py-12 text-center text-sidebar-foreground/60">
                      {locale === 'en' ? 'No students found' : 'Aucun étudiant trouvé'}
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </>
        )}
      </div>
    </AppLayout>
  )
}
