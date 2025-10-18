import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { 
  FileText, 
  Download, 
  Eye, 
  Mail,
  Phone,
  Calendar,
  User,
  MapPin,
  X,
  Loader2
} from 'lucide-react'

const CvViewer = ({ user, onClose, onStatusUpdate }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [cvError, setCvError] = useState(null)

  const handleDownloadCv = async () => {
    if (!user.cv?.url) return
    
    setIsLoading(true)
    setCvError(null)
    
    try {
      // Construct the full URL for the CV
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'
      const cvUrl = `${baseUrl}/${user.cv.url}`
      
      // Open CV in new tab
      window.open(cvUrl, '_blank')
    } catch (error) {
      setCvError('Failed to open CV file')
      console.error('Error opening CV:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewCv = () => {
    if (!user.cv?.url) return
    
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'
    const cvUrl = `${baseUrl}/${user.cv.url}`
    window.open(cvUrl, '_blank')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'reviewed': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'shortlisted': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-slate-900 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 text-lg">
                {user.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {user.name || 'Unknown User'}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">{user.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Email</p>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {user.email || 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Phone</p>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {user.contact?.country_code && user.contact?.number 
                            ? `${user.contact.country_code} ${user.contact.number}`
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Registered</p>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {formatDate(user.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Interest Roles */}
              {user.intrestRoles && user.intrestRoles.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Interest Roles
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {user.intrestRoles.map((role, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {typeof role === 'object' ? role.name : role}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Application Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className={getStatusColor(user.status || 'new')}>
                    {(user.status || 'new').charAt(0).toUpperCase() + (user.status || 'new').slice(1)}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* CV Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    CV Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user.cv?.url ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                          <FileText className="w-4 h-4" />
                          <span className="font-medium">CV Available</span>
                        </div>
                        <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                          CV was uploaded {user.cv.new ? 'recently' : 'previously'}
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          onClick={handleViewCv}
                          className="flex-1"
                          disabled={isLoading}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View CV
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleDownloadCv}
                          disabled={isLoading}
                          className="flex-1"
                        >
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Download className="w-4 h-4 mr-2" />
                          )}
                          Download
                        </Button>
                      </div>
                      
                      {cvError && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                          <p className="text-sm text-red-600 dark:text-red-400">{cvError}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
                        <FileText className="w-4 h-4" />
                        <span className="font-medium">No CV Uploaded</span>
                      </div>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                        This user hasn't uploaded a CV yet
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CvViewer

