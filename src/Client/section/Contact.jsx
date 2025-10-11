import React, { useState } from 'react'

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
    <section id="contact" className="space-y-6">
      <h3 className="text-xl font-semibold text-white">Contact Us</h3>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-2xl border border-purple-400/20 bg-purple-500/10 p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-purple-300 mb-1">Name</label>
                <input 
                  value={contact.name} 
                  onChange={(e) => setContact(c => ({ ...c, name: e.target.value }))} 
                  className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40" 
                  placeholder="Your name" 
                />
              </div>
              <div>
                <label className="block text-xs text-purple-300 mb-1">Email</label>
                <input 
                  value={contact.email} 
                  onChange={(e) => setContact(c => ({ ...c, email: e.target.value }))} 
                  type="email" 
                  className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40" 
                  placeholder="you@example.com" 
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-purple-300 mb-1">Message</label>
              <textarea 
                value={contact.message} 
                onChange={(e) => setContact(c => ({ ...c, message: e.target.value }))} 
                rows={5} 
                className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40" 
                placeholder="Tell us what you need..." 
              />
            </div>
            <div className="flex items-center gap-3">
              <button 
                disabled={contactStatus === 'sending' || contactStatus === 'sent'} 
                className="rounded-md bg-gradient-to-tr from-purple-500 to-purple-700 px-5 py-2 text-sm font-medium hover:brightness-110 disabled:opacity-60 shadow-lg shadow-purple-500/25"
              >
                {contactStatus === 'sending' ? 'Sending...' : contactStatus === 'sent' ? 'Sent ✅' : 'Send message'}
              </button>
              {contactStatus && contactStatus !== 'sending' && contactStatus !== 'sent' && (
                <span className="text-xs text-red-300">{contactStatus}</span>
              )}
              {contactStatus === 'sent' && (
                <span className="text-xs text-green-300">Thanks! We'll get back to you soon (demo).</span>
              )}
            </div>
          </form>
        </div>
        <div className="lg:col-span-5 rounded-2xl border border-purple-400/20 bg-purple-500/10 p-5 space-y-4">
          <div className="font-medium text-lg">Get in touch</div>
          <div className="text-purple-100">Have questions about our training, outsourcing services, or career opportunities? We're here to help.</div>
          
          <div className="space-y-3">
            <div className="rounded-md bg-white/5 border border-white/10 p-3">
              <div className="text-xs text-purple-300 mb-1">Email</div>
              <div className="text-sm text-purple-200">careers@fildex.ie</div>
              <div className="text-xs text-purple-300">support@fildex.ie</div>
            </div>
            
            <div className="rounded-md bg-white/5 border border-white/10 p-3">
              <div className="text-xs text-purple-300 mb-1">Phone</div>
              <div className="text-sm text-purple-200">+353 1 234 5678</div>
            </div>
            
            <div className="rounded-md bg-white/5 border border-white/10 p-3">
              <div className="text-xs text-purple-300 mb-1">Address</div>
              <div className="text-sm text-purple-200">
                Dublin Business Centre<br />
                Ireland
              </div>
            </div>
            
            <div className="rounded-md bg-white/5 border border-white/10 p-3">
              <div className="text-xs text-purple-300 mb-1">Business Hours</div>
              <div className="text-sm text-purple-200">Mon–Fri, 9am–6pm IST</div>
            </div>
            
            <div className="rounded-md bg-white/5 border border-white/10 p-3">
              <div className="text-xs text-purple-300 mb-1">WhatsApp</div>
              <a href="https://wa.me/353123456789" target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-400 hover:underline">
                +353 1 234 5678
              </a>
            </div>
          </div>
          
          <div className="pt-3 border-t border-white/10">
            <div className="text-xs text-purple-300 mb-2">Social Media</div>
            <div className="flex gap-3">
              <a href="#" className="text-purple-300 hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="text-purple-300 hover:text-white transition-colors">Twitter</a>
              <a href="#" className="text-purple-300 hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
