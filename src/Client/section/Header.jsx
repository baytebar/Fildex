import React from 'react'
import { Button } from '../../components/ui/button'
import { Wrench } from 'lucide-react'
import FildexLogo from '../../images/Fildex.png'
const Header = ({ setShowBot, setShowAdmin }) => {
  return (
    // Updated header styling to work with the new theme
    <header className="sticky top-0 z-10 bg-white border-b border-border shadow-sm z-10">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Updated logo styling */}
          <img src={FildexLogo} alt="" className="h-10" />        </div>
        <nav className="hidden md:flex items-center gap-6 text-base text-muted-foreground">
          <a className="hover:text-primary transition-colors" href="#home">Home</a>
          <a className="hover:text-primary transition-colors" href="#about">About</a>
          <a className="hover:text-primary transition-colors" href="#training">Training</a>
          <a className="hover:text-primary transition-colors" href="#outsourcing">Outsourcing</a>
          <a className="hover:text-primary transition-colors" href="#careers">Careers</a>
          <a className="hover:text-primary transition-colors" href="#contact">Contact</a>
        </nav>
        <div className="flex items-center gap-3">
          {/* Updated button styling to use the new theme */}
          <a href="#contact" className="hidden md:inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-base font-medium text-primary-foreground hover:bg-primary/90 shadow-sm">
            Get in Touch
          </a>

          <button
            onClick={() => setShowAdmin(true)}
            className="md:hidden inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-base hover:bg-accent transition-colors"
            title="Admin Dashboard"
          >
            <Wrench className="w-4 h-4" />
          </button>
          {/* Using the themed button component */}
          <Button onClick={() => setShowBot(true)} variant="outline">Chat</Button>

        </div>
      </div>
    </header>
  )
}

export default Header