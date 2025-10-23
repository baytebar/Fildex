import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FildexLogo from '../../images/FILDEX_SOLUTIONS.png'

const AuthHeader = () => {
  const navigate = useNavigate();

  const handleLogoClick = (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    // Force navigation to home page
    navigate('/', { replace: false });
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

        {/* Empty div for spacing - no buttons needed */}
        <div className="flex items-center gap-3">
          {/* No login button as requested */}
        </div>
      </div>
    </header>
  )
}

export default AuthHeader
