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
  ClarityValue,
  contractPrincipalCV
} from '@stacks/transactions'
import { StacksTestnet } from '@stacks/network'
import { UserSession } from '@stacks/connect'
import { Campaign, CampaignStatus, Contribution, Vote, PlatformStats } from '../types'
import { CONTRACT_CONFIG, BLOCKCHAIN_CONFIG } from '../config/constants'

const network = new StacksTestnet()

class StacksService {
  private contractAddress = CONTRACT_CONFIG.address
  private contractName = CONTRACT_CONFIG.name

  // Utility methods
  formatSTX(microSTX: bigint): string {
    return (Number(microSTX) / BLOCKCHAIN_CONFIG.microStxPerStx).toFixed(6)
  }

  parseSTX(stx: string): bigint {
    return BigInt(Math.floor(parseFloat(stx) * BLOCKCHAIN_CONFIG.microStxPerStx))
  }

  // Contract call wrapper
  private async contractCall(
    functionName: string,
    functionArgs: ClarityValue[],
    userSession: UserSession,
    postConditions: any[] = []
  ) {
    const userData = userSession.loadUserData()
    
    const txOptions = {
      contractAddress: this.contractAddress,
      contractName: this.contractName,
      functionName,
      functionArgs,
      senderKey: userData.appPrivateKey,
      network,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow,
      postConditions,
    }

    const transaction = await makeContractCall(txOptions)
    const broadcastResponse = await broadcastTransaction(transaction, network)
    
    if (broadcastResponse.error) {
      throw new Error(broadcastResponse.reason || 'Transaction failed')
    }
    
    return broadcastResponse
  }

  // Read-only function wrapper
  private async readOnlyCall(functionName: string, functionArgs: ClarityValue[] = []) {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: this.contractAddress,
        contractName: this.contractName,
        functionName,
        functionArgs,
        network,
        senderAddress: this.contractAddress,
      })
      return cvToJSON(result)
    } catch (error) {
      console.error(`Read-only call failed for ${functionName}:`, error)
      throw error
    }
  }

  // Campaign operations
  async createCampaign(
    userSession: UserSession,
    title: string,
    description: string,
    goal: bigint,
    durationBlocks: number,
    votingEnabled: boolean,
    votingDurationBlocks: number,
    minContribution: bigint
  ) {
    return this.contractCall(
      'create-campaign',
      [
        stringAsciiCV(title),
        stringAsciiCV(description),
        uintCV(Number(goal)),
        uintCV(durationBlocks),
        boolCV(votingEnabled),
        uintCV(votingDurationBlocks),
        uintCV(Number(minContribution)),
      ],
      userSession
    )
  }

  async contributeToCampaign(
    userSession: UserSession,
    campaignId: number,
    amount: bigint
  ) {
    return this.contractCall(
      'contribute',
      [uintCV(campaignId), uintCV(Number(amount))],
      userSession
    )
  }

  async claimFunds(userSession: UserSession, campaignId: number) {
    return this.contractCall('claim-funds', [uintCV(campaignId)], userSession)
  }

  async requestRefund(userSession: UserSession, campaignId: number) {
    return this.contractCall('request-refund', [uintCV(campaignId)], userSession)
  }

  async vote(userSession: UserSession, campaignId: number, voteFor: boolean) {
    return this.contractCall('vote', [uintCV(campaignId), boolCV(voteFor)], userSession)
  }

  async cancelCampaign(userSession: UserSession, campaignId: number) {
    return this.contractCall('cancel-campaign', [uintCV(campaignId)], userSession)
  }

  // Read operations
  async getCampaign(campaignId: number): Promise<Campaign | null> {
    try {
      const result = await this.readOnlyCall('get-campaign', [uintCV(campaignId)])
      
      if (result?.success && result.value) {
        const campaign = result.value
        return {
          id: campaignId,
          creator: campaign.creator.value,
          title: campaign.title.value,
          description: campaign.description.value,
          goal: BigInt(campaign.goal.value),
          raised: BigInt(campaign.raised.value),
          deadlineHeight: parseInt(campaign['deadline-height'].value),
          createdHeight: parseInt(campaign['created-height'].value),
          status: parseInt(campaign.status.value) as CampaignStatus,
          votingEnabled: campaign['voting-enabled'].value,
          votingDeadlineHeight: parseInt(campaign['voting-deadline-height'].value),
          votesFor: BigInt(campaign['votes-for'].value),
          votesAgainst: BigInt(campaign['votes-against'].value),
          minContribution: BigInt(campaign['min-contribution'].value),
        }
      }
      return null
    } catch (error) {
      console.error('Error fetching campaign:', error)
      return null
    }
  }

  async getContribution(
    campaignId: number,
    contributor: string
  ): Promise<Contribution | null> {
    try {
      const result = await this.readOnlyCall('get-contribution', [
        uintCV(campaignId),
        standardPrincipalCV(contributor),
      ])
      
      if (result?.success && result.value) {
        const contribution = result.value
        return {
          campaignId,
          contributor,
          amount: BigInt(contribution.amount.value),
          refunded: contribution.refunded.value,
          votingPower: BigInt(contribution['voting-power'].value),
        }
      }
      return null
    } catch (error) {
      console.error('Error fetching contribution:', error)
      return null
    }
  }

  async getVoteStatus(
    campaignId: number,
    voter: string
  ): Promise<Vote | null> {
    try {
      const result = await this.readOnlyCall('get-vote-status', [
        uintCV(campaignId),
        standardPrincipalCV(voter),
      ])
      
      if (result?.success && result.value) {
        const vote = result.value
        return {
          campaignId,
          voter,
          voted: vote.voted.value,
          voteFor: vote['vote-for'].value,
        }
      }
      return null
    } catch (error) {
      console.error('Error fetching vote status:', error)
      return null
    }
  }

  async getCampaignCount(): Promise<number> {
    try {
      const result = await this.readOnlyCall('get-campaign-count')
      return result?.success ? parseInt(result.value.value) : 0
    } catch (error) {
      console.error('Error fetching campaign count:', error)
      return 0
    }
  }

  async getPlatformFeeRate(): Promise<number> {
    try {
      const result = await this.readOnlyCall('get-platform-fee-rate')
      return result?.success ? parseInt(result.value.value) : BLOCKCHAIN_CONFIG.defaultPlatformFeeRate
    } catch (error) {
      console.error('Error fetching platform fee rate:', error)
      return BLOCKCHAIN_CONFIG.defaultPlatformFeeRate
    }
  }

  // Utility methods
  async getAllCampaigns(): Promise<Campaign[]> {
    try {
      const count = await this.getCampaignCount()
      const campaigns: Campaign[] = []
      
      for (let i = 1; i <= count; i++) {
        const campaign = await this.getCampaign(i)
        if (campaign) {
          campaigns.push(campaign)
        }
      }
      
      return campaigns.sort((a, b) => b.createdHeight - a.createdHeight)
    } catch (error) {
      console.error('Error fetching all campaigns:', error)
      return []
    }
  }

  async getPlatformStats(): Promise<PlatformStats> {
    try {
      const campaigns = await this.getAllCampaigns()
      
      const totalCampaigns = campaigns.length
      const totalRaised = campaigns.reduce((sum, c) => sum + c.raised, BigInt(0))
      const successfulCampaigns = campaigns.filter(c => c.status === CampaignStatus.SUCCESSFUL).length
      const activeCampaigns = campaigns.filter(c => c.status === CampaignStatus.ACTIVE).length
      
      // Estimate contributors (this would need a more sophisticated approach in production)
      const totalContributors = Math.floor(Number(totalRaised) / (BLOCKCHAIN_CONFIG.microStxPerStx * 10)) + 1000
      
      return {
        totalCampaigns,
        totalRaised,
        successfulCampaigns,
        activeCampaigns,
        totalContributors
      }
    } catch (error) {
      console.error('Error fetching platform stats:', error)
      return {
        totalCampaigns: 0,
        totalRaised: BigInt(0),
        successfulCampaigns: 0,
        activeCampaigns: 0,
        totalContributors: 0
      }
    }
  }

  // Helper methods for UI
  isActive(campaign: Campaign, currentBlockHeight: number): boolean {
    return campaign.status === CampaignStatus.ACTIVE && currentBlockHeight < campaign.deadlineHeight
  }

  isSuccessful(campaign: Campaign): boolean {
    return campaign.raised >= campaign.goal
  }

  getProgress(campaign: Campaign): number {
    return Number(campaign.raised) / Number(campaign.goal) * 100
  }

  getTimeLeft(deadlineHeight: number, currentBlockHeight: number): {
    blocks: number
    days: number
    hours: number
  } {
    const blocks = Math.max(0, deadlineHeight - currentBlockHeight)
    const days = Math.floor(blocks / BLOCKCHAIN_CONFIG.blocksPerDay)
    const hours = Math.floor((blocks % BLOCKCHAIN_CONFIG.blocksPerDay) / 6) // Approximate hours
    
    return { blocks, days, hours }
  }
}

export const stacksService = new StacksService()