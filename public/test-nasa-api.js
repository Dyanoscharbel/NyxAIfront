/**
 * Script de test simple pour vérifier l'API NASA via notre route Next.js
 * Peut être exécuté directement dans la console du navigateur
 */

// Test de l'API NASA KOI via Next.js
async function testNASAAPI() {
  console.log('🚀 Test de l\'API NASA KOI...');
  
  try {
    // Test de connexion
    console.log('1. Test de connexion...');
    const testResponse = await fetch('/api/nasa-koi?action=test');
    console.log('   Statut de connexion:', testResponse.ok ? '✅ OK' : '❌ Échec');
    
    if (!testResponse.ok) {
      console.error('   Erreur de connexion:', await testResponse.text());
      return;
    }
    
    // Test des statistiques
    console.log('2. Récupération des statistiques...');
    const statsResponse = await fetch('/api/nasa-koi?action=stats');
    
    if (statsResponse.ok) {
      const stats = await statsResponse.json();
      console.log('   ✅ Statistiques reçues:', stats);
      
      // Affichage formaté
      console.log('📊 Résumé des statistiques KOI:');
      console.log(`   • Total KOI: ${stats.totalKOI?.toLocaleString() || 'N/A'}`);
      console.log(`   • Confirmés: ${stats.confirmed?.toLocaleString() || 'N/A'}`);
      console.log(`   • Candidats: ${stats.candidates?.toLocaleString() || 'N/A'}`);
      console.log(`   • Faux Positifs: ${stats.falsePositives?.toLocaleString() || 'N/A'}`);
      console.log(`   • Dernière MAJ: ${stats.lastUpdated || 'N/A'}`);
      
    } else {
      console.error('   ❌ Erreur stats:', await statsResponse.text());
    }
    
    // Test des détails (petite pagination)
    console.log('3. Test récupération détails (5 premiers)...');
    const detailsResponse = await fetch('/api/nasa-koi?action=details&limit=5&offset=0');
    
    if (detailsResponse.ok) {
      const details = await detailsResponse.json();
      console.log('   ✅ Détails reçus:', details.length, 'entrées');
      if (details.length > 0) {
        console.log('   Premier élément:', details[0]);
      }
    } else {
      console.error('   ❌ Erreur détails:', await detailsResponse.text());
    }
    
    console.log('🎉 Test terminé avec succès !');
    return true;
    
  } catch (error) {
    console.error('❌ Erreur globale lors du test:', error);
    return false;
  }
}

// Export pour utilisation dans d'autres modules si nécessaire
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testNASAAPI };
}

// Auto-exécution si dans le navigateur
if (typeof window !== 'undefined') {
  console.log('💡 Tapez testNASAAPI() dans la console pour tester l\'API NASA');
}