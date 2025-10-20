import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { 
  Search, 
  Plus, 
  Briefcase,
  Settings,
  Pause,
  Play,
  Edit,
  Calendar,
  Users
} from 'lucide-react'
import { 
  getAllJobTitles, 
  createJobTitle, 
  updateJobTitle, 
  deleteJobTitle,
  resumeJobTitle
} from '../../features/admin/adminSlice'
import { toast } from 'sonner'
import Spinner from '../../components/Spinner'

const AdminJobTitles = () => {
  const dispatch = useDispatch()
  
  // Get data from Redux
  const { data: jobTitlesData = [], isLoading: jobTitlesLoading, error: jobTitlesError } = useSelector((state) => state.admin.jobTitles)
  const jobTitles = Array.isArray(jobTitlesData) ? jobTitlesData : []
  const { isAuthenticated } = useSelector((state) => state.admin)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedJobTitle, setSelectedJobTitle] = useState(null)
  const [newJobTitleName, setNewJobTitleName] = useState('')
  const [editJobTitleName, setEditJobTitleName] = useState('')

  // Fetch data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getAllJobTitles())
        .unwrap()
        .catch((error) => {
          toast.error('Failed to load job titles: ' + error.message)
        })
    }
  }, [dispatch, isAuthenticated])

  // Filter job titles based on search term (show both active and paused)
  const filteredJobTitles = useMemo(() => {
    if (!jobTitles || !Array.isArray(jobTitles)) return []
    
    return jobTitles.filter(jobTitle => 
      jobTitle.name && 
      jobTitle.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [jobTitles, searchTerm])

  // Stats calculation
  const stats = useMemo(() => {
    const activeJobTitles = jobTitles.filter(jt => jt.isDeleted !== true);
    const inactiveJobTitles = jobTitles.filter(jt => jt.isDeleted === true);
    
    return {
      total: jobTitles.length,
      active: activeJobTitles.length,
      inactive: inactiveJobTitles.length,
      recent: activeJobTitles.filter(jt => 
        jt.createdAt && new Date(jt.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length
    }
  }, [jobTitles])

  const handleCreateJobTitle = useCallback(() => {
    if (!newJobTitleName.trim()) {
      toast.error('Please enter a job title name')
      return
    }
    
    dispatch(createJobTitle({ name: newJobTitleName.trim() }))
      .unwrap()
      .then(() => {
        setNewJobTitleName('')
        setShowCreateDialog(false)
        toast.success('Job title created successfully!')
      })
      .catch((error) => {
        toast.error('Failed to create job title: ' + error.message)
      })
  }, [dispatch, newJobTitleName])

  const handleEditJobTitle = useCallback((jobTitle) => {
    setSelectedJobTitle(jobTitle)
    setEditJobTitleName(jobTitle.name)
    setShowEditDialog(true)
  }, [])

  const handleUpdateJobTitle = useCallback(() => {
    if (!editJobTitleName.trim()) {
      toast.error('Please enter a job title name')
      return
    }
    
    if (!selectedJobTitle) return
    
    dispatch(updateJobTitle({ 
      id: selectedJobTitle._id, 
      jobTitleData: { name: editJobTitleName.trim() } 
    }))
      .unwrap()
      .then(() => {
        setShowEditDialog(false)
        setSelectedJobTitle(null)
        setEditJobTitleName('')
        toast.success('Job title updated successfully!')
      })
      .catch((error) => {
        toast.error('Failed to update job title: ' + error.message)
      })
  }, [dispatch, editJobTitleName, selectedJobTitle])

  const handlePauseJobTitle = useCallback((jobTitleId) => {
    dispatch(deleteJobTitle(jobTitleId))
      .unwrap()
      .then(() => {
        toast.success('Job title paused successfully!')
      })
      .catch((error) => {
        toast.error('Failed to pause job title: ' + error.message)
      })
  }, [dispatch])

  const handleResumeJobTitle = useCallback((jobTitleId) => {
    dispatch(resumeJobTitle(jobTitleId))
      .unwrap()
      .catch((error) => {
        toast.error('Failed to resume job title: ' + error.message)
      })
  }, [dispatch])

  const closeCreateDialog = useCallback(() => {
    setShowCreateDialog(false)
    setNewJobTitleName('')
  }, [])

  const closeEditDialog = useCallback(() => {
    setShowEditDialog(false)
    setSelectedJobTitle(null)
    setEditJobTitleName('')
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Job Titles Management</h2>
          <p className="text-slate-600 dark:text-slate-400">Manage available job titles for job postings</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Job Title
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Job Titles</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.active}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <Users className="w-6 h-6 text-green-600 dark:text-green-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Paused</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.inactive}</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                <Pause className="w-6 h-6 text-orange-600 dark:text-orange-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Recent</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.recent}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-300" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search job titles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Titles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Job Titles</CardTitle>
          <CardDescription>Manage available job titles for job postings</CardDescription>
        </CardHeader>
        <CardContent>
          {jobTitlesLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center gap-2">
                <Spinner />
                <p className="text-slate-600 dark:text-slate-400">Loading job titles...</p>
              </div>
            </div>
          ) : jobTitlesError ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center gap-2">
                <Briefcase className="w-12 h-12 text-red-400" />
                <p className="text-red-600 dark:text-red-400">Error loading job titles: {jobTitlesError}</p>
              </div>
            </div>
          ) : filteredJobTitles.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">
                {searchTerm ? 'No job titles found matching your search' : 'No job titles found'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobTitles.map((jobTitle) => (
                    <TableRow key={jobTitle._id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{jobTitle.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={jobTitle.isDeleted 
                            ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300" 
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"}
                        >
                          {jobTitle.isDeleted ? 'Paused' : 'Active'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Calendar className="w-4 h-4" />
                          {jobTitle.createdAt ? new Date(jobTitle.createdAt).toLocaleDateString() : 'Unknown'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditJobTitle(jobTitle)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            title="Edit Job Title"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {jobTitle.isDeleted ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleResumeJobTitle(jobTitle._id)}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              title="Resume Job Title"
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePauseJobTitle(jobTitle._id)}
                              className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                              title="Pause Job Title"
                            >
                              <Pause className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Job Title Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeCreateDialog}
          />
          <div className="relative bg-white dark:bg-slate-900 rounded-lg shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Create New Job Title
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeCreateDialog}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Job Title Name
                </label>
                <input
                  type="text"
                  value={newJobTitleName}
                  onChange={(e) => setNewJobTitleName(e.target.value)}
                  placeholder="Enter job title name..."
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button variant="outline" onClick={closeCreateDialog}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateJobTitle}
                  disabled={!newJobTitleName.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-300 disabled:text-slate-500"
                >
                  Create Job Title
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Job Title Dialog */}
      {showEditDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeEditDialog}
          />
          <div className="relative bg-white dark:bg-slate-900 rounded-lg shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Edit Job Title
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeEditDialog}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Job Title Name
                </label>
                <input
                  type="text"
                  value={editJobTitleName}
                  onChange={(e) => setEditJobTitleName(e.target.value)}
                  placeholder="Enter job title name..."
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button variant="outline" onClick={closeEditDialog}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpdateJobTitle}
                  disabled={!editJobTitleName.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-300 disabled:text-slate-500"
                >
                  Update Job Title
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminJobTitles
