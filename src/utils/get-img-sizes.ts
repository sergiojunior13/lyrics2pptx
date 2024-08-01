export async function getImgSizes(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = function () {
      const height = img.height;
      const width = img.width;

      resolve({ width, height });
    };

    img.onerror = function (error) {
      reject(error);
    };

    img.src = URL.createObjectURL(file);
  });
}
