/**
 * Page de test pour vérifier la connexion à l'API NASA ADQL
 */
'use client';

import { useState } from 'react';
import { NASAADQLService, KOIStats } from '@/services/nasaADQLService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, Database, Telescope } from 'lucide-react';

export default function TestNASAPage() {
  const [testing, setTesting] = useState(false);
  const [connectionOk, setConnectionOk] = useState<boolean | null>(null);
  const [stats, setStats] = useState<KOIStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testNASAConnection = async () => {
    setTesting(true);
    setError(null);
    
    try {
      console.log('🧪 Test de connexion NASA ADQL via Next.js API...');
      
      // Test de connexion
      const isConnected = await NASAADQLService.testConnection();
      setConnectionOk(isConnected);
      
      if (isConnected) {
        // Récupération des stats avec cache
        console.log('📊 Récupération des statistiques via proxy Next.js (avec cache)...');
        const koiStats = await NASAADQLService.getKOIStatsWithBackgroundRefresh();
        setStats(koiStats);
        console.log('✅ Stats reçues via Next.js:', koiStats);
      }
      
    } catch (err) {
      console.error('❌ Erreur test NASA:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setConnectionOk(false);
    } finally {
      setTesting(false);
    }
  };

  const clearNASACache = () => {
    NASAADQLService.clearCache();
    console.log('🗑️ Cache NASA vidé');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Telescope className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Test NASA ADQL API</h1>
        </div>
        <p className="text-muted-foreground">
          Test de connexion aux archives NASA KOI (Kepler Objects of Interest)
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Connexion NASA Exoplanet Archive</span>
          </CardTitle>
          <CardDescription>
            Vérification de la connexion et récupération des statistiques KOI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Button 
              onClick={testNASAConnection} 
              disabled={testing}
              className="w-full"
            >
              {testing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Test en cours...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Tester la connexion NASA
                </>
              )}
            </Button>

            <Button 
              onClick={clearNASACache} 
              variant="outline"
              size="sm"
              className="w-full"
            >
              🗑️ Vider le cache
            </Button>
          </div>

          {/* Résultat de la connexion */}
          {connectionOk !== null && (
            <div className="flex items-center space-x-2 p-3 rounded-lg bg-secondary/50">
              {connectionOk ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Connexion NASA réussie</span>
                  <Badge variant="secondary" className="ml-auto">✅ OK</Badge>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span>Échec de la connexion</span>
                  <Badge variant="destructive" className="ml-auto">❌ Erreur</Badge>
                </>
              )}
            </div>
          )}

          {/* Affichage des erreurs */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
              <div className="flex items-center space-x-2 text-red-700 dark:text-red-300">
                <XCircle className="h-5 w-5" />
                <span className="font-medium">Erreur</span>
              </div>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
            </div>
          )}

          {/* Affichage des statistiques */}
          {stats && (
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center space-x-2">
                <Telescope className="h-4 w-4" />
                <span>Statistiques KOI</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {stats.totalKOI?.toLocaleString() || 'N/A'}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">Total KOI</div>
                </div>
                
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {stats.confirmed?.toLocaleString() || 'N/A'}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">Confirmés</div>
                </div>
                
                <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                  <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                    {stats.candidates?.toLocaleString() || 'N/A'}
                  </div>
                  <div className="text-sm text-yellow-600 dark:text-yellow-400">Candidats</div>
                </div>
                
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                  <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                    {stats.falsePositives?.toLocaleString() || 'N/A'}
                  </div>
                  <div className="text-sm text-red-600 dark:text-red-400">Faux Positifs</div>
                </div>
              </div>
              
              <div className="space-y-1 text-xs text-muted-foreground">
                <div>Dernière mise à jour: {stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleString() : 'N/A'}</div>
                {stats.cachedAt && (
                  <div>Mise en cache: {new Date(stats.cachedAt).toLocaleString()}</div>
                )}
                {stats.isFromCache && (
                  <div className="text-blue-600 dark:text-blue-400">📋 Données depuis le cache</div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}