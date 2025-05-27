import React, { useState } from 'react';
import supabase from '../supabaseClient';

const UploadPhotoForm = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

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
    return Math.random() * 40 - 20; // Rotasi acak antara -20° hingga +20°
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file || !title || !description) {
      alert('Harap lengkapi semua data sebelum upload!');
      return;
    }

    setIsUploading(true);

    const uniqueFileName = Date.now() + '_' + file.name;

    const { data, error } = await supabase.storage
      .from('photos')
      .upload('photos/' + uniqueFileName, file);

    if (error) {
      console.error('Error uploading photo:', error);
      alert('Gagal meng-upload foto!');
      setIsUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('photos')
      .getPublicUrl('photos/' + uniqueFileName);

    const publicURL = publicUrlData?.publicUrl;

    if (!publicURL) {
      console.error('Error getting photo URL: No URL returned');
      alert('Gagal mendapatkan URL foto!');
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
          rotation: randomRotation // Menggunakan rotasi acak
        }
      ]);

    if (insertError) {
      console.error('Error saving photo data:', insertError);
      alert('Gagal menyimpan data foto!');
      setIsUploading(false);
      return;
    }

    alert('Foto berhasil di-upload!');
    
    setFile(null);
    setTitle('');
    setDescription('');
    setPreviewUrl('');
    setIsUploading(false);
  };

  return (
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
  );
};

export default UploadPhotoForm;