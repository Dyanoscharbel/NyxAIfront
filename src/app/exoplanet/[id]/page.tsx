"use client"

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { useI18n } from '@/hooks/useI18n'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  ArrowLeft,
  Eye, 
  ExternalLink, 
  Download, 
  Brain, 
  Star, 
  Globe, 
  Thermometer, 
  Clock, 
  Ruler,
  Target,
  Calendar,
  Database,
  FileText,
  Telescope,
  Printer
} from 'lucide-react'
import { Exoplanet } from '@/types/exoplanet'

// Données mockées - en production, ceci viendrait d'une API
const mockExoplanets: Exoplanet[] = [
  {
    id: 'koi-1',
    name: 'Kepler-442b',
    kepid: 9632895,
    period: 112.3,
    transitDuration: 5.2,
    transitDepth: 470,
    planetRadius: 1.34,
    stellarName: 'Kepler-442',
    stellarRadius: 0.61,
    stellarMass: 0.60,
    stellarTemperature: 4402,
    stellarMagnitude: 13.27,
    insolationFlux: 0.70,
    equilibriumTemperature: 233,
    disposition: 'CONFIRMED',
    score: 0.89,
    discoveryMethod: 'Transit',
    discoveryDate: '2015-01-06',
    mission: 'Kepler',
    visualizationUrl: 'https://eyes.nasa.gov/apps/exo/#/planet/Kepler-442_b',
    createdAt: '2015-01-06T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'ai-1',
    name: 'Kepler-442b (IA)',
    kepid: 9632895,
    period: 112.3,
    transitDuration: 5.2,
    transitDepth: 470,
    planetRadius: 1.34,
    stellarName: 'Kepler-442',
    stellarRadius: 0.61,
    stellarMass: 0.60,
    stellarTemperature: 4402,
    stellarMagnitude: 13.27,
    insolationFlux: 0.70,
    equilibriumTemperature: 233,
    disposition: 'CONFIRMED',
    score: 0.95,
    discoveryMethod: 'Transit',
    discoveryDate: '2015-01-06',
    mission: 'Kepler',
    isAiGenerated: true,
    visualizationUrl: 'https://eyes.nasa.gov/apps/exo/#/planet/Kepler-442_b',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
]

export default function ExoplanetProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { locale } = useI18n()
  const [exoplanet, setExoplanet] = useState<Exoplanet | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [showPdfPreview, setShowPdfPreview] = useState(false)

  useEffect(() => {
    const fetchExoplanetData = async () => {
      const id = params.id as string
      
      try {
        // D'abord, essayer de trouver dans les données mockées
        let found = mockExoplanets.find(e => e.id === id)
        
        if (!found) {
          // Si pas trouvé dans les mocks, essayer de récupérer depuis l'API MongoDB
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'
          
          try {
            const response = await fetch(`${backendUrl}/api/exoplanets/${id}`, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' }
            })
            
            if (response.ok) {
              const responseData = await response.json()
              const mongoData = responseData.data
              
              if (mongoData) {
                console.log('✅ Données récupérées depuis MongoDB:', mongoData.kepoi_name || mongoData.kepler_name)
                
                // Mapper les données MongoDB vers le format Exoplanet
                found = {
                  id: mongoData._id || mongoData.id || id,
                  name: mongoData.koi_name || mongoData.kepoi_name || mongoData.name || id,
                  keplerName: mongoData.kepler_name || mongoData.keplerName,
                  kepid: mongoData.kepid || mongoData.koi_kepid || 0,
                  period: mongoData.period || mongoData.koi_period || mongoData.Period || 365.25,
                  transitDuration: mongoData.transitDuration || mongoData.koi_duration || 6.5,
                  transitDepth: mongoData.transitDepth || mongoData.koi_depth || 500,
                  planetRadius: mongoData.radius || mongoData.koi_prad || mongoData.Radius || mongoData.planetRadius || 1.0,
                  stellarName: getStarName(mongoData.kepler_name || mongoData.keplerName),
                  stellarRadius: mongoData.stellarRadius || mongoData.koi_srad || 1.0,
                  stellarMass: mongoData.stellarMass || mongoData.koi_smass || 1.0,
                  stellarTemperature: mongoData.stellarTemperature || mongoData.koi_steff || 5778,
                  stellarMagnitude: mongoData.stellarMagnitude || mongoData.koi_kepmag || 4.83,
                  insolationFlux: mongoData.insolationFlux || mongoData.koi_insol || 1.0,
                  equilibriumTemperature: mongoData.temperature || mongoData.koi_teq || mongoData.temp || mongoData.equilibriumTemperature || 288,
                  disposition: (mongoData.disposition || mongoData.koi_disposition || 'CANDIDATE') as 'CONFIRMED' | 'CANDIDATE' | 'FALSE POSITIVE',
                  score: mongoData.score || mongoData.koi_score || 0.75,
                  discoveryMethod: mongoData.discoveryMethod || 'Transit',
                  discoveryDate: mongoData.discoveryDate || '2024-01-01',
                  mission: 'Kepler' as const,
                  createdAt: mongoData.createdAt || new Date().toISOString(),
                  updatedAt: mongoData.updatedAt || new Date().toISOString(),
                  isAiGenerated: mongoData.isAiGenerated || mongoData.ai_generated || mongoData.IS_AI || false
                }
              }
            } else {
              console.log('❌ Exoplanète non trouvée dans MongoDB:', response.status)
            }
          } catch (error) {
            console.warn('⚠️ Impossible de récupérer les données MongoDB:', error)
          }
        }
        
        if (!found) {
          // Utiliser les données par défaut avec un nom plus propre
          found = {
            id: id,
            name: id.includes('mongo-') ? `KOI-${id.replace('mongo-', '')}` : `Exoplanet-${id}`,
            keplerName: id.includes('mongo-') ? `Kepler-${id.replace('mongo-', '')} b` : undefined,
            kepid: 0,
            period: 365.25,
            transitDuration: 6.5,
            transitDepth: 500,
            planetRadius: 1.0,
            stellarName: id.includes('mongo-') ? `Kepler-${id.replace('mongo-', '')}` : `Star-${id}`,
            stellarRadius: 1.0,
            stellarMass: 1.0,
            stellarTemperature: 5778,
            stellarMagnitude: 4.83,
            insolationFlux: 1.0,
            equilibriumTemperature: 288,
            disposition: 'CANDIDATE',
            score: 0.75,
            discoveryMethod: 'Transit',
            discoveryDate: '2024-01-01',
            mission: 'Kepler' as const,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z'
          }
        }
        
        if (found) {
          setExoplanet(found)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchExoplanetData()
  }, [params.id])

  const getDispositionColor = (disposition: string) => {
    switch (disposition) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700'
      case 'CANDIDATE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700'
      case 'FALSE POSITIVE':
        return 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200 dark:border-red-700'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700'
    }
  }

  // Extraire le nom de l'étoile à partir du keplerName
  const getStarName = (keplerName: string | undefined): string => {
    if (!keplerName) return 'N/A'
    
    // Extraire la partie avant la lettre de la planète
    // Ex: "Kepler-44 b" → "Kepler-44"
    // Ex: "Kepler-442b" → "Kepler-442" 
    const match = keplerName.match(/^(.+?)\s*[a-z]$/i)
    return match ? match[1].trim() : keplerName
  }

  // Préparer les données de comparaison avec la Terre
  const getComparisonData = () => {
    if (!exoplanet) return []
    
    return [
      {
        parameter: locale === 'en' ? 'Orbital Period' : 'Période Orbitale',
        [locale === 'en' ? 'Earth' : 'Terre']: 365.25, // Année terrestre en jours
        [exoplanet.keplerName || exoplanet.name]: exoplanet.period || 0,
        unit: locale === 'en' ? 'days' : 'jours'
      },
      {
        parameter: locale === 'en' ? 'Transit Duration' : 'Durée de Transit',
        [locale === 'en' ? 'Earth' : 'Terre']: 13.0, // Durée typique de transit de la Terre vue du Soleil (en heures)
        [exoplanet.keplerName || exoplanet.name]: exoplanet.transitDuration || 0,
        unit: locale === 'en' ? 'hours' : 'heures'
      },
      {
        parameter: locale === 'en' ? 'Transit Depth' : 'Profondeur de Transit',
        [locale === 'en' ? 'Earth' : 'Terre']: 84, // Profondeur de transit de la Terre en ppm (parties par million)
        [exoplanet.keplerName || exoplanet.name]: exoplanet.transitDepth || 0,
        unit: 'ppm'
      }
    ]
  }

  // Ouvrir la prévisualisation PDF
  const openPdfPreview = () => {
    setShowPdfPreview(true)
  }

  // Générer et télécharger le PDF
  const downloadPdf = () => {
    if (!exoplanet) return
    
    // Créer le contenu HTML pour le PDF
    const pdfContent = document.getElementById('pdf-content')
    if (!pdfContent) return

    // Utiliser window.print() pour l'instant (peut être remplacé par jsPDF plus tard)
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Rapport d'Analyse - ${exoplanet.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .section { margin-bottom: 25px; }
            .section-title { font-size: 18px; font-weight: bold; color: #2563eb; margin-bottom: 15px; border-left: 4px solid #2563eb; padding-left: 10px; }
            .parameter { display: flex; justify-content: space-between; margin-bottom: 8px; padding: 5px 0; border-bottom: 1px dotted #ccc; }
            .parameter-name { font-weight: 500; }
            .parameter-value { font-weight: bold; color: #1f2937; }
            .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
            .badge-confirmed { background-color: #dcfce7; color: #166534; }
            .badge-candidate { background-color: #fef3c7; color: #92400e; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          ${pdfContent.innerHTML}
        </body>
      </html>
    `)
    
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">
              {locale === 'en' ? 'Loading exoplanet data...' : 'Chargement des données de l\'exoplanète...'}
            </p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!exoplanet) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="text-6xl">🌌</div>
            <h1 className="text-2xl font-bold">
              {locale === 'en' ? 'Exoplanet Not Found' : 'Exoplanète Introuvable'}
            </h1>
            <p className="text-muted-foreground">
              {locale === 'en' 
                ? 'The requested exoplanet could not be found in our database.'
                : 'L\'exoplanète demandée n\'a pas pu être trouvée dans notre base de données.'
              }
            </p>
            <Button onClick={() => router.push('/data')} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {locale === 'en' ? 'Back to Data' : 'Retour aux Données'}
            </Button>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header avec navigation */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/data')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{locale === 'en' ? 'Back to Data' : 'Retour aux Données'}</span>
          </Button>
        </div>

        {/* Hero Section - Design professionnel */}
        <div 
          className="relative h-96 bg-cover bg-center bg-no-repeat rounded-xl overflow-hidden"
          style={{ 
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url('/planet_image.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          
          {/* Contenu positionné en bas */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-end justify-between">
              {/* Informations principales */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white">
                      {exoplanet.keplerName || exoplanet.name}
                    </h1>
                    <p className="text-white/70 text-lg">
                      {locale === 'en' ? 'Exoplanet Profile' : 'Profil d\'Exoplanète'}
                    </p>
                  </div>
                </div>
                
                {/* Badges sobres */}
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="bg-white/90 text-slate-800 border-0">
                    {exoplanet.disposition}
                  </Badge>
                  {exoplanet.isAiGenerated && (
                    <Badge variant="outline" className="border-white/30 text-white bg-white/10 backdrop-blur-sm">
                      <Brain className="h-3 w-3 mr-1" />
                      {locale === 'en' ? 'AI Generated' : 'Généré par IA'}
                    </Badge>
                  )}
                  {exoplanet.score && (
                    <Badge variant="outline" className="border-white/30 text-white bg-white/10 backdrop-blur-sm">
                      {locale === 'en' ? 'Confidence' : 'Confiance'}: {(exoplanet.score * 100).toFixed(1)}%
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Contenu principal - Grille large */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Paramètres Orbitaux */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-6 w-6 text-blue-600" />
                <span>{locale === 'en' ? 'Orbital Parameters' : 'Paramètres Orbitaux'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{locale === 'en' ? 'Orbital Period' : 'Période Orbitale'}</span>
                </div>
                <div className="text-2xl font-bold">
                  {exoplanet.period ? `${exoplanet.period.toFixed(2)} ${locale === 'en' ? 'days' : 'jours'}` : 'N/A'}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{locale === 'en' ? 'Transit Duration' : 'Durée de Transit'}</span>
                </div>
                <div className="text-2xl font-bold">
                  {exoplanet.transitDuration ? `${exoplanet.transitDuration.toFixed(2)} h` : 'N/A'}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4" />
                  <span>{locale === 'en' ? 'Transit Depth' : 'Profondeur de Transit'}</span>
                </div>
                <div className="text-2xl font-bold">
                  {exoplanet.transitDepth ? `${exoplanet.transitDepth} ppm` : 'N/A'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Paramètres Physiques */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Ruler className="h-6 w-6 text-green-600" />
                <span>{locale === 'en' ? 'Physical Parameters' : 'Paramètres Physiques'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <span>{locale === 'en' ? 'Planet Radius' : 'Rayon Planétaire'}</span>
                </div>
                <div className="text-2xl font-bold">
                  {exoplanet.planetRadius ? `${exoplanet.planetRadius.toFixed(2)} R⊕` : 'N/A'}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Thermometer className="h-4 w-4" />
                  <span>{locale === 'en' ? 'Equilibrium Temperature' : 'Température d\'Équilibre'}</span>
                </div>
                <div className="text-2xl font-bold">
                  {exoplanet.equilibriumTemperature ? `${exoplanet.equilibriumTemperature} K` : 'N/A'}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Star className="h-4 w-4" />
                  <span>{locale === 'en' ? 'Insolation Flux' : 'Flux d\'Insolation'}</span>
                </div>
                <div className="text-2xl font-bold">
                  {exoplanet.insolationFlux ? exoplanet.insolationFlux.toFixed(2) : 'N/A'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Paramètres Stellaires */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Telescope className="h-6 w-6 text-orange-600" />
                <span>{locale === 'en' ? 'Stellar Parameters' : 'Paramètres Stellaires'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Star className="h-4 w-4" />
                  <span>{locale === 'en' ? 'Star Name' : 'Nom de l\'Étoile'}</span>
                </div>
                <div className="text-2xl font-bold">
                  {getStarName(exoplanet.keplerName) || exoplanet.stellarName || 'N/A'}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Ruler className="h-4 w-4" />
                  <span>{locale === 'en' ? 'Stellar Radius' : 'Rayon Stellaire'}</span>
                </div>
                <div className="text-2xl font-bold">
                  {exoplanet.stellarRadius ? `${exoplanet.stellarRadius.toFixed(2)} R☉` : 'N/A'}
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <span>{locale === 'en' ? 'Stellar Mass' : 'Masse Stellaire'}</span>
                </div>
                <div className="text-2xl font-bold">
                  {exoplanet.stellarMass ? `${exoplanet.stellarMass.toFixed(2)} M☉` : 'N/A'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section combinée : Graphique + Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Graphique de comparaison avec la Terre */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-6 w-6" />
                <span>{locale === 'en' ? 'Comparison with Earth' : 'Comparaison avec la Terre'}</span>
              </CardTitle>
              <CardDescription>
                {locale === 'en' 
                  ? 'Transit parameters compared to Earth: orbital period, transit duration and depth'
                  : 'Paramètres de transit comparés à la Terre : période orbitale, durée et profondeur de transit'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Comparaison sous forme de cartes élégantes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getComparisonData().map((item, index) => {
                  const exoValue = Number(item[exoplanet?.keplerName || exoplanet?.name || 'Exoplanet']) || 0
                  const earthValue = Number(item[locale === 'en' ? 'Earth' : 'Terre']) || 0
                  const ratio = earthValue > 0 ? (exoValue / earthValue) : 0
                  
                  return (
                    <div key={index} className="relative p-4 rounded-lg border bg-gradient-to-br from-background to-muted/20">
                      {/* Titre du paramètre */}
                      <div className="mb-3">
                        <h4 className="font-semibold text-sm text-muted-foreground">{item.parameter}</h4>
                      </div>
                      
                      {/* Valeurs comparatives */}
                      <div className="space-y-3">
                        {/* Terre */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span className="text-sm">{locale === 'en' ? 'Earth' : 'Terre'}</span>
                          </div>
                          <span className="font-mono text-sm">
                            {earthValue.toFixed(1)} {item.unit}
                          </span>
                        </div>
                        
                        {/* Exoplanète */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                            <span className="text-sm truncate max-w-20">
                              {(exoplanet?.keplerName || exoplanet?.name || 'Exo').split(' ')[0]}
                            </span>
                          </div>
                          <span className="font-mono text-sm">
                            {exoValue.toFixed(1)} {item.unit}
                          </span>
                        </div>
                        
                        {/* Barre de progression comparative */}
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>{locale === 'en' ? 'Ratio' : 'Rapport'}</span>
                            <span>{ratio > 0 ? `${ratio.toFixed(1)}x` : 'N/A'}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                ratio > 1 ? 'bg-emerald-500' : 'bg-blue-500'
                              }`}
                              style={{ 
                                width: ratio > 0 ? `${Math.min((ratio > 1 ? 100/ratio : ratio * 100), 100)}%` : '0%' 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Indicateur de comparaison */}
                      <div className="absolute top-2 right-2">
                        {ratio > 1.5 ? (
                          <span className="text-emerald-600 text-xs font-bold">+</span>
                        ) : ratio < 0.67 ? (
                          <span className="text-blue-600 text-xs font-bold">-</span>
                        ) : (
                          <span className="text-yellow-600 text-xs font-bold">≈</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {/* Légende explicative */}
              <div className="mt-6 p-4 bg-muted/30 rounded-lg border-l-4 border-l-emerald-500">
                <div className="flex items-start space-x-3">
                  <Target className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm mb-1">
                      {locale === 'en' ? 'Transit Comparison' : 'Comparaison des Transits'}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {locale === 'en' 
                        ? 'Comparing orbital period, transit duration, and depth. Indicators: + (higher), - (lower), ≈ (similar)'
                        : 'Comparaison de la période orbitale, durée et profondeur de transit. Indicateurs : + (plus élevé), - (plus bas), ≈ (similaire)'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section des boutons d'action */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-6 w-6" />
                <span>{locale === 'en' ? 'Available Actions' : 'Actions Disponibles'}</span>
              </CardTitle>
              <CardDescription>
                {locale === 'en' 
                  ? 'Explore this exoplanet through different visualization tools'
                  : 'Explorez cette exoplanète à travers différents outils de visualisation'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Bouton NASA 3D */}
              {exoplanet.disposition === 'CONFIRMED' && exoplanet.visualizationUrl && (
                <div className="space-y-2">
                  <Button 
                    onClick={() => window.open(exoplanet.visualizationUrl, '_blank')}
                    className="w-full justify-start h-16"
                    size="lg"
                  >
                    <ExternalLink className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">
                        {locale === 'en' ? 'NASA 3D Visualization' : 'Visualisation 3D NASA'}
                      </div>
                      <div className="text-sm opacity-80">
                        {locale === 'en' ? 'Official NASA interactive view' : 'Vue interactive officielle NASA'}
                      </div>
                    </div>
                  </Button>
                </div>
              )}
              
              {/* Bouton Notre Visualiseur */}
              <div className="space-y-2">
                <Button 
                  variant="outline"
                  onClick={() => window.open('/visualization-3d', '_blank')}
                  className="w-full justify-start h-16"
                  size="lg"
                >
                  <Eye className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">
                      {locale === 'en' ? 'Educational Visualizer' : 'Visualiseur Éducatif'}
                    </div>
                    <div className="text-sm opacity-70">
                      {locale === 'en' ? 'Our interactive 3D model' : 'Notre modèle 3D interactif'}
                    </div>
                  </div>
                </Button>
              </div>
              
              {/* Bouton Export PDF */}
              <div className="space-y-2">
                <Button 
                  variant="outline"
                  onClick={openPdfPreview}
                  className="w-full justify-start h-16"
                  size="lg"
                >
                  <FileText className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">
                      {locale === 'en' ? 'Export Report' : 'Exporter Rapport'}
                    </div>
                    <div className="text-sm opacity-70">
                      {locale === 'en' ? 'Generate PDF analysis report' : 'Générer rapport d\'analyse PDF'}
                    </div>
                  </div>
                </Button>
              </div>

              {/* Note informative */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {locale === 'en' 
                    ? '💡 Use these tools to explore and analyze the exoplanet in detail'
                    : '💡 Utilisez ces outils pour explorer et analyser l\'exoplanète en détail'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
{/* 
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-6 w-6" />
              <span>{locale === 'en' ? 'Discovery Information' : 'Informations de Découverte'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center space-y-3">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {locale === 'en' ? 'Discovery Date' : 'Date de Découverte'}
                  </div>
                  <div className="text-xl font-bold">
                    {exoplanet.discoveryDate || 'N/A'}
                  </div>
                </div>
              </div>
              
              <div className="text-center space-y-3">
                <Telescope className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {locale === 'en' ? 'Discovery Method' : 'Méthode de Découverte'}
                  </div>
                  <div className="text-xl font-bold">
                    {exoplanet.discoveryMethod || 'N/A'}
                  </div>
                </div>
              </div>
              
              <div className="text-center space-y-3">
                <Database className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {locale === 'en' ? 'Mission' : 'Mission'}
                  </div>
                  <div className="text-xl font-bold">
                    {exoplanet.mission}
                  </div>
                </div>
              </div>
              
              <div className="text-center space-y-3">
                <Star className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {locale === 'en' ? 'Kepler ID' : 'ID Kepler'}
                  </div>
                  <div className="text-xl font-bold">
                    {exoplanet.kepid || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Modal de prévisualisation PDF */}
        <Dialog open={showPdfPreview} onOpenChange={setShowPdfPreview}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>{locale === 'en' ? 'PDF Report Preview' : 'Aperçu du Rapport PDF'}</span>
              </DialogTitle>
              <DialogDescription>
                {locale === 'en' 
                  ? 'Preview the analysis report before downloading the PDF'
                  : 'Prévisualisez le rapport d\'analyse avant de télécharger le PDF'
                }
              </DialogDescription>
            </DialogHeader>
            
            {/* Contenu du PDF */}
            <div id="pdf-content" className="bg-white p-8 rounded-lg border">
              {/* Header */}
              <div className="header">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {locale === 'en' ? 'Exoplanet Analysis Report' : 'Rapport d\'Analyse d\'Exoplanète'}
                </h1>
                <h2 className="text-2xl text-blue-600 font-semibold">
                  {exoplanet?.keplerName || exoplanet?.name}
                </h2>
                <p className="text-gray-600 mt-2">
                  {locale === 'en' ? 'Generated by ExoPlanet AI' : 'Généré par ExoPlanet AI'} - {new Date().toLocaleDateString(locale === 'en' ? 'en-US' : 'fr-FR')}
                </p>
              </div>

              {/* Classification */}
              <div className="section">
                <h3 className="section-title">
                  {locale === 'en' ? 'Classification' : 'Classification'}
                </h3>
                <div className="parameter">
                  <span className="parameter-name">{locale === 'en' ? 'Status' : 'Statut'}</span>
                  <span className={`badge ${exoplanet?.disposition === 'CONFIRMED' ? 'badge-confirmed' : 'badge-candidate'}`}>
                    {exoplanet?.disposition}
                  </span>
                </div>
                {exoplanet?.score && (
                  <div className="parameter">
                    <span className="parameter-name">{locale === 'en' ? 'Confidence Score' : 'Score de Confiance'}</span>
                    <span className="parameter-value">{(exoplanet.score * 100).toFixed(1)}%</span>
                  </div>
                )}
                {exoplanet?.isAiGenerated && (
                  <div className="parameter">
                    <span className="parameter-name">{locale === 'en' ? 'Data Source' : 'Source des Données'}</span>
                    <span className="parameter-value">{locale === 'en' ? 'AI Generated' : 'Généré par IA'}</span>
                  </div>
                )}
              </div>

              {/* Paramètres Orbitaux */}
              <div className="section">
                <h3 className="section-title">
                  {locale === 'en' ? 'Orbital Parameters' : 'Paramètres Orbitaux'}
                </h3>
                <div className="parameter">
                  <span className="parameter-name">{locale === 'en' ? 'Orbital Period' : 'Période Orbitale'}</span>
                  <span className="parameter-value">
                    {exoplanet?.period ? `${exoplanet.period.toFixed(2)} ${locale === 'en' ? 'days' : 'jours'}` : 'N/A'}
                  </span>
                </div>
                <div className="parameter">
                  <span className="parameter-name">{locale === 'en' ? 'Transit Duration' : 'Durée de Transit'}</span>
                  <span className="parameter-value">
                    {exoplanet?.transitDuration ? `${exoplanet.transitDuration.toFixed(2)} h` : 'N/A'}
                  </span>
                </div>
                <div className="parameter">
                  <span className="parameter-name">{locale === 'en' ? 'Transit Depth' : 'Profondeur de Transit'}</span>
                  <span className="parameter-value">
                    {exoplanet?.transitDepth ? `${exoplanet.transitDepth} ppm` : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Paramètres Physiques */}
              <div className="section">
                <h3 className="section-title">
                  {locale === 'en' ? 'Physical Parameters' : 'Paramètres Physiques'}
                </h3>
                <div className="parameter">
                  <span className="parameter-name">{locale === 'en' ? 'Planet Radius' : 'Rayon Planétaire'}</span>
                  <span className="parameter-value">
                    {exoplanet?.planetRadius ? `${exoplanet.planetRadius.toFixed(2)} R⊕` : 'N/A'}
                  </span>
                </div>
                <div className="parameter">
                  <span className="parameter-name">{locale === 'en' ? 'Equilibrium Temperature' : 'Température d\'Équilibre'}</span>
                  <span className="parameter-value">
                    {exoplanet?.equilibriumTemperature ? `${exoplanet.equilibriumTemperature} K` : 'N/A'}
                  </span>
                </div>
                <div className="parameter">
                  <span className="parameter-name">{locale === 'en' ? 'Insolation Flux' : 'Flux d\'Insolation'}</span>
                  <span className="parameter-value">
                    {exoplanet?.insolationFlux ? exoplanet.insolationFlux.toFixed(2) : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Paramètres Stellaires */}
              <div className="section">
                <h3 className="section-title">
                  {locale === 'en' ? 'Stellar Parameters' : 'Paramètres Stellaires'}
                </h3>
                <div className="parameter">
                  <span className="parameter-name">{locale === 'en' ? 'Star Name' : 'Nom de l\'Étoile'}</span>
                  <span className="parameter-value">{exoplanet?.stellarName || 'N/A'}</span>
                </div>
                <div className="parameter">
                  <span className="parameter-name">{locale === 'en' ? 'Stellar Radius' : 'Rayon Stellaire'}</span>
                  <span className="parameter-value">
                    {exoplanet?.stellarRadius ? `${exoplanet.stellarRadius.toFixed(2)} R☉` : 'N/A'}
                  </span>
                </div>
                <div className="parameter">
                  <span className="parameter-name">{locale === 'en' ? 'Stellar Mass' : 'Masse Stellaire'}</span>
                  <span className="parameter-value">
                    {exoplanet?.stellarMass ? `${exoplanet.stellarMass.toFixed(2)} M☉` : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Informations de Découverte */}
              <div className="section">
                <h3 className="section-title">
                  {locale === 'en' ? 'Discovery Information' : 'Informations de Découverte'}
                </h3>
                <div className="parameter">
                  <span className="parameter-name">{locale === 'en' ? 'Discovery Date' : 'Date de Découverte'}</span>
                  <span className="parameter-value">{exoplanet?.discoveryDate || 'N/A'}</span>
                </div>
                <div className="parameter">
                  <span className="parameter-name">{locale === 'en' ? 'Discovery Method' : 'Méthode de Découverte'}</span>
                  <span className="parameter-value">{exoplanet?.discoveryMethod || 'N/A'}</span>
                </div>
                <div className="parameter">
                  <span className="parameter-name">{locale === 'en' ? 'Mission' : 'Mission'}</span>
                  <span className="parameter-value">{exoplanet?.mission}</span>
                </div>
                <div className="parameter">
                  <span className="parameter-name">{locale === 'en' ? 'Kepler ID' : 'ID Kepler'}</span>
                  <span className="parameter-value">{exoplanet?.kepid || 'N/A'}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="footer">
                <p>
                  {locale === 'en' 
                    ? 'This report was generated by ExoPlanet AI - Advanced Exoplanet Classification System'
                    : 'Ce rapport a été généré par ExoPlanet AI - Système Avancé de Classification d\'Exoplanètes'
                  }
                </p>
                <p className="mt-2">
                  {locale === 'en' ? 'For more information, visit' : 'Pour plus d\'informations, visitez'} exoplanet-ai.com
                </p>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button variant="outline" onClick={() => setShowPdfPreview(false)}>
                {locale === 'en' ? 'Cancel' : 'Annuler'}
              </Button>
              <Button onClick={downloadPdf} className="flex items-center space-x-2">
                <Printer className="h-4 w-4" />
                <span>{locale === 'en' ? 'Download PDF' : 'Télécharger PDF'}</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
