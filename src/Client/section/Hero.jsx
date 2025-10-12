import React from 'react'
import { Check } from 'lucide-react'

const Hero = () => {
  return (
    <section style={{
      background: "radial-gradient(125% 125% at 50% 90%, #fff 40%, #7c3aed 100%)",
    }} id="home" className="h-screen  grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative px-12">
      {/* Radial Gradient Background from Bottom */}
      <div
        className="absolute inset-0 z-0 rounded-b-full"
        
      />

      {/* Content with higher z-index to appear above the background */}
      <div className="lg:col-span-7 space-y-4 relative z-10">
        {/* Updated to use theme variables instead of hardcoded purple colors */}
        <div className="inline-flex items-center gap-2 text-xs rounded-full border border-border bg-white/80 px-3 py-1 backdrop-blur-sm">
          <span className="text-muted-foreground">Fildex Solutions</span>
          <span className="text-foreground font-medium">Complete Digital Service Provider</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-semibold leading-tight">Skill-based Training and Business Outsourcing Solutions</h2>
        {/* Updated text color to use theme variables */}
        <p className="text-muted-foreground max-w-prose">Empowering teams with cutting-edge IT training while delivering comprehensive business outsourcing services. From cloud computing to AI/ML, we provide hands-on training and seamless project delivery for businesses across Ireland and beyond.</p>
        <div className="flex items-center gap-3">
          {/* Updated buttons to use theme variables */}
          <a href="#training" className="rounded-md border border-border bg-white/80 px-5 py-2.5 hover:bg-accent transition-colors backdrop-blur-sm">Explore Training</a>
          <a href="#outsourcing" className="rounded-md bg-primary px-5 py-2.5 font-medium text-primary-foreground shadow-sm hover:bg-primary/90 backdrop-blur-sm">Outsource with Us</a>
        </div>
        {/* Updated text color to use theme variables */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Check className="w-4 h-4 text-primary" /> Expert-led training</span>
          <span className="flex items-center gap-1"><Check className="w-4 h-4 text-primary" /> Job placement assistance</span>
          <span className="flex items-center gap-1"><Check className="w-4 h-4 text-primary" /> 24/7 business support</span>
        </div>
      </div>
      <div className="lg:col-span-5 relative z-10">
        {/* Image with higher z-index to appear above the background */}
        <img
          src="/images/hero.png"
          alt="Hero"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
    </section>
  )
}

export default Hero