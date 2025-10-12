import React from 'react'
import { Check } from 'lucide-react'
import HeroImage from '../../images/Hero.png'
const Hero = () => {
  return (
    <section
      id="home"
      className="min-h-dvh relative overflow-hidden px-2 md:px-10 lg:px-14"
    >
      {/* Purple Corner Grid Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #f0f0f0 1px, transparent 1px),
            linear-gradient(to bottom, #f0f0f0 1px, transparent 1px),
            radial-gradient(circle 600px at 0% 200px, #d5c5ff, transparent),
            radial-gradient(circle 600px at 100% 200px, #d5c5ff, transparent)
          `,
          backgroundSize: "20px 20px, 20px 20px, 100% 100%, 100% 100%",
        }}
      />

      {/* Existing radial gradient overlay */}
      <div
        className="absolute inset-0 z-0 rounded-b-full"

      />

      {/* Content with proper z-index to appear above the background */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center px-4 sm:px-6 lg:px-8  min-h-dvh">
        <div className="lg:col-span-7 space-y-6 order-2 lg:order-1 mt-4">
          {/* Badge with updated styling for LMS look */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold rounded-full border border-border bg-white/90 backdrop-blur-sm px-4 py-2 shadow-sm">
            <a href="#outsourcing" className="flex items-center gap-2">
              <span className="text-muted-foreground">Fildex Solutions</span>
              <span className="text-foreground">• Complete Digital Service Provider</span>
            </a>
          </div>

          {/* Updated heading with better hierarchy for LMS */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-foreground">
            Skill-based Training and <span className="text-primary">Business Outsourcing</span> Solutions
          </h1>

          {/* Updated paragraph with better readability */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Empowering teams with cutting-edge IT training while delivering comprehensive business outsourcing services.
            From cloud computing to AI/ML, we provide hands-on training and seamless project delivery for businesses across Ireland and beyond.
          </p>

          {/* Updated CTA buttons with LMS styling */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a
              href="#training"
              className="w-full sm:w-auto rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300 text-center"
            >
              Explore Training
            </a>
            <a
              href="#outsourcing"
              className="w-full sm:w-auto rounded-lg bg-white border-2 border-primary px-6 py-3 text-base font-semibold text-primary hover:bg-primary/5 shadow-md hover:shadow-lg transition-all duration-300 text-center"
            >
              Outsource with Us
            </a>
          </div>

          {/* Updated features list with icons */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-muted-foreground pt-2">
            <span className="flex items-center gap-2 font-medium">
              <Check className="w-5 h-5 text-primary" />
              Expert-led training
            </span>
            <span className="flex items-center gap-2 font-medium">
              <Check className="w-5 h-5 text-primary" />
              Job placement assistance
            </span>
            <span className="flex items-center gap-2 font-medium">
              <Check className="w-5 h-5 text-primary" />
              24/7 business support
            </span>
          </div>
        </div>

        <div className="lg:col-span-5 relative z-10 mt-8 lg:mt-0 flex items-center justify-center order-1 lg:order-2">
          {/* Image with updated styling for LMS */}
          <div className="rounded-2xl overflow-hidden w-full h-full ">
            <img
              src={HeroImage}
              alt="Fildex Solutions Platform"
              className="w-full h-auto max-h-[750px] lg:w-[450px] xl:w-[500px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero