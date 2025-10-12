import React, { useState } from 'react'
import JobApplicationForm from './JobApplicationForm'
import { Target, GraduationCap, Users, Sparkles, Megaphone, Mailbox, Check, Circle } from 'lucide-react'

const Opportunities = ({ jobPostings }) => {
  // Filter active job postings
  const activeJobs = jobPostings?.filter(job => job.status === 'active') || []
  const [selectedJob, setSelectedJob] = useState(null)
  
  const handleApply = (applicationData) => {
    // In a real app, you would send this data to a server
    console.log('Application submitted:', applicationData)
    // For now, we'll just close the form
    setSelectedJob(null)
  }

  return (
    <>
      <section id="opportunities" className="min-h-dvh space-y-6 px-12">
        <h3 className="text-2xl font-semibold text-foreground">Opportunities and Internships</h3>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <div className="rounded-2xl border border-border bg-muted p-6 backdrop-blur-sm">
              <h4 className="font-semibold mb-4 flex items-center gap-2 text-foreground text-xl">
                <Target className="w-6 h-6" />
                <span>Join Our Talent Pool</span>
              </h4>
              <p className="text-foreground mb-6 text-lg">
                We invite students and professionals to join our internship programs and talent pool. Gain real-world experience, work on live projects, and build your career with industry experts.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="rounded-xl border border-border bg-card p-4 backdrop-blur-sm">
                  <GraduationCap className="w-8 h-8 mb-3 text-foreground" />
                  <div className="font-medium mb-2 text-foreground text-lg">Student Internships</div>
                  <div className="text-base text-muted-foreground mb-3">6-month programs with mentorship and project experience</div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2"><Circle className="w-2 h-2 text-primary" /> Hands-on project work</li>
                    <li className="flex items-center gap-2"><Circle className="w-2 h-2 text-primary" /> Expert mentorship</li>
                    <li className="flex items-center gap-2"><Circle className="w-2 h-2 text-primary" /> Industry certifications</li>
                    <li className="flex items-center gap-2"><Circle className="w-2 h-2 text-primary" /> Job placement assistance</li>
                  </ul>
                </div>
                
                <div className="rounded-xl border border-border bg-card p-4 backdrop-blur-sm">
                  <Users className="w-8 h-8 mb-3 text-foreground" />
                  <div className="font-medium mb-2 text-foreground text-lg">Professional Pool</div>
                  <div className="text-base text-muted-foreground mb-3">Join our network of skilled professionals for contract opportunities</div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2"><Circle className="w-2 h-2 text-primary" /> Flexible engagements</li>
                    <li className="flex items-center gap-2"><Circle className="w-2 h-2 text-primary" /> Competitive rates</li>
                    <li className="flex items-center gap-2"><Circle className="w-2 h-2 text-primary" /> Remote work options</li>
                    <li className="flex items-center gap-2"><Circle className="w-2 h-2 text-primary" /> Skill development</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <a href="#careers" className="rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-all duration-300 text-base">
                  Apply Now
                </a>
                <a href="#contact" className="rounded-lg border border-border px-5 py-2.5 hover:bg-accent transition-colors text-foreground text-base">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-2xl border border-border bg-muted p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold flex items-center gap-2 text-foreground text-lg">
                  <Megaphone className="w-5 h-5" />
                  <span>Open Positions</span>
                </h4>
                <span className="text-sm bg-muted text-muted-foreground rounded-full px-2.5 py-1">
                  {activeJobs.length} roles
                </span>
              </div>
              
              {activeJobs.length > 0 ? (
                <div className="space-y-3">
                  {activeJobs.map((job) => (
                    <div key={job.id} className="p-4 rounded-lg bg-card border border-border backdrop-blur-sm hover:bg-accent transition-all duration-300">
                      <div className="font-medium text-foreground text-lg">{job.title}</div>
                      <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
                        <span className="bg-muted text-foreground px-2 py-1 rounded-full">{job.department}</span>
                        <span>•</span>
                        <span>{job.location}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {job.description}
                      </div>
                      <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                        <span className="text-sm bg-muted text-muted-foreground rounded-full px-2.5 py-1">
                          {job.type}
                        </span>
                        {job.salary && (
                          <span className="text-sm text-muted-foreground bg-green-600/20 dark:bg-green-400/20 px-2.5 py-1 rounded-full">
                            {job.salary}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="mt-3 w-full rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 shadow-sm transition-all duration-300"
                      >
                        Apply Now
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Mailbox className="w-12 h-12 mb-2 mx-auto text-foreground" />
                  <p className="font-medium text-lg">No open positions at the moment</p>
                  <p className="text-base mt-1">Check back soon for new opportunities!</p>
                </div>
              )}
              
              <a 
                href="#careers" 
                className="block mt-4 text-center text-base text-primary hover:underline"
              >
                Submit your CV to our talent pool
              </a>
            </div>
            
            <div className="rounded-2xl border border-border bg-muted p-5 backdrop-blur-sm">
              <h4 className="font-semibold mb-3 flex items-center gap-2 text-foreground text-lg">
                <Sparkles className="w-5 h-5" />
                <span>Program Benefits</span>
              </h4>
              <ul className="space-y-2 text-base text-muted-foreground">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Industry mentorship</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Real project experience</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Professional networking</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Skill certification</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Career guidance</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Job placement support</li>
              </ul>
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