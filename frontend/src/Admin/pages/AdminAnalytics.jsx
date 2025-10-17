import React from 'react'
import { useSelector } from 'react-redux'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  Briefcase,
  Calendar,
  Target,
  Award
} from 'lucide-react'

const AdminAnalytics = () => {
  // Get data from Redux
  const { users, totalUsers } = useSelector((state) => state.admin.users)
  
  // For now, use empty arrays for job postings since we don't have that API yet
  const jobPostings = []
  
  // Calculate analytics data with null checks
  const totalCvs = totalUsers || 0
  const totalJobs = jobPostings?.length || 0
  const activeJobs = jobPostings?.filter(job => job.status === 'active').length || 0
  const newCvs = users?.filter(user => user.status === 'new').length || 0
  const reviewedCvs = users?.filter(user => user.status === 'reviewed').length || 0
  const shortlistedCvs = users?.filter(user => user.status === 'shortlisted').length || 0
  const rejectedCvs = users?.filter(user => user.status === 'rejected').length || 0

  // Calculate success rate
  const successRate = totalCvs > 0 ? Math.round((shortlistedCvs / totalCvs) * 100) : 0

  // Calculate average applications per job
  const avgApplications = totalJobs > 0 ? 
    Math.round((jobPostings || []).reduce((sum, job) => sum + (job.applicants || 0), 0) / totalJobs) : 0

  // Get recent activity (last 7 days)
  const recentCvs = (users || []).filter(user => {
    const userDate = new Date(user.createdAt)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return userDate >= weekAgo
  }).length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Analytics</h2>
        <p className="text-slate-600 dark:text-slate-400">Insights and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total CVs</p>
                <p className="text-3xl font-bold">{totalCvs}</p>
                <p className="text-blue-100 text-xs mt-1">+{recentCvs} this week</p>
              </div>
              <FileText className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Active Jobs</p>
                <p className="text-3xl font-bold">{activeJobs}</p>
                <p className="text-green-100 text-xs mt-1">of {totalJobs} total</p>
              </div>
              <Briefcase className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Success Rate</p>
                <p className="text-3xl font-bold">{successRate}%</p>
                <p className="text-purple-100 text-xs mt-1">{shortlistedCvs} shortlisted</p>
              </div>
              <Target className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Avg Applications</p>
                <p className="text-3xl font-bold">{avgApplications}</p>
                <p className="text-orange-100 text-xs mt-1">per job posting</p>
              </div>
              <Users className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CV Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              CV Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">New</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{newCvs}</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400 ml-2">
                    ({totalCvs > 0 ? Math.round((newCvs / totalCvs) * 100) : 0}%)
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-sm font-medium">Reviewed</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{reviewedCvs}</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400 ml-2">
                    ({totalCvs > 0 ? Math.round((reviewedCvs / totalCvs) * 100) : 0}%)
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Shortlisted</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{shortlistedCvs}</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400 ml-2">
                    ({totalCvs > 0 ? Math.round((shortlistedCvs / totalCvs) * 100) : 0}%)
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">Rejected</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{rejectedCvs}</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400 ml-2">
                    ({totalCvs > 0 ? Math.round((rejectedCvs / totalCvs) * 100) : 0}%)
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Job Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(jobPostings || []).slice(0, 5).map((job) => (
                <div key={job.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white text-sm">{job.title}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{job.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{job.applicants}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">applications</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Recent Activity Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{recentCvs}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">New CVs this week</p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-2">
                <Award className="w-6 h-6 text-green-600 dark:text-green-300" />
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{shortlistedCvs}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Shortlisted candidates</p>
            </div>
            
            <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-300" />
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{avgApplications}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Avg applications per job</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminAnalytics
