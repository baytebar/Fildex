import React from 'react'

const ServiceProvider = () => {
  return (
    <section id="services-overview" className="space-y-6">
      <h3 className="text-xl font-semibold text-white">Complete Digital Service Provider</h3>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <p className="text-purple-100 text-lg leading-relaxed">
            Fildex Solutions operates as a complete digital service provider delivering website development, software solutions, and business process support. We support clients across Ireland and abroad with end-to-end technical, development, and business services.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-purple-400/20 bg-purple-500/10 p-5">
              <div className="text-2xl mb-3">🏗️</div>
              <h4 className="font-semibold mb-2">System Integration</h4>
              <p className="text-sm text-purple-200">Seamless integration of complex systems and applications for optimal performance.</p>
            </div>
            
            <div className="rounded-2xl border border-purple-400/20 bg-purple-500/10 p-5">
              <div className="text-2xl mb-3">⚡</div>
              <h4 className="font-semibold mb-2">Performance Optimization</h4>
              <p className="text-sm text-purple-200">Enhance system performance and scalability for growing businesses.</p>
            </div>
            
            <div className="rounded-2xl border border-purple-400/20 bg-purple-500/10 p-5">
              <div className="text-2xl mb-3">🔧</div>
              <h4 className="font-semibold mb-2">Software Maintenance</h4>
              <p className="text-sm text-purple-200">Ongoing support and maintenance to keep your systems running smoothly.</p>
            </div>
            
            <div className="rounded-2xl border border-purple-400/20 bg-purple-500/10 p-5">
              <div className="text-2xl mb-3">📈</div>
              <h4 className="font-semibold mb-2">Digital Transformation</h4>
              <p className="text-sm text-purple-200">Modernize your business processes with cutting-edge technology solutions.</p>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-purple-400/20 bg-purple-500/10 p-5">
            <h4 className="font-semibold mb-3">Support Packages</h4>
            <ul className="space-y-2 text-sm text-purple-200">
              <li className="flex items-center gap-2"><span>✓</span> 24/7 monitoring</li>
              <li className="flex items-center gap-2"><span>✓</span> Rapid issue resolution</li>
              <li className="flex items-center gap-2"><span>✓</span> Business continuity</li>
              <li className="flex items-center gap-2"><span>✓</span> Strategy planning</li>
              <li className="flex items-center gap-2"><span>✓</span> Automation implementation</li>
              <li className="flex items-center gap-2"><span>✓</span> Future-proofing</li>
            </ul>
          </div>
          
          <div className="rounded-2xl border border-purple-400/20 bg-purple-500/10 p-5">
            <h4 className="font-semibold mb-3">Technical Partnership</h4>
            <p className="text-sm text-purple-200 mb-3">
              Scale your operations with our technical expertise and infrastructure management.
            </p>
            <a href="#contact" className="inline-block rounded-md bg-gradient-to-tr from-purple-500 to-purple-700 px-4 py-2 text-sm font-medium hover:brightness-110 shadow-lg shadow-purple-500/25">
              Partner with Us
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServiceProvider
