import React, { useState, useEffect } from 'react'

import Hero from './client/section/Hero'
import About from './client/section/About'
import Careers from './client/section/Careers'
import Training from './client/section/Trainning'
import Contact from './client/section/Contact'

import AdminDashboard from './Admin/components/AdminDashboard'
import AdminLayout from './Admin/layout/AdminLayout'
import ChatBot from './client/components/ChatBot'
import CvUploadPopup from './components/CvUploadPopup'
import { Route, Routes } from 'react-router-dom'
import JobListing from './client/pages/JobListing'
import ScrollToTop from './client/components/ScrollToTop'
import Login from './client/pages/Login'
import Signup from './client/pages/Signup'
import Footer from './client/section/Footer'
import AdminOverview from './Admin/pages/AdminOverview'
import AdminCvManagement from './Admin/pages/AdminCvManagement'
import AdminJobPostings from './Admin/pages/AdminJobPostings'
import AdminRoleManagement from './Admin/pages/AdminRoleManagement'
import AdminAnalytics from './Admin/pages/AdminAnalytics'
import Header from './client/section/Header'
const App = () => {
  const [showBot, setShowBot] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showCvPopup, setShowCvPopup] = useState(false)
  
  // Check for existing login state on component mount
  useEffect(() => {
    const savedLoginState = localStorage.getItem('isLoggedIn')
    if (savedLoginState === 'true') {
      setIsLoggedIn(true)
    }
  }, [])

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

  const [cvData, setCvData] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+353 1 234 5678',
      role: 'cloud-engineer',
      uploadedDate: '2024-01-15',
      status: 'new',
      retentionDate: '2025-01-15',
      userRole: null,
      location: 'Dublin, Ireland',
      experience: '5 years in cloud infrastructure and DevOps',
      skills: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Terraform', 'Python'],
      education: 'BSc Computer Science, Trinity College Dublin',
      summary: 'Experienced cloud engineer with expertise in AWS and Azure platforms. Led migration projects for Fortune 500 companies.'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+353 1 234 5679',
      role: 'devops-engineer',
      uploadedDate: '2024-01-10',
      status: 'reviewed',
      retentionDate: '2025-01-10',
      userRole: 'recruiter',
      location: 'Cork, Ireland',
      experience: '7 years in DevOps and automation',
      skills: ['Jenkins', 'GitLab CI', 'Ansible', 'Docker', 'Linux', 'Bash'],
      education: 'MSc Software Engineering, UCC',
      summary: 'Senior DevOps engineer specializing in CI/CD pipelines and infrastructure automation. Passionate about streamlining development workflows.'
    },
    {
      id: 3,
      name: 'Mike O\'Brien',
      email: 'mike.obrien@email.com',
      phone: '+353 1 234 5680',
      role: 'ai-ml-developer',
      uploadedDate: '2024-01-05',
      status: 'shortlisted',
      retentionDate: '2025-01-05',
      userRole: null,
      location: 'Galway, Ireland',
      experience: '4 years in machine learning and data science',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'Pandas', 'Scikit-learn', 'SQL'],
      education: 'PhD Artificial Intelligence, NUIG',
      summary: 'AI/ML researcher with strong background in deep learning and computer vision. Published 10+ papers in top-tier conferences.'
    },
    {
      id: 4,
      name: 'Emma Wilson',
      email: 'emma.wilson@email.com',
      phone: '+353 1 234 5681',
      role: 'frontend-developer',
      uploadedDate: '2023-12-20',
      status: 'rejected',
      retentionDate: '2024-12-20',
      userRole: 'viewer',
      location: 'Belfast, Northern Ireland',
      experience: '3 years in frontend development',
      skills: ['React', 'Vue.js', 'TypeScript', 'CSS', 'HTML', 'JavaScript'],
      education: 'BSc Web Development, Queen\'s University Belfast',
      summary: 'Creative frontend developer with expertise in modern JavaScript frameworks and responsive design.'
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david.brown@email.com',
      phone: '+353 1 234 5682',
      role: 'backend-developer',
      uploadedDate: '2024-01-20',
      status: 'new',
      retentionDate: '2025-01-20',
      userRole: null,
      location: 'Limerick, Ireland',
      experience: '6 years in backend development',
      skills: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL'],
      education: 'BSc Computer Science, UL',
      summary: 'Backend specialist with extensive experience in scalable API development and database design.'
    },
    {
      id: 6,
      name: 'Lisa Garcia',
      email: 'lisa.garcia@email.com',
      phone: '+353 1 234 5683',
      role: 'fullstack-developer',
      uploadedDate: '2024-01-18',
      status: 'reviewed',
      retentionDate: '2025-01-18',
      userRole: null,
      location: 'Waterford, Ireland',
      experience: '4 years in full-stack development',
      skills: ['React', 'Node.js', 'Express', 'MySQL', 'AWS', 'Docker'],
      education: 'BSc Software Development, WIT',
      summary: 'Versatile full-stack developer with strong problem-solving skills and experience in agile development.'
    },
    {
      id: 7,
      name: 'James Murphy',
      email: 'james.murphy@email.com',
      phone: '+353 1 234 5684',
      role: 'data-engineer',
      uploadedDate: '2024-01-22',
      status: 'new',
      retentionDate: '2025-01-22',
      userRole: null,
      location: 'Dublin, Ireland',
      experience: '5 years in data engineering and analytics',
      skills: ['Python', 'Apache Spark', 'Kafka', 'Airflow', 'Snowflake', 'SQL'],
      education: 'MSc Data Science, DCU',
      summary: 'Data engineering expert with experience in building large-scale data pipelines and analytics platforms.'
    },
    {
      id: 8,
      name: 'Anna O\'Connor',
      email: 'anna.oconnor@email.com',
      phone: '+353 1 234 5685',
      role: 'mobile-developer',
      uploadedDate: '2024-01-25',
      status: 'shortlisted',
      retentionDate: '2025-01-25',
      userRole: null,
      location: 'Cork, Ireland',
      experience: '3 years in mobile app development',
      skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Swift', 'Kotlin'],
      education: 'BSc Mobile Computing, CIT',
      summary: 'Mobile app developer with expertise in cross-platform development and native iOS/Android applications.'
    },
    {
      id: 9,
      name: 'Robert Taylor',
      email: 'robert.taylor@email.com',
      phone: '+353 1 234 5686',
      role: 'security-engineer',
      uploadedDate: '2024-01-28',
      status: 'reviewed',
      retentionDate: '2025-01-28',
      userRole: null,
      location: 'Dublin, Ireland',
      experience: '8 years in cybersecurity and information security',
      skills: ['Penetration Testing', 'SIEM', 'Firewalls', 'VPN', 'Cryptography', 'Risk Assessment'],
      education: 'MSc Cybersecurity, TCD',
      summary: 'Senior security engineer with extensive experience in threat analysis, vulnerability assessment, and security architecture.'
    },
    {
      id: 10,
      name: 'Maria Rodriguez',
      email: 'maria.rodriguez@email.com',
      phone: '+353 1 234 5687',
      role: 'qa-engineer',
      uploadedDate: '2024-01-30',
      status: 'new',
      retentionDate: '2025-01-30',
      userRole: null,
      location: 'Galway, Ireland',
      experience: '4 years in quality assurance and testing',
      skills: ['Selenium', 'Cypress', 'Jest', 'Postman', 'Test Automation', 'Agile'],
      education: 'BSc Software Testing, NUIG',
      summary: 'QA engineer with strong background in automated testing and quality assurance processes.'
    },
    {
      id: 11,
      name: 'Kevin Walsh',
      email: 'kevin.walsh@email.com',
      phone: '+353 1 234 5688',
      role: 'product-manager',
      uploadedDate: '2024-02-01',
      status: 'reviewed',
      retentionDate: '2025-02-01',
      userRole: null,
      location: 'Dublin, Ireland',
      experience: '6 years in product management and strategy',
      skills: ['Product Strategy', 'Agile', 'User Research', 'Analytics', 'Stakeholder Management', 'Roadmapping'],
      education: 'MBA Technology Management, UCD',
      summary: 'Product manager with experience in leading cross-functional teams and delivering successful digital products.'
    },
    {
      id: 12,
      name: 'Sophie Chen',
      email: 'sophie.chen@email.com',
      phone: '+353 1 234 5689',
      role: 'ui-ux-designer',
      uploadedDate: '2024-02-03',
      status: 'shortlisted',
      retentionDate: '2025-02-03',
      userRole: null,
      location: 'Cork, Ireland',
      experience: '5 years in UI/UX design and user research',
      skills: ['Figma', 'Sketch', 'Adobe Creative Suite', 'User Research', 'Prototyping', 'Design Systems'],
      education: 'BA Digital Design, UCC',
      summary: 'UI/UX designer with a passion for creating intuitive and accessible user experiences.'
    }
  ])

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
    },
    {
      id: 3,
      title: 'AI/ML Developer',
      department: 'Research',
      location: 'Cork',
      type: 'Full-time',
      salary: '€80,000 - €100,000',
      description: 'Work on cutting-edge AI/ML projects with our research team.',
      requirements: ['Python', 'TensorFlow', 'Machine Learning'],
      postedDate: '2024-01-20',
      expiryDate: '2024-03-20',
      status: 'active',
      applicants: 5
    }
  ])

  return (
    <>
      <ScrollToTop />
      <CvUploadPopup isOpen={showCvPopup} onClose={handleCloseCvPopup} />
      <Routes>
        <Route path="/" element={
          <div className="min-h-dvh bg-background text-foreground">
            <Header setShowBot={setShowBot} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <main>
              <Hero />
              <About />
              <Training />
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
            <ChatBot showBot={showBot} setShowBot={setShowBot} isLoggedIn={isLoggedIn} cvData={cvData} setCvData={setCvData} />
          </div>
        } />
        <Route path="/jobs" element={<JobListing />} />
        <Route path="/careers" element={<Careers setCvData={setCvData} jobPostings={jobPostings} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={
          <AdminLayout
            cvData={cvData}
            setCvData={setCvData}
            jobPostings={jobPostings}
            setJobPostings={setJobPostings}
            setShowAdmin={() => { }}
          />
        }>
          <Route index element={<AdminOverview />} />
          <Route path="cv-management" element={<AdminCvManagement />} />
          <Route path="job-postings" element={<AdminJobPostings />} />
          <Route path="role-management" element={<AdminRoleManagement />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>
      </Routes>
    </>
  )
}

export default App