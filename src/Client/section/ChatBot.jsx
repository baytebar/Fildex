import React, { useCallback, useEffect, useRef, useState } from 'react'

const ChatBot = ({ showBot, setShowBot }) => {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [resumeText, setResumeText] = useState('')
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
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
    const greeting = 'Hi! I can analyze your resume and suggest improvements. Upload your resume to begin.'
    setIsTyping(true)
    const id = Date.now()
    typingMessageId.current = id
    setMessages([{ id, role: 'bot', text: '' }])
    let i = 0
    const interval = setInterval(() => {
      i += 1
      setMessages(ms => ms.map(m => m.id === id ? { ...m, text: greeting.slice(0, i) } : m))
      if (i >= greeting.length) {
        clearInterval(interval)
        setIsTyping(false)
      }
    }, 18)
    return () => clearInterval(interval)
  }, [showBot])

  if (!showBot) return null

  return (
    <>
      {/* Floating Chat Bot Button */}
      <button
        onClick={() => setShowBot(true)}
        className="fixed bottom-5 right-5 size-14 rounded-full bg-primary shadow-xl grid place-items-center text-2xl hover:bg-primary/90"
        aria-label="Open chat bot"
      >
        💬
      </button>

      {/* Chat Bot Modal */}
      <div className="fixed inset-0 z-20 flex items-end md:items-center justify-end">
        <div className="absolute inset-0 bg-black/50" onClick={() => setShowBot(false)} />
        {/* Updated modal to use theme variables */}
        <div className="relative z-30 w-full max-w-md m-4 rounded-2xl border border-border bg-card backdrop-blur-lg h-[80vh] flex flex-col shadow-xl">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <h4 className="font-semibold text-foreground">Resume Assistant</h4>
            </div>
            <button className="text-muted-foreground hover:text-foreground" onClick={() => setShowBot(false)}>✕</button>
          </div>
          <div className="flex-1 overflow-auto px-4 py-3 space-y-3 text-sm">
            {messages.map(m => (
              <div key={m.id} className={m.role === 'bot' ? 'flex items-start gap-2' : 'flex items-start gap-2 justify-end'}>
                {m.role === 'bot' && <span className="mt-0.5">🤖</span>}
                {/* Updated message bubbles to use theme variables */}
                <div className={`rounded-lg px-3 py-2 ${m.role === 'bot' ? 'bg-muted border border-border' : 'bg-accent border border-border'}`}>
                  <span className="text-foreground">{m.text}</span>
                  {isTyping && m.id === typingMessageId.current && <span className="inline-block w-2 h-4 bg-foreground/70 ml-1 align-middle animate-pulse" />}
                </div>
                {m.role === 'user' && <span className="mt-0.5">🧑</span>}
              </div>
            ))}
            {resumeText && (
              <div className="flex items-start gap-2">
                <span className="mt-0.5">📄</span>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-1">Uploaded preview</div>
                  {/* Updated preview text to use theme variables */}
                  <pre className="max-h-40 overflow-auto whitespace-pre-wrap text-xs text-foreground bg-card border border-border rounded p-2">{resumeText}</pre>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          {/* Updated input area to use theme variables */}
          <div className="px-4 py-3 border-t border-border bg-card">
            <div className="flex items-center gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-muted px-3 py-1.5 hover:bg-accent">
                <input type="file" accept=".txt,.md,.pdf" className="hidden" onChange={onBrowse} />
                <span className="text-foreground">Upload</span>
              </label>
              <input
                className="flex-1 rounded-md bg-card border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                placeholder="Ask for keyword coverage, bullet rewrites, or summary tips..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    const text = e.currentTarget.value.trim()
                    setMessages(ms => [...ms, { id: Date.now(), role: 'user', text }])
                    setTimeout(() => {
                      setMessages(ms => [...ms, { id: Date.now()+1, role: 'bot', text: 'Thanks! For demo, I analyze locally once a resume is uploaded.' }])
                    }, 400)
                    e.currentTarget.value = ''
                  }
                }}
              />
              <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 shadow-sm">Send</button>
            </div>
            {uploadedFile && (
              <div className="mt-2 text-xs text-muted-foreground">Selected: {uploadedFile.name}</div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ChatBot