import React, { useState, useCallback, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getAllUsers, adminLogout } from '../../features/admin/adminSlice'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { 
  LayoutDashboard, 
  Bell, 
  Settings, 
  LogOut, 
  FileText, 
  Briefcase, 
  User,
  Users,
  X
} from 'lucide-react'
import FildexLogo from '../../images/FILDEX_SOLUTIONS.png'

const AdminLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)
  
  // Get data from Redux
  const { data: users, totalUsers } = useSelector((state) => state.admin.users)
  const { isAuthenticated } = useSelector((state) => state.admin)

  // Fetch users data when admin is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getAllUsers({ page: 1, limit: 10 }))
    }
  }, [dispatch, isAuthenticated])
  const [showRoleDialog, setShowRoleDialog] = useState(false)
  const [selectedUserForRole, setSelectedUserForRole] = useState(null)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
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
    { id: 'role-management', label: 'Role Management', icon: Users, path: '/admin/role-management' }
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

  const openRoleDialog = useCallback((cv) => {
    setSelectedUserForRole(cv)
    setShowRoleDialog(true)
  }, [])

  const assignRole = useCallback((roleId) => {
    if (selectedUserForRole) {
      // TODO: Implement role assignment through Redux/API
      console.log('Assigning role', roleId, 'to user', selectedUserForRole.id)
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
              <div className="flex justify-center gap-1 sm:gap-2 items-center">
                <img
                  src={FildexLogo}
                  alt="Fildex Logo"
                  className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12 2xl:h-10 2xl:w-10 flex-shrink-0 cursor-pointer"
                  onClick={() => navigate('/admin')}
                />
                <div className='flex flex-col'>
                  <h1 className='text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-3xl 2xl:text-2xl font-semibold text-blue-950 leading-tight cursor-pointer' onClick={() => navigate('/admin')}>
                    FILDEX
                  </h1>
                  <h4 className='text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg 2xl:text-base text-blue-950 font-bold leading-tight cursor-pointer' onClick={() => navigate('/admin')}>
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
                            {totalUsers || 0}
                          </Badge>
                        )}
                        {nav.id === 'job-postings' && (
                          <Badge variant="secondary" className="ml-auto">
                            0
                          </Badge>
                        )}
                        {nav.id === 'role-management' && (
                          <Badge variant="secondary" className="ml-auto">
                            {users?.filter(user => user.userRole).length || 0}
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
                        {totalUsers || 0}
                      </Badge>
                    )}
                    {nav.id === 'job-postings' && (
                      <Badge variant="secondary" className="ml-auto">
                        0
                      </Badge>
                    )}
                    {nav.id === 'role-management' && (
                      <Badge variant="secondary" className="ml-auto">
                        {users?.filter(user => user.userRole).length || 0}
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

        {/* Settings Sidebar */}
        {showSettingsDialog && (
          <div className="fixed inset-0 z-50 flex">
            <div 
              className="flex-1 bg-black/50 backdrop-blur-sm"
              onClick={discardSettings}
            />
            <div className="w-full sm:w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 shadow-2xl">
              <div className="h-full flex flex-col">
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

                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                  <div className="space-y-6">
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
            <div 
              className="flex-1 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowNotifications(false)}
            />
            <div className="w-full sm:w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 shadow-2xl">
              <div className="h-full flex flex-col">
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

                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                  <div className="space-y-4">
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
                  </div>
                </div>

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
