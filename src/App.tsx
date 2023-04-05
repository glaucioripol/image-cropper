import { useCallback, useState } from "react";
import Cropper, { Area, CropperProps } from "react-easy-crop";
import { ImagesForm } from "./components";
import { cropImage } from "./utils";

type CropperProperties = {
  croppedArea: Area;
  croppedAreaPixels: Area;
} & Pick<CropperProps, "crop" | "zoom">;

const initialCropperProps: CropperProperties = {
  crop: { x: 0, y: 0 },
  croppedAreaPixels: { width: 0, height: 0, x: 0, y: 0 },
  croppedArea: { width: 0, height: 0, x: 0, y: 0 },
  zoom: 1,
};

export function App() {
  const [cropperProps, setCropperProps] =
    useState<CropperProperties>(initialCropperProps);
  const [images, setImages] = useState<string[]>([]);
  const [imageToCrop, setImageToCrop] = useState(images.at(0) || null);

  const [croppedImages, setCroppedImages] = useState<string[]>([]);

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCropperProps((previousValue) => ({
        ...previousValue,
        croppedArea,
        croppedAreaPixels,
      }));
    },
    []
  );

  const handleCropProps =
    (field: keyof CropperProps) => (value: CropperProps[typeof field]) => {
      setCropperProps((previousValue) => ({
        ...previousValue,
        [field]: value,
      }));
    };

  const saveCroppedImage = async () => {
    const newImage = await cropImage(
      imageToCrop as string,
      cropperProps.croppedAreaPixels
    );

    if (!newImage) {
      return;
    }

    setCroppedImages((previousValue) => [...previousValue, newImage]);
  };

  return (
    <div className="container">
      <h1>Corte suas fotos</h1>

      <ImagesForm onImagesChange={setImages} />

      {Boolean(imageToCrop) && (
        <div className="crop-wrapper">
          <div className="resize-cropper">
            <Cropper
              image={imageToCrop as string}
              crop={cropperProps.crop}
              zoom={cropperProps.zoom}
              cropSize={{ width: 480, height: 480 }}
              aspect={4 / 4}
              onCropChange={handleCropProps("crop")}
              onCropComplete={onCropComplete}
              onZoomChange={handleCropProps("zoom")}
            />
          </div>

          <div className="crop__button-wrapper">
            <button className="button" type="button" onClick={saveCroppedImage}>
              Salvar imagem
            </button>
          </div>
        </div>
      )}

      <h1>Imagens Originais</h1>
      <div className="images-gallery">
        {images.map((image) => (
          <button
            type="button"
            key={image}
            className="image-wrapper"
            onClick={() => setImageToCrop(image)}
          >
            <img src={image} alt="some image" width={120} />
          </button>
        ))}
      </div>

      <h1>Imagens cortadas</h1>
      <div className="images-gallery">
        {croppedImages.map((image) => (
          <button
            type="button"
            key={image}
            className="image-wrapper"
            onClick={() => setImageToCrop(image)}
          >
            <img src={image} alt="some image" width={120} />
          </button>
        ))}
      </div>
    </div>
  );
}
