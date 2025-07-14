import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/contexts/auth-context'
import { ProtectedRoute } from '@/components/protected-route'
import { Layout } from '@/components/layout'

// Pages
import { LoginPage } from '@/pages/auth/login'
import { RegisterPage } from '@/pages/auth/register'
import { DashboardPage } from '@/pages/dashboard'
import { ImportPage } from '@/pages/import'
import { ProductsPage } from '@/pages/products'
import { TrackingPage } from '@/pages/tracking'
import { WinnersPage } from '@/pages/winners'
import { SEOPage } from '@/pages/seo'
import { BlogPage } from '@/pages/blog'
import { CRMPage } from '@/pages/crm'
import { MarketplacePage } from '@/pages/marketplace'
import { ReviewsPage } from '@/pages/reviews'
import { MarketingPage } from '@/pages/marketing'
import { AnalyticsPage } from '@/pages/analytics'
import { SettingsPage } from '@/pages/settings'
import { BillingPage } from '@/pages/billing'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="dropflow-theme">
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Protected Routes */}
                <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="import" element={<ImportPage />} />
                  <Route path="products" element={<ProductsPage />} />
                  <Route path="tracking" element={<TrackingPage />} />
                  <Route path="winners" element={<WinnersPage />} />
                  <Route path="seo" element={<SEOPage />} />
                  <Route path="blog" element={<BlogPage />} />
                  <Route path="crm" element={<CRMPage />} />
                  <Route path="marketplace" element={<MarketplacePage />} />
                  <Route path="reviews" element={<ReviewsPage />} />
                  <Route path="marketing" element={<MarketingPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="billing" element={<BillingPage />} />
                </Route>
              </Routes>
              <Toaster />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App