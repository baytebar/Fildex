import React from 'react'

const Hero = () => {
  return (
    <section id="home" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
      <div className="lg:col-span-7 space-y-4">
        <div className="inline-flex items-center gap-2 text-xs rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 backdrop-blur-sm">
          <span className="text-purple-300">Fildex Solutions</span>
          <span className="text-purple-200">Complete Digital Service Provider</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-semibold leading-tight">Skill-based Training and Business Outsourcing Solutions</h2>
        <p className="text-purple-100 max-w-prose">Empowering teams with cutting-edge IT training while delivering comprehensive business outsourcing services. From cloud computing to AI/ML, we provide hands-on training and seamless project delivery for businesses across Ireland and beyond.</p>
        <div className="flex items-center gap-3">
          <a href="#training" className="rounded-md border border-purple-400/30 px-5 py-2.5 hover:bg-purple-500/10 transition-colors">Explore Training</a>
          <a href="#outsourcing" className="rounded-md bg-gradient-to-tr from-purple-500 to-purple-700 px-5 py-2.5 font-medium shadow-lg shadow-purple-500/25 hover:brightness-110">Outsource with Us</a>
        </div>
        <div className="flex items-center gap-4 text-xs text-purple-300">
          <span>✓ Expert-led training</span>
          <span>✓ Job placement assistance</span>
          <span>✓ 24/7 business support</span>
        </div>
      </div>
      <div className="lg:col-span-5">
        <div className="rounded-2xl border border-purple-400/20 bg-purple-500/10 p-5">
          <h3 className="text-sm font-semibold mb-2">Live Insights (demo)</h3>
          <p className="text-sm text-purple-300">Open the chat bot and upload your resume to preview insights here.</p>
        </div>
      </div>
    </section>
  )
}

export default Hero
