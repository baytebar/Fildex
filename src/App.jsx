import React, { useState } from 'react'
import Header from './Client/section/Header'
import Hero from './Client/section/Hero'
import About from './Client/section/About'
import TrainingServices from './Client/section/TrainingServices'
import BusinessOutsourcing from './Client/section/BusinessOutsourcing'
import Careers from './Client/section/Careers'
import Opportunities from './Client/section/Opportunities'
import ServiceProvider from './Client/section/ServiceProvider'
import Testimonials from './Client/section/Testimonials'
import Contact from './Client/section/Contact'
import Footer from './Client/section/Footer'
import AdminDashboard from './Client/section/AdminDashboard'
import ChatBot from './Client/section/ChatBot'

const App = () => {
  const [showBot, setShowBot] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [cvData, setCvData] = useState([
    { id: 1, name: 'John Smith', email: 'john@example.com', phone: '+353 1 234 5678', role: 'cloud-engineer', uploadedDate: '2024-01-15', status: 'active', retentionDate: '2025-01-15' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '+353 1 234 5679', role: 'devops-engineer', uploadedDate: '2024-01-10', status: 'active', retentionDate: '2025-01-10' },
    { id: 3, name: 'Mike O\'Brien', email: 'mike@example.com', phone: '+353 1 234 5680', role: 'ai-ml-developer', uploadedDate: '2024-01-05', status: 'active', retentionDate: '2025-01-05' },
    { id: 4, name: 'Emma Wilson', email: 'emma@example.com', phone: '+353 1 234 5681', role: 'software-developer', uploadedDate: '2023-12-20', status: 'expired', retentionDate: '2024-12-20' }
  ])

  return (
    <div className="min-h-dvh bg-gradient-to-b from-purple-950 via-black to-purple-950 text-white">
      <Header setShowBot={setShowBot} setShowAdmin={setShowAdmin} />

      <main className="mx-auto max-w-7xl px-4 py-8 space-y-12">
        <Hero />
        <About />
        <TrainingServices />
        <BusinessOutsourcing />
        <Careers setCvData={setCvData} />
        <Opportunities />
        <ServiceProvider />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <AdminDashboard
        showAdmin={showAdmin}
        setShowAdmin={setShowAdmin}
        cvData={cvData}
        setCvData={setCvData}
      />
      <ChatBot showBot={showBot} setShowBot={setShowBot} />
    </div>
  )
}

export default App