export async function getSrcFromFile(file: File) {
  const src: string = await new Promise(resolve => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);

    reader.readAsDataURL(file);
  });

  return src;
}
