import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent } from '../../components/ui/card'
import { FileText, Briefcase, TrendingUp, Calendar } from 'lucide-react'
import { getAllJobPostings, getAllDepartments, getAllJobTitles } from '../../features/admin/adminSlice'
import { fetchAllResumes } from '../../features/resume/resumeSlice'

const AdminOverview = () => {
  const dispatch = useDispatch()
  const { data: jobPostings, isLoading: jobsLoading } = useSelector((state) => state.admin.jobPostings)
  const { data: departments, isLoading: deptLoading } = useSelector((state) => state.admin.departments)
  const { data: jobTitles, isLoading: jobTitlesLoading } = useSelector((state) => state.admin.jobTitles)
  const { resumes, isLoading: resumesLoading, pagination: resumePagination } = useSelector((state) => state.resume)
  const { isAuthenticated } = useSelector((state) => state.admin)
  
  // Fetch data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getAllJobPostings({ page: 1, limit: 10 }))
      dispatch(getAllDepartments())
      dispatch(getAllJobTitles())
      dispatch(fetchAllResumes({ page: 1, limit: 10 }))
    }
  }, [dispatch, isAuthenticated])
  
  // Calculate statistics from real data with null checks
  
  // Resume statistics (independent of user data)
  const totalResumes = resumes?.length || 0
  const newResumes = resumes?.filter(resume => resume.status === 'new').length || 0
  const reviewedResumes = resumes?.filter(resume => resume.status === 'reviewed').length || 0
  const underReviewResumes = resumes?.filter(resume => resume.status === 'under_review').length || 0
  const shortlistedResumes = resumes?.filter(resume => resume.status === 'shortlisted').length || 0
  const interviewScheduledResumes = resumes?.filter(resume => resume.status === 'interview_scheduled').length || 0
  const hiredResumes = resumes?.filter(resume => resume.status === 'hired').length || 0
  const rejectedResumes = resumes?.filter(resume => resume.status === 'rejected').length || 0
  const onHoldResumes = resumes?.filter(resume => resume.status === 'on_hold').length || 0
  
  // Job posting statistics
  const totalJobs = jobPostings?.length || 0
  const activeJobs = jobPostings?.filter(job => job.status === 'active').length || 0
  const totalDepartments = departments?.length || 0
  const totalJobTitles = jobTitles?.length || 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Dashboard Overview</h2>
        <p className="text-slate-600 dark:text-slate-400">Welcome to your admin dashboard</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-0 shadow-lg bg-linear-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">CVs Uploaded</p>
                <p className="text-3xl font-bold">{resumesLoading ? '...' : totalResumes}</p>
              </div>
              <FileText className="w-8 h-8 text-green-200" />
            </div>
            <div className="mt-4 flex items-center text-green-100 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              {resumePagination?.totalResumes || 0} total in system
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-linear-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Reviewed Resumes</p>
                <p className="text-3xl font-bold">{resumesLoading ? '...' : reviewedResumes}</p>
              </div>
              <FileText className="w-8 h-8 text-purple-200" />
            </div>
            <div className="mt-4 flex items-center text-purple-100 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              {totalResumes > 0 ? Math.round((reviewedResumes / totalResumes) * 100) : 0}% of resumes
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-linear-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Shortlisted</p>
                <p className="text-3xl font-bold">{resumesLoading ? '...' : shortlistedResumes}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-200" />
            </div>
            <div className="mt-4 flex items-center text-orange-100 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              {totalResumes > 0 ? Math.round((shortlistedResumes / totalResumes) * 100) : 0}% success rate
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-linear-to-br from-cyan-500 to-cyan-600 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-100 text-sm font-medium">New Resumes</p>
                <p className="text-3xl font-bold">{resumesLoading ? '...' : newResumes}</p>
              </div>
              <FileText className="w-8 h-8 text-cyan-200" />
            </div>
            <div className="mt-4 flex items-center text-cyan-100 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              Awaiting review
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-0 shadow-lg bg-linear-to-br from-indigo-500 to-indigo-600 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm font-medium">Job Postings</p>
                <p className="text-3xl font-bold">{jobsLoading ? '...' : totalJobs}</p>
              </div>
              <Briefcase className="w-8 h-8 text-indigo-200" />
            </div>
            <div className="mt-4 flex items-center text-indigo-100 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              {activeJobs} active jobs
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-linear-to-br from-teal-500 to-teal-600 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm font-medium">Departments</p>
                <p className="text-3xl font-bold">{deptLoading ? '...' : totalDepartments}</p>
              </div>
              <Calendar className="w-8 h-8 text-teal-200" />
            </div>
            <div className="mt-4 flex items-center text-teal-100 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              Available departments
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-linear-to-br from-pink-500 to-pink-600 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-sm font-medium">Resume Success Rate</p>
                <p className="text-3xl font-bold">{resumesLoading ? '...' : (totalResumes > 0 ? Math.round((shortlistedResumes / totalResumes) * 100) : 0)}%</p>
              </div>
              <FileText className="w-8 h-8 text-pink-200" />
            </div>
            <div className="mt-4 flex items-center text-pink-100 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              {shortlistedResumes} of {totalResumes} shortlisted
            </div>
          </CardContent>
        </Card>

      </div>

    </div>
  )
}

export default AdminOverview



