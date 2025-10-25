import React, { useCallback, useEffect, useRef, useState } from 'react'
import { MessageCircle, X, Bot, User, Upload, Check, Send } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { uploadResume } from '../../features/resume/resumeSlice'
import { extractUserInfo } from '../../utils/cvTextExtractor'

const ChatBot = ({ showBot, setShowBot, cvData, setCvData }) => {
  const dispatch = useDispatch()
  const [uploadedFile, setUploadedFile] = useState(null)
  const [resumeText, setResumeText] = useState('')
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [selectedJobTitle, setSelectedJobTitle] = useState('')
  const [currentStep, setCurrentStep] = useState('greeting') // greeting, name, email, jobTitle, resume
  const [inputValue, setInputValue] = useState('')
  const [jobTitles, setJobTitles] = useState([])
  const typingMessageId = useRef(null)
  const chatEndRef = useRef(null)

  // Fetch job titles on component mount
  useEffect(() => {
    const fetchJobTitles = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
          (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
            ? 'http://localhost:5000/api/v1' 
            : 'http://46.62.206.205:5000/api/v1')
        const response = await fetch(`${API_BASE_URL}/public/job-titles`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const text = await response.text()
        if (!text) {
          setJobTitles([])
          return
        }
        
        const data = JSON.parse(text)
        if (data.data && Array.isArray(data.data)) {
          const activeJobTitles = data.data.filter(jobTitle => jobTitle.isDeleted !== true)
          setJobTitles(activeJobTitles)
        } else if (Array.isArray(data)) {
          const activeJobTitles = data.filter(jobTitle => jobTitle.isDeleted !== true)
          setJobTitles(activeJobTitles)
        } else {
          setJobTitles([])
        }
      } catch (error) {
        console.error('Error fetching job titles:', error)
        setJobTitles([])
      }
    }

    fetchJobTitles()
  }, [])

  const handleFiles = useCallback(async (files) => {
    const file = files?.[0]
    if (!file) return
    
    // Validate file type with more comprehensive check
    const allowedTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      setMessages(ms => ([
        ...ms,
        { id: Date.now(), role: 'bot', text: 'Please upload a PDF, DOC, or DOCX file only. Other file types are not supported.' }
      ]))
      return
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setMessages(ms => ([
        ...ms,
        { id: Date.now(), role: 'bot', text: `File size (${fileSizeMB}MB) exceeds the 5MB limit. Please upload a smaller file.` }
      ]))
      return
    }
    
    // Validate minimum file size (at least 1KB)
    const minSize = 1024; // 1KB
    if (file.size < minSize) {
      setMessages(ms => ([
        ...ms,
        { id: Date.now(), role: 'bot', text: 'File appears to be empty or too small. Please upload a valid resume file.' }
      ]))
      return
    }
    
    // Validate file name
    if (file.name.length > 255) {
      setMessages(ms => ([
        ...ms,
        { id: Date.now(), role: 'bot', text: 'File name is too long. Please rename your file and try again.' }
      ]))
      return
    }
    
    // Check for suspicious file names
    const suspiciousPatterns = /[<>:"/\\|?*]/;
    if (suspiciousPatterns.test(file.name)) {
      setMessages(ms => ([
        ...ms,
        { id: Date.now(), role: 'bot', text: 'File name contains invalid characters. Please rename your file and try again.' }
      ]))
      return
    }

    setUploadedFile(file)
    setIsUploading(true)
    
    
    try {
      // Extract text from file for analysis
      let extractedText = ''
      try {
        extractedText = await file.text()
        setResumeText(extractedText)
      } catch (textError) {
      }

      // Extract user information from CV text
      const userInfo = extractUserInfo(extractedText)
      
      // Upload to backend with user information using the same structure as careers page
      const formData = new FormData()
      formData.append('resume', file)
      formData.append('name', userName || userInfo.name || '')
      formData.append('email', userEmail || userInfo.email || '')
      
      // Use selectedJobTitle as the role
      const roleValue = selectedJobTitle || userInfo.role || ''
      formData.append('role', roleValue)
      
      
      const result = await dispatch(uploadResume(formData)).unwrap()
      
      // Create short success message
      const successMessage = `Thank you for submitting your CV. We will contact you shortly.`
      
      setMessages(ms => ([
        ...ms,
        { id: Date.now(), role: 'bot', text: successMessage }
      ]))
      
      // Show success toast notification
      toast.success('Resume uploaded successfully!', {
        description: 'Our team will review your resume and get back to you soon.',
        duration: 5000,
      })
      
      // Reset the flow
      setCurrentStep('greeting')
      setUserName('')
      setUserEmail('')
      setSelectedJobTitle('')
      setUploadedFile(null)
      
      // Close the chatbot after 3 seconds
      setTimeout(() => {
        handleCloseChat()
      }, 3000) // Wait 3 seconds to let user see the success message
      
    } catch (error) {
      setMessages(ms => ([
        ...ms,
        { id: Date.now(), role: 'bot', text: `Upload failed: ${error.message || 'Please try again.'}` }
      ]))
      
      // Show error toast notification
      toast.error('Upload failed', {
        description: error.message || 'Please try again.',
        duration: 5000,
      })
    } finally {
      setIsUploading(false)
    }
  }, [dispatch, userName, userEmail, selectedJobTitle])

  const onBrowse = useCallback((e) => {
    const files = e.target.files
    handleFiles(files)
  }, [handleFiles])

  const handleUserInput = useCallback(() => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage = { id: Date.now(), role: 'user', text: inputValue }
    setMessages(ms => [...ms, userMessage])
    
    const trimmedInput = inputValue.trim()
    setInputValue('')

    // Handle conversation flow
    if (currentStep === 'name') {
      // Enhanced name validation
      if (trimmedInput.length < 2) {
        setTimeout(() => {
          setMessages(ms => [...ms, { 
            id: Date.now() + 1, 
            role: 'bot', 
            text: 'Please enter a valid name (at least 2 characters).' 
          }])
        }, 500)
        return
      }
      
      if (trimmedInput.length > 50) {
        setTimeout(() => {
          setMessages(ms => [...ms, { 
            id: Date.now() + 1, 
            role: 'bot', 
            text: 'Name is too long. Please enter a name with less than 50 characters.' 
          }])
        }, 500)
        return
      }
      
      // Check for valid characters (letters, spaces, hyphens, apostrophes)
      const nameRegex = /^[a-zA-Z\s\-']+$/
      if (!nameRegex.test(trimmedInput)) {
        setTimeout(() => {
          setMessages(ms => [...ms, { 
            id: Date.now() + 1, 
            role: 'bot', 
            text: 'Please enter a valid name (only letters, spaces, hyphens, and apostrophes are allowed).' 
          }])
        }, 500)
        return
      }
      
      setUserName(trimmedInput)
      setCurrentStep('email')
      setTimeout(() => {
        setMessages(ms => [...ms, { 
          id: Date.now() + 1, 
          role: 'bot', 
          text: `Nice to meet you, ${trimmedInput}! What's your email address?` 
        }])
      }, 500)
    } else if (currentStep === 'email') {
      // Enhanced email validation
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!emailRegex.test(trimmedInput)) {
        setTimeout(() => {
          setMessages(ms => [...ms, { 
            id: Date.now() + 1, 
            role: 'bot', 
            text: 'Please enter a valid email address (e.g., john@example.com).' 
          }])
        }, 500)
        return
      }
      
      // Check email length
      if (trimmedInput.length > 254) {
        setTimeout(() => {
          setMessages(ms => [...ms, { 
            id: Date.now() + 1, 
            role: 'bot', 
            text: 'Email address is too long. Please enter a shorter email.' 
          }])
        }, 500)
        return
      }
      
      setUserEmail(trimmedInput)
      setCurrentStep('jobTitle')
      setTimeout(() => {
        setMessages(ms => [...ms, { 
          id: Date.now() + 1, 
          role: 'bot', 
          text: 'Great! What job title are you interested in? Please select from the available positions.' 
        }])
      }, 500)
    }
  }, [inputValue, currentStep])

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleUserInput()
    }
  }, [handleUserInput])


  const keywordStats = React.useMemo(() => {
    if (!resumeText) return []
    const text = resumeText.toLowerCase()
    const keywords = ['javascript','react','node','python','java','typescript','sql','aws','docker','kubernetes','graphql','tailwind','vite']
    return keywords.map(k => ({ keyword: k, count: (text.match(new RegExp(`\\b${k}\\b`, 'g')) || []).length }))
      .filter(k => k.count > 0)
      .sort((a,b) => b.count - a.count)
  }, [resumeText])

  const handleOpenChat = useCallback(() => {
    setShowBot(true)
    // Small delay to ensure DOM is ready for animation
    setTimeout(() => setIsAnimating(false), 50)
  }, [setShowBot])

  const handleCloseChat = useCallback(() => {
    setIsAnimating(true)
    // Start closing animation
    setTimeout(() => {
      setShowBot(false)
      setIsAnimating(false)
    }, 300)
  }, [setShowBot])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, showBot])

  useEffect(() => {
    if (!showBot) return
    
    // Initialize animation state when opening
    setIsAnimating(true)
    
    // Reset conversation state
    setCurrentStep('greeting')
    setUserName('')
    setUserEmail('')
    setSelectedJobTitle('')
    setUploadedFile(null)
    setInputValue('')
    
    // Update greeting message to start conversation
    const greeting = 'Hello! I\'m your Resume Assistant. What\'s your name?'
    const id = Date.now()
    typingMessageId.current = id
    
    // Show the message immediately with enhanced pop-up animation
    setMessages([{ id, role: 'bot', text: greeting, isNew: true }])
    
    // Remove the "isNew" flag after animation completes
    setTimeout(() => {
      setMessages(ms => ms.map(m => m.id === id ? { ...m, isNew: false } : m))
      setCurrentStep('name')
    }, 400)
    
    return () => {
      setIsTyping(false)
    }
  }, [showBot])

  return (
    <>
      {/* Toggle button - only visible when menu is closed */}
      {!showBot && (
        <button
          onClick={handleOpenChat}
          className="fixed bottom-6 right-6 size-16 rounded-full bg-linear-to-r from-blue-500 to-purple-600 shadow-2xl grid place-items-center text-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 z-40 transform hover:scale-110 active:scale-95 animate-pulse hover:animate-none"
          aria-label="Open chat bot"
        >
          <MessageCircle size={20} className="transition-transform duration-200 hover:rotate-12" />
        </button>
      )}

      {/* Chat window - only visible when showBot is true */}
      {showBot && (
        <div className="fixed inset-0 z-40 flex items-end md:items-center justify-end mt-15">
        <div 
          className={`absolute cursor-pointer inset-0 bg-black/50 transition-opacity duration-300 ${
            isAnimating ? 'opacity-0' : 'opacity-100'
          }`} 
          onClick={handleCloseChat} 
        />
        <div className={`relative z-60 w-full max-w-xs sm:max-w-lg m-1 sm:m-4 rounded-3xl border border-gray-200 bg-white backdrop-blur-xl h-[85vh] flex flex-col shadow-2xl transition-all duration-300 transform ${
          isAnimating 
            ? 'translate-x-full opacity-0 scale-95' 
            : 'translate-x-0 opacity-100 scale-100'
        }`}>
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-linear-to-r from-blue-50 to-purple-50 rounded-t-3xl">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-linear-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-lg">Resume Assistant</h4>
                <p className="text-xs text-gray-500">Upload your resume for job opportunities</p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600 transition-all duration-200 p-2 hover:bg-gray-100 rounded-full hover:scale-110 active:scale-95" onClick={handleCloseChat}>
              <X className='cursor-pointer transition-transform duration-200 hover:rotate-90' size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-auto px-6 pt-0 pb-4 space-y-4 text-sm bg-gray-50">
            {messages.map(m => (
              <div 
                key={m.id} 
                className={`${m.role === 'bot' ? 'flex items-start gap-3' : 'flex items-start gap-3 justify-end'} ${
                  m.isNew ? 'animate-in fade-in duration-300' : ''
                }`}
              >
                {m.role === 'bot' && (
                  <div className="size-8 rounded-full bg-linear-to-r from-blue-500 to-purple-600 flex items-center justify-center shrink-0 mt-1">
                    <Bot size={16} className="text-white" />
                  </div>
                )}
                <div className={`rounded-2xl px-4 py-3 max-w-[80%] ${m.role === 'bot' ? 'bg-white border border-gray-200 shadow-sm' : 'bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-md'}`}>
                  <span className={m.role === 'bot' ? 'text-gray-800' : 'text-white'}>{m.text}</span>
                  {isTyping && m.id === typingMessageId.current && <span className={`inline-block w-2 h-4 ml-1 align-middle animate-pulse ${m.role === 'bot' ? 'bg-gray-400' : 'bg-white/70'}`} />}
                </div>
                {m.role === 'user' && (
                  <div className="size-8 rounded-full bg-gray-300 flex items-center justify-center shrink-0 mt-1">
                    <User size={16} className="text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="px-6 py-4 border-t border-gray-100 bg-white rounded-b-3xl">
            {/* Input Section */}
            {currentStep === 'name' || currentStep === 'email' ? (
              <div className="flex gap-2">
                <input
                  type={currentStep === 'email' ? 'email' : 'text'}
                  value={inputValue}
                  onChange={(e) => {
                    // Sanitize input to prevent XSS
                    const sanitizedValue = e.target.value.replace(/[<>]/g, '');
                    setInputValue(sanitizedValue);
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder={currentStep === 'name' ? 'Enter your name...' : 'Enter your email...'}
                  maxLength={currentStep === 'name' ? 50 : 254}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleUserInput}
                  disabled={!inputValue.trim()}
                  className="px-4 py-3 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                >
                  <Send size={16} />
                </button>
              </div>
            ) : currentStep === 'jobTitle' ? (
              <div className="space-y-3">
                <select
                  value={selectedJobTitle}
                  onChange={(e) => {
                    const selectedValue = e.target.value
                    setSelectedJobTitle(selectedValue)
                    
                    // Auto-proceed when job title is selected
                    if (selectedValue) {
                      setTimeout(() => {
                        setCurrentStep('resume')
                        setMessages(ms => [...ms, { 
                          id: Date.now() + 1, 
                          role: 'bot', 
                          text: `Perfect! You've selected "${selectedValue}". Now please upload your resume so I can help you with job opportunities.` 
                        }])
                      }, 500)
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a job title...</option>
                  {jobTitles.length > 0 ? (
                    jobTitles.map((jobTitle) => (
                      <option key={jobTitle._id} value={jobTitle.name}>
                        {jobTitle.name}
                      </option>
                    ))
                  ) : (
                    // Fallback options if API fails
                    <>
                      <option value="Cloud Engineer">Cloud Engineer</option>
                      <option value="DevOps Engineer">DevOps Engineer</option>
                      <option value="AI/ML Developer">AI/ML Developer</option>
                      <option value="Network Engineer">Network Engineer</option>
                      <option value="Business Analyst">Business Analyst</option>
                      <option value="Project Manager">Project Manager</option>
                      <option value="Software Developer">Software Developer</option>
                      <option value="Internship Program">Internship Program</option>
                    </>
                  )}
                </select>
              </div>
            ) : currentStep === 'resume' ? (
              <div className="space-y-4">
                <label className="inline-flex cursor-pointer items-center gap-3 rounded-xl bg-linear-to-r from-blue-50 to-purple-50 border-2 border-dashed border-blue-200 px-4 py-3 hover:from-blue-100 hover:to-purple-100 hover:border-blue-300 transition-all duration-200 w-full group">
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                    className="hidden" 
                    onChange={onBrowse}
                    multiple={false}
                  />
                  <div className="size-10 rounded-full bg-linear-to-r from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload size={20} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-gray-800 block truncate">
                      {uploadedFile ? uploadedFile.name : 'Upload Resume'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {uploadedFile ? 'Click to change file' : 'Supports .pdf, .doc, .docx'}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Choose</span>
                </label>
                {isUploading && (
                  <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                    <div className="size-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin shrink-0" />
                    <span className="truncate">Uploading resume...</span>
                  </div>
                )}
                {uploadedFile && !isUploading && (
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                    <div className="size-5 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                      <Check size={12} className="text-white" />
                    </div>
                    <span className="truncate">Resume uploaded successfully! ({Math.round(uploadedFile.size / 1024)}KB)</span>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      )}
    </>
  )
}

export default ChatBot
