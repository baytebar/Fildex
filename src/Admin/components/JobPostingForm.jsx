import React, { useState } from 'react'

const JobPostingForm = ({ onAddJob, onCancel }) => {
  const [jobData, setJobData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    salary: '',
    description: '',
    requirements: '',
    expiryDate: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setJobData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Create job object with required fields
    const newJob = {
      id: Date.now(),
      ...jobData,
      requirements: jobData.requirements.split('\n').filter(req => req.trim() !== ''),
      postedDate: new Date().toISOString().split('T')[0],
      status: 'active',
      applicants: 0
    }
    onAddJob(newJob)
    // Reset form
    setJobData({
      title: '',
      department: '',
      location: '',
      type: 'Full-time',
      salary: '',
      description: '',
      requirements: '',
      expiryDate: ''
    })
  }

  return (
    // Updated card to use theme variables
    <div className="rounded-xl border border-border bg-muted p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <span>📝</span>
          <span>Post New Job</span>
        </h3>
        <button 
          onClick={onCancel}
          className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          ✕
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs text-muted-foreground mb-2">Job Title *</label>
            <input 
              name="title"
              value={jobData.title}
              onChange={handleChange}
              required
              className="w-full rounded-lg bg-card border border-input px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" 
              placeholder="e.g., Senior Cloud Engineer"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-2">Department *</label>
            <input 
              name="department"
              value={jobData.department}
              onChange={handleChange}
              required
              className="w-full rounded-lg bg-card border border-input px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" 
              placeholder="e.g., Engineering"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs text-muted-foreground mb-2">Location *</label>
            <input 
              name="location"
              value={jobData.location}
              onChange={handleChange}
              required
              className="w-full rounded-lg bg-card border border-input px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" 
              placeholder="e.g., Remote, Dublin"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-2">Employment Type *</label>
            <select 
              name="type"
              value={jobData.type}
              onChange={handleChange}
              className="w-full rounded-lg bg-card border border-input px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-2">Salary Range</label>
            <input 
              name="salary"
              value={jobData.salary}
              onChange={handleChange}
              className="w-full rounded-lg bg-card border border-input px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" 
              placeholder="e.g., €50,000 - €70,000"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-xs text-muted-foreground mb-2">Job Description *</label>
          <textarea 
            name="description"
            value={jobData.description}
            onChange={handleChange}
            required
            rows={5}
            className="w-full rounded-lg bg-card border border-input px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" 
            placeholder="Describe the role, responsibilities, and expectations..."
          />
        </div>
        
        <div>
          <label className="block text-xs text-muted-foreground mb-2">Requirements (one per line)</label>
          <textarea 
            name="requirements"
            value={jobData.requirements}
            onChange={handleChange}
            rows={5}
            className="w-full rounded-lg bg-card border border-input px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" 
            placeholder="List key requirements, one per line&#10;e.g.,&#10;Bachelor's degree in Computer Science&#10;5+ years experience in cloud technologies&#10;AWS Certification"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs text-muted-foreground mb-2">Expiry Date *</label>
            <input 
              name="expiryDate"
              type="date"
              value={jobData.expiryDate}
              onChange={handleChange}
              required
              className="w-full rounded-lg bg-card border border-input px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" 
            />
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-border px-5 py-2.5 text-sm hover:bg-accent transition-colors text-foreground"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 shadow-sm transition-all duration-300"
          >
            Post Job
          </button>
        </div>
      </form>
    </div>
  )
}

export default JobPostingForm