"use client"

import { useState, useMemo, useEffect } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { useI18n } from '@/hooks/useI18n'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { useRouter } from 'next/navigation'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Database, 
  Search, 
  Filter, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown,
  Eye,
  ExternalLink,
  Brain,
  MousePointer,
  Satellite,
  HardDrive,
  Loader2,
  AlertTriangle,
  FileText,
  Upload
} from 'lucide-react'
import { Exoplanet, ExoplanetFilters, PaginationParams } from '@/types/exoplanet'
import { NASAADQLService, NASAKOITableData } from '@/services/nasaADQLService'

// Données NASA Kepler (données brutes)
const nasaKeplerData: Exoplanet[] = [
  {
    id: 'nasa-1',
    name: 'KOI-1843.03',
    kepid: 9632895,
    period: 4.245,
    transitDuration: 1.8,
    transitDepth: 284,
    planetRadius: 0.89,
    stellarRadius: 0.87,
    stellarTemperature: 5777,
    stellarMagnitude: 14.32,
    insolationFlux: 2.1,
    equilibriumTemperature: 1200,
    disposition: 'CANDIDATE',
    score: 0.65,
    discoveryMethod: 'Transit',
    discoveryDate: '2013-07-15',
    mission: 'Kepler',
    createdAt: '2013-07-15T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'nasa-2',
    name: 'KOI-2418.01',
    kepid: 8561063,
    period: 87.3,
    transitDuration: 4.2,
    transitDepth: 1250,
    planetRadius: 1.95,
    stellarRadius: 1.12,
    stellarTemperature: 6100,
    stellarMagnitude: 13.85,
    insolationFlux: 0.85,
    equilibriumTemperature: 285,
    disposition: 'CANDIDATE',
    score: 0.72,
    discoveryMethod: 'Transit',
    discoveryDate: '2014-02-20',
    mission: 'Kepler',
    createdAt: '2014-02-20T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
]

// Notre base de données (données traitées + IA) - MAINTENANT REMPLACÉES PAR MONGODB
/* const ourProcessedData: Exoplanet[] = [
  {
    id: 'koi-1',
    name: 'Kepler-442b',
    kepid: 9632895,
    period: 112.3,
    transitDuration: 5.2,
    transitDepth: 470,
    planetRadius: 1.34,
    stellarRadius: 0.61,
    stellarTemperature: 4402,
    stellarMagnitude: 14.76,
    insolationFlux: 0.70,
    equilibriumTemperature: 230,
    disposition: 'CONFIRMED',
    score: 0.95,
    discoveryMethod: 'Transit',
    discoveryDate: '2015-01-06',
    mission: 'Kepler',
    visualizationUrl: 'https://eyes.nasa.gov/apps/exo/#/planet/Kepler-442_b',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'koi-2',
    name: 'Kepler-442b',
    kepid: 0,
    period: 33.0,
    transitDuration: 3.5,
    transitDepth: 890,
    planetRadius: 2.3,
    stellarRadius: 0.41,
    stellarTemperature: 3457,
    stellarMagnitude: 13.52,
    insolationFlux: 1.33,
    equilibriumTemperature: 279,
    disposition: 'CONFIRMED',
    score: 0.92,
    discoveryMethod: 'Transit',
    discoveryDate: '2015-12-14',
    mission: 'Kepler',
    visualizationUrl: 'https://eyes.nasa.gov/apps/exo/#/planet/Kepler-442_b',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'koi-3',
    name: 'TOI-715b',
    kepid: 0,
    period: 19.3,
    transitDuration: 2.8,
    transitDepth: 650,
    planetRadius: 1.55,
    stellarRadius: 0.58,
    stellarTemperature: 3650,
    stellarMagnitude: 12.43,
    insolationFlux: 1.12,
    equilibriumTemperature: 280,
    disposition: 'CANDIDATE',
    score: 0.78,
    discoveryMethod: 'Transit',
    discoveryDate: '2024-01-30',
    mission: 'Kepler',
    createdAt: '2024-01-30T00:00:00Z',
    updatedAt: '2024-01-30T00:00:00Z'
  },
  {
    id: 'koi-4',
    name: 'KOI-4878.01',
    kepid: 10925104,
    period: 449.5,
    transitDuration: 8.1,
    transitDepth: 125,
    planetRadius: 0.89,
    stellarRadius: 1.12,
    stellarTemperature: 5890,
    stellarMagnitude: 15.2,
    insolationFlux: 0.32,
    equilibriumTemperature: 185,
    disposition: 'FALSE POSITIVE',
    score: 0.23,
    discoveryMethod: 'Transit',
    discoveryDate: '2016-05-10',
    mission: 'Kepler',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'koi-5',
    name: 'Kepler-1649c',
    kepid: 3230491,
    period: 19.5,
    transitDuration: 2.6,
    transitDepth: 550,
    planetRadius: 1.06,
    stellarRadius: 0.23,
    stellarTemperature: 3240,
    stellarMagnitude: 16.75,
    insolationFlux: 0.75,
    equilibriumTemperature: 234,
    disposition: 'CONFIRMED',
    score: 0.89,
    discoveryMethod: 'Transit',
    discoveryDate: '2020-04-15',
    mission: 'Kepler',
    visualizationUrl: 'https://eyes.nasa.gov/apps/exo/#/planet/Kepler-1649_c',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  // Données générées par l'IA
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
  },
  {
    id: 'ai-2',
    name: 'KOI-4878.01 (IA)',
    kepid: 10925104,
    period: 449.5,
    transitDuration: 8.1,
    transitDepth: 125,
    planetRadius: 0.89,
    stellarRadius: 1.12,
    stellarTemperature: 5890,
    stellarMagnitude: 15.2,
    insolationFlux: 0.32,
    equilibriumTemperature: 185,
    disposition: 'FALSE POSITIVE',
    score: 0.23,
    discoveryMethod: 'Transit',
    discoveryDate: '2016-05-10',
    mission: 'Kepler',
    isAiGenerated: true,
    createdAt: '2016-05-10T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
] */

export default function DataExplorePage() {
  const { t, locale, isHydrated } = useI18n()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('nasa')

  // États pour les données NASA
  const [nasaData, setNasaData] = useState<NASAKOITableData[]>([])
  const [nasaLoading, setNasaLoading] = useState(false)
  const [nasaError, setNasaError] = useState<string | null>(null)
  const [nasaTotalCount, setNasaTotalCount] = useState(0)

  // États pour les données MongoDB (Our Database)
  const [mongoData, setMongoData] = useState<Exoplanet[]>([])
  const [mongoLoading, setMongoLoading] = useState(false)
  const [mongoError, setMongoError] = useState<string | null>(null)
  const [mongoTotalCount, setMongoTotalCount] = useState(0)
  const [mongoCacheTimestamp, setMongoCacheTimestamp] = useState<number | null>(null)

  // Fonction pour obtenir la couleur du badge selon la disposition
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
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<ExoplanetFilters>({})
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 25, // 25 entrées par page pour un meilleur affichage
    sortBy: 'name',
    sortOrder: 'asc'
  })
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [visualizationDialog, setVisualizationDialog] = useState(false)
  const [selectedExoplanet, setSelectedExoplanet] = useState<Exoplanet | null>(null)
  
  // États pour l'export avancé
  const [exportDialog, setExportDialog] = useState(false)
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('csv')
  const [exportFilters, setExportFilters] = useState({
    all: true,
    confirmed: false,
    candidates: false,
    falsePositives: false
  })
  const [exportProgress, setExportProgress] = useState({ show: false, value: 0, status: '' })

  // Fonction pour naviguer vers la page de profil de l'exoplanète
  const openExoplanetProfile = (exoplanet: Exoplanet) => {
    router.push(`/exoplanet/${exoplanet.id}`)
  }

  // Fonctions de gestion du cache MongoDB
  const MONGO_CACHE_KEY = 'exoplanet_mongo_cache'
  const MONGO_CACHE_DURATION = 30 * 60 * 1000 // 30 minutes en millisecondes

  const saveCacheToStorage = (data: Exoplanet[], totalCount: number) => {
    try {
      const cacheData = {
        data,
        totalCount,
        timestamp: Date.now()
      }
      localStorage.setItem(MONGO_CACHE_KEY, JSON.stringify(cacheData))
      setMongoCacheTimestamp(Date.now())
      console.log('💾 Cache MongoDB sauvegardé avec', data.length, 'entrées')
    } catch (error) {
      console.warn('⚠️ Impossible de sauvegarder le cache:', error)
    }
  }

  const loadCacheFromStorage = () => {
    try {
      const cached = localStorage.getItem(MONGO_CACHE_KEY)
      if (cached) {
        const cacheData = JSON.parse(cached)
        const isValid = (Date.now() - cacheData.timestamp) < MONGO_CACHE_DURATION
        
        if (cacheData.data && Array.isArray(cacheData.data)) {
          setMongoData(cacheData.data)
          setMongoTotalCount(cacheData.totalCount || cacheData.data.length)
          setMongoCacheTimestamp(cacheData.timestamp)
          
          console.log(`📂 Cache MongoDB chargé: ${cacheData.data.length} entrées ${isValid ? '(valide)' : '(expiré)'}`)
          return isValid
        }
      }
    } catch (error) {
      console.warn('⚠️ Erreur lors du chargement du cache:', error)
    }
    return false
  }

  const isCacheValid = () => {
    return mongoCacheTimestamp && (Date.now() - mongoCacheTimestamp) < MONGO_CACHE_DURATION
  }

  // Fonctions de visualisation
  const openEyesOfNasa = (exoplanet: Exoplanet) => {
    if (exoplanet.keplerName) {
      const keplerUrl = exoplanet.keplerName.replace(/\s+/g, '_')
      window.open(`https://eyes.nasa.gov/apps/exo/#/planet/${encodeURIComponent(keplerUrl)}`, '_blank')
    }
    setVisualizationDialog(false)
  }

  const openEducationalVisualizer = (exoplanet: Exoplanet) => {
    // Utiliser l'URL de base depuis les variables d'environnement
    const baseUrl = process.env.NEXT_PUBLIC_EDUCATIONAL_VISUALIZER_BASE_URL || 'https://www.exemple.com'
    const planetName = exoplanet.keplerName || exoplanet.name
    
    // Construire l'URL finale: baseUrl/Kepler-442_b
    const finalUrl = `${baseUrl}/${encodeURIComponent(planetName)}`
    window.open(finalUrl, '_blank')
    setVisualizationDialog(false)
  }

  const handleVisualizationClick = (exoplanet: Exoplanet) => {
    setSelectedExoplanet(exoplanet)
    setVisualizationDialog(true)
  }

  // Fonction pour ouvrir le dialog d'export
  const handleExportClick = (format: 'json' | 'csv') => {
    setExportFormat(format)
    setExportDialog(true)
  }

  // Liste complète des colonnes à exporter
  const ALL_EXPORT_COLUMNS = [
    "dec", "dec_err", "dec_str", "kepid", "kepler_name", "kepoi_name", "koi_bin_oedp_sig",
    "koi_comment", "koi_count", "koi_datalink_dvr", "koi_datalink_dvs", "koi_delivname",
    "koi_depth", "koi_depth_err1", "koi_depth_err2", "koi_dicco_mdec", "koi_dicco_mdec_err",
    "koi_dicco_mra", "koi_dicco_mra_err", "koi_dicco_msky", "koi_dicco_msky_err",
    "koi_dikco_mdec", "koi_dikco_mdec_err", "koi_dikco_mra", "koi_dikco_mra_err",
    "koi_dikco_msky", "koi_dikco_msky_err", "koi_disp_prov", "koi_disposition",
    "koi_dor", "koi_dor_err1", "koi_dor_err2", "koi_duration", "koi_duration_err1",
    "koi_duration_err2", "koi_eccen", "koi_eccen_err1", "koi_eccen_err2", "koi_fittype",
    "koi_fpflag_co", "koi_fpflag_ec", "koi_fpflag_nt", "koi_fpflag_ss", "koi_fwm_pdeco",
    "koi_fwm_pdeco_err", "koi_fwm_prao", "koi_fwm_prao_err", "koi_fwm_sdec", "koi_fwm_sdec_err",
    "koi_fwm_sdeco", "koi_fwm_sdeco_err", "koi_fwm_sra", "koi_fwm_sra_err", "koi_fwm_srao",
    "koi_fwm_srao_err", "koi_fwm_stat_sig", "koi_gmag", "koi_gmag_err", "koi_hmag",
    "koi_hmag_err", "koi_imag", "koi_imag_err", "koi_impact", "koi_impact_err1",
    "koi_impact_err2", "koi_incl", "koi_incl_err1", "koi_incl_err2", "koi_ingress",
    "koi_ingress_err1", "koi_ingress_err2", "koi_insol", "koi_insol_err1", "koi_insol_err2",
    "koi_jmag", "koi_jmag_err", "koi_kepmag", "koi_kepmag_err", "koi_kmag", "koi_kmag_err",
    "koi_ldm_coeff1", "koi_ldm_coeff2", "koi_ldm_coeff3", "koi_ldm_coeff4", "koi_limbdark_mod",
    "koi_longp", "koi_longp_err1", "koi_longp_err2", "koi_max_mult_ev", "koi_max_sngle_ev",
    "koi_model_chisq", "koi_model_dof", "koi_model_snr", "koi_num_transits", "koi_parm_prov",
    "koi_pdisposition", "koi_period", "koi_period_err1", "koi_period_err2", "koi_prad",
    "koi_prad_err1", "koi_prad_err2", "koi_quarters", "koi_rmag", "koi_rmag_err", "koi_ror",
    "koi_ror_err1", "koi_ror_err2", "koi_sage", "koi_sage_err1", "koi_sage_err2", "koi_score",
    "koi_slogg", "koi_slogg_err1", "koi_slogg_err2", "koi_sma", "koi_sma_err1", "koi_sma_err2",
    "koi_smass", "koi_smass_err1", "koi_smass_err2", "koi_smet", "koi_smet_err1", "koi_smet_err2",
    "koi_sparprov", "koi_srad", "koi_srad_err1", "koi_srad_err2", "koi_srho", "koi_srho_err1",
    "koi_srho_err2", "koi_steff", "koi_steff_err1", "koi_steff_err2", "koi_tce_delivname",
    "koi_tce_plnt_num", "koi_teq", "koi_teq_err1", "koi_teq_err2", "koi_time0", "koi_time0_err1",
    "koi_time0_err2", "koi_time0bk", "koi_time0bk_err1", "koi_time0bk_err2", "koi_trans_mod",
    "koi_vet_date", "koi_vet_stat", "koi_zmag", "koi_zmag_err", "ra", "ra_err", "ra_str", "rowid"
  ]

  // Fonction pour nettoyer une valeur de manière très sûre
  const safeCleaner = (value: unknown): unknown => {
    if (value === null || value === undefined) {
      return null
    }
    
    if (typeof value === 'number') {
      if (isNaN(value) || !isFinite(value) || value === Infinity || value === -Infinity) {
        return null
      }
      // Limiter la précision pour éviter les problèmes
      if (Math.abs(value) < 1e-10 && value !== 0) return 0
      if (Math.abs(value) > 1e10) return null
      return parseFloat(value.toFixed(6))
    }
    
    if (typeof value === 'string') {
      const cleaned = value.trim()
      if (!cleaned || cleaned === 'null' || cleaned === 'undefined' || cleaned === 'NaN') {
        return null
      }
      // Retourner seulement des caractères ASCII sûrs
      return cleaned.replace(/[^\x20-\x7E]/g, '').substring(0, 500) || null
    }
    
    if (typeof value === 'boolean') {
      return value
    }
    
    return null
  }

  // Fonction principale d'export - version complètement refaite
  const performAdvancedExport = async () => {
    setExportProgress({ show: true, value: 0, status: locale === 'en' ? 'Starting export...' : 'Démarrage de l\'export...' })
    
    try {
      // Vérifier si on est sur l'onglet "Our Database" pour utiliser les données MongoDB
      if (activeTab === 'processed') {
        // Exporter les données MongoDB depuis le cache
        setExportProgress({ show: true, value: 30, status: locale === 'en' ? 'Preparing MongoDB data...' : 'Préparation des données MongoDB...' })
        
        if (!mongoData || mongoData.length === 0) {
          throw new Error(locale === 'en' ? 'No MongoDB data available. Please load the data first.' : 'Aucune donnée MongoDB disponible. Veuillez charger les données d\'abord.')
        }

        // Appliquer les filtres sur les données MongoDB
        let filteredData = [...mongoData]
        
        if (!exportFilters.all) {
          filteredData = mongoData.filter(item => {
            const disposition = item.disposition
            if (exportFilters.confirmed && disposition === 'CONFIRMED') return true
            if (exportFilters.candidates && disposition === 'CANDIDATE') return true
            if (exportFilters.falsePositives && disposition === 'FALSE POSITIVE') return true
            return false
          })
        }

        setExportProgress({ show: true, value: 70, status: locale === 'en' ? 'Processing MongoDB data...' : 'Traitement des données MongoDB...' })
        
        // Nettoyer les données MongoDB
        const cleanedData = filteredData.map(item => {
          const cleanedItem: Record<string, unknown> = {}
          Object.entries(item).forEach(([key, value]) => {
            cleanedItem[key] = safeCleaner(value)
          })
          return cleanedItem
        })

        setExportProgress({ show: true, value: 90, status: locale === 'en' ? 'Generating file...' : 'Génération du fichier...' })
        
        // Générer le fichier selon le format
        let fileContent: string
        let fileName: string
        let mimeType: string

        if (exportFormat === 'json') {
          // Créer le JSON manuellement pour éviter JSON.stringify
          const jsonLines = cleanedData.map(item => {
            const pairs = Object.entries(item).map(([key, value]) => {
              const safeKey = JSON.stringify(key)
              let safeValue: string
              if (value === null || value === undefined) {
                safeValue = 'null'
              } else if (typeof value === 'number') {
                safeValue = String(value)
              } else if (typeof value === 'boolean') {
                safeValue = String(value)
              } else {
                safeValue = JSON.stringify(String(value))
              }
              return `${safeKey}: ${safeValue}`
            })
            return `  { ${pairs.join(', ')} }`
          })
          
          fileContent = `[\n${jsonLines.join(',\n')}\n]`
          fileName = `mongodb-exoplanets-export-${Date.now()}.json`
          mimeType = 'application/json'
        } else {
          // CSV - utiliser les clés du premier élément comme headers
          const headers = cleanedData.length > 0 ? Object.keys(cleanedData[0]) : []
          const csvHeaders = headers.join(',')
          const csvRows = cleanedData.map(item => 
            headers.map(header => {
              const value = item[header]
              if (value === null || value === undefined) return ''
              const strValue = String(value)
              // Échapper proprement pour CSV
              if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
                return `"${strValue.replace(/"/g, '""')}"`
              }
              return strValue
            }).join(',')
          )
          
          fileContent = [csvHeaders, ...csvRows].join('\n')
          fileName = `mongodb-exoplanets-export-${Date.now()}.csv`
          mimeType = 'text/csv'
        }

        // Télécharger le fichier
        const blob = new Blob([fileContent], { type: mimeType })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)

        setExportProgress({ 
          show: true, 
          value: 100, 
          status: locale === 'en' ? `MongoDB export completed! ${cleanedData.length} records exported.` : `Export MongoDB terminé ! ${cleanedData.length} enregistrements exportés.`
        })

        setTimeout(() => {
          setExportProgress({ show: false, value: 0, status: '' })
        }, 2000)

        return
      }

      // Code existant pour l'export NASA (onglet "NASA Data")
      // Utiliser toutes les colonnes comme demandé
      const EXPORT_COLUMNS = [
        "dec", "dec_err", "dec_str", "kepid", "kepler_name", "kepoi_name", "koi_bin_oedp_sig",
        "koi_comment", "koi_count", "koi_datalink_dvr", "koi_datalink_dvs", "koi_delivname",
        "koi_depth", "koi_depth_err1", "koi_depth_err2", "koi_dicco_mdec", "koi_dicco_mdec_err",
        "koi_dicco_mra", "koi_dicco_mra_err", "koi_dicco_msky", "koi_dicco_msky_err",
        "koi_dikco_mdec", "koi_dikco_mdec_err", "koi_dikco_mra", "koi_dikco_mra_err",
        "koi_dikco_msky", "koi_dikco_msky_err", "koi_disp_prov", "koi_disposition",
        "koi_dor", "koi_dor_err1", "koi_dor_err2", "koi_duration", "koi_duration_err1",
        "koi_duration_err2", "koi_eccen", "koi_eccen_err1", "koi_eccen_err2", "koi_fittype",
        "koi_fpflag_co", "koi_fpflag_ec", "koi_fpflag_nt", "koi_fpflag_ss", "koi_fwm_pdeco",
        "koi_fwm_pdeco_err", "koi_fwm_prao", "koi_fwm_prao_err", "koi_fwm_sdec", "koi_fwm_sdec_err",
        "koi_fwm_sdeco", "koi_fwm_sdeco_err", "koi_fwm_sra", "koi_fwm_sra_err", "koi_fwm_srao",
        "koi_fwm_srao_err", "koi_fwm_stat_sig", "koi_gmag", "koi_gmag_err", "koi_hmag",
        "koi_hmag_err", "koi_imag", "koi_imag_err", "koi_impact", "koi_impact_err1",
        "koi_impact_err2", "koi_incl", "koi_incl_err1", "koi_incl_err2", "koi_ingress",
        "koi_ingress_err1", "koi_ingress_err2", "koi_insol", "koi_insol_err1", "koi_insol_err2",
        "koi_jmag", "koi_jmag_err", "koi_kepmag", "koi_kepmag_err", "koi_kmag", "koi_kmag_err",
        "koi_ldm_coeff1", "koi_ldm_coeff2", "koi_ldm_coeff3", "koi_ldm_coeff4", "koi_limbdark_mod",
        "koi_longp", "koi_longp_err1", "koi_longp_err2", "koi_max_mult_ev", "koi_max_sngle_ev",
        "koi_model_chisq", "koi_model_dof", "koi_model_snr", "koi_num_transits", "koi_parm_prov",
        "koi_pdisposition", "koi_period", "koi_period_err1", "koi_period_err2", "koi_prad",
        "koi_prad_err1", "koi_prad_err2", "koi_quarters", "koi_rmag", "koi_rmag_err", "koi_ror",
        "koi_ror_err1", "koi_ror_err2", "koi_sage", "koi_sage_err1", "koi_sage_err2", "koi_score",
        "koi_slogg", "koi_slogg_err1", "koi_slogg_err2", "koi_sma", "koi_sma_err1", "koi_sma_err2",
        "koi_smass", "koi_smass_err1", "koi_smass_err2", "koi_smet", "koi_smet_err1", "koi_smet_err2",
        "koi_sparprov", "koi_srad", "koi_srad_err1", "koi_srad_err2", "koi_srho", "koi_srho_err1",
        "koi_srho_err2", "koi_steff", "koi_steff_err1", "koi_steff_err2", "koi_tce_delivname",
        "koi_tce_plnt_num", "koi_teq", "koi_teq_err1", "koi_teq_err2", "koi_time0", "koi_time0_err1",
        "koi_time0_err2", "koi_time0bk", "koi_time0bk_err1", "koi_time0bk_err2", "koi_trans_mod",
        "koi_vet_date", "koi_vet_stat", "koi_zmag", "koi_zmag_err", "ra", "ra_err", "ra_str", "rowid"
      ]

      // Construction de la requête WHERE selon les filtres
      let whereClause = 'kepoi_name is not null'
      
      if (!exportFilters.all) {
        const conditions = []
        if (exportFilters.confirmed) conditions.push("koi_disposition = 'CONFIRMED'")
        if (exportFilters.candidates) conditions.push("koi_disposition = 'CANDIDATE'")
        if (exportFilters.falsePositives) conditions.push("koi_disposition = 'FALSE POSITIVE'")
        
        if (conditions.length > 0) {
          whereClause += ` AND (${conditions.join(' OR ')})`
        }
      }

      setExportProgress({ show: true, value: 30, status: locale === 'en' ? 'Fetching data from NASA...' : 'Récupération des données NASA...' })
      
      // Utiliser CSV format pour récupérer les données (plus fiable que JSON)
      const nasaRestUrl = `https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI`
      const restParams = new URLSearchParams({
        table: 'cumulative',
        format: 'csv',
        select: EXPORT_COLUMNS.join(','),
        where: whereClause,
        order: 'kepoi_name'
      })

      setExportProgress({ show: true, value: 50, status: locale === 'en' ? 'Downloading from NASA...' : 'Téléchargement depuis NASA...' })

      const response = await fetch(`${nasaRestUrl}?${restParams.toString()}`, {
        headers: {
          'Accept': 'text/csv',
          'User-Agent': 'ExoPlanet-AI-NextJS/1.0'
        }
      })

      if (!response.ok) {
        throw new Error(`Erreur NASA API: ${response.status}`)
      }

      const csvText = await response.text()
      
      setExportProgress({ show: true, value: 70, status: locale === 'en' ? 'Processing data...' : 'Traitement des données...' })
      
      // Parser le CSV manuellement de manière sûre
      const lines = csvText.split('\n').filter(line => line.trim())
      const headers = lines[0].split(',').map(h => h.trim())
      
      const cleanedData = []
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',')
        if (values.length >= headers.length) {
          const row: Record<string, unknown> = {}
          headers.forEach((header, idx) => {
            const rawValue = values[idx]?.trim()
            
            // Convertir en nombre si possible, sinon garder comme chaîne
            if (rawValue && rawValue !== '' && !isNaN(Number(rawValue))) {
              row[header] = safeCleaner(Number(rawValue))
            } else {
              row[header] = safeCleaner(rawValue)
            }
          })
          cleanedData.push(row)
        }
      }

      setExportProgress({ show: true, value: 90, status: locale === 'en' ? 'Generating file...' : 'Génération du fichier...' })
      
      // Générer le fichier selon le format
      let fileContent: string
      let fileName: string
      let mimeType: string

      if (exportFormat === 'json') {
        // Créer le JSON manuellement pour éviter JSON.stringify
        const jsonLines = cleanedData.map(item => {
          const pairs = Object.entries(item).map(([key, value]) => {
            const safeKey = JSON.stringify(key)
            let safeValue: string
            if (value === null || value === undefined) {
              safeValue = 'null'
            } else if (typeof value === 'number') {
              safeValue = String(value)
            } else if (typeof value === 'boolean') {
              safeValue = String(value)
            } else {
              safeValue = JSON.stringify(String(value))
            }
            return `${safeKey}: ${safeValue}`
          })
          return `  { ${pairs.join(', ')} }`
        })
        
        fileContent = `[\n${jsonLines.join(',\n')}\n]`
        fileName = `nasa-exoplanets-export-${Date.now()}.json`
        mimeType = 'application/json'
      } else {
        // CSV - reconstruire proprement
        const csvHeaders = headers.join(',')
        const csvRows = cleanedData.map(item => 
          headers.map(header => {
            const value = item[header]
            if (value === null || value === undefined) return ''
            const strValue = String(value)
            // Échapper proprement pour CSV
            if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
              return `"${strValue.replace(/"/g, '""')}"`
            }
            return strValue
          }).join(',')
        )
        
        fileContent = [csvHeaders, ...csvRows].join('\n')
        fileName = `nasa-exoplanets-export-${Date.now()}.csv`
        mimeType = 'text/csv'
      }

      // Télécharger le fichier
      const blob = new Blob([fileContent], { type: mimeType })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      a.click()
      window.URL.revokeObjectURL(url)

      setExportProgress({ show: true, value: 100, status: locale === 'en' ? 'Export completed successfully!' : 'Export terminé avec succès!' })
      
      setTimeout(() => {
        setExportProgress({ show: false, value: 0, status: '' })
        setExportDialog(false)
      }, 2000)

    } catch (error) {
      console.error('Erreur export:', error)
      setExportProgress({ show: true, value: 0, status: locale === 'en' ? `Error: ${error instanceof Error ? error.message : 'Unknown error'}` : `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}` })
      
      setTimeout(() => {
        setExportProgress({ show: false, value: 0, status: '' })
      }, 3000)
    }
  }

  // Charger le cache MongoDB au démarrage
  useEffect(() => {
    // Charger le cache MongoDB dès le démarrage pour un accès rapide
    loadCacheFromStorage()
  }, [])

  // Charger les données selon l'onglet actif
  useEffect(() => {
    // Reset pagination à la page 1 quand on change d'onglet
    setPagination(prev => ({ ...prev, page: 1 }))
    
    if (activeTab === 'nasa') {
      fetchNASAData()
    } else if (activeTab === 'processed') {
      fetchMongoData()
    }
  }, [activeTab])

  // Debug: Surveiller les changements de mongoData
  useEffect(() => {
    console.log('🔄 MongoDB data changed:', mongoData.length, 'entries')
    if (mongoData.length > 0) {
      console.log('🔍 Sample data:', mongoData[0])
    }
  }, [mongoData])

  // Fonction pour récupérer les données NASA
  const fetchNASAData = async () => {
    setNasaLoading(true)
    setNasaError(null)
    
    try {
      console.log('🚀 Récupération données NASA KOI complètes...')
      // Récupérer TOUTES les données sans limitation
      const data = await NASAADQLService.getKOITableData()
      
      setNasaData(data)
      setNasaTotalCount(data.length)
      
      console.log(`✅ ${data.length} entrées NASA récupérées au total`)
    } catch (error) {
      console.error('❌ Erreur NASA:', error)
      setNasaError(error instanceof Error ? error.message : 'Erreur lors du chargement des données NASA')
    } finally {
      setNasaLoading(false)
    }
  }

  // Fonction pour récupérer les données MongoDB (Our Database) avec cache intelligent
  const fetchMongoData = async (forceRefresh = false) => {
    try {
      // Si ce n'est pas un refresh forcé, charger le cache d'abord
      if (!forceRefresh) {
        const cacheLoaded = loadCacheFromStorage()
        
        // Si le cache est valide, on l'utilise et on fait une mise à jour en arrière-plan
        if (cacheLoaded && isCacheValid()) {
          console.log('✨ Utilisation du cache MongoDB valide, mise à jour en arrière-plan...')
          // Lancer la mise à jour en arrière-plan sans bloquer l'UI
          setTimeout(() => fetchMongoData(true), 100)
          return
        }
        
        // Si on a des données en cache (même expirées), les afficher pendant le chargement
        if (mongoData.length === 0 && cacheLoaded) {
          console.log('📦 Affichage du cache expiré pendant le chargement...')
        }
      }

      // Indiquer le chargement seulement si on n'a pas de données à afficher
      if (mongoData.length === 0) {
        setMongoLoading(true)
      }
      setMongoError(null)
      
      console.log('🚀 Récupération données MongoDB depuis le serveur...')
      
      // Appel vers votre backend Express - route /all pour récupérer toutes les exoplanètes (sans limite)
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'
      const response = await fetch(`${backendUrl}/api/exoplanets/all?limit=10000`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Erreur Backend API: ${response.status}`)
      }
      
      const responseData = await response.json()
      
      // La réponse de votre API contient { success: true, data: { exoplanets: [...] } }
      const exoplanetsArray = responseData.data?.exoplanets || []
      
      // Mapper les données MongoDB vers le format Exoplanet et trier par koi_name
      const mappedData: Exoplanet[] = exoplanetsArray
        .map((item: Record<string, unknown>, index: number) => ({
          id: item._id || item.id || `mongo-${index}`,
          name: item.koi_name || item.kepoi_name || item.name || 'Unknown',
          keplerName: item.kepler_name || item.keplerName,
          disposition: item.disposition || item.koi_disposition || 'UNKNOWN',
          period: item.period || item.koi_period || item.Period,
          planetRadius: item.radius || item.koi_prad || item.Radius || item.planetRadius,
          equilibriumTemperature: item.temperature || item.koi_teq || item.temp || item.equilibriumTemperature,
          mission: 'Kepler' as const,
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: item.updatedAt || new Date().toISOString(),
          // Ajouter d'autres champs si disponibles dans votre MongoDB
          score: item.score || item.koi_score,
          visualizationUrl: item.visualizationUrl,
          isAiGenerated: item.isAiGenerated || item.ai_generated || item.IS_AI || false,
          // Champs supplémentaires pour correspondre à l'interface Exoplanet
          transitDuration: item.transitDuration || item.koi_duration,
          transitDepth: item.transitDepth || item.koi_depth,
          stellarRadius: item.stellarRadius || item.koi_srad,
          stellarTemperature: item.stellarTemperature || item.koi_steff,
          stellarMagnitude: item.stellarMagnitude || item.koi_kepmag,
          insolationFlux: item.insolationFlux || item.koi_insol,
          discoveryMethod: item.discoveryMethod || 'Transit',
          discoveryDate: item.discoveryDate,
          kepid: item.kepid || item.koi_kepid
        }))
        .sort((a: Exoplanet, b: Exoplanet) => {
          // Trier par koi_name (name)
          const nameA = a.name.toLowerCase()
          const nameB = b.name.toLowerCase()
          return nameA.localeCompare(nameB)
        })
      
      setMongoData(mappedData)
      // Utiliser le total de la pagination si disponible, sinon la longueur du tableau
      const totalCount = responseData.data?.pagination?.total || mappedData.length
      setMongoTotalCount(totalCount)
      
      // Sauvegarder dans le cache
      saveCacheToStorage(mappedData, totalCount)
      
      console.log(`✅ ${mappedData.length} entrées MongoDB récupérées au total (${totalCount} au total dans la DB)`)
      console.log('📝 Échantillon de données mappées:', mappedData.slice(0, 2))
    } catch (error) {
      console.error('❌ Erreur MongoDB:', error)
      setMongoError(error instanceof Error ? error.message : 'Erreur lors du chargement des données MongoDB')
    } finally {
      setMongoLoading(false)
    }
  }

  // Sélection des données selon l'onglet actif
  const getCurrentData = () => {
    switch (activeTab) {
      case 'nasa':
        // Pour l'onglet NASA, on utilise les vraies données NASA
        return nasaData.map((item, index) => ({
          id: `nasa-${index}`,
          name: item.kepoi_name,
          keplerName: item.kepler_name || undefined,
          period: item.koi_period,
          planetRadius: item.koi_prad,
          equilibriumTemperature: item.koi_teq,
          disposition: item.koi_disposition as 'CONFIRMED' | 'CANDIDATE' | 'FALSE POSITIVE',
          mission: 'Kepler' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as Exoplanet));
      case 'processed':
        // Pour l'onglet Our Database, on utilise les données MongoDB
        return mongoData
      default:
        return []
    }
  }

  // Filtrage et tri des données
  const filteredAndSortedData = useMemo(() => {
    const filtered = getCurrentData().filter(exoplanet => {
      // Recherche textuelle dans le nom et le nom Kepler
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesName = exoplanet.name.toLowerCase().includes(query)
        const matchesKeplerName = exoplanet.keplerName?.toLowerCase().includes(query)
        
        if (!matchesName && !matchesKeplerName) {
          return false
        }
      }
      
      // Filtre par disposition
      if (filters.disposition && !filters.disposition.includes(exoplanet.disposition)) {
        return false
      }
      
      // Filtre par mission
      if (filters.mission && !filters.mission.includes(exoplanet.mission)) {
        return false
      }
      
      // Filtre par données IA (seulement pour l'onglet "processed")
      if (activeTab === 'processed' && filters.isAiGenerated !== undefined) {
        if (filters.isAiGenerated && !exoplanet.isAiGenerated) {
          return false
        }
        if (!filters.isAiGenerated && exoplanet.isAiGenerated) {
          return false
        }
      }
      
      // Filtre par période
      if (filters.periodRange && exoplanet.period) {
        const [min, max] = filters.periodRange
        if (exoplanet.period < min || exoplanet.period > max) {
          return false
        }
      }
      
      return true
    })

    // Tri
    if (pagination.sortBy) {
      filtered.sort((a, b) => {
        const aVal = a[pagination.sortBy as keyof Exoplanet]
        const bVal = b[pagination.sortBy as keyof Exoplanet]
        
        if (aVal === undefined) return 1
        if (bVal === undefined) return -1
        
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return pagination.sortOrder === 'asc' 
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal)
        }
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return pagination.sortOrder === 'asc' 
            ? aVal - bVal
            : bVal - aVal
        }
        
        return 0
      })
    }

    return filtered
  }, [activeTab, searchQuery, filters, pagination.sortBy, pagination.sortOrder, nasaData, mongoData])

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.limit
    return filteredAndSortedData.slice(startIndex, startIndex + pagination.limit);
  }, [filteredAndSortedData, pagination.page, pagination.limit])

  const totalPages = Math.ceil(filteredAndSortedData.length / pagination.limit)

  const getDispositionBadge = (disposition: string) => {
    switch (disposition) {
      case 'CONFIRMED':
        return <Badge 
          className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700 font-medium"
        >
          {locale === 'en' ? 'Confirmed' : 'Confirmée'}
        </Badge>
      case 'CANDIDATE':
        return <Badge 
          className="bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700 font-medium"
        >
          {locale === 'en' ? 'Candidate' : 'Candidate'}
        </Badge>
      case 'FALSE POSITIVE':
        return <Badge 
          className="bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-200 dark:border-red-700 font-medium"
        >
          {locale === 'en' ? 'False Positive' : 'Faux Positif'}
        </Badge>
      default:
        return <Badge variant="secondary">{disposition}</Badge>
    }
  }

  const handleSort = (column: keyof Exoplanet) => {
    setPagination(prev => ({
      ...prev,
      sortBy: column,
      sortOrder: prev.sortBy === column && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }))
  }

  const exportToCSV = () => {
    const headers = locale === 'en' 
      ? ['Name', 'Disposition', 'Period', 'Radius', 'Temperature', 'Score']
      : ['Nom', 'Disposition', 'Période', 'Rayon', 'Température', 'Score']
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedData.map(exoplanet => [
        exoplanet.name,
        exoplanet.disposition,
        exoplanet.period || '',
        exoplanet.planetRadius || '',
        exoplanet.equilibriumTemperature || '',
        exoplanet.score || ''
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'exoplanets.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Fonction pour rendre les contrôles de pagination
  const renderPagination = (className: string = "") => (
    <div className={`flex items-center space-x-3 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
        disabled={pagination.page === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        {locale === 'en' ? 'Previous' : 'Précédent'}
      </Button>
      
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <span>
          {locale === 'en' 
            ? `Page ${pagination.page} of ${totalPages}`
            : `Page ${pagination.page} sur ${totalPages}`
          }
        </span>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => setPagination(prev => ({ ...prev, page: Math.min(totalPages, prev.page + 1) }))}
        disabled={pagination.page === totalPages}
      >
        {locale === 'en' ? 'Next' : 'Suivant'}
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* En-tête */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Database className="h-8 w-8 text-primary glow-effect" />
            <div>
              <h1 className="text-3xl font-bold">
                {locale === 'en' ? 'KOI Database' : 'Base de Données KOI'}
              </h1>
              <p className="text-lg text-muted-foreground">
                {locale === 'en' 
                  ? 'Explore Kepler Objects of Interest and known exoplanets'
                  : 'Explorer les objets d\'intérêt Kepler et exoplanètes connues'
                }
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              {filteredAndSortedData.length} {locale === 'en' ? 'exoplanets found' : 'exoplanètes trouvées'}
            </div>
            <Button onClick={exportToCSV} variant="outline" className="glow-effect">
              <Download className="h-4 w-4 mr-2" />
              {locale === 'en' ? 'Export CSV' : 'Exporter CSV'}
            </Button>
          </div>
        </div>

        {/* Système d'onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="nasa" className="flex items-center space-x-2">
              <Satellite className="h-4 w-4" />
              <span>{locale === 'en' ? 'NASA Kepler' : 'NASA Kepler'}</span>
            </TabsTrigger>
            <TabsTrigger value="processed" className="flex items-center space-x-2">
              <HardDrive className="h-4 w-4" />
              <span>{locale === 'en' ? 'Our Database' : 'Notre Base'}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="nasa" className="space-y-6">
            <div className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg border-l-4 border-l-gray-400">
              {locale === 'en' 
                ? '🛰️ Raw data from NASA Kepler mission - Original KOI catalog with unprocessed observations. Read-only reference data.'
                : '🛰️ Données brutes de la mission NASA Kepler - Catalogue KOI original avec observations non traitées. Données de référence en lecture seule.'
              }
            </div>
            
            {/* Contenu pour NASA */}
            {renderDataContent()}
          </TabsContent>

          <TabsContent value="processed" className="space-y-6">
            <div className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg border-l-4 border-l-blue-500">
              {locale === 'en' 
                ? '💾 Our processed database - Enhanced data with additional analysis and confirmed classifications. ✨ Click on any row to open the detailed exoplanet profile page.'
                : '💾 Notre base de données traitée - Données enrichies avec analyses supplémentaires et classifications confirmées. ✨ Cliquez sur une ligne pour ouvrir la page de profil détaillé de l\'exoplanète.'
              }
            </div>
            
            {/* Contenu pour notre base */}
            {renderDataContent()}
          </TabsContent>

        </Tabs>
      </div>

      {/* Dialog pour choisir la méthode de visualisation */}
      <Dialog open={visualizationDialog} onOpenChange={setVisualizationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {locale === 'en' ? 'Choose Visualization Method' : 'Choisir la Méthode de Visualisation'}
            </DialogTitle>
            <DialogDescription>
              {locale === 'en' 
                ? `How would you like to visualize ${selectedExoplanet?.name}?`
                : `Comment souhaitez-vous visualiser ${selectedExoplanet?.name} ?`
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 gap-4 py-4">
            <Button 
              onClick={() => selectedExoplanet && openEyesOfNasa(selectedExoplanet)}
              className="flex items-center justify-start space-x-3 h-auto p-4 glow-effect"
              variant="outline"
              disabled={!selectedExoplanet?.keplerName}
            >
              <Eye className="h-6 w-6" />
              <div className="text-left">
                <div className="font-semibold">
                  {locale === 'en' ? 'Eyes of NASA' : 'Eyes of NASA'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {locale === 'en' 
                    ? 'Official NASA 3D visualization platform'
                    : 'Visualisation 3D officielle de la NASA'
                  }
                </div>
              </div>
            </Button>

            <Button 
              onClick={() => selectedExoplanet && openEducationalVisualizer(selectedExoplanet)}
              className="flex items-center justify-start space-x-3 h-auto p-4 glow-effect"
              variant="outline"
            >
              <Eye className="h-6 w-6" />
              <div className="text-left">
                <div className="font-semibold">
                  {locale === 'en' ? 'Educational Visualizer' : 'Visualiseur Éducatif'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {locale === 'en' 
                    ? 'Our Interactive 3D model for learning'
                    : 'Notre modèle 3D interactif pour l\'apprentissage'
                  }
                </div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog pour l'export avancé */}
      <Dialog open={exportDialog} onOpenChange={setExportDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {locale === 'en' ? `Export ${exportFormat.toUpperCase()}` : `Exporter ${exportFormat.toUpperCase()}`}
            </DialogTitle>
            <DialogDescription>
              {locale === 'en' 
                ? 'Choose what data to export from NASA database'
                : 'Choisissez les données à exporter de la base NASA'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Options de filtrage - masquées pendant l'export */}
            {!exportProgress.show && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  {locale === 'en' ? 'Filter by disposition:' : 'Filtrer par disposition :'}
                </Label>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="export-all"
                      checked={exportFilters.all}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setExportFilters({ all: true, confirmed: false, candidates: false, falsePositives: false })
                        }
                      }}
                    />
                    <Label htmlFor="export-all" className="text-sm">
                      {locale === 'en' ? 'Export all data' : 'Exporter toutes les données'}
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="export-confirmed"
                      checked={exportFilters.confirmed}
                      onCheckedChange={(checked) => {
                        setExportFilters(prev => ({ 
                          ...prev, 
                          confirmed: !!checked, 
                          all: false 
                        }))
                      }}
                    />
                    <Label htmlFor="export-confirmed" className="text-sm">
                      {locale === 'en' ? 'Confirmed exoplanets only' : 'Exoplanètes confirmées uniquement'}
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="export-candidates"
                      checked={exportFilters.candidates}
                      onCheckedChange={(checked) => {
                        setExportFilters(prev => ({ 
                          ...prev, 
                          candidates: !!checked, 
                          all: false 
                        }))
                      }}
                    />
                    <Label htmlFor="export-candidates" className="text-sm">
                      {locale === 'en' ? 'Candidates only' : 'Candidats uniquement'}
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="export-false-positives"
                      checked={exportFilters.falsePositives}
                      onCheckedChange={(checked) => {
                        setExportFilters(prev => ({ 
                          ...prev, 
                          falsePositives: !!checked, 
                          all: false 
                        }))
                      }}
                    />
                    <Label htmlFor="export-false-positives" className="text-sm">
                      {locale === 'en' ? 'False positives only' : 'Faux positifs uniquement'}
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {/* Barre de progression */}
            {exportProgress.show && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    {locale === 'en' ? 'Progress:' : 'Progression :'}
                  </Label>
                  <span className="text-sm text-muted-foreground">{exportProgress.value}%</span>
                </div>
                <Progress value={exportProgress.value} className="w-full" />
                <p className="text-sm text-muted-foreground">{exportProgress.status}</p>
              </div>
            )}

            {/* Boutons d'action */}
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setExportDialog(false)}
                disabled={exportProgress.show}
              >
                {locale === 'en' ? 'Cancel' : 'Annuler'}
              </Button>
              <Button
                onClick={performAdvancedExport}
                disabled={exportProgress.show || (!exportFilters.all && !exportFilters.confirmed && !exportFilters.candidates && !exportFilters.falsePositives)}
                className="glow-effect"
              >
                {exportProgress.show ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {locale === 'en' ? 'Exporting...' : 'Export en cours...'}
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    {locale === 'en' ? 'Export' : 'Exporter'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )

  // Fonction pour rendre le contenu commun (filtres, tableau, pagination)
  function renderDataContent() {
    return (
      <>
        {/* Filtres et recherche */}
        <Card className="planet-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>{locale === 'en' ? 'Filters and Search' : 'Filtres et Recherche'}</span>
              </CardTitle>
              
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => handleExportClick('csv')}
                  variant="outline"
                  size="sm"
                  className="glow-effect"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {locale === 'en' ? 'Export CSV' : 'Exporter CSV'}
                </Button>
                <Button
                  onClick={() => handleExportClick('json')}
                  variant="outline"
                  size="sm"
                  className="glow-effect"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {locale === 'en' ? 'Export JSON' : 'Exporter JSON'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Barre de recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={locale === 'en' ? 'Search by KOI or Kepler name...' : 'Rechercher par nom KOI ou Kepler...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Filtres */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label>{locale === 'en' ? 'Disposition' : 'Disposition'}</Label>
                <Select 
                  value={filters.disposition?.[0] || 'all'} 
                  onValueChange={(value) => setFilters({...filters, disposition: value !== 'all' ? [value as "CONFIRMED" | "CANDIDATE" | "FALSE POSITIVE"] : undefined})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={locale === 'en' ? 'All' : 'Toutes'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{locale === 'en' ? 'All' : 'Toutes'}</SelectItem>
                    <SelectItem value="CONFIRMED">{locale === 'en' ? 'Confirmed' : 'Confirmées'}</SelectItem>
                    <SelectItem value="CANDIDATE">{locale === 'en' ? 'Candidates' : 'Candidates'}</SelectItem>
                    <SelectItem value="FALSE POSITIVE">{locale === 'en' ? 'False Positives' : 'Faux Positifs'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Filtre IA - seulement pour l'onglet "processed" */}
              {activeTab === 'processed' && (
                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Brain className="h-4 w-4" />
                    <span>{locale === 'en' ? 'AI Generated' : 'Généré par IA'}</span>
                  </Label>
                  <Select 
                    value={filters.isAiGenerated === undefined ? 'all' : filters.isAiGenerated ? 'true' : 'false'} 
                    onValueChange={(value) => setFilters({...filters, isAiGenerated: value === 'all' ? undefined : value === 'true'})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={locale === 'en' ? 'All' : 'Toutes'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{locale === 'en' ? 'All' : 'Toutes'}</SelectItem>
                      <SelectItem value="true">{locale === 'en' ? 'AI Generated' : 'Généré par IA'}</SelectItem>
                      <SelectItem value="false">{locale === 'en' ? 'Manual Data' : 'Données Manuelles'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="space-y-2">
                <Label>{locale === 'en' ? 'Min period (days)' : 'Période min (jours)'}</Label>
                <Input 
                  type="number" 
                  placeholder="0"
                  onChange={(e) => {
                    const min = parseFloat(e.target.value) || 0
                    const max = filters.periodRange?.[1] || 1000
                    setFilters({...filters, periodRange: [min, max]})
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <Label>{locale === 'en' ? 'Max period (days)' : 'Période max (jours)'}</Label>
                <Input 
                  type="number" 
                  placeholder="1000"
                  onChange={(e) => {
                    const max = parseFloat(e.target.value) || 1000
                    const min = filters.periodRange?.[0] || 0
                    setFilters({...filters, periodRange: [min, max]})
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="planet-card">
          <CardContent className="p-0">
            {/* États de chargement et d'erreur pour NASA */}
            {activeTab === 'nasa' && (nasaLoading || nasaError) && (
              <div className="px-6 py-4 border-b">
                {nasaLoading && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>
                      {locale === 'en' ? 'Loading NASA data...' : 'Chargement des données NASA...'}
                    </span>
                  </div>
                )}
                {nasaError && (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span>
                      {locale === 'en' ? `Error: ${nasaError}` : `Erreur: ${nasaError}`}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* États de chargement et d'erreur pour MongoDB */}
            {activeTab === 'processed' && (mongoLoading || mongoError) && mongoData.length === 0 && (
              <div className="px-6 py-4 border-b">
                {mongoLoading && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>
                      {locale === 'en' ? 'Loading database data...' : 'Chargement des données de la base...'}
                    </span>
                  </div>
                )}
                {mongoError && (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span>
                      {locale === 'en' ? `Error: ${mongoError}` : `Erreur: ${mongoError}`}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Indication pour les lignes cliquables - Our Database */}
            {activeTab === 'processed' && !mongoError && (
              <div className="px-6 py-3 bg-blue-50 dark:bg-blue-950 border-b border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <HardDrive className="h-4 w-4" />
                    <span className="text-sm text-blue-700 dark:text-blue-300">
                      {locale === 'en' 
                        ? 'Click on any exoplanet to view detailed information and analysis'
                        : 'Cliquez sur une exoplanète pour voir les informations détaillées et l\'analyse'
                      }
                    </span>
                    {mongoLoading && (
                      <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
                    )}
                  </div>
                  
                
                </div>
              </div>
            )}

            {/* Information pour l'onglet NASA */}
            {activeTab === 'nasa' && !nasaLoading && !nasaError && (
              <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Satellite className="h-4 w-4" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {locale === 'en' 
                        ? 'NASA Kepler mission data - Read-only reference catalog'
                        : 'Données de la mission NASA Kepler - Catalogue de référence en lecture seule'
                      }
                    </span>
                  </div>
                  
                  {/* Pagination en haut pour l'onglet NASA */}
                  {totalPages > 1 && renderPagination("text-slate-700 dark:text-slate-300")}
                </div>
              </div>
            )}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox 
                        checked={selectedRows.length === paginatedData.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedRows(paginatedData.map(row => row.id))
                          } else {
                            setSelectedRows([])
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        onClick={() => handleSort('name')}
                        className="h-auto p-0 font-semibold"
                      >
                        {locale === 'en' ? 'Name' : 'Nom'} <ArrowUpDown className="ml-1 h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>{locale === 'en' ? 'Disposition' : 'Disposition'}</TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        onClick={() => handleSort('period')}
                        className="h-auto p-0 font-semibold"
                      >
                        {locale === 'en' ? 'Period (d)' : 'Période (j)'} <ArrowUpDown className="ml-1 h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        onClick={() => handleSort('planetRadius')}
                        className="h-auto p-0 font-semibold"
                      >
                        {locale === 'en' ? 'Radius (R⊕)' : 'Rayon (R⊕)'} <ArrowUpDown className="ml-1 h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        onClick={() => handleSort('equilibriumTemperature')}
                        className="h-auto p-0 font-semibold"
                      >
                        {locale === 'en' ? 'Temp (K)' : 'Temp (K)'} <ArrowUpDown className="ml-1 h-3 w-3" />
                      </Button>
                    </TableHead>
                    {/* Colonne Score seulement pour l'onglet processed */}
                    {activeTab === 'processed' && (
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          onClick={() => handleSort('score')}
                          className="h-auto p-0 font-semibold"
                        >
                          {locale === 'en' ? 'Score' : 'Score'} <ArrowUpDown className="ml-1 h-3 w-3" />
                        </Button>
                      </TableHead>
                    )}
                    <TableHead>{locale === 'en' ? 'Actions' : 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((exoplanet) => (
                    <TableRow 
                      key={exoplanet.id}
                      className={
                        activeTab === 'processed' 
                          ? 'cursor-pointer hover:bg-muted/50 transition-colors border-l-4 border-l-blue-500 hover:border-l-blue-600' 
                          : 'opacity-75 border-l-4 border-l-gray-300'
                      }
                      onClick={() => activeTab === 'processed' && openExoplanetProfile(exoplanet)}
                      title={activeTab === 'processed' ? (locale === 'en' ? 'Click to open exoplanet profile page' : 'Cliquez pour ouvrir la page de profil de l\'exoplanète') : ''}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox 
                          checked={selectedRows.includes(exoplanet.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedRows([...selectedRows, exoplanet.id])
                            } else {
                              setSelectedRows(selectedRows.filter(id => id !== exoplanet.id))
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{exoplanet.name}</span>
                            {activeTab === 'processed' && exoplanet.isAiGenerated && (
                              <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                AI
                              </Badge>
                            )}
                          </div>
                          {((activeTab === 'nasa') || (activeTab === 'processed')) && exoplanet.keplerName && (
                            <span className="text-sm text-muted-foreground">
                              {exoplanet.keplerName}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getDispositionColor(exoplanet.disposition)}>
                          {exoplanet.disposition}
                        </Badge>
                      </TableCell>
                      <TableCell>{exoplanet.period ? `${exoplanet.period.toFixed(1)}` : 'N/A'}</TableCell>
                      <TableCell>{exoplanet.planetRadius ? `${exoplanet.planetRadius.toFixed(2)}` : 'N/A'}</TableCell>
                      <TableCell>{exoplanet.equilibriumTemperature || 'N/A'}</TableCell>
                      {/* Cellule Score seulement pour l'onglet processed */}
                      {activeTab === 'processed' && (
                        <TableCell>
                          {exoplanet.score ? (
                            <Badge variant={exoplanet.score > 0.8 ? 'default' : 'secondary'}>
                              {(exoplanet.score * 100).toFixed(0)}%
                            </Badge>
                          ) : 'N/A'}
                        </TableCell>
                      )}
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center space-x-2">
                          {exoplanet.disposition === 'CONFIRMED' && exoplanet.visualizationUrl && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(exoplanet.visualizationUrl, '_blank')}
                              className="glow-effect"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              3D
                            </Button>
                          )}
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => handleVisualizationClick(exoplanet)}
                                  className="glow-effect"
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {locale === 'en' 
                                    ? 'Choose visualization method'
                                    : 'Choisir la méthode de visualisation'
                                  }
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {locale === 'en' 
              ? `Page ${pagination.page} of ${totalPages} (${filteredAndSortedData.length} results)`
              : `Page ${pagination.page} sur ${totalPages} (${filteredAndSortedData.length} résultats)`
            }
          </div>
          
          {renderPagination()}
        </div>

      </>
    )
  }
}