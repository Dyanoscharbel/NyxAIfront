/**
 * API Route Next.js pour servir de proxy à l'API NASA ADQL
 * Contourne les problèmes CORS en faisant les requêtes côté serveur
 */
import { NextRequest, NextResponse } from 'next/server';

const NASA_BASE_URL = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync';

export async function GET(request: NextRequest) {
  try {
    console.log('🌌 Requête NASA KOI via proxy Next.js...');
    
    // Récupérer les paramètres de la requête
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'stats';
    
    let query = '';
    
    // Définir la requête ADQL selon l'action demandée
    switch (action) {
      case 'stats':
        query = `
          SELECT 
            koi_disposition,
            COUNT(*) as count
          FROM cumulative
          WHERE koi_disposition IS NOT NULL
          GROUP BY koi_disposition
        `;
        break;
        
      case 'details':
        const limit = parseInt(searchParams.get('limit') || '100');
        const offset = parseInt(searchParams.get('offset') || '0');
        query = `
          SELECT 
            kepoi_name,
            koi_disposition,
            koi_pdisposition,
            koi_score,
            koi_period,
            koi_prad,
            koi_teq
          FROM cumulative
          WHERE kepoi_name IS NOT NULL
          ORDER BY kepoi_name
          LIMIT ${limit}
          OFFSET ${offset}
        `;
        break;

      case 'table-data':
        console.log('📊 Récupération de TOUTES les données NASA via API REST...');
        
        // Utiliser l'API REST directe pour éviter les erreurs ADQL
        const nasaRestUrl = `https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI`;
        const restParams = new URLSearchParams({
          table: 'cumulative',
          format: 'json',
          select: 'kepoi_name,kepler_name,koi_disposition,koi_period,koi_prad,koi_teq',
          where: 'kepoi_name is not null and koi_disposition is not null',
          order: 'kepoi_name'
          // Pas de limite pour récupérer toutes les données
        });
        
        console.log('🔗 URL NASA REST:', `${nasaRestUrl}?${restParams.toString()}`);
        
        try {
          const nasaResponse = await fetch(`${nasaRestUrl}?${restParams.toString()}`, {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'Exoscope-NextJS/1.0'
            }
          });
          
          if (!nasaResponse.ok) {
            throw new Error(`Erreur NASA REST API: ${nasaResponse.status} ${nasaResponse.statusText}`);
          }
          
          const nasaData = await nasaResponse.json();
          console.log(`✅ Données REST reçues: ${Array.isArray(nasaData) ? nasaData.length : 'format non-array'} entrées`);
          
          // Retourner toutes les données, la pagination se fera côté frontend
          return NextResponse.json(nasaData, {
            status: 200,
            headers: {
              'Cache-Control': 'public, max-age=3600'
            }
          });
        } catch (error) {
          console.error('❌ Erreur REST API:', error);
          return NextResponse.json(
            { error: `Erreur lors de la récupération des données: ${error instanceof Error ? error.message : 'Erreur inconnue'}` },
            { status: 500 }
          );
        }
        
      case 'test':
        query = 'SELECT COUNT(*) as total FROM cumulative LIMIT 1';
        break;
        
      default:
        return NextResponse.json(
          { error: 'Action non supportée. Utilisez: stats, details, table-data, ou test' },
          { status: 400 }
        );
    }
    
    // Préparer les paramètres pour l'API NASA
    const params = new URLSearchParams({
      REQUEST: 'doQuery',
      LANG: 'ADQL',
      FORMAT: 'json',
      QUERY: query.trim()
    });
    
    console.log('🔍 Requête ADQL:', query.trim());
    
    // Faire la requête à l'API NASA
    const nasaResponse = await fetch(`${NASA_BASE_URL}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'ExoPlanet-AI-NextJS/1.0'
      }
    });
    
    if (!nasaResponse.ok) {
      throw new Error(`Erreur NASA API: ${nasaResponse.status} ${nasaResponse.statusText}`);
    }
    
    const nasaData = await nasaResponse.json();
    
    // Traitement spécifique pour les statistiques
    if (action === 'stats') {
      const stats = {
        totalKOI: 0,
        confirmed: 0,
        candidates: 0,
        falsePositives: 0,
        lastUpdated: new Date().toISOString()
      };
      
      // La réponse peut être dans data.data ou directement dans data
      const rows = nasaData.data || nasaData;
      
      if (Array.isArray(rows)) {
        rows.forEach((row: Record<string, unknown>) => {
          const disposition = (row.koi_disposition as string)?.toUpperCase();
          const count = parseInt((row.count as string) || '0') || 0;
          
          stats.totalKOI += count;
          
          switch (disposition) {
            case 'CONFIRMED':
              stats.confirmed = count;
              break;
            case 'CANDIDATE':
              stats.candidates = count;
              break;
            case 'FALSE POSITIVE':
              stats.falsePositives = count;
              break;
          }
        });
      }
      
      console.log('✅ Statistiques KOI traitées:', stats);
      return NextResponse.json(stats);
    }
    
    // Pour les autres actions, retourner les données brutes
    return NextResponse.json(nasaData.data || nasaData);
    
  } catch (error) {
    console.error('❌ Erreur dans le proxy NASA:', error);
    
    return NextResponse.json(
      { 
        error: 'Erreur lors de la récupération des données NASA',
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    
    if (!query) {
      return NextResponse.json(
        { error: 'Requête ADQL manquante' },
        { status: 400 }
      );
    }
    
    // Préparer les paramètres pour l'API NASA
    const params = new URLSearchParams({
      REQUEST: 'doQuery',
      LANG: 'ADQL',
      FORMAT: 'json',
      QUERY: query.trim()
    });
    
    console.log('🔍 Requête ADQL personnalisée:', query.trim());
    
    // Faire la requête à l'API NASA
    const nasaResponse = await fetch(`${NASA_BASE_URL}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Exoscope-NextJS/1.0'
      }
    });
    
    if (!nasaResponse.ok) {
      throw new Error(`Erreur NASA API: ${nasaResponse.status} ${nasaResponse.statusText}`);
    }
    
    const nasaData = await nasaResponse.json();
    return NextResponse.json(nasaData.data || nasaData);
    
  } catch (error) {
    console.error('❌ Erreur dans le proxy NASA (POST):', error);
    
    return NextResponse.json(
      { 
        error: 'Erreur lors de l\'exécution de la requête ADQL',
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}