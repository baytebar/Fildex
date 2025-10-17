import React from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { X, MapPin, Calendar, Users, Briefcase, Mail, Clock } from 'lucide-react';

const JobPreview = ({ job, onClose }) => {
  if (!job) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'closed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getExperienceLabel = (experience) => {
    switch (experience) {
      case 'entry':
        return 'Entry Level';
      case 'mid':
        return 'Mid Level';
      case 'senior':
        return 'Senior Level';
      case 'lead':
        return 'Lead/Principal';
      default:
        return experience;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'full-time':
        return 'Full-time';
      case 'part-time':
        return 'Part-time';
      case 'contract':
        return 'Contract';
      case 'internship':
        return 'Internship';
      case 'remote':
        return 'Remote';
      default:
        return type;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="border-0 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl font-semibold">Job Preview</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Header */}
            <div className="border-b border-slate-200 dark:border-slate-700 pb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {job.title}
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-400 mb-2">
                    {job.company}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {getTypeLabel(job.type)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {getExperienceLabel(job.experience)}
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(job.status)}>
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-400">Posted:</span>
                  <span className="font-medium">{formatDate(job.postedDate)}</span>
                </div>
                {job.applicationDeadline && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-400">Deadline:</span>
                    <span className="font-medium">{formatDate(job.applicationDeadline)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-400">Applications:</span>
                  <span className="font-medium">{job.applicants || 0}</span>
                </div>
              </div>
            </div>

            {/* Salary */}
            {job.salary && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Salary</h3>
                <p className="text-slate-700 dark:text-slate-300">{job.salary}</p>
              </div>
            )}

            {/* Job Description */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Job Description</h3>
              <div className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {job.description}
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Requirements</h3>
                <div className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                  {job.requirements}
                </div>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Benefits & Perks</h3>
                <div className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                  {job.benefits}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Contact Information</h3>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="text-slate-700 dark:text-slate-300">{job.contactEmail}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Edit Job
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JobPreview;








