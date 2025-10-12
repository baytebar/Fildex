import React, { useState } from 'react'
import { Check } from 'lucide-react'

const Contact = () => {
  const [contact, setContact] = useState({ name: '', email: '', message: '' })
  const [contactStatus, setContactStatus] = useState('') // '', 'sending', 'sent'

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!contact.name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact.email) || contact.message.length < 10) {
      setContactStatus('Please fill all fields correctly (message ≥ 10 chars).')
      return
    }
    setContactStatus('sending')
    setTimeout(() => {
      setContactStatus('sent')
    }, 700)
  }

  return (
    <section id="contact" className="min-h-dvh space-y-8 px-4 sm:px-6 lg:px-8 py-12 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section header with improved typography */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Contact Us
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Have questions about our training, outsourcing services, or career opportunities? We're here to help.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Updated contact form with LMS styling */}
          <div className="lg:col-span-7 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Name</label>
                  <input 
                    value={contact.name} 
                    onChange={(e) => setContact(c => ({ ...c, name: e.target.value }))} 
                    className="w-full rounded-lg bg-background border border-input px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors" 
                    placeholder="Your name" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
                  <input 
                    value={contact.email} 
                    onChange={(e) => setContact(c => ({ ...c, email: e.target.value }))} 
                    type="email" 
                    className="w-full rounded-lg bg-background border border-input px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors" 
                    placeholder="you@example.com" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Message</label>
                <textarea 
                  value={contact.message} 
                  onChange={(e) => setContact(c => ({ ...c, message: e.target.value }))} 
                  rows={6} 
                  className="w-full rounded-lg bg-background border border-input px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors" 
                  placeholder="Tell us what you need..." 
                />
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button 
                  disabled={contactStatus === 'sending' || contactStatus === 'sent'} 
                  className="w-full sm:w-auto rounded-lg bg-primary px-5 py-3 text-base font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 shadow-md transition-all duration-300"
                >
                  {contactStatus === 'sending' ? 'Sending...' : contactStatus === 'sent' ? <span className="flex items-center gap-2">Sent <Check className="w-4 h-4" /></span> : 'Send message'}
                </button>
                {contactStatus && contactStatus !== 'sending' && contactStatus !== 'sent' && (
                  <span className="text-sm text-destructive">{contactStatus}</span>
                )}
                {contactStatus === 'sent' && (
                  <span className="text-sm text-green-600 dark:text-green-400">Thanks! We'll get back to you soon (demo).</span>
                )}
              </div>
            </form>
          </div>
          
          {/* Updated contact info with LMS styling */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="font-bold text-xl text-foreground mb-4">Get in touch</h3>
              <p className="text-foreground mb-6">
                Have questions about our training, outsourcing services, or career opportunities? We're here to help.
              </p>
              
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Email</div>
                    <div className="text-foreground">careers@fildex.ie</div>
                    <div className="text-foreground">support@fildex.ie</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Phone</div>
                    <div className="text-foreground">+353 1 234 5678</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Address</div>
                    <div className="text-foreground">
                      Dublin Business Centre<br />
                      Ireland
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Business Hours</div>
                    <div className="text-foreground">Mon–Fri, 9am–6pm IST</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="font-bold text-xl text-foreground mb-4">Connect with us</h3>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact