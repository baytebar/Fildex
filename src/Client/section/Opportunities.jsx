import React, { useState } from 'react'
import JobApplicationForm from './JobApplicationForm'
import { Target, GraduationCap, Users, Sparkles, Megaphone, Mailbox, Check, Circle, ArrowRight, Briefcase, Calendar, MapPin, DollarSign, Rocket, FileText, AlertTriangle } from 'lucide-react'

const Opportunities = ({ jobPostings }) => {
  // Filter active job postings
  const activeJobs = jobPostings?.filter(job => job.status === 'active') || []
  const [selectedJob, setSelectedJob] = useState(null)

  // State for CV form
  const [careerForm, setCareerForm] = useState({ name: '', email: '', phone: '', roleInterest: '', cvFile: null, consent: false })
  const [careerStatus, setCareerStatus] = useState('') // '', 'uploading', 'success', 'error'
  const [dragOver, setDragOver] = useState(false)

  const handleApply = (applicationData) => {
    // In a real app, you would send this data to a server
    console.log('Application submitted:', applicationData)
    // For now, we'll just close the form
    setSelectedJob(null)
  }

  const validateFile = (file) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!allowedTypes.includes(file.type)) {
      setCareerStatus('Please upload a PDF, DOC, or DOCX file.')
      return false
    }

    if (file.size > maxSize) {
      setCareerStatus('File size must be less than 10MB.')
      return false
    }

    setCareerStatus('')
    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!careerForm.name || !careerForm.email || !careerForm.phone || !careerForm.roleInterest || !careerForm.cvFile || !careerForm.consent) {
      setCareerStatus('Please fill all fields and accept the privacy policy.')
      return
    }
    setCareerStatus('uploading')

    // Simulate upload process
    setTimeout(() => {
      setCareerStatus('success')
      setCareerForm({ name: '', email: '', phone: '', roleInterest: '', cvFile: null, consent: false })
    }, 1500)
  }

  return (
    <>
      <section id="opportunities" className="min-h-dvh px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-br from-background to-muted">
        <div className="max-w-7xl mx-auto">
          {/* Section header with improved typography */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              GLOBAL TALENT CAREERS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
              Shape Your Future With Us
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Discover internships, job openings, and career development programs designed to accelerate your professional growth.
            </p>
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Talent Pool Card */}
            <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Target className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-2xl text-foreground mb-2">Join Our Talent Pool</h3>
                  <p className="text-muted-foreground">
                    Become part of our community of skilled professionals and students ready to make an impact.
                  </p>
                </div>
              </div>

              <p className="text-foreground mb-8 text-lg">
                We invite students and professionals to join our internship programs and talent pool.
                Gain real-world experience, work on live projects, and build your career with industry experts.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-muted/50 border border-border rounded-xl p-6 hover:bg-gray-200 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-bold text-xl text-foreground mb-3">Student Internships</h4>
                  <p className="text-muted-foreground mb-4">6-month programs with mentorship and project experience</p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      <span>Hands-on project work</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      <span>Expert mentorship</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      <span>Industry certifications</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-6 hover:bg-accent transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-bold text-xl text-foreground mb-3">Professional Pool</h4>
                  <p className="text-muted-foreground mb-4">Join our network of skilled professionals for contract opportunities</p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      <span>Flexible engagements</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      <span>Competitive rates</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      <span>Remote work options</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <a href="#careers" className="w-full sm:w-auto rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-md hover:bg-primary/90 transition-all duration-300 text-center flex items-center justify-center gap-2">
                  Apply Now <ArrowRight className="w-4 h-4" />
                </a>
                <a href="#contact" className="w-full sm:w-auto rounded-lg border border-border px-6 py-3 hover:bg-accent transition-colors text-foreground font-semibold text-center">
                  Contact Us
                </a>
              </div>
            </div>

            {/* Benefits Card */}
            <div className="bg-gradient-to-br from-primary/5 to-accent/20 border border-primary/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-2xl text-foreground">Program Benefits</h3>
              </div>

              <ul className="space-y-5 mb-8">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Industry Mentorship</h4>
                    <p className="text-sm text-muted-foreground">Learn from experienced professionals in your field</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Real Project Experience</h4>
                    <p className="text-sm text-muted-foreground">Work on actual client projects from day one</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Professional Networking</h4>
                    <p className="text-sm text-muted-foreground">Connect with industry leaders and peers</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Career Guidance</h4>
                    <p className="text-sm text-muted-foreground">Personalized career coaching and support</p>
                  </div>
                </li>
              </ul>

              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-2xl text-foreground">95%</div>
                    <div className="text-sm text-muted-foreground">Placement Rate</div>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">95%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CV Submission Form Section and Job Listings Section */}
          <div className="mb-16">
            <div className="flex flex-col lg:flex-row gap-10">
              {/* CV Submission Form - Takes more width (2/3 of the space) */}
              <div className="lg:w-2/3">
                <div className="text-center mb-12">
                  <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
                    <Rocket className="w-8 h-8 text-primary" />
                    <span>Submit Your CV</span>
                  </h2>
                  <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
                  <p className="text-lg text-muted-foreground mt-6 max-w-2xl mx-auto">
                    Join our talent pool and be considered for exciting opportunities in training, outsourcing, and business solutions.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Full Name *</label>
                        <input
                          value={careerForm.name}
                          onChange={(e) => setCareerForm(c => ({ ...c, name: e.target.value }))}
                          className="w-full rounded-lg bg-background border border-input px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Email *</label>
                        <input
                          type="email"
                          value={careerForm.email}
                          onChange={(e) => setCareerForm(c => ({ ...c, email: e.target.value }))}
                          className="w-full rounded-lg bg-background border border-input px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Phone *</label>
                        <input
                          value={careerForm.phone}
                          onChange={(e) => setCareerForm(c => ({ ...c, phone: e.target.value }))}
                          className="w-full rounded-lg bg-background border border-input px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
                          placeholder="+353 XX XXX XXXX"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Role Interest *</label>
                        <select
                          value={careerForm.roleInterest}
                          onChange={(e) => setCareerForm(c => ({ ...c, roleInterest: e.target.value }))}
                          className="w-full rounded-lg bg-background border border-input px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors"
                        >
                          <option value="">Select a role</option>
                          <option value="cloud-engineer">Cloud Engineer</option>
                          <option value="devops-engineer">DevOps Engineer</option>
                          <option value="ai-ml-developer">AI/ML Developer</option>
                          <option value="network-engineer">Network Engineer</option>
                          <option value="business-analyst">Business Analyst</option>
                          <option value="project-manager">Project Manager</option>
                          <option value="software-developer">Software Developer</option>
                          <option value="internship">Internship Program</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">CV Upload *</label>
                      <div
                        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${dragOver
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-foreground/40 hover:bg-accent'
                          }`}
                        onDragOver={(e) => {
                          e.preventDefault()
                          setDragOver(true)
                        }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={(e) => {
                          e.preventDefault()
                          setDragOver(false)
                          const files = e.dataTransfer.files
                          if (files.length > 0) {
                            const file = files[0]
                            if (validateFile(file)) {
                              setCareerForm(c => ({ ...c, cvFile: file }))
                            }
                          }
                        }}
                      >
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file && validateFile(file)) {
                              setCareerForm(c => ({ ...c, cvFile: file }))
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <FileText className="w-12 h-12 mb-3 text-foreground mx-auto" />
                        <p className="text-base text-foreground mb-2">
                          {careerForm.cvFile ? careerForm.cvFile.name : 'Drag & drop your CV here or click to browse'}
                        </p>
                        <p className="text-sm text-muted-foreground">PDF, DOC, DOCX up to 10MB</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={careerForm.consent}
                        onChange={(e) => setCareerForm(c => ({ ...c, consent: e.target.checked }))}
                        className="mt-1 rounded border-border bg-background focus:ring-primary focus:ring-offset-0"
                      />
                      <label className="text-sm text-muted-foreground">
                        I consent to the processing of my personal data for recruitment purposes.
                        <a href="#privacy" className="text-primary hover:underline"> Privacy Policy</a>.
                        Data will be retained for 12 months.
                      </label>
                    </div>

                    <button
                      disabled={careerStatus === 'uploading'}
                      className="w-full rounded-lg bg-primary px-5 py-3 text-base font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 shadow-md transition-all duration-300"
                    >
                      {careerStatus === 'uploading' ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="inline-block w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></span>
                          <span>Uploading...</span>
                        </span>
                      ) : (
                        'Submit Application'
                      )}
                    </button>

                    {careerStatus && careerStatus !== 'uploading' && careerStatus !== 'success' && (
                      <div className="p-4 rounded-lg bg-destructive/20 border border-destructive/30">
                        <p className="text-sm text-destructive flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          <span>{careerStatus}</span>
                        </p>
                      </div>
                    )}
                    {careerStatus === 'success' && (
                      <div className="p-4 rounded-lg bg-green-600/20 border border-green-400/30 dark:bg-green-400/20 dark:border-green-300/30">
                        <p className="text-sm text-green-700 flex items-center gap-2 dark:text-green-300">
                          <Check className="w-4 h-4" />
                          <span>Application submitted successfully! We'll review your CV and contact you soon.</span>
                        </p>
                      </div>
                    )}
                  </form>
                </div>
              </div>

              {/* Job Listings Section - Takes less width (1/3 of the space) */}
              <div className="lg:w-1/3 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="font-bold text-2xl md:text-3xl text-foreground mb-2">Open Positions</h3>
                    <p className="text-muted-foreground mb-3">Join our team and be part of something great</p>
                  </div>
                  <button className="bg-primary/10 text-primary px-4 py- rounded-full font-semibold hover:bg-primary/20 transition-colors ">
                    Roles Available
                  </button>
                </div>

                <div className="flex-grow flex flex-col">
                  {activeJobs.length > 0 ? (
                    <div className="space-y-6 flex-grow">
                      {activeJobs.map((job) => (
                        <div key={job.id} className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group flex-grow">
                          <div className="flex items-start justify-between mb-4">
                            <h4 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">{job.title}</h4>
                            <div className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-semibold">
                              {job.type}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-3 mb-4">
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <Briefcase className="w-4 h-4" />
                              <span>{job.department}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span>{job.location}</span>
                            </div>
                            {job.salary && (
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <DollarSign className="w-4 h-4" />
                                <span>{job.salary}</span>
                              </div>
                            )}
                          </div>

                          <p className="text-muted-foreground mb-5 line-clamp-2">
                            {job.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>Posted {job.postedDate}</span>
                            </div>
                            <button
                              onClick={() => setSelectedJob(job)}
                              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1"
                            >
                              Apply <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-card border border-border rounded-2xl p-12 text-center flex-grow flex items-center justify-center">
                      <div>
                        <Mailbox className="w-16 h-16 mb-4 text-muted-foreground mx-auto" />
                        <h4 className="font-bold text-xl text-foreground mb-2">No open positions at the moment</h4>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                          We're constantly looking for talented individuals. Check back soon for new opportunities!
                        </p>
                        <a
                          href="#careers"
                          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          Submit your CV to our talent pool <ArrowRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-8 md:p-12 text-white text-center">
            <h3 className="font-bold text-2xl md:text-3xl mb-4">
              Ready to Start Your Career Journey?
            </h3>
            <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Join our talent pool today and get access to exclusive opportunities, mentorship, and career development resources.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#careers"
                className="w-full sm:w-auto rounded-lg bg-white text-primary px-6 py-3 font-semibold hover:bg-white/90 transition-colors shadow-lg"
              >
                Apply to Talent Pool
              </a>
              <a
                href="#contact"
                className="w-full sm:w-auto rounded-lg border-2 border-white text-white px-6 py-3 font-semibold hover:bg-white/10 transition-colors"
              >
                Speak to a Recruiter
              </a>
            </div>
          </div>
        </div>
      </section>

      {selectedJob && (
        <JobApplicationForm
          job={selectedJob}
          onApply={handleApply}
          onCancel={() => setSelectedJob(null)}
        />
      )}
    </>
  )
}

export default Opportunities