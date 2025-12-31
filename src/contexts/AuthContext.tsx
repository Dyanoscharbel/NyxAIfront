"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id?: string
  username: string
  role: string
  token: string
  email?: string
  fullName?: string
  university?: string
  profileImage?: string
  emailNotifications?: boolean
  allowStudentMessages?: boolean
}

interface AuthContextType {
  user: User | null
  login: (identifier: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Fonction pour décoder le JWT et extraire l'ID
  const decodeToken = (token: string): string | null => {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      const decoded = JSON.parse(jsonPayload)
      return decoded.id || null
    } catch (error) {
      console.error('Error decoding token:', error)
      return null
    }
  }

  // Vérifier le token au chargement
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    let id = localStorage.getItem('auth_id')
    const username = localStorage.getItem('auth_username')
    const role = localStorage.getItem('auth_role')
    const profileImage = localStorage.getItem('auth_profileImage')
    const email = localStorage.getItem('auth_email')
    const fullName = localStorage.getItem('auth_fullName')
    const university = localStorage.getItem('auth_university')
    const emailNotifications = localStorage.getItem('auth_emailNotifications')
    const allowStudentMessages = localStorage.getItem('auth_allowStudentMessages')

    // Si l'ID n'est pas dans localStorage mais qu'on a un token, on le décode
    if (!id && token) {
      const decodedId = decodeToken(token)
      if (decodedId) {
        id = decodedId
        localStorage.setItem('auth_id', decodedId)
        console.log('✅ ID récupéré depuis le token JWT:', decodedId)
      }
    }

    if (token && username && role) {
      setUser({ 
        id: id || undefined,
        username, 
        role, 
        token,
        profileImage: profileImage || undefined,
        email: email || undefined,
        fullName: fullName || undefined,
        university: university || undefined,
        emailNotifications: emailNotifications ? emailNotifications === 'true' : true,
        allowStudentMessages: allowStudentMessages ? allowStudentMessages === 'true' : false
      })
      
      if (id) {
        console.log('👤 User loaded with ID:', id)
      } else {
        console.warn('⚠️ User loaded but ID is missing!')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (identifier: string, password: string) => {
    try {
      // Appel à l'API backend
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ identifier, password })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Échec de la connexion')
      }

      const data = await response.json()
      
      if (data.success && data.data.token) {
        const userData = {
          id: data.data.user.id,
          username: data.data.user.username || data.data.user.fullName,
          role: data.data.user.role,
          token: data.data.token,
          email: data.data.user.email,
          fullName: data.data.user.fullName,
          university: data.data.user.university,
          profileImage: data.data.user.profileImage,
          emailNotifications: data.data.user.emailNotifications ?? true,
          allowStudentMessages: data.data.user.allowStudentMessages ?? false
        }

        // Sauvegarder dans localStorage
        localStorage.setItem('auth_token', data.data.token)
        localStorage.setItem('auth_id', data.data.user.id)
        localStorage.setItem('auth_username', userData.username)
        localStorage.setItem('auth_role', data.data.user.role)
        if (data.data.user.email) localStorage.setItem('auth_email', data.data.user.email)
        if (data.data.user.fullName) localStorage.setItem('auth_fullName', data.data.user.fullName)
        if (data.data.user.university) localStorage.setItem('auth_university', data.data.user.university)
        if (data.data.user.profileImage) localStorage.setItem('auth_profileImage', data.data.user.profileImage)
        localStorage.setItem('auth_emailNotifications', String(userData.emailNotifications))
        localStorage.setItem('auth_allowStudentMessages', String(userData.allowStudentMessages))

        setUser(userData)
        
        // Rediriger vers le dashboard
        router.push('/dashboard')
      } else {
        throw new Error('Réponse invalide du serveur')
      }
    } catch (error) {
      console.error('Erreur de connexion:', error)
      throw error
    }
  }

  const logout = () => {
    // Supprimer les données d'authentification
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_id')
    localStorage.removeItem('auth_username')
    localStorage.removeItem('auth_role')
    localStorage.removeItem('auth_email')
    localStorage.removeItem('auth_fullName')
    localStorage.removeItem('auth_university')
    localStorage.removeItem('auth_profileImage')
    localStorage.removeItem('auth_emailNotifications')
    localStorage.removeItem('auth_allowStudentMessages')
    
    setUser(null)
    router.push('/login')
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      
      // Mettre à jour localStorage
      if (userData.profileImage !== undefined) {
        if (userData.profileImage) {
          localStorage.setItem('auth_profileImage', userData.profileImage)
        } else {
          localStorage.removeItem('auth_profileImage')
        }
      }
      if (userData.fullName !== undefined) {
        localStorage.setItem('auth_fullName', userData.fullName)
      }
      if (userData.emailNotifications !== undefined) {
        localStorage.setItem('auth_emailNotifications', String(userData.emailNotifications))
      }
      if (userData.allowStudentMessages !== undefined) {
        localStorage.setItem('auth_allowStudentMessages', String(userData.allowStudentMessages))
      }
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout,
      updateUser,
      isAuthenticated: !!user,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider')
  }
  return context
}
