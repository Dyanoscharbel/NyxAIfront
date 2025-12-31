"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ChatbotBubble } from '@/components/ChatbotBubble'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Telescope,
  Home,
  Brain,
  Database,
  BarChart3,
  Github,
  LogOut,
  User,
  RefreshCw,
  Users,
  MessageSquare
} from 'lucide-react'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { LocaleSwitcher } from '@/components/ui/locale-switcher'
import { useI18n } from '@/hooks/useI18n'
import { useAuth } from '@/contexts/AuthContext'
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
  useSidebar
} from '@/components/ui/sidebar'
import { IconBrandGithub } from '@tabler/icons-react'

const SidebarHeader = () => {
  const { open } = useSidebar()
  const { locale, isHydrated } = useI18n()
  
  return (
    <Link href="/dashboard" className="flex items-center space-x-3 px-2 py-4">
      <Telescope className="h-8 w-8 text-sidebar-primary glow-effect flex-shrink-0" />
      <div className={cn(
        "flex flex-col transition-opacity duration-200",
        open ? "opacity-100" : "opacity-0 md:opacity-100"
      )}>
        <h1 className="text-xl font-bold text-sidebar-foreground">
          Exoscope
        </h1>
        <p className="text-sm text-sidebar-foreground/60">
          {isHydrated && locale === 'en' ? 'Exoplanet Classification' : 'Classification d\'exoplanètes'}
        </p>
      </div>
    </Link>
  )
}

const SidebarFooter = () => {
  const { open } = useSidebar()
  const { locale, isHydrated } = useI18n()
  const { user, logout } = useAuth()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const handleLogoutClick = () => {
    setShowLogoutDialog(true)
  }

  const handleConfirmLogout = () => {
    setShowLogoutDialog(false)
    logout()
  }
  
  return (
    <div className="flex flex-col gap-4 items-center-safe">
      {/* User info */}
      {user && (
        <div className={cn(
          "border-t border-sidebar-border pt-4 w-full",
          open ? "px-4" : "px-2"
        )}>
          <Link 
            href="/profile" 
            className={cn(
              "flex items-center gap-2 transition-all duration-200 hover:bg-sidebar-accent/50 rounded-lg p-2 -m-2",
              open ? "justify-start" : "justify-center"
            )}
          >
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {user.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <User className="h-4 w-4 text-primary" />
              )}
            </div>
            {open && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user.username}
                </p>
                <p className="text-xs text-sidebar-foreground/50 truncate">
                  {user.role}
                </p>
              </div>
            )}
          </Link>
          {open && (
            <Button
              onClick={handleLogoutClick}
              variant="ghost"
              size="sm"
              className="w-full mt-2 justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {locale === 'en' ? 'Logout' : 'Déconnexion'}
            </Button>
          )}
        </div>
      )}
      
      <div className="border-t border-sidebar-border pt-4 w-full">
        <p className={cn(
          "text-xs text-sidebar-foreground/50 px-4 transition-opacity duration-200",
          open ? "block" : "hidden"
        )}>
          {isHydrated && locale === 'en' ? 'NASA Kepler Data' : 'Données NASA Kepler'}
        </p>
      </div>

      <div className="flex items-center justify-between px-4 w-full">
        <div className="flex space-x-2">
          <LocaleSwitcher />
          <ThemeToggle />
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <IconBrandGithub className="h-4 w-4 text-sidebar-foreground" />
          </Button>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="bg-sidebar border-sidebar-border">
          <DialogHeader>
            <DialogTitle className="text-sidebar-foreground">
              {locale === 'en' ? 'Confirm Logout' : 'Confirmer la déconnexion'}
            </DialogTitle>
            <DialogDescription className="text-sidebar-foreground/70">
              {locale === 'en' 
                ? 'Are you sure you want to logout? You will need to sign in again to access the platform.' 
                : 'Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à la plateforme.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowLogoutDialog(false)}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              {locale === 'en' ? 'Cancel' : 'Annuler'}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmLogout}
              className="bg-red-500 hover:bg-red-600"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {locale === 'en' ? 'Logout' : 'Déconnexion'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const getNavigation = (locale: string, userRole?: string) => {
  const baseNav = [
    {
      label: locale === 'en' ? 'Dashboard' : 'Tableau de bord',
      href: '/dashboard',
      icon: <Home className="h-5 w-5 shrink-0" />,
    },
    {
      label: locale === 'en' ? 'Database' : 'Base de données',
      href: '/data',
      icon: <Database className="h-5 w-5 shrink-0" />,
    },
    {
      label: locale === 'en' ? 'AI Model' : 'Modèle IA',
      href: '/model',
      icon: <BarChart3 className="h-5 w-5 shrink-0" />,
    },
    {
      label: locale === 'en' ? 'Classification' : 'Classification',
      href: '/classification',
      icon: <Brain className="h-5 w-5 shrink-0" />,
    }
  ];

  // Add Messages page for students, researchers and admins
  if (userRole === 'student' || userRole === 'researcher' || userRole === 'admin') {
    baseNav.push({
      label: locale === 'en' ? 'Messages' : 'Messages',
      href: '/messages',
      icon: <MessageSquare className="h-5 w-5 shrink-0" />,
    });
  }

  // Add Researchers page for students, researchers and admins
  if (userRole === 'student' || userRole === 'researcher' || userRole === 'admin') {
    baseNav.push({
      label: locale === 'en' ? 'Researchers' : 'Chercheurs',
      href: '/researchers',
      icon: <Users className="h-5 w-5 shrink-0" />,
    });
  }

  // Add Sync page only for admins
  if (userRole === 'admin') {
    baseNav.push({
      label: locale === 'en' ? 'Synchronization' : 'Synchronisation',
      href: '/sync',
      icon: <RefreshCw className="h-5 w-5 shrink-0" />,
    });
    baseNav.push({
      label: locale === 'en' ? 'Users' : 'Utilisateurs',
      href: '/users',
      icon: <Users className="h-5 w-5 shrink-0" />,
    });
  }

  return baseNav;
}

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const { locale, isHydrated } = useI18n()
  const { user, isAuthenticated, isLoading } = useAuth()

  // Protéger les routes - rediriger vers login si non authentifié
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  // Use fallback navigation during hydration
  const navigation = isHydrated ? getNavigation(locale, user?.role) : getNavigation('fr')
  
  // Afficher un loader pendant la vérification
  if (isLoading) {
    return (
      <div className="h-screen cosmic-gradient flex items-center justify-center">
        <div className="text-center">
          <Telescope className="h-12 w-12 text-primary glow-effect animate-pulse mx-auto mb-4" />
          <p className="text-sidebar-foreground">
            {locale === 'en' ? 'Loading...' : 'Chargement...'}
          </p>
        </div>
      </div>
    )
  }

  // Ne rien afficher si non authentifié (la redirection va s'effectuer)
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="h-screen cosmic-gradient flex flex-col md:flex-row overflow-hidden">
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody className="justify-between gap-10 h-full">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <div className="flex flex-col gap-2">
              <SidebarHeader />

              <div className="mt-8 flex flex-col gap-2">
                {navigation.map((link, idx) => {
                  const isActive = pathname === link.href
                  return (
                    <SidebarLink
                      key={idx}
                      link={link}
                      className={cn(
                        "transition-all duration-200",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground glow-effect"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      )}
                    />
                  )
                })}
              </div>
            </div>
          </div>

          <SidebarFooter />
        </SidebarBody>
      </Sidebar>

      {/* Main content */}
      <div className="flex-1 transition-all duration-300 ease-in-out overflow-hidden w-full md:w-auto">
        <div className="star-field h-screen overflow-y-auto">
          <main className="pt-16 pb-4 px-3 md:pt-6 md:pb-6 md:px-4 lg:px-8">
            {children}
          </main>
        </div>
      </div>

      {/* Chatbot Bubble for students, researchers and admins */}
      <ChatbotBubble />
    </div>
  )
}