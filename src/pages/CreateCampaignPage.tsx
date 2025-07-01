import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Info, Rocket, AlertCircle } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { useCampaigns } from '../hooks/useCampaigns'
import { useStacks } from '../hooks/useStacks'
import { CreateCampaignForm } from '../types'
import { UI_CONFIG, BLOCKCHAIN_CONFIG } from '../config/constants'

const createCampaignSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(UI_CONFIG.maxCampaignTitleLength, `Title must be ${UI_CONFIG.maxCampaignTitleLength} characters or less`),
  description: z.string()
    .min(1, 'Description is required')
    .max(UI_CONFIG.maxCampaignDescriptionLength, `Description must be ${UI_CONFIG.maxCampaignDescriptionLength} characters or less`),
  goal: z.string()
    .min(1, 'Goal is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Goal must be a positive number'),
  durationDays: z.number()
    .min(1, 'Duration must be at least 1 day')
    .max(Math.floor(BLOCKCHAIN_CONFIG.maxDurationBlocks / BLOCKCHAIN_CONFIG.blocksPerDay), 'Duration too long'),
  votingEnabled: z.boolean(),
  votingDurationDays: z.number()
    .min(1, 'Voting duration must be at least 1 day')
    .max(Math.floor(BLOCKCHAIN_CONFIG.maxVotingDurationBlocks / BLOCKCHAIN_CONFIG.blocksPerDay), 'Voting duration too long'),
  minContribution: z.string()
    .min(1, 'Minimum contribution is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Minimum contribution must be a positive number')
})

export function CreateCampaignPage() {
  const navigate = useNavigate()
  const { isSignedIn, connectWallet } = useStacks()
  const { createCampaign, isCreating } = useCampaigns()
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateCampaignForm>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: {
      durationDays: 30,
      votingEnabled: false,
      votingDurationDays: 7,
      minContribution: '1'
    }
  })

  const watchedFields = watch()

  const onSubmit = (data: CreateCampaignForm) => {
    createCampaign(data)
    navigate('/campaigns')
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Card className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Create a Campaign
              </h1>
              <p className="text-gray-600 mb-8">
                Connect your wallet to start creating your crowdfunding campaign
              </p>
              <Button onClick={connectWallet} size="lg">
                Connect Wallet
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Create a Campaign
            </h1>
            <p className="text-gray-600">
              Launch your project on BitStackFund and start raising funds from the community
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Basic Information
                </h2>
                
                <Input
                  label="Campaign Title"
                  placeholder="Enter a compelling title for your campaign"
                  error={errors.title?.message}
                  {...register('title')}
                />
                <div className="text-sm text-gray-500 -mt-2">
                  {watchedFields.title?.length || 0}/{UI_CONFIG.maxCampaignTitleLength} characters
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none"
                    placeholder="Describe your project, what you're building, and how the funds will be used"
                    {...register('description')}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                  )}
                  <div className="text-sm text-gray-500 mt-1">
                    {watchedFields.description?.length || 0}/{UI_CONFIG.maxCampaignDescriptionLength} characters
                  </div>
                </div>
              </div>

              {/* Funding Details */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Funding Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Funding Goal (STX)"
                    type="number"
                    step="0.000001"
                    min="1"
                    placeholder="1000"
                    error={errors.goal?.message}
                    {...register('goal')}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Campaign Duration
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                      {...register('durationDays', { valueAsNumber: true })}
                    >
                      <option value={7}>7 days</option>
                      <option value={14}>14 days</option>
                      <option value={30}>30 days</option>
                      <option value={60}>60 days</option>
                      <option value={90}>90 days</option>
                    </select>
                    {errors.durationDays && (
                      <p className="text-sm text-red-600 mt-1">{errors.durationDays.message}</p>
                    )}
                  </div>
                </div>

                <Input
                  label="Minimum Contribution (STX)"
                  type="number"
                  step="0.000001"
                  min="0.000001"
                  placeholder="1"
                  error={errors.minContribution?.message}
                  {...register('minContribution')}
                />
              </div>

              {/* Governance */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Governance
                </h2>
                
                <Card padding="sm" className="border border-gray-200">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      {...register('votingEnabled')}
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

                  {watchedFields.votingEnabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4"
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Voting Period
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        {...register('votingDurationDays', { valueAsNumber: true })}
                      >
                        <option value={3}>3 days</option>
                        <option value={7}>7 days</option>
                        <option value={14}>14 days</option>
                      </select>
                      <p className="text-sm text-gray-500 mt-1">
                        How long contributors have to vote after the campaign ends
                      </p>
                    </motion.div>
                  )}
                </Card>
              </div>

              {/* Platform Fee Info */}
              <Card padding="sm" className="bg-blue-50 border-blue-200">
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
              </Card>

              {/* Submit Buttons */}
              <div className="flex space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/campaigns')}
                  disabled={isCreating}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isCreating}
                  className="flex-1"
                  icon={<Rocket className="w-4 h-4" />}
                >
                  {isCreating ? 'Creating...' : 'Create Campaign'}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}