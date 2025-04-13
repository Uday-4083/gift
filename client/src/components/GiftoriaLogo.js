import React from 'react'

const GiftoriaLogo = ({ height = "35" }) => {
  return (
    <svg
      width={height * (350/80)} // maintain aspect ratio
      height={height}
      viewBox="0 0 350 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        {/* Gift box icon */}
        <rect x="0" y="20" width="60" height="60" rx="5" fill="#F5B7B1"/>
        <rect x="25" y="0" width="10" height="20" fill="#C4A484"/>
        <path d="M0 35 H60" stroke="#C4A484" strokeWidth="5"/>
        <path d="M30 20 V80" stroke="#C4A484" strokeWidth="5"/>
        
        {/* Text "giftoria" */}
        <text
          x="80"
          y="65"
          fontFamily="Playfair Display"
          fontSize="60"
          fill="#C4A484"
          fontWeight="600"
        >
          giftoria
        </text>
        
        {/* Sparkle */}
        <path
          d="M330 10 L335 15 L340 10 L335 5 Z"
          fill="#F5B7B1"
        />
      </g>
    </svg>
  )
}

export default GiftoriaLogo 