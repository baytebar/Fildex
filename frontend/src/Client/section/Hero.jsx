import React from 'react'
import { Check } from 'lucide-react'
import HeroImage from '../../images/Hero.png'
const Hero = () => {
  return (
    <section
      id="home"
      style={{
        background: "radial-gradient(125% 125% at 50% 90%, #fff 40%, #7c3aed 100%)",
        backgroundImage: `
        linear-gradient(to right, #f0f0f0 1px, transparent 1px),
        linear-gradient(to bottom, #f0f0f0 1px, transparent 1px),
        radial-gradient(circle 600px at 0% 200px, #d5c5ff, transparent),
        radial-gradient(circle 600px at 100% 200px, #d5c5ff, transparent)
      `,
        backgroundSize: "20px 20px, 20px 20px, 100% 100%, 100% 100%",
      }}
      className="min-h-dvh relative overflow-hidden px-2 md:px-10 lg:px-14"
    >
      <div
        className="absolute inset-0 z-0"
      />

      <div
        className="absolute inset-0 z-0 rounded-b-full"

      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center px-4 sm:px-6 lg:px-8  min-h-dvh">
        <div className="lg:col-span-7 space-y-6 order-2 lg:order-1 mt-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold rounded-full border border-black/20 bg-black/5 backdrop-blur-sm px-4 py-2 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-black/80">Fildex Solutions</span>
              <span className="text-black">• Complete Digital Service Provider</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-foreground">
            Skill-based Training and <span className="text-primary">Digital Solutions</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Empowering teams with cutting-edge IT training and digital solutions.
            From cloud computing to AI/ML, we provide hands-on training and seamless project delivery for businesses across Ireland and beyond.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a
              href="#training"
              className="w-full sm:w-auto rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300 text-center"
            >
              Explore Training
            </a>
            <a
              href="#contact"
              className="w-full sm:w-auto rounded-lg bg-secondary px-6 py-3 text-base font-semibold text-secondary-foreground hover:bg-secondary/90 shadow-md hover:shadow-lg transition-all duration-300 text-center"
            >
              Get in Touch
            </a>
          </div>

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