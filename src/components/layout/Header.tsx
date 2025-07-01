import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Menu, 
  X, 
  Wallet, 
  User, 
  LogOut, 
  Bell, 
  Settings,
  Zap,
  ChevronDown
} from 'lucide-react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { useStacks } from '../../hooks/useStacks'
import { useAppStore } from '../../stores/useAppStore'
import { stacksService } from '../../services/stacksService'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const location = useLocation()
  
  const { isSignedIn, userData, connectWallet, disconnectWallet } = useStacks()
  const { user, notifications } = useAppStore()
  
  const unreadNotifications = notifications.filter(n => !n.read).length

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Campaigns', href: '/campaigns' },
    { name: 'Create', href: '/create' },
    { name: 'Dashboard', href: '/dashboard' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg"
            >
              <Zap className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
              BitStackFund
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isSignedIn && user ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors">
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <Badge 
                      variant="danger" 
                      size="sm" 
                      className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 flex items-center justify-center text-xs"
                    >
                      {unreadNotifications}
                    </Badge>
                  )}
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-orange-50 to-blue-50 rounded-xl border border-orange-100 hover:border-orange-200 transition-all duration-200"
                  >
                    <User className="w-4 h-4 text-orange-600" />
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900">
                        {user.address.slice(0, 8)}...
                      </div>
                      <div className="text-xs text-gray-600">
                        {stacksService.formatSTX(user.balance)} STX
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={disconnectWallet}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Disconnect</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              </>
            ) : (
              <Button
                onClick={connectWallet}
                icon={<Wallet className="w-4 h-4" />}
              >
                Connect Wallet
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:text-orange-600 hover:bg-gray-50 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200/50"
        >
          <div className="px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-gray-700 hover:text-orange-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="pt-4 border-t border-gray-200">
              {isSignedIn && user ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 px-3 py-2 bg-gradient-to-r from-orange-50 to-blue-50 rounded-lg">
                    <User className="w-4 h-4 text-orange-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.address.slice(0, 8)}...
                      </div>
                      <div className="text-xs text-gray-600">
                        {stacksService.formatSTX(user.balance)} STX
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={disconnectWallet}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Disconnect</span>
                  </button>
                </div>
              ) : (
                <Button
                  onClick={connectWallet}
                  className="w-full"
                  icon={<Wallet className="w-4 h-4" />}
                >
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </header>
  )
}