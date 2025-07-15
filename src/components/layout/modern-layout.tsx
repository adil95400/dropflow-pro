import React from 'react'
import { Outlet } from 'react-router-dom'
import { ModernSidebar } from './modern-sidebar'
import { ModernHeader } from './modern-header'

export function ModernLayout() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <ModernSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ModernHeader />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}