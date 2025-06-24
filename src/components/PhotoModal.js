import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, Share2, Download, Calendar, Eye, ZoomIn, ZoomOut } from 'lucide-react';

const PhotoModal = ({ photo, isOpen, onClose }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [imageScale, setImageScale] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState(null);
  const modalRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setIsImageLoaded(false);
      setImageScale(1);
      document.body.style.overflow = 'hidden';
      const timeout = setTimeout(() => setShowControls(false), 3000);
      setControlsTimeout(timeout);
    } else {
      document.body.style.overflow = 'unset';
      if (controlsTimeout) clearTimeout(controlsTimeout);
    }

    return () => {
      document.body.style.overflow = 'unset';
      if (controlsTimeout) clearTimeout(controlsTimeout);
    };
  }, [isOpen]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout) clearTimeout(controlsTimeout);
    const timeout = setTimeout(() => setShowControls(false), 3000);
    setControlsTimeout(timeout);
  };

  const handleBackdropClick = (e) => {
    if (e.target === modalRef.current) onClose();
  };

  const handleZoomIn = () => setImageScale(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setImageScale(prev => Math.max(prev - 0.2, 0.5));
  const handleImageLoad = () => setIsImageLoaded(true);
  const handleLike = () => setIsLiked(!isLiked);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: photo.title,
          text: photo.description,
          url: photo.url,
        });
      } catch {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(photo.url);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = photo.title || 'photo';
    link.click();
  };

  if (!isOpen || !photo) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-white/90 backdrop-blur-md flex items-center justify-center z-50 transition-all duration-300"
      onClick={handleBackdropClick}
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gray-400/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative w-full h-full sm:max-w-6xl sm:max-h-[95vh] sm:rounded-2xl overflow-hidden bg-gradient-to-br from-white via-gray-100 to-gray-200 shadow-2xl border border-gray-300">
        {/* Top Controls */}
        <div className={`
          absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-white/90 via-white/60 to-transparent 
          p-4 sm:p-6 transition-all duration-300 ease-out
          ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}
        `}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-gray-800">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                  {photo.title}
                </h2>
                {photo.date && (
                  <div className="flex items-center space-x-2 text-gray-500 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{photo.date}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="hidden sm:flex items-center space-x-1 bg-gray-200/70 backdrop-blur-md rounded-lg p-1">
                <button
                  onClick={handleZoomOut}
                  className="p-2 text-gray-700 hover:bg-gray-300 rounded-md transition-all duration-200 hover:scale-105"
                  disabled={imageScale <= 0.5}
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-gray-700 text-xs px-2 font-mono">
                  {Math.round(imageScale * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="p-2 text-gray-700 hover:bg-gray-300 rounded-md transition-all duration-200 hover:scale-105"
                  disabled={imageScale >= 3}
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleDownload}
                className="p-3 bg-gray-200 backdrop-blur-md text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 hover:scale-105"
              >
                <Download className="w-5 h-5" />
              </button>

              <button
                onClick={onClose}
                className="p-3 bg-red-100 backdrop-blur-md text-red-500 rounded-xl hover:bg-red-200 transition-all duration-200 hover:scale-105"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Image Display */}
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          {!isImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white to-gray-100">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-400 rounded-full animate-spin" style={{ animationDelay: '0.3s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          )}

          <div className="relative max-w-full max-h-full p-4 sm:p-8">
            <img
              ref={imageRef}
              src={photo.url}
              alt={photo.title}
              className={`
                max-w-full max-h-full object-contain rounded-lg shadow-2xl
                transition-all duration-500 ease-out cursor-grab active:cursor-grabbing
                ${isImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
              `}
              style={{ 
                transform: `scale(${imageScale})`,
                maxHeight: 'calc(100vh - 100px)',
              }}
              onLoad={handleImageLoad}
              onDoubleClick={() => setImageScale(imageScale === 1 ? 2 : 1)}
            />

            {isImageLoaded && (
              <div className="absolute inset-4 sm:inset-8 rounded-lg bg-gradient-to-r from-yellow-300/30 via-pink-300/30 to-orange-300/30 blur-xl -z-10 animate-pulse"></div>
            )}
          </div>
        </div>

        {/* Bottom Description */}
        {photo.description && (
          <div className={`
            absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-white/90 via-white/60 to-transparent 
            p-4 sm:p-6 transition-all duration-300 ease-out
            ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}
          `}>
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-gray-200">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">💭</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-800 font-semibold mb-2 text-lg">Memory Description</h3>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                      {photo.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Keyboard Hints */}
        <div className={`
          absolute bottom-4 left-4 z-10 transition-all duration-300
          ${showControls ? 'opacity-60' : 'opacity-0'}
        `}>
          <div className="bg-gray-200 backdrop-blur-sm text-gray-800 text-xs px-3 py-2 rounded-lg border border-gray-300">
          </div>
        </div>
      </div>

      <div
        className="sr-only"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose();
          if (e.key === '+' || e.key === '=') handleZoomIn();
          if (e.key === '-') handleZoomOut();
        }}
        autoFocus
      />
    </div>
  );
};

export default PhotoModal;
