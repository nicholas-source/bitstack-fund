import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, TrendingUp, Users, DollarSign, Calendar } from 'lucide-react'
import { Campaign } from '../types/campaign'
import { useStacks } from '../contexts/StacksContext'
import { getCampaign, getCampaignCount, formatSTX } from '../utils/stacks'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { StatusBadge } from '../components/ui/StatusBadge'
import { ProgressBar } from '../components/ui/ProgressBar'

export function DashboardPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const { isSignedIn, userData, connectWallet } = useStacks()

  useEffect(() => {
    if (isSignedIn && userData) {
      loadUserCampaigns()
    } else {
      setLoading(false)
    }
  }, [isSignedIn, userData])

  const loadUserCampaigns = async () => {
    if (!userData?.profile?.stxAddress?.testnet) return

    try {
      const count = await getCampaignCount()
      const campaignPromises = []
      
      for (let i = 1; i <= count; i++) {
        campaignPromises.push(getCampaign(i))
      }
      
      const campaignResults = await Promise.all(campaignPromises)
      const userCampaigns = campaignResults
        .filter(Boolean)
        .filter(campaign => campaign!.creator === userData.profile.stxAddress.testnet) as Campaign[]
      
      setCampaigns(userCampaigns)
    } catch (error) {
      console.error('Failed to load user campaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Dashboard
            </h1>
            <p className="text-gray-600 mb-8">
              Connect your wallet to view your campaigns and contributions
            </p>
            <button onClick={connectWallet} className="btn-primary">
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const totalRaised = campaigns.reduce((sum, campaign) => sum + campaign.raised, 0)
  const totalGoal = campaigns.reduce((sum, campaign) => sum + campaign.goal, 0)
  const activeCampaigns = campaigns.filter(c => c.status === 1).length
  const successfulCampaigns = campaigns.filter(c => c.status === 2).length

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your campaigns and track your progress
            </p>
          </div>
          <Link to="/create" className="btn-primary flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create Campaign</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Raised</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatSTX(totalRaised)} STX
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-secondary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {campaigns.length > 0 ? Math.round((successfulCampaigns / campaigns.length) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{activeCampaigns}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Campaigns List */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Campaigns</h2>
            {campaigns.length === 0 && (
              <Link to="/create" className="btn-primary text-sm">
                Create Your First Campaign
              </Link>
            )}
          </div>

          {campaigns.length > 0 ? (
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <Link
                        to={`/campaigns/${campaign.id}`}
                        className="text-lg font-medium text-gray-900 hover:text-primary-600 transition-colors duration-200"
                      >
                        {campaign.title}
                      </Link>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {campaign.description}
                      </p>
                    </div>
                    <StatusBadge status={campaign.status} />
                  </div>

                  <ProgressBar
                    current={parseInt(formatSTX(campaign.raised))}
                    target={parseInt(formatSTX(campaign.goal))}
                    className="mb-4"
                  />

                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Raised:</span> {formatSTX(campaign.raised)} STX
                    </div>
                    <div>
                      <span className="font-medium">Goal:</span> {formatSTX(campaign.goal)} STX
                    </div>
                    <div>
                      <span className="font-medium">Progress:</span> {Math.round((campaign.raised / campaign.goal) * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Calendar className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No campaigns yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first campaign to start raising funds for your project.
              </p>
              <Link to="/create" className="btn-primary">
                Create Campaign
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}