"use client"

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@/contexts/AuthContext'
import { useI18n } from '@/hooks/useI18n'
import { AppLayout } from '@/components/layout/AppLayout'
import { 
  User,
  Camera,
  Loader2,
  AlertCircle,
  CheckCircle,
  Upload,
  Bell,
  Lock,
  MessageSquare
} from 'lucide-react'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const { locale } = useI18n()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    fullName: user?.fullName || user?.username || '',
    emailNotifications: user?.emailNotifications ?? true,
    allowStudentMessages: user?.allowStudentMessages ?? false
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [profileImage, setProfileImage] = useState<string | null>(user?.profileImage || null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  if (!user) {
    router.push('/login')
    return null
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Valider la taille (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError(locale === 'en' ? 'Image size must be less than 2MB' : 'La taille de l\'image doit être inférieure à 2MB')
      return
    }

    // Valider le type
    if (!file.type.startsWith('image/')) {
      setError(locale === 'en' ? 'Please select an image file' : 'Veuillez sélectionner un fichier image')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setProfileImage(reader.result as string)
      setError('')
    }
    reader.readAsDataURL(file)
  }

  const handleUpdateProfile = async () => {
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          profileImage,
          fullName: formData.fullName,
          emailNotifications: formData.emailNotifications,
          allowStudentMessages: formData.allowStudentMessages
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Profile update failed')
      }

      // Mettre à jour le contexte
      if (updateUser) {
        updateUser({ 
          ...user, 
          profileImage: profileImage || undefined,
          fullName: formData.fullName,
          emailNotifications: formData.emailNotifications,
          allowStudentMessages: formData.allowStudentMessages
        })
      }

      setSuccess(locale === 'en' ? 'Profile updated successfully!' : 'Profil mis à jour avec succès !')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError(locale === 'en' ? 'New passwords do not match' : 'Les nouveaux mots de passe ne correspondent pas')
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError(locale === 'en' ? 'Password must be at least 6 characters' : 'Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Password change failed')
      }

      setSuccess(locale === 'en' ? 'Password changed successfully!' : 'Mot de passe modifié avec succès !')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password change failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-sidebar-foreground">
          {locale === 'en' ? 'Profile Settings' : 'Paramètres du profil'}
        </h1>
        <p className="text-sidebar-foreground/70 mt-2">
          {locale === 'en' 
            ? 'Manage your account settings and profile information' 
            : 'Gérez les paramètres de votre compte et vos informations de profil'}
        </p>
      </div>

      {/* Messages */}
      {error && (
        <Alert variant="destructive" className="mb-6 border-red-500/50 bg-red-500/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-green-500/50 bg-green-500/10">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-500">{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {/* Profile Picture Card */}
        <Card className="border-sidebar-border bg-sidebar/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-sidebar-foreground">
              {locale === 'en' ? 'Profile Picture' : 'Photo de profil'}
            </CardTitle>
            <CardDescription className="text-sidebar-foreground/70">
              {locale === 'en' 
                ? 'Update your profile picture. Maximum size: 2MB' 
                : 'Mettez à jour votre photo de profil. Taille maximale : 2MB'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-primary/30">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-12 w-12 text-primary" />
                )}
              </div>
              
              <div className="flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="mb-2"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {locale === 'en' ? 'Upload Image' : 'Télécharger une image'}
                </Button>
                <p className="text-xs text-sidebar-foreground/50">
                  {locale === 'en' ? 'JPG, PNG or GIF. Max 2MB.' : 'JPG, PNG ou GIF. Max 2MB.'}
                </p>
              </div>
            </div>

            <Button
              onClick={handleUpdateProfile}
              disabled={isLoading || !profileImage || profileImage === user.profileImage}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {locale === 'en' ? 'Saving...' : 'Enregistrement...'}
                </>
              ) : (
                <>
                  <Camera className="mr-2 h-4 w-4" />
                  {locale === 'en' ? 'Save Profile Picture' : 'Enregistrer la photo'}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Account Information Card */}
        <Card className="border-sidebar-border bg-sidebar/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-sidebar-foreground">
              {locale === 'en' ? 'Account Information' : 'Informations du compte'}
            </CardTitle>
            <CardDescription className="text-sidebar-foreground/70">
              {locale === 'en' 
                ? 'Update your personal information' 
                : 'Mettez à jour vos informations personnelles'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sidebar-foreground">
                {locale === 'en' ? 'Full Name' : 'Nom complet'}
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sidebar-foreground/50" />
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  disabled={isLoading}
                  className="pl-10 bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground"
                  placeholder={locale === 'en' ? 'Your full name' : 'Votre nom complet'}
                />
              </div>
            </div>

            {user.university && (
              <div className="space-y-2">
                <Label className="text-sidebar-foreground/70">{locale === 'en' ? 'University' : 'Université'}</Label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-sidebar-accent/50 border border-sidebar-border">
                  <span className="text-sidebar-foreground">{user.university}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Change Password Card */}
        <Card className="border-sidebar-border bg-sidebar/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-sidebar-foreground">
              {locale === 'en' ? 'Change Password' : 'Changer le mot de passe'}
            </CardTitle>
            <CardDescription className="text-sidebar-foreground/70">
              {locale === 'en' 
                ? 'Update your password to keep your account secure' 
                : 'Mettez à jour votre mot de passe pour sécuriser votre compte'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-sidebar-foreground">
                  {locale === 'en' ? 'Current Password' : 'Mot de passe actuel'}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sidebar-foreground/50" />
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="••••••••"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                    disabled={isLoading}
                    className="pl-10 bg-sidebar-accent/50 border-sidebar-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sidebar-foreground">
                  {locale === 'en' ? 'New Password' : 'Nouveau mot de passe'}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sidebar-foreground/50" />
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    disabled={isLoading}
                    className="pl-10 bg-sidebar-accent/50 border-sidebar-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sidebar-foreground">
                  {locale === 'en' ? 'Confirm New Password' : 'Confirmer le nouveau mot de passe'}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sidebar-foreground/50" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    disabled={isLoading}
                    className="pl-10 bg-sidebar-accent/50 border-sidebar-border"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {locale === 'en' ? 'Changing...' : 'Modification...'}
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    {locale === 'en' ? 'Change Password' : 'Changer le mot de passe'}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Notification Preferences Card */}
        <Card className="border-sidebar-border bg-sidebar/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-sidebar-foreground">
              {locale === 'en' ? 'Notification Preferences' : 'Préférences de notification'}
            </CardTitle>
            <CardDescription className="text-sidebar-foreground/70">
              {locale === 'en' 
                ? 'Manage how you receive notifications' 
                : 'Gérez la façon dont vous recevez les notifications'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-sidebar-foreground/70" />
                <div>
                  <Label htmlFor="emailNotifications" className="text-sidebar-foreground cursor-pointer">
                    {locale === 'en' ? 'Email Notifications' : 'Notifications par email'}
                  </Label>
                  <p className="text-sm text-sidebar-foreground/50">
                    {locale === 'en' 
                      ? 'Receive notifications about synchronizations and updates' 
                      : 'Recevez des notifications sur les synchronisations et mises à jour'}
                  </p>
                </div>
              </div>
              <Switch
                id="emailNotifications"
                checked={formData.emailNotifications}
                onCheckedChange={(checked) => setFormData({ ...formData, emailNotifications: checked })}
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Communication Settings (for researchers only) */}
        {user.role === 'researcher' && (
          <Card className="border-sidebar-border bg-sidebar/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-sidebar-foreground">
                {locale === 'en' ? 'Communication Settings' : 'Paramètres de communication'}
              </CardTitle>
              <CardDescription className="text-sidebar-foreground/70">
                {locale === 'en' 
                  ? 'Allow students to contact you directly' 
                  : 'Autoriser les étudiants à vous contacter directement'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-sidebar-foreground/70" />
                  <div>
                    <Label htmlFor="allowStudentMessages" className="text-sidebar-foreground cursor-pointer">
                      {locale === 'en' ? 'Accept Student Messages' : 'Accepter les messages d\'étudiants'}
                    </Label>
                    <p className="text-sm text-sidebar-foreground/50">
                      {locale === 'en' 
                        ? 'Students will be able to send you messages through the platform' 
                        : 'Les étudiants pourront vous envoyer des messages via la plateforme'}
                    </p>
                  </div>
                </div>
                <Switch
                  id="allowStudentMessages"
                  checked={formData.allowStudentMessages}
                  onCheckedChange={(checked) => setFormData({ ...formData, allowStudentMessages: checked })}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Save Button */}
        <Card className="border-sidebar-border bg-sidebar/50 backdrop-blur">
          <CardContent className="pt-6">
            <Button
              onClick={handleUpdateProfile}
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {locale === 'en' ? 'Saving...' : 'Enregistrement...'}
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {locale === 'en' ? 'Save Changes' : 'Enregistrer les modifications'}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
      </div>
    </AppLayout>
  )
}
