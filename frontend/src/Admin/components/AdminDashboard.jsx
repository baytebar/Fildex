import React, { useState, useMemo, useCallback } from 'react'
import JobPostingForm from './JobPostingForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Search, FileText, Check, Clock, Users, 
  Mail, Trash2, FolderOpen, Briefcase, Pause, Play, 
  Plus, LogOut, X, LayoutDashboard, User, 
  Download, Eye, Edit, Filter, MoreHorizontal,
  TrendingUp, Calendar, UserCheck, FileSpreadsheet,
  Building2, MapPin, DollarSign, Clock3, Star,
  ChevronDown, Settings, Bell, HelpCircle
} from 'lucide-react'

const AdminDashboard = ({ showAdmin, setShowAdmin, cvData, setCvData, jobPostings, setJobPostings }) => {
  const [adminFilters, setAdminFilters] = useState({ search: '', role: '', status: '', sortBy: 'uploadedDate', sortOrder: 'desc' })
  const [activeTab, setActiveTab] = useState('overview') // 'overview', 'cv', 'jobs', 'analytics'
  const [showJobForm, setShowJobForm] = useState(false)
  const [jobFilters, setJobFilters] = useState({ search: '', department: '', status: '', sortBy: 'postedDate', sortOrder: 'desc' })
  const [jobApplications, setJobApplications] = useState([]) // For tracking job applications
  const [selectedCv, setSelectedCv] = useState(null)
  const [showCvDialog, setShowCvDialog] = useState(false)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    autoDeleteExpired: false,
    retentionDays: 365
  })
  const [tempSettings, setTempSettings] = useState({
    notifications: true,
    emailAlerts: true,
    autoDeleteExpired: false,
    retentionDays: 365
  })

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


  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
    // In a real app, you would save to localStorage or send to server
    localStorage.setItem('adminSettings', JSON.stringify({ ...settings, ...newSettings }))
  }, [settings])

  const openSettings = useCallback(() => {
    setTempSettings({ ...settings })
    setShowSettingsDialog(true)
  }, [settings])

  const saveSettings = useCallback(() => {
    setSettings({ ...tempSettings })
    localStorage.setItem('adminSettings', JSON.stringify(tempSettings))
    setShowSettingsDialog(false)
  }, [tempSettings])

  const discardSettings = useCallback(() => {
    setTempSettings({ ...settings })
    setShowSettingsDialog(false)
  }, [settings])

  const updateTempSettings = useCallback((newSettings) => {
    setTempSettings(prev => ({ ...prev, ...newSettings }))
  }, [])

  const toggleNotifications = useCallback(() => {
    setShowNotifications(prev => !prev)
  }, [])

  if (!showAdmin) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2"
              >
            <LayoutDashboard className="w-5 h-5" />
              </Button>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
              <div className="hidden sm:block">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Manage CVs and job postings</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">Admin</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleNotifications}
                className="hidden sm:flex"
              >
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleNotifications}
                className="sm:hidden p-2"
              >
                <Bell className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={openSettings}
                className="hidden sm:flex"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={openSettings}
                className="sm:hidden p-2"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowAdmin(false)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 hidden sm:flex"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowAdmin(false)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 sm:hidden p-2"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

       <div className="flex relative">
         {/* Mobile Menu Overlay */}
         {showMobileMenu && (
           <div className="fixed inset-0 z-40 lg:hidden">
             <div 
               className="fixed inset-0 bg-black/50 backdrop-blur-sm"
               onClick={() => setShowMobileMenu(false)}
             />
             <aside className="fixed left-0 top-0 w-64 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 shadow-2xl z-50">
               <nav className="p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-1 mb-6">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Overview
                </TabsTrigger>
              </TabsList>
              
              <div className="space-y-2">
              <Button
                variant={activeTab === 'cv' ? 'default' : 'ghost'}
                  className="w-full justify-start gap-3 h-12"
                onClick={() => setActiveTab('cv')}
              >
                  <User className="w-5 h-5" />
                CV Management
                  <Badge variant="secondary" className="ml-auto">
                    {cvData.length}
                  </Badge>
              </Button>
                
              <Button
                variant={activeTab === 'jobs' ? 'default' : 'ghost'}
                  className="w-full justify-start gap-3 h-12"
                onClick={() => setActiveTab('jobs')}
              >
                  <Briefcase className="w-5 h-5" />
                Job Postings
                  <Badge variant="secondary" className="ml-auto">
                    {jobPostings.length}
                  </Badge>
              </Button>
        
          <Button 
                  variant={activeTab === 'analytics' ? 'default' : 'ghost'}
                  className="w-full justify-start gap-3 h-12"
                  onClick={() => setActiveTab('analytics')}
                >
                  <TrendingUp className="w-5 h-5" />
                  Analytics
          </Button>
        </div>
            </Tabs>
        </nav>
             </aside>
           </div>
         )}

         {/* Desktop Sidebar */}
         <aside className="hidden lg:block w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 min-h-screen">
          <nav className="p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-1 mb-6">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Overview
                </TabsTrigger>
              </TabsList>
              
              <div className="space-y-2">
          <Button 
                variant={activeTab === 'cv' ? 'default' : 'ghost'}
                  className="w-full justify-start gap-3 h-12"
                onClick={() => setActiveTab('cv')}
              >
                  <User className="w-5 h-5" />
                CV Management
                  <Badge variant="secondary" className="ml-auto">
                    {cvData.length}
                  </Badge>
              </Button>
                
              <Button
                variant={activeTab === 'jobs' ? 'default' : 'ghost'}
                  className="w-full justify-start gap-3 h-12"
                onClick={() => setActiveTab('jobs')}
              >
                  <Briefcase className="w-5 h-5" />
                Job Postings
                  <Badge variant="secondary" className="ml-auto">
                    {jobPostings.length}
                  </Badge>
              </Button>
        
          <Button 
                  variant={activeTab === 'analytics' ? 'default' : 'ghost'}
                  className="w-full justify-start gap-3 h-12"
                  onClick={() => setActiveTab('analytics')}
                >
                  <TrendingUp className="w-5 h-5" />
                  Analytics
          </Button>
        </div>
            </Tabs>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Dashboard Overview</h2>
                <p className="text-slate-600 dark:text-slate-400">Welcome to your admin dashboard</p>
      </div>
      
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">Total CVs</p>
                        <p className="text-3xl font-bold">{cvData.length}</p>
          </div>
                      <FileText className="w-8 h-8 text-blue-200" />
                    </div>
                    <div className="mt-4 flex items-center text-blue-100 text-sm">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +12% from last month
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm font-medium">Active Jobs</p>
                        <p className="text-3xl font-bold">{jobPostings.filter(job => job.status === 'active').length}</p>
              </div>
                      <Briefcase className="w-8 h-8 text-green-200" />
                    </div>
                    <div className="mt-4 flex items-center text-green-100 text-sm">
                      <UserCheck className="w-4 h-4 mr-1" />
                      {jobPostings.reduce((sum, job) => sum + job.applicants, 0)} total applicants
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                <div>
                        <p className="text-purple-100 text-sm font-medium">New This Week</p>
                        <p className="text-3xl font-bold">{cvData.filter(cv => {
                          const weekAgo = new Date()
                          weekAgo.setDate(weekAgo.getDate() - 7)
                          return new Date(cv.uploadedDate) > weekAgo
                        }).length}</p>
                </div>
                      <Calendar className="w-8 h-8 text-purple-200" />
                    </div>
                    <div className="mt-4 flex items-center text-purple-100 text-sm">
                      <Clock3 className="w-4 h-4 mr-1" />
                      Recent uploads
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                <div>
                        <p className="text-orange-100 text-sm font-medium">Success Rate</p>
                        <p className="text-3xl font-bold">94%</p>
                </div>
                      <Star className="w-8 h-8 text-orange-200" />
                    </div>
                    <div className="mt-4 flex items-center text-orange-100 text-sm">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +5% improvement
                    </div>
                  </CardContent>
                </Card>
          </div>
          
              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Recent CV Uploads
                    </CardTitle>
                    <CardDescription>Latest CV submissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {cvData.slice(0, 5).map((cv) => (
                        <div key={cv.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                              {cv.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-900 dark:text-white truncate">{cv.name}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{cv.email}</p>
              </div>
                          <div className="text-right">
                            <Badge variant={cv.status === 'active' ? 'default' : 'secondary'}>
                              {cv.status}
                            </Badge>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{cv.uploadedDate}</p>
            </div>
                        </div>
                      ))}
              </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      Active Job Postings
                    </CardTitle>
                    <CardDescription>Currently open positions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {jobPostings.filter(job => job.status === 'active').slice(0, 5).map((job) => (
                        <div key={job.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-green-600 dark:text-green-300" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-900 dark:text-white truncate">{job.title}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 truncate">{job.department} • {job.location}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline">{job.applicants} applicants</Badge>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{job.postedDate}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                </div>
            </TabsContent>
              
            {/* CV Management Tab */}
            <TabsContent value="cv" className="space-y-6">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={adminFilters.search}
                          onChange={(e) => setAdminFilters(prev => ({ ...prev, search: e.target.value }))}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Search by name or email..."
                        />
                      </div>
                      <select
                        value={adminFilters.role}
                        onChange={(e) => setAdminFilters(prev => ({ ...prev, role: e.target.value }))}
                      className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All Roles</option>
                        <option value="cloud-engineer">Cloud Engineer</option>
                        <option value="devops-engineer">DevOps Engineer</option>
                        <option value="ai-ml-developer">AI/ML Developer</option>
                        <option value="network-engineer">Network Engineer</option>
                        <option value="software-developer">Software Developer</option>
                        <option value="internship">Internship</option>
                      </select>
                      <select
                        value={adminFilters.status}
                        onChange={(e) => setAdminFilters(prev => ({ ...prev, status: e.target.value }))}
                      className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="expired">Expired</option>
                      </select>
                      <select
                        value={`${adminFilters.sortBy}-${adminFilters.sortOrder}`}
                        onChange={(e) => {
                          const [sortBy, sortOrder] = e.target.value.split('-')
                          setAdminFilters(prev => ({ ...prev, sortBy, sortOrder }))
                        }}
                      className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="uploadedDate-desc">Newest First</option>
                        <option value="uploadedDate-asc">Oldest First</option>
                        <option value="name-asc">Name A-Z</option>
                        <option value="name-desc">Name Z-A</option>
                      </select>
                    </div>
                </CardContent>
              </Card>

              {/* CV Table */}
              <Card>
                <CardContent className="p-0">
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
                      {filteredCvData.map((cv) => (
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
                            <p className="text-slate-900 dark:text-white">{cv.email}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                                  {cv.role.replace('-', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <p className="text-slate-600 dark:text-slate-400">{cv.uploadedDate}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant={cv.status === 'active' ? 'default' : 'secondary'}>
                              {cv.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedCv(cv)
                                  setShowCvDialog(true)
                                }}
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                    onClick={() => window.open(`mailto:${cv.email}`, '_blank')}
                                    title="Send Email"
                                  >
                                    <Mail className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                size="sm"
                                    onClick={() => deleteCv(cv.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    title="Delete CV"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                          </TableCell>
                        </TableRow>
                          ))}
                    </TableBody>
                  </Table>
                    
                    {filteredCvData.length === 0 && (
                    <div className="p-12 text-center">
                      <FolderOpen className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                      <p className="text-lg font-medium text-slate-900 dark:text-white mb-2">No CVs found</p>
                      <p className="text-slate-600 dark:text-slate-400">Try adjusting your filters or upload a new CV</p>
                      </div>
                    )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Job Postings Tab */}
            <TabsContent value="jobs" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Job Postings</h2>
                  <p className="text-slate-600 dark:text-slate-400">Manage job postings and applications</p>
                  </div>
                <Button onClick={() => setShowJobForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Post New Job
                </Button>
                  </div>

              {showJobForm ? (
                <JobPostingForm 
                  onAddJob={addJobPosting} 
                  onCancel={() => setShowJobForm(false)} 
                />
              ) : (
                <>
                  {/* Job Filters */}
                  <Card>
                    <CardContent className="p-4 sm:p-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={jobFilters.search}
                          onChange={(e) => setJobFilters(prev => ({ ...prev, search: e.target.value }))}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Search jobs..."
                        />
                      </div>
                      <select
                        value={jobFilters.department}
                        onChange={(e) => setJobFilters(prev => ({ ...prev, department: e.target.value }))}
                          className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All Departments</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Operations">Operations</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Sales">Sales</option>
                        <option value="HR">HR</option>
                      </select>
                      <select
                        value={jobFilters.status}
                        onChange={(e) => setJobFilters(prev => ({ ...prev, status: e.target.value }))}
                          className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      <select
                        value={`${jobFilters.sortBy}-${jobFilters.sortOrder}`}
                        onChange={(e) => {
                          const [sortBy, sortOrder] = e.target.value.split('-')
                          setJobFilters(prev => ({ ...prev, sortBy, sortOrder }))
                        }}
                          className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="postedDate-desc">Newest First</option>
                        <option value="postedDate-asc">Oldest First</option>
                        <option value="title-asc">Title A-Z</option>
                        <option value="title-desc">Title Z-A</option>
                        <option value="applicants-desc">Most Applicants</option>
                      </select>
                    </div>
                    </CardContent>
                  </Card>

                  {/* Job Cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredJobPostings.map((job) => (
                      <Card key={job.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg">{job.title}</CardTitle>
                              <CardDescription className="flex items-center gap-2 mt-1">
                                <Building2 className="w-4 h-4" />
                                {job.department}
                              </CardDescription>
                    </div>
                            <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                              {job.status}
                            </Badge>
                    </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                    </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <Clock3 className="w-4 h-4" />
                              {job.type}
                      </div>
                            {job.salary && (
                              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                <DollarSign className="w-4 h-4" />
                                {job.salary}
                    </div>
                            )}
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <Users className="w-4 h-4" />
                              {job.applicants} applicants
                  </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                              {job.description}
                            </p>
                  </div>
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              Posted {job.postedDate}
                                </span>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                size="sm"
                                    onClick={() => toggleJobStatus(job.id)}
                                  >
                                    {job.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                size="sm"
                                    onClick={() => deleteJobPosting(job.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                          </div>
                        </CardContent>
                      </Card>
                          ))}
                    </div>
                    
                    {filteredJobPostings.length === 0 && (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Briefcase className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                        <p className="text-lg font-medium text-slate-900 dark:text-white mb-2">No job postings found</p>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">Try adjusting your filters or post a new job</p>
                        <Button onClick={() => setShowJobForm(true)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Post New Job
                        </Button>
                      </CardContent>
                    </Card>
                    )}
                </>
              )}
            </TabsContent>


            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Analytics</h2>
                <p className="text-slate-600 dark:text-slate-400">Insights and performance metrics</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>CV Upload Trends</CardTitle>
                    <CardDescription>Monthly CV upload statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400">
                      <div className="text-center">
                        <TrendingUp className="w-12 h-12 mx-auto mb-4" />
                        <p>Chart visualization would go here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Job Application Rates</CardTitle>
                    <CardDescription>Application success metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400">
                      <div className="text-center">
                        <FileSpreadsheet className="w-12 h-12 mx-auto mb-4" />
                        <p>Chart visualization would go here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
         </main>

         {/* Settings Sidebar */}
         {showSettingsDialog && (
           <div className="fixed inset-0 z-50 flex">
             {/* Backdrop */}
             <div 
               className="flex-1 bg-black/50 backdrop-blur-sm"
               onClick={discardSettings}
             />
             
             {/* Settings Sidebar */}
             <div className="w-full sm:w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 shadow-2xl">
               <div className="h-full flex flex-col">
                 {/* Header */}
                 <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                         <Settings className="w-5 h-5 text-white" />
                       </div>
                       <div>
                         <h2 className="text-xl font-bold text-slate-900 dark:text-white">Settings</h2>
                         <p className="text-sm text-slate-600 dark:text-slate-400">Configure your preferences</p>
                       </div>
                     </div>
                     <Button
                       variant="ghost"
                       size="icon"
                       onClick={discardSettings}
                       className="text-slate-400 hover:text-slate-600"
                     >
                       <X className="w-5 h-5" />
                     </Button>
                   </div>
                 </div>

                 {/* Content */}
                 <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                   <div className="space-y-6">
                     {/* Notifications Section */}
                     <div className="space-y-4">
                       <h4 className="font-medium text-slate-900 dark:text-white">Notifications</h4>
                       <div className="space-y-3">
                         <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                           <div>
                             <p className="font-medium text-slate-900 dark:text-white">Push Notifications</p>
                             <p className="text-sm text-slate-600 dark:text-slate-400">Receive notifications for new CV uploads</p>
                           </div>
                           <label className="relative inline-flex items-center cursor-pointer">
                             <input
                               type="checkbox"
                               checked={tempSettings.notifications}
                               onChange={(e) => updateTempSettings({ notifications: e.target.checked })}
                               className="sr-only peer"
                             />
                             <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                           </label>
                         </div>
                         
                         <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                           <div>
                             <p className="font-medium text-slate-900 dark:text-white">Email Alerts</p>
                             <p className="text-sm text-slate-600 dark:text-slate-400">Get email notifications for important events</p>
                           </div>
                           <label className="relative inline-flex items-center cursor-pointer">
                             <input
                               type="checkbox"
                               checked={tempSettings.emailAlerts}
                               onChange={(e) => updateTempSettings({ emailAlerts: e.target.checked })}
                               className="sr-only peer"
                             />
                             <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                           </label>
                         </div>
                       </div>
                     </div>

                     {/* Data Management Section */}
                     <div className="space-y-4">
                       <h4 className="font-medium text-slate-900 dark:text-white">Data Management</h4>
                       <div className="space-y-3">
                         <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                           <div>
                             <p className="font-medium text-slate-900 dark:text-white">Auto-delete Expired CVs</p>
                             <p className="text-sm text-slate-600 dark:text-slate-400">Automatically remove CVs after retention period</p>
                           </div>
                           <label className="relative inline-flex items-center cursor-pointer">
                             <input
                               type="checkbox"
                               checked={tempSettings.autoDeleteExpired}
                               onChange={(e) => updateTempSettings({ autoDeleteExpired: e.target.checked })}
                               className="sr-only peer"
                             />
                             <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                           </label>
                         </div>
                         
                         <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                           <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                             CV Retention Period (Days)
                           </label>
                           <input
                             type="number"
                             value={tempSettings.retentionDays}
                             onChange={(e) => updateTempSettings({ retentionDays: parseInt(e.target.value) })}
                             className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                             min="30"
                             max="1095"
                           />
                           <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">CVs will be retained for this many days (30-1095)</p>
                         </div>
                       </div>
                     </div>

                   </div>
                 </div>

                 {/* Footer */}
                 <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-700">
                   <div className="flex items-center gap-3">
                     <Button
                       variant="outline"
                       onClick={discardSettings}
                       className="flex-1"
                     >
                       Discard
                     </Button>
                     <Button
                       onClick={saveSettings}
                       className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                     >
                       Save Changes
                     </Button>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         )}

         {/* Notifications Panel */}
         {showNotifications && (
           <div className="fixed inset-0 z-50 flex">
             {/* Backdrop */}
             <div 
               className="flex-1 bg-black/50 backdrop-blur-sm"
               onClick={() => setShowNotifications(false)}
             />
             
             {/* Notifications Panel */}
             <div className="w-full sm:w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 shadow-2xl">
               <div className="h-full flex flex-col">
                 {/* Header */}
                 <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                         <Bell className="w-5 h-5 text-white" />
                       </div>
                       <div>
                         <h2 className="text-xl font-bold text-slate-900 dark:text-white">Notifications</h2>
                         <p className="text-sm text-slate-600 dark:text-slate-400">Recent activity and alerts</p>
                       </div>
                     </div>
                     <Button
                       variant="ghost"
                       size="icon"
                       onClick={() => setShowNotifications(false)}
                       className="text-slate-400 hover:text-slate-600"
                     >
                       <X className="w-5 h-5" />
                     </Button>
                   </div>
                 </div>

                 {/* Content */}
                 <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                   <div className="space-y-4">
                     {/* Sample Notifications */}
                     <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                       <div className="flex items-start gap-3">
                         <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                         <div className="flex-1">
                           <p className="font-medium text-slate-900 dark:text-white">New CV Upload</p>
                           <p className="text-sm text-slate-600 dark:text-slate-400">John Smith uploaded a CV for Cloud Engineer position</p>
                           <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">2 minutes ago</p>
                         </div>
                       </div>
                     </div>
                     <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-green-50 dark:bg-green-900/20">
                       <div className="flex items-start gap-3">
                         <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                         <div className="flex-1">
                           <p className="font-medium text-slate-900 dark:text-white">Job Application</p>
                           <p className="text-sm text-slate-600 dark:text-slate-400">Sarah Johnson applied for DevOps Specialist role</p>
                           <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">15 minutes ago</p>
                         </div>
                       </div>
                     </div>

                     <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                       <div className="flex items-start gap-3">
                         <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                         <div className="flex-1">
                           <p className="font-medium text-slate-900 dark:text-white">CV Expiring Soon</p>
                           <p className="text-sm text-slate-600 dark:text-slate-400">Mike O'Brien's CV will expire in 3 days</p>
                           <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">1 hour ago</p>
                         </div>
                       </div>
                     </div>

                     <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                       <div className="flex items-start gap-3">
                         <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                         <div className="flex-1">
                           <p className="font-medium text-slate-900 dark:text-white">System Update</p>
                           <p className="text-sm text-slate-600 dark:text-slate-400">Admin dashboard has been updated with new features</p>
                           <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">2 hours ago</p>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>

                 {/* Footer */}
                 <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-700">
                   <Button
                     variant="outline"
                     className="w-full"
                     onClick={() => setShowNotifications(false)}
                   >
                     Mark All as Read
                   </Button>
                 </div>
               </div>
             </div>
           </div>
          )}
        </div>

       {/* CV Detail Dialog */}
      <Dialog open={showCvDialog} onOpenChange={setShowCvDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>CV Details</DialogTitle>
            <DialogDescription>View detailed information about this CV</DialogDescription>
          </DialogHeader>
          {selectedCv && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 text-lg">
                    {selectedCv.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedCv.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{selectedCv.email}</p>
                  <p className="text-slate-600 dark:text-slate-400">{selectedCv.phone}</p>
      </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
                  <p className="text-slate-900 dark:text-white">{selectedCv.role.replace('-', ' ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                  <Badge variant={selectedCv.status === 'active' ? 'default' : 'secondary'}>
                    {selectedCv.status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Uploaded</label>
                  <p className="text-slate-900 dark:text-white">{selectedCv.uploadedDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Retention Date</label>
                  <p className="text-slate-900 dark:text-white">{selectedCv.retentionDate}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>


       </div>
  )
}

export default AdminDashboard