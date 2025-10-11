import React from 'react'

const Footer = () => {
  return (
    <footer className="border-t border-white/10 mt-12">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-semibold text-white mb-3">Fildex Solutions</h4>
            <p className="text-sm text-purple-300 mb-3">
              Complete digital service provider delivering website development, software solutions, and business process support.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-purple-300 hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="text-purple-300 hover:text-white transition-colors">Twitter</a>
              <a href="#" className="text-purple-300 hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-3">Services</h4>
            <ul className="space-y-2 text-sm text-purple-300">
              <li><a href="#training" className="hover:text-white transition-colors">Training Programs</a></li>
              <li><a href="#outsourcing" className="hover:text-white transition-colors">Business Outsourcing</a></li>
              <li><a href="#careers" className="hover:text-white transition-colors">Career Services</a></li>
              <li><a href="#opportunities" className="hover:text-white transition-colors">Internships</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-purple-300">
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#opportunities" className="hover:text-white transition-colors">Join Our Team</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-purple-300">
              <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#cv-privacy" className="hover:text-white transition-colors">CV Privacy Notice</a></li>
              <li><a href="#gdpr" className="hover:text-white transition-colors">GDPR Compliance</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-sm text-purple-300">
            © {new Date().getFullYear()} Fildex Solutions. All rights reserved.
          </div>
          <div className="text-sm text-purple-300">
            Hosted on Hetzner • Secured with SSL • GDPR Compliant
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
