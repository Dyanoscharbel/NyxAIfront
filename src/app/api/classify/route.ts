import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Récupérer les données du formulaire
    const body = await request.json()
    
    console.log('🚀 Proxy API - Données reçues:', body)
    
    // URL de l'API de classification
    const classificationApiUrl = process.env.NEXT_PUBLIC_CLASSIFICATION_API_URL || 'http://127.0.0.1:8000'
    
    // Faire l'appel vers l'API de classification depuis le serveur (pas de problème CORS)
    const response = await fetch(`${classificationApiUrl}/api/infer?explain=true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body)
    })
    
    if (!response.ok) {
      console.error('❌ Erreur API de classification:', response.status, response.statusText)
      throw new Error(`API Error: ${response.status} - ${response.statusText}`)
    }
    
    const result = await response.json()
    console.log('✅ Réponse de l\'API de classification:', result)
    
    // Retourner la réponse au frontend
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('❌ Erreur dans le proxy de classification:', error)
    
    // Retourner une erreur appropriée
    return NextResponse.json(
      { 
        error: 'Classification failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        // Fallback data pour les tests
        prediction: 'CANDIDATE',
        probability: 0.75,
        base_value: null,
        contributions: [],
        feature_names: [
          'koi_period', 'koi_duration', 'koi_depth', 'koi_ror', 'koi_prad', 'koi_impact',
          'koi_teq', 'koi_dor', 'koi_steff', 'koi_slogg', 'koi_srad', 'koi_smass', 'koi_srho',
          'koi_kepmag', 'koi_model_snr', 'koi_num_transits', 'koi_max_sngle_ev', 'koi_max_mult_ev'
        ]
      },
      { status: 500 }
    )
  }
}

// Gérer les requêtes OPTIONS pour CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
    },
  })
}