"use client"

import { useState, useEffect } from 'react'

type Theme = 'light' | 'dark'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Retrieve theme from localStorage (inline script has already applied it)
    const savedTheme = localStorage.getItem('theme') as Theme || 'light'
    setTheme(savedTheme)
  }, [])

  useEffect(() => {
    if (mounted) {
      // Save theme to localStorage
      localStorage.setItem('theme', theme)
      // Apply theme to HTML element (in case it changes dynamically)
      document.documentElement.className = theme
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  // Avoid hydration mismatch
  if (!mounted) {
    return { theme: 'light', toggleTheme: () => {}, mounted: false }
  }

  return { theme, toggleTheme, mounted }
}