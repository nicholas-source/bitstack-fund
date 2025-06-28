import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Target, Users, TrendingUp } from 'lucide-react'
import { Campaign } from '../../types/campaign'
import { ProgressBar } from '../ui/ProgressBar'
import { StatusBadge } from '../ui/StatusBadge'
import { GlowingCard } from '../ui/GlowingCard'
import { AnimatedCounter } from '../ui/AnimatedCounter'
import { formatSTX, getDaysLeft } from '../../services/mockService'

interface CampaignCardProps {
  campaign: Campaign
  index?: number
}

export function CampaignCard({ campaign, index = 0 }: CampaignCardProps) {
  const progress = (campaign.raised / campaign.goal) * 100
  const daysLeft = getDaysLeft(campaign.deadlineHeight)
  const contributorCount = Math.floor(campaign.raised / campaign.minContribution) + Math.floor(Math.random() * 20)
  
  return (
    <Link to={`/campaigns/${campaign.id}`} className="block group">
      <GlowingCard 
        className="h-full transform transition-all duration-500 hover:scale-105"
        intensity="medium"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2">
            {campaign.title}
          </h3>
          <StatusBadge status={campaign.status} />
        </div>
        
        <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
          {campaign.description}
        </p>
        
        <div className="mb-6">
          <ProgressBar
            current={parseInt(formatSTX(campaign.raised))}
            target={parseInt(formatSTX(campaign.goal))}
            className="mb-3"
          />
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              <AnimatedCounter 
                value={parseInt(formatSTX(campaign.raised))} 
                formatter={(v) => `${v.toLocaleString()} STX raised`}
              />
            </span>
            <span className="font-semibold text-primary-600">
              {progress.toFixed(1)}%
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-primary-500" />
            <span className="truncate">
              <AnimatedCounter 
                value={parseInt(formatSTX(campaign.goal))} 
                formatter={(v) => `${v.toLocaleString()}`}
              />
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-secondary-500" />
            <span>
              <AnimatedCounter value={contributorCount} />
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-green-500" />
            <span>{daysLeft}d left</span>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 flex items-center space-x-1">
              <div className="w-2 h-2 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full"></div>
              <span>by {campaign.creator.slice(0, 8)}...</span>
            </span>
            <div className="flex items-center space-x-2 text-sm font-medium text-primary-600 group-hover:text-primary-700 transition-colors duration-300">
              <span>View Details</span>
              <TrendingUp className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </GlowingCard>
    </Link>
  )
}