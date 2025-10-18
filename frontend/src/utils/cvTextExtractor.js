// Utility functions to extract user information from CV text
export const extractUserInfo = (text) => {
  if (!text || typeof text !== 'string') {
    return {
      name: '',
      email: '',
      phone: ''
    }
  }

  // Extract email
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  const emails = text.match(emailRegex) || []
  const email = emails[0] || ''

  // Extract phone number (various formats)
  const phoneRegex = /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})|(?:\+?353[-.\s]?)?\(?([0-9]{2,3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})|(?:\+?44[-.\s]?)?\(?([0-9]{2,4})\)?[-.\s]?([0-9]{3,4})[-.\s]?([0-9]{4})/g
  const phones = text.match(phoneRegex) || []
  const phone = phones[0] || ''

  // Extract name (look for common patterns)
  let name = ''
  
  // Try to find name at the beginning of the document
  const lines = text.split('\n').filter(line => line.trim().length > 0)
  
  // Look for the first line that looks like a name (starts with capital, 2-4 words, no numbers)
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim()
    const words = line.split(/\s+/)
    
    // Check if line looks like a name (2-4 words, all start with capital, no numbers)
    if (words.length >= 2 && words.length <= 4) {
      const isName = words.every(word => 
        /^[A-Z][a-z]+$/.test(word) && 
        !/\d/.test(word) &&
        !word.toLowerCase().includes('email') &&
        !word.toLowerCase().includes('phone') &&
        !word.toLowerCase().includes('address') &&
        !word.toLowerCase().includes('resume') &&
        !word.toLowerCase().includes('cv')
      )
      
      if (isName) {
        name = line
        break
      }
    }
  }

  // If no name found, try to extract from email
  if (!name && email) {
    const emailName = email.split('@')[0]
    // Convert email name to proper case
    name = emailName.split(/[._-]/).map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ')
  }

  return {
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim()
  }
}

// Function to clean and format extracted phone number
export const formatPhoneNumber = (phone) => {
  if (!phone) return ''
  
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '')
  
  // If it starts with +, keep it
  if (cleaned.startsWith('+')) {
    return cleaned
  }
  
  // If it's 10 digits, assume US format
  if (cleaned.length === 10) {
    return `+1${cleaned}`
  }
  
  // If it's 11 digits and starts with 1, assume US format
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`
  }
  
  // If it's 12 digits and starts with 353, assume Irish format
  if (cleaned.length === 12 && cleaned.startsWith('353')) {
    return `+${cleaned}`
  }
  
  // If it's 9 digits and starts with 353, assume Irish format
  if (cleaned.length === 9 && cleaned.startsWith('353')) {
    return `+353${cleaned}`
  }
  
  // Return as is if we can't determine format
  return phone
}
