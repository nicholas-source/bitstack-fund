import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  Shield, 
  Users, 
  Zap, 
  Bitcoin, 
  Target, 
  Vote, 
  TrendingUp, 
  Star, 
  Award,
  Sparkles
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { useCampaigns } from '../hooks/useCampaigns'
import { useQuery } from '@tanstack/react-query'
import { stacksService } from '../services/stacksService'

export function HomePage() {
  const { campaigns, isLoading: campaignsLoading } = useCampaigns()
  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['platform-stats'],
    queryFn: () => stacksService.getPlatformStats(),
    staleTime: 60000, // 1 minute
  })

  const features = [
    {
      icon: Shield,
      title: 'Bitcoin-Secured',
      description: 'Built on Stacks blockchain with Bitcoin finality and security guarantees.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Users,
      title: 'Community Governance',
      description: 'Contributors vote on fund release with voting power proportional to contributions.',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Zap,
      title: 'Automated Escrow',
      description: 'Smart contracts handle fund distribution and refunds automatically.',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Target,
      title: 'Flexible Campaigns',
      description: 'Set custom goals, durations, and minimum contribution requirements.',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: Vote,
      title: 'Transparent Voting',
      description: 'On-chain voting ensures accountability and community oversight.',
      color: 'from-red-500 to-pink-500',
    },
    {
      icon: Bitcoin,
      title: 'STX Payments',
      description: 'Native STX token integration with micro-transaction support.',
      color: 'from-orange-500 to-red-500',
    },
  ]

  const howItWorks = [
    {
      step: 1,
      title: 'Create Campaign',
      description: 'Set your funding goal, duration, and campaign details. Enable community voting for added transparency.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      step: 2,
      title: 'Receive Contributions',
      description: 'Contributors fund your project with STX tokens. All funds are held securely in smart contract escrow.',
      color: 'from-purple-500 to-purple-600',
    },
    {
      step: 3,
      title: 'Access Funds',
      description: 'Once your goal is met and voting passes (if enabled), claim your funds automatically through the smart contract.',
      color: 'from-green-500 to-green-600',
    },
  ]

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-blue-50 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-100 to-blue-100 px-4 py-2 rounded-full text-sm font-medium text-orange-700 border border-orange-200"
              >
                <Sparkles className="w-4 h-4" />
                <span>Powered by Bitcoin Security</span>
              </motion.div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Decentralized Crowdfunding
                <span className="block bg-gradient-to-r from-orange-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Secured by Bitcoin
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Launch your project on BitStackFund, the trustless crowdfunding platform 
                built on Stacks blockchain. Transparent, secure, and community-governed.
              </p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
                asChild
              >
                <Link to="/campaigns">Explore Campaigns</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
              >
                <Link to="/create">Start a Campaign</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {statsLoading ? (
            <div className="flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : stats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { 
                  label: 'Total Raised', 
                  value: `${Number(stacksService.formatSTX(stats.totalRaised)).toLocaleString()} STX`, 
                  icon: TrendingUp,
                  color: 'from-orange-500 to-orange-600'
                },
                { 
                  label: 'Campaigns Funded', 
                  value: stats.successfulCampaigns.toString(), 
                  icon: Award,
                  color: 'from-blue-500 to-blue-600'
                },
                { 
                  label: 'Success Rate', 
                  value: `${Math.round((stats.successfulCampaigns / Math.max(stats.totalCampaigns, 1)) * 100)}%`, 
                  icon: Star,
                  color: 'from-purple-500 to-purple-600'
                },
                { 
                  label: 'Contributors', 
                  value: stats.totalContributors.toLocaleString(), 
                  icon: Users,
                  color: 'from-green-500 to-green-600'
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="text-center p-6" hover>
                    <div className="flex justify-center mb-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose BitStackFund?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of crowdfunding with blockchain technology, 
              community governance, and Bitcoin-level security.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full" hover>
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple, transparent, and secure crowdfunding in three steps
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="text-center p-8" hover>
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-xl`}>
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 via-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Launch Your Project?
            </h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Join the decentralized crowdfunding revolution. 
              Create your campaign today and tap into the power of community funding.
            </p>
            <Button
              size="xl"
              className="bg-white text-orange-600 hover:bg-gray-50"
              icon={<ArrowRight className="w-5 h-5" />}
              asChild
            >
              <Link to="/create">Start Your Campaign</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}