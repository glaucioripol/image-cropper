import { Area } from "react-easy-crop";

export async function cropImage(
  imageSrc: string,
  croppedAreaPixels: Area
): Promise<string | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  // set proper canvas dimensions before transform & export
  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;

  // croppedAreaPixels values are bounding box relative
  // extract the cropped image using these values
  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    croppedAreaPixels.width,
    croppedAreaPixels.height
  );

  // get the data from canvas as 70% jpg (or specified type).
  return new Promise((resolve) => {
    canvas.toBlob(
      (file) => resolve(URL.createObjectURL(file as Blob)),
      "image/jpeg",
      0.7
    );
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });
}
