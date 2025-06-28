import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Wallet, User, LogOut, Zap } from 'lucide-react'
import { getUser, connectWallet, disconnectWallet, formatSTX } from '../../services/mockService'
import { User as UserType } from '../../types/campaign'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<UserType | null>(null)
  const location = useLocation()

  useEffect(() => {
    setUser(getUser())
  }, [])

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Campaigns', href: '/campaigns' },
    { name: 'Create', href: '/create' },
    { name: 'Dashboard', href: '/dashboard' },
  ]

  const isActive = (path: string) => location.pathname === path

  const handleConnectWallet = () => {
    const connectedUser = connectWallet()
    setUser(connectedUser)
  }

  const handleDisconnectWallet = () => {
    const disconnectedUser = disconnectWallet()
    setUser(disconnectedUser)
  }

  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                BitStackFund
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive(item.href)
                    ? 'text-primary-600 bg-primary-50 shadow-sm'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Wallet Connection */}
          <div className="hidden md:flex items-center space-x-4">
            {user?.isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-primary-100">
                  <User className="w-4 h-4 text-primary-600" />
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
                      {user.address.slice(0, 8)}...
                    </div>
                    <div className="text-xs text-gray-600">
                      {formatSTX(user.balance)} STX
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleDisconnectWallet}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-red-600 transition-colors duration-200 rounded-lg hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Disconnect</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnectWallet}
                className="flex items-center space-x-2 btn-primary shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200/50 animate-slide-down">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-2">
              {user?.isConnected ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 px-3 py-2 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg">
                    <User className="w-4 h-4 text-primary-600" />
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {user.address.slice(0, 8)}...
                      </div>
                      <div className="text-xs text-gray-600">
                        {formatSTX(user.balance)} STX
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleDisconnectWallet}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-red-600 transition-colors duration-200 rounded-lg hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Disconnect</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleConnectWallet}
                  className="w-full flex items-center justify-center space-x-2 btn-primary"
                >
                  <Wallet className="w-4 h-4" />
                  <span>Connect Wallet</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}