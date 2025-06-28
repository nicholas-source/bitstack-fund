import React, { useState, useEffect } from 'react'
import { Search, Filter, SortAsc } from 'lucide-react'
import { Campaign, CampaignStatus } from '../types/campaign'
import { CampaignCard } from '../components/campaign/CampaignCard'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { getCampaign, getCampaignCount } from '../utils/stacks'

export function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | 'all'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'goal' | 'raised'>('newest')

  useEffect(() => {
    loadCampaigns()
  }, [])

  const loadCampaigns = async () => {
    try {
      const count = await getCampaignCount()
      const campaignPromises = []
      
      for (let i = 1; i <= count; i++) {
        campaignPromises.push(getCampaign(i))
      }
      
      const campaignResults = await Promise.all(campaignPromises)
      const validCampaigns = campaignResults.filter(Boolean) as Campaign[]
      setCampaigns(validCampaigns)
    } catch (error) {
      console.error('Failed to load campaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAndSortedCampaigns = campaigns
    .filter(campaign => {
      const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.createdHeight - a.createdHeight
        case 'oldest':
          return a.createdHeight - b.createdHeight
        case 'goal':
          return b.goal - a.goal
        case 'raised':
          return b.raised - a.raised
        default:
          return 0
      }
    })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading campaigns...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Explore Campaigns
          </h1>
          <p className="text-gray-600">
            Discover innovative projects seeking funding on the BitStackFund platform
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-field"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as CampaignStatus | 'all')}
                className="pl-10 input-field appearance-none"
              >
                <option value="all">All Status</option>
                <option value={CampaignStatus.ACTIVE}>Active</option>
                <option value={CampaignStatus.SUCCESSFUL}>Successful</option>
                <option value={CampaignStatus.FAILED}>Failed</option>
                <option value={CampaignStatus.CANCELLED}>Cancelled</option>
              </select>
            </div>
            
            <div className="relative">
              <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="pl-10 input-field appearance-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="goal">Highest Goal</option>
                <option value="raised">Most Raised</option>
              </select>
            </div>
          </div>
        </div>

        {/* Campaign Grid */}
        {filteredAndSortedCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedCampaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No campaigns found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or check back later for new campaigns.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}