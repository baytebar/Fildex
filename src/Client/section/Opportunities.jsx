import React from 'react'

const Opportunities = () => {
  return (
    <section id="opportunities" className="space-y-6">
      <h3 className="text-xl font-semibold text-white">Opportunities and Internships</h3>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <div className="rounded-2xl border border-purple-400/20 bg-purple-500/10 p-6">
            <h4 className="font-semibold mb-4">Join Our Talent Pool</h4>
            <p className="text-purple-100 mb-6">
              We invite students and professionals to join our internship programs and talent pool. Gain real-world experience, work on live projects, and build your career with industry experts.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl border border-purple-400/20 bg-purple-500/10 p-4">
                <div className="text-2xl mb-2">🎓</div>
                <div className="font-medium mb-2">Student Internships</div>
                <div className="text-sm text-purple-200 mb-3">6-month programs with mentorship and project experience</div>
                <ul className="text-xs text-purple-200 space-y-1">
                  <li>• Hands-on project work</li>
                  <li>• Expert mentorship</li>
                  <li>• Industry certifications</li>
                  <li>• Job placement assistance</li>
                </ul>
              </div>
              
              <div className="rounded-xl border border-purple-400/20 bg-purple-500/10 p-4">
                <div className="text-2xl mb-2">💼</div>
                <div className="font-medium mb-2">Professional Pool</div>
                <div className="text-sm text-purple-200 mb-3">Join our network of skilled professionals for contract opportunities</div>
                <ul className="text-xs text-purple-200 space-y-1">
                  <li>• Flexible engagements</li>
                  <li>• Competitive rates</li>
                  <li>• Remote work options</li>
                  <li>• Skill development</li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <a href="#careers" className="rounded-md bg-gradient-to-tr from-purple-500 to-purple-700 px-5 py-2.5 font-medium shadow-lg shadow-purple-500/25 hover:brightness-110">
                Apply Now
              </a>
              <a href="#contact" className="rounded-md border border-purple-400/30 px-5 py-2.5 hover:bg-purple-500/10 transition-colors">
                View Open Roles
              </a>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-purple-400/20 bg-purple-500/10 p-5">
            <h4 className="font-semibold mb-3">Program Benefits</h4>
            <ul className="space-y-2 text-sm text-purple-200">
              <li className="flex items-center gap-2"><span>✓</span> Industry mentorship</li>
              <li className="flex items-center gap-2"><span>✓</span> Real project experience</li>
              <li className="flex items-center gap-2"><span>✓</span> Professional networking</li>
              <li className="flex items-center gap-2"><span>✓</span> Skill certification</li>
              <li className="flex items-center gap-2"><span>✓</span> Career guidance</li>
              <li className="flex items-center gap-2"><span>✓</span> Job placement support</li>
            </ul>
          </div>
          
          <div className="rounded-2xl border border-purple-400/20 bg-purple-500/10 p-5">
            <h4 className="font-semibold mb-3">Success Stories</h4>
            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-lg bg-white/5">
                <div className="text-purple-200">"The internship program gave me hands-on experience with cloud technologies and led to a full-time position."</div>
                <div className="text-xs text-purple-300 mt-1">- Sarah, Cloud Engineer</div>
              </div>
              <div className="p-3 rounded-lg bg-white/5">
                <div className="text-purple-200">"Working with Fildex helped me transition from student to professional developer."</div>
                <div className="text-xs text-purple-300 mt-1">- Michael, Software Developer</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Opportunities
