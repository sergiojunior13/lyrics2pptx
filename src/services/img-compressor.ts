import imageCompression from "browser-image-compression";

export async function compressImage(img: File) {
  const slideWidth = 960;

  const compressedImage = await imageCompression(img, {
    useWebWorker: true,
    maxWidthOrHeight: slideWidth,
  });

  return compressedImage;
}
