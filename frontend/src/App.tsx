import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { HomePage } from './pages/HomePage'
import { CampaignsPage } from './pages/CampaignsPage'
import { CampaignDetailPage } from './pages/CampaignDetailPage'
import { CreateCampaignPage } from './pages/CreateCampaignPage'
import { DashboardPage } from './pages/DashboardPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { initializeMockData } from './data/mockData'

function App() {
  useEffect(() => {
    // Initialize mock data on app start
    initializeMockData()
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-primary-50">
      <Navbar />
      <main className="flex-1 relative">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
          <Route path="/create" element={<CreateCampaignPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App