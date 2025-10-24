import React, { useState, useCallback, useEffect } from 'react'
import { Rocket, FileText, AlertTriangle, Check, Star, Flame, Briefcase, MapPin, Calendar, ArrowRight, Clock } from 'lucide-react'
import FildexLogo from '/images/FILDEX_SOLUTIONS.png'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { uploadResume } from '../../features/resume/resumeSlice'
import { getAllJobPostings } from '../../features/admin/adminSlice'
import { addCvUploadNotification } from '../../features/notifications/notificationSlice'
import { api } from '../../config/api'
import { toast } from 'sonner'
import CareersHeader from './CareersHeader'

const Careers = ({ setCvData, jobPostings, isLoggedIn, setIsLoggedIn }) => {
  const [careerForm, setCareerForm] = useState({ name: '', email: '', phone: '', jobTitle: '', cvFile: null, consent: false })
  const [careerStatus, setCareerStatus] = useState('') // '', 'uploading', 'success', 'error'
  const [dragOver, setDragOver] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [jobTitles, setJobTitles] = useState([])
  const [latestJobs, setLatestJobs] = useState([])
  const [isLoadingJobs, setIsLoadingJobs] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({ name: '', email: '', phone: '' })
  
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const { isLoading, error, uploadStatus } = useSelector((state) => state.resume)

  // Load job titles and latest jobs on component mount
  useEffect(() => {
    loadJobTitles()
    loadLatestJobs()
  }, [])

  const loadJobTitles = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'
      const response = await fetch(`${API_BASE_URL}/public/job-titles`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const text = await response.text()
      if (!text) {
        setJobTitles([])
        return
      }
      
      const data = JSON.parse(text)
      if (data.data && Array.isArray(data.data)) {
        const activeJobTitles = data.data.filter(jobTitle => jobTitle.isDeleted !== true)
        setJobTitles(activeJobTitles)
      } else if (Array.isArray(data)) {
        // Handle case where data is directly an array
        const activeJobTitles = data.filter(jobTitle => jobTitle.isDeleted !== true)
        setJobTitles(activeJobTitles)
      } else {
        setJobTitles([])
      }
    } catch (error) {
      setJobTitles([])
    }
  }

  const loadLatestJobs = async () => {
    setIsLoadingJobs(true)
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'
      const response = await fetch(`${API_BASE_URL}/public/job-postings?page=1&limit=5`)
      const data = await response.json()
      if (data.data && data.data.jobs && Array.isArray(data.data.jobs)) {
        const activeJobs = data.data.jobs.filter(job => job.status === 'active')
        setLatestJobs(activeJobs)
      }
    } catch (error) {
    } finally {
      setIsLoadingJobs(false)
    }
  }

  // Use latest jobs from API or fallback to props
  const activeJobs = latestJobs.length > 0 ? latestJobs : (jobPostings?.filter(job => job.status === 'active') || [])

  const validateFile = useCallback((file) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      setCareerStatus('Please upload a PDF, DOC, or DOCX file.')
      return false
    }

    if (file.size > maxSize) {
      setCareerStatus('File size must be less than 5MB.')
      return false
    }

    setCareerStatus('')
    return true
  }, [])

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
    // Remove all non-numeric characters for validation
    const numericPhone = phone.replace(/\D/g, '');
    // Check if it's between 7-15 digits (international standard)
    return numericPhone.length >= 7 && numericPhone.length <= 15;
  };

  // Real-time validation handlers
  const handleNameChange = (e) => {
    const value = e.target.value;
    setCareerForm(c => ({ ...c, name: value }));
    
    if (value && !validateName(value)) {
      setFieldErrors(prev => ({ ...prev, name: 'Name should contain only alphabetic characters' }));
    } else {
      setFieldErrors(prev => ({ ...prev, name: '' }));
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setCareerForm(c => ({ ...c, email: value }));
    
    if (value && !validateEmail(value)) {
      setFieldErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
    } else {
      setFieldErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setCareerForm(c => ({ ...c, phone: value }));
    
    if (value && !validatePhone(value)) {
      setFieldErrors(prev => ({ ...prev, phone: 'Phone should contain 7-15 numeric digits' }));
    } else {
      setFieldErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous status
    setCareerStatus('');
    
    // Validate required fields presence
    if (!careerForm.name || !careerForm.email || !careerForm.phone || !careerForm.jobTitle || !careerForm.cvFile || !careerForm.consent) {
      setCareerStatus('Please fill all fields and accept the privacy policy.');
      return;
    }
    
    // Validate name format (alphabetic characters only)
    if (!validateName(careerForm.name)) {
      setCareerStatus('Full name should contain only alphabetic characters and be at least 2 characters long.');
      return;
    }
    
    // Validate email format
    if (!validateEmail(careerForm.email)) {
      setCareerStatus('Please enter a valid email address.');
      return;
    }
    
    // Validate phone number format
    if (!validatePhone(careerForm.phone)) {
      setCareerStatus('Phone number should contain only numeric digits and be between 7-15 digits long.');
      return;
    }
    
    setCareerStatus('uploading');

    try {
      // Create FormData for the new resume API
      const formData = new FormData();
      formData.append('resume', careerForm.cvFile);
      formData.append('name', careerForm.name);
      formData.append('email', careerForm.email);
      formData.append('role', careerForm.jobTitle);
      
      // Add contact information
      formData.append('contact', JSON.stringify({
        number: careerForm.phone,
        country_code: '+353' // Default to Ireland, could be made dynamic
      }));
      
      // Upload to backend using the new dedicated resume API
      const result = await dispatch(uploadResume(formData)).unwrap();
      
      // Add to local admin dashboard for demo purposes
      const newCv = {
        id: Date.now(),
        name: careerForm.name,
        email: careerForm.email,
        phone: careerForm.phone,
        role: careerForm.jobTitle,
        uploadedDate: new Date().toISOString().split('T')[0],
        status: 'new',
        retentionDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days from now
        cvUrl: result.data?.['resume-link'] || null
      }
      setCvData(prev => [newCv, ...prev]);
      
      setCareerStatus('success');
      setCareerForm({ name: '', email: '', phone: '', jobTitle: '', cvFile: null, consent: false });
      
      // Trigger notification for admin
      dispatch(addCvUploadNotification({
        name: careerForm.name,
        role: careerForm.jobTitle,
        email: careerForm.email,
        phone: careerForm.phone
      }));
      
    } catch (error) {
      setCareerStatus(`Upload failed: ${error.message || 'Please try again.'}`);
    }
  }

  return (
    <div className="min-h-dvh bg-background">
      <CareersHeader />
      <section id="careers" className="space-y-8 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">

        {/* Section header with improved typography */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <Rocket className="w-8 h-8 text-primary" />
            <span>Careers at Fildex</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            {/* Updated card with LMS styling */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-foreground">Submit Your CV</h3>
                  <p className="text-muted-foreground">Join our talent pool for exciting opportunities</p>
                </div>
              </div>

              <p className="text-foreground mb-6 text-lg">
                Join our talent pool and be considered for exciting opportunities in training and business solutions.
              </p>
              
              {/* Authentication Status - REMOVED for public upload */}
              {/* {!isAuthenticated ? (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <p className="text-yellow-800">
                      <strong>Login Required:</strong> Please login to submit your application.
                      <Link to="/login" className="text-yellow-900 underline hover:no-underline ml-1">
                        Login here
                      </Link>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <p className="text-green-800">
                      <strong>Logged in as:</strong> {user?.name || user?.email}
                    </p>
                  </div>
                </div>
              )} */}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Full Name *</label>
                    <input
                      value={careerForm.name}
                      onChange={handleNameChange}
                      className={`w-full rounded-lg bg-background border px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-ring transition-colors ${
                        fieldErrors.name ? 'border-destructive focus:border-destructive' : 'border-input focus:border-primary'
                      }`}
                      placeholder="Your full name"
                    />
                    {fieldErrors.name && (
                      <p className="text-sm text-destructive mt-1">{fieldErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Email *</label>
                    <input
                      type="email"
                      value={careerForm.email}
                      onChange={handleEmailChange}
                      className={`w-full rounded-lg bg-background border px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-ring transition-colors ${
                        fieldErrors.email ? 'border-destructive focus:border-destructive' : 'border-input focus:border-primary'
                      }`}
                      placeholder="your@email.com"
                    />
                    {fieldErrors.email && (
                      <p className="text-sm text-destructive mt-1">{fieldErrors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Phone *</label>
                    <input
                      value={careerForm.phone}
                      onChange={handlePhoneChange}
                      className={`w-full rounded-lg bg-background border px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-ring transition-colors ${
                        fieldErrors.phone ? 'border-destructive focus:border-destructive' : 'border-input focus:border-primary'
                      }`}
                      placeholder="+353 XX XXX XXXX"
                    />
                    {fieldErrors.phone && (
                      <p className="text-sm text-destructive mt-1">{fieldErrors.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Job Title *</label>
                    <select
                      value={careerForm.jobTitle}
                      onChange={(e) => setCareerForm(c => ({ ...c, jobTitle: e.target.value }))}
                      className="w-full rounded-lg bg-background border border-input px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
                    >
                      <option value="">Select a job title</option>
                      {jobTitles.length > 0 ? (
                        jobTitles.map((jobTitle) => (
                          <option key={jobTitle._id} value={jobTitle.name}>
                            {jobTitle.name}
                          </option>
                        ))
                      ) : (
                        // Fallback options if API fails
                        <>
                          <option value="cloud-engineer">Cloud Engineer</option>
                          <option value="devops-engineer">DevOps Engineer</option>
                          <option value="ai-ml-developer">AI/ML Developer</option>
                          <option value="network-engineer">Network Engineer</option>
                          <option value="business-analyst">Business Analyst</option>
                          <option value="project-manager">Project Manager</option>
                          <option value="software-developer">Software Developer</option>
                          <option value="internship">Internship Program</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">CV Upload *</label>
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
                    <p className="text-sm text-muted-foreground">PDF, DOC, DOCX up to 5MB</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={careerForm.consent}
                    onChange={(e) => setCareerForm(c => ({ ...c, consent: e.target.checked }))}
                    className="mt-1 rounded border-border bg-background focus:ring-primary focus:ring-offset-0"
                  />
                  <label className="text-sm text-muted-foreground">
                    I consent to the processing of my personal data for recruitment purposes.
                    <a href="/privacy-policy" className="text-primary hover:underline"> Privacy Policy</a>.
                    Data will be retained for 6 months.
                  </label>
                </div>

                <button
                  disabled={careerStatus === 'uploading' || isLoading}
                  className="w-full rounded-lg bg-primary px-5 py-3 text-base font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 shadow-md transition-all duration-300"
                >
                  {careerStatus === 'uploading' || isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-block w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></span>
                      <span>Uploading...</span>
                    </span>
                  ) : (
                    'Submit Application'
                  )}
                </button>

                {(careerStatus && careerStatus !== 'uploading' && careerStatus !== 'success') || error ? (
                  <div className="p-4 rounded-lg bg-destructive/20 border border-destructive/30">
                    <p className="text-sm text-destructive flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{error || careerStatus}</span>
                    </p>
                  </div>
                ) : null}
                {careerStatus === 'success' && (
                  <div className="p-4 rounded-lg bg-green-600/20 border border-green-400/30 dark:bg-green-400/20 dark:border-green-300/30">
                    <p className="text-sm text-green-700 flex items-center gap-2 dark:text-green-300">
                      <Check className="w-4 h-4" />
                      <span>Application submitted successfully! We'll review your CV and contact you soon.</span>
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Open Positions Section */}
          <div className="lg:col-span-4">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-2xl text-foreground">Open Positions</h3>
                <button className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold hover:bg-primary/20 transition-colors">
                  {activeJobs.length} Roles
                </button>
              </div>

              {isLoadingJobs ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading latest positions...</p>
                </div>
              ) : activeJobs.length > 0 ? (
                <div className="space-y-5">
                  {activeJobs.map((job) => (
                    <div key={job._id || job.id} className="border-b border-border pb-5 last:border-0 last:pb-0">
                      <h4 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                        {job.job_title || job.title}
                      </h4>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {job.department && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Briefcase className="w-4 h-4" />
                            <span>
                              {typeof job.department === 'object' 
                                ? job.department.name 
                                : job.department}
                            </span>
                          </div>
                        )}
                        {job.location && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                        )}
                        {job.salary_range && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <span className="text-green-600 font-semibold">€</span>
                            <span>{job.salary_range}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-muted-foreground text-base mb-4 line-clamp-2">
                        {job.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}</span>
                        </div>
                        {job.deadline && (
                          <div className="flex items-center gap-1 text-sm text-orange-600 dark:text-orange-400 font-medium">
                            <Clock className="w-4 h-4" />
                            <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-muted/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h4 className="font-semibold text-xl text-foreground mb-2">No open positions</h4>
                  <p className="text-base text-muted-foreground mb-4">
                    Check back soon for new opportunities!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </section>
    </div>
  )
}

export default Careers
