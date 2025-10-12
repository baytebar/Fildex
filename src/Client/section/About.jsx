import React from 'react'
import { Target, Handshake, Rocket, Check } from 'lucide-react'

const About = () => {
  return (
    <section id="about" className="min-h-dvh space-y-6 px-12">
      {/* Updated text color to use theme variables */}
      <h3 className="text-2xl font-semibold text-foreground">About Fildex Solutions</h3>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          {/* Updated text color to use theme variables */}
          <p className="text-foreground text-xl leading-relaxed">
            Fildex Solutions operates as a complete digital service provider delivering website development, software solutions, and business process support. We support clients across Ireland and abroad with end-to-end technical, development, and business services.
          </p>
          {/* Updated text color to use theme variables */}
          <p className="text-foreground text-lg leading-relaxed">
            Our vision centers on practical training that bridges the gap between education and industry needs. We provide hands-on internships, real-world project experience, and comprehensive job assistance to ensure our students are career-ready from day one.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {/* Updated cards to use theme variables */}
            <div className="rounded-xl border border-border bg-muted p-4 backdrop-blur-sm">
              <Target className="w-8 h-8 mb-2 text-foreground" />
              <div className="font-medium mb-1 text-foreground text-lg">Practical Training</div>
              <div className="text-base text-muted-foreground">Real-world projects and hands-on labs</div>
            </div>

            <div className="rounded-xl border border-border bg-muted p-4 backdrop-blur-sm">
              <Handshake className="w-8 h-8 mb-2 text-foreground" />
              <div className="font-medium mb-1 text-foreground text-lg">Job Assistance</div>
              <div className="text-base text-muted-foreground">Placement support and interview prep</div>
            </div>
            
            <div className="rounded-xl border border-border bg-muted p-4 backdrop-blur-sm">
              <Rocket className="w-8 h-8 mb-2 text-foreground" />
              <div className="font-medium mb-1 text-foreground text-lg">Internships</div>
              <div className="text-base text-muted-foreground">Industry partnerships and mentorship</div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-4">
          {/* Updated card to use theme variables */}
          <div className="rounded-2xl border border-border bg-muted p-5 backdrop-blur-sm">
            <h4 className="font-semibold mb-3 text-foreground text-lg">Our Commitment</h4>
            <ul className="space-y-2 text-base text-muted-foreground">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Industry-relevant curriculum</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Expert instructors</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Career guidance</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Ongoing support</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Flexible learning paths</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About