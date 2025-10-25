import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Search, X, Loader2 } from 'lucide-react'

// Fallback countries for when API is not available
const fallbackCountries = [
  { code: 'IE', name: 'Ireland', dialCode: '+353', flag: '🇮🇪' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦' },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦' }
]

const PhoneInput = ({ 
  value = '', 
  onChange, 
  defaultCountry = 'IE', 
  placeholder = 'Enter phone number',
  className = '',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [countries, setCountries] = useState(fallbackCountries)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState(
    fallbackCountries.find(country => country.code === defaultCountry) || fallbackCountries[0]
  )
  const [phoneNumber, setPhoneNumber] = useState('')
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0, width: 0, showAbove: false })
  const dropdownRef = useRef(null)
  const inputRef = useRef(null)
  const buttonRef = useRef(null)

  // Fetch countries from API
  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoading(true)
      try {
        // Using REST Countries API
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd')
        const data = await response.json()
        
        const formattedCountries = data
          .filter(country => country.idd?.root && country.idd?.suffixes?.length > 0)
          .map(country => ({
            code: country.cca2,
            name: country.name.common,
            dialCode: country.idd.root + (country.idd.suffixes[0] || ''),
            flag: getCountryFlag(country.cca2)
          }))
          .sort((a, b) => a.name.localeCompare(b.name))
        
        setCountries(formattedCountries)
        
        // Update selected country if it exists in the new list
        const newSelectedCountry = formattedCountries.find(country => country.code === defaultCountry)
        if (newSelectedCountry) {
          setSelectedCountry(newSelectedCountry)
        }
      } catch (error) {
        // Keep using fallback countries
      } finally {
        setIsLoading(false)
      }
    }

    fetchCountries()
  }, [defaultCountry])

  // Helper function to get country flag emoji
  const getCountryFlag = (countryCode) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt())
    return String.fromCodePoint(...codePoints)
  }

  // Filter countries based on search term
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.dialCode.includes(searchTerm)
  )

  // Update button position when dropdown opens
  const updateButtonPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const dropdownHeight = 300 // Approximate height of dropdown
      
      // Always show above the input
      setButtonPosition({
        top: rect.top + window.scrollY - dropdownHeight,
        left: rect.left + window.scrollX,
        width: rect.width,
        showAbove: true
      })
    }
  }

  // Handle country selection
  const handleCountrySelect = (country) => {
    setSelectedCountry(country)
    setIsOpen(false)
    setSearchTerm('')
    
    // Update the full phone number with new country code
    const newValue = country.dialCode + phoneNumber
    onChange?.(newValue, true, country.dialCode)
  }

  // Handle phone number input
  const handlePhoneChange = (e) => {
    let inputValue = e.target.value
    
    // Remove any country code that user might have entered
    // Since we have a separate country selector, users shouldn't enter country codes
    if (inputValue.startsWith('+')) {
      // Remove the + and any digits that might be a country code
      inputValue = inputValue.replace(/^\+/, '')
    }
    
    // Only allow numeric characters
    const numericValue = inputValue.replace(/\D/g, '')
    setPhoneNumber(numericValue)
    
    // Create full phone number with selected country code
    const fullNumber = selectedCountry.dialCode + numericValue
    onChange?.(fullNumber, numericValue.length >= 7, selectedCountry.dialCode)
  }

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target) && 
          !event.target.closest('[data-country-dropdown]')) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      // Update position when dropdown opens
      updateButtonPosition()
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Initialize phone number from value prop
  useEffect(() => {
    if (value && value.startsWith(selectedCountry.dialCode)) {
      const number = value.substring(selectedCountry.dialCode.length)
      setPhoneNumber(number)
    }
  }, [value, selectedCountry.dialCode])

  // Update position on window resize and scroll
  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        updateButtonPosition()
      }
    }

    const handleScroll = () => {
      if (isOpen) {
        updateButtonPosition()
      }
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll, true) // Use capture phase for better performance
    
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [isOpen])

  return (
    <div className={`relative phone-input-container ${className}`}>
      <div className="flex">
        {/* Country Selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            ref={buttonRef}
            type="button"
            onClick={() => {
              setIsOpen(!isOpen)
            }}
            disabled={disabled}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-3 border border-r-0 border-input rounded-l-lg bg-background text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-0"
          >
            <span className="text-base sm:text-lg shrink-0">{selectedCountry.flag}</span>
            <span className="text-xs sm:text-sm font-medium truncate">{selectedCountry.dialCode}</span>
            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
          </button>

          {/* Dropdown Portal */}
          {isOpen && createPortal(
            <div 
              data-country-dropdown
              className="fixed z-50 bg-background border border-input shadow-lg rounded-b-lg"
              style={{
                top: `${buttonPosition.top}px`,
                left: `${buttonPosition.left}px`,
                width: `${Math.max(buttonPosition.width, 280)}px`,
                minWidth: '280px',
                maxWidth: 'calc(100vw - 16px)'
              }}
            >
              {/* Arrow indicator */}
              <div 
                className="absolute bottom-0 left-4 w-0 h-0 border-l-4 border-r-4 border-l-transparent border-r-transparent border-t-4 border-t-background"
                style={{
                  transform: 'translateY(-1px)'
                }}
              />
              {/* Search */}
              <div className="p-2 sm:p-3 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search countries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary text-sm sm:text-base"
                    autoFocus
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Country List */}
              <div className="max-h-60 overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-sm text-muted-foreground">Loading countries...</span>
                  </div>
                ) : filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className="w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 text-left hover:bg-accent focus:bg-accent focus:outline-none"
                    >
                      <span className="text-base sm:text-lg shrink-0">{country.flag}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground text-sm sm:text-base truncate">{country.name}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">{country.dialCode}</div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <span className="text-sm text-muted-foreground">No countries found</span>
                  </div>
                )}
              </div>
            </div>,
            document.body
          )}
        </div>

        {/* Phone Number Input */}
        <input
          ref={inputRef}
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder="Enter phone number"
          disabled={disabled}
          className="flex-1 px-2 sm:px-4 py-3 border border-input rounded-r-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-w-0"
        />
      </div>
    </div>
  )
}

export default PhoneInput
