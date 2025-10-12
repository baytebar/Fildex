import React, { useState } from 'react'
import Header from './Client/section/Header'
import Hero from './Client/section/Hero'
import About from './Client/section/About'
import BusinessOutsourcing from './Client/section/BusinessOutsourcing'
import Careers from './Client/section/Careers'
import Opportunities from './Client/section/Opportunities'
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

  // State for job postings
  const [jobPostings, setJobPostings] = useState([
    { 
      id: 1, 
      title: 'Senior Cloud Engineer', 
      department: 'Engineering', 
      location: 'Remote', 
      type: 'Full-time', 
      salary: '€70,000 - €90,000', 
      description: 'We are looking for an experienced Cloud Engineer to join our team.', 
      requirements: ['AWS Certification', '5+ years experience'], 
      postedDate: '2024-01-10', 
      expiryDate: '2024-03-10',
      status: 'active',
      applicants: 12
    },
    { 
      id: 2, 
      title: 'DevOps Specialist', 
      department: 'Operations', 
      location: 'Dublin', 
      type: 'Full-time', 
      salary: '€60,000 - €80,000', 
      description: 'Join our DevOps team to streamline our deployment processes.', 
      requirements: ['Docker', 'Kubernetes', 'CI/CD pipelines'], 
      postedDate: '2024-01-15', 
      expiryDate: '2024-03-15',
      status: 'active',
      applicants: 8
    }
  ])

  return (
    // Changed background to a simpler white background that works with the new theme
    <div className="min-h-dvh bg-background text-foreground">
      <Header setShowBot={setShowBot} setShowAdmin={setShowAdmin} />

      <main >
        <Hero />
        <About />
        
        <BusinessOutsourcing />
        <Careers setCvData={setCvData} />
        <Opportunities jobPostings={jobPostings} />
        <Contact />
      </main>
      <Footer />
      <AdminDashboard
        showAdmin={showAdmin}
        setShowAdmin={setShowAdmin}
        cvData={cvData}
        setCvData={setCvData}
        jobPostings={jobPostings}
        setJobPostings={setJobPostings}
      />
      <ChatBot showBot={showBot} setShowBot={setShowBot} />
    </div>
  )
}

export default App