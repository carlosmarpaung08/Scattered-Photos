import React, { useState, useMemo, useEffect, useRef } from 'react'; 
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import supabase from './supabaseClient';
import SinglePhoto from './components/SinglePhoto';
import PhotoModal from './components/PhotoModal';
import UploadPhotoForm from './components/UploadPhotoForm';
import { generatePhotoPositions, calculateContainerHeight } from './utils/photoGenerator';
import useWindowSize from './hooks/useWindowSize';

// Simplified Music Player Component
const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Anda bisa mengganti URL ini dengan lagu yang Anda inginkan
  const musicUrl = "/music/Hindia - Cincin (Official Lyric Video).mp3"; // Contoh URL

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <audio ref={audioRef} src={musicUrl} preload="metadata" />
      
      {/* Simple Play/Pause Button */}
      <button
        onClick={togglePlay}
        className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-110 active:scale-95 group"
      >
        {isPlaying ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
          </svg>
        ) : (
          <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        )}

        {/* Floating Music Note Animation - Hanya muncul saat playing */}
        {isPlaying && (
          <div className="absolute -top-2 -right-2">
            <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs animate-bounce">
              ♪
            </div>
          </div>
        )}

        {/* Subtle pulse effect saat playing */}
        {isPlaying && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 animate-ping opacity-20"></div>
        )}
      </button>
    </div>
  );
};

// Enhanced Navbar Component
const Navbar = () => {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';

  return (
    <div className="fixed top-0 left-0 right-0 z-30 backdrop-blur-md bg-white/80 border-b border-gray-200/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo & Title Section */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-bold">📸</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Scattered Photos
              </h1>
              <p className="text-xs text-gray-500 font-medium tracking-wide">
                {isAdminPage ? 'ADMIN PANEL' : 'MEMORY GALLERY'}
              </p>
            </div>
          </div>

          {/* Description - Hidden on mobile */}
          {!isAdminPage && (
            <div className="hidden md:block text-center flex-1 mx-8">
              <p className="text-gray-600 text-sm font-medium">
                Click on any photo to explore the beautiful memories
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {!isAdminPage ? (
              <>
                {/* Stats Badge */}
                <div className="hidden sm:flex items-center px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  Live Gallery
                </div>
                
                {/* Admin Access Button */}
                <Link
                  to="/admin"
                  className="group relative inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                  Admin
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75"></div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                </Link>
              </>
            ) : (
              <>
                {/* Upload Status Badge */}
                <div className="hidden sm:flex items-center px-3 py-1.5 bg-blue-100 rounded-full text-xs font-medium text-blue-700">
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  Upload Ready
                </div>

                {/* Back to Gallery Button */}
                <Link
                  to="/"
                  className="group inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Gallery
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Komponen untuk halaman utama (Guest)
const HomePage = () => {
  const [scatteredPhotos, setScatteredPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const windowSize = useWindowSize();

  useEffect(() => {
    const fetchPhotos = async () => {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) {
        console.error('Error fetching photos:', error);
      } else {
        // Pastikan setiap foto punya properti rotation
        const photosWithRotation = data.map(photo => ({
          ...photo,
          rotation: photo.rotation ?? (Math.random() * 40 - 20),
        }));
        setScatteredPhotos(photosWithRotation);
      }
      setLoading(false);
    };

    fetchPhotos();
  }, []);

  useEffect(() => {
    console.log('Window size:', windowSize);
  }, [windowSize]);

  useEffect(() => {
    console.log('Scattered photos state updated:', scatteredPhotos);
  }, [scatteredPhotos]);

  const photoPositions = useMemo(() => {
    if (!windowSize.width || scatteredPhotos.length === 0) return [];
    const positions = generatePhotoPositions(scatteredPhotos, windowSize);
    console.log('Generated photo positions:', positions);
    return positions;
  }, [scatteredPhotos, windowSize]);

  const containerHeight = useMemo(() => {
    const height = calculateContainerHeight(photoPositions);
    console.log('Calculated container height:', height);
    return height;
  }, [photoPositions]);

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="pt-20 text-center mt-8">
        <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-blue-600">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading beautiful memories...
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-zinc-100 relative">
      {/* Enhanced Navbar */}
      <Navbar />

      {/* Simplified Music Player - Only on HomePage */}
      <MusicPlayer />

      {/* Spacer untuk kompensasi fixed header - sesuaikan dengan tinggi navbar baru */}
      <div className="h-20"></div>

      {/* Container untuk foto-foto berserakan */}
      <div className="relative w-full pb-16">
        {scatteredPhotos.map((photo, index) => {
          const position = photoPositions[index];
          if (!position) return null;

          return (
            <SinglePhoto
              key={photo.id}
              photo={photo}
              onClick={handlePhotoClick}
              style={{
                left: position.left,
                top: position.top,
                zIndex: Math.floor(Math.random() * 15) + 5,
              }}
            />
          );
        })}
      </div>

      {/* Modal untuk detail foto */}
      <PhotoModal photo={selectedPhoto} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

// Komponen untuk halaman admin dengan navbar yang sama - FIXED PADDING
const AdminPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Enhanced Navbar */}
      <Navbar />
      
      {/* Content dengan padding yang lebih besar untuk navbar - DIPERBAIKI DARI pt-20 menjadi pt-28 */}
      <div className="pt-28 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Panel</h1>
            <p className="text-gray-600 text-lg">Kelola dan upload foto baru ke galeri</p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-4 rounded-full"></div>
          </div>
          
          <UploadPhotoForm />
          
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">Admin Dashboard - Scattered Photos Management System</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ScatteredPhotoApp = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
};

export default ScatteredPhotoApp;