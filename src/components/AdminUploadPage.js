import React from 'react';
import UploadPhotoForm from '../components/UploadPhotoForm';

const AdminUploadPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Admin */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Panel</h1>
          <p className="text-gray-600 text-lg">Kelola dan upload foto baru</p>
          <div className="w-24 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Upload Form */}
        <UploadPhotoForm />

        {/* Footer Admin */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Admin Dashboard - Scattered Photos Management
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminUploadPage;