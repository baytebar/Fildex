import React, { useState, useMemo, useCallback } from 'react'
import JobPostingForm from '../../Admin/components/JobPostingForm'
import { 
  BarChart, Search, FileText, Check, Clock, Users, 
  Mail, Trash2, FolderOpen, Briefcase, Pause, Play, 
  Plus, LogOut, X 
} from 'lucide-react'

const AdminDashboard = ({ showAdmin, setShowAdmin, cvData, setCvData, jobPostings, setJobPostings }) => {
  const [adminAuth, setAdminAuth] = useState({ username: '', password: '', authenticated: false })
  const [adminFilters, setAdminFilters] = useState({ search: '', role: '', status: '', sortBy: 'uploadedDate', sortOrder: 'desc' })
  const [activeTab, setActiveTab] = useState('cv') // 'cv' or 'jobs'
  const [showJobForm, setShowJobForm] = useState(false)
  const [jobFilters, setJobFilters] = useState({ search: '', department: '', status: '', sortBy: 'postedDate', sortOrder: 'desc' })
  const [jobApplications, setJobApplications] = useState([]) // For tracking job applications

  const handleAdminLogin = useCallback((e) => {
    e.preventDefault()
    // Demo authentication - in production, this would be server-side
    if (adminAuth.username === 'admin' && adminAuth.password === 'fildex2024') {
      setAdminAuth(prev => ({ ...prev, authenticated: true }))
    } else {
      alert('Invalid credentials')
    }
  }, [adminAuth.username, adminAuth.password])

  const filteredCvData = useMemo(() => {
    let filtered = cvData.filter(cv => {
      const matchesSearch = !adminFilters.search || 
        cv.name.toLowerCase().includes(adminFilters.search.toLowerCase()) ||
        cv.email.toLowerCase().includes(adminFilters.search.toLowerCase())
      const matchesRole = !adminFilters.role || cv.role === adminFilters.role
      const matchesStatus = !adminFilters.status || cv.status === adminFilters.status
      return matchesSearch && matchesRole && matchesStatus
    })

    filtered.sort((a, b) => {
      const aVal = a[adminFilters.sortBy]
      const bVal = b[adminFilters.sortBy]
      if (adminFilters.sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

    return filtered
  }, [cvData, adminFilters])

  const filteredJobPostings = useMemo(() => {
    let filtered = jobPostings.filter(job => {
      const matchesSearch = !jobFilters.search || 
        job.title.toLowerCase().includes(jobFilters.search.toLowerCase()) ||
        job.department.toLowerCase().includes(jobFilters.search.toLowerCase())
      const matchesDepartment = !jobFilters.department || job.department === jobFilters.department
      const matchesStatus = !jobFilters.status || job.status === jobFilters.status
      return matchesSearch && matchesDepartment && matchesStatus
    })

    filtered.sort((a, b) => {
      const aVal = a[jobFilters.sortBy]
      const bVal = b[jobFilters.sortBy]
      if (jobFilters.sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

    return filtered
  }, [jobPostings, jobFilters])

  const exportCvData = useCallback(() => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Name,Email,Phone,Role,Upload Date,Status,Retention Date\n" +
      filteredCvData.map(cv => `${cv.name},${cv.email},${cv.phone},${cv.role},${cv.uploadedDate},${cv.status},${cv.retentionDate}`).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `cv_data_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [filteredCvData])

  const deleteCv = useCallback((id) => {
    if (confirm('Are you sure you want to delete this CV? This action cannot be undone.')) {
      setCvData(prev => prev.filter(cv => cv.id !== id))
    }
  }, [setCvData])

  const addJobPosting = useCallback((newJob) => {
    setJobPostings(prev => [newJob, ...prev])
    setShowJobForm(false)
  }, [setJobPostings])

  const deleteJobPosting = useCallback((id) => {
    if (confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
      setJobPostings(prev => prev.filter(job => job.id !== id))
    }
  }, [setJobPostings])

  const toggleJobStatus = useCallback((id) => {
    setJobPostings(prev => prev.map(job => {
      if (job.id === id) {
        return { ...job, status: job.status === 'active' ? 'inactive' : 'active' }
      }
      return job
    }))
  }, [setJobPostings])

  // Function to add a job application (simulating receiving applications)
  const addJobApplication = useCallback((application) => {
    setJobApplications(prev => [...prev, { ...application, id: Date.now() }])
    // Update the job posting to increment applicant count
    setJobPostings(prev => prev.map(job => {
      if (job.id === application.jobId) {
        return { ...job, applicants: job.applicants + 1 }
      }
      return job
    }))
  }, [setJobPostings])

  if (!showAdmin) return null

  return (
    <section className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Updated modal to use theme variables */}
      <div className="w-full max-w-6xl max-h-[90vh] overflow-auto rounded-2xl border border-border bg-card backdrop-blur-lg shadow-2xl">
        {!adminAuth.authenticated ? (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-foreground">Admin Dashboard</h3>
              <button 
                onClick={() => setShowAdmin(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAdminLogin} className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Username</label>
                <input
                  type="text"
                  value={adminAuth.username}
                  onChange={(e) => setAdminAuth(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full rounded-lg bg-card border border-input px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Password</label>
                <input
                  type="password"
                  value={adminAuth.password}
                  onChange={(e) => setAdminAuth(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full rounded-lg bg-card border border-input px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter password"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 shadow-sm transition-all duration-300"
              >
                Login
              </button>
            </form>
            
            <div className="mt-6 text-center text-xs text-muted-foreground">
              Demo: username: admin, password: fildex2024
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-foreground">Admin Dashboard</h3>
              <button 
                onClick={() => setShowAdmin(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Tabs with modern styling */}
            <div className="flex border-b border-border mb-6">
              <button
                onClick={() => setActiveTab('cv')}
                className={`px-5 py-3 text-sm font-medium relative transition-colors ${
                  activeTab === 'cv' 
                    ? 'text-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                CV Management
                {activeTab === 'cv' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`px-5 py-3 text-sm font-medium relative transition-colors ${
                  activeTab === 'jobs' 
                    ? 'text-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Job Postings
                {activeTab === 'jobs' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></div>
                )}
              </button>
            </div>
            
            {activeTab === 'cv' && !showJobForm && (
              <>
                {/* CV Filters with modern design */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="relative">
                    <label className="block text-xs text-muted-foreground mb-1">Search</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={adminFilters.search}
                        onChange={(e) => setAdminFilters(prev => ({ ...prev, search: e.target.value }))}
                        className="w-full rounded-lg bg-card border border-input px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring pl-10"
                        placeholder="Name or email"
                      />
                      <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Role</label>
                    <select
                      value={adminFilters.role}
                      onChange={(e) => setAdminFilters(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full rounded-lg bg-card border border-input px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">All Roles</option>
                      <option value="cloud-engineer">Cloud Engineer</option>
                      <option value="devops-engineer">DevOps Engineer</option>
                      <option value="ai-ml-developer">AI/ML Developer</option>
                      <option value="network-engineer">Network Engineer</option>
                      <option value="software-developer">Software Developer</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Status</label>
                    <select
                      value={adminFilters.status}
                      onChange={(e) => setAdminFilters(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full rounded-lg bg-card border border-input px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">All Status</option>
                      <option value="active">Active</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Sort By</label>
                    <select
                      value={`${adminFilters.sortBy}-${adminFilters.sortOrder}`}
                      onChange={(e) => {
                        const [sortBy, sortOrder] = e.target.value.split('-')
                        setAdminFilters(prev => ({ ...prev, sortBy, sortOrder }))
                      }}
                      className="w-full rounded-lg bg-card border border-input px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="uploadedDate-desc">Newest First</option>
                      <option value="uploadedDate-asc">Oldest First</option>
                      <option value="name-asc">Name A-Z</option>
                      <option value="name-desc">Name Z-A</option>
                      <option value="retentionDate-asc">Retention Date</option>
                    </select>
                  </div>
                </div>
                
                {/* CV Statistics with modern cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {/* Updated cards to use theme variables */}
                  <div className="rounded-xl border border-border bg-muted p-4 backdrop-blur-sm">
                    <div className="text-2xl font-semibold text-foreground">{cvData.length}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <span>Total CVs</span>
                      <FileText className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="rounded-xl border border-border bg-muted p-4 backdrop-blur-sm">
                    <div className="text-2xl font-semibold text-foreground">{cvData.filter(cv => cv.status === 'active').length}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <span>Active CVs</span>
                      <Check className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="rounded-xl border border-border bg-muted p-4 backdrop-blur-sm">
                    <div className="text-2xl font-semibold text-foreground">{cvData.filter(cv => cv.status === 'expired').length}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <span>Expired CVs</span>
                      <Clock className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="rounded-xl border border-border bg-muted p-4 backdrop-blur-sm">
                    <div className="text-2xl font-semibold text-foreground">{filteredCvData.length}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <span>Filtered</span>
                      <Search className="w-3 h-3" />
                    </div>
                  </div>
                </div>
                
                {/* CV Table with modern styling */}
                <div className="rounded-xl border border-border bg-muted overflow-hidden backdrop-blur-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-3 text-left text-muted-foreground font-medium">Name</th>
                          <th className="px-4 py-3 text-left text-muted-foreground font-medium">Email</th>
                          <th className="px-4 py-3 text-left text-muted-foreground font-medium">Phone</th>
                          <th className="px-4 py-3 text-left text-muted-foreground font-medium">Role</th>
                          <th className="px-4 py-3 text-left text-muted-foreground font-medium">Uploaded</th>
                          <th className="px-4 py-3 text-left text-muted-foreground font-medium">Status</th>
                          <th className="px-4 py-3 text-left text-muted-foreground font-medium">Retention</th>
                          <th className="px-4 py-3 text-left text-muted-foreground font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCvData.map((cv) => (
                          <tr key={cv.id} className="border-t border-border hover:bg-accent transition-colors">
                            <td className="px-4 py-3 text-foreground font-medium">{cv.name}</td>
                            <td className="px-4 py-3 text-muted-foreground">{cv.email}</td>
                            <td className="px-4 py-3 text-muted-foreground">{cv.phone}</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-muted text-muted-foreground font-medium">
                                {cv.role.replace('-', ' ')}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">{cv.uploadedDate}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                cv.status === 'active' ? 'bg-green-600/20 text-green-700 dark:text-green-300' : 'bg-red-600/20 text-red-700 dark:text-red-300'
                              }`}>
                                {cv.status === 'active' ? 'Active' : 'Expired'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">{cv.retentionDate}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => window.open(`mailto:${cv.email}`, '_blank')}
                                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-muted text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                                  title="Send Email"
                                >
                                  <Mail className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteCv(cv.id)}
                                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-destructive/20 text-destructive hover:text-destructive-foreground hover:bg-destructive/30 transition-colors"
                                  title="Delete CV"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {filteredCvData.length === 0 && (
                    <div className="p-12 text-center text-muted-foreground">
                      <FolderOpen className="w-12 h-12 mb-3 mx-auto text-foreground" />
                      <p className="text-lg">No CVs found</p>
                      <p className="text-sm mt-1">Try adjusting your filters or upload a new CV</p>
                    </div>
                  )}
                </div>
              </>
            )}
            
            {activeTab === 'jobs' && !showJobForm && (
              <>
                {/* Job Filters with modern design */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="relative">
                    <label className="block text-xs text-muted-foreground mb-1">Search</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={jobFilters.search}
                        onChange={(e) => setJobFilters(prev => ({ ...prev, search: e.target.value }))}
                        className="w-full rounded-lg bg-card border border-input px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring pl-10"
                        placeholder="Job title or department"
                      />
                      <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Department</label>
                    <select
                      value={jobFilters.department}
                      onChange={(e) => setJobFilters(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full rounded-lg bg-card border border-input px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">All Departments</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Operations">Operations</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                      <option value="HR">HR</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Status</label>
                    <select
                      value={jobFilters.status}
                      onChange={(e) => setJobFilters(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full rounded-lg bg-card border border-input px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Sort By</label>
                    <select
                      value={`${jobFilters.sortBy}-${jobFilters.sortOrder}`}
                      onChange={(e) => {
                        const [sortBy, sortOrder] = e.target.value.split('-')
                        setJobFilters(prev => ({ ...prev, sortBy, sortOrder }))
                      }}
                      className="w-full rounded-lg bg-card border border-input px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="postedDate-desc">Newest First</option>
                      <option value="postedDate-asc">Oldest First</option>
                      <option value="title-asc">Title A-Z</option>
                      <option value="title-desc">Title Z-A</option>
                      <option value="applicants-desc">Most Applicants</option>
                    </select>
                  </div>
                </div>
                
                {/* Job Statistics with modern cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {/* Updated cards to use theme variables */}
                  <div className="rounded-xl border border-border bg-muted p-4 backdrop-blur-sm">
                    <div className="text-2xl font-semibold text-foreground">{jobPostings.length}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <span>Total Jobs</span>
                      <Briefcase className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="rounded-xl border border-border bg-muted p-4 backdrop-blur-sm">
                    <div className="text-2xl font-semibold text-foreground">{jobPostings.filter(job => job.status === 'active').length}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <span>Active Jobs</span>
                      <Check className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="rounded-xl border border-border bg-muted p-4 backdrop-blur-sm">
                    <div className="text-2xl font-semibold text-foreground">{jobPostings.filter(job => job.status === 'inactive').length}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <span>Inactive Jobs</span>
                      <Pause className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="rounded-xl border border-border bg-muted p-4 backdrop-blur-sm">
                    <div className="text-2xl font-semibold text-foreground">
                      {jobPostings.reduce((sum, job) => sum + job.applicants, 0)}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <span>Total Applicants</span>
                      <Users className="w-3 h-3" />
                    </div>
                  </div>
                </div>
                
                {/* Job Table with modern styling */}
                <div className="rounded-xl border border-border bg-muted overflow-hidden backdrop-blur-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-3 text-left text-muted-foreground font-medium">Job Title</th>
                          <th className="px-4 py-3 text-left text-muted-foreground font-medium">Department</th>
                          <th className="px-4 py-3 text-left text-muted-foreground font-medium">Location</th>
                          <th className="px-4 py-3 text-left text-muted-foreground font-medium">Type</th>
                          <th className="px-4 py-3 text-left text-muted-foreground font-medium">Posted</th>
                          <th className="px-4 py-3 text-left text-muted-foreground font-medium">Applicants</th>
                          <th className="px-4 py-3 text-left text-muted-foreground font-medium">Status</th>
                          <th className="px-4 py-3 text-left text-muted-foreground font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredJobPostings.map((job) => (
                          <tr key={job.id} className="border-t border-border hover:bg-accent transition-colors">
                            <td className="px-4 py-3 text-foreground font-medium">{job.title}</td>
                            <td className="px-4 py-3 text-muted-foreground">{job.department}</td>
                            <td className="px-4 py-3 text-muted-foreground">{job.location}</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-muted text-muted-foreground font-medium">
                                {job.type}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">{job.postedDate}</td>
                            <td className="px-4 py-3 text-muted-foreground">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-muted text-muted-foreground font-medium">
                                {job.applicants}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                job.status === 'active' ? 'bg-green-600/20 text-green-700 dark:text-green-300' : 'bg-gray-600/20 text-gray-700 dark:text-gray-300'
                              }`}>
                                {job.status === 'active' ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => toggleJobStatus(job.id)}
                                  className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                                    job.status === 'active' 
                                      ? 'bg-muted text-muted-foreground hover:text-foreground hover:bg-accent' 
                                      : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-accent'
                                  } transition-colors`}
                                  title={job.status === 'active' ? 'Deactivate Job' : 'Activate Job'}
                                >
                                  {job.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                </button>
                                <button
                                  onClick={() => deleteJobPosting(job.id)}
                                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-destructive/20 text-destructive hover:text-destructive-foreground hover:bg-destructive/30 transition-colors"
                                  title="Delete Job"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {filteredJobPostings.length === 0 && (
                    <div className="p-12 text-center text-muted-foreground">
                      <Briefcase className="w-12 h-12 mb-3 mx-auto text-foreground" />
                      <p className="text-lg">No job postings found</p>
                      <p className="text-sm mt-1">Try adjusting your filters or post a new job</p>
                      <button
                        onClick={() => setShowJobForm(true)}
                        className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 shadow-sm transition-all duration-300"
                      >
                        Post New Job
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
            
            {activeTab === 'jobs' && showJobForm && (
              <JobPostingForm 
                onAddJob={addJobPosting} 
                onCancel={() => setShowJobForm(false)} 
              />
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default AdminDashboard