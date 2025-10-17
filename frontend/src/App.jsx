import React, { useState, useEffect } from 'react'
import { Provider } from 'react-redux'
import { store } from './app/store'

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
const App = () => {
  const [showBot, setShowBot] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [showCvPopup, setShowCvPopup] = useState(false)

  // Show CV upload popup on initial load
  useEffect(() => {
    const hasSeenCvPopup = localStorage.getItem('hasSeenCvPopup')
    if (!hasSeenCvPopup) {
      // Delay the popup slightly to ensure the page has loaded
      const timer = setTimeout(() => {
        setShowCvPopup(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleCloseCvPopup = () => {
    setShowCvPopup(false)
    localStorage.setItem('hasSeenCvPopup', 'true')
  }

  const [cvData, setCvData] = useState([])

  const [jobPostings, setJobPostings] = useState([])

  return (
    <Provider store={store}>
      <ScrollToTop />
      <CvUploadPopup isOpen={showCvPopup} onClose={handleCloseCvPopup} />
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
    </Provider>
  )
}

export default App