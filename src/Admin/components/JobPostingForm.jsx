import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Briefcase, MapPin, DollarSign, Calendar, FileText } from 'lucide-react'

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
    const newJob = {
      id: Date.now(),
      ...jobData,
      requirements: jobData.requirements.split('\n').filter(req => req.trim() !== ''),
      postedDate: new Date().toISOString().split('T')[0],
      status: 'active',
      applicants: 0
    }
    onAddJob(newJob)
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
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-xl">Post New Job</CardTitle>
              <CardDescription className="text-blue-100">
                Create a new job posting for your organization
              </CardDescription>
            </div>
          </div>
          <Button 
            onClick={onCancel}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Job Title *
              </label>
              <Input 
                name="title"
                value={jobData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Senior Cloud Engineer"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Department *
              </label>
              <Input 
                name="department"
                value={jobData.department}
                onChange={handleChange}
                required
                placeholder="e.g., Engineering"
                className="h-11"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location *
              </label>
              <Input 
                name="location"
                value={jobData.location}
                onChange={handleChange}
                required
                placeholder="e.g., Remote, Dublin"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Employment Type *
              </label>
              <Select 
                name="type"
                value={jobData.type}
                onChange={handleChange}
                className="h-11"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Salary Range
              </label>
              <Input 
                name="salary"
                value={jobData.salary}
                onChange={handleChange}
                placeholder="e.g., €50,000 - €70,000"
                className="h-11"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Job Description *
            </label>
            <Textarea 
              name="description"
              value={jobData.description}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Describe the role, responsibilities, and expectations..."
              className="resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Requirements (one per line)
            </label>
            <Textarea 
              name="requirements"
              value={jobData.requirements}
              onChange={handleChange}
              rows={5}
              placeholder="List key requirements, one per line&#10;e.g.,&#10;Bachelor's degree in Computer Science&#10;5+ years experience in cloud technologies&#10;AWS Certification"
              className="resize-none"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Expiry Date *
              </label>
              <Input 
                name="expiryDate"
                type="date"
                value={jobData.expiryDate}
                onChange={handleChange}
                required
                className="h-11"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="h-11 px-8"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-11 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Post Job
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default JobPostingForm