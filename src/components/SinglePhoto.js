import React from 'react';

const SinglePhoto = ({ photo, onClick, style }) => {
  return (
    <div
      className="absolute cursor-pointer transition-all duration-300 hover:scale-110 hover:z-20"
      style={style}
      onClick={() => onClick(photo)}
    >
      <div 
        className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 bg-white rounded-lg shadow-lg p-2 transform hover:shadow-2xl"
        style={{
          transform: `rotate(${photo.rotation}deg)`,
        }}
      >
        <img 
          src={photo.url} 
          alt={photo.title}
          className="w-full h-full object-cover rounded-md"
        />
      </div>
    </div>
  );
};

export default SinglePhoto;
