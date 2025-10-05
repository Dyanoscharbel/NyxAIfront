// Modern i18n system with instant language switching
export const locales = {
  en: {
    // Navigation
    nav: {
      dashboard: "Dashboard",
      classification: "Classification", 
      data: "Explore Data",
      model: "Model"
    },
    
    // Home page
    home: {
      title: "Explore the cosmos with revolutionary AI",
      subtitle: "Discover the universe of exoplanets with cutting-edge AI technology and comprehensive data analysis.",
      cta: {
        start: "Get Started",
        explore: "Explore Data"
      },
      badge: "Space exploration platform",
      features: {
        title: "Powerful features for space discovery",
        subtitle: "Our platform combines advanced AI algorithms with comprehensive exoplanet data to provide unprecedented insights in space exploration.",
        aiClassification: {
          title: "AI Classification",
          desc: "Advanced machine learning models to classify exoplanets based on their characteristics and habitability potential."
        },
        dataAnalysis: {
          title: "Data Analysis", 
          desc: "Comprehensive analysis tools to explore exoplanet datasets and discover patterns."
        },
        realTimeMonitoring: {
          title: "Real-time Monitoring",
          desc: "Stay informed about the latest exoplanet discoveries and space missions."
        },
        collaboration: {
          title: "Collaborative Research",
          desc: "Connect with researchers worldwide and share discoveries in our collaborative environment."
        }
      },
      capabilities: {
        title: "Advanced Capabilities",
        subtitle: "Leverage cutting-edge technology to unlock the mysteries of space exploration.",
        database: {
          title: "Comprehensive Database",
          desc: "Access to thousands of confirmed exoplanets with detailed characteristics and orbital parameters."
        },
        speed: {
          title: "Ultra Fast",
          desc: "Optimized algorithms providing instant results for complex astronomical calculations and predictions."
        },
        reliability: {
          title: "Reliable and Accurate", 
          desc: "Based on verified astronomical data with rigorous validation processes ensuring scientific accuracy."
        }
      },
      cta2: {
        title: "Ready to explore the universe?",
        subtitle: "Join thousands of researchers, astronomers, and space enthusiasts in discovering the wonders of exoplanets.",
        explore: "Start Exploration",
        tryAi: "Try AI Classification"
      }
    },

    // Footer
    footer: {
      description: "Advanced AI platform for exoplanet discovery and analysis. Exploring the cosmos with cutting-edge technology and comprehensive data.",
      badges: {
        ai: "AI Powered",
        realtime: "Real-time Data", 
        research: "Research Grade"
      },
      features: "Features",
      resources: "Resources",
      links: {
        documentation: "Documentation",
        api: "API Reference",
        papers: "Research Papers",
        community: "Community"
      },
      copyright: "NASA Kepler Data. Designed for space exploration and discovery."
    },

    // Dashboard
    dashboard: {
      title: "Dashboard",
      stats: {
        total: "Total Exoplanets",
        confirmed: "Confirmed",
        candidates: "Candidates", 
        falsePositives: "False Positives",
        accuracy: "Model Accuracy",
        lastUpdate: "Last Update"
      }
    },

    // Classification
    classification: {
      title: "AI Exoplanet Classification",
      subtitle: "Use our advanced AI model to classify exoplanets",
      form: {
        orbital: "Orbital Properties",
        planetary: "Planetary Properties",
        stellar: "Stellar Properties", 
        observational: "Observational Data"
      },
      tooltips: {
        period: "Orbital period in days between two successive transits of the planet around its star.",
        duration: "Average transit duration (in hours) — how long the planet passes in front of its star.",
        depth: "Transit depth (in ppm) — corresponds to the brightness drop observed during the planet's passage.",
        ror: "Ratio of planetary radius to stellar radius (Rp/R*).",
        prad: "Estimated planet radius (in Earth radii).",
        impact: "Impact parameter — minimum distance between planet and star centers during transit (in stellar radius units).",
        teq: "Estimated equilibrium temperature of the planet (in Kelvin), assuming zero albedo.",
        dor: "Ratio between orbital distance and stellar radius (a/R*).",
        steff: "Effective temperature of the host star (in Kelvin).",
        slogg: "Surface gravity of the star (log10(cm/s²)).",
        srad: "Host star radius (in solar radii).",
        smass: "Host star mass (in solar masses).",
        srho: "Average density of the host star (in g/cm³).",
        kepmag: "Kepler magnitude — apparent brightness of the star observed by Kepler.",
        snr: "Signal-to-noise ratio of the transit model — indicates the quality of the observed signal.",
        transits: "Total number of transits observed for this object by the Kepler mission.",
        singleEv: "Maximum signal-to-noise of a single detected transit event.",
        multEv: "Maximum signal-to-noise for multiple detected transit events (repeated transits)."
      }
    },

    // Model
    model: {
      title: "AI Model - Performance",
      subtitle: "Performance metrics and analysis of the classification model",
      trainedOn: "Trained on",
      samples: "samples",
      algorithm: "Algorithm",
      estimators: "estimators",
      maxDepth: "Max depth",
      learningRate: "Learning rate",
      accuracy: "Accuracy",
      precision: "Precision",
      recall: "Recall",
      f1Score: "F1-Score",
      rocAuc: "ROC-AUC",
      overallAccuracy: "Overall model accuracy",
      truePosFormula: "True positives / (TP + FP)",
      recallFormula: "True positives / (TP + FN)",
      harmonicMean: "Harmonic mean P/R",
      crossValidation: "Cross Validation (5-fold)",
      accuracyCV: "Accuracy CV",
      precisionCV: "Precision CV",
      recallCV: "Recall CV",
      f1ScoreCV: "F1-Score CV",
      rocAucCV: "ROC-AUC CV",
      meanStdDev: "Mean ± Std Dev",
      confusionMatrix: {
        title: "Confusion Matrix",
        description: "Distribution of predictions vs reality",
        truePositives: "True Positives",
        falsePositives: "False Positives",
        trueNegatives: "True Negatives",
        falseNegatives: "False Negatives",
        correctlyIdentified: "Correctly identified exoplanets",
        missedExoplanets: "Missed exoplanets",
        falseDetections: "False detections",
        correctNonExoplanets: "Correct non-exoplanets"
      },
      matrixDetails: {
        title: "Matrix Details",
        description: "Detailed analysis of results"
      },
      rocAucAnalysis: {
        title: "ROC-AUC Analysis",
        description: "ROC-AUC Score: {score}% - Excellent discrimination capability"
      },
      classificationReport: {
        title: "Detailed Classification Report"
      },
      featureImportance: {
        title: "Feature Importance",
        description: "Contribution of each feature to classification"
      }
    },

    // Common
    common: {
      loading: "Loading...",
      error: "Error",
      save: "Save",
      cancel: "Cancel",
      next: "Next",
      previous: "Previous",
      submit: "Submit",
      reset: "Reset"
    }
  },

  fr: {
    // Navigation
    nav: {
      dashboard: "Tableau de bord",
      classification: "Classification",
      data: "Explorer les données",
      model: "Modèle"
    },
    
    // Home page
    home: {
      title: "Explorez le cosmos avec l'IA révolutionnaire",
      subtitle: "Découvrez l'univers des exoplanètes avec une technologie IA de pointe et une analyse de données complète.",
      cta: {
        start: "Commencer",
        explore: "Explorer les données"
      },
      badge: "Plateforme d'exploration spatiale",
      features: {
        title: "Fonctionnalités puissantes pour la découverte spatiale",
        subtitle: "Notre plateforme combine des algorithmes IA avancés avec des données d'exoplanètes complètes pour fournir des insights sans précédent dans l'exploration spatiale.",
        aiClassification: {
          title: "Classification IA",
          desc: "Modèles d'apprentissage automatique avancés pour classifier les exoplanètes selon leurs caractéristiques et potentiel d'habitabilité."
        },
        dataAnalysis: {
          title: "Analyse de données",
          desc: "Outils d'analyse complets pour explorer les jeux de données d'exoplanètes et découvrir des modèles."
        },
        realTimeMonitoring: {
          title: "Surveillance en temps réel",
          desc: "Restez informé des dernières découvertes d'exoplanètes et missions spatiales."
        },
        collaboration: {
          title: "Recherche collaborative",
          desc: "Connectez-vous avec des chercheurs du monde entier et partagez des découvertes dans notre environnement collaboratif."
        }
      },
      capabilities: {
        title: "Capacités avancées",
        subtitle: "Exploitez une technologie de pointe pour percer les mystères de l'exploration spatiale.",
        database: {
          title: "Base de données complète",
          desc: "Accès à des milliers d'exoplanètes confirmées avec des caractéristiques détaillées et paramètres orbitaux."
        },
        speed: {
          title: "Ultra rapide",
          desc: "Algorithmes optimisés fournissant des résultats instantanés pour des calculs astronomiques complexes et prédictions."
        },
        reliability: {
          title: "Fiable et précis",
          desc: "Basé sur des données astronomiques vérifiées avec des processus de validation rigoureux garantissant la précision scientifique."
        }
      },
      cta2: {
        title: "Prêt à explorer l'univers ?",
        subtitle: "Rejoignez des milliers de chercheurs, astronomes et passionnés d'espace dans la découverte des merveilles des exoplanètes.",
        explore: "Commencer l'exploration",
        tryAi: "Essayer la classification IA"
      }
    },

    // Footer
    footer: {
      description: "Plateforme IA avancée pour la découverte et l'analyse d'exoplanètes. Explorant le cosmos avec une technologie de pointe et des données complètes.",
      badges: {
        ai: "Propulsé par l'IA",
        realtime: "Données temps réel",
        research: "Niveau recherche"
      },
      features: "Fonctionnalités",
      resources: "Ressources",
      links: {
        documentation: "Documentation",
        api: "Référence API",
        papers: "Articles de recherche",
        community: "Communauté"
      },
      copyright: "Données NASA Kepler. Conçu pour l'exploration et la découverte spatiale."
    },

    // Dashboard
    dashboard: {
      title: "Tableau de bord",
      stats: {
        total: "Total Exoplanètes",
        confirmed: "Confirmées",
        candidates: "Candidates",
        falsePositives: "Faux Positifs",
        accuracy: "Précision du modèle",
        lastUpdate: "Dernière mise à jour"
      }
    },

    // Classification
    classification: {
      title: "Classification IA d'Exoplanètes",
      subtitle: "Utilisez notre modèle d'IA avancé pour classifier les exoplanètes",
      form: {
        orbital: "Propriétés orbitales",
        planetary: "Propriétés planétaires",
        stellar: "Propriétés stellaires",
        observational: "Données observationnelles"
      },
      tooltips: {
        period: "Période orbitale en jours entre deux transits successifs de la planète autour de son étoile.",
        duration: "Durée moyenne du transit (en heures) — combien de temps la planète passe devant son étoile.",
        depth: "Profondeur du transit (en ppm) — correspond à la baisse de luminosité observée pendant le passage de la planète.",
        ror: "Rapport du rayon planétaire au rayon stellaire (Rp/R*).",
        prad: "Rayon estimé de la planète (en rayons terrestres).",
        impact: "Paramètre d'impact — distance minimale entre le centre de la planète et celui de l'étoile pendant le transit (en unités de rayon stellaire).",
        teq: "Température d'équilibre estimée de la planète (en Kelvin), supposant un albédo nul.",
        dor: "Rapport entre la distance orbitale et le rayon stellaire (a/R*).",
        steff: "Température effective de l'étoile hôte (en Kelvin).",
        slogg: "Gravité de surface de l'étoile (log10(cm/s²)).",
        srad: "Rayon de l'étoile hôte (en rayons solaires).",
        smass: "Masse de l'étoile hôte (en masses solaires).",
        srho: "Densité moyenne de l'étoile hôte (en g/cm³).",
        kepmag: "Magnitude Kepler — luminosité apparente de l'étoile observée par Kepler.",
        snr: "Rapport signal/bruit du modèle de transit — indique la qualité du signal observé.",
        transits: "Nombre total de transits observés pour cet objet par la mission Kepler.",
        singleEv: "Signal-to-noise maximal d'un seul événement de transit détecté.",
        multEv: "Signal-to-noise maximal pour plusieurs événements de transit détectés (transits répétés)."
      }
    },

    // Model
    model: {
      title: "Modèle d'IA - Performance",
      subtitle: "Métriques de performance et analyse du modèle de classification",
      trainedOn: "Entraîné le",
      samples: "échantillons",
      algorithm: "Algorithme",
      estimators: "estimateurs",
      maxDepth: "Profondeur max",
      learningRate: "Taux d'apprentissage",
      accuracy: "Précision",
      precision: "Précision (Precision)",
      recall: "Rappel (Recall)",
      f1Score: "F1-Score",
      rocAuc: "ROC-AUC",
      overallAccuracy: "Précision globale du modèle",
      truePosFormula: "Vrais positifs / (VP + FP)",
      recallFormula: "Vrais positifs / (VP + FN)",
      harmonicMean: "Moyenne harmonique P/R",
      crossValidation: "Validation Croisée (5-fold)",
      accuracyCV: "Précision CV",
      precisionCV: "Precision CV",
      recallCV: "Recall CV",
      f1ScoreCV: "F1-Score CV",
      rocAucCV: "ROC-AUC CV",
      meanStdDev: "Moyenne ± Écart-type",
      confusionMatrix: {
        title: "Matrice de Confusion",
        description: "Distribution des prédictions vs réalité",
        truePositives: "Vrais Positifs",
        falsePositives: "Faux Positifs",
        trueNegatives: "Vrais Négatifs",
        falseNegatives: "Faux Négatifs",
        correctlyIdentified: "Exoplanètes correctement identifiées",
        missedExoplanets: "Exoplanètes manquées",
        falseDetections: "Fausses détections",
        correctNonExoplanets: "Non-exoplanètes correctes"
      },
      matrixDetails: {
        title: "Détails de la Matrice",
        description: "Analyse détaillée des résultats"
      },
      rocAucAnalysis: {
        title: "Analyse ROC-AUC",
        description: "Score ROC-AUC: {score}% - Excellente capacité de discrimination"
      },
      classificationReport: {
        title: "Rapport de Classification Détaillé"
      },
      featureImportance: {
        title: "Importance des Caractéristiques",
        description: "Contribution de chaque feature à la classification"
      }
    },

    // Common
    common: {
      loading: "Chargement...",
      error: "Erreur",
      save: "Enregistrer",
      cancel: "Annuler",
      next: "Suivant",
      previous: "Précédent",
      submit: "Soumettre",
      reset: "Réinitialiser"
    }
  }
} as const;

export type Locale = keyof typeof locales;
export type TranslationKeys = keyof typeof locales.en;
