export interface Campaign {
  id: number
  creator: string
  title: string
  description: string
  goal: number
  raised: number
  deadlineHeight: number
  createdHeight: number
  status: CampaignStatus
  votingEnabled: boolean
  votingDeadlineHeight: number
  votesFor: number
  votesAgainst: number
  minContribution: number
}

export enum CampaignStatus {
  ACTIVE = 1,
  SUCCESSFUL = 2,
  FAILED = 3,
  CANCELLED = 4,
}

export interface Contribution {
  campaignId: number
  amount: number
  refunded: boolean
  votingPower: number
}

export interface Vote {
  voted: boolean
  voteFor: boolean
}

export interface CreateCampaignData {
  title: string
  description: string
  goal: number
  durationBlocks: number
  votingEnabled: boolean
  votingDurationBlocks: number
  minContribution: number
}

export interface User {
  address: string
  balance: number
  isConnected: boolean
}