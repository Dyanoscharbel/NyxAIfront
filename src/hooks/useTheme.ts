"use client"

import { useState, useEffect } from 'react'

type Theme = 'light' | 'dark'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Récupérer le thème depuis localStorage (le script inline l'a déjà appliqué)
    const savedTheme = localStorage.getItem('theme') as Theme || 'dark'
    setTheme(savedTheme)
  }, [])

  useEffect(() => {
    if (mounted) {
      // Sauvegarder le thème dans localStorage
      localStorage.setItem('theme', theme)
      // Appliquer le thème à l'élément HTML (au cas où il change dynamiquement)
      document.documentElement.className = theme
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  // Éviter l'hydration mismatch
  if (!mounted) {
    return { theme: 'dark', toggleTheme: () => {}, mounted: false }
  }

  return { theme, toggleTheme, mounted }
}