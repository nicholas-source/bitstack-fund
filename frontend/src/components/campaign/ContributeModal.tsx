import React, { useState } from 'react'
import { X, AlertCircle, Zap, Shield } from 'lucide-react'
import { Campaign } from '../../types/campaign'
import { formatSTX, parseSTX, addContribution, getUser } from '../../services/mockService'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { AnimatedCounter } from '../ui/AnimatedCounter'

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
  const user = getUser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.isConnected) {
      setError('Please connect your wallet first')
      return
    }

    const amountMicroSTX = parseSTX(amount)
    if (amountMicroSTX < campaign.minContribution) {
      setError(`Minimum contribution is ${formatSTX(campaign.minContribution)} STX`)
      return
    }

    if (amountMicroSTX > user.balance) {
      setError('Insufficient balance')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const success = addContribution(campaign.id, amountMicroSTX, user.address)
      if (success) {
        onSuccess()
        onClose()
        setAmount('')
      } else {
        setError('Failed to contribute. Campaign may be inactive.')
      }
    } catch (err) {
      setError('Failed to contribute. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  const contributionUSD = parseFloat(amount) * 2.5 // Mock STX to USD rate

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl transform animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Contribute to Campaign
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-primary-100">
          <h3 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
            <Zap className="w-4 h-4 text-primary-600" />
            <span>{campaign.title}</span>
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Minimum contribution: {formatSTX(campaign.minContribution)} STX
          </p>
          <div className="flex items-center space-x-2 text-sm">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-green-700">Secured by Bitcoin finality</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label">Amount (STX)</label>
            <div className="relative">
              <input
                type="number"
                step="0.000001"
                min={formatSTX(campaign.minContribution)}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field pr-16 text-lg font-medium"
                placeholder="Enter amount"
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-500">
                STX
              </div>
            </div>
            {amount && (
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-600">
                  ≈ $<AnimatedCounter value={contributionUSD} formatter={(v) => v.toFixed(2)} />
                </p>
                {user && (
                  <p className="text-xs text-gray-500">
                    Balance: {formatSTX(user.balance)} STX
                  </p>
                )}
              </div>
            )}
          </div>

          {campaign.votingEnabled && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Voting Rights Included</p>
                  <p>Your contribution grants voting power to approve fund release.</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
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
              className="flex-1 btn-primary flex items-center justify-center space-x-2 relative overflow-hidden"
              disabled={isLoading || !user?.isConnected}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Contributing...</span>
                </>
              ) : (
                <span>Contribute Now</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}