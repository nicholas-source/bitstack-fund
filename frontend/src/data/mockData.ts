import { Campaign, CampaignStatus, Contribution } from '../types/campaign'

// Mock campaigns data
export const mockCampaigns: Campaign[] = [
  {
    id: 1,
    creator: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    title: 'DeFi Trading Bot Revolution',
    description: 'Building an AI-powered trading bot that uses machine learning to optimize DeFi yield farming strategies across multiple protocols. Our bot will automatically rebalance portfolios and maximize returns while minimizing risk.',
    goal: 50000000000, // 50,000 STX
    raised: 32500000000, // 32,500 STX
    deadlineHeight: 2500,
    createdHeight: 1000,
    status: CampaignStatus.ACTIVE,
    votingEnabled: true,
    votingDeadlineHeight: 2600,
    votesFor: 15,
    votesAgainst: 3,
    minContribution: 1000000, // 1 STX
  },
  {
    id: 2,
    creator: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5',
    title: 'NFT Marketplace for Digital Art',
    description: 'Creating a next-generation NFT marketplace focused on digital artists. Features include royalty management, fractional ownership, and AR/VR gallery experiences.',
    goal: 25000000000, // 25,000 STX
    raised: 28000000000, // 28,000 STX
    deadlineHeight: 1800,
    createdHeight: 800,
    status: CampaignStatus.SUCCESSFUL,
    votingEnabled: false,
    votingDeadlineHeight: 1800,
    votesFor: 0,
    votesAgainst: 0,
    minContribution: 500000, // 0.5 STX
  },
  {
    id: 3,
    creator: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
    title: 'Sustainable Energy Tracking',
    description: 'Blockchain-based platform for tracking renewable energy production and carbon credits. Helping businesses achieve net-zero goals through transparent energy accounting.',
    goal: 75000000000, // 75,000 STX
    raised: 45000000000, // 45,000 STX
    deadlineHeight: 3000,
    createdHeight: 1200,
    status: CampaignStatus.ACTIVE,
    votingEnabled: true,
    votingDeadlineHeight: 3100,
    votesFor: 22,
    votesAgainst: 8,
    minContribution: 2000000, // 2 STX
  },
  {
    id: 4,
    creator: 'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC',
    title: 'Decentralized Social Network',
    description: 'Building a censorship-resistant social media platform where users own their data and content. Features include encrypted messaging and decentralized content moderation.',
    goal: 100000000000, // 100,000 STX
    raised: 15000000000, // 15,000 STX
    deadlineHeight: 1500,
    createdHeight: 900,
    status: CampaignStatus.FAILED,
    votingEnabled: false,
    votingDeadlineHeight: 1500,
    votesFor: 0,
    votesAgainst: 0,
    minContribution: 1000000, // 1 STX
  },
  {
    id: 5,
    creator: 'ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND',
    title: 'GameFi Metaverse Platform',
    description: 'Creating an immersive gaming metaverse with play-to-earn mechanics, virtual real estate, and cross-game asset interoperability. Built on Stacks for true asset ownership.',
    goal: 200000000000, // 200,000 STX
    raised: 125000000000, // 125,000 STX
    deadlineHeight: 4000,
    createdHeight: 1500,
    status: CampaignStatus.ACTIVE,
    votingEnabled: true,
    votingDeadlineHeight: 4100,
    votesFor: 45,
    votesAgainst: 12,
    minContribution: 5000000, // 5 STX
  },
  {
    id: 6,
    creator: 'ST2REHHS5J3CERCRBEPMGH7921Q6PYKAADT7JP2VB',
    title: 'AI-Powered Code Auditing',
    description: 'Developing an AI system that automatically audits smart contracts for security vulnerabilities and gas optimization opportunities. Making DeFi safer for everyone.',
    goal: 40000000000, // 40,000 STX
    raised: 42000000000, // 42,000 STX
    deadlineHeight: 2200,
    createdHeight: 1100,
    status: CampaignStatus.SUCCESSFUL,
    votingEnabled: true,
    votingDeadlineHeight: 2300,
    votesFor: 35,
    votesAgainst: 5,
    minContribution: 1000000, // 1 STX
  },
]

// Mock user data
export const mockUser = {
  address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  balance: 1000000000000, // 1,000,000 STX
  isConnected: false,
}

// Mock contributions
export const mockContributions: Record<string, Contribution[]> = {
  'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM': [
    {
      campaignId: 2,
      amount: 5000000000, // 5,000 STX
      refunded: false,
      votingPower: 5000000000,
    },
    {
      campaignId: 3,
      amount: 10000000000, // 10,000 STX
      refunded: false,
      votingPower: 10000000000,
    },
  ],
}

// Local storage keys
export const STORAGE_KEYS = {
  CAMPAIGNS: 'bitstack_campaigns',
  USER: 'bitstack_user',
  CONTRIBUTIONS: 'bitstack_contributions',
  VOTES: 'bitstack_votes',
}

// Initialize local storage with mock data
export const initializeMockData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.CAMPAIGNS)) {
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(mockCampaigns))
  }
  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser))
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONTRIBUTIONS)) {
    localStorage.setItem(STORAGE_KEYS.CONTRIBUTIONS, JSON.stringify(mockContributions))
  }
  if (!localStorage.getItem(STORAGE_KEYS.VOTES)) {
    localStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify({}))
  }
}