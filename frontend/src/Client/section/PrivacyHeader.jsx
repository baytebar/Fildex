import React, { useState, useEffect, useRef } from 'react'
import { Button } from '../../components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { LogIn, LogOut, ChevronDown } from 'lucide-react'
import FildexLogo from '/images/FILDEX_SOLUTIONS.png'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../features/auth/authSlice'

const PrivacyHeader = () => {
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
    if (!name) return ''
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 flex items-center justify-between">
        <div className="flex items-center justify-center">
          <Link to={'/'} className="flex items-center gap-1 sm:gap-2 md:gap-3" onClick={() => window.scrollTo(0, 0)}>
            <div className='flex justify-center gap-1 sm:gap-2 items-center'>
              <img
                src={FildexLogo}
                alt="Fildex Logo"
                className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 xl:h-14 xl:w-14 2xl:h-12 2xl:w-12 shrink-0"
              />
              <div className='flex flex-col'>
                <h1 className='text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-3xl 2xl:text-2xl font-bold text-blue-950 leading-tight'>FILDEX</h1>
                <h4 className='text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-sm text-blue-950 font-bold leading-tight'>SOLUTIONS</h4>
              </div>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1 lg:gap-2 rounded-full bg-background border border-border p-1.5 lg:p-2 text-sm lg:text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground shadow-sm transition-colors"
              >
                <Avatar variant="gradient" size="sm">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback variant="gradient">
                    {user?.name ? getUserInitials(user.name) : <span className="opacity-50">U</span>}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-md shadow-lg z-50">
                  <div className="py-1">
                    <div className="px-4 py-3 border-b border-border">
                      <div className="flex items-center gap-3">
                        <Avatar variant="gradient" size="sm">
                          <AvatarImage src={user?.avatar} alt={user?.name} />
                          <AvatarFallback variant="gradient">
                            {user?.name ? getUserInitials(user.name) : <span className="opacity-50">U</span>}
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
              className="inline-flex items-center gap-2 rounded-md bg-secondary px-3 lg:px-4 py-2 text-sm lg:text-base font-medium text-secondary-foreground hover:bg-secondary/90 shadow-sm transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default PrivacyHeader
