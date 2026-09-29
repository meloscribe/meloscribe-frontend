import React from 'react';

interface MeloThumbProps {
  className?: string;
  active?: boolean;
}

export const MeloThumbUp: React.FC<MeloThumbProps> = ({ 
  className = "w-5 h-5", 
  active = false 
}) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-all duration-300`}
      style={{
        filter: active ? 'drop-shadow(0 0 10px rgba(0, 245, 255, 0.85))' : 'none'
      }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="meloThumbCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f5ff" />
          <stop offset="100%" stopColor="#0072ff" />
        </linearGradient>
      </defs>
      
      {/* Synthwave segmented wrist cuff */}
      <rect 
        x="2" y="10" width="3.5" height="11" rx="1.2" 
        fill={active ? "url(#meloThumbCyanGrad)" : "currentColor"} 
        fillOpacity={active ? "0.35" : "0.12"}
        stroke={active ? "#00f5ff" : "currentColor"} 
        strokeWidth="1.6" 
      />
      <line x1="3.2" y1="13.2" x2="4.3" y2="13.2" stroke={active ? "#00f5ff" : "currentColor"} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="3.2" y1="16" x2="4.3" y2="16" stroke={active ? "#00f5ff" : "currentColor"} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="3.2" y1="18.8" x2="4.3" y2="18.8" stroke={active ? "#00f5ff" : "currentColor"} strokeWidth="1.2" strokeLinecap="round" />
      
      {/* Cyber Hand Silhouette */}
      <path
        d="M7 11V21H16.8C17.7 21 18.5 20.4 18.8 19.5L20.8 13.5C21.2 12.2 20.2 11 18.8 11H14.8L15.6 6.5C15.8 5.1 14.9 3.8 13.5 3.6C12.5 3.4 11.6 4 11.2 4.9L7 11Z"
        fill={active ? "url(#meloThumbCyanGrad)" : "currentColor"}
        fillOpacity={active ? "0.9" : "0.08"}
        stroke={active ? "#00f5ff" : "currentColor"}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Circuit Knuckle Accents */}
      <path 
        d="M10.5 12L11.5 17" 
        stroke={active ? "#ffffff" : "currentColor"} 
        strokeWidth="1.3" 
        strokeLinecap="round" 
        strokeOpacity={active ? "0.85" : "0.3"} 
      />
      <path 
        d="M13.5 12L14.5 17" 
        stroke={active ? "#ffffff" : "currentColor"} 
        strokeWidth="1.3" 
        strokeLinecap="round" 
        strokeOpacity={active ? "0.85" : "0.3"} 
      />
      
      {/* Thumb Energy Core */}
      {active && (
        <circle cx="14.5" cy="4.8" r="1.4" fill="#ffffff" filter="drop-shadow(0 0 3px #00f5ff)" />
      )}
    </svg>
  );
};

export const MeloThumbDown: React.FC<MeloThumbProps> = ({ 
  className = "w-5 h-5", 
  active = false 
}) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-all duration-300`}
      style={{
        filter: active ? 'drop-shadow(0 0 10px rgba(255, 0, 127, 0.85))' : 'none',
        transform: 'rotate(180deg)'
      }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="meloThumbPinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff007f" />
          <stop offset="100%" stopColor="#9900ff" />
        </linearGradient>
      </defs>
      
      {/* Synthwave segmented wrist cuff */}
      <rect 
        x="2" y="10" width="3.5" height="11" rx="1.2" 
        fill={active ? "url(#meloThumbPinkGrad)" : "currentColor"} 
        fillOpacity={active ? "0.35" : "0.12"}
        stroke={active ? "#ff007f" : "currentColor"} 
        strokeWidth="1.6" 
      />
      <line x1="3.2" y1="13.2" x2="4.3" y2="13.2" stroke={active ? "#ff007f" : "currentColor"} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="3.2" y1="16" x2="4.3" y2="16" stroke={active ? "#ff007f" : "currentColor"} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="3.2" y1="18.8" x2="4.3" y2="18.8" stroke={active ? "#ff007f" : "currentColor"} strokeWidth="1.2" strokeLinecap="round" />
      
      {/* Cyber Hand Silhouette */}
      <path
        d="M7 11V21H16.8C17.7 21 18.5 20.4 18.8 19.5L20.8 13.5C21.2 12.2 20.2 11 18.8 11H14.8L15.6 6.5C15.8 5.1 14.9 3.8 13.5 3.6C12.5 3.4 11.6 4 11.2 4.9L7 11Z"
        fill={active ? "url(#meloThumbPinkGrad)" : "currentColor"}
        fillOpacity={active ? "0.9" : "0.08"}
        stroke={active ? "#ff007f" : "currentColor"}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Circuit Knuckle Accents */}
      <path 
        d="M10.5 12L11.5 17" 
        stroke={active ? "#ffffff" : "currentColor"} 
        strokeWidth="1.3" 
        strokeLinecap="round" 
        strokeOpacity={active ? "0.85" : "0.3"} 
      />
      <path 
        d="M13.5 12L14.5 17" 
        stroke={active ? "#ffffff" : "currentColor"} 
        strokeWidth="1.3" 
        strokeLinecap="round" 
        strokeOpacity={active ? "0.85" : "0.3"} 
      />
      
      {/* Thumb Energy Core */}
      {active && (
        <circle cx="14.5" cy="4.8" r="1.4" fill="#ffffff" filter="drop-shadow(0 0 3px #ff007f)" />
      )}
    </svg>
  );
};
