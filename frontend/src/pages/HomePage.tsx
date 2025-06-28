import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Users, Zap, Bitcoin, Target, Vote, TrendingUp, Star, Award } from 'lucide-react'
import { ParticleBackground } from '../components/ui/ParticleBackground'
import { FloatingElements } from '../components/ui/FloatingElements'
import { AnimatedCounter } from '../components/ui/AnimatedCounter'
import { GlowingCard } from '../components/ui/GlowingCard'
import { getCampaigns, formatSTX } from '../services/mockService'

export function HomePage() {
  const [stats, setStats] = useState({
    totalRaised: 0,
    campaignsFunded: 0,
    successRate: 0,
    contributors: 0,
  })

  useEffect(() => {
    const campaigns = getCampaigns()
    const totalRaised = campaigns.reduce((sum, c) => sum + c.raised, 0)
    const successfulCampaigns = campaigns.filter(c => c.status === 2).length
    const successRate = campaigns.length > 0 ? (successfulCampaigns / campaigns.length) * 100 : 0
    const contributors = campaigns.reduce((sum, c) => sum + Math.floor(c.raised / c.minContribution), 0)

    setStats({
      totalRaised: parseInt(formatSTX(totalRaised)),
      campaignsFunded: successfulCampaigns,
      successRate: Math.round(successRate),
      contributors: contributors + 1200, // Add some base contributors
    })
  }, [])

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

  return (
    <div className="relative overflow-hidden">
      <ParticleBackground />
      <FloatingElements />
      
      <div className="relative z-10 space-y-20">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Decentralized Crowdfunding
                  <span className="block bg-gradient-to-r from-primary-600 via-secondary-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                    Secured by Bitcoin
                  </span>
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Launch your project on BitStackFund, the trustless crowdfunding platform 
                  built on Stacks blockchain. Transparent, secure, and community-governed.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/campaigns"
                  className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-2 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <span>Explore Campaigns</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/create"
                  className="btn-outline text-lg px-8 py-4 inline-flex items-center space-x-2 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <span>Start a Campaign</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Total Raised', value: stats.totalRaised, suffix: ' STX', icon: TrendingUp },
                { label: 'Campaigns Funded', value: stats.campaignsFunded, suffix: '', icon: Award },
                { label: 'Success Rate', value: stats.successRate, suffix: '%', icon: Star },
                { label: 'Contributors', value: stats.contributors, suffix: '', icon: Users },
              ].map((stat, index) => (
                <GlowingCard key={index} className="text-center p-6" intensity="low">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
                    <AnimatedCounter value={stat.value} />
                    {stat.suffix}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </GlowingCard>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose BitStackFund?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience the future of crowdfunding with blockchain technology, 
                community governance, and Bitcoin-level security.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <GlowingCard
                  key={index}
                  className="p-6 h-full"
                  intensity="medium"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </GlowingCard>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-primary-50 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600">
                Simple, transparent, and secure crowdfunding in three steps
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
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
              ].map((step, index) => (
                <GlowingCard key={index} className="text-center p-8" intensity="medium">
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-xl`}>
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </GlowingCard>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary-600 via-secondary-600 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Launch Your Project?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join the decentralized crowdfunding revolution. 
              Create your campaign today and tap into the power of community funding.
            </p>
            <Link
              to="/create"
              className="inline-flex items-center space-x-2 bg-white text-primary-600 hover:bg-gray-50 font-medium py-4 px-8 rounded-xl transition-all duration-300 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <span>Start Your Campaign</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}