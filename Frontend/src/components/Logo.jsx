import React, { useId } from 'react'

const Logo = ({ size = 32, className = '' }) => {
  const uid = useId()
  const bgId = `deepocean-bg-${uid}`
  const waveId = `deepocean-wave-${uid}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      role="img"
      aria-label="DeepOcean logo"
      className={className}
    >
      <defs>
        <linearGradient id={bgId} x1="24" y1="1" x2="24" y2="47" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#67E8DA" />
          <stop offset="45%" stopColor="#1FA9C9" />
          <stop offset="100%" stopColor="#0A1F5C" />
        </linearGradient>
        <linearGradient id={waveId} x1="6" y1="0" x2="42" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      <circle cx="24" cy="24" r="23" fill={`url(#${bgId})`} />
      <circle cx="24" cy="24" r="23" stroke="#FFFFFF" strokeOpacity="0.12" />

      <circle cx="24" cy="13.5" r="4.2" fill="#FFFFFF" fillOpacity="0.9" />

      <path
        d="M5 21.5c4-4 8-4 12 0s8 4 12 0s8-4 12 0"
        stroke={`url(#${waveId})`}
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M5 28.5c4-4 8-4 12 0s8 4 12 0s8-4 12 0"
        stroke="#FFFFFF"
        strokeOpacity="0.85"
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M5 35.5c4-4 8-4 12 0s8 4 12 0s8-4 12 0"
        stroke="#FFFFFF"
        strokeOpacity="0.5"
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default Logo
