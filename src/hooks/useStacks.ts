import { useState, useEffect, useCallback } from 'react'
import { AppConfig, UserSession, showConnect } from '@stacks/connect'
import { StacksTestnet } from '@stacks/network'
import { useAppStore } from '../stores/useAppStore'
import { stacksService } from '../services/stacksService'
import { APP_CONFIG } from '../config/constants'

const appConfig = new AppConfig(['store_write', 'publish_data'])
const network = new StacksTestnet()

export function useStacks() {
  const [userSession] = useState(() => new UserSession({ appConfig }))
  const [userData, setUserData] = useState<any>(null)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const { setUser, addNotification } = useAppStore()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (userSession.isSignInPending()) {
          const userData = await userSession.handlePendingSignIn()
          setUserData(userData)
          setIsSignedIn(true)
          await updateUserBalance(userData.profile.stxAddress.testnet)
        } else if (userSession.isUserSignedIn()) {
          const userData = userSession.loadUserData()
          setUserData(userData)
          setIsSignedIn(true)
          await updateUserBalance(userData.profile.stxAddress.testnet)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        addNotification({
          type: 'error',
          title: 'Authentication Error',
          message: 'Failed to authenticate. Please try connecting again.',
          read: false
        })
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [userSession, addNotification])

  const updateUserBalance = async (address: string) => {
    try {
      // In a real implementation, you would fetch the actual STX balance
      // For now, we'll use a mock balance
      const mockBalance = BigInt(1000 * 1000000) // 1000 STX
      
      setUser({
        address,
        balance: mockBalance,
        isConnected: true,
        profile: userData?.profile
      })
    } catch (error) {
      console.error('Failed to update user balance:', error)
    }
  }

  const connectWallet = useCallback(() => {
    showConnect({
      appDetails: {
        name: APP_CONFIG.name,
        icon: `${window.location.origin}/logo.svg`,
      },
      redirectTo: '/',
      onFinish: () => {
        window.location.reload()
      },
      userSession,
    })
  }, [userSession])

  const disconnectWallet = useCallback(() => {
    userSession.signUserOut('/')
    setUserData(null)
    setIsSignedIn(false)
    setUser(null)
    addNotification({
      type: 'info',
      title: 'Wallet Disconnected',
      message: 'Your wallet has been disconnected successfully.',
      read: false
    })
  }, [userSession, setUser, addNotification])

  return {
    userSession,
    userData,
    isSignedIn,
    isLoading,
    network,
    connectWallet,
    disconnectWallet,
    updateUserBalance
  }
}