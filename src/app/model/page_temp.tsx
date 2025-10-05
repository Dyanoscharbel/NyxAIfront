"use client"

import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { SimplePieChart, SimpleBarChart, SimpleDonutChart } from '@/components/charts/SimpleCharts'
import { ConfusionMatrixChart } from '@/components/ui/ConfusionMatrixChart'
import { useI18n } from '@/hooks/useI18n'
import { 
  BarChart3, 
  Target, 
  TrendingUp, 
  Clock, 
  Database,
  Cpu,
  CheckCircle,
  AlertCircle,
  Star,
  Calendar,
  Activity,
  Info
} from 'lucide-react'
import { ModelMetrics } from '@/types/exoplanet'

// Données réelles pour les métriques du modèle
const mockModelMetrics: ModelMetrics = {
  version: 'v2.4.1',
  accuracy: 0.9333333333333333,
  precision: 0.905693950177936,
  recall: 0.9305301645338209,
  f1Score: 0.9179440937781785,
  confusionMatrix: {
    truePositive: 509,
    falsePositive: 53,
    trueNegative: 765,
    falseNegative: 38
  },
  rocAuc: 0.9778610156309363,
  trainedOn: '2024-11-15T09:30:00Z',
  datasetSize: 1365,
  features: [
    'koi_prad', 'koi_max_sngle_ev', 'koi_max_mult_ev', 'koi_dor',
    'koi_steff', 'koi_model_snr', 'koi_ror', 'koi_teq', 'koi_smass',
    'koi_srad', 'koi_srho', 'koi_impact', 'koi_duration', 'koi_num_transits',
    'koi_slogg', 'koi_depth', 'koi_period', 'koi_kepmag'
  ],
  hyperparameters: {
    learning_rate: 0.1,
    max_depth: 3,
    n_estimators: 400,
    optimizer: 'gradient_boosting'
  }
}

// Données pour les graphiques
const performanceHistory = [
  { version: 'v1.0', accuracy: 0.876, precision: 0.852, recall: 0.883, f1: 0.867 },
  { version: 'v1.5', accuracy: 0.891, precision: 0.887, recall: 0.895, f1: 0.891 },
  { version: 'v2.0', accuracy: 0.921, precision: 0.918, recall: 0.924, f1: 0.921 },
  { version: 'v2.2', accuracy: 0.935, precision: 0.931, recall: 0.939, f1: 0.935 },
  { version: 'v2.4', accuracy: 0.942, precision: 0.938, recall: 0.945, f1: 0.941 }
]

const featureImportance = [
  { feature: 'Rayon Planétaire (R⊕)', importance: 1.3052 / 1.3052, description: 'koi_prad' },
  { feature: 'S/N Max (Événement Unique)', importance: 1.0727 / 1.3052, description: 'koi_max_sngle_ev' },
  { feature: 'S/N Max (Événements Multiples)', importance: 1.0333 / 1.3052, description: 'koi_max_mult_ev' },
  { feature: 'Distance Orbitale / Rayon Stellaire', importance: 0.8802 / 1.3052, description: 'koi_dor' },
  { feature: 'Température Stellaire (K)', importance: 0.4656 / 1.3052, description: 'koi_steff' },
  { feature: 'Rapport Signal/Bruit', importance: 0.4411 / 1.3052, description: 'koi_model_snr' },
  { feature: 'Rapport Rayon (Rp/R*)', importance: 0.4135 / 1.3052, description: 'koi_ror' },
  { feature: 'Température d\'Équilibre (K)', importance: 0.3605 / 1.3052, description: 'koi_teq' },
  { feature: 'Masse Stellaire (M☉)', importance: 0.3355 / 1.3052, description: 'koi_smass' },
  { feature: 'Rayon Stellaire (R☉)', importance: 0.3174 / 1.3052, description: 'koi_srad' },
  { feature: 'Densité Stellaire (g/cm³)', importance: 0.2848 / 1.3052, description: 'koi_srho' },
  { feature: 'Paramètre d\'Impact', importance: 0.2782 / 1.3052, description: 'koi_impact' },
  { feature: 'Durée du Transit (heures)', importance: 0.2304 / 1.3052, description: 'koi_duration' },
  { feature: 'Nombre de Transits', importance: 0.2145 / 1.3052, description: 'koi_num_transits' },
  { feature: 'Gravité de Surface (log10(cm/s²))', importance: 0.1912 / 1.3052, description: 'koi_slogg' },
  { feature: 'Profondeur du Transit (ppm)', importance: 0.1705 / 1.3052, description: 'koi_depth' },
  { feature: 'Période Orbitale (jours)', importance: 0.1373 / 1.3052, description: 'koi_period' },
  { feature: 'Magnitude Kepler', importance: 0.0609 / 1.3052, description: 'koi_kepmag' }
]

const getConfusionMatrixData = (locale: string) => [
  { name: locale === 'en' ? 'True Positives' : 'Vrais Positifs', value: mockModelMetrics.confusionMatrix.truePositive, color: '#10b981' },
  { name: locale === 'en' ? 'False Positives' : 'Faux Positifs', value: mockModelMetrics.confusionMatrix.falsePositive, color: '#f59e0b' },
  { name: locale === 'en' ? 'True Negatives' : 'Vrais Négatifs', value: mockModelMetrics.confusionMatrix.trueNegative, color: '#6366f1' },
  { name: locale === 'en' ? 'False Negatives' : 'Faux Négatifs', value: mockModelMetrics.confusionMatrix.falseNegative, color: '#ef4444' }
]

const trainingMetrics = [
  { epoch: 10, loss: 0.45, val_loss: 0.48, accuracy: 0.82, val_accuracy: 0.80 },
  { epoch: 20, loss: 0.32, val_loss: 0.35, accuracy: 0.88, val_accuracy: 0.86 },
  { epoch: 30, loss: 0.24, val_loss: 0.28, accuracy: 0.91, val_accuracy: 0.89 },
  { epoch: 40, loss: 0.19, val_loss: 0.23, accuracy: 0.93, val_accuracy: 0.91 },
  { epoch: 50, loss: 0.16, val_loss: 0.21, accuracy: 0.94, val_accuracy: 0.92 },
  { epoch: 60, loss: 0.14, val_loss: 0.19, accuracy: 0.95, val_accuracy: 0.93 },
  { epoch: 70, loss: 0.12, val_loss: 0.18, accuracy: 0.96, val_accuracy: 0.94 },
  { epoch: 80, loss: 0.11, val_loss: 0.17, accuracy: 0.96, val_accuracy: 0.94 },
  { epoch: 90, loss: 0.10, val_loss: 0.16, accuracy: 0.97, val_accuracy: 0.94 },
  { epoch: 100, loss: 0.09, val_loss: 0.16, accuracy: 0.97, val_accuracy: 0.94 }
]

export default function ModelPage() {
  const { t, locale, isHydrated } = useI18n();
  return (
    <AppLayout>
      <div className="space-y-8">
        {/* En-tête */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-8 w-8 text-primary glow-effect" />
            <div>
              <h1 className="text-3xl font-bold">
                {locale === 'en' ? 'AI Model - Performance' : 'Modèle d\'IA - Performance'}
              </h1>
              <p className="text-lg text-muted-foreground">
                {locale === 'en'
                  ? 'Performance metrics and analysis of the classification model'
                  : 'Métriques de performance et analyse du modèle de classification'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="default" className="glow-effect">
              <Cpu className="h-3 w-3 mr-1" />
              Gradient Boosting v1.0
            </Badge>
            <Badge variant="secondary">
              <Calendar className="h-3 w-3 mr-1" />
              {locale === 'en' ? 'Trained on' : 'Entraîné le'} {new Date(mockModelMetrics.trainedOn).toLocaleDateString(locale === 'en' ? 'en-US' : 'fr-FR')}
            </Badge>
            <Badge variant="outline">
              <Database className="h-3 w-3 mr-1" />
              {mockModelMetrics.datasetSize.toLocaleString()} {locale === 'en' ? 'samples' : 'échantillons'}
            </Badge>
          </div>
        </div>

        {/* Information sur le modèle */}
        <Alert className="border-primary/20 bg-primary/5">
          <Info className="h-4 w-4" />
          <AlertTitle>
            {locale === 'en' ? 'Gradient Boosting Model v1.0' : 'Modèle Gradient Boosting v1.0'}
          </AlertTitle>
          <AlertDescription>
            {locale === 'en'
              ? 'Algorithm: Gradient Boosting • Accuracy: 93.3% • ROC-AUC: 97.8% •'
              : 'Algorithme: Gradient Boosting • Précision: 93.3% • ROC-AUC: 97.8% •'
            } 
            {locale === 'en'
              ? '400 estimators • Max depth: 3 • Learning rate: 0.1'
              : '400 estimateurs • Profondeur max: 3 • Taux d\'apprentissage: 0.1'
            }
          </AlertDescription>
        </Alert>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="planet-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {locale === 'en' ? 'Accuracy' : 'Précision'}
              </CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {(mockModelMetrics.accuracy * 100).toFixed(1)}%
              </div>
              <Progress value={mockModelMetrics.accuracy * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {locale === 'en' ? 'Overall model accuracy' : 'Précision globale du modèle'}
              </p>
            </CardContent>
          </Card>

          <Card className="planet-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {locale === 'en' ? 'Precision' : 'Précision (Precision)'}
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">
                {(mockModelMetrics.precision * 100).toFixed(1)}%
              </div>
              <Progress value={mockModelMetrics.precision * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {locale === 'en' ? 'True positives / (TP + FP)' : 'Vrais positifs / (VP + FP)'}
              </p>
            </CardContent>
          </Card>

          <Card className="planet-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {locale === 'en' ? 'Recall' : 'Rappel (Recall)'}
              </CardTitle>
              <Activity className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-500">
                {(mockModelMetrics.recall * 100).toFixed(1)}%
              </div>
              <Progress value={mockModelMetrics.recall * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {locale === 'en' ? 'True positives / (TP + FN)' : 'Vrais positifs / (VP + FN)'}
              </p>
            </CardContent>
          </Card>

          <Card className="planet-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">F1-Score</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">
                {(mockModelMetrics.f1Score * 100).toFixed(1)}%
              </div>
              <Progress value={mockModelMetrics.f1Score * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {locale === 'en' ? 'Harmonic mean P/R' : 'Moyenne harmonique P/R'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Métriques de validation croisée */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary" />
            <span>{locale === 'en' ? 'Cross Validation (5-fold)' : 'Validation Croisée (5-fold)'}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Card className="planet-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {locale === 'en' ? 'Accuracy CV' : 'Précision CV'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-green-500">
                  92.98% ± 0.75%
                </div>
                <p className="text-xs text-muted-foreground">
                  {locale === 'en' ? 'Mean ± Std Dev' : 'Moyenne ± Écart-type'}
                </p>
              </CardContent>
            </Card>

            <Card className="planet-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Precision CV</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-blue-500">
                  90.24% ± 0.75%
                </div>
                <p className="text-xs text-muted-foreground">
                  {locale === 'en' ? 'Mean ± Std Dev' : 'Moyenne ± Écart-type'}
                </p>
              </CardContent>
            </Card>

            <Card className="planet-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Recall CV</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-purple-500">
                  92.50% ± 0.75%
                </div>
                <p className="text-xs text-muted-foreground">
                  {locale === 'en' ? 'Mean ± Std Dev' : 'Moyenne ± Écart-type'}
                </p>
              </CardContent>
            </Card>

            <Card className="planet-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">F1-Score CV</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-yellow-500">
                  91.35% ± 0.75%
                </div>
                <p className="text-xs text-muted-foreground">
                  {locale === 'en' ? 'Mean ± Std Dev' : 'Moyenne ± Écart-type'}
                </p>
              </CardContent>
            </Card>

            <Card className="planet-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">ROC-AUC CV</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-orange-500">
                  97.78% ± 0.75%
                </div>
                <p className="text-xs text-muted-foreground">
                  {locale === 'en' ? 'Mean ± Std Dev' : 'Moyenne ± Écart-type'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Onglets pour les différentes analyses */}
        <Tabs defaultValue="confusion" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="confusion">
              {locale === 'en' ? 'Confusion Matrix' : 'Matrice de Confusion'}
            </TabsTrigger>
            <TabsTrigger value="features">
              {locale === 'en' ? 'Feature Importance' : 'Importance des Caractéristiques'}
            </TabsTrigger>
          </TabsList>
          
          {/* Matrice de confusion */}
          <TabsContent value="confusion" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="planet-card">
                <CardHeader>
                  <CardTitle>
                    {locale === 'en' ? 'Confusion Matrix' : 'Matrice de Confusion'}
                  </CardTitle>
                  <CardDescription>
                    {locale === 'en' 
                      ? 'Distribution of predictions vs reality'
                      : 'Distribution des prédictions vs réalité'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ConfusionMatrixChart data={getConfusionMatrixData(locale)} width={400} height={300} />
                </CardContent>
              </Card>

              <Card className="planet-card">
                <CardHeader>
                  <CardTitle>
                    {locale === 'en' ? 'Matrix Details' : 'Détails de la Matrice'}
                  </CardTitle>
                  <CardDescription>
                    {locale === 'en' 
                      ? 'Detailed analysis of results'
                      : 'Analyse détaillée des résultats'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                      <div className="text-2xl font-bold text-green-500">
                        {mockModelMetrics.confusionMatrix.truePositive.toLocaleString()}
                      </div>
                      <p className="text-sm text-green-600">
                        {locale === 'en' ? 'True Positives' : 'Vrais Positifs'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {locale === 'en' ? 'Correctly identified exoplanets' : 'Exoplanètes correctement identifiées'}
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                      <div className="text-2xl font-bold text-red-500">
                        {mockModelMetrics.confusionMatrix.falseNegative.toLocaleString()}
                      </div>
                      <p className="text-sm text-red-600">
                        {locale === 'en' ? 'False Negatives' : 'Faux Négatifs'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {locale === 'en' ? 'Missed exoplanets' : 'Exoplanètes manquées'}
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <div className="text-2xl font-bold text-yellow-500">
                        {mockModelMetrics.confusionMatrix.falsePositive.toLocaleString()}
                      </div>
                      <p className="text-sm text-yellow-600">
                        {locale === 'en' ? 'False Positives' : 'Faux Positifs'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {locale === 'en' ? 'False detections' : 'Fausses détections'}
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <div className="text-2xl font-bold text-blue-500">
                        {mockModelMetrics.confusionMatrix.trueNegative.toLocaleString()}
                      </div>
                      <p className="text-sm text-blue-600">
                        {locale === 'en' ? 'True Negatives' : 'Vrais Négatifs'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {locale === 'en' ? 'Correct non-exoplanets' : 'Non-exoplanètes correctes'}
                      </p>
                    </div>
                  </div>
                  
                  <Alert className="border-primary/20 bg-primary/5">
                    <Info className="h-4 w-4" />
                    <AlertTitle>
                      {locale === 'en' ? 'ROC-AUC Analysis' : 'Analyse ROC-AUC'}
                    </AlertTitle>
                    <AlertDescription>
                      {locale === 'en'
                        ? `ROC-AUC Score: ${(mockModelMetrics.rocAuc * 100).toFixed(2)}% - Excellent discrimination capability`
                        : `Score ROC-AUC: ${(mockModelMetrics.rocAuc * 100).toFixed(2)}% - Excellente capacité de discrimination`
                      }
                    </AlertDescription>
                  </Alert>

                  <Alert className="border-blue-500/20 bg-blue-500/5">
                    <BarChart3 className="h-4 w-4" />
                    <AlertTitle>
                      {locale === 'en' ? 'Detailed Classification Report' : 'Rapport de Classification Détaillé'}
                    </AlertTitle>
                    <AlertDescription>
                      <pre className="text-xs whitespace-pre-wrap font-mono">
{`              precision    recall  f1-score   support

       False       0.95      0.94      0.94       818
        True       0.91      0.93      0.92       547

    accuracy                           0.93      1365
   macro avg       0.93      0.93      0.93      1365
weighted avg       0.93      0.93      0.93      1365`}
                      </pre>
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Importance des features */}
          <TabsContent value="features" className="space-y-6">
            <Card className="planet-card">
              <CardHeader>
                <CardTitle>
                  {locale === 'en' ? 'Feature Importance' : 'Importance des Caractéristiques'}
                </CardTitle>
                <CardDescription>
                  {locale === 'en'
                    ? 'Contribution of each feature to classification'
                    : 'Contribution de chaque feature à la classification'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleBarChart 
                  data={featureImportance.map(item => ({
                    name: item.feature,
                    value: item.importance,
                    color: 'hsl(var(--metric-primary))'
                  }))}
                  title=""
                  description=""
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
