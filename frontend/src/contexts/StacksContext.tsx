import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AppConfig, UserSession, showConnect } from '@stacks/connect'
import { StacksDevnet } from '@stacks/network'

interface StacksContextType {
  userSession: UserSession
  userData: any
  isSignedIn: boolean
  network: StacksDevnet
  connectWallet: () => void
  disconnectWallet: () => void
}

const StacksContext = createContext<StacksContextType | undefined>(undefined)

const appConfig = new AppConfig(['store_write', 'publish_data'])

interface StacksProviderProps {
  children: ReactNode
}

export function StacksProvider({ children }: StacksProviderProps) {
  const [userSession] = useState(() => new UserSession({ appConfig }))
  const [userData, setUserData] = useState(null)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const network = new StacksDevnet()

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        setUserData(userData)
        setIsSignedIn(true)
      })
    } else if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData())
      setIsSignedIn(true)
    }
  }, [userSession])

  const connectWallet = () => {
    showConnect({
      appDetails: {
        name: 'BitStackFund',
        icon: window.location.origin + '/vite.svg',
      },
      redirectTo: '/',
      onFinish: () => {
        window.location.reload()
      },
      userSession,
    })
  }

  const disconnectWallet = () => {
    userSession.signUserOut('/')
    setUserData(null)
    setIsSignedIn(false)
  }

  const value = {
    userSession,
    userData,
    isSignedIn,
    network,
    connectWallet,
    disconnectWallet,
  }

  return (
    <StacksContext.Provider value={value}>
      {children}
    </StacksContext.Provider>
  )
}

export function useStacks() {
  const context = useContext(StacksContext)
  if (context === undefined) {
    throw new Error('useStacks must be used within a StacksProvider')
  }
  return context
}