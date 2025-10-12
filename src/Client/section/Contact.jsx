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
    <section id="contact" className="min-h-dvh space-y-6 px-12">
      {/* Updated text color to use theme variables */}
      <h3 className="text-2xl font-semibold text-foreground">Contact Us</h3>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Updated card to use theme variables */}
        <div className="lg:col-span-7 rounded-2xl border border-border bg-muted p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                {/* Updated label color to use theme variables */}
                <label className="block text-sm text-muted-foreground mb-1">Name</label>
                <input 
                  value={contact.name} 
                  onChange={(e) => setContact(c => ({ ...c, name: e.target.value }))} 
                  className="w-full rounded-md bg-card border border-input px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-ring" 
                  placeholder="Your name" 
                />
              </div>
              <div>
                {/* Updated label color to use theme variables */}
                <label className="block text-sm text-muted-foreground mb-1">Email</label>
                <input 
                  value={contact.email} 
                  onChange={(e) => setContact(c => ({ ...c, email: e.target.value }))} 
                  type="email" 
                  className="w-full rounded-md bg-card border border-input px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-ring" 
                  placeholder="you@example.com" 
                />
              </div>
            </div>
            <div>
              {/* Updated label color to use theme variables */}
              <label className="block text-sm text-muted-foreground mb-1">Message</label>
              <textarea 
                value={contact.message} 
                onChange={(e) => setContact(c => ({ ...c, message: e.target.value }))} 
                rows={5} 
                className="w-full rounded-md bg-card border border-input px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-ring" 
                placeholder="Tell us what you need..." 
              />
            </div>
            <div className="flex items-center gap-3">
              {/* Updated button to use theme variables */}
              <button 
                disabled={contactStatus === 'sending' || contactStatus === 'sent'} 
                className="rounded-md bg-primary px-5 py-2 text-base font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60 shadow-sm"
              >
                {contactStatus === 'sending' ? 'Sending...' : contactStatus === 'sent' ? <span className="flex items-center gap-1">Sent <Check className="w-4 h-4" /></span> : 'Send message'}
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
        {/* Updated card to use theme variables */}
        <div className="lg:col-span-5 rounded-2xl border border-border bg-muted p-5 space-y-4">
          <div className="font-medium text-xl text-foreground">Get in touch</div>
          {/* Updated text color to use theme variables */}
          <div className="text-foreground text-lg">Have questions about our training, outsourcing services, or career opportunities? We're here to help.</div>
          
          <div className="space-y-3">
            {/* Updated cards to use theme variables */}
            <div className="rounded-md bg-card border border-input p-3">
              <div className="text-sm text-muted-foreground mb-1">Email</div>
              <div className="text-base text-foreground">careers@fildex.ie</div>
              <div className="text-base text-foreground">support@fildex.ie</div>
            </div>
            
            <div className="rounded-md bg-card border border-input p-3">
              <div className="text-sm text-muted-foreground mb-1">Phone</div>
              <div className="text-base text-foreground">+353 1 234 5678</div>
            </div>
            
            <div className="rounded-md bg-card border border-input p-3">
              <div className="text-sm text-muted-foreground mb-1">Address</div>
              <div className="text-base text-foreground">
                Dublin Business Centre<br />
                Ireland
              </div>
            </div>
            
            <div className="rounded-md bg-card border border-input p-3">
              <div className="text-sm text-muted-foreground mb-1">Business Hours</div>
              <div className="text-base text-foreground">Mon–Fri, 9am–6pm IST</div>
            </div>
            
            <div className="rounded-md bg-card border border-input p-3">
              <div className="text-sm text-muted-foreground mb-1">WhatsApp</div>
              <a href="https://wa.me/353123456789" target="_blank" rel="noopener noreferrer" className="text-base text-primary hover:underline">
                +353 1 234 5678
              </a>
            </div>
          </div>
          
          <div className="pt-3 border-t border-border">
            <div className="text-sm text-muted-foreground mb-2">Social Media</div>
            <div className="flex gap-3">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-base">LinkedIn</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-base">Twitter</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-base">GitHub</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact