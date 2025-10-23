import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog'
import { 
  Search, 
  Plus, 
  User,
  Settings,
  Mail,
  Phone,
  Calendar,
  Trash2,
  Clock
} from 'lucide-react'
import { 
  getAllUsers, 
  getAllAdmins,
  deleteAdmin,
  deleteUser
} from '../../features/admin/adminSlice'
import { toast } from 'sonner'
import Spinner from '../../components/Spinner'

const AdminRoleManagement = () => {
  const dispatch = useDispatch()
  
  // Get data from Redux
  const { data: reduxUsers, isLoading: usersLoading, error: usersError } = useSelector((state) => state.admin.users)
  const { data: admins = [], isLoading: adminsLoading, error: adminsError } = useSelector((state) => state.admin.admins)
  const { isAuthenticated, admin: currentAdmin } = useSelector((state) => state.admin)
  
  const [activeTab, setActiveTab] = useState('admins')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  // Add state for admin deletion confirmation
  const [deleteAdminDialogOpen, setDeleteAdminDialogOpen] = useState(false)
  const [adminToDelete, setAdminToDelete] = useState(null)

  // Check if current admin is super admin
  const isSuperAdmin = currentAdmin?.role === 'super_admin'

  // Handle admin deletion with confirmation
  const handleDeleteAdmin = async (adminId, adminName) => {
    if (!isSuperAdmin) {
      toast.error('Only super admins can delete other admins')
      return
    }
    
    // Set the admin to delete and open confirmation dialog
    setAdminToDelete({ id: adminId, name: adminName })
    setDeleteAdminDialogOpen(true)
  }

  // Confirm admin deletion
  const confirmDeleteAdmin = async () => {
    if (adminToDelete) {
      try {
        await dispatch(deleteAdmin(adminToDelete.id)).unwrap()
        setDeleteAdminDialogOpen(false)
        setAdminToDelete(null)
      } catch (error) {
        // Error is already handled in the thunk
      }
    }
  }

  // Cancel admin deletion
  const cancelDeleteAdmin = () => {
    setDeleteAdminDialogOpen(false)
    setAdminToDelete(null)
  }

  // Handle user deletion
  const handleDeleteUser = async (userId, userName) => {
    setUserToDelete({ id: userId, name: userName })
    setDeleteDialogOpen(true)
  }

  const confirmDeleteUser = async () => {
    if (userToDelete) {
      try {
        await dispatch(deleteUser(userToDelete.id)).unwrap()
        setDeleteDialogOpen(false)
        setUserToDelete(null)
      } catch (error) {
        // Error is already handled in the thunk
      }
    }
  }

  const cancelDeleteUser = () => {
    setDeleteDialogOpen(false)
    setUserToDelete(null)
  }

  // Handle email click - open Gmail compose
  const handleEmailClick = (email) => {
    try {
      // Try to open Gmail compose window
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`
      const gmailWindow = window.open(gmailUrl, '_blank')
      
      // If Gmail doesn't open (popup blocked), fallback to mailto
      if (!gmailWindow || gmailWindow.closed || typeof gmailWindow.closed === 'undefined') {
        // Fallback to default mailto
        window.location.href = `mailto:${email}`
      }
    } catch (error) {
      // Fallback to default mailto if Gmail fails
      window.location.href = `mailto:${email}`
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getAllUsers({ page: 1, limit: 50 }))
        .unwrap()
        .catch((error) => {
          toast.error('Failed to load users: ' + error.message)
        })

      dispatch(getAllAdmins({ page: 1, limit: 50 }))
        .unwrap()
        .catch((error) => {
          toast.error('Failed to load admins: ' + error.message)
        })
    }
  }, [dispatch, isAuthenticated])

  // Create users list from Redux data with additional user management fields
  const users = useMemo(() => {
    if (!reduxUsers || !Array.isArray(reduxUsers)) return []
    
    return reduxUsers.filter(user => user && user.name && user.email).map(user => ({
      ...user,
      lastLogin: '2024-01-15', // Mock data
      loginCount: Math.floor(Math.random() * 50) + 1,
      permissions: []
    }))
  }, [reduxUsers])

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [users, searchTerm])

  const filteredAdmins = useMemo(() => {
    return admins.filter(admin => 
      admin.user_name && admin.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email && admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (admin.createdBy && admin.createdBy.user_name && admin.createdBy.user_name.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [admins, searchTerm])





  const roleStats = useMemo(() => {
    const stats = {
      total: users.length,
      totalAdmins: admins.length,
      createdByOthers: admins.filter(a => a.createdBy).length,
      selfCreated: admins.filter(a => !a.createdBy).length
    }
    return stats
  }, [users, admins])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">User & Admin Management</h2>
          <p className="text-slate-600 dark:text-slate-400">Manage users and admin accounts</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('admins')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'admins'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Admins ({roleStats.totalAdmins})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'users'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Users ({roleStats.total})
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {activeTab === 'admins' && (
          <>
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Admins</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{roleStats.totalAdmins}</p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <User className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Created by Others</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{roleStats.createdByOthers}</p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                    <Settings className="w-6 h-6 text-green-600 dark:text-green-300" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Self Created</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{roleStats.selfCreated}</p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                    <User className="w-6 h-6 text-purple-600 dark:text-purple-300" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'users' && (
          <>
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Users</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{roleStats.total}</p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <User className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                  </div>
                </div>
              </CardContent>
            </Card>

          </>
        )}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                activeTab === 'admins' 
                  ? "Search admins by name, email, or creator..." 
                  : activeTab === 'users'
                  ? "Search users by name, email, or role..."
                  : "Search roles by name..."
              }
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Admins Table */}
      {activeTab === 'admins' && (
        <Card>
          <CardHeader>
            <CardTitle>Admin Management</CardTitle>
            <CardDescription>Manage admin accounts and their creators</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Admin</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminsLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <Spinner />
                          <p className="text-slate-600 dark:text-slate-400">Loading admins...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : adminsError ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <User className="w-12 h-12 text-red-400" />
                          <p className="text-red-600 dark:text-red-400">Error loading admins: {adminsError}</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredAdmins.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <User className="w-12 h-12 text-slate-400" />
                          <p className="text-slate-600 dark:text-slate-400">No admins found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAdmins.map((admin) => (
                      <TableRow key={admin._id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                                {admin.user_name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">{admin.user_name}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant={admin.role === 'super_admin' ? 'default' : 'outline'}>
                                  {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-slate-900 dark:text-white">{admin.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={admin.role === 'super_admin' ? 'default' : 'outline'}>
                            {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {admin.createdBy ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 text-xs">
                                  {admin.createdBy.user_name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-slate-600 dark:text-slate-400">
                                {admin.createdBy.user_name}
                              </span>
                            </div>
                          ) : (
                            <Badge variant="outline">Self Created</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                            <Calendar className="w-4 h-4" />
                            {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Unknown'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEmailClick(admin.email)}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              title="Open Gmail"
                            >
                              <Mail className="w-4 h-4" />
                            </Button>
                            {isSuperAdmin && admin.role !== 'super_admin' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteAdmin(admin._id, admin.user_name)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                title="Delete Admin"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}


      {/* Users Table */}
      {activeTab === 'users' && (
        <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage user roles, permissions, and login access</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Spinner />
                        <p className="text-slate-600 dark:text-slate-400">Loading users...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : usersError ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <User className="w-12 h-12 text-red-400" />
                        <p className="text-red-600 dark:text-red-400">Error loading users: {usersError}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <User className="w-12 h-12 text-slate-400" />
                        <p className="text-slate-600 dark:text-slate-400">No users found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => {
                    return (
                      <TableRow key={user._id || user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">{user.name}</p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">User</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-slate-900 dark:text-white">{user.email}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {user.contact?.number || user.phone || 'N/A'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                            <Calendar className="w-4 h-4" />
                            {user.lastLogin}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEmailClick(user.email)}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              title="Open Gmail"
                            >
                              <Mail className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user._id, user.name)}
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
      )}

      {/* Role Assignment Dialog - REMOVED */}
      {false && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeRoleDialog}
          />
          <div className="relative bg-white dark:bg-slate-900 rounded-lg shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Assign Role
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeRoleDialog}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </Button>
            </div>
            
            {selectedUser && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                      {selectedUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{selectedUser.name}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{selectedUser.email}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    Select a role for this user:
                  </p>
                  
                  <div className="space-y-2">
                    {availableRoles && availableRoles.map ? availableRoles.map(role => (
                      <Button
                        key={role.id}
                        variant={selectedUser.userRole === role.id ? 'default' : 'outline'}
                        onClick={() => assignRole(selectedUser.id, role.id)}
                        className="w-full justify-start"
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${role.color.includes('blue') ? 'bg-blue-500' : role.color.includes('green') ? 'bg-green-500' : role.color.includes('purple') ? 'bg-purple-500' : 'bg-gray-500'}`} />
                          {role.name}
                        </div>
                      </Button>
                    )) : null}
                    <Button
                      variant={!selectedUser.userRole ? 'default' : 'outline'}
                      onClick={() => assignRole(selectedUser.id, null)}
                      className="w-full justify-start"
                    >
                      No Role
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Role Dialog - REMOVED */}
      {false && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCreateRoleDialog(false)}
          />
          <div className="relative bg-white dark:bg-slate-900 rounded-lg shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Create New Role
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateRoleDialog(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Role Name
                </label>
                <input
                  type="text"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="Enter role name..."
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button variant="outline" onClick={() => setShowCreateRoleDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateRole}
                  disabled={!newRoleName.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-300 disabled:text-slate-500"
                >
                  Create Role
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete user "{userToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDeleteUser}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Admin Confirmation Dialog */}
      <Dialog open={deleteAdminDialogOpen} onOpenChange={setDeleteAdminDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Admin</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete admin "{adminToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDeleteAdmin}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteAdmin}>
              Delete Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminRoleManagement
