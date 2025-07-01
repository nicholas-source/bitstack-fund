import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, Campaign, PlatformStats, NotificationData, TransactionStatus } from '../types'

interface AppState {
  // User state
  user: User | null
  setUser: (user: User | null) => void
  
  // UI state
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  
  // Data state
  campaigns: Campaign[]
  setCampaigns: (campaigns: Campaign[]) => void
  addCampaign: (campaign: Campaign) => void
  updateCampaign: (id: number, updates: Partial<Campaign>) => void
  
  platformStats: PlatformStats | null
  setPlatformStats: (stats: PlatformStats) => void
  
  // Notifications
  notifications: NotificationData[]
  addNotification: (notification: Omit<NotificationData, 'id' | 'timestamp'>) => void
  markNotificationRead: (id: string) => void
  clearNotifications: () => void
  
  // Transactions
  transactions: TransactionStatus[]
  addTransaction: (transaction: Omit<TransactionStatus, 'timestamp'>) => void
  updateTransaction: (txId: string, updates: Partial<TransactionStatus>) => void
  
  // Loading states
  loading: {
    campaigns: boolean
    user: boolean
    stats: boolean
  }
  setLoading: (key: keyof AppState['loading'], value: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User state
      user: null,
      setUser: (user) => set({ user }),
      
      // UI state
      theme: 'system',
      setTheme: (theme) => set({ theme }),
      
      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      // Data state
      campaigns: [],
      setCampaigns: (campaigns) => set({ campaigns }),
      addCampaign: (campaign) => set((state) => ({ 
        campaigns: [campaign, ...state.campaigns] 
      })),
      updateCampaign: (id, updates) => set((state) => ({
        campaigns: state.campaigns.map(c => 
          c.id === id ? { ...c, ...updates } : c
        )
      })),
      
      platformStats: null,
      setPlatformStats: (stats) => set({ platformStats: stats }),
      
      // Notifications
      notifications: [],
      addNotification: (notification) => set((state) => ({
        notifications: [{
          ...notification,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date(),
          read: false
        }, ...state.notifications]
      })),
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(n =>
          n.id === id ? { ...n, read: true } : n
        )
      })),
      clearNotifications: () => set({ notifications: [] }),
      
      // Transactions
      transactions: [],
      addTransaction: (transaction) => set((state) => ({
        transactions: [{
          ...transaction,
          timestamp: new Date()
        }, ...state.transactions]
      })),
      updateTransaction: (txId, updates) => set((state) => ({
        transactions: state.transactions.map(t =>
          t.txId === txId ? { ...t, ...updates } : t
        )
      })),
      
      // Loading states
      loading: {
        campaigns: false,
        user: false,
        stats: false
      },
      setLoading: (key, value) => set((state) => ({
        loading: { ...state.loading, [key]: value }
      }))
    }),
    {
      name: 'bitstack-fund-storage',
      partialize: (state) => ({
        theme: state.theme,
        user: state.user,
        notifications: state.notifications.slice(0, 50), // Keep only recent notifications
        transactions: state.transactions.slice(0, 100) // Keep only recent transactions
      })
    }
  )
)