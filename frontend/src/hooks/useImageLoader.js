import { useState, useEffect } from 'react'

const useImageLoader = (imagePaths) => {
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [loadedCount, setLoadedCount] = useState(0)
  const [totalImages, setTotalImages] = useState(0)

  useEffect(() => {
    if (!imagePaths || imagePaths.length === 0) {
      setImagesLoaded(true)
      return
    }

    setTotalImages(imagePaths.length)
    setLoadedCount(0)
    setImagesLoaded(false)

    let loadedImages = 0
    const imagePromises = imagePaths.map((imagePath) => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        
        img.onload = () => {
          loadedImages++
          setLoadedCount(loadedImages)
          resolve(imagePath)
        }
        
        img.onerror = () => {
          loadedImages++
          setLoadedCount(loadedImages)
          console.warn(`Failed to load image: ${imagePath}`)
          resolve(imagePath) // Still resolve to continue loading
        }
        
        img.src = imagePath
      })
    })

    Promise.all(imagePromises).then(() => {
      setImagesLoaded(true)
    })
  }, [imagePaths])

  return {
    imagesLoaded,
    loadedCount,
    totalImages,
    progress: totalImages > 0 ? (loadedCount / totalImages) * 100 : 0
  }
}

export default useImageLoader
