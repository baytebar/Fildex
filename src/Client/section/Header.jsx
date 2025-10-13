import React, { useState } from 'react'
import { Button } from '../../components/ui/button'
import { Menu, X, LogIn, LogOut } from 'lucide-react'
import FildexLogo from '../../images/FILDEX_SOLUTIONS.png'
import FildexText from '../../images/FILDEX_SOLUTIONS_TEXT.png'
import { Link, useNavigate } from 'react-router-dom'
const Header = ({ setShowBot }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()

  const handleLogin = () => {
    // Toggle login state
    setIsLoggedIn(!isLoggedIn)
    // If logging in, navigate to login page
    if (!isLoggedIn) {
      navigate('/login')
    }
    // In a real app, you would implement actual login/logout logic here
  }

  return (
    // Updated header styling to work with the new theme
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm py-2">
      <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-between">
        <div className="flex items-center justify-center">
          {/* Updated responsive logo styling */}
          <Link to={'/'} className="flex items-center gap-2 md:gap-3" onClick={() => window.scrollTo(0, 0)}>
            <img
              src={FildexLogo}
              alt="Fildex Logo"
              className="h-8 md:h-10 lg:h-10 w-auto"
            />
            <img
              src={FildexText}
              alt="Fildex Solutions"
              className="h-6 md:h-8 lg:h-7 w-auto hidden sm:block"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-base text-muted-foreground">
          <a className="hover:text-primary transition-colors" href="#about">About</a>
          <a className="hover:text-primary transition-colors" href="#outsourcing">Outsourcing</a>
          <Link to={"/careers"}>Careers</Link>

        </nav>

        <div className="flex items-center gap-3">
          {/* Updated button styling to use the new theme */}
          <a href="#contact" className="hidden md:inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-base font-medium text-primary-foreground hover:bg-primary/90 shadow-sm">
            Get in Touch
          </a>

          {/* Login/Logout Button */}
          <button
            onClick={handleLogin}
            className="hidden md:inline-flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-base font-medium text-secondary-foreground hover:bg-secondary/90 shadow-sm transition-colors"
          >
            {isLoggedIn ? (
              <>
                <LogOut className="w-4 h-4" />
                Logout
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Login
              </>
            )}
          </button>

          {/* Mobile menu button - moved to the right side */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? (
              <X className="block h-6 w-6" />
            ) : (
              <Menu className="block h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-border py-4 px-4 absolute top-full left-0 right-0 shadow-lg z-50">
          <nav className="flex flex-col gap-4 text-base text-muted-foreground">
            <a
              className="hover:text-primary transition-colors py-2"
              href="#about"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </a>
            <a
              className="hover:text-primary transition-colors py-2"
              href="#outsourcing"
              onClick={() => setIsMenuOpen(false)}
            >
              Outsourcing
            </a>
            <Link
              to={"/careers"}
              className="py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Careers
            </Link>
            <a
              className="hover:text-primary transition-colors py-2"
              href="#contact"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-base font-medium text-primary-foreground hover:bg-primary/90 shadow-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              Get in Touch
            </a>
            {/* Mobile Login/Logout Button */}
            <button
              onClick={() => {
                handleLogin()
                setIsMenuOpen(false)
              }}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-secondary px-4 py-2 text-base font-medium text-secondary-foreground hover:bg-secondary/90 shadow-sm transition-colors"
            >
              {isLoggedIn ? (
                <>
                  <LogOut className="w-4 h-4" />
                  Logout
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Login
                </>
              )}
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header