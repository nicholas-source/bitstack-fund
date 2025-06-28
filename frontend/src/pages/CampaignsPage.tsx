import React, { useState, useEffect } from 'react'
import { Search, Filter, SortAsc, Sparkles } from 'lucide-react'
import { Campaign, CampaignStatus } from '../types/campaign'
import { CampaignCard } from '../components/campaign/CampaignCard'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { GlowingCard } from '../components/ui/GlowingCard'
import { getCampaigns } from '../services/mockService'

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
      // Simulate loading delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800))
      const campaignData = getCampaigns()
      setCampaigns(campaignData)
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="text-center">
          <div className="relative">
            <LoadingSpinner size="lg" />
            <div className="absolute inset-0 animate-ping">
              <LoadingSpinner size="lg" className="opacity-20" />
            </div>
          </div>
          <p className="mt-6 text-gray-600 text-lg">Loading amazing campaigns...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center animate-fade-in">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Explore Campaigns
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover innovative projects seeking funding on the BitStackFund platform
          </p>
        </div>

        {/* Filters and Search */}
        <GlowingCard className="mb-8 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-field transition-all duration-300 focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as CampaignStatus | 'all')}
                className="pl-10 input-field appearance-none transition-all duration-300 focus:ring-2 focus:ring-primary-500"
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
                className="pl-10 input-field appearance-none transition-all duration-300 focus:ring-2 focus:ring-primary-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="goal">Highest Goal</option>
                <option value="raised">Most Raised</option>
              </select>
            </div>
          </div>
        </GlowingCard>

        {/* Campaign Grid */}
        {filteredAndSortedCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedCampaigns.map((campaign, index) => (
              <div
                key={campaign.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CampaignCard campaign={campaign} index={index} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-gray-400 mb-6">
              <Search className="w-20 h-20 mx-auto opacity-50" />
            </div>
            <h3 className="text-2xl font-medium text-gray-900 mb-4">
              No campaigns found
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Try adjusting your search criteria or check back later for new campaigns.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                  setSortBy('newest')
                }}
                className="btn-outline"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}