/**
 * Service for querying NASA KOI archives via ADQL
 * Retrieves KOI (Kepler Objects of Interest) data directly from NASA Exoplanet Archive
 */

export interface KOIStats {
  totalKOI: number;
  confirmed: number;
  candidates: number;
  falsePositives: number;
  lastUpdated: string;
  cachedAt?: string;  // When data was cached
  isFromCache?: boolean; // Indicates if data comes from cache
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

// Specific interface for data page
export interface NASAKOITableData {
  kepoi_name: string;         // KOI name
  kepler_name?: string;       // Kepler name (if confirmed)
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
  
  // URL of our Next.js API route that serves as proxy
  private static readonly API_BASE_URL = '/api/nasa-koi';
  
  // Keys for localStorage
  private static readonly CACHE_KEYS = {
    STATS: 'nasa_koi_stats',
    DETAILS: 'nasa_koi_details',
    EXPIRY: 'nasa_koi_expiry'
  };
  
  // Cache validity duration (30 minutes)
  private static readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
  
  /**
   * Retrieves KOI statistics with intelligent cache system
   */
  static async getKOIStats(forceRefresh: boolean = false): Promise<KOIStats> {
    try {
      // 1. Check cache if no forced refresh
      if (!forceRefresh) {
        const cachedStats = this.getCachedStats();
        if (cachedStats && this.isCacheValid('stats')) {
          console.log('📋 Using cached stats');
          return { ...cachedStats, isFromCache: true };
        }
      }

      console.log('🌌 Retrieving KOI statistics from NASA...');
      
      const response = await fetch(`${this.API_BASE_URL}?action=stats`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        // In case of error, try to return expired cache
        const cachedStats = this.getCachedStats();
        if (cachedStats) {
          console.log('⚠️ API Error, using expired cache');
          return { ...cachedStats, isFromCache: true };
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error ${response.status}: ${response.statusText}`);
      }
      
      const stats = await response.json();
      
      // 2. Cache new data
      const statsWithCache = {
        ...stats,
        cachedAt: new Date().toISOString(),
        isFromCache: false
      };
      
      this.setCachedStats(statsWithCache);
      
      console.log('✅ Statistiques KOI récupérées et mises en cache:', statsWithCache);
      return statsWithCache;
      
    } catch (error) {
      console.error('❌ Error retrieving KOI statistics:', error);
      
      // Try to return cache in case of error
      const cachedStats = this.getCachedStats();
      if (cachedStats) {
        console.log('🔄 Fallback to cache due to error');
        return { ...cachedStats, isFromCache: true };
      }
      
      throw new Error('Unable to retrieve NASA KOI data');
    }
  }

  /**
   * Retrieve cached stats but launch background refresh
   */
  static async getKOIStatsWithBackgroundRefresh(): Promise<KOIStats> {
    // 1. Retrieve cache immediately if available
    const cachedStats = this.getCachedStats();
    
    // 2. Launch background refresh
    if (!this.isCacheValid('stats')) {
      console.log('🔄 Background refresh...');
      // Don't wait for response, just launch the request
      this.getKOIStats(true).catch(error => {
        console.warn('⚠️ Background refresh failed:', error);
      });
    }

    // 3. Return cache immediately if it exists
    if (cachedStats) {
      return { ...cachedStats, isFromCache: true };
    }

    // 4. If no cache, make normal request
    return this.getKOIStats(false);
  }

  /**
   * localStorage cache management methods
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
      
      // Update expiration
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
   * Retrieves KOI details with pagination
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
      console.error('❌ Error retrieving KOI details:', error);
      throw error;
    }
  }

  /**
   * Retrieves ALL KOI data for the data page with specific columns
   */
  static async getKOITableData(): Promise<NASAKOITableData[]> {
    try {
      console.log(`🌌 Retrieving ALL KOI data for table...`);
      
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
      console.log(`✅ KOI table data retrieved: ${data.length} entries`);
      return data as NASAKOITableData[];
      
    } catch (error) {
      console.error('❌ Error retrieving KOI table data:', error);
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
      console.error('❌ Error retrieving trends:', error);
      return [];
    }
  }
  
  /**
   * Executes a custom ADQL query via our Next.js API
   */
  private static async executeCustomADQLQuery(query: string): Promise<Record<string, unknown>[]> {
    try {
      console.log('🔍 Custom ADQL query:', query.trim());
      
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
      console.error('❌ Error retrieving table info:', error);
      return [];
    }
  }
}

