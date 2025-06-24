import React, { useState } from 'react';
import supabase from '../supabaseClient';

const UploadPhotoForm = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  // Komponen Alert Custom
  const CustomAlert = ({ type, message, onClose }) => {
    const alertStyles = {
      success: {
        bg: 'bg-green-50 border-green-200',
        text: 'text-green-800',
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        ),
        button: 'text-green-500 hover:text-green-700'
      },
      error: {
        bg: 'bg-red-50 border-red-200',
        text: 'text-red-800',
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        ),
        button: 'text-red-500 hover:text-red-700'
      },
      warning: {
        bg: 'bg-yellow-50 border-yellow-200',
        text: 'text-yellow-800',
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        ),
        button: 'text-yellow-500 hover:text-yellow-700'
      }
    };

    const style = alertStyles[type];

    return (
      <div className={`fixed top-4 right-4 z-50 max-w-md w-full mx-auto transform transition-all duration-300 ease-in-out`}>
        <div className={`border rounded-lg p-4 shadow-lg ${style.bg} ${style.text}`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {style.icon}
            </div>
            <div className="ml-3 w-0 flex-1">
              <p className="text-sm font-medium">
                {message}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                onClick={onClose}
                className={`inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${style.button}`}
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Fungsi untuk menampilkan alert
  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    // Auto hide setelah 5 detik
    setTimeout(() => {
      setAlert({ show: false, type: '', message: '' });
    }, 5000);
  };

  // Fungsi untuk menutup alert
  const closeAlert = () => {
    setAlert({ show: false, type: '', message: '' });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl('');
    }
  };

  // Fungsi untuk generate rotasi acak
  const generateRandomRotation = () => {
    return Math.random() * 40 - 20; 
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file || !title || !description) {
      showAlert('warning', 'Harap lengkapi semua data sebelum upload!');
      return;
    }

    setIsUploading(true);

    const uniqueFileName = Date.now() + '_' + file.name;

    const { data, error } = await supabase.storage
      .from('photos')
      .upload('photos/' + uniqueFileName, file);

    if (error) {
      console.error('Error uploading photo:', error);
      showAlert('error', 'Gagal meng-upload foto! Silakan coba lagi.');
      setIsUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('photos')
      .getPublicUrl('photos/' + uniqueFileName);

    const publicURL = publicUrlData?.publicUrl;

    if (!publicURL) {
      console.error('Error getting photo URL: No URL returned');
      showAlert('error', 'Gagal mendapatkan URL foto! Silakan coba lagi.');
      setIsUploading(false);
      return;
    }

    // Generate rotasi acak untuk foto yang diupload
    const randomRotation = generateRandomRotation();

    const { data: photoData, error: insertError } = await supabase
      .from('photos')
      .insert([
        { 
          title, 
          url: publicURL, 
          description, 
          rotation: randomRotation
        }
      ]);

    if (insertError) {
      console.error('Error saving photo data:', insertError);
      showAlert('error', 'Gagal menyimpan data foto! Silakan coba lagi.');
      setIsUploading(false);
      return;
    }

    showAlert('success', 'Foto berhasil di-upload! 🎉');
    
    setFile(null);
    setTitle('');
    setDescription('');
    setPreviewUrl('');
    setIsUploading(false);
  };

  return (
    <>
      {/* Alert Component */}
      {alert.show && (
        <CustomAlert 
          type={alert.type} 
          message={alert.message} 
          onClose={closeAlert}
        />
      )}

      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Upload Foto Baru</h2>
        
        <form onSubmit={handleUpload} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Judul Foto
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Masukkan judul foto..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Ceritakan tentang foto ini..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Foto
            </label>
            <input 
              type="file" 
              onChange={handleFileChange} 
              required 
              accept="image/*"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {previewUrl && (
            <div className="flex justify-center">
              <div className="w-40 h-40 bg-white rounded-lg shadow-md p-2">
                <img 
                  src={previewUrl} 
                  alt="Preview"
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isUploading}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 transform ${
              isUploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95'
            } shadow-lg hover:shadow-xl`}
          >
            {isUploading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Mengupload...
              </div>
            ) : (
              'Upload Foto'
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default UploadPhotoForm;