import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Target, Users } from 'lucide-react'
import { Campaign } from '../../types/campaign'
import { ProgressBar } from '../ui/ProgressBar'
import { StatusBadge } from '../ui/StatusBadge'
import { formatSTX } from '../../utils/stacks'
import { formatDistanceToNow } from 'date-fns'

interface CampaignCardProps {
  campaign: Campaign
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const progress = (campaign.raised / campaign.goal) * 100
  const daysLeft = Math.max(0, campaign.deadlineHeight - 1000) // Mock current block height
  
  return (
    <Link to={`/campaigns/${campaign.id}`} className="block group">
      <div className="card hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200 line-clamp-2">
            {campaign.title}
          </h3>
          <StatusBadge status={campaign.status} />
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {campaign.description}
        </p>
        
        <ProgressBar
          current={parseInt(formatSTX(campaign.raised))}
          target={parseInt(formatSTX(campaign.goal))}
          className="mb-4"
        />
        
        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Target className="w-4 h-4" />
            <span>{formatSTX(campaign.goal)} STX</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>Contributors</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{daysLeft} blocks</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              by {campaign.creator.slice(0, 8)}...
            </span>
            <span className="text-sm font-medium text-primary-600">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}