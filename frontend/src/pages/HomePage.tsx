import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Users, Zap, Bitcoin, Target, Vote } from 'lucide-react'

export function HomePage() {
  const features = [
    {
      icon: Shield,
      title: 'Bitcoin-Secured',
      description: 'Built on Stacks blockchain with Bitcoin finality and security guarantees.',
    },
    {
      icon: Users,
      title: 'Community Governance',
      description: 'Contributors vote on fund release with voting power proportional to contributions.',
    },
    {
      icon: Zap,
      title: 'Automated Escrow',
      description: 'Smart contracts handle fund distribution and refunds automatically.',
    },
    {
      icon: Target,
      title: 'Flexible Campaigns',
      description: 'Set custom goals, durations, and minimum contribution requirements.',
    },
    {
      icon: Vote,
      title: 'Transparent Voting',
      description: 'On-chain voting ensures accountability and community oversight.',
    },
    {
      icon: Bitcoin,
      title: 'STX Payments',
      description: 'Native STX token integration with micro-transaction support.',
    },
  ]

  const stats = [
    { label: 'Total Raised', value: '1.2M STX' },
    { label: 'Campaigns Funded', value: '156' },
    { label: 'Success Rate', value: '87%' },
    { label: 'Contributors', value: '2.3K' },
  ]

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Decentralized Crowdfunding
              <span className="block text-gradient">Secured by Bitcoin</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Launch your project on BitStackFund, the trustless crowdfunding platform 
              built on Stacks blockchain. Transparent, secure, and community-governed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/campaigns"
                className="btn-primary text-lg px-8 py-3 inline-flex items-center space-x-2"
              >
                <span>Explore Campaigns</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/create"
                className="btn-outline text-lg px-8 py-3 inline-flex items-center space-x-2"
              >
                <span>Start a Campaign</span>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary-200 rounded-full opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary-200 rounded-full opacity-20 animate-pulse-slow"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
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
              <div
                key={index}
                className="card hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
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
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Create Campaign
              </h3>
              <p className="text-gray-600">
                Set your funding goal, duration, and campaign details. 
                Enable community voting for added transparency.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Receive Contributions
              </h3>
              <p className="text-gray-600">
                Contributors fund your project with STX tokens. 
                All funds are held securely in smart contract escrow.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Access Funds
              </h3>
              <p className="text-gray-600">
                Once your goal is met and voting passes (if enabled), 
                claim your funds automatically through the smart contract.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Launch Your Project?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join the decentralized crowdfunding revolution. 
            Create your campaign today and tap into the power of community funding.
          </p>
          <Link
            to="/create"
            className="inline-flex items-center space-x-2 bg-white text-primary-600 hover:bg-gray-50 font-medium py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
          >
            <span>Start Your Campaign</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}