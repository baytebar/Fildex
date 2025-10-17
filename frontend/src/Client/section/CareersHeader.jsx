import React, { useState, useEffect, useRef } from 'react'
import { Button } from '../../components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { Menu, X, LogIn, LogOut, ChevronDown } from 'lucide-react'
import FildexLogo from '../../images/FILDEX_SOLUTIONS.png'
import FildexText from '../../images/FILDEX_SOLUTIONS_TEXT.png'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../features/auth/authSlice'

const CareersHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userMenuRef = useRef(null)
  
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogin = () => {
    navigate('/login')
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
    setIsUserMenuOpen(false)
  }

  const getUserInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
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
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="hidden md:flex items-center gap-2 rounded-full bg-background border border-border p-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground shadow-sm transition-colors"
              >
                <Avatar variant="gradient" size="sm">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback variant="gradient">
                    {getUserInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg z-50">
                  <div className="py-1">
                    <div className="px-4 py-3 border-b border-border">
                      <div className="flex items-center gap-3">
                        <Avatar variant="gradient" size="sm">
                          <AvatarImage src={user?.avatar} alt={user?.name} />
                          <AvatarFallback variant="gradient">
                            {getUserInitials(user?.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">{user?.name || 'User'}</p>
                          <p className="text-xs text-muted-foreground truncate" title={user?.email}>{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="hidden md:inline-flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-base font-medium text-secondary-foreground hover:bg-secondary/90 shadow-sm transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Login
            </button>
          )}

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
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex flex-col items-center gap-2 px-4 py-3 border-b border-border">
                  <Avatar variant="gradient" size="lg">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback variant="gradient">
                      {getUserInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{user?.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  handleLogin()
                  setIsMenuOpen(false)
                }}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-secondary px-4 py-2 text-base font-medium text-secondary-foreground hover:bg-secondary/90 shadow-sm transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

export default CareersHeader
