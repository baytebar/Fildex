import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { Card, CardContent } from '../../components/ui/card'
import { FileText, Briefcase, TrendingUp, Users } from 'lucide-react'

const AdminOverview = () => {
  const { cvData, jobPostings } = useOutletContext()
  const recentCvs = cvData.slice(0, 5)
  const activeJobs = jobPostings.filter(job => job.status === 'active').slice(0, 3)

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
              <TrendingUp className="w-4 h-4 mr-1" />
              +8% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">New Uploads</p>
                <p className="text-3xl font-bold">{cvData.filter(cv => cv.status === 'new').length}</p>
              </div>
              <Users className="w-8 h-8 text-purple-200" />
            </div>
            <div className="mt-4 flex items-center text-purple-100 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              +15% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Success Rate</p>
                <p className="text-3xl font-bold">87%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-200" />
            </div>
            <div className="mt-4 flex items-center text-orange-100 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              +5% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent CV Uploads */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent CV Uploads</h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">Last 5 uploads</span>
            </div>
            <div className="space-y-3">
              {recentCvs.map((cv) => (
                <div key={cv.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-300 font-medium text-sm">
                      {cv.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">{cv.name}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{cv.role}</p>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{cv.uploadDate}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Job Postings */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Active Job Postings</h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">{activeJobs.length} active</span>
            </div>
            <div className="space-y-3">
              {activeJobs.map((job) => (
                <div key={job.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-green-600 dark:text-green-300" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">{job.title}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{job.location}</p>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{job.applications} applications</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminOverview



