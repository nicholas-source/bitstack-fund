import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, SortAsc, Sparkles, Grid, List } from 'lucide-react'
import { CampaignCard } from '../components/campaign/CampaignCard'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useCampaigns } from '../hooks/useCampaigns'
import { CampaignStatus, CampaignFilters } from '../types'

export function CampaignsPage() {
  const { campaigns, isLoading } = useCampaigns()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState<CampaignFilters>({
    status: 'all',
    search: '',
    sortBy: 'newest'
  })

  const filteredCampaigns = useMemo(() => {
    return campaigns
      .filter(campaign => {
        const matchesSearch = !filters.search || 
          campaign.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          campaign.description.toLowerCase().includes(filters.search.toLowerCase())
        
        const matchesStatus = filters.status === 'all' || campaign.status === filters.status
        
        return matchesSearch && matchesStatus
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'newest':
            return b.createdHeight - a.createdHeight
          case 'oldest':
            return a.createdHeight - b.createdHeight
          case 'goal':
            return Number(b.goal - a.goal)
          case 'raised':
            return Number(b.raised - a.raised)
          case 'ending':
            return a.deadlineHeight - b.deadlineHeight
          default:
            return 0
        }
      })
  }, [campaigns, filters])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50">
        <div className="text-center">
          <LoadingSpinner size="xl" className="mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Campaigns</h2>
          <p className="text-gray-600">Discovering amazing projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-8 h-8 text-orange-600" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
              Explore Campaigns
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover innovative projects seeking funding on the BitStackFund platform
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <Input
                placeholder="Search campaigns..."
                icon={<Search className="w-4 h-4" />}
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value={CampaignStatus.ACTIVE}>Active</option>
                  <option value={CampaignStatus.SUCCESSFUL}>Successful</option>
                  <option value={CampaignStatus.FAILED}>Failed</option>
                  <option value={CampaignStatus.CANCELLED}>Cancelled</option>
                </select>
              </div>
              
              <div className="relative">
                <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm appearance-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="goal">Highest Goal</option>
                  <option value="raised">Most Raised</option>
                  <option value="ending">Ending Soon</option>
                </select>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'outline'}
                  size="md"
                  onClick={() => setViewMode('grid')}
                  icon={<Grid className="w-4 h-4" />}
                  className="flex-1"
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'outline'}
                  size="md"
                  onClick={() => setViewMode('list')}
                  icon={<List className="w-4 h-4" />}
                  className="flex-1"
                >
                  List
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{filteredCampaigns.length} campaigns found</span>
              {filters.search && (
                <button
                  onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                  className="text-orange-600 hover:text-orange-700"
                >
                  Clear search
                </button>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Campaign Grid/List */}
        {filteredCampaigns.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-6'
            }
          >
            {filteredCampaigns.map((campaign, index) => (
              <CampaignCard key={campaign.id} campaign={campaign} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-16"
          >
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
              <Button
                variant="outline"
                onClick={() => setFilters({
                  status: 'all',
                  search: '',
                  sortBy: 'newest'
                })}
              >
                Clear Filters
              </Button>
              <Button asChild>
                <a href="/create">Create Campaign</a>
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}