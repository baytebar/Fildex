import React, { useState, useCallback } from 'react'

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
    <section id="careers" className="space-y-6">
      <h3 className="text-xl font-semibold text-white">Careers at Fildex</h3>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <div className="rounded-2xl border border-purple-400/20 bg-purple-500/10 p-6">
            <h4 className="font-semibold mb-4">Submit Your CV</h4>
            <p className="text-purple-100 mb-6">Join our talent pool and be considered for exciting opportunities in training, outsourcing, and business solutions.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-purple-300 mb-1">Full Name *</label>
                  <input 
                    value={careerForm.name} 
                    onChange={(e) => setCareerForm(c => ({ ...c, name: e.target.value }))}
                    className="w-full rounded-md bg-purple-500/10 border border-purple-400/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40" 
                    placeholder="Your full name" 
                  />
                </div>
                <div>
                  <label className="block text-xs text-purple-300 mb-1">Email *</label>
                  <input 
                    type="email"
                    value={careerForm.email} 
                    onChange={(e) => setCareerForm(c => ({ ...c, email: e.target.value }))}
                    className="w-full rounded-md bg-purple-500/10 border border-purple-400/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40" 
                    placeholder="your@email.com" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-purple-300 mb-1">Phone *</label>
                  <input 
                    value={careerForm.phone} 
                    onChange={(e) => setCareerForm(c => ({ ...c, phone: e.target.value }))}
                    className="w-full rounded-md bg-purple-500/10 border border-purple-400/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40" 
                    placeholder="+353 XX XXX XXXX" 
                  />
                </div>
                <div>
                  <label className="block text-xs text-purple-300 mb-1">Role Interest *</label>
                  <select 
                    value={careerForm.roleInterest} 
                    onChange={(e) => setCareerForm(c => ({ ...c, roleInterest: e.target.value }))}
                    className="w-full rounded-md bg-purple-500/10 border border-purple-400/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
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
                <label className="block text-xs text-purple-300 mb-1">CV Upload *</label>
                <div 
                  className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragOver ? 'border-purple-400 bg-purple-500/10' : 'border-white/20 hover:border-white/40'}`}
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
                  <div className="text-4xl mb-2">📄</div>
                  <p className="text-sm text-purple-200 mb-2">
                    {careerForm.cvFile ? careerForm.cvFile.name : 'Drag & drop your CV here or click to browse'}
                  </p>
                  <p className="text-xs text-purple-300">PDF, DOC, DOCX up to 10MB</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={careerForm.consent}
                  onChange={(e) => setCareerForm(c => ({ ...c, consent: e.target.checked }))}
                  className="mt-1 rounded border-white/20 bg-white/5"
                />
                <label className="text-xs text-purple-200">
                  I consent to the processing of my personal data for recruitment purposes. 
                  <a href="#privacy" className="text-purple-300 hover:underline">Privacy Policy</a>. 
                  Data will be retained for 12 months.
                </label>
              </div>
              
              <button 
                disabled={careerStatus === 'uploading'}
                className="w-full rounded-md bg-gradient-to-tr from-purple-500 to-purple-700 px-5 py-2 text-sm font-medium hover:brightness-110 disabled:opacity-60 shadow-lg shadow-purple-500/25"
              >
                {careerStatus === 'uploading' ? 'Uploading...' : 'Submit Application'}
              </button>
              
              {careerStatus && careerStatus !== 'uploading' && careerStatus !== 'success' && (
                <p className="text-xs text-red-300">{careerStatus}</p>
              )}
              {careerStatus === 'success' && (
                <p className="text-xs text-green-300">✅ Application submitted successfully! We'll review your CV and contact you soon.</p>
              )}
            </form>
          </div>
        </div>
        
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-purple-400/20 bg-purple-500/10 p-5">
            <h4 className="font-semibold mb-3">Why Join Fildex?</h4>
            <ul className="space-y-2 text-sm text-purple-200">
              <li className="flex items-center gap-2"><span>✓</span> Cutting-edge technology</li>
              <li className="flex items-center gap-2"><span>✓</span> Professional development</li>
              <li className="flex items-center gap-2"><span>✓</span> Flexible working</li>
              <li className="flex items-center gap-2"><span>✓</span> Competitive benefits</li>
              <li className="flex items-center gap-2"><span>✓</span> Growth opportunities</li>
            </ul>
          </div>
          
          <div className="rounded-2xl border border-purple-400/20 bg-purple-500/10 p-5">
            <h4 className="font-semibold mb-3">Current Openings</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-purple-200">Cloud Engineer</span>
                <span className="text-purple-300">Remote</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-200">DevOps Specialist</span>
                <span className="text-purple-300">Dublin</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-200">AI/ML Developer</span>
                <span className="text-purple-300">Hybrid</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-200">Internship Program</span>
                <span className="text-purple-300">6 months</span>
              </div>
            </div>
            <a href="#contact" className="block mt-3 text-center text-xs text-purple-300 hover:underline">View All Openings</a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Careers
