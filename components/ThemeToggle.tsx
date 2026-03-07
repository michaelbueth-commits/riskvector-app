'use client'

import { useState, useEffect } from 'react'

type Theme = 'dark' | 'light' | 'system'

interface ThemeToggleProps {
  className?: string
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>('system')
  const [isOpen, setIsOpen] = useState(false)
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark')

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as Theme) || 'system'
    setTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])

  // Apply theme to document
  const applyTheme = (newTheme: Theme) => {
    let effectiveTheme: 'dark' | 'light'
    
    if (newTheme === 'system') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } else {
      effectiveTheme = newTheme
    }
    
    setResolvedTheme(effectiveTheme)
    
    // Apply to document
    document.documentElement.setAttribute('data-theme', effectiveTheme)
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(effectiveTheme)
    
    // Update CSS variables for light theme
    if (effectiveTheme === 'light') {
      document.documentElement.style.setProperty('--bg-primary', '#FFFFFF')
      document.documentElement.style.setProperty('--bg-secondary', '#F8FAFC')
      document.documentElement.style.setProperty('--bg-tertiary', '#F1F5F9')
      document.documentElement.style.setProperty('--bg-elevated', '#FFFFFF')
      document.documentElement.style.setProperty('--text-primary', '#0F172A')
      document.documentElement.style.setProperty('--text-secondary', 'rgba(15, 23, 42, 0.7)')
      document.documentElement.style.setProperty('--text-tertiary', 'rgba(15, 23, 42, 0.5)')
      document.documentElement.style.setProperty('--border-color', 'rgba(0, 0, 0, 0.1)')
      document.documentElement.style.setProperty('--border-hover', 'rgba(0, 0, 0, 0.2)')
      document.documentElement.style.setProperty('--glass-bg', 'rgba(0, 0, 0, 0.02)')
      document.documentElement.style.setProperty('--glass-border', 'rgba(0, 0, 0, 0.08)')
    } else {
      document.documentElement.style.setProperty('--bg-primary', '#0A0A0B')
      document.documentElement.style.setProperty('--bg-secondary', '#111113')
      document.documentElement.style.setProperty('--bg-tertiary', '#18181B')
      document.documentElement.style.setProperty('--bg-elevated', '#1F1F23')
      document.documentElement.style.setProperty('--text-primary', '#FAFAFA')
      document.documentElement.style.setProperty('--text-secondary', 'rgba(250, 250, 250, 0.7)')
      document.documentElement.style.setProperty('--text-tertiary', 'rgba(250, 250, 250, 0.5)')
      document.documentElement.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.1)')
      document.documentElement.style.setProperty('--border-hover', 'rgba(255, 255, 255, 0.2)')
      document.documentElement.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.03)')
      document.documentElement.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.08)')
    }
  }

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system')
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  // Handle theme change
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
    setIsOpen(false)
  }

  const themeOptions: { value: Theme; label: string; icon: string }[] = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'system', label: 'System', icon: '💻' },
  ]

  const currentIcon = theme === 'system' 
    ? (resolvedTheme === 'dark' ? '🌙' : '☀️')
    : themeOptions.find(t => t.value === theme)?.icon || '🌙'

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
        aria-label="Toggle theme"
      >
        <span className="text-lg transition-transform duration-300 hover:rotate-12">
          {currentIcon}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 z-50 min-w-[160px] bg-[#18181B] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="py-2">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleThemeChange(option.value)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors
                    ${theme === option.value 
                      ? 'bg-amber-500/10 text-amber-400' 
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }
                  `}
                >
                  <span className="text-xl">{option.icon}</span>
                  <span className="font-medium flex-1">{option.label}</span>
                  {theme === option.value && (
                    <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            
            <div className="border-t border-white/10 p-3">
              <p className="text-xs text-gray-500 text-center">
                {theme === 'system' 
                  ? `Using ${resolvedTheme} mode` 
                  : 'Theme preference saved'
                }
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
