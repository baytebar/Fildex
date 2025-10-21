import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import Spinner from '../../components/Spinner';
import { createJobPosting, updateJobPosting, getAllDepartments, getAllJobTitles } from '../../features/admin/adminSlice';
import { toast } from 'sonner';

const AdminJobForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const jobData = location.state?.jobData || null;
  const isEditing = !!jobData;
  
  // Get data from Redux
  const { data: departments, isLoading: departmentsLoading } = useSelector((state) => state.admin.departments);
  const { data: jobTitles, isLoading: jobTitlesLoading } = useSelector((state) => state.admin.jobTitles);
  const { isAuthenticated } = useSelector((state) => state.admin);
  
  const [formData, setFormData] = useState({
    title: jobData?.job_title || '',
    company: jobData?.company || 'Fildex Solutions',
    location: jobData?.location || '',
    type: jobData?.job_type || 'full-time',
    salary: jobData?.salary_range || '',
    description: jobData?.description || '',
    requirements: jobData?.requirements || '',
    department: jobData?.department?.name || jobData?.department?._id || jobData?.department || '',
    experience: jobData?.experience || 'fresher',
    status: jobData?.status || 'active',
    applicationDeadline: jobData?.deadline ? new Date(jobData.deadline).toISOString().split('T')[0] : '',
    contactEmail: jobData?.contact_email || 'hr@fildex.com'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when jobData changes (for editing)
  useEffect(() => {
    if (jobData) {
      setFormData({
        title: jobData?.job_title || '',
        company: jobData?.company || 'Fildex Solutions',
        location: jobData?.location || '',
        type: jobData?.job_type || 'full-time',
        salary: jobData?.salary_range || '',
        description: jobData?.description || '',
        requirements: jobData?.requirements || '',
        department: jobData?.department?.name || jobData?.department?._id || jobData?.department || '',
        experience: jobData?.experience || 'fresher',
        status: jobData?.status || 'active',
        applicationDeadline: jobData?.deadline ? new Date(jobData.deadline).toISOString().split('T')[0] : '',
        contactEmail: jobData?.contact_email || 'hr@fildex.com'
      });
    }
  }, [jobData]);

  // Fetch departments on component mount - only once
  useEffect(() => {
    if (isAuthenticated && !departmentsLoading && (!departments || departments.length === 0)) {
      dispatch(getAllDepartments())
        .unwrap()
        .catch((error) => {
          toast.error('Failed to load departments: ' + error.message);
        });
    }
  }, [dispatch, isAuthenticated]); // Only run when component mounts or auth changes

  // Fetch job titles on component mount - only once
  useEffect(() => {
    if (isAuthenticated && !jobTitlesLoading && (!jobTitles || jobTitles.length === 0)) {
      dispatch(getAllJobTitles())
        .unwrap()
        .catch((error) => {
          toast.error('Failed to load job titles: ' + error.message);
        });
    }
  }, [dispatch, isAuthenticated]); // Only run when component mounts or auth changes

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle special case for creating new job title
    if (name === 'title' && value === '__create_new__') {
      navigate('/admin/job-titles');
      return;
    }
    
    // Handle special case for creating new department
    if (name === 'department' && value === '__create_new__') {
      navigate('/admin/departments');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Find the department ObjectId from the departments list
      const selectedDepartment = departments?.find(dept => dept.name === formData.department);
      
      
      const jobPostingData = {
        job_title: formData.title,
        location: formData.location,
        job_type: formData.type,
        salary_range: formData.salary,
        description: formData.description,
        requirements: formData.requirements,
        department: selectedDepartment?._id || null, // Use ObjectId if available, null otherwise
        experience: formData.experience,
        status: formData.status,
        deadline: formData.applicationDeadline,
        contact_email: formData.contactEmail,
      };
      

      if (isEditing) {
        await dispatch(updateJobPosting({ 
          jobId: jobData._id || jobData.id, 
          jobData: jobPostingData 
        })).unwrap();
      } else {
        await dispatch(createJobPosting(jobPostingData)).unwrap();
      }
      
      navigate('/admin/job-postings');
    } catch (error) {
      toast.error('Failed to save job posting: ' + (error.message || 'Please try again'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
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
                      {jobTitlesLoading && (
                        <span className="ml-2 text-xs text-slate-500">(Loading...)</span>
                      )}
                    </label>
                    <Select
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="h-11"
                      disabled={jobTitlesLoading}
                    >
                      <option value="">Select a job title...</option>
                      {jobTitlesLoading ? (
                        <option disabled>Loading job titles...</option>
                      ) : (
                        <>
                          {jobTitles?.map((jobTitle) => (
                            <option key={jobTitle._id} value={jobTitle.name}>
                              {jobTitle.name}
                            </option>
                          ))}
                          <option value="__create_new__" className="text-blue-600 font-medium">
                            + Create New Job Title
                          </option>
                        </>
                      )}
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Department *
                      {departmentsLoading && (
                        <span className="ml-2 text-xs text-slate-500">(Loading...)</span>
                      )}
                    </label>
                    <Select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      required
                      disabled={departmentsLoading}
                      className="h-11"
                    >
                      <option value="">Select Department</option>
                      {departmentsLoading ? (
                        <option value="" disabled>Loading departments...</option>
                      ) : departments && departments.length > 0 ? (
                        <>
                          {departments.map((dept) => (
                            <option key={dept._id} value={dept.name}>
                              {dept.name}
                            </option>
                          ))}
                          <option value="__create_new__" className="text-blue-600 font-medium">
                            + Create New Department
                          </option>
                        </>
                      ) : (
                        <>
                          <option value="engineering">Engineering</option>
                          <option value="marketing">Marketing</option>
                          <option value="sales">Sales</option>
                          <option value="hr">Human Resources</option>
                          <option value="finance">Finance</option>
                          <option value="operations">Operations</option>
                          <option value="__create_new__" className="text-blue-600 font-medium">
                            + Create New Department
                          </option>
                        </>
                      )}
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
                      placeholder="e.g., Cork, Ireland"
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
                      <option value="experienced">Experienced</option>
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
