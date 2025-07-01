import React from 'react'
import { clsx } from 'clsx'
import { CampaignStatus } from '../../types'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Badge({ children, variant = 'primary', size = 'md', className }: BadgeProps) {
  const baseClasses = 'inline-flex items-center font-medium rounded-full'
  
  const variants = {
    primary: 'bg-orange-100 text-orange-800 border border-orange-200',
    secondary: 'bg-blue-100 text-blue-800 border border-blue-200',
    success: 'bg-green-100 text-green-800 border border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    danger: 'bg-red-100 text-red-800 border border-red-200',
    info: 'bg-gray-100 text-gray-800 border border-gray-200'
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base'
  }

  return (
    <span className={clsx(baseClasses, variants[variant], sizes[size], className)}>
      {children}
    </span>
  )
}

interface StatusBadgeProps {
  status: CampaignStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = (status: CampaignStatus) => {
    switch (status) {
      case CampaignStatus.ACTIVE:
        return { label: 'Active', variant: 'success' as const }
      case CampaignStatus.SUCCESSFUL:
        return { label: 'Successful', variant: 'primary' as const }
      case CampaignStatus.FAILED:
        return { label: 'Failed', variant: 'danger' as const }
      case CampaignStatus.CANCELLED:
        return { label: 'Cancelled', variant: 'info' as const }
      default:
        return { label: 'Unknown', variant: 'info' as const }
    }
  }

  const config = getStatusConfig(status)

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  )
}