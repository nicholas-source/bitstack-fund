import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  stringAsciiCV,
  uintCV,
  boolCV,
  standardPrincipalCV,
  callReadOnlyFunction,
  cvToJSON,
} from '@stacks/transactions'
import { StacksDevnet } from '@stacks/network'
import { Campaign, CampaignStatus, Contribution, Vote } from '../types/campaign'

const CONTRACT_ADDRESS = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
const CONTRACT_NAME = 'bitstack-fund'
const network = new StacksDevnet()

export const contractCall = async (
  functionName: string,
  functionArgs: any[],
  userSession: any,
  postConditions: any[] = []
) => {
  const txOptions = {
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName,
    functionArgs,
    senderKey: userSession.loadUserData().appPrivateKey,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    postConditions,
  }

  const transaction = await makeContractCall(txOptions)
  const broadcastResponse = await broadcastTransaction(transaction, network)
  return broadcastResponse
}

export const readOnlyCall = async (functionName: string, functionArgs: any[] = []) => {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName,
      functionArgs,
      network,
      senderAddress: CONTRACT_ADDRESS,
    })
    return cvToJSON(result)
  } catch (error) {
    console.error('Read-only call failed:', error)
    return null
  }
}

export const createCampaign = async (
  userSession: any,
  title: string,
  description: string,
  goal: number,
  durationBlocks: number,
  votingEnabled: boolean,
  votingDurationBlocks: number,
  minContribution: number
) => {
  return contractCall(
    'create-campaign',
    [
      stringAsciiCV(title),
      stringAsciiCV(description),
      uintCV(goal),
      uintCV(durationBlocks),
      boolCV(votingEnabled),
      uintCV(votingDurationBlocks),
      uintCV(minContribution),
    ],
    userSession
  )
}

export const contributeToCampaign = async (
  userSession: any,
  campaignId: number,
  amount: number
) => {
  return contractCall(
    'contribute',
    [uintCV(campaignId), uintCV(amount)],
    userSession
  )
}

export const claimFunds = async (userSession: any, campaignId: number) => {
  return contractCall('claim-funds', [uintCV(campaignId)], userSession)
}

export const requestRefund = async (userSession: any, campaignId: number) => {
  return contractCall('request-refund', [uintCV(campaignId)], userSession)
}

export const vote = async (userSession: any, campaignId: number, voteFor: boolean) => {
  return contractCall('vote', [uintCV(campaignId), boolCV(voteFor)], userSession)
}

export const cancelCampaign = async (userSession: any, campaignId: number) => {
  return contractCall('cancel-campaign', [uintCV(campaignId)], userSession)
}

export const getCampaign = async (campaignId: number): Promise<Campaign | null> => {
  const result = await readOnlyCall('get-campaign', [uintCV(campaignId)])
  if (result?.success && result.value) {
    const campaign = result.value
    return {
      id: campaignId,
      creator: campaign.creator.value,
      title: campaign.title.value,
      description: campaign.description.value,
      goal: parseInt(campaign.goal.value),
      raised: parseInt(campaign.raised.value),
      deadlineHeight: parseInt(campaign['deadline-height'].value),
      createdHeight: parseInt(campaign['created-height'].value),
      status: parseInt(campaign.status.value) as CampaignStatus,
      votingEnabled: campaign['voting-enabled'].value,
      votingDeadlineHeight: parseInt(campaign['voting-deadline-height'].value),
      votesFor: parseInt(campaign['votes-for'].value),
      votesAgainst: parseInt(campaign['votes-against'].value),
      minContribution: parseInt(campaign['min-contribution'].value),
    }
  }
  return null
}

export const getContribution = async (
  campaignId: number,
  contributor: string
): Promise<Contribution | null> => {
  const result = await readOnlyCall('get-contribution', [
    uintCV(campaignId),
    standardPrincipalCV(contributor),
  ])
  if (result?.success && result.value) {
    const contribution = result.value
    return {
      amount: parseInt(contribution.amount.value),
      refunded: contribution.refunded.value,
      votingPower: parseInt(contribution['voting-power'].value),
    }
  }
  return null
}

export const getVoteStatus = async (
  campaignId: number,
  voter: string
): Promise<Vote | null> => {
  const result = await readOnlyCall('get-vote-status', [
    uintCV(campaignId),
    standardPrincipalCV(voter),
  ])
  if (result?.success && result.value) {
    const vote = result.value
    return {
      voted: vote.voted.value,
      voteFor: vote['vote-for'].value,
    }
  }
  return null
}

export const getCampaignCount = async (): Promise<number> => {
  const result = await readOnlyCall('get-campaign-count')
  return result?.success ? parseInt(result.value.value) : 0
}

export const formatSTX = (microSTX: number): string => {
  return (microSTX / 1000000).toFixed(6)
}

export const parseSTX = (stx: string): number => {
  return Math.floor(parseFloat(stx) * 1000000)
}