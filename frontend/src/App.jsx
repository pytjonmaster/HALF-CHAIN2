import React, { Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Layouts
import MainLayout from '@/layouts/MainLayout';

// Pages
import HomePage from '@/pages/HomePage';
import FeaturesPage from '@/pages/FeaturesPage';
import SmartContractPage from '@/pages/SmartContractPage';
import CompliancePage from '@/pages/CompliancePage';
import AboutPage from '@/pages/AboutPage';
import EventsPage from '@/pages/EventsPage';
import ContactPage from '@/pages/ContactPage';
import NotFoundPage from '@/pages/NotFoundPage';

// Auth Components
import SignIn from '@/components/SignIn';
import SignUp from '@/components/SignUp';
import ForgotPassword from '@/components/ForgotPassword';
import ResetPassword from '@/components/ResetPassword';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-custom-gradient p-4">
          <div className="max-w-md w-full space-y-4 text-center">
            <h1 className="text-2xl font-bold text-red-500">Something went wrong</h1>
            <p className="text-muted-foreground">{this.state.error?.message || 'An unexpected error occurred'}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  useEffect(() => {
    const handleError = (event) => {
      console.error('Global error:', event.error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  return (
    <div className="relative min-h-screen">
      <ErrorBoundary>
        <AuthProvider>
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
            </div>
          }>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="features" element={<FeaturesPage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="events" element={<EventsPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="smart-contracts" element={
                    <ProtectedRoute>
                      <SmartContractPage />
                    </ProtectedRoute>
                  } />
                  <Route path="compliance" element={<CompliancePage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </AnimatePresence>
          </Suspense>
        </AuthProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;
