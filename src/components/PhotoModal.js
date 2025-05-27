import React from 'react';
import { X } from 'lucide-react';

const PhotoModal = ({ photo, isOpen, onClose }) => {
  if (!isOpen || !photo) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all"
          >
            <X size={20} />
          </button>
          
          <img
            src={photo.url}
            alt={photo.title}
            className="w-full h-64 sm:h-80 object-cover rounded-t-lg"
          />
          
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{photo.title}</h2>
            <p className="text-gray-600 mb-4">{photo.date}</p>
            <p className="text-gray-700 leading-relaxed">{photo.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;
