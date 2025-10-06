// Types for exoplanets and classification

export interface Exoplanet {
  id: string;
  name: string;
  kepid?: number;
  keplerName?: string; // Official Kepler name (for NASA data)
  
  // Orbital parameters
  period?: number; // Orbital period in days
  transitDuration?: number; // Transit duration in hours
  transitDepth?: number; // Transit depth in ppm
  
  // Physical parameters
  planetRadius?: number; // Planetary radius in Earth radii
  stellarName?: string; // Host star name
  stellarRadius?: number; // Stellar radius in solar radii
  stellarMass?: number; // Stellar mass in solar masses
  stellarTemperature?: number; // Stellar temperature in K
  stellarMagnitude?: number; // Star magnitude
  
  // Calculated parameters
  insolationFlux?: number; // Insolation flux
  equilibriumTemperature?: number; // Equilibrium temperature in K
  // Classification
  disposition: 'CONFIRMED' | 'CANDIDATE' | 'FALSE POSITIVE';
  score?: number; // Confidence score (0-1)
  
  // Metadata
  discoveryMethod?: string;
  discoveryDate?: string;
  mission: 'Kepler';
  isAiGenerated?: boolean; // Indicates if data is AI-generated
  explanation?: string; // AI-generated explanation for the classification
  
  // URL for 3D visualization (if confirmed)
  visualizationUrl?: string;
  
  // Update dates
  createdAt: string;
  updatedAt: string;
}

export interface ExoplanetFormData {
  // Orbital properties
  koi_period: number;
  koi_duration: number;
  koi_depth: number;
  koi_dor: number;

  // Planetary properties
  koi_ror: number;
  koi_prad: number;
  koi_impact: number;
  koi_teq: number;

  // Stellar properties
  koi_steff: number;
  koi_slogg: number;
  koi_srad: number;
  koi_smass: number;
  koi_srho: number;
  koi_kepmag: number;

  // Observation properties
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

// Types for statistics and metrics
export interface DashboardStats {
  totalExoplanets: number;
  confirmedExoplanets: number;
  candidateExoplanets: number;
  falsePositives: number;
  modelAccuracy: number;
  lastUpdate: string;
  
  // Statistics by mission
  missionStats: {
    kepler: number;
    k2: number;
    tess: number;
  };
  
  // Temporal trends
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

// Types for filters and search
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

// Types for charts
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