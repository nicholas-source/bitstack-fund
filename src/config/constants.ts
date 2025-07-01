// Contract Configuration
export const CONTRACT_CONFIG = {
  address: 'ST3VHX09T7XDR2YFDJ3CGFMBKE1CSF4H1JD3S5RTA',
  name: 'bitstake',
  network: 'testnet'
} as const

// Application Constants
export const APP_CONFIG = {
  name: 'BitStackFund',
  description: 'Decentralized crowdfunding platform built on Stacks blockchain',
  url: 'https://bitstackfund.com',
  version: '1.0.0'
} as const

// UI Constants
export const UI_CONFIG = {
  maxCampaignTitleLength: 64,
  maxCampaignDescriptionLength: 256,
  defaultPageSize: 12,
  animationDuration: 300,
  debounceDelay: 500
} as const

// Blockchain Constants
export const BLOCKCHAIN_CONFIG = {
  blocksPerDay: 144,
  microStxPerStx: 1000000,
  maxDurationBlocks: 144000, // ~100 days
  minDurationBlocks: 144, // ~1 day
  maxVotingDurationBlocks: 14400, // ~10 days
  defaultPlatformFeeRate: 250 // 2.5%
} as const

// Status Constants
export const CAMPAIGN_STATUS = {
  ACTIVE: 1,
  SUCCESSFUL: 2,
  FAILED: 3,
  CANCELLED: 4
} as const

// Error Messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet to continue',
  INSUFFICIENT_BALANCE: 'Insufficient STX balance',
  CAMPAIGN_NOT_FOUND: 'Campaign not found',
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_INPUT: 'Invalid input. Please check your data.',
  UNAUTHORIZED: 'You are not authorized to perform this action'
} as const