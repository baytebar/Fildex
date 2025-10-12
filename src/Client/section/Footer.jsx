import React from 'react'

const Footer = () => {
  return (
    <footer className="border-t border-border mt-12">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            {/* Updated text colors to use theme variables */}
            <h4 className="font-semibold text-foreground mb-3 text-lg">Fildex Solutions</h4>
            <p className="text-base text-muted-foreground mb-3">
              Complete digital service provider delivering website development, software solutions, and business process support.
            </p>
            <div className="flex gap-3">
              {/* Updated link colors to use theme variables */}
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-base">LinkedIn</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-base">Twitter</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-base">GitHub</a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-lg">Services</h4>
            <ul className="space-y-2 text-base text-muted-foreground">
              <li><a href="#training" className="hover:text-foreground transition-colors">Training Programs</a></li>
              <li><a href="#outsourcing" className="hover:text-foreground transition-colors">Business Outsourcing</a></li>
              <li><a href="#careers" className="hover:text-foreground transition-colors">Career Services</a></li>
              <li><a href="#opportunities" className="hover:text-foreground transition-colors">Internships</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-lg">Company</h4>
            <ul className="space-y-2 text-base text-muted-foreground">
              <li><a href="#about" className="hover:text-foreground transition-colors">About Us</a></li>
              <li><a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a></li>
              <li><a href="#contact" className="hover:text-foreground transition-colors">Contact</a></li>
              <li><a href="#opportunities" className="hover:text-foreground transition-colors">Join Our Team</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-lg">Legal</h4>
            <ul className="space-y-2 text-base text-muted-foreground">
              <li><a href="#privacy" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#cv-privacy" className="hover:text-foreground transition-colors">CV Privacy Notice</a></li>
              <li><a href="#gdpr" className="hover:text-foreground transition-colors">GDPR Compliance</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Updated text colors to use theme variables */}
          <div className="text-base text-muted-foreground">
            © {new Date().getFullYear()} Fildex Solutions. All rights reserved.
          </div>
          <div className="text-base text-muted-foreground">
            Hosted on Hetzner • Secured with SSL • GDPR Compliant
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer