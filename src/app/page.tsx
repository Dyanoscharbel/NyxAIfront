"use client";

import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { 
  ArrowRight, 
  Rocket, 
  Brain, 
  Database, 
  BarChart3, 
  Globe, 
  Users, 
  Zap, 
  Shield, 
  Telescope, 
  Github
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/hooks/useTheme";
import { useI18n } from "@/hooks/useI18n";
import { LocaleSwitcher } from "@/components/ui/locale-switcher";

export default function Home() {
  const { mounted } = useTheme();
  const { t, isHydrated, locale } = useI18n();
  
  // Prevent hydration mismatch
  if (!mounted || !isHydrated) {
    return <div className="min-h-screen cosmic-gradient" />;
  }
  
  return (
    <div className="min-h-screen cosmic-gradient overflow-x-hidden">
      {/* Minimal Header */}
      <header className="star-field border-b border-sidebar-border/20">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 w-full">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 flex-shrink min-w-0">
              <Telescope className="h-6 w-6 sm:h-8 sm:w-8 text-primary glow-effect flex-shrink-0" />
              <div className="min-w-0 max-w-[120px] sm:max-w-none">
                <h1 className="text-sm sm:text-lg md:text-xl font-bold text-sidebar-foreground truncate">
                  ExoPlanet AI
                </h1>
                <p className="text-xs sm:text-sm text-sidebar-foreground/60 truncate hidden sm:block">
                  Classification d&apos;exoplanètes
                </p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-1 sm:space-x-4 flex-shrink-0">
              {/* Version mobile compacte du bouton Dashboard */}
              <Button variant="ghost" size="sm" className="sm:hidden px-2 py-1 text-xs" asChild>
                <Link href="/dashboard">DB</Link>
              </Button>
              {/* Version desktop complète */}
              <Button variant="ghost" size="sm" className="hidden sm:flex" asChild>
                <Link href="/dashboard">{t('nav.dashboard')}</Link>
              </Button>
              <div className="flex space-x-1 sm:space-x-2">
                <LocaleSwitcher />
                <ThemeToggle />
                <Button size="sm" variant="ghost" className="h-8 w-8 sm:h-9 sm:w-9 p-0">
                  <Github className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <HeroHighlight containerClassName="min-h-screen">
        <div className="max-w-4xl mx-auto text-center px-2 sm:px-4 w-full">
          <Badge variant="secondary" className="mb-4 sm:mb-6 bg-sidebar-accent/20 text-sidebar-accent-foreground border-sidebar-border text-xs sm:text-sm max-w-[90vw] mx-auto">
            <Rocket className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
            <span className="truncate">{t('home.badge')}</span>
          </Badge>
          
          <h1 className="text-xl sm:text-4xl md:text-6xl font-bold text-sidebar-foreground mb-4 sm:mb-6 leading-tight px-1 sm:px-0">
            {locale === 'en' ? (
              <>
                <span className="block sm:inline">Explore the cosmos</span>{" "}
                <span className="block sm:inline">with{" "}</span>
                <Highlight className="text-sidebar-foreground dark:text-sidebar-foreground">
                  revolutionary AI
                </Highlight>
              </>
            ) : (
              <>
                <span className="block sm:inline">Explorez le cosmos</span>{" "}
                <span className="block sm:inline">avec{" "}</span>
                <Highlight className="text-sidebar-foreground dark:text-sidebar-foreground">
                  l&apos;IA révolutionnaire
                </Highlight>
              </>
            )}
          </h1>
          
          <div className="text-sm sm:text-xl md:text-2xl text-sidebar-foreground/70 mb-6 sm:mb-8 max-w-3xl mx-auto px-1 sm:px-2">
            <TextGenerateEffect words={t('home.subtitle')} />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-1 sm:px-2 max-w-full">
            <Button asChild size="lg" className="text-sm sm:text-lg bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto min-w-0">
              <Link href="/dashboard" className="truncate">
                {t('home.cta.start')} <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-sm sm:text-lg border-sidebar-border bg-sidebar-accent/10 text-sidebar-foreground hover:bg-sidebar-accent/20 w-full sm:w-auto min-w-0" asChild>
              <Link href="/data" className="truncate">
                {t('home.cta.explore')}
              </Link>
            </Button>
          </div>
        </div>
      </HeroHighlight>
      
      {/* Features Section */}
      <section className="py-12 sm:py-20 px-2 sm:px-4 star-field overflow-hidden">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-sidebar-foreground px-1 sm:px-2">
              {t('home.features.title')}
            </h2>
            <p className="text-sm sm:text-xl text-sidebar-foreground/70 max-w-2xl mx-auto px-2 sm:px-4">
              {t('home.features.subtitle')}
            </p>
          </div>
          
          <BentoGrid className="max-w-4xl mx-auto w-full">
            <BentoGridItem
              title={t('home.features.aiClassification.title')}
              description={t('home.features.aiClassification.desc')}
              header={
                <div className="flex items-center justify-center h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <Brain className="w-12 h-12 text-white" />
                </div>
              }
              className="md:col-span-2"
              icon={<Brain className="h-4 w-4 text-sidebar-foreground/60" />}
            />
            <BentoGridItem
              title={t('home.features.dataAnalysis.title')}
              description={t('home.features.dataAnalysis.desc')}
              header={
                <div className="flex items-center justify-center h-32 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg">
                  <BarChart3 className="w-12 h-12 text-white" />
                </div>
              }
              icon={<BarChart3 className="h-4 w-4 text-sidebar-foreground/60" />}
            />
            <BentoGridItem
              title={t('home.features.realTimeMonitoring.title')}
              description={t('home.features.realTimeMonitoring.desc')}
              header={
                <div className="flex items-center justify-center h-32 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
                  <Globe className="w-12 h-12 text-white" />
                </div>
              }
              icon={<Globe className="h-4 w-4 text-sidebar-foreground/60" />}
            />
            <BentoGridItem
              title={t('home.features.collaboration.title')}
              description={t('home.features.collaboration.desc')}
              header={
                <div className="flex items-center justify-center h-32 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                  <Users className="w-12 h-12 text-white" />
                </div>
              }
              className="md:col-span-2"
              icon={<Users className="h-4 w-4 text-sidebar-foreground/60" />}
            />
          </BentoGrid>
        </div>
      </section>
      
      {/* Capabilities Section */}
      <section className="py-12 sm:py-20 px-3 sm:px-4 bg-sidebar/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-sidebar-foreground px-2">
              {t('home.capabilities.title')}
            </h2>
            <p className="text-base sm:text-xl text-sidebar-foreground/70 max-w-2xl mx-auto px-4">
              {t('home.capabilities.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            <Card className="border-2 border-sidebar-border bg-sidebar/40 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-sidebar-foreground">{t('home.capabilities.database.title')}</CardTitle>
                <CardDescription className="text-sidebar-foreground/70">
                  {t('home.capabilities.database.desc')}
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-2 border-sidebar-border bg-sidebar/40 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-sidebar-foreground">{t('home.capabilities.speed.title')}</CardTitle>
                <CardDescription className="text-sidebar-foreground/70">
                  {t('home.capabilities.speed.desc')}
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-2 border-sidebar-border bg-sidebar/40 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-sidebar-foreground">{t('home.capabilities.reliability.title')}</CardTitle>
                <CardDescription className="text-sidebar-foreground/70">
                  {t('home.capabilities.reliability.desc')}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-12 sm:py-20 px-3 sm:px-4 star-field">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-sidebar-foreground px-2">
            {t('home.cta2.title')}
          </h2>
          <p className="text-base sm:text-xl text-sidebar-foreground/70 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            {t('home.cta2.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
            <Button size="lg" className="text-base sm:text-lg bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto" asChild>
              <Link href="/dashboard">
                {t('home.cta2.explore')} <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-base sm:text-lg border-sidebar-border bg-sidebar-accent/10 text-sidebar-foreground hover:bg-sidebar-accent/20 w-full sm:w-auto" asChild>
              <Link href="/classification">
                {t('home.cta2.tryAi')}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sidebar/60 backdrop-blur-xl py-8 sm:py-12 px-3 sm:px-4 border-t border-sidebar-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <Telescope className="h-8 w-8 text-primary glow-effect" />
                <div>
                  <h3 className="text-lg font-semibold text-sidebar-foreground">ExoPlanet AI</h3>
                  <p className="text-sm text-sidebar-foreground/60">Classification d&apos;exoplanètes</p>
                </div>
              </div>
              <p className="text-sidebar-foreground/70 mb-4 max-w-md">
                {t('footer.description')}
              </p>
              <div className="flex space-x-4">
                <Badge variant="secondary" className="bg-sidebar-accent/20 text-sidebar-accent-foreground border-sidebar-border">{t('footer.badges.ai')}</Badge>
                <Badge variant="secondary" className="bg-sidebar-accent/20 text-sidebar-accent-foreground border-sidebar-border">{t('footer.badges.realtime')}</Badge>
                <Badge variant="secondary" className="bg-sidebar-accent/20 text-sidebar-accent-foreground border-sidebar-border">{t('footer.badges.research')}</Badge>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-sidebar-foreground">{t('footer.features')}</h4>
              <ul className="space-y-2 text-sidebar-foreground/70">
                <li><Link href="/dashboard" className="hover:text-sidebar-foreground transition-colors">{t('nav.dashboard')}</Link></li>
                <li><Link href="/classification" className="hover:text-sidebar-foreground transition-colors">{t('nav.classification')}</Link></li>
                <li><Link href="/data" className="hover:text-sidebar-foreground transition-colors">{t('nav.data')}</Link></li>
                <li><Link href="/model" className="hover:text-sidebar-foreground transition-colors">{t('nav.model')}</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-sidebar-foreground">{t('footer.resources')}</h4>
              <ul className="space-y-2 text-sidebar-foreground/70">
                <li><a href="#" className="hover:text-sidebar-foreground transition-colors">{t('footer.links.documentation')}</a></li>
                <li><a href="#" className="hover:text-sidebar-foreground transition-colors">{t('footer.links.api')}</a></li>
                <li><a href="#" className="hover:text-sidebar-foreground transition-colors">{t('footer.links.papers')}</a></li>
                <li><a href="#" className="hover:text-sidebar-foreground transition-colors">{t('footer.links.community')}</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-sidebar-border mt-8 pt-8 text-center text-sidebar-foreground/60">
            <p>&copy; 2025 ExoPlanet AI. {t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
