import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import JobPreview from '../components/JobPreview'
import { 
  Search, 
  Plus, 
  MapPin, 
  Calendar, 
  Briefcase,
  Edit,
  Trash2,
  Eye,
  Pause,
  Play
} from 'lucide-react'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog'
import { getAllJobPostings, deleteJobPosting, pauseJobPosting, resumeJobPosting } from '../../features/admin/adminSlice'
import { toast } from 'sonner'
import Spinner from '../../components/Spinner'

const AdminJobPostings = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  // Get data from Redux
  const { data: jobPostings, isLoading, error, totalJobs } = useSelector((state) => state.admin.jobPostings)
  const { isAuthenticated } = useSelector((state) => state.admin)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [previewJob, setPreviewJob] = useState(null)
  // Add state for job deletion confirmation
  const [deleteJobDialogOpen, setDeleteJobDialogOpen] = useState(false)
  const [jobToDelete, setJobToDelete] = useState(null)

  // Fetch job postings on component mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getAllJobPostings({ page: 1, limit: 10 }))
        .unwrap()
        .then((result) => {
        })
        .catch((error) => {
          toast.error('Failed to load job postings: ' + error.message)
        })
    }
  }, [dispatch, isAuthenticated])

  const filteredJobs = useCallback(() => {
    if (!jobPostings || !Array.isArray(jobPostings)) return []
    
    return jobPostings.filter(job => {
      const matchesSearch = (job.job_title || job.title)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = !statusFilter || job.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [jobPostings, searchTerm, statusFilter])

  const handleCreateJob = useCallback(() => {
    navigate('/admin/job-form')
  }, [navigate])

  const handleEditJob = useCallback((job) => {
    navigate('/admin/job-form', { state: { jobData: job } })
  }, [navigate])

  // Handle job deletion with confirmation
  const handleDeleteJob = useCallback((jobId, jobTitle) => {
    // Set the job to delete and open confirmation dialog
    setJobToDelete({ id: jobId, title: jobTitle })
    setDeleteJobDialogOpen(true)
  }, [])

  // Confirm job deletion
  const confirmDeleteJob = useCallback(() => {
    if (jobToDelete) {
      dispatch(deleteJobPosting(jobToDelete.id))
        .unwrap()
        .then(() => {
          setDeleteJobDialogOpen(false)
          setJobToDelete(null)
        })
        .catch((error) => {
          setDeleteJobDialogOpen(false)
          setJobToDelete(null)
        })
    }
  }, [dispatch, jobToDelete])

  // Cancel job deletion
  const cancelDeleteJob = useCallback(() => {
    setDeleteJobDialogOpen(false)
    setJobToDelete(null)
  }, [])

  const handlePauseJob = useCallback((jobId) => {
    dispatch(pauseJobPosting(jobId))
  }, [dispatch])

  const handleResumeJob = useCallback((jobId) => {
    dispatch(resumeJobPosting(jobId))
  }, [dispatch])

  const handleViewJob = useCallback((job) => {
    setPreviewJob(job)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Job Postings</h2>
          <p className="text-slate-600 dark:text-slate-400">Manage job postings and applications</p>
        </div>
        <Button onClick={handleCreateJob} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Post New Job
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search jobs..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Job Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {isLoading ? (
          <div className="col-span-2 flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-2">
              <Spinner />
              <p className="text-slate-600 dark:text-slate-400">Loading job postings...</p>
            </div>
          </div>
        ) : error ? (
          <div className="col-span-2 flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-2">
              <Briefcase className="w-12 h-12 text-red-400" />
              <p className="text-red-600 dark:text-red-400">Error loading job postings: {error}</p>
            </div>
          </div>
        ) : filteredJobs().length === 0 ? (
          <div className="col-span-2">
            <Card>
              <CardContent className="p-8 text-center">
                <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No job postings found</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {searchTerm || statusFilter ? 'Try adjusting your search criteria.' : 'Get started by posting your first job.'}
                </p>
                {!searchTerm && !statusFilter && (
                  <Button onClick={handleCreateJob}>
                    <Plus className="w-4 h-4 mr-2" />
                    Post New Job
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredJobs().map((job) => (
          <Card key={job._id || job.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                    {job.job_title || job.title || 'Untitled Job'}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location || 'Location not specified'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {job.createdAt ? new Date(job.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Date not specified'}
                    </div>
                  </div>
                </div>
                <Badge 
                  variant={job.status === 'active' ? 'default' : 
                          job.status === 'paused' ? 'secondary' : 'destructive'}
                  className={job.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                >
                  {job.status || 'draft'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
                {job.description || 'No description available'}
              </p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {job.job_type || job.type || 'Full-time'}
                  </div>
                </div>
                <div className="text-sm font-medium text-slate-900 dark:text-white">
                  {job.salary_range || job.salary || 'Salary not specified'}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleViewJob(job)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleEditJob(job)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                {job.status === 'active' ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                    onClick={() => handlePauseJob(job._id || job.id)}
                  >
                    <Pause className="w-4 h-4" />
                  </Button>
                ) : job.status === 'paused' ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={() => handleResumeJob(job._id || job.id)}
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                ) : null}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDeleteJob(job._id || job.id, job.job_title || job.title || 'Untitled Job')}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
        )}
      </div>

      {/* Job Preview Modal */}
      {previewJob && (
        <JobPreview
          job={previewJob}
          onClose={() => setPreviewJob(null)}
        />
      )}
      
      {/* Delete Job Confirmation Dialog */}
      <Dialog open={deleteJobDialogOpen} onOpenChange={setDeleteJobDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Job Posting</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the job posting "{jobToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDeleteJob}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteJob}>
              Delete Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminJobPostings
