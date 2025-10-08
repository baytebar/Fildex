import React from 'react'

const Testimonials = () => {
  return (
    <section id="testimonials" className="space-y-6">
      <h3 className="text-xl font-semibold text-white">Testimonials and Partners</h3>
      
      {/* Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="rounded-2xl border border-purple-400/20 bg-purple-500/10 p-5">
          <div className="text-yellow-400 mb-2">★★★★★</div>
          <p className="text-purple-200 text-sm mb-4">
            "Fildex's training program transformed my career. The hands-on approach and expert instructors helped me land a cloud engineering role within 3 months."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-purple-700 flex items-center justify-center text-white font-semibold">
              A
            </div>
            <div>
              <div className="font-medium text-sm">Alex Thompson</div>
              <div className="text-xs text-purple-300">Cloud Engineer</div>
            </div>
          </div>
        </div>
        
        <div className="rounded-2xl border border-purple-400/20 bg-purple-500/10 p-5">
          <div className="text-yellow-400 mb-2">★★★★★</div>
          <p className="text-purple-200 text-sm mb-4">
            "The outsourcing services exceeded our expectations. Fildex delivered our project on time and within budget, with excellent communication throughout."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-purple-700 flex items-center justify-center text-white font-semibold">
              M
            </div>
            <div>
              <div className="font-medium text-sm">Maria Rodriguez</div>
              <div className="text-xs text-purple-300">CTO, TechStart</div>
            </div>
          </div>
        </div>
        
        <div className="rounded-2xl border border-purple-400/20 bg-purple-500/10 p-5">
          <div className="text-yellow-400 mb-2">★★★★★</div>
          <p className="text-purple-200 text-sm mb-4">
            "As a student, the internship program gave me invaluable real-world experience. The mentorship and project work prepared me perfectly for my career."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-purple-700 flex items-center justify-center text-white font-semibold">
              J
            </div>
            <div>
              <div className="font-medium text-sm">James O'Brien</div>
              <div className="text-xs text-purple-300">Software Developer</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Partners */}
      <div className="rounded-2xl border border-purple-400/20 bg-purple-500/10 p-6">
        <h4 className="font-semibold mb-4">Trusted Partners</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center">
          <div className="text-center">
            <div className="text-2xl mb-2">☁️</div>
            <div className="text-xs text-purple-300">AWS Partner</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🔷</div>
            <div className="text-xs text-purple-300">Microsoft Partner</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🐧</div>
            <div className="text-xs text-purple-300">Linux Foundation</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🎓</div>
            <div className="text-xs text-purple-300">University Partners</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🏢</div>
            <div className="text-xs text-purple-300">Enterprise Clients</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🚀</div>
            <div className="text-xs text-purple-300">Startup Ecosystem</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
