import React from 'react'
import SEO from '../../components/SEO'
import { OrganizationSchema, WebSiteSchema, ServiceSchema } from '../../components/StructuredData'
import Header from '../section/Header'
import Hero from '../section/Hero'
import About from '../section/About'
import Training from '../section/Trainning'
import Contact from '../section/Contact'
import Footer from '../section/Footer'
import ChatBot from '../components/ChatBot'

const HomePage = ({ showBot, setShowBot, cvData, setCvData }) => {
  const structuredData = [
    OrganizationSchema,
    WebSiteSchema,
    ServiceSchema
  ]

  return (
    <>
      <SEO
        title="Fildex Solutions - Complete Digital Service Provider"
        description="Fildex Solutions offers comprehensive digital services including website development, software solutions, IT training, cloud engineering, DevOps, AI/ML, and business process support in Cork, Ireland."
        keywords="digital services, website development, software solutions, IT training, cloud engineering, DevOps, AI/ML, business process, Cork, Ireland, recruitment, job opportunities, training courses, professional development"
        structuredData={structuredData}
        url="https://fildex.ie/"
      />
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
    </>
  )
}

export default HomePage
