"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/contexts/AuthContext'
import { useI18n } from '@/hooks/useI18n'
import { 
  RefreshCw, 
  Database, 
  Loader2, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  TrendingUp,
  Star,
  Target,
  XCircle,
  Calendar,
  Activity,
  Zap,
  Shield
} from 'lucide-react'

interface SyncStats {
  startTime: string
  resumeMode: boolean
  totalFromNASA: number
  newKOIs: number
  skippedFromLastSync: number
  confirmed: number
  falsePositive: number
  candidates: number
  candidatesClassifiedByAI: number
  errors: number
  duration: number
}

export default function SyncPage() {
  const { user } = useAuth()
  const { locale } = useI18n()
  const router = useRouter()
  
  const [issyncing, setIsSyncing] = useState(false)
  const [syncStats, setSyncStats] = useState<SyncStats | null>(null)
  const [error, setError] = useState('')
  const [syncMode, setSyncMode] = useState<'incremental' | 'full'>('incremental')

  // Vérifier si l'utilisateur est admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleSync = async (fullSync: boolean = false) => {
    setIsSyncing(true)
    setError('')
    setSyncStats(null)
    setSyncMode(fullSync ? 'full' : 'incremental')

    try {
      const token = localStorage.getItem('auth_token')
      
      const response = await fetch(`http://localhost:3001/api/sync/run${fullSync ? '?full=true' : ''}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Synchronization failed')
      }

      if (data.success) {
        setSyncStats(data.data)
      } else {
        throw new Error(data.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Synchronization failed')
    } finally {
      setIsSyncing(false)
    }
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <Database className="h-8 w-8 text-primary glow-effect" />
              <h1 className="text-3xl font-bold text-foreground">
                {locale === 'en' ? 'Data Synchronization' : 'Synchronisation des données'}
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              {locale === 'en' 
                ? 'Synchronize exoplanet data from NASA archives' 
                : 'Synchroniser les données d\'exoplanètes depuis les archives NASA'
              }
            </p>
          </div>
          
          <Badge variant="default" className="glow-effect">
            <Shield className="h-3 w-3 mr-1" />
            Admin Only
          </Badge>
        </div>

        {/* Sync Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-sidebar-border/50 bg-sidebar/50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-5 w-5 text-primary" />
                <CardTitle>
                  {locale === 'en' ? 'Incremental Sync' : 'Synchronisation incrémentale'}
                </CardTitle>
              </div>
              <CardDescription>
                {locale === 'en' 
                  ? 'Resumes from last checkpoint, processes only new KOIs' 
                  : 'Reprend au dernier point de contrôle, traite uniquement les nouveaux KOIs'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleSync(false)}
                disabled={issyncing}
                className="w-full"
              >
                {issyncing && syncMode === 'incremental' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {locale === 'en' ? 'Syncing...' : 'Synchronisation...'}
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {locale === 'en' ? 'Start Incremental Sync' : 'Démarrer la sync incrémentale'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-sidebar-border/50 bg-sidebar/50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-amber-500" />
                <CardTitle>
                  {locale === 'en' ? 'Full Sync' : 'Synchronisation complète'}
                </CardTitle>
              </div>
              <CardDescription>
                {locale === 'en' 
                  ? 'Forces complete synchronization, ignores checkpoints' 
                  : 'Force une synchronisation complète, ignore les points de contrôle'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleSync(true)}
                disabled={issyncing}
                variant="outline"
                className="w-full"
              >
                {issyncing && syncMode === 'full' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {locale === 'en' ? 'Syncing...' : 'Synchronisation...'}
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    {locale === 'en' ? 'Start Full Sync' : 'Démarrer la sync complète'}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{locale === 'en' ? 'Error' : 'Erreur'}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Syncing Progress */}
        {issyncing && !syncStats && (
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium text-foreground mb-2">
                    {locale === 'en' ? 'Synchronization in progress...' : 'Synchronisation en cours...'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {locale === 'en' 
                      ? 'This may take several minutes depending on the amount of data' 
                      : 'Cela peut prendre plusieurs minutes selon la quantité de données'
                    }
                  </p>
                </div>
                <Progress value={undefined} className="w-full" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sync Results */}
        {syncStats && (
          <div className="space-y-4">
            <Alert className="border-green-500/50 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-green-500">
                {locale === 'en' ? 'Synchronization Completed' : 'Synchronisation terminée'}
              </AlertTitle>
              <AlertDescription>
                {locale === 'en' 
                  ? `Successfully synchronized ${syncStats.newKOIs} new KOIs in ${(syncStats.duration / 1000).toFixed(1)}s` 
                  : `${syncStats.newKOIs} nouveaux KOIs synchronisés avec succès en ${(syncStats.duration / 1000).toFixed(1)}s`
                }
              </AlertDescription>
            </Alert>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-green-500" />
                    <span>{locale === 'en' ? 'Confirmed' : 'Confirmés'}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-500">{syncStats.confirmed}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-amber-500" />
                    <span>{locale === 'en' ? 'Candidates' : 'Candidats'}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-amber-500">{syncStats.candidates}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span>{locale === 'en' ? 'False Positives' : 'Faux Positifs'}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-red-500">{syncStats.falsePositive}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <span>{locale === 'en' ? 'AI Classified' : 'Classifiés IA'}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-500">{syncStats.candidatesClassifiedByAI}</p>
                </CardContent>
              </Card>
            </div>

            {/* Details */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {locale === 'en' ? 'Synchronization Details' : 'Détails de la synchronisation'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {locale === 'en' ? 'Start Time' : 'Heure de début'}
                  </span>
                  <span className="font-mono">{new Date(syncStats.startTime).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center">
                    <Activity className="h-4 w-4 mr-2" />
                    {locale === 'en' ? 'Mode' : 'Mode'}
                  </span>
                  <Badge variant={syncStats.resumeMode ? 'secondary' : 'outline'}>
                    {syncStats.resumeMode 
                      ? (locale === 'en' ? 'Resume' : 'Reprise') 
                      : (locale === 'en' ? 'Full' : 'Complet')
                    }
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center">
                    <Database className="h-4 w-4 mr-2" />
                    {locale === 'en' ? 'Total from NASA' : 'Total depuis NASA'}
                  </span>
                  <span className="font-semibold">{syncStats.totalFromNASA.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    {locale === 'en' ? 'New KOIs Detected' : 'Nouveaux KOIs détectés'}
                  </span>
                  <span className="font-semibold">{syncStats.newKOIs.toLocaleString()}</span>
                </div>
                {syncStats.skippedFromLastSync > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {locale === 'en' ? 'Skipped (Already Processed)' : 'Ignorés (déjà traités)'}
                    </span>
                    <span className="font-semibold">{syncStats.skippedFromLastSync.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {locale === 'en' ? 'Duration' : 'Durée'}
                  </span>
                  <span className="font-semibold">{(syncStats.duration / 1000).toFixed(1)}s</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Info Card */}
        <Card className="border-blue-500/50 bg-blue-500/5">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-500">
              <Activity className="h-5 w-5" />
              <span>{locale === 'en' ? 'How it works' : 'Comment ça marche'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              {locale === 'en' 
                ? '• Incremental sync checks the last synchronization and resumes from where it stopped' 
                : '• La synchronisation incrémentale vérifie la dernière synchronisation et reprend là où elle s\'est arrêtée'
              }
            </p>
            <p>
              {locale === 'en' 
                ? '• Full sync ignores previous checkpoints and processes all new data' 
                : '• La synchronisation complète ignore les points de contrôle précédents et traite toutes les nouvelles données'
              }
            </p>
            <p>
              {locale === 'en' 
                ? '• Candidates are automatically classified by the AI model' 
                : '• Les candidats sont automatiquement classifiés par le modèle IA'
              }
            </p>
            <p>
              {locale === 'en' 
                ? '• All data is retrieved directly from NASA Exoplanet Archive' 
                : '• Toutes les données proviennent directement des archives NASA Exoplanet'
              }
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
