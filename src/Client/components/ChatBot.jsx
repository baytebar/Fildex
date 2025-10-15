import React, { useCallback, useEffect, useRef, useState } from 'react'
import { MessageCircle, X, Bot, User, Upload, Check } from 'lucide-react'

const ChatBot = ({ showBot, setShowBot, isLoggedIn, cvData, setCvData }) => {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [resumeText, setResumeText] = useState('')
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const typingMessageId = useRef(null)
  const chatEndRef = useRef(null)

  const handleFiles = useCallback(async (files) => {
    const file = files?.[0]
    if (!file) return
    setUploadedFile(file)
    const text = await file.text()
    setResumeText(text)
    setMessages(ms => ([
      ...ms,
      { id: Date.now(), role: 'bot', text: 'Resume received. Generating insights (demo, local only)...' }
    ]))
  }, [])

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

  const handleSendMessage = useCallback((messageText) => {
    if (!isLoggedIn) {
      // Show login prompt message
      setMessages(ms => [...ms, { 
        id: Date.now(), 
        role: 'bot', 
        text: 'Please login to submit your resume to our talent pool. Click the login button in the header to get started!' 
      }])
      return
    }

    if (uploadedFile && resumeText) {
      // User is logged in and has uploaded a resume - submit to admin
      const userEmail = localStorage.getItem('userEmail') || 'user@example.com'
      const newCvEntry = {
        id: Date.now(),
        name: userEmail.split('@')[0], // Use email prefix as name
        email: userEmail,
        phone: 'Not provided',
        role: 'general',
        uploadedDate: new Date().toISOString().split('T')[0],
        status: 'new',
        retentionDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
        userRole: null,
        location: 'Not specified',
        experience: 'See resume for details',
        skills: keywordStats.map(k => k.keyword),
        education: 'See resume for details',
        summary: resumeText.substring(0, 200) + '...',
        resumeContent: resumeText,
        message: messageText
      }

      setCvData(prev => [...prev, newCvEntry])
      
      setMessages(ms => [...ms, { 
        id: Date.now(), 
        role: 'bot', 
        text: 'Thank you! Your resume has been successfully submitted to our talent pool. Our team will review it and get back to you if there are any matching opportunities.' 
      }])
    } else {
      // User is logged in but hasn't uploaded a resume
      setMessages(ms => [...ms, { 
        id: Date.now(), 
        role: 'bot', 
        text: 'Please upload your resume first before sending a message. Use the upload section above to add your resume file.' 
      }])
    }
  }, [isLoggedIn, uploadedFile, resumeText, keywordStats, setCvData])

  const suggestions = React.useMemo(() => {
    if (!resumeText) return []
    const ideas = []
    if (!/summary|objective/i.test(resumeText)) ideas.push('Add a concise 2-3 sentence Professional Summary at the top.')
    if (resumeText.length < 1200) ideas.push('Expand impact with quantified results (numbers, % improvement, scale).')
    if (!/experience/i.test(resumeText)) ideas.push('Include a Work Experience section with role, company, dates, and achievements.')
    if (!/skills/i.test(resumeText)) ideas.push('Add a Skills section grouped by category (Languages, Frameworks, Tools).')
    if (!/education/i.test(resumeText)) ideas.push('Include Education with degree, institution, and graduation year.')
    if (keywordStats.length < 5) ideas.push('Incorporate more role-relevant keywords naturally to pass ATS scans.')
    return ideas
  }, [resumeText, keywordStats])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, showBot])

  useEffect(() => {
    if (!showBot) return
    
    // Initialize animation state when opening
    setIsAnimating(true)
    
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
              <label className="inline-flex cursor-pointer items-center gap-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed border-blue-200 px-4 py-3 hover:from-blue-100 hover:to-purple-100 hover:border-blue-300 transition-all duration-200 w-full group">
                <input type="file" accept=".txt,.md,.pdf,.doc,.docx" className="hidden" onChange={onBrowse} />
                <div className="size-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-gray-800 block truncate">
                    {uploadedFile ? uploadedFile.name : 'Upload Resume'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {uploadedFile ? 'Click to change file' : 'Supports .txt, .md, .pdf, .doc, .docx'}
                  </span>
                </div>
                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Choose</span>
              </label>
              {uploadedFile && (
                <div className="mt-3 flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                  <div className="size-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-white" />
                  </div>
                  <span className="truncate">Resume uploaded successfully! ({Math.round(uploadedFile.size / 1024)}KB)</span>
                </div>
              )}
            </div>
            
            {/* Chat Input Section */}
            <div className="flex items-center gap-3">
              <input
                className="flex-1 rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 transition-all duration-200"
                placeholder="Ask for keyword coverage, bullet rewrites, or summary tips..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    const text = e.currentTarget.value.trim()
                    setMessages(ms => [...ms, { id: Date.now(), role: 'user', text }])
                    handleSendMessage(text)
                    e.currentTarget.value = ''
                  }
                }}
              />
              <button 
                onClick={(e) => {
                  const input = e.target.parentElement.querySelector('input')
                  if (input && input.value.trim()) {
                    const text = input.value.trim()
                    setMessages(ms => [...ms, { id: Date.now(), role: 'user', text }])
                    handleSendMessage(text)
                    input.value = ''
                  }
                }}
                className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white hover:from-blue-600 hover:to-purple-700 shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
      )}
    </>
  )
}

export default ChatBot