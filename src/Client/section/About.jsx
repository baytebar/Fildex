import React from 'react'
import { Target, Handshake, Rocket, Check } from 'lucide-react'

const About = () => {
  return (
    <section id="about" className="min-h-dvh px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-br from-background to-muted">
      <div className="max-w-7xl mx-auto">
        {/* Section header with improved typography */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
            ABOUT US
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            Empowering Digital Transformation
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We bridge the gap between education and industry, providing cutting-edge training and business solutions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-foreground">
              Your Complete Digital Service Partner
            </h3>
            <p className="text-lg text-foreground leading-relaxed">
              Fildex Solutions operates as a complete digital service provider delivering website development, 
              software solutions, and business process support. We support clients across Ireland and abroad 
              with end-to-end technical, development, and business services.
            </p>
            <p className="text-lg text-foreground leading-relaxed">
              Our vision centers on practical training that bridges the gap between education and industry needs. 
              We provide hands-on internships, real-world project experience, and comprehensive job assistance 
              to ensure our students are career-ready from day one.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center gap-2 text-primary">
                <Check className="w-5 h-5" />
                <span className="font-medium">Industry Experts</span>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <Check className="w-5 h-5" />
                <span className="font-medium">Hands-on Training</span>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <Check className="w-5 h-5" />
                <span className="font-medium">Career Support</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-primary/5 rounded-2xl p-8 border border-primary/10">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                  <div className="text-3xl font-bold text-primary mb-1">500+</div>
                  <div className="text-muted-foreground">Students Trained</div>
                </div>
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                  <div className="text-3xl font-bold text-primary mb-1">50+</div>
                  <div className="text-muted-foreground">Projects Delivered</div>
                </div>
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                  <div className="text-3xl font-bold text-primary mb-1">95%</div>
                  <div className="text-muted-foreground">Placement Rate</div>
                </div>
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                  <div className="text-3xl font-bold text-primary mb-1">25+</div>
                  <div className="text-muted-foreground">Expert Trainers</div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/10 rounded-full -z-10"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/5 rounded-full -z-10"></div>
          </div>
        </div>
        
        {/* Updated feature cards with modern styling */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-bold text-xl text-foreground mb-4">Practical Training</h3>
            <p className="text-muted-foreground mb-4">Real-world projects and hands-on labs that prepare you for industry challenges.</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                Live Projects
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                Industry Tools
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                Certification
              </li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <Handshake className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-bold text-xl text-foreground mb-4">Job Assistance</h3>
            <p className="text-muted-foreground mb-4">Placement support and interview prep to launch your tech career.</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                Resume Building
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                Mock Interviews
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                Career Coaching
              </li>
            </ul>
          </div>
          
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <Rocket className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-bold text-xl text-foreground mb-4">Internships</h3>
            <p className="text-muted-foreground mb-4">Industry partnerships and mentorship for real-world experience.</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                6-Month Programs
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                Expert Mentorship
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                Project Portfolio
              </li>
            </ul>
          </div>
        </div>
        
        {/* Updated commitment section with modern styling */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-3xl p-8 md:p-12 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <h3 className="font-bold text-2xl md:text-3xl mb-4">
                Our Commitment to Your Success
              </h3>
              <p className="text-primary-foreground/90 mb-6 max-w-2xl">
                We're dedicated to providing industry-relevant training and support that helps you achieve your career goals.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Check className="w-6 h-6 text-white bg-white/20 rounded-full p-1" />
                  <span>Expert instructors with real industry experience</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-6 h-6 text-white bg-white/20 rounded-full p-1" />
                  <span>Flexible learning paths tailored to your goals</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-6 h-6 text-white bg-white/20 rounded-full p-1" />
                  <span>Ongoing career guidance and support</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-6 h-6 text-white bg-white/20 rounded-full p-1" />
                  <span>Access to our professional network</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 w-full max-w-xs">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">95%</div>
                  <div className="text-white/90">Student Placement Rate</div>
                  <div className="mt-4 w-full h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-[95%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About