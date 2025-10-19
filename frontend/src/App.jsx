import React, { useState, useEffect } from 'react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { store } from './app/store'
import { Toaster } from 'sonner'
import Hero from './Client/section/Hero'
import About from './Client/section/About'
import Careers from './Client/section/Careers'
import Training from './Client/section/Trainning'
import Contact from './Client/section/Contact'

import AdminLayout from './Admin/layout/AdminLayout'
import ChatBot from './Client/components/ChatBot'
import CvUploadPopup from './components/CvUploadPopup'
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import JobListing from './Client/pages/JobListing'
import ScrollToTop from './Client/components/ScrollToTop'
import Login from './Client/pages/Login'
import Signup from './Client/pages/Signup'
import AdminLogin from './Admin/components/AdminLogin'
import AdminOverview from './Admin/pages/AdminOverview'
import AdminCvManagement from './Admin/pages/AdminCvManagement'
import AdminJobPostings from './Admin/pages/AdminJobPostings'
import AdminJobForm from './Admin/pages/AdminJobForm'
import AdminRoleManagement from './Admin/pages/AdminRoleManagement'
import AdminRegistration from './Admin/pages/AdminRegistration'
import Header from './Client/section/Header'

import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import UserRoute from './components/UserRoute'
import PublicRoute from './components/PublicRoute'
import UserOnlyRoute from './components/UserOnlyRoute'
import AccessDenied from './components/AccessDenied'
import AuthChecker from './components/AuthChecker'

import { getUserProfile, logout, setUser } from './features/auth/authSlice'
import { adminLogout, setAdmin, restoreAdminAuth } from './features/admin/adminSlice'
// import Footer from './Client/section/Footer'

// Temporary inline Footer component for testing
const Footer = () => {
  return (
    <footer className="border-t border-border bg-card mt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-muted-foreground">
          © {new Date().getFullYear()} Fildex Solutions. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated: userAuthenticated, user, token: userToken } = useSelector((state) => state.auth)
  const { isAuthenticated: adminAuthenticated, admin, token: adminToken } = useSelector((state) => state.admin)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initializeAuth = async () => {
      const currentPath = location.pathname
      
      const storedUserToken = localStorage.getItem('authToken')
      const storedAdminToken = localStorage.getItem('adminToken')
      const isUserLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
      const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true'

      console.log('Auth initialization:', {
        storedUserToken: !!storedUserToken,
        storedAdminToken: !!storedAdminToken,
        isUserLoggedIn,
        isAdminLoggedIn,
        currentPath,
        currentUserAuth: userAuthenticated,
        currentAdminAuth: adminAuthenticated
      })

      if (storedUserToken && isUserLoggedIn) {
        try {
          console.log('Fetching user profile...')
          const result = await dispatch(getUserProfile()).unwrap()
          console.log('User profile fetched successfully:', result)
        } catch (error) {
          console.error('Failed to fetch user profile:', error)
          if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
            dispatch(logout())
          } else {
            console.warn('Network error during profile fetch, setting basic auth state')
            dispatch(setUser({ token: storedUserToken }))
          }
        }
      }

      if (storedAdminToken && isAdminLoggedIn) {
        console.log('Restoring admin authentication...')
        dispatch(restoreAdminAuth())
        console.log('Admin authentication restored')
      }

      setIsInitialized(true)
    }

    initializeAuth()
  }, [])

  useEffect(() => {
    if (!isInitialized) return

    const currentPath = location.pathname
    
    console.log('Navigation check:', {
      currentPath,
      userAuthenticated,
      adminAuthenticated,
      isInitialized
    })
    
    if (userAuthenticated && (currentPath === '/login' || currentPath === '/signup')) {
      navigate('/', { replace: true })
      return
    }

    if (adminAuthenticated && currentPath === '/admin-login') {
      navigate('/admin', { replace: true })
      return
    }

    if (adminAuthenticated && !userAuthenticated && currentPath === '/') {
      navigate('/admin', { replace: true })
      return
    }

    if (adminAuthenticated && !userAuthenticated && (currentPath === '/jobs' || currentPath === '/careers')) {
      navigate('/admin', { replace: true })
      return
    }

    if (userAuthenticated && !adminAuthenticated && currentPath.startsWith('/admin')) {
      navigate('/', { replace: true })
      return
    }

    if (!userAuthenticated && !adminAuthenticated) {
      if (currentPath.startsWith('/admin')) {
        navigate('/admin-login', { replace: true })
        return
      }
    }
  }, [isInitialized, userAuthenticated, adminAuthenticated, location.pathname, navigate])

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return children
}

const App = () => {
  const location = useLocation()
  const [showBot, setShowBot] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [showCvPopup, setShowCvPopup] = useState(false)
  const [hasClosedCvPopup, setHasClosedCvPopup] = useState(false)

  const isAdminPage = location.pathname.startsWith('/admin')

  useEffect(() => {
    if (hasClosedCvPopup || isAdminPage) {
      return
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const viewportHeight = window.innerHeight
      const scrollThreshold = viewportHeight * 0.3

      if (scrollPosition > scrollThreshold && !showCvPopup) {
        setShowCvPopup(true)
        window.removeEventListener('scroll', handleScroll)
      }
    }

    window.addEventListener('scroll', handleScroll)

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
        <Toaster position="top-right" richColors style={{ zIndex: 99999 }} />
        <ScrollToTop />
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
            <Route path="register" element={<AdminRegistration />} />
          </Route>
          
          <Route path="/access-denied" element={<AccessDenied />} />
          </Routes>
        </AuthChecker>
      </AuthInitializer>
    </Provider>
  )
}

export default App