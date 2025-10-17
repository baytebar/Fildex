import React, { useState, useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
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

const AdminRoleManagement = () => {
  // Get data from Redux
  const { users: reduxUsers } = useSelector((state) => state.admin.users)
  const { data: availableRoles = [] } = useSelector((state) => state.admin.interestRoles)
  
  const [activeTab, setActiveTab] = useState('users')
  const [searchTerm, setSearchTerm] = useState('')
  const [showRoleDialog, setShowRoleDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Create users list from Redux data with additional user management fields
  const users = useMemo(() => {
    if (!reduxUsers || !Array.isArray(reduxUsers)) return []
    
    return reduxUsers.filter(user => user && user.name && user.email).map(user => ({
      ...user,
      lastLogin: '2024-01-15', // Mock data
      loginCount: Math.floor(Math.random() * 50) + 1,
      permissions: user.userRole && availableRoles ? availableRoles.find(role => role.id === user.userRole)?.permissions || [] : []
    }))
  }, [reduxUsers, availableRoles])

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role && user.role.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [users, searchTerm])

  const openRoleDialog = useCallback((user) => {
    setSelectedUser(user)
    setShowRoleDialog(true)
  }, [])

  const closeRoleDialog = useCallback(() => {
    setShowRoleDialog(false)
    setSelectedUser(null)
  }, [])

  const assignRole = useCallback((userId, roleId) => {
    // TODO: Implement role assignment through Redux/API
    console.log('Assigning role', roleId, 'to user', userId)
    closeRoleDialog()
  }, [closeRoleDialog])



  const roleStats = useMemo(() => {
    const stats = {
      total: users.length,
      withRoles: users.filter(u => u.userRole).length,
      withoutRoles: users.filter(u => !u.userRole).length
    }
    return stats
  }, [users])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Role & User Management</h2>
          <p className="text-slate-600 dark:text-slate-400">Manage user roles, permissions, and login access</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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


        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">With Roles</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{roleStats.withRoles}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <Settings className="w-6 h-6 text-purple-600 dark:text-purple-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending Roles</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{roleStats.withoutRoles}</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                <Clock className="w-6 h-6 text-orange-600 dark:text-orange-300" />
              </div>
            </div>
          </CardContent>
        </Card>
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
              placeholder="Search users by name, email, or role..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
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
                  <TableHead>Role</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
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
                    const currentRole = availableRoles ? availableRoles.find(role => role.id === user.userRole) : null
                    return (
                      <TableRow key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">{user.name}</p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">{user.role.replace('-', ' ')}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-slate-900 dark:text-white">{user.email}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {user.phone}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {currentRole ? (
                            <Badge className={currentRole.color}>
                              {currentRole.name}
                            </Badge>
                          ) : (
                            <Badge variant="outline">No Role</Badge>
                          )}
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
                              onClick={() => openRoleDialog(user)}
                              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                              title="Assign Role"
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(`mailto:${user.email}`, '_blank')}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              title="Send Email"
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

      {/* Role Assignment Dialog */}
      {showRoleDialog && (
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
                    {availableRoles && availableRoles.map(role => (
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
                    ))}
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

    </div>
  )
}

export default AdminRoleManagement
