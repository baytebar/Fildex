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
  Trash2, 
  FileText,
  Calendar,
  Phone,
  MapPin,
  Edit3,
  Loader2,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { getAllUsers, updateUserStatus } from '../../features/admin/adminSlice'
import CvViewer from '../components/CvViewer'
import { toast } from 'sonner'

const AdminCvManagement = () => {
  const dispatch = useDispatch()
  const { data: users, isLoading, error, totalUsers, currentPage, totalPages } = useSelector((state) => state.admin.users)
  const { isAuthenticated } = useSelector((state) => state.admin)
  const [adminFilters, setAdminFilters] = useState({
    search: '',
    status: '',
    dateRange: { start: '', end: '' }
  })
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [selectedCvForStatus, setSelectedCvForStatus] = useState(null)
  const [tempStatus, setTempStatus] = useState('')
  const [showCvViewer, setShowCvViewer] = useState(false)
  const [selectedUserForView, setSelectedUserForView] = useState(null)

  // Fetch users data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getAllUsers({ page: 1, limit: 10 }))
        .unwrap()
        .catch((error) => {
          toast.error('Failed to load CV data: ' + error.message)
        })
    }
  }, [dispatch, isAuthenticated])

  // Function to handle page changes
  const handlePageChange = (newPage) => {
    dispatch(getAllUsers({ page: newPage, limit: 10 }))
      .unwrap()
      .catch((error) => {
        toast.error('Failed to load page: ' + error.message)
      })
  }

  const exportCvData = useCallback(() => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Name,Email,Phone,Status,Created Date,CV URL\n" +
      (users || []).map(user => `${user.name || 'N/A'},${user.email || 'N/A'},${user.contact?.number || 'N/A'},${user.status || 'new'},${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'},${user.cv?.url || 'N/A'}`).join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "user_data.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('CV data exported successfully')
  }, [users])

  const downloadCv = useCallback((user) => {
    if (user.cv?.url) {
      // Construct the full URL for the CV
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'
      const cvUrl = `${baseUrl}/${user.cv.url}`
      window.open(cvUrl, '_blank')
      toast.success(`CV for ${user.name} downloaded successfully`)
    } else {
      // Create a mock CV file content
      const cvContent = `
CV - ${user.name || 'Unknown User'}
================

Contact Information:
- Name: ${user.name || 'N/A'}
- Email: ${user.email || 'N/A'}
- Phone: ${user.contact?.number || 'N/A'}

Professional Information:
- Status: ${user.status || 'new'}
- Created: ${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
- Education: N/A

Skills: N/A

Summary: N/A

Status: ${user.status || 'new'}
Created: ${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
    `.trim()

    const blob = new Blob([cvContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${(user.name || 'Unknown').replace(' ', '_')}_CV.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    toast.success(`CV for ${user.name} generated and downloaded successfully`)
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
      .unwrap()
      .then(() => {
        toast.success('CV status updated successfully')
      })
      .catch((error) => {
        toast.error('Failed to update CV status: ' + error.message)
      })
  }, [dispatch])

  const openStatusDialog = useCallback((user) => {
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

  const handleSaveStatus = useCallback(() => {
    if (selectedCvForStatus && tempStatus) {
      updateCvStatus(selectedCvForStatus._id, tempStatus)
      closeStatusDialog()
    }
  }, [selectedCvForStatus, tempStatus, updateCvStatus, closeStatusDialog])

  const filteredCvs = useMemo(() => {
    if (!users || !Array.isArray(users)) {
      return []
    }
    
    const filtered = users.filter(user => {
      const matchesSearch = (user.name && user.name.toLowerCase().includes(adminFilters.search.toLowerCase())) ||
                           (user.email && user.email.toLowerCase().includes(adminFilters.search.toLowerCase()))
      const matchesStatus = !adminFilters.status || (user.status || 'new') === adminFilters.status
      const matchesDate = !adminFilters.dateRange?.start || 
        (user.createdAt && new Date(user.createdAt) >= new Date(adminFilters.dateRange.start))
      
      return matchesSearch && matchesStatus && matchesDate
    })
    
    return filtered
  }, [users, adminFilters])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">CV Management</h2>
          <p className="text-slate-600 dark:text-slate-400">Manage uploaded resumes and applicant data</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Export CSV and Add CV buttons removed as per requirements */}
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
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
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
                  <TableHead>Role</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                        <p className="text-slate-600 dark:text-slate-400">Loading users...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-12 h-12 text-red-400" />
                        <p className="text-red-600 dark:text-red-400">Error loading users: {error}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredCvs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-12 h-12 text-slate-400" />
                        <p className="text-slate-600 dark:text-slate-400">
                          {users && users.length > 0 
                            ? 'No users match your current filters' 
                            : 'No user data available'}
                        </p>
                        {users && users.length > 0 && (
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
                  filteredCvs.map((user) => {
                  return (
                    <TableRow key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                              {user.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{user.name || 'Unknown User'}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{user.contact?.number || 'N/A'}</p>
                            <div className="flex items-center gap-1 mt-1">
                              {user.cv?.url ? (
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
                        <div>
                          <p className="text-slate-900 dark:text-white">{user.email || 'N/A'}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email || 'No email'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {user.intrestRoles && user.intrestRoles.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {user.intrestRoles.slice(0, 2).map((role, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {typeof role === 'object' ? role.name : role}
                                </Badge>
                              ))}
                              {user.intrestRoles.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{user.intrestRoles.length - 2} more
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              No roles
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                          <Calendar className="w-4 h-4" />
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={(user.status || 'new') === 'new' ? 'default' : 
                                    (user.status || 'new') === 'reviewed' ? 'secondary' :
                                    (user.status || 'new') === 'shortlisted' ? 'default' : 'destructive'}
                            className={(user.status || 'new') === 'shortlisted' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                          >
                            {user.status || 'new'}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openStatusDialog(user)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1"
                            title="Update Status"
                          >
                            <Edit3 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openCvViewer(user)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadCv(user)}
                            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                            title="Download CV"
                            disabled={!user.cv?.url}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`mailto:${user.email}`, '_blank')}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            title="Send Email"
                            disabled={!user.email}
                          >
                            <Mail className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Delete User"
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
                    <p className="text-sm text-slate-600 dark:text-slate-400">{selectedCvForStatus.role || 'N/A'}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Current Status: <span className="font-semibold">{selectedCvForStatus.status || 'new'}</span>
                  </label>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Select a new status for this CV:
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={tempStatus === 'new' ? 'default' : 'outline'}
                      onClick={() => handleStatusSelect('new')}
                      className="justify-start"
                    >
                      New
                    </Button>
                    <Button
                      variant={tempStatus === 'reviewed' ? 'default' : 'outline'}
                      onClick={() => handleStatusSelect('reviewed')}
                      className="justify-start"
                    >
                      Reviewed
                    </Button>
                    <Button
                      variant={tempStatus === 'shortlisted' ? 'default' : 'outline'}
                      onClick={() => handleStatusSelect('shortlisted')}
                      className="justify-start bg-green-600 hover:bg-green-700 text-white"
                    >
                      Shortlisted
                    </Button>
                    <Button
                      variant={tempStatus === 'rejected' ? 'default' : 'outline'}
                      onClick={() => handleStatusSelect('rejected')}
                      className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Rejected
                    </Button>
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

    </div>
  )
}

export default AdminCvManagement