import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { 
  Search, 
  Download, 
  Plus, 
  Mail, 
  FileText,
  Calendar,
  Phone,
  MapPin,
  Edit3,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Trash2,
  Briefcase
} from 'lucide-react'
import { updateUserStatus } from '../../features/admin/adminSlice'
import { fetchAllResumes, deleteResume } from '../../features/resume/resumeSlice'
import { api } from '../../config/api'
import CvViewer from '../components/CvViewer'
import { toast } from 'sonner'
import Spinner from '../../components/Spinner'

const AdminCvManagement = () => {
  const dispatch = useDispatch()
  const { resumes, isLoading, error, pagination } = useSelector((state) => state.resume)
  const { isAuthenticated } = useSelector((state) => state.admin)
  const { newCvNotifications } = useSelector((state) => state.notifications)
  const [adminFilters, setAdminFilters] = useState({
    search: '',
    status: '',
    dateRange: { start: '', end: '' },
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [selectedCvForStatus, setSelectedCvForStatus] = useState(null)
  const [tempStatus, setTempStatus] = useState('')
  const [showCvViewer, setShowCvViewer] = useState(false)
  const [selectedUserForView, setSelectedUserForView] = useState(null)
  const [showExpiryDialog, setShowExpiryDialog] = useState(false)
  const [selectedCvForExpiry, setSelectedCvForExpiry] = useState(null)
  const [tempExpiryDate, setTempExpiryDate] = useState('')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedCvForDelete, setSelectedCvForDelete] = useState(null)

  const statusOptions = [
    { value: 'new', label: 'New', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'reviewed', label: 'Reviewed', color: 'bg-purple-100 text-purple-800' },
    { value: 'under_review', label: 'Under Review', color: 'bg-blue-100 text-blue-800' },
    { value: 'shortlisted', label: 'Shortlisted', color: 'bg-green-100 text-green-800' },
    { value: 'interview_scheduled', label: 'Interview Scheduled', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'hired', label: 'Hired', color: 'bg-emerald-100 text-emerald-800' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' },
    { value: 'on_hold', label: 'On Hold', color: 'bg-orange-100 text-orange-800' }
  ]

  // Fetch resumes data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchAllResumes({ page: 1, limit: 10 }))
        .unwrap()
        .catch((error) => {
          toast.error('Failed to load resume data: ' + error.message)
        })
    }
  }, [dispatch, isAuthenticated])

  // Refresh CV list when new CV notifications are received
  useEffect(() => {
    if (isAuthenticated && newCvNotifications.length > 0) {
      // Check if there are any unread notifications
      const hasUnreadNotifications = newCvNotifications.some(notification => !notification.read);
      if (hasUnreadNotifications) {
        // Refresh the CV list to show new CVs
        dispatch(fetchAllResumes({ page: 1, limit: 10 }))
          .unwrap()
          .catch((error) => {
            console.error('Failed to refresh CV list:', error);
          });
      }
    }
  }, [dispatch, isAuthenticated, newCvNotifications])

  // Function to handle page changes
  const handlePageChange = (newPage) => {
    dispatch(fetchAllResumes({ page: newPage, limit: pagination?.limit || 10 }))
      .unwrap()
      .catch((error) => {
        toast.error('Failed to load page: ' + error.message)
      })
  }

  const exportCvData = useCallback(() => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Name,Email,Phone,Created Date,Resume Link\n" +
      (resumes || []).map(r => `${r.name || 'N/A'},${r.email || 'N/A'},${r.contact?.number || 'N/A'},${r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'N/A'},${r['resume-link'] || 'N/A'}`).join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "resumes.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Resume data exported successfully')
  }, [resumes])

  const downloadCv = useCallback(async (resume) => {
    try {
      if (!resume || !resume._id) {
        toast.error('Invalid resume record')
        return
      }
      const { data } = await api.admin.getResumeDownloadUrl(resume._id)
      if (data?.url) {
        window.open(data.url, '_blank')
        toast.success(`Resume for ${resume.name || 'Candidate'} opened`)
      } else if (resume['resume-link']) {
        // Fallback to stored URL if available
        window.open(resume['resume-link'], '_blank')
      } else {
        toast.error('Download link not available')
      }
    } catch (err) {
      toast.error(`Download failed: ${err.message || 'Unknown error'}`)
    }
  }, [])

  const openCvViewer = useCallback((user) => {
    setSelectedUserForView(user)
    setShowCvViewer(true)
  }, [])

  const closeCvViewer = useCallback(() => {
    setShowCvViewer(false)
    setSelectedUserForView(null)
  }, [])

  const updateCvStatus = useCallback((userId, newStatus) => {
    dispatch(updateUserStatus({ userId, status: newStatus }))
  }, [dispatch])

  const openStatusDialog = useCallback((user) => {
    // Don't open dialog if user has no CV
    if (!user.cv?.url) {
      toast.error('Cannot update status - No CV uploaded')
      return
    }
    setSelectedCvForStatus(user)
    setTempStatus(user.status || 'new')
    setShowStatusDialog(true)
  }, [])

  const closeStatusDialog = useCallback(() => {
    setShowStatusDialog(false)
    setSelectedCvForStatus(null)
    setTempStatus('')
  }, [])

  const handleStatusSelect = useCallback((newStatus) => {
    setTempStatus(newStatus)
  }, [])

  const openGmail = useCallback((email) => {
    if (!email) {
      toast.error('No email address available')
      return
    }
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`
    window.open(gmailUrl, '_blank')
  }, [])

  // Update resume status
  const updateResumeStatus = useCallback(async (resumeId, newStatus) => {
    try {
      const response = await api.admin.updateResumeStatus(resumeId, { status: newStatus })
      if (response.status === 200) {
        // Update the resume in the local state
        const updatedResumes = resumes.map(resume => 
          resume._id === resumeId 
            ? { ...resume, status: newStatus }
            : resume
        )
        // You might want to dispatch an action to update the Redux state
        toast.success('Resume status updated successfully!')
        return true
      }
    } catch (error) {
      toast.error('Failed to update resume status: ' + error.message)
      return false
    }
  }, [resumes])

  const handleSaveStatus = useCallback(async () => {
    if (selectedCvForStatus && tempStatus) {
      const success = await updateResumeStatus(selectedCvForStatus._id, tempStatus)
      if (success) {
        closeStatusDialog()
        // Refresh the resumes list
        dispatch(fetchAllResumes({ page: pagination?.currentPage || 1, limit: pagination?.limit || 10 }))
      }
    }
  }, [selectedCvForStatus, tempStatus, updateResumeStatus, closeStatusDialog, dispatch, pagination])

  // Expiry functionality
  const openExpiryDialog = useCallback((resume) => {
    setSelectedCvForExpiry(resume)
    setTempExpiryDate(resume.expiryDate ? new Date(resume.expiryDate).toISOString().split('T')[0] : '')
    setShowExpiryDialog(true)
  }, [])

  const closeExpiryDialog = useCallback(() => {
    setShowExpiryDialog(false)
    setSelectedCvForExpiry(null)
    setTempExpiryDate('')
  }, [])

  const updateResumeExpiry = useCallback(async (resumeId, expiryDate) => {
    try {
      const response = await api.admin.updateResumeExpiry(resumeId, { expiryDate })
      if (response.status === 200) {
        toast.success('CV expiry date updated successfully!')
        return true
      }
    } catch (error) {
      toast.error('Failed to update CV expiry: ' + error.message)
      return false
    }
  }, [])

  const handleSaveExpiry = useCallback(async () => {
    if (selectedCvForExpiry) {
      const success = await updateResumeExpiry(selectedCvForExpiry._id, tempExpiryDate)
      if (success) {
        closeExpiryDialog()
        // Refresh the resumes list
        dispatch(fetchAllResumes({ page: pagination?.currentPage || 1, limit: pagination?.limit || 10 }))
      }
    }
  }, [selectedCvForExpiry, tempExpiryDate, updateResumeExpiry, closeExpiryDialog, dispatch, pagination])

  // Delete functionality
  const openDeleteDialog = useCallback((resume) => {
    setSelectedCvForDelete(resume)
    setShowDeleteDialog(true)
  }, [])

  const closeDeleteDialog = useCallback(() => {
    setShowDeleteDialog(false)
    setSelectedCvForDelete(null)
  }, [])

  const handleDeleteResume = useCallback(async () => {
    if (selectedCvForDelete) {
      try {
        await dispatch(deleteResume(selectedCvForDelete._id)).unwrap()
        closeDeleteDialog()
        // Refresh the resumes list
        dispatch(fetchAllResumes({ page: pagination?.currentPage || 1, limit: pagination?.limit || 10 }))
      } catch (error) {
        // Error is already handled in the Redux slice
      }
    }
  }, [selectedCvForDelete, dispatch, closeDeleteDialog, pagination])

  const checkExpiredResumes = useCallback(async () => {
    try {
      const response = await api.admin.checkExpiredResumes()
      if (response.status === 200) {
        toast.success(`Checked expired resumes: ${response.data.expiredCount} resumes marked as expired`)
        // Refresh the resumes list
        dispatch(fetchAllResumes({ page: pagination?.currentPage || 1, limit: pagination?.limit || 10 }))
      }
    } catch (error) {
      toast.error('Failed to check expired resumes: ' + error.message)
    }
  }, [dispatch, pagination])

  const filteredCvs = useMemo(() => {
    if (!resumes || !Array.isArray(resumes)) {
      return []
    }
    
    const filtered = resumes.filter(r => {
      const matchesSearch = (r.name && r.name.toLowerCase().includes(adminFilters.search.toLowerCase())) ||
                           (r.email && r.email.toLowerCase().includes(adminFilters.search.toLowerCase()))
      const matchesStatus = !adminFilters.status || r.status === adminFilters.status
      const matchesDate = !adminFilters.dateRange?.start || 
        (r.createdAt && new Date(r.createdAt) >= new Date(adminFilters.dateRange.start))
      
      return matchesSearch && matchesStatus && matchesDate
    })
    
    // Sort the filtered results
    filtered.sort((a, b) => {
      let aVal, bVal;
      
      switch (adminFilters.sortBy) {
        case 'name':
          aVal = a.name || '';
          bVal = b.name || '';
          break;
        case 'email':
          aVal = a.email || '';
          bVal = b.email || '';
          break;
        case 'status':
          aVal = a.status || 'new';
          bVal = b.status || 'new';
          break;
        case 'createdAt':
        default:
          aVal = new Date(a.createdAt || 0);
          bVal = new Date(b.createdAt || 0);
          break;
      }
      
      if (adminFilters.sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    })
    
    return filtered
  }, [resumes, adminFilters])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">CV Management</h2>
          <p className="text-slate-600 dark:text-slate-400">Manage uploaded resumes and applicant data</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button variant="outline" onClick={checkExpiredResumes} className="w-full sm:w-auto">
            <Clock className="w-4 h-4 mr-2" />
            Check Expired CVs
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={adminFilters.search}
                onChange={(e) => setAdminFilters(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Search CVs..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={adminFilters.status}
              onChange={(e) => setAdminFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="reviewed">Reviewed</option>
              <option value="under_review">Under Review</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interview_scheduled">Interview Scheduled</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
              <option value="on_hold">On Hold</option>
            </select>
            
            
            <input
              type="date"
              value={adminFilters.dateRange?.start || ''}
              onChange={(e) => setAdminFilters(prev => ({ 
                ...prev, 
                dateRange: { ...prev.dateRange, start: e.target.value }
              }))}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <select
              value={`${adminFilters.sortBy}-${adminFilters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-')
                setAdminFilters(prev => ({ ...prev, sortBy, sortOrder }))
              }}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="name-asc">Name A-Z</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* CV Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Spinner />
                        <p className="text-slate-600 dark:text-slate-400">Loading users...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-12 h-12 text-red-400" />
                        <p className="text-red-600 dark:text-red-400">Error loading users: {error}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredCvs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-12 h-12 text-slate-400" />
                        <p className="text-slate-600 dark:text-slate-400">
                          {resumes && resumes.length > 0 
                            ? 'No resumes match your current filters' 
                            : 'No resume data available'}
                        </p>
                        {resumes && resumes.length > 0 && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setAdminFilters({ search: '', status: '', dateRange: { start: '', end: '' } })}
                          >
                            Clear Filters
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCvs.map((resume) => {
                  return (
                    <TableRow key={resume._id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                              {resume.name ? resume.name.split(' ').map(n => n[0]).join('') : 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{resume.name || 'Unknown'}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{resume.contact?.number || 'N/A'}</p>
                            <div className="flex items-center gap-1 mt-1">
                              {resume['resume-link'] ? (
                                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                  <CheckCircle className="w-3 h-3" />
                                  <span className="text-xs">CV Available</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                                  <XCircle className="w-3 h-3" />
                                  <span className="text-xs">No CV</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                            <Mail className="w-4 h-4" />
                            <span className="text-sm">{resume.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                            <Phone className="w-4 h-4" />
                            <span className="text-sm">{resume.contact?.number || 'N/A'}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {resume.role ? (
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md">
                              {resume.role}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400 italic">Not specified</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                          <Calendar className="w-4 h-4" />
                          {resume.createdAt ? new Date(resume.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            statusOptions.find(s => s.value === resume.status)?.color || 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {statusOptions.find(s => s.value === resume.status)?.label || 'New'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                          <Clock className="w-4 h-4" />
                          <div className="text-sm">
                            {resume.expiryDate ? (
                              <div className={`flex items-center gap-1 ${
                                resume.isExpired 
                                  ? 'text-red-600 dark:text-red-400' 
                                  : new Date(resume.expiryDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                                    ? 'text-orange-600 dark:text-orange-400'
                                    : 'text-slate-600 dark:text-slate-400'
                              }`}>
                                {resume.isExpired && <AlertTriangle className="w-3 h-3" />}
                                {new Date(resume.expiryDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                                {resume.isExpired && <span className="text-xs ml-1">(Expired)</span>}
                              </div>
                            ) : (
                              <span className="text-slate-400">No expiry set</span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openCvViewer(resume)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedCvForStatus(resume)
                              setTempStatus(resume.status || 'new')
                              setShowStatusDialog(true)
                            }}
                            className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                            title="Update Status"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openGmail(resume.email)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            title="Send Email via Gmail"
                            disabled={!resume.email}
                          >
                            <Mail className="w-4 h-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openExpiryDialog(resume)}
                            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                            title="Set Expiry Date"
                          >
                            <Clock className="w-4 h-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(resume)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Delete Resume"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Status Update Dialog */}
      {showStatusDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeStatusDialog}
          />
          <div className="relative bg-white dark:bg-slate-900 rounded-lg shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Update CV Status
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeStatusDialog}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </Button>
            </div>
            
            {selectedCvForStatus && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                      {selectedCvForStatus.name ? selectedCvForStatus.name.split(' ').map(n => n[0]).join('') : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{selectedCvForStatus.name || 'Unknown User'}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{selectedCvForStatus.email || 'N/A'}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Current Status: <span className="font-semibold">{selectedCvForStatus.status || 'New'}</span>
                  </label>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Select a new status for this CV:
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {statusOptions.map((status) => (
                      <Button
                        key={status.value}
                        variant={tempStatus === status.value ? 'default' : 'outline'}
                        onClick={() => setTempStatus(status.value)}
                        className="justify-start"
                      >
                        {status.label}
                      </Button>
                    ))}
                  </div>
                  
                  {tempStatus !== selectedCvForStatus.status && (
                    <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Status will change from <span className="font-semibold">{selectedCvForStatus.status}</span> to <span className="font-semibold">{tempStatus}</span>
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button variant="outline" onClick={closeStatusDialog}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveStatus}
                    disabled={tempStatus === selectedCvForStatus.status}
                    className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-300 disabled:text-slate-500"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CV Viewer Modal */}
      {showCvViewer && selectedUserForView && (
        <CvViewer
          user={selectedUserForView}
          onClose={closeCvViewer}
          onStatusUpdate={updateCvStatus}
        />
      )}

      {/* Expiry Date Dialog */}
      {showExpiryDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeExpiryDialog}
          />
          <div className="relative bg-white dark:bg-slate-900 rounded-lg shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Set CV Expiry Date
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeExpiryDialog}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </Button>
            </div>
            
            {selectedCvForExpiry && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                      {selectedCvForExpiry.name ? selectedCvForExpiry.name.split(' ').map(n => n[0]).join('') : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{selectedCvForExpiry.name || 'Unknown User'}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{selectedCvForExpiry.email || 'N/A'}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Current Expiry: <span className="font-semibold">
                      {selectedCvForExpiry.expiryDate ? new Date(selectedCvForExpiry.expiryDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Not set'}
                    </span>
                  </label>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Set a new expiry date for this CV:
                  </p>
                  
                  <input
                    type="date"
                    value={tempExpiryDate}
                    onChange={(e) => setTempExpiryDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Leave empty to remove expiry date
                  </p>
                </div>
                
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button variant="outline" onClick={closeExpiryDialog}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveExpiry}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeDeleteDialog}
          />
          <div className="relative bg-white dark:bg-slate-900 rounded-lg shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Delete Resume
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeDeleteDialog}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </Button>
            </div>
            
            {selectedCvForDelete && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-full">
                    <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="font-medium text-red-900 dark:text-red-100">Warning</p>
                    <p className="text-sm text-red-700 dark:text-red-300">This action cannot be undone</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                      {selectedCvForDelete.name ? selectedCvForDelete.name.split(' ').map(n => n[0]).join('') : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{selectedCvForDelete.name || 'Unknown User'}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{selectedCvForDelete.email || 'N/A'}</p>
                  </div>
                </div>
                
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Are you sure you want to delete this resume? This will permanently remove the resume file and all associated data.
                </p>
                
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button variant="outline" onClick={closeDeleteDialog}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleDeleteResume}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Delete Resume
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}

export default AdminCvManagement
