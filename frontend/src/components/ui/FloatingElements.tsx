import React from 'react'

export function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full opacity-20 animate-float-slow" />
      <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-lg opacity-15 animate-float-medium rotate-45" />
      <div className="absolute bottom-32 left-1/4 w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-25 animate-float-fast" />
      <div className="absolute bottom-20 right-1/3 w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-lg opacity-10 animate-float-slow rotate-12" />
      <div className="absolute top-1/3 left-1/2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-30 animate-float-medium" />
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-radial from-primary-300/20 to-transparent rounded-full animate-pulse-slow" />
      <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-gradient-radial from-secondary-300/15 to-transparent rounded-full animate-pulse-slower" />
    </div>
  )
}