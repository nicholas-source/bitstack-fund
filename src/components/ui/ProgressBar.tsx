import React from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

interface ProgressBarProps {
  value: number
  max: number
  className?: string
  showPercentage?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
}

export function ProgressBar({ 
  value, 
  max, 
  className, 
  showPercentage = true,
  size = 'md',
  color = 'primary'
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  }
  
  const colorClasses = {
    primary: 'from-orange-500 to-orange-600',
    secondary: 'from-blue-500 to-blue-600',
    success: 'from-green-500 to-green-600',
    warning: 'from-yellow-500 to-yellow-600',
    danger: 'from-red-500 to-red-600'
  }

  return (
    <div className={clsx('space-y-2', className)}>
      <div className={clsx(
        'w-full bg-gray-200 rounded-full overflow-hidden',
        sizeClasses[size]
      )}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={clsx(
            'h-full bg-gradient-to-r rounded-full',
            colorClasses[color]
          )}
        />
      </div>
      {showPercentage && (
        <div className="flex justify-between text-sm text-gray-600">
          <span>{percentage.toFixed(1)}% funded</span>
          <span>{value.toLocaleString()} / {max.toLocaleString()}</span>
        </div>
      )}
    </div>
  )
}