import React, { useState, useEffect } from "react";

const ImageGallery = () => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/photos") // Отправляем GET запрос на сервер
      .then((response) => response.json())
      .then((data) => {
        // Устанавливаем полученные фотографии в состояние
        setPhotos(data.photos);
      })
      .catch((error) => console.error("Error fetching photos:", error));
  }, []); // [] гарантирует, что useEffect вызывается только при монтировании компонента

  return (
    <div>
      <div className="grid grid-cols-2 h-[590px] overflow-auto">
        {photos.map((photo, index) => (
          <img
            className="w-48 h-48"
            key={index}
            src={`http://localhost:3000/${photo}`}
            alt={`Photo ${index}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
