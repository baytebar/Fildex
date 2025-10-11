import React from 'react'
import { Button } from '../../components/ui/button'

const Header = ({ setShowBot, setShowAdmin }) => {
  return (
    <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-purple-950/80 border-b border-purple-400/20 shadow-lg shadow-purple-500/10">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold tracking-tight">Fildex</h1>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-purple-200">
          <a className="hover:text-white transition-colors" href="#home">Home</a>
          <a className="hover:text-white transition-colors" href="#about">About</a>
          <a className="hover:text-white transition-colors" href="#training">Training</a>
          <a className="hover:text-white transition-colors" href="#outsourcing">Outsourcing</a>
          <a className="hover:text-white transition-colors" href="#careers">Careers</a>
          <a className="hover:text-white transition-colors" href="#contact">Contact</a>
        </nav>
        <div className="flex items-center gap-3">
          <a href="#contact" className="hidden md:inline-flex items-center gap-2 rounded-md bg-gradient-to-tr from-purple-500 to-purple-700 px-4 py-2 text-sm font-medium hover:brightness-110 shadow-lg shadow-purple-500/25">
            Get in Touch
          </a>

          <button
            onClick={() => setShowAdmin(true)}
            className="md:hidden inline-flex items-center gap-2 rounded-md border border-purple-400/20 px-3 py-1.5 text-sm hover:bg-purple-500/10 transition-colors"
            title="Admin Dashboard"
          >
            <span>🔧</span>
          </button>
          <Button onClick={() => setShowBot(true)} >Chat</Button>

        </div>
      </div>
    </header>
  )
}

export default Header
