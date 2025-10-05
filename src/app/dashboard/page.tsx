"use client";

import { useEffect, useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { SimpleBarChart, SimpleDonutChart, StatCard } from '@/components/charts/SimpleCharts'
import { useI18n } from '@/hooks/useI18n'
import { NASAADQLService, type KOIStats } from '@/services/nasaADQLService'
import { 
  Telescope, 
  Star, 
  Target, 
  AlertTriangle, 
  TrendingUp,
  Database,
  Zap,
  Calendar,
  Globe,
  BarChart3,
  ExternalLink,
  RefreshCw,
  Loader2,
  CheckCircle
} from 'lucide-react'

export default function DashboardPage() {
  const { t, locale, isHydrated } = useI18n();
  
  // État pour les données NASA KOI
  const [koiStats, setKoiStats] = useState<KOIStats | null>(null);
  const [loading, setLoading] = useState(false); // Pas de loading initial
  const [refreshing, setRefreshing] = useState(false); // Indicateur de refresh
  const [error, setError] = useState<string | null>(null);
  const [lastUpdateNotification, setLastUpdateNotification] = useState<string | null>(null);

  // Fonction pour récupérer les statistiques NASA avec chargement progressif
  const fetchNASAStatsProgressive = async () => {
    try {
      console.log('🚀 Récupération progressive des données NASA KOI...');
      
      // Utiliser la méthode avec cache + background refresh
      const stats = await NASAADQLService.getKOIStatsWithBackgroundRefresh();
      
      // Si on avait déjà des données et qu'on reçoit de nouvelles données fraîches
      if (koiStats && !stats.isFromCache && koiStats.isFromCache) {
        setLastUpdateNotification(locale === 'en' ? 'Data updated!' : 'Données mises à jour !');
        setTimeout(() => setLastUpdateNotification(null), 3000); // Masquer après 3 secondes
      }
      
      setKoiStats(stats);
      
      if (stats.isFromCache) {
        console.log('📋 Données affichées depuis le cache');
      } else {
        console.log('✅ Nouvelles données NASA récupérées:', stats);
      }
      
      setError(null);
    } catch (err) {
      console.error('❌ Erreur NASA API:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la récupération des données NASA');
    }
  };

  // Fonction pour forcer un refresh manuel
  const forceRefreshNASAStats = async () => {
    setRefreshing(true);
    setError(null);
    
    try {
      console.log('🔄 Refresh manuel des données NASA...');
      const stats = await NASAADQLService.getKOIStats(true); // Force refresh
      setKoiStats(stats);
      console.log('✅ Refresh manuel terminé:', stats);
    } catch (err) {
      console.error('❌ Erreur lors du refresh manuel:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du refresh des données NASA');
    } finally {
      setRefreshing(false);
    }
  };

  // Récupération des données au montage du composant (progressif)
  useEffect(() => {
    fetchNASAStatsProgressive();
  }, []);

  // Actualisation automatique en arrière-plan toutes les 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') { // Seulement si la page est visible
        console.log('🔄 Actualisation automatique en arrière-plan...');
        fetchNASAStatsProgressive();
      }
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, [koiStats]);

  // Données pour les graphiques basées sur les vraies données NASA
  const dispositionData = koiStats ? [
    { name: isHydrated ? t('dashboard.stats.confirmed') : 'Confirmées', value: koiStats.confirmed, color: '#10b981' },
    { name: isHydrated ? t('dashboard.stats.candidates') : 'Candidates', value: koiStats.candidates, color: '#f59e0b' },
    { name: isHydrated ? t('dashboard.stats.falsePositives') : 'Faux Positifs', value: koiStats.falsePositives, color: '#ef4444' }
  ] : [];

  // Affichage de chargement
  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px] space-x-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="text-lg text-muted-foreground">
            {locale === 'en' ? 'Loading NASA KOI data...' : 'Chargement des données NASA KOI...'}
          </div>
        </div>
      </AppLayout>
    );
  }

  // Affichage d'erreur avec bouton de retry
  if (error) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <AlertTriangle className="h-12 w-12 text-red-500" />
          <div className="text-lg text-muted-foreground text-center">
            <p className="mb-2">{locale === 'en' ? 'Error loading NASA data' : 'Erreur lors du chargement des données NASA'}</p>
            <p className="text-sm text-red-500">{error}</p>
          </div>
          <Button onClick={forceRefreshNASAStats} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            {locale === 'en' ? 'Retry' : 'Réessayer'}
          </Button>
        </div>
      </AppLayout>
    );
  }
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Notification de mise à jour */}
        {lastUpdateNotification && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-2 duration-300">
            <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">{lastUpdateNotification}</span>
            </div>
          </div>
        )}

        {/* En-tête */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Telescope className="h-8 w-8 text-primary glow-effect" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                ExoPlanet AI {t('dashboard.title')}
              </h1>
              <p className="text-lg text-muted-foreground">
                {locale === 'en' ? 'Intelligent exoplanet classification from NASA missions' : `Classification intelligente d'exoplanètes des missions NASA`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{t('dashboard.stats.lastUpdate')}: {koiStats ? new Date(koiStats.lastUpdated).toLocaleDateString(locale === 'en' ? 'en-US' : 'fr-FR') : 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="glow-effect">
                  <Database className="h-3 w-3 mr-1" />
                  NASA KOI Archive
                </Badge>
                {koiStats?.isFromCache && (
                  <Badge variant="outline" className="text-xs">
                    {locale === 'en' ? 'Cached' : 'Cache'}
                  </Badge>
                )}
                {refreshing && (
                  <Badge variant="outline" className="text-xs">
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    {locale === 'en' ? 'Updating' : 'Actualisation'}
                  </Badge>
                )}
              </div>
            </div>
            <Button 
              onClick={forceRefreshNASAStats} 
              variant="ghost" 
              size="sm"
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {locale === 'en' ? 'Refresh' : 'Actualiser'}
            </Button>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title={t('dashboard.stats.total')}
            value={koiStats?.totalKOI || 0}
            description="NASA KOI Archive"
            icon={<Database className="h-8 w-8" />}
          />
          
          <StatCard
            title={t('dashboard.stats.confirmed')}
            value={koiStats?.confirmed || 0}
            description={koiStats ? `${((koiStats.confirmed / koiStats.totalKOI) * 100).toFixed(1)}% ${locale === 'en' ? 'of total' : 'du total'}` : 'Loading...'}
            icon={<Star className="h-8 w-8 text-green-500" />}
          />
          
          <StatCard
            title={t('dashboard.stats.candidates')}
            value={koiStats?.candidates || 0}
            description={koiStats ? `${((koiStats.candidates / koiStats.totalKOI) * 100).toFixed(1)}% ${locale === 'en' ? 'of total' : 'du total'}` : 'Loading...'}
            icon={<Target className="h-8 w-8 text-yellow-500" />}
          />
          
          <StatCard
            title={t('dashboard.stats.falsePositives')}
            value={koiStats?.falsePositives || 0}
            description={koiStats ? `${((koiStats.falsePositives / koiStats.totalKOI) * 100).toFixed(1)}% ${locale === 'en' ? 'of total' : 'du total'}` : 'Loading...'}
            icon={<AlertTriangle className="h-8 w-8 text-red-500" />}
          />
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Distribution par disposition */}
          <SimpleDonutChart
            data={dispositionData}
            title={locale === 'en' ? 'Distribution by Status' : 'Distribution par Statut'}
            description={locale === 'en' ? 'KOI distribution by classification (NASA Data)' : 'Répartition des KOI par classification (Données NASA)'}
            centerValue={koiStats?.totalKOI.toLocaleString() || '0'}
            centerLabel={locale === 'en' ? 'Total KOI' : 'Total KOI'}
          />

          {/* Boutons d'accès rapide */}
          <Card className="planet-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                  <Zap className="h-4 w-4 text-primary" />
                </div>
                <span>
                  {locale === 'en' ? 'Quick Access' : 'Accès Rapide'}
                </span>
              </CardTitle>
              <CardDescription className="text-sm">
                {locale === 'en' 
                  ? 'Advanced tools for exoplanet research and visualization'
                  : 'Outils avancés pour la recherche et visualisation d\'exoplanètes'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Bouton Visualisation 3D */}
              <Button 
                variant="outline" 
                className="w-full justify-start p-0 h-auto overflow-hidden hover:bg-primary/5 transition-all duration-200 hover:shadow-md"
                onClick={() => window.open('/visualization-3d', '_blank')}
              >
                <div className="flex items-center w-full p-4 space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-500/10">
                    <Globe className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="flex-1 text-left space-y-1">
                    <h4 className="font-semibold text-sm">
                      {locale === 'en' ? '3D Visualization' : 'Visualisation 3D'}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {locale === 'en' 
                        ? 'Interactive 3D view of planets and exoplanets'
                        : 'Vue 3D interactive des planètes et exoplanètes'
                      }
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>
              </Button>

              {/* Bouton Résultats d'analyse */}
              <Button 
                variant="outline" 
                className="w-full justify-start p-0 h-auto overflow-hidden hover:bg-primary/5 transition-all duration-200 hover:shadow-md"
                onClick={() => window.open('/analysis-results', '_blank')}
              >
                <div className="flex items-center w-full p-4 space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-500/10">
                    <BarChart3 className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="flex-1 text-left space-y-1">
                    <h4 className="font-semibold text-sm">
                      {locale === 'en' ? 'Analysis Results' : 'Résultats d\'Analyse'}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {locale === 'en' 
                        ? 'Detailed analysis and classification results'
                        : 'Résultats détaillés d\'analyse et classification'
                      }
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>
              </Button>

              {/* Bouton Test NASA API */}
              <Button 
                variant="outline" 
                className="w-full justify-start p-0 h-auto overflow-hidden hover:bg-primary/5 transition-all duration-200 hover:shadow-md"
                onClick={() => window.open('/test-nasa', '_blank')}
              >
                <div className="flex items-center w-full p-4 space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-500/10">
                    <Database className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="flex-1 text-left space-y-1">
                    <h4 className="font-semibold text-sm">
                      {locale === 'en' ? 'Test NASA API' : 'Test API NASA'}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {locale === 'en' 
                        ? 'Test connection to NASA KOI data archive'
                        : 'Tester la connexion aux archives de données NASA KOI'
                      }
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>
              </Button>

              {/* Bouton Interface NASA */}
              <Button 
                variant="outline" 
                className="w-full justify-start p-0 h-auto overflow-hidden hover:bg-primary/5 transition-all duration-200 hover:shadow-md"
                onClick={() => window.open('https://exoplanetarchive.ipac.caltech.edu/applications/ExoTables/', '_blank')}
              >
                <div className="flex items-center w-full p-4 space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-500/10">
                    <ExternalLink className="h-6 w-6 text-purple-500" />
                  </div>
                  <div className="flex-1 text-left space-y-1">
                    <h4 className="font-semibold text-sm">
                      {locale === 'en' ? 'NASA Interface' : 'Interface NASA'}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {locale === 'en' 
                        ? 'Official NASA spatial visualization for researchers'
                        : 'Visualisation spatiale officielle NASA pour chercheurs'
                      }
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>


        {/* Project Information */}
        <Card className="planet-card">
          <CardHeader>
            <CardTitle>
              {locale === 'en' ? 'About the Project' : 'À Propos du Projet'}
            </CardTitle>
            <CardDescription>
              {locale === 'en' 
                ? 'Exoplanet classification using artificial intelligence' 
                : `Classification d'exoplanètes utilisant l'intelligence artificielle`
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {locale === 'en'
                ? `Our system uses data from NASA's Kepler space mission to automatically classify Kepler Objects of Interest (KOI) and identify confirmed exoplanets, candidates and false positives.`
                : `Notre système utilise les données de la mission spatiale Kepler de la NASA pour classifier automatiquement les objets d'intérêt Kepler (KOI) et identifier les exoplanètes confirmées, candidates et faux positifs.`
              }
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-primary/10">
                <Telescope className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h4 className="font-semibold">
                  {locale === 'en' ? 'NASA Data' : 'Données NASA'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {locale === 'en' ? 'Kepler Mission' : 'Mission Kepler'}
                </p>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-primary/10">
                <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h4 className="font-semibold">
                  {locale === 'en' ? 'Advanced AI' : 'IA Avancée'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {locale === 'en' ? 'Automatic classification' : 'Classification automatique'}
                </p>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-primary/10">
                <Star className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h4 className="font-semibold">
                  {locale === 'en' ? 'High Precision' : 'Précision Élevée'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {locale === 'en' ? '94.2% accuracy' : '94.2% de précision'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}