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

// Mock data - in production, this would come from an API
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
    explanation: 'This exoplanet candidate was identified through our advanced machine learning model with high confidence based on its orbital period (112.3 days), planet radius (1.34 R⊕), and stellar parameters. The model detected a consistent transit signal with a depth of 470 ppm, indicating a potentially habitable super-Earth in the conservative habitable zone of its host star.',
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
        // First, try to find in mock data
        let found = mockExoplanets.find(e => e.id === id)
        
        if (!found) {
          // If not found in mocks, try to retrieve from MongoDB API
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
                console.log('✅ Data retrieved from MongoDB:', mongoData.kepoi_name || mongoData.kepler_name)
                
                // Map MongoDB data to Exoplanet format
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
                  explanation: mongoData.explanation || mongoData.ai_explanation || undefined,
                  createdAt: mongoData.createdAt || new Date().toISOString(),
                  updatedAt: mongoData.updatedAt || new Date().toISOString(),
                  isAiGenerated: mongoData.isAiGenerated || mongoData.ai_generated || mongoData.IS_AI || false
                }
              }
            } else {
              console.log('❌ Exoplanet not found in MongoDB:', response.status)
            }
          } catch (error) {
            console.warn('⚠️ Unable to retrieve MongoDB data:', error)
          }
        }
        
        if (!found) {
          // Use default data with a cleaner name
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
        console.error('Error loading data:', error)
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

  // Extract star name from keplerName
  const getStarName = (keplerName: string | undefined): string => {
    if (!keplerName) return 'N/A'
    
    // Extract the part before the planet letter
    // Ex: "Kepler-44 b" → "Kepler-44"
    // Ex: "Kepler-442b" → "Kepler-442" 
    const match = keplerName.match(/^(.+?)\s*[a-z]$/i)
    return match ? match[1].trim() : keplerName
  }

  // Prepare Earth comparison data
  const getComparisonData = () => {
    if (!exoplanet) return []
    
    return [
      {
        parameter: locale === 'en' ? 'Orbital Period' : 'Période Orbitale',
        [locale === 'en' ? 'Earth' : 'Terre']: 365.25, // Earth year in days
        [exoplanet.keplerName || exoplanet.name]: exoplanet.period || 0,
        unit: locale === 'en' ? 'days' : 'jours'
      },
      {
        parameter: locale === 'en' ? 'Transit Duration' : 'Durée de Transit',
        [locale === 'en' ? 'Earth' : 'Terre']: 13.0, // Typical Earth transit duration as seen from the Sun (in hours)
        [exoplanet.keplerName || exoplanet.name]: exoplanet.transitDuration || 0,
        unit: locale === 'en' ? 'hours' : 'heures'
      },
      {
        parameter: locale === 'en' ? 'Transit Depth' : 'Profondeur de Transit',
        [locale === 'en' ? 'Earth' : 'Terre']: 84, // Earth transit depth in ppm (parts per million)
        [exoplanet.keplerName || exoplanet.name]: exoplanet.transitDepth || 0,
        unit: 'ppm'
      }
    ]
  }

  // Download PDF directly without preview
  const openPdfPreview = () => {
    downloadPdf()
  }

  // Generate and download styled PDF report
  const downloadPdf = async () => {
    if (!exoplanet) return

    try {
      // Import jsPDF dynamically
      const jsPDFModule = await import('jspdf')
      const jsPDF = jsPDFModule.default
      
      const isAiGenerated = exoplanet.isAiGenerated
      const date = new Date().toLocaleDateString(locale === 'en' ? 'en-US' : 'fr-FR')
      const time = new Date().toLocaleTimeString(locale === 'en' ? 'en-US' : 'fr-FR')
      
      // Create new PDF document with proper encoding
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })
      const pageWidth = doc.internal.pageSize.width
      const pageHeight = doc.internal.pageSize.height
      const margin = 20
      let yPosition = margin

      // Theme colors (adapted for PDF)
      const colors = {
        primary: '#2563eb',
        secondary: '#64748b',
        accent: '#7c3aed',
        success: '#059669',
        warning: '#d97706',
        danger: '#dc2626',
        dark: '#1e293b',
        light: '#f8fafc'
      }

      // Function to add new page if necessary
      const checkPageBreak = (requiredSpace = 20) => {
        if (yPosition + requiredSpace > pageHeight - margin) {
          doc.addPage()
          yPosition = margin
        }
      }

      // Header with logo and title
      doc.setFillColor(37, 99, 235) // Primary color
      doc.rect(0, 0, pageWidth, 60, 'F')
      
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(24)
      doc.setFont('helvetica', 'bold')
      doc.text('EXOPLANET AI', margin, 25)
      
      doc.setFontSize(16)
      doc.setFont('helvetica', 'normal')
      doc.text(locale === 'en' ? 'DETAILED ANALYSIS REPORT' : 'RAPPORT D ANALYSE DETAILLE', margin, 40)
      
      doc.setFontSize(12)
      doc.text(date + ' ' + time, pageWidth - margin - 40, 50)

      yPosition = 80

      // Main exoplanet title
      doc.setTextColor(37, 99, 235)
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.text(exoplanet.keplerName || exoplanet.name, margin, yPosition)
      yPosition += 15

      // Status badge
      if (exoplanet.disposition === 'CONFIRMED') {
        doc.setFillColor(5, 150, 105) // Green for CONFIRMED
      } else if (exoplanet.disposition === 'CANDIDATE') {
        doc.setFillColor(217, 119, 6) // Orange for CANDIDATE
      } else {
        doc.setFillColor(220, 38, 38) // Red for FALSE POSITIVE
      }
      doc.roundedRect(margin, yPosition, 40, 8, 2, 2, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text(exoplanet.disposition, margin + 3, yPosition + 5)
      
      // Confidence score
      if (exoplanet.score) {
        doc.setFillColor(124, 58, 237) // Accent color
        doc.roundedRect(margin + 45, yPosition, 35, 8, 2, 2, 'F')
        doc.text(`${(exoplanet.score * 100).toFixed(1)}%`, margin + 48, yPosition + 5)
      }

      yPosition += 20

      // Special AI section (if applicable)
      if (isAiGenerated) {
        const explanationText = exoplanet.explanation || (locale === 'en' ? 
          'This exoplanet was identified using our advanced AI classification system.' :
          'Cette exoplanète a été identifiée par notre système IA de classification avancé.')
        
        // Calculate required space based on text length
        const lines = Math.ceil(explanationText.length / 85) // Approximate chars per line
        const requiredSpace = 50 + (lines * 8) // Base space + line height
        
        checkPageBreak(requiredSpace)
        
        // AI section background
        doc.setFillColor(124, 58, 237, 0.1)
        doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, requiredSpace - 10, 'F')
        
        // AI section title
        doc.setTextColor(124, 58, 237)
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text('[AI] ' + (locale === 'en' ? 'AI ANALYSIS & EXPLANATION' : 'ANALYSE ET EXPLICATION IA'), margin + 5, yPosition + 5)
        
        // AI explanation text with proper wrapping
        doc.setTextColor(30, 41, 59)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        
        const textWidth = pageWidth - 2 * margin - 10
        const splitText = doc.splitTextToSize(explanationText, textWidth)
        doc.text(splitText, margin + 5, yPosition + 20)
        
        yPosition += requiredSpace
      }

      // Function to create a section with title
      const addSection = (title: string, icon: string) => {
        checkPageBreak(25)
        
        doc.setFillColor(241, 245, 249)
        doc.rect(margin, yPosition - 3, pageWidth - 2 * margin, 12, 'F')
        
        doc.setTextColor(37, 99, 235)
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text(`[${icon}] ${title}`, margin + 3, yPosition + 5)
        yPosition += 15
      }

      // Function to add a parameter
      const addParameter = (label: string, value: string, unit?: string) => {
        checkPageBreak(12)
        
        doc.setTextColor(71, 85, 105)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.text(label + ':', margin + 5, yPosition)
        
        doc.setTextColor(15, 23, 42)
        doc.setFont('helvetica', 'bold')
        const displayValue = unit ? `${value} ${unit}` : value
        doc.text(displayValue, margin + 90, yPosition)
        yPosition += 8
      }

      // General Information Section
      addSection(locale === 'en' ? 'General Information' : 'Informations Generales', 'INFO')
      addParameter(locale === 'en' ? 'Exoplanet Name' : 'Nom de l exoplanete', exoplanet.keplerName || exoplanet.name)
      addParameter(locale === 'en' ? 'Kepler ID' : 'ID Kepler', exoplanet.kepid?.toString() || 'N/A')
      addParameter(locale === 'en' ? 'Data Source' : 'Source des donnees', 
        isAiGenerated ? (locale === 'en' ? 'AI Generated' : 'Genere par IA') : 
        (locale === 'en' ? 'NASA Kepler Mission' : 'Mission NASA Kepler'))
      
      yPosition += 10

      // Orbital Parameters Section
      addSection(locale === 'en' ? 'Orbital Parameters' : 'Parametres Orbitaux', 'ORBIT')
      addParameter(locale === 'en' ? 'Orbital Period' : 'Periode orbitale', 
        exoplanet.period ? exoplanet.period.toFixed(2) : 'N/A', 
        locale === 'en' ? 'days' : 'jours')
      addParameter(locale === 'en' ? 'Transit Duration' : 'Duree de transit', 
        exoplanet.transitDuration ? exoplanet.transitDuration.toFixed(2) : 'N/A', 
        locale === 'en' ? 'hours' : 'heures')
      addParameter(locale === 'en' ? 'Transit Depth' : 'Profondeur de transit', 
        exoplanet.transitDepth ? exoplanet.transitDepth.toString() : 'N/A', 'ppm')
      addParameter(locale === 'en' ? 'Equilibrium Temperature' : 'Temperature d equilibre', 
        exoplanet.equilibriumTemperature ? exoplanet.equilibriumTemperature.toString() : 'N/A', 'K')
      
      yPosition += 10

      // Planetary Parameters Section
      addSection(locale === 'en' ? 'Planetary Parameters' : 'Parametres Planetaires', 'PLANET')
      addParameter(locale === 'en' ? 'Planet Radius' : 'Rayon planetaire', 
        exoplanet.planetRadius ? exoplanet.planetRadius.toFixed(2) : 'N/A', 'R_Earth')
      
      // Planetary type classification
      const planetType = exoplanet.planetRadius ? (
        exoplanet.planetRadius < 1.25 ? (locale === 'en' ? 'Super-Earth' : 'Super-Terre') :
        exoplanet.planetRadius < 2.0 ? (locale === 'en' ? 'Sub-Neptune' : 'Sous-Neptune') :
        exoplanet.planetRadius < 6.0 ? (locale === 'en' ? 'Neptune-sized' : 'Taille Neptune') :
        (locale === 'en' ? 'Jupiter-sized' : 'Taille Jupiter')
      ) : 'N/A'
      addParameter(locale === 'en' ? 'Planet Type' : 'Type de planete', planetType)
      
      yPosition += 10

      // Stellar Parameters Section
      addSection(locale === 'en' ? 'Stellar Parameters' : 'Parametres Stellaires', 'STAR')
      addParameter(locale === 'en' ? 'Host Star' : 'Etoile hote', exoplanet.stellarName || 'N/A')
      addParameter(locale === 'en' ? 'Stellar Radius' : 'Rayon stellaire', 
        exoplanet.stellarRadius ? exoplanet.stellarRadius.toFixed(2) : 'N/A', 'R_Sun')
      addParameter(locale === 'en' ? 'Stellar Mass' : 'Masse stellaire', 
        exoplanet.stellarMass ? exoplanet.stellarMass.toFixed(2) : 'N/A', 'M_Sun')
      addParameter(locale === 'en' ? 'Stellar Temperature' : 'Temperature stellaire', 
        exoplanet.stellarTemperature ? exoplanet.stellarTemperature.toString() : 'N/A', 'K')
      
      yPosition += 10

      // Habitability Analysis Section
      addSection(locale === 'en' ? 'Habitability Analysis' : 'Analyse d Habitabilite', 'HABIT')
      
      // Habitable zone evaluation
      let habitabilityStatus = 'N/A'
      if (exoplanet.insolationFlux) {
        if (exoplanet.insolationFlux >= 0.36 && exoplanet.insolationFlux <= 1.11) {
          habitabilityStatus = locale === 'en' ? '[OK] Potentially Habitable' : '[OK] Potentiellement Habitable'
        } else if (exoplanet.insolationFlux >= 0.28 && exoplanet.insolationFlux <= 1.65) {
          habitabilityStatus = locale === 'en' ? '[?] Optimistically Habitable' : '[?] Habitable (optimiste)'
        } else {
          habitabilityStatus = locale === 'en' ? '[X] Not in Habitable Zone' : '[X] Pas en zone habitable'
        }
      }
      addParameter(locale === 'en' ? 'Habitable Zone' : 'Zone habitable', habitabilityStatus)
      
      // Surface classification
      let surfaceType = 'N/A'
      if (exoplanet.planetRadius) {
        if (exoplanet.planetRadius <= 1.6) {
          surfaceType = locale === 'en' ? '[OK] Likely Rocky Surface' : '[OK] Surface probablement rocheuse'
        } else if (exoplanet.planetRadius <= 4.0) {
          surfaceType = locale === 'en' ? '[?] Sub-Neptune (uncertain)' : '[?] Sous-Neptune (incertain)'
        } else {
          surfaceType = locale === 'en' ? '[X] Gas Giant' : '[X] Geante gazeuse'
        }
      }
      addParameter(locale === 'en' ? 'Surface Type' : 'Type de surface', surfaceType)

      // New page for comparisons and footer
      checkPageBreak(60)
      yPosition += 10

      // Earth Comparison Section
      addSection(locale === 'en' ? 'Comparison with Earth' : 'Comparaison avec la Terre', 'COMP')
      addParameter(locale === 'en' ? 'Size Ratio' : 'Rapport de taille', 
        exoplanet.planetRadius ? `${exoplanet.planetRadius.toFixed(2)}x` : 'N/A', 
        locale === 'en' ? '(Earth = 1.00x)' : '(Terre = 1.00x)')
      addParameter(locale === 'en' ? 'Period Ratio' : 'Rapport de période', 
        exoplanet.period ? `${(exoplanet.period / 365.25).toFixed(2)}x` : 'N/A', 
        locale === 'en' ? '(Earth = 1.00x)' : '(Terre = 1.00x)')

      // Footer
      checkPageBreak(40)
      yPosition = pageHeight - 40

      doc.setFillColor(37, 99, 235)
      doc.rect(0, yPosition - 10, pageWidth, 50, 'F')
      
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text(locale === 'en' ? 'ExoPlanet AI - Advanced Analysis System' : 'ExoPlanet AI - Systeme d Analyse Avance', 
        margin, yPosition + 5)
      
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text('Web: https://nyx-a-ifront-q25a.vercel.app', margin, yPosition + 15)
      doc.text('Email: sannicharbel@gmail.com', margin, yPosition + 25)
      
      doc.text(locale === 'en' ? 'Generated on: ' + date : 'Genere le: ' + date, 
        pageWidth - margin - 40, yPosition + 15)

      // Save the PDF
      const fileName = `ExoPlanet_AI_Report_${(exoplanet.keplerName || exoplanet.name).replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
      doc.save(fileName)
      
      // Close modal after download
      setShowPdfPreview(false)
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      // Fallback in case of error
      alert(locale === 'en' ? 'Error generating PDF. Please try again.' : 'Erreur lors de la génération du PDF. Veuillez réessayer.')
    }
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

        <div 
          className="relative h-96 bg-cover bg-center bg-no-repeat rounded-xl overflow-hidden"
          style={{ 
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url('/planet_image.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-end justify-between">
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


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
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
              {/* card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getComparisonData().map((item, index) => {
                  const exoValue = Number(item[exoplanet?.keplerName || exoplanet?.name || 'Exoplanet']) || 0
                  const earthValue = Number(item[locale === 'en' ? 'Earth' : 'Terre']) || 0
                  const ratio = earthValue > 0 ? (exoValue / earthValue) : 0
                  
                  return (
                    <div key={index} className="relative p-4 rounded-lg border bg-gradient-to-br from-background to-muted/20">
                      {/* Parameter Title */}
                      <div className="mb-3">
                        <h4 className="font-semibold text-sm text-muted-foreground">{item.parameter}</h4>
                      </div>

                      {/* comparative values */}
                      <div className="space-y-3">
                        {/* Earth */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span className="text-sm">{locale === 'en' ? 'Earth' : 'Terre'}</span>
                          </div>
                          <span className="font-mono text-sm">
                            {earthValue.toFixed(1)} {item.unit}
                          </span>
                        </div>
                        
                        {/* Exoplanet */}
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
                        
                        {/* progression barre */}
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
                      
                      {/* Comparison indicator */}
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

              {/* Explicative legend */}
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

          {/* Section actions boton */}
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

              {/* Button NASA 3D */}
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

              {/* Button Our Visualizer */}
              <div className="space-y-2">
                <Button 
                  variant="outline"
                  onClick={() => window.open(process.env.NEXT_PUBLIC_EDUCATIONAL_VISUALIZER_BASE_URL || 'https://visualize3-d.vercel.app', '_blank')}
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
              
              {/*  Export PDF */}
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

              {/* Note  */}
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

        {/* PDF */}
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
            
            {/* PDF */}
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

              {/* Orbital Parameters */}
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

              {/* Physical Parameters */}
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

              {/* Stellar Parameters */}
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

              {/* IInformation */}
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

            {/* Action boton */}
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
