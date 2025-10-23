import React, { useState } from 'react'

const JobApplicationForm = ({ job, onApply, onCancel }) => {
  const [applicationData, setApplicationData] = useState({
    name: '',
    email: '',
    phone: '',
    coverLetter: '',
    cvFile: null
  })
  const [applicationStatus, setApplicationStatus] = useState('') // '', 'uploading', 'success', 'error'
  const [dragOver, setDragOver] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({ name: '', email: '', phone: '' })

  const validateFile = (file) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    const maxSize = 10 * 1024 * 1024 // 10MB
    
    if (!allowedTypes.includes(file.type)) {
      setApplicationStatus('Please upload a PDF, DOC, or DOCX file.')
      return false
    }
    
    if (file.size > maxSize) {
      setApplicationStatus('File size must be less than 10MB.')
      return false
    }
    
    setApplicationStatus('')
    return true
  }

  // Validation functions
  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name) && name.trim().length >= 2;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const numericPhone = phone.replace(/\D/g, '');
    return numericPhone.length >= 7 && numericPhone.length <= 15;
  };

  // Real-time validation handlers
  const handleNameChange = (e) => {
    const value = e.target.value;
    setApplicationData(prev => ({ ...prev, name: value }));
    
    if (value && !validateName(value)) {
      setFieldErrors(prev => ({ ...prev, name: 'Name should contain only alphabetic characters' }));
    } else {
      setFieldErrors(prev => ({ ...prev, name: '' }));
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setApplicationData(prev => ({ ...prev, email: value }));
    
    if (value && !validateEmail(value)) {
      setFieldErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
    } else {
      setFieldErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setApplicationData(prev => ({ ...prev, phone: value }));
    
    if (value && !validatePhone(value)) {
      setFieldErrors(prev => ({ ...prev, phone: 'Phone should contain 7-15 numeric digits' }));
    } else {
      setFieldErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Clear previous status
    setApplicationStatus('')
    
    // Validate required fields presence
    if (!applicationData.name || !applicationData.email || !applicationData.phone || !applicationData.cvFile) {
      setApplicationStatus('Please fill all required fields and upload your CV.')
      return
    }
    
    // Validate name format
    if (!validateName(applicationData.name)) {
      setApplicationStatus('Full name should contain only alphabetic characters and be at least 2 characters long.')
      return
    }
    
    // Validate email format
    if (!validateEmail(applicationData.email)) {
      setApplicationStatus('Please enter a valid email address.')
      return
    }
    
    // Validate phone number format
    if (!validatePhone(applicationData.phone)) {
      setApplicationStatus('Phone number should contain only numeric digits and be between 7-15 digits long.')
      return
    }
    
    setApplicationStatus('uploading')
    
    setTimeout(() => {
      setApplicationStatus('success')
      onApply({
        jobId: job.id,
        jobTitle: job.title,
        ...applicationData,
        appliedDate: new Date().toISOString().split('T')[0]
      })
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-purple-400/20 bg-linear-to-br from-purple-900/50 to-purple-800/30 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <span>📄</span>
            <span>Apply for {job.title}</span>
          </h3>
          <button 
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center rounded-full text-purple-300 hover:text-white hover:bg-purple-500/10 transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="mb-6 p-4 rounded-lg bg-white/5">
          <div className="text-sm text-purple-200">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-white">{job.title}</span>
              <span className="text-xs bg-purple-600/20 text-purple-200 rounded-full px-2 py-1">
                {job.type}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span>{job.department}</span>
              <span>•</span>
              <span>{job.location}</span>
              {job.salary && (
                <>
                  <span>•</span>
                  <span>{job.salary}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs text-purple-300 mb-2">Full Name *</label>
              <input 
                value={applicationData.name} 
                onChange={handleNameChange}
                className={`w-full rounded-lg bg-purple-500/10 border px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-colors ${
                  fieldErrors.name ? 'border-red-400/60 focus:border-red-400' : 'border-purple-400/20 focus:border-purple-400'
                }`}
                placeholder="Your full name" 
              />
              {fieldErrors.name && (
                <p className="text-xs text-red-300 mt-1">{fieldErrors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-xs text-purple-300 mb-2">Email *</label>
              <input 
                type="email"
                value={applicationData.email} 
                onChange={handleEmailChange}
                className={`w-full rounded-lg bg-purple-500/10 border px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-colors ${
                  fieldErrors.email ? 'border-red-400/60 focus:border-red-400' : 'border-purple-400/20 focus:border-purple-400'
                }`}
                placeholder="your@email.com" 
              />
              {fieldErrors.email && (
                <p className="text-xs text-red-300 mt-1">{fieldErrors.email}</p>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-purple-300 mb-2">Phone *</label>
            <input 
              value={applicationData.phone} 
              onChange={handlePhoneChange}
              className={`w-full rounded-lg bg-purple-500/10 border px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-colors ${
                fieldErrors.phone ? 'border-red-400/60 focus:border-red-400' : 'border-purple-400/20 focus:border-purple-400'
              }`}
              placeholder="+353 XX XXX XXXX" 
            />
            {fieldErrors.phone && (
              <p className="text-xs text-red-300 mt-1">{fieldErrors.phone}</p>
            )}
          </div>
          
          <div>
            <label className="block text-xs text-purple-300 mb-2">Cover Letter</label>
            <textarea 
              value={applicationData.coverLetter} 
              onChange={(e) => setApplicationData(prev => ({ ...prev, coverLetter: e.target.value }))}
              rows={4}
              className="w-full rounded-lg bg-purple-500/10 border border-purple-400/20 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400" 
              placeholder="Tell us why you're interested in this position..."
            />
          </div>
          
          <div>
            <label className="block text-xs text-purple-300 mb-2">CV Upload *</label>
            <div 
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                dragOver 
                  ? 'border-purple-400 bg-purple-500/20 shadow-lg shadow-purple-500/10' 
                  : 'border-white/20 hover:border-white/40 hover:bg-purple-500/10'
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
                    setApplicationData(prev => ({ ...prev, cvFile: file }))
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
                    setApplicationData(prev => ({ ...prev, cvFile: file }))
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-4xl mb-3">📄</div>
              <p className="text-sm text-purple-200 mb-2">
                {applicationData.cvFile ? applicationData.cvFile.name : 'Drag & drop your CV here or click to browse'}
              </p>
              <p className="text-xs text-purple-300">PDF, DOC, DOCX up to 10MB</p>
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-purple-400/30 px-5 py-2.5 text-sm hover:bg-purple-500/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={applicationStatus === 'uploading'}
              className="rounded-lg bg-linear-to-tr from-purple-500 to-purple-700 px-5 py-2.5 text-sm font-medium hover:brightness-110 disabled:opacity-60 shadow-lg shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-0.5 disabled:transform-none"
            >
              {applicationStatus === 'uploading' ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Submitting...</span>
                </span>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
          
          {applicationStatus && applicationStatus !== 'uploading' && applicationStatus !== 'success' && (
            <div className="p-3 rounded-lg bg-red-600/20 border border-red-400/30">
              <p className="text-xs text-red-300 flex items-center gap-2">
                <span>⚠️</span>
                <span>{applicationStatus}</span>
              </p>
            </div>
          )}
          {applicationStatus === 'success' && (
            <div className="p-3 rounded-lg bg-green-600/20 border border-green-400/30">
              <p className="text-xs text-green-300 flex items-center gap-2">
                <span>✅</span>
                <span>Application submitted successfully! We'll review your application and contact you soon.</span>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default JobApplicationForm
