import React from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  gradient?: boolean
}

export function Card({ 
  children, 
  className, 
  hover = false, 
  padding = 'md',
  gradient = false 
}: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.02 } : undefined}
      transition={{ duration: 0.2 }}
      className={clsx(
        'bg-white rounded-2xl shadow-sm border border-gray-200/50',
        gradient && 'bg-gradient-to-br from-white to-gray-50/50',
        hover && 'hover:shadow-xl hover:shadow-orange-500/10 cursor-pointer',
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </motion.div>
  )
}