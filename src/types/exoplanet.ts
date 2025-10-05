// Types pour les exoplanètes et la classification

export interface Exoplanet {
  id: string;
  name: string;
  kepid?: number;
  keplerName?: string; // Nom Kepler officiel (pour données NASA)
  
  // Paramètres orbitaux
  period?: number; // Période orbitale en jours
  transitDuration?: number; // Durée de transit en heures
  transitDepth?: number; // Profondeur de transit en ppm
  
  // Paramètres physiques
  planetRadius?: number; // Rayon planétaire en rayons terrestres
  stellarName?: string; // Nom de l'étoile hôte
  stellarRadius?: number; // Rayon stellaire en rayons solaires
  stellarMass?: number; // Masse stellaire en masses solaires
  stellarTemperature?: number; // Température stellaire en K
  stellarMagnitude?: number; // Magnitude de l'étoile
  
  // Paramètres calculés
  insolationFlux?: number; // Flux d'insolation
  equilibriumTemperature?: number; // Température d'équilibre en K
  // Classification
  disposition: 'CONFIRMED' | 'CANDIDATE' | 'FALSE POSITIVE';
  score?: number; // Score de confiance (0-1)
  
  // Métadonnées
  discoveryMethod?: string;
  discoveryDate?: string;
  mission: 'Kepler';
  isAiGenerated?: boolean; // Indique si les données sont générées par l'IA
  
  // URL pour la visualisation 3D (si confirmée)
  visualizationUrl?: string;
  
  // Dates de mise à jour
  createdAt: string;
  updatedAt: string;
}

export interface ExoplanetFormData {
  // Propriétés orbitales
  koi_period: number;
  koi_duration: number;
  koi_depth: number;
  koi_dor: number;

  // Propriétés planétaires
  koi_ror: number;
  koi_prad: number;
  koi_impact: number;
  koi_teq: number;

  // Propriétés stellaires
  koi_steff: number;
  koi_slogg: number;
  koi_srad: number;
  koi_smass: number;
  koi_srho: number;
  koi_kepmag: number;

  // Propriétés d'observation
  koi_model_snr: number;
  koi_num_transits: number;
  koi_max_sngle_ev: number;
  koi_max_mult_ev: number;
}

// Individual contribution (e.g., SHAP) from the model explaining the prediction
export interface Contribution {
  feature?: string;
  value?: number | string | null;
  contribution?: number | null;
  abs_contribution?: number | null;
  [key: string]: unknown;
}

export interface ClassificationResult {
  id?: string;
  prediction: 'CONFIRMED' | 'CANDIDATE' | 'FALSE POSITIVE';
  probability: number;
  base_value: number | null;
  // contributions from the model (may be SHAP-like objects)
  contributions: Contribution[];
  // human-readable explanation provided by the model/API
  explanation?: string;
  feature_names: string[];
  processingTime?: number;
  modelVersion?: string;
  createdAt?: string;
}

export interface BatchClassificationRequest {
  data: ExoplanetFormData[];
  format: 'csv' | 'json';
  filename: string;
}

export interface BatchClassificationResult {
  jobId: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'ERROR';
  results?: ClassificationResult[];
  totalProcessed: number;
  errorCount: number;
  errors?: string[];
  processingTime?: number;
  createdAt: string;
  completedAt?: string;
}

// Types pour les statistiques et métriques
export interface DashboardStats {
  totalExoplanets: number;
  confirmedExoplanets: number;
  candidateExoplanets: number;
  falsePositives: number;
  modelAccuracy: number;
  lastUpdate: string;
  
  // Statistiques par mission
  missionStats: {
    kepler: number;
    k2: number;
    tess: number;
  };
  
  // Tendances temporelles
  monthlyDiscoveries: {
    month: string;
    confirmed: number;
    candidates: number;
  }[];
}

export interface ModelMetrics {
  version: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: {
    truePositive: number;
    falsePositive: number;
    trueNegative: number;
    falseNegative: number;
  };
  rocAuc: number;
  trainedOn: string;
  datasetSize: number;
  features: string[];
  hyperparameters: {
    [key: string]: string | number | boolean | null | undefined;
  };
}

// Types pour les filtres et recherche
export interface ExoplanetFilters {
  disposition?: ('CONFIRMED' | 'CANDIDATE' | 'FALSE POSITIVE')[];
  mission?: ('Kepler')[];
  isAiGenerated?: boolean;
  periodRange?: [number, number];
  radiusRange?: [number, number];
  temperatureRange?: [number, number];
  scoreRange?: [number, number];
  searchQuery?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: keyof Exoplanet;
  sortOrder?: 'asc' | 'desc';
}

export interface ExoplanetResponse {
  data: Exoplanet[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  filters: ExoplanetFilters;
}

// Types pour les graphiques
export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface DistributionChartData {
  disposition: ChartDataPoint[];
  mission: ChartDataPoint[];
  radiusDistribution: {
    range: string;
    count: number;
  }[];
  temperatureDistribution: {
    range: string;
    count: number;
  }[];
}