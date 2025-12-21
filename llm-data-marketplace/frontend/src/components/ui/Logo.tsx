import React from 'react'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Custom SVG Logo */}
      <svg
        className={sizeClasses[size]}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer circle representing blockchain/network */}
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="#F0B90B"
          stroke="#1f2937"
          strokeWidth="2"
        />

        {/* Inner data visualization elements */}
        <rect x="12" y="14" width="16" height="2" fill="#1f2937" />
        <rect x="12" y="18" width="12" height="2" fill="#1f2937" />
        <rect x="12" y="22" width="8" height="2" fill="#1f2937" />

        {/* Central data point */}
        <circle cx="20" cy="20" r="3" fill="#1f2937" />

        {/* Connecting lines representing data flow */}
        <line x1="20" y1="8" x2="20" y2="12" stroke="#1f2937" strokeWidth="1" />
        <line x1="32" y1="20" x2="28" y2="20" stroke="#1f2937" strokeWidth="1" />
        <line x1="20" y1="32" x2="20" y2="28" stroke="#1f2937" strokeWidth="1" />
        <line x1="8" y1="20" x2="12" y2="20" stroke="#1f2937" strokeWidth="1" />
      </svg>

      {/* Platform Name */}
      <div className="flex flex-col">
        <span className={`${textSizeClasses[size]} font-bold text-white leading-tight`}>
          UNIDATA
        </span>
        <span className="text-xs text-gray-400 leading-tight">
          Data Marketplace
        </span>
      </div>
    </div>
  )
}