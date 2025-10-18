import React, { useState, useEffect } from 'react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { store } from './app/store'
import { Toaster } from 'sonner'
import { useLocation } from 'react-router-dom'
import Loader from './components/Loader'

import Hero from './Client/section/Hero'
import About from './Client/section/About'
import Careers from './Client/section/Careers'
import Training from './Client/section/Trainning'
import Contact from './Client/section/Contact'

import AdminLayout from './Admin/layout/AdminLayout'
import ChatBot from './Client/components/ChatBot'
import CvUploadPopup from './components/CvUploadPopup'
import { Route, Routes } from 'react-router-dom'
import JobListing from './Client/pages/JobListing'
import ScrollToTop from './Client/components/ScrollToTop'
import Login from './Client/pages/Login'
import Signup from './Client/pages/Signup'
import AdminLogin from './Admin/components/AdminLogin'
import Footer from './Client/section/Footer'
import AdminOverview from './Admin/pages/AdminOverview'
import AdminCvManagement from './Admin/pages/AdminCvManagement'
import AdminJobPostings from './Admin/pages/AdminJobPostings'
import AdminJobForm from './Admin/pages/AdminJobForm'
import AdminRoleManagement from './Admin/pages/AdminRoleManagement'
import Header from './Client/section/Header'

// Protected Route Components
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import UserRoute from './components/UserRoute'
import PublicRoute from './components/PublicRoute'
import UserOnlyRoute from './components/UserOnlyRoute'
import AccessDenied from './components/AccessDenied'
import AuthChecker from './components/AuthChecker'

// Redux actions
import { getUserProfile, logout } from './features/auth/authSlice'

// Create a component to handle authentication initialization
const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch()
  const { isAuthenticated, user, token } = useSelector((state) => state.auth)

  useEffect(() => {
    const initializeAuth = async () => {
      // Check if user is authenticated but we don't have user data
      if (isAuthenticated && token && !user) {
        try {
          // Fetch user profile
          await dispatch(getUserProfile()).unwrap()
        } catch (error) {
          console.error('Failed to fetch user profile:', error)
          // If profile fetch fails, logout user
          dispatch(logout())
        }
      }
    }

    initializeAuth()
  }, [isAuthenticated, user, token, dispatch])

  // Don't block UI rendering - let the app render while auth initializes
  return children
}

const App = () => {
  const location = useLocation()
  const [showBot, setShowBot] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [showCvPopup, setShowCvPopup] = useState(false)
  const [hasClosedCvPopup, setHasClosedCvPopup] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check if we're on an admin page
  const isAdminPage = location.pathname.startsWith('/admin')

  // Initialize loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000) // Show loader for 3 seconds

    return () => clearTimeout(timer)
  }, [])

  // Show CV upload popup when user scrolls down the page (only on non-admin pages)
  useEffect(() => {
    // Don't show if user has already closed it in this session or if we're on an admin page
    if (hasClosedCvPopup || isAdminPage) {
      return
    }

    const handleScroll = () => {
      // Check if user has scrolled down at least 30% of the viewport height
      const scrollPosition = window.scrollY
      const viewportHeight = window.innerHeight
      const scrollThreshold = viewportHeight * 0.3

      // Show popup if user has scrolled past threshold and popup isn't already shown
      if (scrollPosition > scrollThreshold && !showCvPopup) {
        setShowCvPopup(true)
        // Remove event listener after showing popup to prevent multiple triggers
        window.removeEventListener('scroll', handleScroll)
      }
    }

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll)

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [showCvPopup, hasClosedCvPopup, isAdminPage])

  const handleCloseCvPopup = () => {
    setShowCvPopup(false)
    setHasClosedCvPopup(true)
  }

  const [cvData, setCvData] = useState([])

  const [jobPostings, setJobPostings] = useState([])

  return (
    <Provider store={store}>
      <AuthInitializer>
        <Loader isLoading={isLoading} onComplete={() => setIsLoading(false)} />
        {!isLoading && (
          <>
            <Toaster position="top-right" richColors />
            <ScrollToTop />
            {/* Only show CV popup on non-admin pages */}
            {!isAdminPage && <CvUploadPopup isOpen={showCvPopup} onClose={handleCloseCvPopup} />}
            <AuthChecker>
              <Routes>
          <Route path="/" element={
            <UserOnlyRoute>
              <div className="min-h-dvh bg-background text-foreground">
                <Header setShowBot={setShowBot} />
                <main>
                  <Hero />
                  <About />
                  <Training />
                  <Contact />
                </main>
                <Footer />
                <ChatBot showBot={showBot} setShowBot={setShowBot} cvData={cvData} setCvData={setCvData} />
              </div>
            </UserOnlyRoute>
          } />
          <Route path="/jobs" element={
            <UserOnlyRoute>
              <JobListing />
            </UserOnlyRoute>
          } />
          <Route path="/careers" element={
            <UserOnlyRoute>
              <Careers setCvData={setCvData} jobPostings={jobPostings} />
            </UserOnlyRoute>
          } />
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } />
          <Route path="/admin-login" element={
            <PublicRoute>
              <AdminLogin />
            </PublicRoute>
          } />
          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
            <Route index element={<AdminOverview />} />
            <Route path="cv-management" element={<AdminCvManagement />} />
            <Route path="job-postings" element={<AdminJobPostings />} />
            <Route path="job-form" element={<AdminJobForm />} />
            <Route path="job-form/:id" element={<AdminJobForm />} />
            <Route path="role-management" element={<AdminRoleManagement />} />
          </Route>
          
          {/* Access Denied Route */}
          <Route path="/access-denied" element={<AccessDenied />} />
          </Routes>
        </AuthChecker>
          </>
        )}
      </AuthInitializer>
    </Provider>
  )
}

export default App