import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Target, Users, Share2, Heart } from 'lucide-react'
import { Campaign, Contribution } from '../types/campaign'
import { useStacks } from '../contexts/StacksContext'
import { getCampaign, getContribution, formatSTX, claimFunds, requestRefund } from '../utils/stacks'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { ProgressBar } from '../components/ui/ProgressBar'
import { StatusBadge } from '../components/ui/StatusBadge'
import { ContributeModal } from '../components/campaign/ContributeModal'
import { VotingSection } from '../components/campaign/VotingSection'

export function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [userContribution, setUserContribution] = useState<Contribution | null>(null)
  const [loading, setLoading] = useState(true)
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const { isSignedIn, userData, userSession } = useStacks()

  useEffect(() => {
    if (id) {
      loadCampaignData()
    }
  }, [id, isSignedIn, userData])

  const loadCampaignData = async () => {
    if (!id) return
    
    try {
      const campaignData = await getCampaign(parseInt(id))
      setCampaign(campaignData)
      
      if (isSignedIn && userData?.profile?.stxAddress?.testnet) {
        const contribution = await getContribution(
          parseInt(id),
          userData.profile.stxAddress.testnet
        )
        setUserContribution(contribution)
      }
    } catch (error) {
      console.error('Failed to load campaign:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClaimFunds = async () => {
    if (!campaign || !isSignedIn) return
    
    setActionLoading(true)
    try {
      await claimFunds(userSession, campaign.id)
      await loadCampaignData()
    } catch (error) {
      console.error('Failed to claim funds:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleRequestRefund = async () => {
    if (!campaign || !isSignedIn) return
    
    setActionLoading(true)
    try {
      await requestRefund(userSession, campaign.id)
      await loadCampaignData()
    } catch (error) {
      console.error('Failed to request refund:', error)
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading campaign...</p>
        </div>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Campaign Not Found</h2>
          <p className="text-gray-600 mb-6">The campaign you're looking for doesn't exist.</p>
          <Link to="/campaigns" className="btn-primary">
            Browse Campaigns
          </Link>
        </div>
      </div>
    )
  }

  const progress = (campaign.raised / campaign.goal) * 100
  const daysLeft = Math.max(0, campaign.deadlineHeight - 1000) // Mock current block height
  const isCreator = isSignedIn && userData?.profile?.stxAddress?.testnet === campaign.creator

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to="/campaigns"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Campaigns</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="card">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {campaign.title}
                  </h1>
                  <p className="text-gray-600">
                    by {campaign.creator.slice(0, 8)}...{campaign.creator.slice(-8)}
                  </p>
                </div>
                <StatusBadge status={campaign.status} />
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {campaign.description}
              </p>

              <div className="grid grid-cols-3 gap-6 py-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 text-gray-600 mb-2">
                    <Target className="w-5 h-5" />
                    <span className="font-medium">Goal</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatSTX(campaign.goal)} STX
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 text-gray-600 mb-2">
                    <Users className="w-5 h-5" />
                    <span className="font-medium">Contributors</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {/* Mock contributor count */}
                    {Math.floor(campaign.raised / campaign.minContribution)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 text-gray-600 mb-2">
                    <Calendar className="w-5 h-5" />
                    <span className="font-medium">Time Left</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {daysLeft} blocks
                  </div>
                </div>
              </div>
            </div>

            {/* Voting Section */}
            {campaign.votingEnabled && (
              <VotingSection campaign={campaign} userContribution={userContribution} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card">
              <ProgressBar
                current={parseInt(formatSTX(campaign.raised))}
                target={parseInt(formatSTX(campaign.goal))}
                className="mb-6"
              />

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Raised</span>
                  <span className="font-semibold">{formatSTX(campaign.raised)} STX</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Goal</span>
                  <span className="font-semibold">{formatSTX(campaign.goal)} STX</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Min. Contribution</span>
                  <span className="font-semibold">{formatSTX(campaign.minContribution)} STX</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {isCreator ? (
                  <button
                    onClick={handleClaimFunds}
                    disabled={actionLoading}
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    {actionLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <span>Claim Funds</span>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => setIsContributeModalOpen(true)}
                    disabled={!isSignedIn}
                    className="w-full btn-primary"
                  >
                    {isSignedIn ? 'Contribute' : 'Connect Wallet to Contribute'}
                  </button>
                )}

                {userContribution && !userContribution.refunded && (
                  <button
                    onClick={handleRequestRefund}
                    disabled={actionLoading}
                    className="w-full btn-outline flex items-center justify-center space-x-2"
                  >
                    {actionLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <span>Request Refund</span>
                    )}
                  </button>
                )}

                <div className="flex space-x-2">
                  <button className="flex-1 btn-outline flex items-center justify-center space-x-2">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                  <button className="flex-1 btn-outline flex items-center justify-center space-x-2">
                    <Heart className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </div>

            {/* User Contribution Info */}
            {userContribution && (
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-4">Your Contribution</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-semibold">{formatSTX(userContribution.amount)} STX</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Voting Power</span>
                    <span className="font-semibold">{userContribution.votingPower}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className={`font-semibold ${userContribution.refunded ? 'text-red-600' : 'text-green-600'}`}>
                      {userContribution.refunded ? 'Refunded' : 'Active'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ContributeModal
        campaign={campaign}
        isOpen={isContributeModalOpen}
        onClose={() => setIsContributeModalOpen(false)}
        onSuccess={loadCampaignData}
      />
    </div>
  )
}