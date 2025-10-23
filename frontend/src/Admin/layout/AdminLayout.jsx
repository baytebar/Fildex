import React, { useState, useCallback, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getAllUsers, getAllDepartments, getAllAdmins, getAllJobTitles, getAllJobPostings, adminLogout } from '../../features/admin/adminSlice'
import { fetchAllResumes } from '../../features/resume/resumeSlice'
import { fetchRecentCvs, checkForNewCvs, markAsRead, markAllAsRead, addCvUploadNotification } from '../../features/notifications/notificationSlice'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Toaster } from 'sonner'
import { 
  LayoutDashboard, 
  Bell, 
  LogOut, 
  FileText, 
  Briefcase, 
  User,
  Users,
  Building,
  X
} from 'lucide-react'
import FildexLogo from '../../images/FILDEX_SOLUTIONS.png'
import Spinner from '../../components/Spinner'

const AdminLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false)
  
  // Get data from Redux
  const { data: users, totalUsers, isLoading: usersLoading = false } = useSelector((state) => state.admin.users)
  const { data: departments, isLoading: departmentsLoading = false } = useSelector((state) => state.admin.departments)
  const { data: admins, totalAdmins, isLoading: adminsLoading = false } = useSelector((state) => state.admin.admins)
  const { data: jobTitles, isLoading: jobTitlesLoading = false } = useSelector((state) => state.admin.jobTitles)
  const { totalJobs: totalJobPostings, isLoading: jobPostingsLoading = false } = useSelector((state) => state.admin.jobPostings)
  const { pagination: resumePagination, isLoading: resumesLoading = false } = useSelector((state) => state.resume)
  const { isAuthenticated } = useSelector((state) => state.admin)
  const { newCvNotifications, unreadCount, lastChecked } = useSelector((state) => state.notifications)
  const { uploadStatus } = useSelector((state) => state.resume)
  
  // Check if any critical data is still loading (only show loader on initial load)
  const isInitialLoading = (usersLoading || departmentsLoading || adminsLoading || jobTitlesLoading || jobPostingsLoading || resumesLoading) && isAuthenticated && !hasInitiallyLoaded
  
  

  // Fetch data when admin is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getAllUsers({ page: 1, limit: 10 }))
      dispatch(getAllDepartments())
      dispatch(getAllAdmins({ page: 1, limit: 10 }))
      dispatch(getAllJobTitles())
      dispatch(getAllJobPostings({ page: 1, limit: 10 }))
      dispatch(fetchAllResumes({ page: 1, limit: 10 }))
      // dispatch(fetchRecentCvs()) // Disabled automatic recent CVs fetching
    }
  }, [dispatch, isAuthenticated])

  // Track when initial data has been loaded
  useEffect(() => {
    if (isAuthenticated && !usersLoading && !departmentsLoading && !adminsLoading && !jobTitlesLoading && !jobPostingsLoading && !resumesLoading && !hasInitiallyLoaded) {
      setHasInitiallyLoaded(true)
    }
  }, [isAuthenticated, usersLoading, departmentsLoading, adminsLoading, jobTitlesLoading, jobPostingsLoading, resumesLoading, hasInitiallyLoaded])

  // Fallback timeout to hide loader after 10 seconds
  useEffect(() => {
    if (isAuthenticated && !hasInitiallyLoaded) {
      const timeout = setTimeout(() => {
        setHasInitiallyLoaded(true)
      }, 10000) // 10 seconds timeout

      return () => clearTimeout(timeout)
    }
  }, [isAuthenticated, hasInitiallyLoaded])

  // Poll for new CVs every 10 seconds
  useEffect(() => {
    if (!isAuthenticated) return

    // Initial fetch of recent CVs - DISABLED
    // dispatch(fetchRecentCvs())

    // DISABLED: Polling for new CVs
    // const pollInterval = setInterval(() => {
    //   const checkTime = lastChecked || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // Check last 24 hours if no previous check
    //   dispatch(checkForNewCvs(checkTime))
    // }, 10000) // Check every 10 seconds

    // return () => clearInterval(pollInterval) // Disabled since polling is disabled
  }, [dispatch, isAuthenticated, lastChecked])
  const [showRoleDialog, setShowRoleDialog] = useState(false)
  const [selectedUserForRole, setSelectedUserForRole] = useState(null)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const availableRoles = [
    { id: 'admin', name: 'Administrator', description: 'Full access to all features', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
    { id: 'hr-manager', name: 'HR Manager', description: 'Manage CVs and job postings', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
    { id: 'recruiter', name: 'Recruiter', description: 'View CVs and manage applications', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
    { id: 'viewer', name: 'Viewer', description: 'Read-only access to data', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' }
  ]

  const navigation = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, path: '/admin' },
    { id: 'cv-management', label: 'CV Management', icon: FileText, path: '/admin/cv-management' },
    { id: 'job-postings', label: 'Job Postings', icon: Briefcase, path: '/admin/job-postings' },
    { id: 'job-titles', label: 'Job Titles', icon: Briefcase, path: '/admin/job-titles' },
    { id: 'department-management', label: 'Departments', icon: Building, path: '/admin/departments' },
    { id: 'role-management', label: 'Role Management', icon: Users, path: '/admin/role-management' },
    { id: 'admin-registration', label: 'Add Admin', icon: User, path: '/admin/register' }
  ]

  const getCurrentTab = () => {
    const currentPath = location.pathname
    const currentNav = navigation.find(nav => nav.path === currentPath)
    return currentNav ? currentNav.id : 'overview'
  }

  const handleNavigation = useCallback((path) => {
    navigate(path)
    setShowMobileMenu(false)
  }, [navigate])

  const toggleNotifications = useCallback(() => {
    setShowNotifications(prev => !prev)
  }, [])



  const openRoleDialog = useCallback((cv) => {
    setSelectedUserForRole(cv)
    setShowRoleDialog(true)
  }, [])

  const assignRole = useCallback((roleId) => {
    if (selectedUserForRole) {
      // TODO: Implement role assignment through Redux/API
      setShowRoleDialog(false)
      setSelectedUserForRole(null)
    }
  }, [selectedUserForRole])

  const handleLogout = useCallback(() => {
    setShowLogoutDialog(true)
  }, [])

  const confirmLogout = useCallback(() => {
    dispatch(adminLogout())
    navigate('/login')
    setShowLogoutDialog(false)
  }, [dispatch, navigate])

  const cancelLogout = useCallback(() => {
    setShowLogoutDialog(false)
  }, [])

  // Show loader while initial data is loading
  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="text-slate-600 dark:text-slate-400 mt-4 text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
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
              <div className="flex justify-center gap-1 sm:gap-2 items-center">
                <img
                  src={FildexLogo}
                  alt="Fildex Logo"
                  className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 xl:h-14 xl:w-14 2xl:h-12 2xl:w-12 shrink-0 cursor-pointer"
                  onClick={() => navigate('/admin')}
                />
                <div className='flex flex-col'>
                  <h1 className='text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-3xl 2xl:text-2xl font-bold text-blue-950 leading-tight cursor-pointer' onClick={() => navigate('/admin')}>
                    FILDEX
                  </h1>
                  <h4 className='text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-blue-950 font-bold leading-tight cursor-pointer' onClick={() => navigate('/admin')}>
                    SOLUTIONS
                  </h4>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleNotifications}
                className="hidden sm:flex relative"
              >
                <Bell className="w-4 h-4 mr-2" />
                Notifications
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleNotifications}
                className="sm:hidden p-2 relative"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 hidden sm:flex"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
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
                <div className="space-y-2">
                  {navigation.map((nav) => {
                    const Icon = nav.icon
                    const isActive = location.pathname === nav.path
                    return (
                      <Button
                        key={nav.id}
                        variant={isActive ? 'default' : 'ghost'}
                        className="w-full justify-start gap-3 h-12"
                        onClick={() => handleNavigation(nav.path)}
                      >
                        <Icon className="w-5 h-5" />
                        {nav.label}
                        {nav.id === 'cv-management' && (
                          <Badge variant="secondary" className="ml-auto">
                            {resumePagination?.totalResumes || 0}
                          </Badge>
                        )}
                        {nav.id === 'job-postings' && (
                          <Badge variant="secondary" className="ml-auto">
                            {totalJobPostings || 0}
                          </Badge>
                        )}
                        {nav.id === 'job-titles' && (
                          <Badge variant="secondary" className="ml-auto">
                            {jobTitles?.length || 0}
                          </Badge>
                        )}
                        {nav.id === 'department-management' && (
                          <Badge variant="secondary" className="ml-auto">
                            {departments?.length || 0}
                          </Badge>
                        )}
                        {nav.id === 'role-management' && (
                          <Badge variant="secondary" className="ml-auto">
                            {totalAdmins || 0}
                          </Badge>
                        )}
                      </Button>
                    )
                  })}
                  
                  {/* Logout button in mobile menu */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 h-12 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </Button>
                  </div>
                </div>
              </nav>
            </aside>
          </div>
        )}

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 min-h-screen">
          <nav className="p-4">
            <div className="space-y-2">
              {navigation.map((nav) => {
                const Icon = nav.icon
                const isActive = location.pathname === nav.path
                return (
                  <Button
                    key={nav.id}
                    variant={isActive ? 'default' : 'ghost'}
                    className="w-full justify-start gap-3 h-12"
                    onClick={() => handleNavigation(nav.path)}
                  >
                    <Icon className="w-5 h-5" />
                    {nav.label}
                    {nav.id === 'cv-management' && (
                      <Badge variant="secondary" className="ml-auto">
                        {resumePagination?.totalResumes || 0}
                      </Badge>
                    )}
                    {nav.id === 'job-postings' && (
                      <Badge variant="secondary" className="ml-auto">
                        {totalJobPostings || 0}
                      </Badge>
                    )}
                    {nav.id === 'job-titles' && (
                      <Badge variant="secondary" className="ml-auto">
                        {jobTitles?.length || 0}
                      </Badge>
                    )}
                    {nav.id === 'department-management' && (
                      <Badge variant="secondary" className="ml-auto">
                        {departments?.length || 0}
                      </Badge>
                    )}
                    {nav.id === 'role-management' && (
                      <Badge variant="secondary" className="ml-auto">
                        {totalAdmins || 0}
                      </Badge>
                    )}
                  </Button>
                )
              })}
              
              {/* Logout button in desktop sidebar */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-12 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </Button>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6">
          <Outlet context={{ 
            openRoleDialog,
            availableRoles: [] // TODO: Fetch from Redux/API
          }} />
        </main>


        {/* Notifications Panel */}
        {showNotifications && (
          <div className="fixed inset-0 z-50 flex">
            <div 
              className="flex-1 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowNotifications(false)}
            />
            <div className="w-full sm:w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 shadow-2xl">
              <div className="h-full flex flex-col">
                <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
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

                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                  {newCvNotifications.length > 0 ? (
                    <div className="space-y-4">
                      {newCvNotifications.map((notification) => (
                        <div 
                          key={notification.id}
                          className={`p-4 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer ${
                            notification.read 
                              ? 'bg-slate-50 dark:bg-slate-800' 
                              : 'bg-blue-50 dark:bg-blue-900/20'
                          }`}
                          onClick={() => dispatch(markAsRead(notification.id))}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.read ? 'bg-slate-400' : 'bg-blue-600'
                            }`}></div>
                            <div className="flex-1">
                              <p className="font-medium text-slate-900 dark:text-white">
                                {notification.type === 'cv_upload' ? 'New CV Upload' : 'Notification'}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {notification.message}
                              </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {(() => {
                      try {
                        if (notification.timestamp) {
                          const date = new Date(notification.timestamp);
                          return isNaN(date.getTime()) ? 'Just now' : date.toLocaleString();
                        }
                        return 'Just now';
                      } catch (error) {
                        return 'Just now';
                      }
                    })()}
                  </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Bell className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 dark:text-slate-400">No notifications yet</p>
                      <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                        You'll see CV upload notifications here
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex gap-2">
                    {newCvNotifications.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => dispatch(markAllAsRead())}
                        className="flex-1"
                      >
                        Mark All as Read
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowNotifications(false)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Role Assignment Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Role</DialogTitle>
            <DialogDescription>
              Assign a role to {selectedUserForRole?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {availableRoles.map((role) => (
              <div
                key={role.id}
                className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                onClick={() => assignRole(role.id)}
              >
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{role.name}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{role.description}</p>
                </div>
                <Badge className={role.color}>
                  {role.name}
                </Badge>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout from the admin dashboard? You will need to login again to access the admin features.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3 pt-4">
            <Button
              variant="outline"
              onClick={cancelLogout}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmLogout}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
    </div>
  )
}

export default AdminLayout


