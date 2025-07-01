import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useStacks } from './useStacks'
import { stacksService } from '../services/stacksService'
import { useAppStore } from '../stores/useAppStore'
import { Campaign, CreateCampaignForm } from '../types'
import { BLOCKCHAIN_CONFIG } from '../config/constants'

export function useCampaigns() {
  const queryClient = useQueryClient()
  const { userSession, isSignedIn } = useStacks()
  const { addNotification, addTransaction, updateTransaction } = useAppStore()

  // Fetch all campaigns
  const {
    data: campaigns = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => stacksService.getAllCampaigns(),
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
  })

  // Fetch single campaign
  const useCampaign = (id: number) => {
    return useQuery({
      queryKey: ['campaign', id],
      queryFn: () => stacksService.getCampaign(id),
      enabled: !!id,
      staleTime: 30000,
    })
  }

  // Create campaign mutation
  const createCampaignMutation = useMutation({
    mutationFn: async (data: CreateCampaignForm) => {
      if (!isSignedIn) throw new Error('Wallet not connected')
      
      const goal = stacksService.parseSTX(data.goal)
      const minContribution = stacksService.parseSTX(data.minContribution)
      const durationBlocks = data.durationDays * BLOCKCHAIN_CONFIG.blocksPerDay
      const votingDurationBlocks = data.votingDurationDays * BLOCKCHAIN_CONFIG.blocksPerDay

      const result = await stacksService.createCampaign(
        userSession,
        data.title,
        data.description,
        goal,
        durationBlocks,
        data.votingEnabled,
        votingDurationBlocks,
        minContribution
      )

      addTransaction({
        txId: result.txid,
        status: 'pending',
        type: 'create'
      })

      return result
    },
    onSuccess: (result) => {
      addNotification({
        type: 'success',
        title: 'Campaign Created',
        message: 'Your campaign has been created successfully!',
        read: false
      })
      
      // Invalidate campaigns query to refetch
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      
      // Update transaction status (in real app, you'd monitor the blockchain)
      setTimeout(() => {
        updateTransaction(result.txid, { status: 'success' })
      }, 5000)
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Campaign Creation Failed',
        message: error.message || 'Failed to create campaign. Please try again.',
        read: false
      })
    }
  })

  // Contribute mutation
  const contributeMutation = useMutation({
    mutationFn: async ({ campaignId, amount }: { campaignId: number; amount: string }) => {
      if (!isSignedIn) throw new Error('Wallet not connected')
      
      const amountMicroSTX = stacksService.parseSTX(amount)
      const result = await stacksService.contributeToCampaign(userSession, campaignId, amountMicroSTX)

      addTransaction({
        txId: result.txid,
        status: 'pending',
        type: 'contribute'
      })

      return result
    },
    onSuccess: (result, variables) => {
      addNotification({
        type: 'success',
        title: 'Contribution Successful',
        message: `You have successfully contributed to campaign #${variables.campaignId}!`,
        read: false
      })
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      queryClient.invalidateQueries({ queryKey: ['campaign', variables.campaignId] })
      
      setTimeout(() => {
        updateTransaction(result.txid, { status: 'success' })
      }, 5000)
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Contribution Failed',
        message: error.message || 'Failed to contribute. Please try again.',
        read: false
      })
    }
  })

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: async ({ campaignId, voteFor }: { campaignId: number; voteFor: boolean }) => {
      if (!isSignedIn) throw new Error('Wallet not connected')
      
      const result = await stacksService.vote(userSession, campaignId, voteFor)

      addTransaction({
        txId: result.txid,
        status: 'pending',
        type: 'vote'
      })

      return result
    },
    onSuccess: (result, variables) => {
      addNotification({
        type: 'success',
        title: 'Vote Submitted',
        message: `Your vote has been submitted for campaign #${variables.campaignId}!`,
        read: false
      })
      
      queryClient.invalidateQueries({ queryKey: ['campaign', variables.campaignId] })
      
      setTimeout(() => {
        updateTransaction(result.txid, { status: 'success' })
      }, 5000)
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Vote Failed',
        message: error.message || 'Failed to submit vote. Please try again.',
        read: false
      })
    }
  })

  // Claim funds mutation
  const claimFundsMutation = useMutation({
    mutationFn: async (campaignId: number) => {
      if (!isSignedIn) throw new Error('Wallet not connected')
      
      const result = await stacksService.claimFunds(userSession, campaignId)

      addTransaction({
        txId: result.txid,
        status: 'pending',
        type: 'claim'
      })

      return result
    },
    onSuccess: (result, campaignId) => {
      addNotification({
        type: 'success',
        title: 'Funds Claimed',
        message: `Funds have been claimed for campaign #${campaignId}!`,
        read: false
      })
      
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] })
      
      setTimeout(() => {
        updateTransaction(result.txid, { status: 'success' })
      }, 5000)
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Claim Failed',
        message: error.message || 'Failed to claim funds. Please try again.',
        read: false
      })
    }
  })

  // Request refund mutation
  const requestRefundMutation = useMutation({
    mutationFn: async (campaignId: number) => {
      if (!isSignedIn) throw new Error('Wallet not connected')
      
      const result = await stacksService.requestRefund(userSession, campaignId)

      addTransaction({
        txId: result.txid,
        status: 'pending',
        type: 'refund'
      })

      return result
    },
    onSuccess: (result, campaignId) => {
      addNotification({
        type: 'success',
        title: 'Refund Requested',
        message: `Refund has been requested for campaign #${campaignId}!`,
        read: false
      })
      
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] })
      
      setTimeout(() => {
        updateTransaction(result.txid, { status: 'success' })
      }, 5000)
    },
    onError: (error: Error) => {
      addNotification({
        type: 'error',
        title: 'Refund Failed',
        message: error.message || 'Failed to request refund. Please try again.',
        read: false
      })
    }
  })

  return {
    campaigns,
    isLoading,
    error,
    refetch,
    useCampaign,
    createCampaign: createCampaignMutation.mutate,
    isCreating: createCampaignMutation.isPending,
    contribute: contributeMutation.mutate,
    isContributing: contributeMutation.isPending,
    vote: voteMutation.mutate,
    isVoting: voteMutation.isPending,
    claimFunds: claimFundsMutation.mutate,
    isClaiming: claimFundsMutation.isPending,
    requestRefund: requestRefundMutation.mutate,
    isRefunding: requestRefundMutation.isPending,
  }
}