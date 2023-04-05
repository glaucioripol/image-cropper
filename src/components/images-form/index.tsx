import { useRef, useState, ChangeEvent, FC } from "react";
import { ImagesFormProps } from "./types";

export const ImagesForm: FC<ImagesFormProps> = ({ onImagesChange }) => {
  const inputImageRef = useRef<HTMLInputElement>(null);

  const handleChangeImageInput = (event: ChangeEvent<HTMLInputElement>) => {
    const hasImages = Boolean(event.target.files?.length);

    if (hasImages) {
      for (const file of event.target.files as FileList) {
        const reader = new FileReader();
        reader.onload = (event) => {
          onImagesChange((previousImages) => [
            ...(previousImages || []),
            event.target?.result as string,
          ]);
        };

        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div>
      <form onSubmit={(event) => event.preventDefault()}>
        <input
          ref={inputImageRef}
          type="file"
          id="input-image"
          title="Selecione sua imagem"
          onChange={handleChangeImageInput}
          accept="image/*"
          required
          multiple
        />

        <button
          type="button"
          className="button"
          onClick={() => inputImageRef.current?.click()}
        >
          Selecione sua imagem
        </button>
      </form>
    </div>
  );
};
