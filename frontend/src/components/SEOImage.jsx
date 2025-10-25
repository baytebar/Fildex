import React from 'react'

const SEOImage = ({ 
  src, 
  alt, 
  title, 
  width, 
  height, 
  className = "",
  loading = "lazy",
  ...props 
}) => {
  return (
    <img
      src={src}
      alt={alt}
      title={title || alt}
      width={width}
      height={height}
      className={className}
      loading={loading}
      {...props}
    />
  )
}

export default SEOImage
