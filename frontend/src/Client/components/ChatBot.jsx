import React, { useCallback, useEffect, useRef, useState } from 'react'
import { MessageCircle, X, Bot, User, Upload, Check, Lock } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { uploadResume } from '../../features/resume/resumeSlice'
import { extractUserInfo, formatPhoneNumber } from '../../utils/cvTextExtractor'

const ChatBot = ({ showBot, setShowBot, cvData, setCvData }) => {
  const { isAuthenticated } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [uploadedFile, setUploadedFile] = useState(null)
  const [resumeText, setResumeText] = useState('')
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const typingMessageId = useRef(null)
  const chatEndRef = useRef(null)

  const handleFiles = useCallback(async (files) => {
    const file = files?.[0]
    if (!file) return
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setMessages(ms => ([
        ...ms,
        { id: Date.now(), role: 'bot', text: 'Please upload a PDF or DOC file only.' }
      ]))
      return
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setMessages(ms => ([
        ...ms,
        { id: Date.now(), role: 'bot', text: 'File size must be less than 5MB.' }
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
        console.log('Could not extract text from file for analysis')
      }

      // Extract user information from CV text
      const userInfo = extractUserInfo(extractedText)
      const formattedPhone = formatPhoneNumber(userInfo.phone)
      
      // Upload to backend with user information using the new resume API
      const formData = new FormData()
      formData.append('resume', file)
      formData.append('name', userInfo.name || '')
      formData.append('email', userInfo.email || '')
      
      // Add contact information if available
      if (userInfo.phone) {
        formData.append('contact', JSON.stringify({
          number: userInfo.phone.replace(/\D/g, ''), // Remove non-digits
          country_code: formattedPhone.startsWith('+353') ? '+353' : 
                       formattedPhone.startsWith('+1') ? '+1' : 
                       formattedPhone.startsWith('+44') ? '+44' : '+353'
        }))
      }
      
      const result = await dispatch(uploadResume(formData)).unwrap()
      
      // Create success message with extracted info
      let successMessage = 'Resume uploaded successfully! Our team will review it and get back to you if there are any matching opportunities.'
      
      if (userInfo.name || userInfo.email || userInfo.phone) {
        successMessage += '\n\nI found the following information in your resume:'
        if (userInfo.name) successMessage += `\n• Name: ${userInfo.name}`
        if (userInfo.email) successMessage += `\n• Email: ${userInfo.email}`
        if (userInfo.phone) successMessage += `\n• Phone: ${formattedPhone}`
      }
      
      setMessages(ms => ([
        ...ms,
        { id: Date.now(), role: 'bot', text: successMessage }
      ]))
      
    } catch (error) {
      setMessages(ms => ([
        ...ms,
        { id: Date.now(), role: 'bot', text: `Upload failed: ${error.message || 'Please try again.'}` }
      ]))
    } finally {
      setIsUploading(false)
    }
  }, [dispatch, isAuthenticated])

  const onBrowse = useCallback((e) => {
    const files = e.target.files
    handleFiles(files)
  }, [handleFiles])

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
    
    // Update greeting message to reflect public upload
    const greeting = 'Hello! I\'m your Resume Assistant. Upload your resume and I\'ll help optimize it for better job opportunities!'
    const id = Date.now()
    typingMessageId.current = id
    
    // Show the message immediately with enhanced pop-up animation
    setMessages([{ id, role: 'bot', text: greeting, isNew: true }])
    
    // Remove the "isNew" flag after animation completes
    setTimeout(() => {
      setMessages(ms => ms.map(m => m.id === id ? { ...m, isNew: false } : m))
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
          className="fixed bottom-6 right-6 size-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-2xl grid place-items-center text-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 z-50 transform hover:scale-110 active:scale-95 animate-pulse hover:animate-none"
          aria-label="Open chat bot"
        >
          <MessageCircle size={20} className="transition-transform duration-200 hover:rotate-12" />
        </button>
      )}

      {/* Chat window - only visible when showBot is true */}
      {showBot && (
        <div className="fixed inset-0 z-20 flex items-end md:items-center justify-end mt-15">
        <div 
          className={`absolute cursor-pointer inset-0 bg-black/50 transition-opacity duration-300 ${
            isAnimating ? 'opacity-0' : 'opacity-100'
          }`} 
          onClick={handleCloseChat} 
        />
        <div className={`relative z-30 w-full max-w-xs sm:max-w-lg m-1 sm:m-4 rounded-3xl border border-gray-200 bg-white backdrop-blur-xl h-[85vh] flex flex-col shadow-2xl transition-all duration-300 transform ${
          isAnimating 
            ? 'translate-x-full opacity-0 scale-95' 
            : 'translate-x-0 opacity-100 scale-100'
        }`}>
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-3xl">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-lg">Resume Assistant</h4>
                <p className="text-xs text-gray-500">AI-powered resume optimization</p>
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
                  <div className="size-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot size={16} className="text-white" />
                  </div>
                )}
                <div className={`rounded-2xl px-4 py-3 max-w-[80%] ${m.role === 'bot' ? 'bg-white border border-gray-200 shadow-sm' : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'}`}>
                  <span className={m.role === 'bot' ? 'text-gray-800' : 'text-white'}>{m.text}</span>
                  {isTyping && m.id === typingMessageId.current && <span className={`inline-block w-2 h-4 ml-1 align-middle animate-pulse ${m.role === 'bot' ? 'bg-gray-400' : 'bg-white/70'}`} />}
                </div>
                {m.role === 'user' && (
                  <div className="size-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 mt-1">
                    <User size={16} className="text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="px-6 py-4 border-t border-gray-100 bg-white rounded-b-3xl">
            {/* Resume Upload Section */}
            <div className="mb-4">
              {!isAuthenticated ? (
                <div className="inline-flex items-center gap-3 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 px-4 py-3 w-full opacity-60">
                  <div className="size-10 rounded-full bg-gray-400 flex items-center justify-center">
                    <Lock size={20} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-gray-600 block truncate">
                      Login Required
                    </span>
                    <span className="text-xs text-gray-500">
                      Please login to upload your resume
                    </span>
                  </div>
                  <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded-full">Locked</span>
                </div>
              ) : (
                <label className="inline-flex cursor-pointer items-center gap-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed border-blue-200 px-4 py-3 hover:from-blue-100 hover:to-purple-100 hover:border-blue-300 transition-all duration-200 w-full group">
                  <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={onBrowse} />
                  <div className="size-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
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
              )}
              {isUploading && (
                <div className="mt-3 flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                  <div className="size-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  <span className="truncate">Uploading resume...</span>
                </div>
              )}
              {uploadedFile && !isUploading && (
                <div className="mt-3 flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                  <div className="size-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-white" />
                  </div>
                  <span className="truncate">Resume uploaded successfully! ({Math.round(uploadedFile.size / 1024)}KB)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      )}
    </>
  )
}

export default ChatBot