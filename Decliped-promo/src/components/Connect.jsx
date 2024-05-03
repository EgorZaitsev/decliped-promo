import ImageGallery from "./ImageGallery";

function Connect() {
  return (
    <div className="flex flex-col">
      <h2 className=" font-bold">Загруженные фотографии</h2>
      <ImageGallery />
    </div>
  );
}

export default Connect;
