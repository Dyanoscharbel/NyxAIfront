/**
 * Service pour interroger les archives NASA KOI via ADQL
 * Récupère les données KOI (Kepler Objects of Interest) directement depuis NASA Exoplanet Archive
 */

export interface KOIStats {
  totalKOI: number;
  confirmed: number;
  candidates: number;
  falsePositives: number;
  lastUpdated: string;
  cachedAt?: string;  // Quand les données ont été mises en cache
  isFromCache?: boolean; // Indique si les données viennent du cache
}

export interface KOIData {
  kepoi_name: string;
  koi_disposition: string;
  koi_pdisposition: string;
  koi_score: number;
  koi_period: number;
  koi_prad: number;
  koi_teq: number;
}

// Interface spécifique pour la page data
export interface NASAKOITableData {
  kepoi_name: string;         // KOI name
  kepler_name?: string;       // Kepler name (si confirmé)
  koi_disposition: string;    // Disposition
  koi_period: number;         // Period
  koi_prad: number;          // Radius
  koi_teq: number;           // Temperature (K)
}

export interface CacheManager {
  stats: KOIStats | null;
  details: { [key: string]: KOIData[] };
  expiry: { [key: string]: number };
}

export class NASAADQLService {
  
  // URL de notre API route Next.js qui sert de proxy
  private static readonly API_BASE_URL = '/api/nasa-koi';
  
  // Clés pour le localStorage
  private static readonly CACHE_KEYS = {
    STATS: 'nasa_koi_stats',
    DETAILS: 'nasa_koi_details',
    EXPIRY: 'nasa_koi_expiry'
  };
  
  // Durée de validité du cache (30 minutes)
  private static readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes en millisecondes
  
  /**
   * Récupère les statistiques des KOI avec système de cache intelligent
   */
  static async getKOIStats(forceRefresh: boolean = false): Promise<KOIStats> {
    try {
      // 1. Vérifier le cache s'il n'y a pas de refresh forcé
      if (!forceRefresh) {
        const cachedStats = this.getCachedStats();
        if (cachedStats && this.isCacheValid('stats')) {
          console.log('📋 Utilisation des stats en cache');
          return { ...cachedStats, isFromCache: true };
        }
      }

      console.log('🌌 Récupération des statistiques KOI depuis NASA...');
      
      const response = await fetch(`${this.API_BASE_URL}?action=stats`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        // En cas d'erreur, essayer de retourner le cache même expiré
        const cachedStats = this.getCachedStats();
        if (cachedStats) {
          console.log('⚠️ Erreur API, utilisation du cache expiré');
          return { ...cachedStats, isFromCache: true };
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error ${response.status}: ${response.statusText}`);
      }
      
      const stats = await response.json();
      
      // 2. Mettre en cache les nouvelles données
      const statsWithCache = {
        ...stats,
        cachedAt: new Date().toISOString(),
        isFromCache: false
      };
      
      this.setCachedStats(statsWithCache);
      
      console.log('✅ Statistiques KOI récupérées et mises en cache:', statsWithCache);
      return statsWithCache;
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des statistiques KOI:', error);
      
      // Essayer de retourner le cache en cas d'erreur
      const cachedStats = this.getCachedStats();
      if (cachedStats) {
        console.log('🔄 Retour au cache suite à l\'erreur');
        return { ...cachedStats, isFromCache: true };
      }
      
      throw new Error('Impossible de récupérer les données NASA KOI');
    }
  }

  /**
   * Récupère les stats en cache mais lance une actualisation en arrière-plan
   */
  static async getKOIStatsWithBackgroundRefresh(): Promise<KOIStats> {
    // 1. Récupérer le cache immédiatement si disponible
    const cachedStats = this.getCachedStats();
    
    // 2. Lancer l'actualisation en arrière-plan
    if (!this.isCacheValid('stats')) {
      console.log('🔄 Actualisation en arrière-plan...');
      // Ne pas attendre la réponse, juste lancer la requête
      this.getKOIStats(true).catch(error => {
        console.warn('⚠️ Échec de l\'actualisation en arrière-plan:', error);
      });
    }

    // 3. Retourner immédiatement le cache s'il existe
    if (cachedStats) {
      return { ...cachedStats, isFromCache: true };
    }

    // 4. Si pas de cache, faire une requête normale
    return this.getKOIStats(false);
  }

  /**
   * Méthodes de gestion du cache localStorage
   */
  private static getCachedStats(): KOIStats | null {
    try {
      if (typeof window === 'undefined') return null; // SSR safety
      
      const cached = localStorage.getItem(this.CACHE_KEYS.STATS);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.warn('⚠️ Erreur lecture cache stats:', error);
      return null;
    }
  }

  private static setCachedStats(stats: KOIStats): void {
    try {
      if (typeof window === 'undefined') return; // SSR safety
      
      localStorage.setItem(this.CACHE_KEYS.STATS, JSON.stringify(stats));
      
      // Mettre à jour l'expiration
      const expiry = Date.now() + this.CACHE_DURATION;
      const expiryData = this.getExpiryData();
      expiryData.stats = expiry;
      localStorage.setItem(this.CACHE_KEYS.EXPIRY, JSON.stringify(expiryData));
    } catch (error) {
      console.warn('⚠️ Erreur écriture cache stats:', error);
    }
  }

  private static isCacheValid(type: 'stats' | 'details'): boolean {
    try {
      if (typeof window === 'undefined') return false; // SSR safety
      
      const expiryData = this.getExpiryData();
      const expiry = expiryData[type];
      
      return expiry ? Date.now() < expiry : false;
    } catch (error) {
      console.warn('⚠️ Erreur vérification cache:', error);
      return false;
    }
  }

  private static getExpiryData(): { [key: string]: number } {
    try {
      if (typeof window === 'undefined') return {}; // SSR safety
      
      const cached = localStorage.getItem(this.CACHE_KEYS.EXPIRY);
      return cached ? JSON.parse(cached) : {};
    } catch (error) {
      console.warn('⚠️ Erreur lecture expiry:', error);
      return {};
    }
  }

  /**
   * Vide le cache (méthode publique)
   */
  static clearCache(): void {
    try {
      if (typeof window === 'undefined') return; // SSR safety
      
      localStorage.removeItem(this.CACHE_KEYS.STATS);
      localStorage.removeItem(this.CACHE_KEYS.DETAILS);
      localStorage.removeItem(this.CACHE_KEYS.EXPIRY);
      console.log('🗑️ Cache NASA KOI vidé');
    } catch (error) {
      console.warn('⚠️ Erreur vidage cache:', error);
    }
  }

  /**
   * Obtient des informations sur le cache
   */
  static getCacheInfo(): { hasCache: boolean; isExpired: boolean; cachedAt?: string } {
    const stats = this.getCachedStats();
    const isValid = this.isCacheValid('stats');
    
    return {
      hasCache: !!stats,
      isExpired: !isValid,
      cachedAt: stats?.cachedAt
    };
  }

  /**
   * Récupère les détails des KOI avec pagination
   */
  static async getKOIDetails(limit: number = 100, offset: number = 0): Promise<KOIData[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}?action=details&limit=${limit}&offset=${offset}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data as KOIData[];
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des détails KOI:', error);
      throw error;
    }
  }

  /**
   * Récupère TOUTES les données KOI pour la page data avec colonnes spécifiques
   */
  static async getKOITableData(): Promise<NASAKOITableData[]> {
    try {
      console.log(`🌌 Récupération de TOUTES les données KOI pour tableau...`);
      
      const response = await fetch(`${this.API_BASE_URL}?action=table-data`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`✅ Données KOI tableau récupérées: ${data.length} entrées`);
      return data as NASAKOITableData[];
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des données KOI tableau:', error);
      throw error;
    }
  }
  
  /**
   * Récupère les statistiques par période de découverte
   */
  static async getDiscoveryTrends(): Promise<Record<string, unknown>[]> {
    try {
      const query = `
        SELECT 
          EXTRACT(YEAR FROM koi_disposition_provenance) as year,
          koi_disposition,
          COUNT(*) as count
        FROM cumulative
        WHERE koi_disposition_provenance IS NOT NULL
        AND koi_disposition IS NOT NULL
        GROUP BY EXTRACT(YEAR FROM koi_disposition_provenance), koi_disposition
        ORDER BY year DESC
      `;
      
      return await this.executeCustomADQLQuery(query);
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des tendances:', error);
      return [];
    }
  }
  
  /**
   * Exécute une requête ADQL personnalisée via notre API Next.js
   */
  private static async executeCustomADQLQuery(query: string): Promise<Record<string, unknown>[]> {
    try {
      console.log('🔍 Requête ADQL personnalisée:', query.trim());
      
      const response = await fetch(this.API_BASE_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: query.trim() })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return Array.isArray(data) ? data : [];
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'exécution de la requête ADQL:', error);
      throw error;
    }
  }
  
  /**
   * Teste la connexion à l'API NASA
   */
  static async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE_URL}?action=test`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('❌ Test de connexion NASA échoué:', error);
      return false;
    }
  }
  
  /**
   * Récupère les informations sur la table KOI
   */
  static async getTableInfo(): Promise<Record<string, unknown>[]> {
    try {
      const query = `
        SELECT 
          column_name,
          description,
          unit,
          ucd
        FROM TAP_SCHEMA.columns
        WHERE table_name = 'cumulative'
        ORDER BY column_name
      `;
      
      return await this.executeCustomADQLQuery(query);
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des infos table:', error);
      return [];
    }
  }
}

