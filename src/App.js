import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import supabase from './supabaseClient';  // Pastikan path ini benar
import SinglePhoto from './components/SinglePhoto';
import PhotoModal from './components/PhotoModal';
import UploadPhotoForm from './components/UploadPhotoForm';
import { generatePhotoPositions, calculateContainerHeight } from './utils/photoGenerator';
import useWindowSize from './hooks/useWindowSize';

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
        .order('created_at', { ascending: true });  // Bisa juga 'id' kalau mau

      if (error) {
        console.error('Error fetching photos:', error);
      } else {
        // Pastikan setiap foto punya properti rotation
        const photosWithRotation = data.map(photo => ({
          ...photo,
          rotation: photo.rotation ?? (Math.random() * 40 - 20), // Kalau belum ada, beri rotasi acak
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

  if (loading) return <div className="text-center mt-8">Loading photos...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-zinc-100 relative">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-gradient-to-br from-slate-100 via-gray-50 to-zinc-100 backdrop-blur-sm bg-opacity-95 text-center py-4 px-4 shadow-sm">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">📸 Foto Berserakan</h1>
        <p className="text-gray-600 max-w-md mx-auto">Klik foto untuk melihat detail kenangan</p>
      </div>

      {/* Container untuk foto-foto berserakan */}
      <div
        className="relative w-full pb-16 overflow-y-auto"
        style={{ height: `${containerHeight}px` }}
      >
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

// Komponen untuk halaman admin tetap sama
const AdminPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Panel</h1>
          <p className="text-gray-600 text-lg">Kelola dan upload foto baru</p>
          <div className="w-24 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
        </div>
        <UploadPhotoForm />
        <div className="text-center mt-8">
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            ← Kembali ke Galeri
          </a>
        </div>
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">Admin Dashboard - Scattered Photos Management</p>
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
