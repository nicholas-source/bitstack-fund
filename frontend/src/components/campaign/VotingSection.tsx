import React, { useState, useEffect } from 'react'
import { ThumbsUp, ThumbsDown, Vote as VoteIcon } from 'lucide-react'
import { Campaign, Vote } from '../../types/campaign'
import { useStacks } from '../../contexts/StacksContext'
import { vote, getVoteStatus } from '../../utils/stacks'
import { LoadingSpinner } from '../ui/LoadingSpinner'

interface VotingSectionProps {
  campaign: Campaign
  userContribution: any
}

export function VotingSection({ campaign, userContribution }: VotingSectionProps) {
  const [userVote, setUserVote] = useState<Vote | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { userSession, isSignedIn, userData } = useStacks()

  useEffect(() => {
    if (isSignedIn && userData) {
      loadUserVote()
    }
  }, [isSignedIn, userData, campaign.id])

  const loadUserVote = async () => {
    if (!userData?.profile?.stxAddress?.testnet) return
    
    try {
      const vote = await getVoteStatus(campaign.id, userData.profile.stxAddress.testnet)
      setUserVote(vote)
    } catch (error) {
      console.error('Failed to load vote status:', error)
    }
  }

  const handleVote = async (voteFor: boolean) => {
    if (!isSignedIn || !userContribution) return

    setIsLoading(true)
    try {
      await vote(userSession, campaign.id, voteFor)
      await loadUserVote()
    } catch (error) {
      console.error('Failed to vote:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!campaign.votingEnabled) return null

  const totalVotes = campaign.votesFor + campaign.votesAgainst
  const forPercentage = totalVotes > 0 ? (campaign.votesFor / totalVotes) * 100 : 0
  const againstPercentage = totalVotes > 0 ? (campaign.votesAgainst / totalVotes) * 100 : 0

  const canVote = isSignedIn && userContribution && !userVote?.voted

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-4">
        <VoteIcon className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-semibold">Community Voting</h3>
      </div>

      <p className="text-gray-600 text-sm mb-6">
        Contributors can vote on whether the creator should receive the funds.
        Voting power is proportional to contribution amount.
      </p>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{campaign.votesFor}</div>
            <div className="text-sm text-gray-600">Votes For</div>
            <div className="text-xs text-gray-500">{forPercentage.toFixed(1)}%</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{campaign.votesAgainst}</div>
            <div className="text-sm text-gray-600">Votes Against</div>
            <div className="text-xs text-gray-500">{againstPercentage.toFixed(1)}%</div>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="flex h-full rounded-full overflow-hidden">
            <div
              className="bg-green-500"
              style={{ width: `${forPercentage}%` }}
            />
            <div
              className="bg-red-500"
              style={{ width: `${againstPercentage}%` }}
            />
          </div>
        </div>

        {userVote?.voted ? (
          <div className="text-center py-4">
            <div className="text-sm text-gray-600">
              You voted: <span className={`font-medium ${userVote.voteFor ? 'text-green-600' : 'text-red-600'}`}>
                {userVote.voteFor ? 'For' : 'Against'}
              </span>
            </div>
          </div>
        ) : canVote ? (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleVote(true)}
              disabled={isLoading}
              className="flex items-center justify-center space-x-2 py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <ThumbsUp className="w-4 h-4" />
                  <span>Vote For</span>
                </>
              )}
            </button>
            <button
              onClick={() => handleVote(false)}
              disabled={isLoading}
              className="flex items-center justify-center space-x-2 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <ThumbsDown className="w-4 h-4" />
                  <span>Vote Against</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="text-center py-4 text-sm text-gray-500">
            {!isSignedIn ? 'Connect wallet to vote' : 'You must contribute to vote'}
          </div>
        )}
      </div>
    </div>
  )
}