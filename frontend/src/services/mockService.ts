import { Campaign, CampaignStatus, Contribution, Vote, User, CreateCampaignData } from '../types/campaign'
import { STORAGE_KEYS, initializeMockData } from '../data/mockData'

// Initialize mock data on service load
initializeMockData()

// Utility functions
export const formatSTX = (microSTX: number): string => {
  return (microSTX / 1000000).toFixed(6)
}

export const parseSTX = (stx: string): number => {
  return Math.floor(parseFloat(stx) * 1000000)
}

// Campaign operations
export const getCampaigns = (): Campaign[] => {
  const campaigns = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS)
  return campaigns ? JSON.parse(campaigns) : []
}

export const getCampaign = (id: number): Campaign | null => {
  const campaigns = getCampaigns()
  return campaigns.find(c => c.id === id) || null
}

export const createCampaign = (data: CreateCampaignData, creator: string): Campaign => {
  const campaigns = getCampaigns()
  const newId = Math.max(...campaigns.map(c => c.id), 0) + 1
  
  const newCampaign: Campaign = {
    id: newId,
    creator,
    title: data.title,
    description: data.description,
    goal: data.goal,
    raised: 0,
    deadlineHeight: 2000 + data.durationBlocks, // Mock current block height + duration
    createdHeight: 2000, // Mock current block height
    status: CampaignStatus.ACTIVE,
    votingEnabled: data.votingEnabled,
    votingDeadlineHeight: 2000 + data.durationBlocks + (data.votingEnabled ? data.votingDurationBlocks : 0),
    votesFor: 0,
    votesAgainst: 0,
    minContribution: data.minContribution,
  }
  
  campaigns.push(newCampaign)
  localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns))
  return newCampaign
}

export const updateCampaign = (id: number, updates: Partial<Campaign>): Campaign | null => {
  const campaigns = getCampaigns()
  const index = campaigns.findIndex(c => c.id === id)
  
  if (index === -1) return null
  
  campaigns[index] = { ...campaigns[index], ...updates }
  localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns))
  return campaigns[index]
}

// Contribution operations
export const getContributions = (userAddress: string): Contribution[] => {
  const contributions = localStorage.getItem(STORAGE_KEYS.CONTRIBUTIONS)
  const allContributions = contributions ? JSON.parse(contributions) : {}
  return allContributions[userAddress] || []
}

export const getContribution = (campaignId: number, userAddress: string): Contribution | null => {
  const userContributions = getContributions(userAddress)
  return userContributions.find(c => c.campaignId === campaignId) || null
}

export const addContribution = (campaignId: number, amount: number, userAddress: string): boolean => {
  const campaign = getCampaign(campaignId)
  if (!campaign || campaign.status !== CampaignStatus.ACTIVE) return false
  
  // Update campaign raised amount
  updateCampaign(campaignId, { raised: campaign.raised + amount })
  
  // Add/update contribution
  const allContributions = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTRIBUTIONS) || '{}')
  if (!allContributions[userAddress]) {
    allContributions[userAddress] = []
  }
  
  const existingIndex = allContributions[userAddress].findIndex((c: Contribution) => c.campaignId === campaignId)
  if (existingIndex >= 0) {
    allContributions[userAddress][existingIndex].amount += amount
    allContributions[userAddress][existingIndex].votingPower += amount
  } else {
    allContributions[userAddress].push({
      campaignId,
      amount,
      refunded: false,
      votingPower: amount,
    })
  }
  
  localStorage.setItem(STORAGE_KEYS.CONTRIBUTIONS, JSON.stringify(allContributions))
  
  // Update user balance
  const user = getUser()
  if (user) {
    updateUser({ balance: user.balance - amount })
  }
  
  return true
}

// User operations
export const getUser = (): User | null => {
  const user = localStorage.getItem(STORAGE_KEYS.USER)
  return user ? JSON.parse(user) : null
}

export const updateUser = (updates: Partial<User>): User | null => {
  const user = getUser()
  if (!user) return null
  
  const updatedUser = { ...user, ...updates }
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser))
  return updatedUser
}

export const connectWallet = (): User => {
  const user = getUser()
  const connectedUser = { ...user, isConnected: true } as User
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(connectedUser))
  return connectedUser
}

export const disconnectWallet = (): User => {
  const user = getUser()
  const disconnectedUser = { ...user, isConnected: false } as User
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(disconnectedUser))
  return disconnectedUser
}

// Voting operations
export const getVote = (campaignId: number, userAddress: string): Vote | null => {
  const votes = localStorage.getItem(STORAGE_KEYS.VOTES)
  const allVotes = votes ? JSON.parse(votes) : {}
  const key = `${campaignId}-${userAddress}`
  return allVotes[key] || null
}

export const castVote = (campaignId: number, voteFor: boolean, userAddress: string): boolean => {
  const campaign = getCampaign(campaignId)
  const contribution = getContribution(campaignId, userAddress)
  
  if (!campaign || !contribution || contribution.votingPower === 0) return false
  
  // Record vote
  const allVotes = JSON.parse(localStorage.getItem(STORAGE_KEYS.VOTES) || '{}')
  const key = `${campaignId}-${userAddress}`
  allVotes[key] = { voted: true, voteFor }
  localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify(allVotes))
  
  // Update campaign vote counts
  const voteWeight = contribution.votingPower
  if (voteFor) {
    updateCampaign(campaignId, { votesFor: campaign.votesFor + voteWeight })
  } else {
    updateCampaign(campaignId, { votesAgainst: campaign.votesAgainst + voteWeight })
  }
  
  return true
}

// Mock current block height
export const getCurrentBlockHeight = (): number => {
  return 2000
}

// Calculate days left from block height
export const getBlocksLeft = (deadlineHeight: number): number => {
  return Math.max(0, deadlineHeight - getCurrentBlockHeight())
}

export const getDaysLeft = (deadlineHeight: number): number => {
  const blocksLeft = getBlocksLeft(deadlineHeight)
  return Math.ceil(blocksLeft / 144) // ~144 blocks per day
}