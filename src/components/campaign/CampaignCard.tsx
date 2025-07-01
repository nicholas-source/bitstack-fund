import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Target, Users, TrendingUp, Clock } from 'lucide-react'
import { Campaign } from '../../types'
import { Card } from '../ui/Card'
import { ProgressBar } from '../ui/ProgressBar'
import { StatusBadge } from '../ui/Badge'
import { stacksService } from '../../services/stacksService'
import { BLOCKCHAIN_CONFIG } from '../../config/constants'

interface CampaignCardProps {
  campaign: Campaign
  index?: number
}

export function CampaignCard({ campaign, index = 0 }: CampaignCardProps) {
  const progress = stacksService.getProgress(campaign)
  const currentBlockHeight = 2000 // Mock current block height
  const timeLeft = stacksService.getTimeLeft(campaign.deadlineHeight, currentBlockHeight)
  const contributorCount = Math.floor(Number(campaign.raised) / Number(campaign.minContribution)) + Math.floor(Math.random() * 20)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/campaigns/${campaign.id}`} className="block group">
        <Card hover className="h-full">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-300 line-clamp-2">
              {campaign.title}
            </h3>
            <StatusBadge status={campaign.status} />
          </div>
          
          <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
            {campaign.description}
          </p>
          
          <div className="mb-6">
            <ProgressBar
              value={Number(stacksService.formatSTX(campaign.raised))}
              max={Number(stacksService.formatSTX(campaign.goal))}
              className="mb-3"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-orange-500" />
              <span className="truncate">
                {Number(stacksService.formatSTX(campaign.goal)).toLocaleString()} STX
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span>{contributorCount}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-green-500" />
              <span>{timeLeft.days}d left</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 flex items-center space-x-1">
                <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-blue-400 rounded-full"></div>
                <span>by {campaign.creator.slice(0, 8)}...</span>
              </span>
              <div className="flex items-center space-x-2 text-sm font-medium text-orange-600 group-hover:text-orange-700 transition-colors duration-300">
                <span>View Details</span>
                <TrendingUp className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}