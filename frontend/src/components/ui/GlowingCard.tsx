import React, { ReactNode } from 'react'

interface GlowingCardProps {
  children: ReactNode
  className?: string
  glowColor?: string
  intensity?: 'low' | 'medium' | 'high'
}

export function GlowingCard({ 
  children, 
  className = '', 
  glowColor = 'primary', 
  intensity = 'medium' 
}: GlowingCardProps) {
  const intensityClasses = {
    low: 'shadow-lg hover:shadow-xl',
    medium: 'shadow-lg hover:shadow-2xl hover:shadow-primary-500/20',
    high: 'shadow-xl hover:shadow-2xl hover:shadow-primary-500/30',
  }

  const glowClasses = {
    primary: 'hover:shadow-primary-500/20',
    secondary: 'hover:shadow-secondary-500/20',
    success: 'hover:shadow-green-500/20',
    warning: 'hover:shadow-yellow-500/20',
    error: 'hover:shadow-red-500/20',
  }

  return (
    <div 
      className={`
        card transition-all duration-500 ease-out transform hover:-translate-y-2
        ${intensityClasses[intensity]} 
        ${glowClasses[glowColor as keyof typeof glowClasses]} 
        ${className}
      `}
    >
      {children}
    </div>
  )
}