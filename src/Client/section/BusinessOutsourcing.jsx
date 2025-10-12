import React from 'react'
import { Briefcase, ClipboardList, Rocket, Building2, Zap, TrendingUp, Wrench, Check } from 'lucide-react'

const BusinessOutsourcing = () => {
  return (
    <section id="outsourcing" className="min-h-dvh px-4 sm:px-6 lg:px-8 py-16 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section header with improved typography */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
            OUTSOURCING
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            Business Outsourcing Solutions
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Comprehensive business consulting and IT support for startups and SMEs. 
            We provide system integration, performance optimization, and software maintenance 
            with dedicated support packages for business continuity.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {/* Service cards with modern styling */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <Briefcase className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-bold text-xl text-foreground mb-4">IT Staffing</h3>
            <p className="text-muted-foreground mb-6">Expert developers, designers, and technical specialists ready to join your team.</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Pre-vetted professionals</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Flexible engagement models</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Quick onboarding</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <ClipboardList className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-bold text-xl text-foreground mb-4">Contract Jobs</h3>
            <p className="text-muted-foreground mb-6">Flexible project-based engagements tailored to your specific requirements.</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Fixed-price projects</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Time & material billing</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Dedicated project managers</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <Rocket className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-bold text-xl text-foreground mb-4">Project Delivery</h3>
            <p className="text-muted-foreground mb-6">End-to-end development and deployment with ongoing support.</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Full lifecycle management</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Agile development approach</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">Post-deployment support</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Process section with modern timeline */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-foreground text-center mb-12">Our Streamlined Process</h3>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/20 hidden md:block"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Step 1 */}
              <div className="relative md:pr-12">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg z-10">
                    1
                  </div>
                  <h4 className="font-bold text-xl text-foreground ml-4">Consultation</h4>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                  <p className="text-muted-foreground mb-4">
                    We begin with a thorough analysis of your business requirements and technical challenges.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      <span>Requirement gathering</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      <span>Technical assessment</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      <span>Solution architecture</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="relative md:pl-12 md:mt-24">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg z-10">
                    2
                  </div>
                  <h4 className="font-bold text-xl text-foreground ml-4">Talent Matching</h4>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                  <p className="text-muted-foreground mb-4">
                    Our team identifies and matches the perfect professionals for your project needs.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      <span>Skills assessment</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      <span>Cultural fit evaluation</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      <span>Team composition</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="relative md:pr-12">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg z-10">
                    3
                  </div>
                  <h4 className="font-bold text-xl text-foreground ml-4">Execution</h4>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                  <p className="text-muted-foreground mb-4">
                    We implement the solution with precision, following industry best practices.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      <span>Agile development</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      <span>Regular progress updates</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      <span>Quality assurance</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="relative md:pl-12 md:mt-24">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg z-10">
                    4
                  </div>
                  <h4 className="font-bold text-xl text-foreground ml-4">Support & Growth</h4>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                  <p className="text-muted-foreground mb-4">
                    We provide ongoing support and help scale your solution as your business grows.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      <span>24/7 monitoring</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      <span>Performance optimization</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      <span>Continuous improvement</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Benefits section with CTA */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/20 rounded-3xl p-8 md:p-12 border border-primary/10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div>
              <h3 className="font-bold text-2xl md:text-3xl text-foreground mb-4">
                Why Choose Fildex for Your Outsourcing Needs?
              </h3>
              <p className="text-muted-foreground mb-6">
                Our comprehensive approach ensures you get the right talent and solutions for your business.
              </p>
            </div>
            
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Rapid Deployment</h4>
                    <p className="text-sm text-muted-foreground">Get your team up and running in days, not weeks.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Scalable Solutions</h4>
                    <p className="text-sm text-muted-foreground">Easily scale your team up or down based on demand.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Industry Expertise</h4>
                    <p className="text-sm text-muted-foreground">Access to specialists across multiple technology domains.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Wrench className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Dedicated Support</h4>
                    <p className="text-sm text-muted-foreground">24/7 monitoring and rapid issue resolution.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-md">
                  Hire Talent Now
                </button>
                <button className="px-6 py-3 border border-border bg-card text-foreground font-semibold rounded-lg hover:bg-accent transition-colors">
                  Schedule Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BusinessOutsourcing