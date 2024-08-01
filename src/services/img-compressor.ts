import imageCompression from "browser-image-compression";

export async function compressImage(img: File, maxWidth?: number) {
  const slideWidth = 960;

  const compressedImage = await imageCompression(img, {
    useWebWorker: true,
    maxWidthOrHeight: maxWidth || slideWidth,
  });

  return compressedImage;
}
