import React from 'react'

const About = () => {
  return (
    <section id="about" className="space-y-6">
      <h3 className="text-xl font-semibold text-white">About Fildex Solutions</h3>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <p className="text-purple-100 text-lg leading-relaxed">
            Fildex Solutions operates as a complete digital service provider delivering website development, software solutions, and business process support. We support clients across Ireland and abroad with end-to-end technical, development, and business services.
          </p>
          <p className="text-purple-100 leading-relaxed">
            Our vision centers on practical training that bridges the gap between education and industry needs. We provide hands-on internships, real-world project experience, and comprehensive job assistance to ensure our students are career-ready from day one.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="rounded-xl border border-purple-400/20 bg-purple-500/10 p-4 backdrop-blur-sm">
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-medium mb-1 text-white">Practical Training</div>
              <div className="text-sm text-purple-200">Real-world projects and hands-on labs</div>
            </div>
            <div className="rounded-xl border border-purple-400/20 bg-purple-500/10 p-4 backdrop-blur-sm">
              <div className="text-2xl mb-2">🤝</div>
              <div className="font-medium mb-1 text-white">Job Assistance</div>
              <div className="text-sm text-purple-200">Placement support and interview prep</div>
            </div>
            <div className="rounded-xl border border-purple-400/20 bg-purple-500/10 p-4 backdrop-blur-sm">
              <div className="text-2xl mb-2">🚀</div>
              <div className="font-medium mb-1 text-white">Internships</div>
              <div className="text-sm text-purple-200">Industry partnerships and mentorship</div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-purple-400/20 bg-purple-500/10 p-5 backdrop-blur-sm">
            <h4 className="font-semibold mb-3 text-white">Our Commitment</h4>
            <ul className="space-y-2 text-sm text-purple-200">
              <li className="flex items-center gap-2"><span className="text-purple-300">✓</span> Industry-relevant curriculum</li>
              <li className="flex items-center gap-2"><span className="text-purple-300">✓</span> Expert instructors</li>
              <li className="flex items-center gap-2"><span className="text-purple-300">✓</span> Career guidance</li>
              <li className="flex items-center gap-2"><span className="text-purple-300">✓</span> Ongoing support</li>
              <li className="flex items-center gap-2"><span className="text-purple-300">✓</span> Flexible learning paths</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
