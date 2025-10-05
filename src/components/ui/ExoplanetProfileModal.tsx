"use client"

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { 
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
  X
} from 'lucide-react'
import { Exoplanet } from '@/types/exoplanet'

interface ExoplanetProfileModalProps {
  exoplanet: Exoplanet | null
  isOpen: boolean
  onClose: () => void
  locale: string
}

export function ExoplanetProfileModal({ exoplanet, isOpen, onClose, locale }: ExoplanetProfileModalProps) {
  if (!exoplanet) return null

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

  const downloadReport = () => {
    // Simulation du téléchargement PDF
    const reportContent = `
RAPPORT D'ANALYSE - ${exoplanet.name}
=====================================

INFORMATIONS GÉNÉRALES
----------------------
Nom: ${exoplanet.name}
ID Kepler: ${exoplanet.kepid || 'N/A'}
Classification: ${exoplanet.disposition}
Score de confiance: ${exoplanet.score ? (exoplanet.score * 100).toFixed(1) + '%' : 'N/A'}
${exoplanet.isAiGenerated ? 'Données générées par IA' : 'Données manuelles'}

PARAMÈTRES ORBITAUX
------------------
Période orbitale: ${exoplanet.period ? exoplanet.period.toFixed(2) + ' jours' : 'N/A'}
Durée de transit: ${exoplanet.transitDuration ? exoplanet.transitDuration.toFixed(2) + ' heures' : 'N/A'}
Profondeur de transit: ${exoplanet.transitDepth ? exoplanet.transitDepth + ' ppm' : 'N/A'}

PARAMÈTRES PHYSIQUES
-------------------
Rayon planétaire: ${exoplanet.planetRadius ? exoplanet.planetRadius.toFixed(2) + ' R⊕' : 'N/A'}
Température d'équilibre: ${exoplanet.equilibriumTemperature ? exoplanet.equilibriumTemperature + ' K' : 'N/A'}
Flux d'insolation: ${exoplanet.insolationFlux ? exoplanet.insolationFlux.toFixed(2) : 'N/A'}

PARAMÈTRES STELLAIRES
--------------------
Rayon stellaire: ${exoplanet.stellarRadius ? exoplanet.stellarRadius.toFixed(2) + ' R☉' : 'N/A'}
Température stellaire: ${exoplanet.stellarTemperature ? exoplanet.stellarTemperature + ' K' : 'N/A'}
Magnitude: ${exoplanet.stellarMagnitude ? exoplanet.stellarMagnitude.toFixed(2) : 'N/A'}

MÉTADONNÉES
-----------
Méthode de découverte: ${exoplanet.discoveryMethod || 'N/A'}
Date de découverte: ${exoplanet.discoveryDate || 'N/A'}
Mission: ${exoplanet.mission}

Généré le: ${new Date().toLocaleDateString('fr-FR')}
Par: ExoPlanet AI - Système de classification d'exoplanètes
    `

    const blob = new Blob([reportContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rapport_${exoplanet.name.replace(/[^a-zA-Z0-9]/g, '_')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] w-[90vw] h-[80vh] p-0 overflow-hidden bg-background border">
        {/* Header simple et professionnel */}
        <div className="border-b bg-muted/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{exoplanet.name}</h1>
                <div className="flex items-center space-x-3 mt-2">
                  <Badge className={getDispositionColor(exoplanet.disposition)}>
                    {exoplanet.disposition}
                  </Badge>
                  {exoplanet.isAiGenerated && (
                    <Badge variant="outline" className="border-purple-300 text-purple-700">
                      <Brain className="h-3 w-3 mr-1" />
                      {locale === 'en' ? 'AI Generated' : 'Généré par IA'}
                    </Badge>
                  )}
                  {exoplanet.score && (
                    <Badge variant="secondary">
                      {locale === 'en' ? 'Confidence' : 'Confiance'}: {(exoplanet.score * 100).toFixed(1)}%
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            {/* Boutons d'action principaux */}
            <div className="flex items-center space-x-3">
              {exoplanet.disposition === 'CONFIRMED' && exoplanet.visualizationUrl && (
                <Button 
                  onClick={() => window.open(exoplanet.visualizationUrl, '_blank')}
                  className="px-6 py-2"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {locale === 'en' ? 'NASA 3D' : 'NASA 3D'}
                </Button>
              )}
              
              <Button 
                variant="outline"
                onClick={() => window.open('/visualization-3d', '_blank')}
                className="px-6 py-2"
              >
                <Eye className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Our Visualizer' : 'Notre Visualiseur'}
              </Button>
              
              <Button 
                variant="outline"
                onClick={downloadReport}
                className="px-6 py-2"
              >
                <Download className="h-4 w-4 mr-2" />
                {locale === 'en' ? 'Download Report' : 'Télécharger'}
              </Button>
              
              <Button 
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="ml-4"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Contenu principal - Layout horizontal très large */}
        <div className="flex-1 overflow-y-auto p-8 bg-background">
          <div className="max-w-none mx-auto space-y-8">
            
            {/* Grille principale - 4 colonnes très larges */}
            <div className="grid grid-cols-4 gap-8">
              
              {/* Paramètres Orbitaux */}
              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
                    <Globe className="h-6 w-6" />
                    <span>{locale === 'en' ? 'Orbital Parameters' : 'Paramètres Orbitaux'}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {locale === 'en' ? 'Orbital Period' : 'Période Orbitale'}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {exoplanet.period ? `${exoplanet.period.toFixed(2)} ${locale === 'en' ? 'days' : 'jours'}` : 'N/A'}
                    </div>
                  </div>
                  <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {locale === 'en' ? 'Transit Duration' : 'Durée de Transit'}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {exoplanet.transitDuration ? `${exoplanet.transitDuration.toFixed(2)} h` : 'N/A'}
                    </div>
                  </div>
                  <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {locale === 'en' ? 'Transit Depth' : 'Profondeur de Transit'}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {exoplanet.transitDepth ? `${exoplanet.transitDepth} ppm` : 'N/A'}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Paramètres Physiques */}
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-green-700 dark:text-green-300">
                    <Ruler className="h-6 w-6" />
                    <span>{locale === 'en' ? 'Physical Parameters' : 'Paramètres Physiques'}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Globe className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {locale === 'en' ? 'Planet Radius' : 'Rayon Planétaire'}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                      {exoplanet.planetRadius ? `${exoplanet.planetRadius.toFixed(2)} R⊕` : 'N/A'}
                    </div>
                  </div>
                  <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Thermometer className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {locale === 'en' ? 'Equilibrium Temperature' : 'Température d\'Équilibre'}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                      {exoplanet.equilibriumTemperature ? `${exoplanet.equilibriumTemperature} K` : 'N/A'}
                    </div>
                  </div>
                  <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {locale === 'en' ? 'Insolation Flux' : 'Flux d\'Insolation'}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                      {exoplanet.insolationFlux ? exoplanet.insolationFlux.toFixed(2) : 'N/A'}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Paramètres Stellaires */}
              <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-700">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-orange-700 dark:text-orange-300">
                    <Telescope className="h-6 w-6" />
                    <span>{locale === 'en' ? 'Stellar Parameters' : 'Paramètres Stellaires'}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Star className="h-5 w-5 text-orange-600" />
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {locale === 'en' ? 'Stellar Radius' : 'Rayon Stellaire'}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                      {exoplanet.stellarRadius ? `${exoplanet.stellarRadius.toFixed(2)} R☉` : 'N/A'}
                    </div>
                  </div>
                  <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Thermometer className="h-5 w-5 text-orange-600" />
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {locale === 'en' ? 'Stellar Temperature' : 'Température Stellaire'}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                      {exoplanet.stellarTemperature ? `${exoplanet.stellarTemperature} K` : 'N/A'}
                    </div>
                  </div>
                  <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Eye className="h-5 w-5 text-orange-600" />
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {locale === 'en' ? 'Magnitude' : 'Magnitude'}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                      {exoplanet.stellarMagnitude ? exoplanet.stellarMagnitude.toFixed(2) : 'N/A'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Métadonnées */}
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-purple-700 dark:text-purple-300">
                  <Database className="h-6 w-6" />
                  <span>{locale === 'en' ? 'Discovery Information' : 'Informations de Découverte'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg text-center">
                    <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                      {locale === 'en' ? 'Discovery Date' : 'Date de Découverte'}
                    </div>
                    <div className="text-xl font-bold text-purple-700 dark:text-purple-300">
                      {exoplanet.discoveryDate || 'N/A'}
                    </div>
                  </div>
                  <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg text-center">
                    <Telescope className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                      {locale === 'en' ? 'Discovery Method' : 'Méthode de Découverte'}
                    </div>
                    <div className="text-xl font-bold text-purple-700 dark:text-purple-300">
                      {exoplanet.discoveryMethod || 'N/A'}
                    </div>
                  </div>
                  <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg text-center">
                    <Database className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                      {locale === 'en' ? 'Mission' : 'Mission'}
                    </div>
                    <div className="text-xl font-bold text-purple-700 dark:text-purple-300">
                      {exoplanet.mission}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
