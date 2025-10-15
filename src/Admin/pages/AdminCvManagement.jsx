import React, { useState, useMemo, useCallback } from 'react'
import { useOutletContext } from 'react-router-dom'
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
  Edit3
} from 'lucide-react'

const AdminCvManagement = () => {
  const { cvData, setCvData } = useOutletContext()
  const [adminFilters, setAdminFilters] = useState({
    search: '',
    status: '',
    dateRange: { start: '', end: '' }
  })
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [selectedCvForStatus, setSelectedCvForStatus] = useState(null)
  const [tempStatus, setTempStatus] = useState('')



  const exportCvData = useCallback(() => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Name,Email,Phone,Role,Status,Upload Date,Location,Experience,Education\n" +
      cvData.map(cv => `${cv.name},${cv.email},${cv.phone},${cv.role},${cv.status},${cv.uploadedDate},${cv.location},${cv.experience},${cv.education}`).join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "cv_data.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [cvData])

  const downloadCv = useCallback((cv) => {
    // Create a mock CV file content
    const cvContent = `
CV - ${cv.name}
================

Contact Information:
- Name: ${cv.name}
- Email: ${cv.email}
- Phone: ${cv.phone}
- Location: ${cv.location}

Professional Information:
- Role: ${cv.role.replace('-', ' ')}
- Experience: ${cv.experience}
- Education: ${cv.education}

Skills:
${cv.skills.map(skill => `- ${skill}`).join('\n')}

Summary:
${cv.summary}

Status: ${cv.status}
Uploaded: ${cv.uploadedDate}
    `.trim()

    const blob = new Blob([cvContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${cv.name.replace(' ', '_')}_CV.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }, [])

  const updateCvStatus = useCallback((cvId, newStatus) => {
    setCvData(prev => prev.map(cv => 
      cv.id === cvId ? { ...cv, status: newStatus } : cv
    ))
  }, [setCvData])

  const openStatusDialog = useCallback((cv) => {
    setSelectedCvForStatus(cv)
    setTempStatus(cv.status)
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
      updateCvStatus(selectedCvForStatus.id, tempStatus)
      closeStatusDialog()
    }
  }, [selectedCvForStatus, tempStatus, updateCvStatus, closeStatusDialog])


  const filteredCvs = useMemo(() => {
    if (!cvData || !Array.isArray(cvData)) {
      console.log('cvData is not available or not an array:', cvData)
      return []
    }
    
    const filtered = cvData.filter(cv => {
      const matchesSearch = cv.name.toLowerCase().includes(adminFilters.search.toLowerCase()) ||
                           cv.email.toLowerCase().includes(adminFilters.search.toLowerCase()) ||
                           cv.role.toLowerCase().includes(adminFilters.search.toLowerCase())
      const matchesStatus = !adminFilters.status || cv.status === adminFilters.status
      const matchesDate = !adminFilters.dateRange?.start || 
        (new Date(cv.uploadedDate) >= new Date(adminFilters.dateRange.start))
      
      return matchesSearch && matchesStatus && matchesDate
    })
    
    
    return filtered
  }, [cvData, adminFilters])


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">CV Management</h2>
          <p className="text-slate-600 dark:text-slate-400">Manage uploaded resumes and applicant data</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button variant="outline" onClick={exportCvData} className="w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add CV
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
                {filteredCvs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-12 h-12 text-slate-400" />
                        <p className="text-slate-600 dark:text-slate-400">
                          {cvData && cvData.length > 0 
                            ? 'No CVs match your current filters' 
                            : 'No CV data available'}
                        </p>
                        {cvData && cvData.length > 0 && (
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
                  filteredCvs.map((cv) => {
                  return (
                    <TableRow key={cv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                              {cv.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{cv.name}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{cv.phone}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-slate-900 dark:text-white">{cv.email}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {cv.location}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {cv.role.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                          <Calendar className="w-4 h-4" />
                          {cv.uploadedDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={cv.status === 'new' ? 'default' : 
                                    cv.status === 'reviewed' ? 'secondary' :
                                    cv.status === 'shortlisted' ? 'default' : 'destructive'}
                            className={cv.status === 'shortlisted' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                          >
                            {cv.status}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openStatusDialog(cv)}
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
                            onClick={() => downloadCv(cv)}
                            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                            title="Download CV"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`mailto:${cv.email}`, '_blank')}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            title="Send Email"
                          >
                            <Mail className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Delete CV"
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
                      {selectedCvForStatus.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{selectedCvForStatus.name}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{selectedCvForStatus.role.replace('-', ' ')}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Current Status: <span className="font-semibold">{selectedCvForStatus.status}</span>
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

    </div>
  )
}

export default AdminCvManagement
