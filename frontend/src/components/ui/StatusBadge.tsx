import React from 'react'
import { CampaignStatus } from '../../types/campaign'

interface StatusBadgeProps {
  status: CampaignStatus
  className?: string
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const getStatusConfig = (status: CampaignStatus) => {
    switch (status) {
      case CampaignStatus.ACTIVE:
        return {
          label: 'Active',
          className: 'bg-green-100 text-green-800 border-green-200',
        }
      case CampaignStatus.SUCCESSFUL:
        return {
          label: 'Successful',
          className: 'bg-blue-100 text-blue-800 border-blue-200',
        }
      case CampaignStatus.FAILED:
        return {
          label: 'Failed',
          className: 'bg-red-100 text-red-800 border-red-200',
        }
      case CampaignStatus.CANCELLED:
        return {
          label: 'Cancelled',
          className: 'bg-gray-100 text-gray-800 border-gray-200',
        }
      default:
        return {
          label: 'Unknown',
          className: 'bg-gray-100 text-gray-800 border-gray-200',
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className} ${className}`}>
      {config.label}
    </span>
  )
}