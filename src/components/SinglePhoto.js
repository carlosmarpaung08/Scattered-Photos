import React, { useState, useRef, useEffect } from 'react';

const SinglePhoto = ({ photo, onClick, style }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const photoRef = useRef(null);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setIsError(true);
    setIsLoaded(true);
  };

  const handleClick = () => {
    if (isLoaded && !isError) {
      onClick(photo);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  const handleMouseMove = (e) => {
    if (!photoRef.current) return;
    
    const rect = photoRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) / rect.width;
    const deltaY = (e.clientY - centerY) / rect.height;
    
    setMousePosition({ 
      x: deltaX * 15, // Max 15deg tilt
      y: deltaY * -15 
    });
  };

  // Random sparkle animation positions
  const sparkles = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    left: Math.random() * 80 + 10,
    top: Math.random() * 80 + 10,
    delay: Math.random() * 2,
    size: Math.random() * 4 + 2
  }));

  return (
    <div
      ref={photoRef}
      className="absolute cursor-pointer group"
      style={style}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Magical Glow Effect */}
      <div 
        className={`
          absolute inset-0 rounded-xl transition-all duration-500 ease-out
          ${isHovered ? 'bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-xl scale-110' : 'bg-transparent'}
        `}
        style={{ zIndex: -2 }}
      />

      <div 
        className={`
          relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40
          bg-white rounded-xl shadow-lg transition-all duration-500 ease-out
          p-2 border border-white/80 backdrop-blur-sm
          ${isLoaded ? 'opacity-100' : 'opacity-60'}
          ${isHovered ? 'shadow-2xl shadow-blue-500/25 scale-105 -translate-y-2' : 'hover:shadow-xl'}
        `}
        style={{
          transform: `
            rotate(${photo.rotation}deg) 
            ${isHovered ? `rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)` : ''}
          `,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Sparkle Effects - Only show on hover */}
        {isHovered && sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute pointer-events-none animate-ping"
            style={{
              left: `${sparkle.left}%`,
              top: `${sparkle.top}%`,
              animationDelay: `${sparkle.delay}s`,
              animationDuration: '1.5s'
            }}
          >
            <div 
              className="bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-full opacity-80"
              style={{
                width: `${sparkle.size}px`,
                height: `${sparkle.size}px`
              }}
            />
          </div>
        ))}

        {/* Loading State with Shimmer */}
        {!isLoaded && (
          <div className="absolute inset-2 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="w-8 h-8 border-3 border-slate-300 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-8 h-8 border-3 border-transparent border-r-purple-500 rounded-full animate-spin animation-delay-150"></div>
              </div>
            </div>
          </div>
        )}

        {/* Error State with Better Design */}
        {isError ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center p-2">
              <div className="text-3xl mb-2 opacity-60">🖼️</div>
              <div className="text-xs text-gray-400 font-medium">Image unavailable</div>
              <div className="w-8 h-0.5 bg-gray-300 mx-auto mt-2 rounded-full"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Main Image with Enhanced Effects */}
            <img 
              src={photo.url} 
              alt={photo.title || 'Memory photo'}
              className={`
                w-full h-full object-cover rounded-lg
                transition-all duration-500 ease-out
                ${isLoaded ? 'opacity-100' : 'opacity-0'}
                ${isHovered ? 'brightness-110 contrast-105 saturate-110' : ''}
              `}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
            />

            {/* Enhanced Hover Overlay with Animation */}
            <div className={`
              absolute inset-2 rounded-lg flex items-end justify-center pb-3
              bg-gradient-to-t from-black/50 via-black/20 to-transparent
              transition-all duration-300 ease-out
              ${isHovered ? 'opacity-100' : 'opacity-0'}
            `}>
              <div className="transform transition-all duration-300 ease-out">
                <div className={`
                  text-white text-xs font-semibold bg-black/70 px-3 py-1.5 rounded-full 
                  backdrop-blur-sm border border-white/20 flex items-center space-x-2
                  ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}
                `}>
                  <svg className="w-3 h-3 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <span>View Memory</span>
                </div>
              </div>
            </div>

            {/* Rainbow Shine Effect */}
            <div className={`
              absolute inset-2 rounded-lg pointer-events-none overflow-hidden
              transition-all duration-500 ease-out
              ${isHovered ? 'opacity-30' : 'opacity-0'}
            `}>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent transform -skew-x-12 -translate-x-full animate-shine" />
            </div>

            {/* Holographic Border Effect */}
            <div className={`
              absolute inset-0 rounded-xl pointer-events-none
              transition-all duration-300 ease-out
              ${isHovered 
                ? 'bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20' 
                : 'bg-gradient-to-r from-gray-200/40 to-gray-300/40'
              }
            `} style={{ padding: '1px' }}>
              <div className="w-full h-full bg-transparent rounded-xl" />
            </div>
          </>
        )}

        {/* Enhanced Polaroid Frame */}
        <div className="absolute inset-0 rounded-xl border-2 border-white/90 pointer-events-none shadow-inner" />

        {/* Dynamic Shadow with Color */}
        <div 
          className={`
            absolute -bottom-2 -right-2 w-full h-full rounded-xl -z-10 blur-md
            transition-all duration-500 ease-out
            ${isHovered 
              ? 'bg-gradient-to-br from-blue-300/30 via-purple-300/30 to-pink-300/30 scale-105' 
              : 'bg-gray-400/20 scale-100'
            }
          `} 
        />

        {/* Photo info badge */}
        {photo.title && isHovered && (
          <div className={`
            absolute -top-2 -left-2 bg-gradient-to-r from-blue-600 to-purple-600 
            text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg
            transform transition-all duration-300 ease-out
            ${isHovered ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
          `}>
            <div className="flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              <span className="truncate max-w-20">{photo.title}</span>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-12deg); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(200%) skewX(-12deg); opacity: 0; }
        }
        .animate-shine {
          animation: shine 2s ease-in-out infinite;
        }
        .animation-delay-150 {
          animation-delay: 150ms;
        }
      `}</style>
    </div>
  );
};

export default SinglePhoto;