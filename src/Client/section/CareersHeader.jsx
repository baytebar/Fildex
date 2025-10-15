import React, { useState } from 'react'
import { Button } from '../../components/ui/button'
import { Menu, X, LogIn, LogOut } from 'lucide-react'
import FildexLogo from '../../images/FILDEX_SOLUTIONS.png'
import FildexText from '../../images/FILDEX_SOLUTIONS_TEXT.png'
import { Link, useNavigate } from 'react-router-dom'

const CareersHeader = ({ isLoggedIn, setIsLoggedIn }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogin = () => {
    if (!isLoggedIn) {
      navigate('/login')
    } else {
      // Handle logout
      setIsLoggedIn(false)
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('userEmail')
    }
  }

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm py-2">
      <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-between">
        <div className="flex items-center justify-center">
          <Link to={'/'} className="flex items-center gap-2 md:gap-3" onClick={() => window.scrollTo(0, 0)}>
            <img
              src={FildexLogo}
              alt="Fildex Logo"
              className="h-6 md:h-8 lg:h-10 w-auto"
            />
            <img
              src={FildexText}
              alt="Fildex Solutions"
              className="h-4 md:h-6 lg:h-7 w-auto hidden sm:block"
            />
          </Link>
        </div>

        {/* No navigation items - just logo and action buttons */}

        <div className="flex items-center gap-3">
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

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-border py-4 px-4 absolute top-full left-0 right-0 shadow-lg z-50">
          <nav className="flex flex-col gap-4 text-base text-muted-foreground">
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

export default CareersHeader
