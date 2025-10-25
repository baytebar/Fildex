import React, { useState } from 'react'
import JobApplicationForm from './JobApplicationForm'
import { Target, GraduationCap, Users, Sparkles, Megaphone, Mailbox, Check, Circle } from 'lucide-react'
import Header from '../../Client/section/Header.jsx'
import SEO from '../../components/SEO'
import { OrganizationSchema, JobPostingSchema } from '../../components/StructuredData'


const JobListing = ({ jobPostings }) => {
    // Filter active job postings
    const activeJobs = jobPostings?.filter(job => job.status === 'active') || []
    const [selectedJob, setSelectedJob] = useState(null)

    const handleApply = (applicationData) => {
        // In a real app, you would send this data to a server
        // For now, we'll just close the form
        setSelectedJob(null)
    }

    // Create structured data for job postings
    const jobStructuredData = activeJobs.map(job => JobPostingSchema(job))
    const structuredData = [OrganizationSchema, ...jobStructuredData]

    return (
        <>
            <SEO
                title="Job Opportunities at Fildex Solutions - Current Openings"
                description="Explore current job opportunities at Fildex Solutions. We're hiring cloud engineers, DevOps specialists, AI/ML developers, software developers, and business analysts in Cork, Ireland."
                keywords="job opportunities, current openings, cloud engineer jobs, DevOps jobs, AI/ML developer jobs, software developer jobs, business analyst jobs, Cork, Ireland, IT careers, tech jobs"
                url="https://fildex.ie/jobs"
                structuredData={structuredData}
            />
            <Header />
            <section id="opportunities" className="min-h-dvh space-y-8 px-4 sm:px-6 lg:px-8 py-12 bg-background">
                <div className="max-w-7xl mx-auto">
                    {/* Section header with improved typography */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                            Opportunities and Internships
                        </h2>
                        <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8">
                            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Target className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl text-foreground">Join Our Talent Pool</h3>
                                        <p className="text-muted-foreground">Gain real-world experience and build your career</p>
                                    </div>
                                </div>

                                <p className="text-foreground mb-6 text-lg">
                                    We invite students and professionals to join our internship programs and talent pool.
                                    Gain real-world experience, work on live projects, and build your career with industry experts.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="rounded-xl border border-border bg-muted p-5">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                            <GraduationCap className="w-5 h-5 text-primary" />
                                        </div>
                                        <h4 className="font-bold text-lg text-foreground mb-3">Student Internships</h4>
                                        <p className="text-muted-foreground mb-4">6-month programs with mentorship and project experience</p>
                                        <ul className="text-sm text-muted-foreground space-y-2">
                                            <li className="flex items-start gap-2">
                                                <Circle className="w-2 h-2 text-primary mt-1.5 shrink-0" />
                                                <span>Hands-on project work</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Circle className="w-2 h-2 text-primary mt-1.5 shrink-0" />
                                                <span>Expert mentorship</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Circle className="w-2 h-2 text-primary mt-1.5 shrink-0" />
                                                <span>Industry certifications</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Circle className="w-2 h-2 text-primary mt-1.5 shrink-0" />
                                                <span>Job placement assistance</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="rounded-xl border border-border bg-muted p-5">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                            <Users className="w-5 h-5 text-primary" />
                                        </div>
                                        <h4 className="font-bold text-lg text-foreground mb-3">Professional Pool</h4>
                                        <p className="text-muted-foreground mb-4">Join our network of skilled professionals for contract opportunities</p>
                                        <ul className="text-sm text-muted-foreground space-y-2">
                                            <li className="flex items-start gap-2">
                                                <Circle className="w-2 h-2 text-primary mt-1.5 shrink-0" />
                                                <span>Flexible engagements</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Circle className="w-2 h-2 text-primary mt-1.5 shrink-0" />
                                                <span>Competitive rates</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Circle className="w-2 h-2 text-primary mt-1.5 shrink-0" />
                                                <span>Remote work options</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Circle className="w-2 h-2 text-primary mt-1.5 shrink-0" />
                                                <span>Skill development</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <a href="#careers" className="w-full sm:w-auto rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground shadow-md hover:bg-primary/90 transition-all duration-300 text-center">
                                        Apply Now
                                    </a>
                                    <a href="#contact" className="w-full sm:w-auto rounded-lg border border-border px-5 py-3 hover:bg-accent transition-colors text-foreground font-medium text-center">
                                        Contact Us
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-4 space-y-6">
                            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Megaphone className="w-4 h-4 text-primary" />
                                        </div>
                                        <h3 className="font-bold text-lg text-foreground">Open Positions</h3>
                                    </div>
                                    <span className="text-sm bg-muted text-muted-foreground rounded-full px-3 py-1">
                                        {activeJobs.length} roles
                                    </span>
                                </div>

                                {activeJobs.length > 0 ? (
                                    <div className="space-y-4">
                                        {activeJobs.map((job) => (
                                            <div key={job.id} className="p-5 rounded-lg bg-muted border border-border hover:bg-accent transition-all duration-300">
                                                <h4 className="font-bold text-foreground text-lg">{job.title}</h4>
                                                <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2 flex-wrap">
                                                    <span className="bg-background text-foreground px-2.5 py-1 rounded-full">{job.department}</span>
                                                    <span>•</span>
                                                    <span>{job.location}</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                                                    {job.description}
                                                </p>
                                                <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
                                                    <span className="text-sm bg-background text-muted-foreground rounded-full px-2.5 py-1">
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
                                                    className="mt-4 w-full rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 shadow-sm transition-all duration-300"
                                                >
                                                    Apply Now
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Mailbox className="w-12 h-12 mb-3 mx-auto text-foreground" />
                                        <p className="font-medium text-lg">No open positions at the moment</p>
                                        <p className="text-base mt-1">Check back soon for new opportunities!</p>
                                    </div>
                                )}

                                <a
                                    href="#careers"
                                    className="block mt-6 text-center text-sm text-primary hover:underline font-medium"
                                >
                                    Submit your CV to our talent pool
                                </a>
                            </div>

                            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Sparkles className="w-4 h-4 text-primary" />
                                    </div>
                                    <h3 className="font-bold text-lg text-foreground">Program Benefits</h3>
                                </div>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                                        <span className="text-muted-foreground">Industry mentorship</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                                        <span className="text-muted-foreground">Real project experience</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                                        <span className="text-muted-foreground">Professional networking</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                                        <span className="text-muted-foreground">Skill certification</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                                        <span className="text-muted-foreground">Career guidance</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                                        <span className="text-muted-foreground">Job placement support</span>
                                    </li>
                                </ul>
                            </div>
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

export default JobListing
