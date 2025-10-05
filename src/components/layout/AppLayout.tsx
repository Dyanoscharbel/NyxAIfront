"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Telescope,
  Home,
  Brain,
  Database,
  BarChart3,
  Github
} from 'lucide-react'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { LocaleSwitcher } from '@/components/ui/locale-switcher'
import { useI18n } from '@/hooks/useI18n'
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
          ExoPlanet AI
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
  
  return (
    <div className="flex flex-col gap-4 items-center-safe">
      <div className="border-t border-sidebar-border pt-4">
        <p className={cn(
          "text-xs text-sidebar-foreground/50 px-4 transition-opacity duration-200",
          open ? "block" : "hidden"
        )}>
          {isHydrated && locale === 'en' ? 'NASA Kepler Data' : 'Données NASA Kepler'}
        </p>
      </div>

      <div className="flex items-center justify-between px-4">
        <div className="flex space-x-2">
          <LocaleSwitcher />
          <ThemeToggle />
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <IconBrandGithub className="h-4 w-4 text-sidebar-foreground" />
          </Button>
        </div>
      </div>
    </div>
  )
}

const getNavigation = (locale: string) => [
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
]

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { locale, isHydrated } = useI18n()

  // Use fallback navigation during hydration
  const navigation = isHydrated ? getNavigation(locale) : getNavigation('fr')

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
    </div>
  )
}