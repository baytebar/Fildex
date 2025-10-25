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
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0, width: 0 })
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
        console.warn('Failed to fetch countries from API, using fallback:', error)
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
      setButtonPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
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

  // Update position on window resize
  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        updateButtonPosition()
      }
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleResize)
    }
  }, [isOpen])

  return (
    <div className={`relative ${className}`}>
      <div className="flex">
        {/* Country Selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            ref={buttonRef}
            type="button"
            onClick={() => {
              if (!isOpen) {
                updateButtonPosition()
              }
              setIsOpen(!isOpen)
            }}
            disabled={disabled}
            className="flex items-center gap-2 px-3 py-3 border border-r-0 border-gray-300 rounded-l-lg bg-white text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-lg">{selectedCountry.flag}</span>
            <span className="text-sm font-medium">{selectedCountry.dialCode}</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* Dropdown Portal */}
          {isOpen && createPortal(
            <div 
              data-country-dropdown
              className="fixed z-50 w-80 bg-white border border-gray-300 rounded-lg shadow-lg"
              style={{
                top: `${buttonPosition.top}px`,
                left: `${buttonPosition.left}px`,
                width: `${buttonPosition.width}px`
              }}
            >
              {/* Search */}
              <div className="p-3 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search countries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    autoFocus
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
                    <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                    <span className="ml-2 text-sm text-gray-500">Loading countries...</span>
                  </div>
                ) : filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                    >
                      <span className="text-lg">{country.flag}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900">{country.name}</div>
                        <div className="text-sm text-gray-500">{country.dialCode}</div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <span className="text-sm text-gray-500">No countries found</span>
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
          className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  )
}

export default PhoneInput
