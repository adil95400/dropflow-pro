import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './components/layout/sidebar'
import { Header } from './components/layout/header'

export function Layout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}