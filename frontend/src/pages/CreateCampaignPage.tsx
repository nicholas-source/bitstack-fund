import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, Info } from 'lucide-react'
import { useStacks } from '../contexts/StacksContext'
import { createCampaign, parseSTX } from '../utils/stacks'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'

export function CreateCampaignPage() {
  const navigate = useNavigate()
  const { isSignedIn, userSession, connectWallet } = useStacks()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal: '',
    durationDays: '30',
    votingEnabled: false,
    votingDurationDays: '7',
    minContribution: '1',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSignedIn) {
      setError('Please connect your wallet first')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const goalMicroSTX = parseSTX(formData.goal)
      const minContributionMicroSTX = parseSTX(formData.minContribution)
      const durationBlocks = parseInt(formData.durationDays) * 144 // ~144 blocks per day
      const votingDurationBlocks = parseInt(formData.votingDurationDays) * 144

      const result = await createCampaign(
        userSession,
        formData.title,
        formData.description,
        goalMicroSTX,
        durationBlocks,
        formData.votingEnabled,
        votingDurationBlocks,
        minContributionMicroSTX
      )

      if (result) {
        navigate('/campaigns')
      }
    } catch (err) {
      setError('Failed to create campaign. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Create a Campaign
            </h1>
            <p className="text-gray-600 mb-8">
              Connect your wallet to start creating your crowdfunding campaign
            </p>
            <button onClick={connectWallet} className="btn-primary">
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Create a Campaign
          </h1>
          <p className="text-gray-600">
            Launch your project on BitStackFund and start raising funds from the community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6">
          <div>
            <label className="label">Campaign Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Enter a compelling title for your campaign"
              maxLength={64}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.title.length}/64 characters
            </p>
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="input-field resize-none"
              placeholder="Describe your project, what you're building, and how the funds will be used"
              maxLength={256}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.description.length}/256 characters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Funding Goal (STX)</label>
              <input
                type="number"
                name="goal"
                value={formData.goal}
                onChange={handleInputChange}
                className="input-field"
                placeholder="1000"
                min="1"
                step="0.000001"
                required
              />
            </div>

            <div>
              <label className="label">Campaign Duration (Days)</label>
              <select
                name="durationDays"
                value={formData.durationDays}
                onChange={handleInputChange}
                className="input-field"
                required
              >
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Minimum Contribution (STX)</label>
            <input
              type="number"
              name="minContribution"
              value={formData.minContribution}
              onChange={handleInputChange}
              className="input-field"
              placeholder="1"
              min="0.000001"
              step="0.000001"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Set the minimum amount contributors must pledge
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                name="votingEnabled"
                checked={formData.votingEnabled}
                onChange={handleInputChange}
                className="mt-1"
              />
              <div className="flex-1">
                <label className="font-medium text-gray-900 cursor-pointer">
                  Enable Community Voting
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  Allow contributors to vote on whether you should receive the funds. 
                  This adds transparency and accountability to your campaign.
                </p>
              </div>
            </div>

            {formData.votingEnabled && (
              <div className="mt-4">
                <label className="label">Voting Period (Days)</label>
                <select
                  name="votingDurationDays"
                  value={formData.votingDurationDays}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="3">3 days</option>
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  How long contributors have to vote after the campaign ends
                </p>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Platform Fee</p>
                <p>
                  BitStackFund charges a 2.5% platform fee on successfully funded campaigns. 
                  This fee is automatically deducted when you claim your funds.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/campaigns')}
              className="flex-1 btn-outline"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary flex items-center justify-center space-x-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <span>Create Campaign</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}