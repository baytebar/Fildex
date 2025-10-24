import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Code, Database, Cloud, Cpu, Zap, CheckCircle } from 'lucide-react'

const Loader = ({ isLoading, onComplete, imageProgress = 0, imagesLoaded = false }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [minTimeElapsed, setMinTimeElapsed] = useState(false)
  const [startTime] = useState(Date.now())

  const steps = [
    { icon: Code, text: 'Initializing Development Environment', color: 'from-blue-500 to-purple-600' },
    { icon: Database, text: 'Connecting to Database', color: 'from-purple-500 to-pink-600' },
    { icon: Cloud, text: 'Loading Cloud Services', color: 'from-pink-500 to-red-600' },
    { icon: Cpu, text: 'Optimizing Performance', color: 'from-red-500 to-orange-600' },
    { icon: Zap, text: 'Loading Images & Assets', color: 'from-orange-500 to-yellow-600' },
    { icon: CheckCircle, text: 'Ready to Launch!', color: 'from-green-500 to-emerald-600' }
  ]

  useEffect(() => {
    if (!isLoading) return

    // Timer to ensure minimum 3 seconds display
    const minTimeTimer = setTimeout(() => {
      setMinTimeElapsed(true)
    }, 3000)

    // Update progress based on image loading
    const interval = setInterval(() => {
      setProgress(prev => {
        // Use image progress if available, otherwise use simulated progress
        const targetProgress = imagesLoaded ? 100 : Math.min(imageProgress, 90)
        
        if (prev >= targetProgress) {
          return targetProgress
        }
        return prev + 2
      })
    }, 50)

    // Update steps based on progress
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          return prev
        }
        return prev + 1
      })
    }, 600)

    return () => {
      clearInterval(interval)
      clearInterval(stepInterval)
      clearTimeout(minTimeTimer)
    }
  }, [isLoading, steps.length, imageProgress, imagesLoaded])

  // Check if both progress is complete and minimum time has elapsed
  useEffect(() => {
    // Only complete if:
    // 1. Progress is 100% AND
    // 2. Minimum 3 seconds have elapsed AND
    // 3. All images are loaded
    if (progress >= 100 && minTimeElapsed && isLoading && imagesLoaded) {
      const completionTimer = setTimeout(() => {
        onComplete?.()
      }, 500)
      
      return () => clearTimeout(completionTimer)
    }
  }, [progress, minTimeElapsed, isLoading, imagesLoaded, onComplete])

  if (!isLoading) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed top-0 left-0 right-0 bottom-0 w-full h-full z-9999 flex items-center justify-center"
        style={{
          background: "radial-gradient(125% 125% at 50% 90%, #fff 40%, #7c3aed 100%)",
          backgroundImage: `
            linear-gradient(to right, #f0f0f0 1px, transparent 1px),
            linear-gradient(to bottom, #f0f0f0 1px, transparent 1px),
            radial-gradient(circle 600px at 0% 200px, #d5c5ff, transparent),
            radial-gradient(circle 600px at 100% 200px, #d5c5ff, transparent)
          `,
          backgroundSize: "20px 20px, 20px 20px, 100% 100%, 100% 100%",
        }}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-purple-400/30 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        {/* Main loader content */}
        <div className="relative z-10 text-center">
          {/* Logo and branding */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <motion.div
                className="w-16 h-16 bg-linear-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Code className="w-8 h-8 text-white" />
              </motion.div>
              <div className="text-left">
                <h1 className="text-3xl font-bold text-gray-900">FILDEX</h1>
                <h2 className="text-lg font-semibold text-gray-700">SOLUTIONS</h2>
              </div>
            </div>
            <p className="text-gray-600 text-lg">Complete Digital Service Provider</p>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-80 h-2 bg-gray-200 rounded-full overflow-hidden mb-8 mx-auto"
          >
            <motion.div
              className="h-full bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </motion.div>

          {/* Current step indicator */}
          <motion.div
            key={currentStep}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <motion.div
              className={`w-12 h-12 rounded-full bg-linear-to-r ${steps[currentStep]?.color} flex items-center justify-center shadow-lg`}
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 360]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {steps[currentStep] && (() => {
                const IconComponent = steps[currentStep].icon
                return <IconComponent className="w-6 h-6 text-white" />
              })()}
            </motion.div>
            <div className="text-left">
              <p className="text-gray-800 font-semibold text-lg">
                {steps[currentStep]?.text}
              </p>
              <p className="text-gray-600 text-sm">
                {imagesLoaded ? '100% Complete' : `${Math.round(progress)}% Complete`}
                {!imagesLoaded && imageProgress > 0 && (
                  <span className="ml-2 text-blue-600">
                    (Images: {Math.round(imageProgress)}%)
                  </span>
                )}
              </p>
            </div>
          </motion.div>

          {/* Animated dots */}
          <motion.div
            className="flex justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-purple-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </motion.div>

          {/* Loading text with typewriter effect */}
          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.p
              className="text-gray-600 text-sm"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {imagesLoaded && minTimeElapsed 
                ? 'Ready to launch!' 
                : imagesLoaded 
                  ? 'Waiting for minimum time...' 
                  : 'Loading images and assets...'
              }
            </motion.p>
          </motion.div>
        </div>

        {/* Floating elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/40 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 20,
                opacity: 0
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: -20,
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default Loader
