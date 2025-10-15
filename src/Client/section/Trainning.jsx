import React from 'react'
import { GraduationCap, Sparkles, Check, Briefcase, Rocket } from 'lucide-react'

const Training = () => {

  return (
    <>
      <section id="training" className="min-h-dvh px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-br from-background to-muted">
        <div className="max-w-7xl mx-auto">
          {/* Section header with improved typography */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              PROFESSIONAL TRAINING
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
              Master New Skills With Expert Training
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Comprehensive training programs designed to enhance your technical skills and advance your career in the digital world.
            </p>
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Training Programs Card */}
            <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-2xl text-foreground mb-2">Professional Training Programs</h3>
                  <p className="text-muted-foreground">
                    Comprehensive courses designed to enhance your technical skills and advance your career.
                  </p>
                </div>
              </div>

              <p className="text-foreground mb-8 text-lg">
                We offer specialized training programs in cutting-edge technologies and business skills.
                Learn from industry experts, work on real projects, and gain certifications that boost your career prospects.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-muted/50 border border-border rounded-xl p-6 hover:bg-gray-200 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Rocket className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-bold text-xl text-foreground mb-3">Technical Training</h4>
                  <p className="text-muted-foreground mb-4">Advanced courses in modern technologies and frameworks</p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      <span>Web Development (React, Node.js)</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      <span>Cloud Computing (AWS, Azure)</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      <span>Data Science & Analytics</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-muted/50 border border-border rounded-xl p-6 hover:bg-gray-200 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-bold text-xl text-foreground mb-3">Business Skills</h4>
                  <p className="text-muted-foreground mb-4">Professional development and leadership training programs</p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      <span>Project Management</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      <span>Digital Marketing</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      <span>Leadership & Communication</span>
                    </li>
                  </ul>
                </div>
              </div>

            </div>

            {/* Training Benefits Card */}
            <div className="bg-gradient-to-br from-primary/5 to-accent/20 border border-primary/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-2xl text-foreground">Training Benefits</h3>
              </div>

              <ul className="space-y-5 mb-8">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Expert Instructors</h4>
                    <p className="text-sm text-muted-foreground">Learn from industry professionals with years of experience</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Hands-on Learning</h4>
                    <p className="text-sm text-muted-foreground">Practical exercises and real-world project simulations</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Industry Certifications</h4>
                    <p className="text-sm text-muted-foreground">Earn recognized certificates to boost your resume</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Flexible Learning</h4>
                    <p className="text-sm text-muted-foreground">Online and in-person options to fit your schedule</p>
                  </div>
                </li>
              </ul>

              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-2xl text-foreground">98%</div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">98%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

      

        </div>
      </section>

    </>
  )
}

export default Training