import React, { useState } from 'react'
import { X, AlertCircle } from 'lucide-react'
import { Campaign } from '../../types/campaign'
import { useStacks } from '../../contexts/StacksContext'
import { contributeToCampaign, formatSTX, parseSTX } from '../../utils/stacks'
import { LoadingSpinner } from '../ui/LoadingSpinner'

interface ContributeModalProps {
  campaign: Campaign
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ContributeModal({ campaign, isOpen, onClose, onSuccess }: ContributeModalProps) {
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { userSession, isSignedIn } = useStacks()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSignedIn) {
      setError('Please connect your wallet first')
      return
    }

    const amountMicroSTX = parseSTX(amount)
    if (amountMicroSTX < campaign.minContribution) {
      setError(`Minimum contribution is ${formatSTX(campaign.minContribution)} STX`)
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await contributeToCampaign(userSession, campaign.id, amountMicroSTX)
      onSuccess()
      onClose()
      setAmount('')
    } catch (err) {
      setError('Failed to contribute. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Contribute to Campaign</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-2">{campaign.title}</h3>
          <p className="text-sm text-gray-600">
            Minimum contribution: {formatSTX(campaign.minContribution)} STX
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Amount (STX)</label>
            <input
              type="number"
              step="0.000001"
              min={formatSTX(campaign.minContribution)}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field"
              placeholder="Enter amount in STX"
              required
            />
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-outline"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary flex items-center justify-center space-x-2"
              disabled={isLoading || !isSignedIn}
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <span>Contribute</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}