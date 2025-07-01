import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertCircle, Zap, Shield, DollarSign } from 'lucide-react'
import { Campaign, ContributeForm } from '../../types'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Card } from '../ui/Card'
import { useCampaigns } from '../../hooks/useCampaigns'
import { useAppStore } from '../../stores/useAppStore'
import { stacksService } from '../../services/stacksService'

const contributeSchema = z.object({
  amount: z.string()
    .min(1, 'Amount is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Amount must be a positive number')
})

interface ContributeModalProps {
  campaign: Campaign
  isOpen: boolean
  onClose: () => void
}

export function ContributeModal({ campaign, isOpen, onClose }: ContributeModalProps) {
  const { contribute, isContributing } = useCampaigns()
  const { user } = useAppStore()
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm<ContributeForm>({
    resolver: zodResolver(contributeSchema)
  })

  const amount = watch('amount')
  const amountMicroSTX = amount ? stacksService.parseSTX(amount) : BigInt(0)
  const contributionUSD = amount ? Number(amount) * 2.5 : 0 // Mock STX to USD rate

  const onSubmit = (data: ContributeForm) => {
    if (!user?.isConnected) return
    
    const amountMicroSTX = stacksService.parseSTX(data.amount)
    
    if (amountMicroSTX < campaign.minContribution) {
      return
    }
    
    if (amountMicroSTX > user.balance) {
      return
    }

    contribute({ campaignId: campaign.id, amount: data.amount })
    reset()
    onClose()
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Contribute to Campaign" size="md">
      <div className="space-y-6">
        {/* Campaign Info */}
        <Card padding="sm" gradient>
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1">{campaign.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                Minimum contribution: {stacksService.formatSTX(campaign.minContribution)} STX
              </p>
              <div className="flex items-center space-x-2 text-sm">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-green-700">Secured by Bitcoin finality</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Contribution Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Amount (STX)"
            type="number"
            step="0.000001"
            min={stacksService.formatSTX(campaign.minContribution)}
            placeholder="Enter amount"
            suffix="STX"
            error={errors.amount?.message}
            {...register('amount')}
          />

          {amount && (
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">USD Equivalent:</span>
                <span className="font-medium">${contributionUSD.toFixed(2)}</span>
              </div>
              {user && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Your Balance:</span>
                  <span className="font-medium">{stacksService.formatSTX(user.balance)} STX</span>
                </div>
              )}
            </div>
          )}

          {/* Voting Rights Info */}
          {campaign.votingEnabled && (
            <Card padding="sm" className="bg-blue-50 border-blue-200">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Voting Rights Included</p>
                  <p>Your contribution grants voting power to approve fund release.</p>
                </div>
              </div>
            </Card>
          )}

          {/* Validation Errors */}
          {amount && amountMicroSTX < campaign.minContribution && (
            <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
              <AlertCircle className="w-4 h-4" />
              <span>
                Minimum contribution is {stacksService.formatSTX(campaign.minContribution)} STX
              </span>
            </div>
          )}

          {amount && user && amountMicroSTX > user.balance && (
            <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
              <AlertCircle className="w-4 h-4" />
              <span>Insufficient balance</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isContributing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isContributing}
              disabled={!user?.isConnected || !amount || amountMicroSTX < campaign.minContribution || (user && amountMicroSTX > user.balance)}
              className="flex-1"
            >
              {isContributing ? 'Contributing...' : 'Contribute Now'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}