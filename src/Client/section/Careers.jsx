import React, { useState, useCallback } from 'react'
import { Rocket, FileText, AlertTriangle, Check, Star, Flame } from 'lucide-react'

const Careers = ({ setCvData }) => {
  const [careerForm, setCareerForm] = useState({ name: '', email: '', phone: '', roleInterest: '', cvFile: null, consent: false })
  const [careerStatus, setCareerStatus] = useState('') // '', 'uploading', 'success', 'error'
  const [dragOver, setDragOver] = useState(false)

  const validateFile = useCallback((file) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    const maxSize = 10 * 1024 * 1024 // 10MB
    
    if (!allowedTypes.includes(file.type)) {
      setCareerStatus('Please upload a PDF, DOC, or DOCX file.')
      return false
    }
    
    if (file.size > maxSize) {
      setCareerStatus('File size must be less than 10MB.')
      return false
    }
    
    setCareerStatus('')
    return true
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!careerForm.name || !careerForm.email || !careerForm.phone || !careerForm.roleInterest || !careerForm.cvFile || !careerForm.consent) {
      setCareerStatus('Please fill all fields and accept the privacy policy.')
      return
    }
    setCareerStatus('uploading')
    
    // Add new CV to admin dashboard
    const newCv = {
      id: Date.now(),
      name: careerForm.name,
      email: careerForm.email,
      phone: careerForm.phone,
      role: careerForm.roleInterest,
      uploadedDate: new Date().toISOString().split('T')[0],
      status: 'active',
      retentionDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 12 months from now
    }
    setCvData(prev => [newCv, ...prev])
    
    setTimeout(() => {
      setCareerStatus('success')
      setCareerForm({ name: '', email: '', phone: '', roleInterest: '', cvFile: null, consent: false })
    }, 1500)
  }

  return (
    <section id="careers" className="min-h-dvh space-y-6 px-12">
      {/* Updated text color to use theme variables */}
      <h3 className="text-2xl font-semibold text-foreground flex items-center gap-2">
        <Rocket className="w-6 h-6" />
        <span>Careers at Fildex</span>
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          {/* Updated card to use theme variables */}
          <div className="rounded-2xl border border-border bg-muted p-6 backdrop-blur-sm">
            <h4 className="font-semibold mb-4 flex items-center gap-2 text-foreground text-xl">
              <FileText className="w-6 h-6" />
              <span>Submit Your CV</span>
            </h4>
            {/* Updated text color to use theme variables */}
            <p className="text-foreground mb-6 text-lg">Join our talent pool and be considered for exciting opportunities in training, outsourcing, and business solutions.</p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  {/* Updated label color to use theme variables */}
                  <label className="block text-sm text-muted-foreground mb-2">Full Name *</label>
                  <input 
                    value={careerForm.name} 
                    onChange={(e) => setCareerForm(c => ({ ...c, name: e.target.value }))}
                    className="w-full rounded-lg bg-card border border-input px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-ring" 
                    placeholder="Your full name" 
                  />
                </div>
                <div>
                  {/* Updated label color to use theme variables */}
                  <label className="block text-sm text-muted-foreground mb-2">Email *</label>
                  <input 
                    type="email"
                    value={careerForm.email} 
                    onChange={(e) => setCareerForm(c => ({ ...c, email: e.target.value }))}
                    className="w-full rounded-lg bg-card border border-input px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-ring" 
                    placeholder="your@email.com" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  {/* Updated label color to use theme variables */}
                  <label className="block text-sm text-muted-foreground mb-2">Phone *</label>
                  <input 
                    value={careerForm.phone} 
                    onChange={(e) => setCareerForm(c => ({ ...c, phone: e.target.value }))}
                    className="w-full rounded-lg bg-card border border-input px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-ring" 
                    placeholder="+353 XX XXX XXXX" 
                  />
                </div>
                <div>
                  {/* Updated label color to use theme variables */}
                  <label className="block text-sm text-muted-foreground mb-2">Role Interest *</label>
                  <select 
                    value={careerForm.roleInterest} 
                    onChange={(e) => setCareerForm(c => ({ ...c, roleInterest: e.target.value }))}
                    className="w-full rounded-lg bg-card border border-input px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select a role</option>
                    <option value="cloud-engineer">Cloud Engineer</option>
                    <option value="devops-engineer">DevOps Engineer</option>
                    <option value="ai-ml-developer">AI/ML Developer</option>
                    <option value="network-engineer">Network Engineer</option>
                    <option value="business-analyst">Business Analyst</option>
                    <option value="project-manager">Project Manager</option>
                    <option value="software-developer">Software Developer</option>
                    <option value="internship">Internship Program</option>
                  </select>
                </div>
              </div>
              
              <div>
                {/* Updated label color to use theme variables */}
                <label className="block text-sm text-muted-foreground mb-2">CV Upload *</label>
                <div 
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                    dragOver 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-foreground/40 hover:bg-accent'
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setDragOver(true)
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setDragOver(false)
                    const files = e.dataTransfer.files
                    if (files.length > 0) {
                      const file = files[0]
                      if (validateFile(file)) {
                        setCareerForm(c => ({ ...c, cvFile: file }))
                      }
                    }
                  }}
                >
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file && validateFile(file)) {
                        setCareerForm(c => ({ ...c, cvFile: file }))
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <FileText className="w-12 h-12 mb-3 text-foreground mx-auto" />
                  <p className="text-base text-foreground mb-2">
                    {careerForm.cvFile ? careerForm.cvFile.name : 'Drag & drop your CV here or click to browse'}
                  </p>
                  <p className="text-sm text-muted-foreground">PDF, DOC, DOCX up to 10MB</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={careerForm.consent}
                  onChange={(e) => setCareerForm(c => ({ ...c, consent: e.target.checked }))}
                  className="mt-1 rounded border-border bg-card focus:ring-primary focus:ring-offset-0"
                />
                <label className="text-sm text-muted-foreground">
                  I consent to the processing of my personal data for recruitment purposes. 
                  <a href="#privacy" className="text-primary hover:underline"> Privacy Policy</a>. 
                  Data will be retained for 12 months.
                </label>
              </div>
              
              {/* Updated button to use theme variables */}
              <button 
                disabled={careerStatus === 'uploading'}
                className="w-full rounded-lg bg-primary px-5 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60 shadow-sm transition-all duration-300"
              >
                {careerStatus === 'uploading' ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></span>
                    <span>Uploading...</span>
                  </span>
                ) : (
                  'Submit Application'
                )}
              </button>
              
              {careerStatus && careerStatus !== 'uploading' && careerStatus !== 'success' && (
                <div className="p-3 rounded-lg bg-destructive/20 border border-destructive/30">
                  <p className="text-sm text-destructive flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{careerStatus}</span>
                  </p>
                </div>
              )}
              {careerStatus === 'success' && (
                <div className="p-3 rounded-lg bg-green-600/20 border border-green-400/30 dark:bg-green-400/20 dark:border-green-300/30">
                  <p className="text-sm text-green-700 flex items-center gap-2 dark:text-green-300">
                    <Check className="w-4 h-4" />
                    <span>Application submitted successfully! We'll review your CV and contact you soon.</span>
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
        
        <div className="lg:col-span-4 space-y-4">
          {/* Updated card to use theme variables */}
          <div className="rounded-2xl border border-border bg-muted p-5 backdrop-blur-sm">
            <h4 className="font-semibold mb-3 flex items-center gap-2 text-foreground text-lg">
              <Star className="w-5 h-5" />
              <span>Why Join Fildex?</span>
            </h4>
            <ul className="space-y-2 text-base text-muted-foreground">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Cutting-edge technology</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Professional development</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Flexible working</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Competitive benefits</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Growth opportunities</li>
            </ul>
          </div>
          
          {/* Updated card to use theme variables */}
          <div className="rounded-2xl border border-border bg-muted p-5 backdrop-blur-sm">
            <h4 className="font-semibold mb-3 flex items-center gap-2 text-foreground text-lg">
              <Flame className="w-5 h-5" />
              <span>Current Openings</span>
            </h4>
            <div className="space-y-3 text-base">
              <div className="flex justify-between items-center p-3 rounded-lg bg-card">
                <span className="text-foreground">Cloud Engineer</span>
                <span className="text-muted-foreground bg-muted px-2 py-1 rounded-full text-sm">Remote</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-card">
                <span className="text-foreground">DevOps Specialist</span>
                <span className="text-muted-foreground bg-muted px-2 py-1 rounded-full text-sm">Dublin</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-card">
                <span className="text-foreground">AI/ML Developer</span>
                <span className="text-muted-foreground bg-muted px-2 py-1 rounded-full text-sm">Hybrid</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-card">
                <span className="text-foreground">Internship Program</span>
                <span className="text-muted-foreground bg-muted px-2 py-1 rounded-full text-sm">6 months</span>
              </div>
            </div>
            <a href="#contact" className="block mt-4 text-center text-sm text-primary hover:underline">View All Openings</a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Careers