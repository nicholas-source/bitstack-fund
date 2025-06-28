import React from 'react'

interface ProgressBarProps {
  current: number
  target: number
  className?: string
  showPercentage?: boolean
}

export function ProgressBar({ current, target, className = '', showPercentage = true }: ProgressBarProps) {
  const percentage = Math.min((current / target) * 100, 100)

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <div className="flex justify-between text-sm text-gray-600">
          <span>{percentage.toFixed(1)}% funded</span>
          <span>{current.toLocaleString()} / {target.toLocaleString()} STX</span>
        </div>
      )}
    </div>
  )
}