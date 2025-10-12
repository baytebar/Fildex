import React from 'react'
import { Briefcase, ClipboardList, Rocket, Building2, Zap, TrendingUp, Wrench, Check } from 'lucide-react'

const BusinessOutsourcing = () => {
  return (
    <section id="outsourcing" className="min-h-dvh space-y-6 px-12">
      {/* Updated text color to use theme variables */}
      <h3 className="text-2xl font-semibold text-foreground">Business Outsourcing Solutions</h3>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          {/* Updated text color to use theme variables */}
          <p className="text-foreground text-xl leading-relaxed">
            Comprehensive business consulting and IT support for startups and SMEs. We provide system integration, performance optimization, and software maintenance with dedicated support packages for business continuity.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Updated cards to use theme variables */}
            <div className="rounded-xl border border-border bg-muted p-4">
              <Briefcase className="w-8 h-8 mb-2 text-foreground" />
              <div className="font-medium mb-1 text-foreground text-lg">IT Staffing</div>
              <div className="text-base text-muted-foreground">Expert developers, designers, and technical specialists</div>
            </div>
            <div className="rounded-xl border border-border bg-muted p-4">
              <ClipboardList className="w-8 h-8 mb-2 text-foreground" />
              <div className="font-medium mb-1 text-foreground text-lg">Contract Jobs</div>
              <div className="text-base text-muted-foreground">Flexible project-based engagements</div>
            </div>
            <div className="rounded-xl border border-border bg-muted p-4">
              <Rocket className="w-8 h-8 mb-2 text-foreground" />
              <div className="font-medium mb-1 text-foreground text-lg">Project Delivery</div>
              <div className="text-base text-muted-foreground">End-to-end development and deployment</div>
            </div>
          </div>

          {/* Updated card to use theme variables */}
          <div className="rounded-2xl border border-border bg-muted p-5">
            <h4 className="font-semibold mb-4 text-foreground text-lg">Our Process</h4>
            <ol className="grid grid-cols-1 md:grid-cols-3 gap-4 text-base">
              {/* Updated process cards to use theme variables */}
              <li className="rounded-xl border border-border bg-muted p-4">
                <div className="text-muted-foreground mb-1 font-medium">1. Consult</div>
                <div className="text-muted-foreground">Understand your requirements and challenges</div>
              </li>
              <li className="rounded-xl border border-border bg-muted p-4">
                <div className="text-muted-foreground mb-1 font-medium">2. Match Talent</div>
                <div className="text-muted-foreground">Find the perfect team for your project</div>
              </li>
              <li className="rounded-xl border border-border bg-muted p-4">
                <div className="text-muted-foreground mb-1 font-medium">3. Deliver</div>
                <div className="text-muted-foreground">Execute with excellence and ongoing support</div>
              </li>
            </ol>
          </div>
        </div>
        <div className="lg:col-span-4">
          {/* Updated card to use theme variables */}
          <div className="rounded-2xl border border-border bg-muted p-5">
            <h4 className="font-semibold mb-3 text-foreground text-lg">Why Choose Fildex?</h4>
            <ul className="space-y-2 text-base text-muted-foreground">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> 24/7 monitoring and support</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Rapid issue resolution</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Strategy planning</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Digital transformation</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Automation implementation</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary" /> Future-proofing applications</li>
            </ul>
            {/* Updated button to use theme variables */}
            <button className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-base font-medium text-primary-foreground hover:bg-primary/90 shadow-sm">
              Hire Talent
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BusinessOutsourcing