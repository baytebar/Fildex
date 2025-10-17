import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent } from '../../components/ui/card'
import { FileText, Briefcase, TrendingUp, Users, Calendar, MapPin, Phone, Mail } from 'lucide-react'
import { getAllUsers } from '../../features/admin/adminSlice'

const AdminOverview = () => {
  const dispatch = useDispatch()
  const { users, isLoading, error, totalUsers } = useSelector((state) => state.admin.users)
  const { isAuthenticated } = useSelector((state) => state.admin)
  
  // Fetch users data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getAllUsers({ page: 1, limit: 10 }))
    }
  }, [dispatch, isAuthenticated])
  
  // Calculate statistics from real data with null checks
  const recentUsers = users?.slice(0, 5) || []
  const newUsers = users?.filter(user => user.status === 'new').length || 0
  const reviewedUsers = users?.filter(user => user.status === 'reviewed').length || 0
  const shortlistedUsers = users?.filter(user => user.status === 'shortlisted').length || 0
  const usersWithCv = users?.filter(user => user.cv?.url).length || 0
  const usersWithoutCv = totalUsers - usersWithCv

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Dashboard Overview</h2>
        <p className="text-slate-600 dark:text-slate-400">Welcome to your admin dashboard</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold">{isLoading ? '...' : totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-200" />
            </div>
            <div className="mt-4 flex items-center text-blue-100 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              {newUsers} new this week
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">CVs Uploaded</p>
                <p className="text-3xl font-bold">{isLoading ? '...' : usersWithCv}</p>
              </div>
              <FileText className="w-8 h-8 text-green-200" />
            </div>
            <div className="mt-4 flex items-center text-green-100 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              {Math.round((usersWithCv / totalUsers) * 100) || 0}% of users
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Reviewed Users</p>
                <p className="text-3xl font-bold">{isLoading ? '...' : reviewedUsers}</p>
              </div>
              <Users className="w-8 h-8 text-purple-200" />
            </div>
            <div className="mt-4 flex items-center text-purple-100 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              {Math.round((reviewedUsers / totalUsers) * 100) || 0}% of total
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Shortlisted</p>
                <p className="text-3xl font-bold">{isLoading ? '...' : shortlistedUsers}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-200" />
            </div>
            <div className="mt-4 flex items-center text-orange-100 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              {Math.round((shortlistedUsers / totalUsers) * 100) || 0}% success rate
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Users */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Users</h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">Last 5 registrations</span>
            </div>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 animate-pulse">
                    <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600 dark:text-red-400">Error loading users: {error}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentUsers.map((user) => (
                  <div key={user._id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-300 font-medium text-sm">
                        {user.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-white">{user.name || 'Unknown User'}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{user.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {user.cv?.url ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            CV Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                            No CV
                          </span>
                        )}
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          {user.status || 'new'}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                ))}
                {recentUsers.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-slate-500 dark:text-slate-400">No users found</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Statistics */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">User Statistics</h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">Status breakdown</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                  </div>
                  <span className="text-slate-900 dark:text-white font-medium">New Applications</span>
                </div>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{newUsers}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-green-600 dark:text-green-300" />
                  </div>
                  <span className="text-slate-900 dark:text-white font-medium">Reviewed</span>
                </div>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">{reviewedUsers}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-orange-600 dark:text-orange-300" />
                  </div>
                  <span className="text-slate-900 dark:text-white font-medium">Shortlisted</span>
                </div>
                <span className="text-lg font-bold text-orange-600 dark:text-orange-400">{shortlistedUsers}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-300" />
                  </div>
                  <span className="text-slate-900 dark:text-white font-medium">Total Users</span>
                </div>
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{totalUsers}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminOverview



