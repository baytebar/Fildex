import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { ArrowLeft, Save, Eye } from 'lucide-react';

const AdminJobForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const jobData = location.state?.jobData || null;
  const isEditing = !!jobData;

  const [formData, setFormData] = useState({
    title: jobData?.title || '',
    company: jobData?.company || 'Fildex Solutions',
    location: jobData?.location || '',
    type: jobData?.type || 'full-time',
    salary: jobData?.salary || '',
    description: jobData?.description || '',
    requirements: jobData?.requirements || '',
    department: jobData?.department || '',
    experience: jobData?.experience || 'fresher',
    status: jobData?.status || 'active',
    applicationDeadline: jobData?.applicationDeadline || '',
    contactEmail: jobData?.contactEmail || 'hr@fildex.com'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const jobPosting = {
        id: jobData?.id || Date.now(),
        ...formData,
        postedDate: new Date().toISOString().split('T')[0],
        applicants: jobData?.applicants || 0,
        createdAt: jobData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      navigate('/admin/job-postings');
    } catch (error) {
      console.error('Error saving job posting:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    console.log('Preview job posting:', formData);
  };

  const handleCancel = () => {
    navigate('/admin/job-postings');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="mb-4 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Job Postings
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {isEditing ? 'Edit Job Posting' : 'Create New Job'}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {isEditing ? 'Update the job posting details below' : 'Fill out the form below to create a new job posting'}
            </p>
          </div>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="space-y-6">
                <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Basic Information</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Essential details about the position</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Job Title *
                    </label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Senior Software Engineer"
                      required
                      className="h-11"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Department *
                    </label>
                    <Select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Department</option>
                      <option value="engineering">Engineering</option>
                      <option value="marketing">Marketing</option>
                      <option value="sales">Sales</option>
                      <option value="hr">Human Resources</option>
                      <option value="finance">Finance</option>
                      <option value="operations">Operations</option>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Location *
                    </label>
                    <Input
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., Dublin, Ireland"
                      required
                      className="h-11"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Job Type *
                    </label>
                    <Select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                      <option value="remote">Remote</option>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Experience Level *
                    </label>
                    <Select
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="fresher">Fresher</option>
                      <option value="associate">Associate</option>
                      <option value="specialist">Specialist</option>
                      <option value="senior">Senior</option>
                      <option value="principal">Principal</option>
                      <option value="director">Director</option>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Compensation & Timeline</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Salary and application details</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Salary Range
                    </label>
                    <Input
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      placeholder="e.g., €50,000 - €70,000"
                      className="h-11"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Application Deadline
                    </label>
                    <Input
                      type="date"
                      name="applicationDeadline"
                      value={formData.applicationDeadline}
                      onChange={handleInputChange}
                      className="h-11"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Job Description</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Describe the role and responsibilities</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Job Description *
                  </label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
                    rows={5}
                    required
                    className="resize-none"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Requirements</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">What candidates need for this role</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Requirements *
                  </label>
                  <Textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    placeholder="List the required skills, qualifications, and experience..."
                    rows={5}
                    required
                    className="resize-none"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Contact & Status</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">How to reach you and job status</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Contact Email *
                    </label>
                    <Input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      placeholder="hr@fildex.com"
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Status *
                    </label>
                    <Select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="closed">Closed</option>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 pt-8 border-t border-slate-200 dark:border-slate-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreview}
                  disabled={isSubmitting}
                  className="px-8"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="px-8"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {isEditing ? 'Update Job' : 'Post Job'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminJobForm;
