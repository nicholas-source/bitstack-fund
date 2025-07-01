export interface Campaign {
  id: number
  creator: string
  title: string
  description: string
  goal: bigint
  raised: bigint
  deadlineHeight: number
  createdHeight: number
  status: CampaignStatus
  votingEnabled: boolean
  votingDeadlineHeight: number
  votesFor: bigint
  votesAgainst: bigint
  minContribution: bigint
}

export enum CampaignStatus {
  ACTIVE = 1,
  SUCCESSFUL = 2,
  FAILED = 3,
  CANCELLED = 4
}

export interface Contribution {
  campaignId: number
  contributor: string
  amount: bigint
  refunded: boolean
  votingPower: bigint
}

export interface Vote {
  campaignId: number
  voter: string
  voted: boolean
  voteFor: boolean
}

export interface User {
  address: string
  balance: bigint
  isConnected: boolean
  profile?: UserProfile
}

export interface UserProfile {
  name?: string
  bio?: string
  avatar?: string
  website?: string
  twitter?: string
  github?: string
}

export interface CreateCampaignForm {
  title: string
  description: string
  goal: string
  durationDays: number
  votingEnabled: boolean
  votingDurationDays: number
  minContribution: string
}

export interface ContributeForm {
  amount: string
}

export interface PlatformStats {
  totalCampaigns: number
  totalRaised: bigint
  successfulCampaigns: number
  activeCampaigns: number
  totalContributors: number
}

export interface CampaignFilters {
  status?: CampaignStatus | 'all'
  category?: string
  search?: string
  sortBy?: 'newest' | 'oldest' | 'goal' | 'raised' | 'ending'
  minGoal?: number
  maxGoal?: number
}

export interface NotificationData {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}

export interface TransactionStatus {
  txId: string
  status: 'pending' | 'success' | 'failed'
  type: 'create' | 'contribute' | 'vote' | 'claim' | 'refund'
  timestamp: Date
  blockHeight?: number
}