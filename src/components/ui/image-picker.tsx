import { FileImage } from "lucide-react";
import colors from "tailwindcss/colors";
import { ChangeEvent, InputHTMLAttributes, useState } from "react";
import { Label } from "./label";
import Image from "next/image";
import { getSrcFromFile } from "@/utils/getSrcFromFile";

export function ImagePicker({ onChange, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const chosenImg = e.target.files[0];

    getSrcFromFile(chosenImg).then(setImgSrc);

    onChange && onChange(e);
  };

  const NoImgChosenJSX = (
    <div className="pointer-events-none">
      <FileImage size={24} color={colors.current} className="mx-auto" />
      <Label className="mt-2">Insira o plano de fundo da apresentação</Label>
    </div>
  );

  const ImgChosenJSX = (
    <>
      {imgSrc && (
        <Image
          width={320}
          height={180}
          src={imgSrc}
          className="h-full w-full object-cover"
          alt="presentation background image"
        />
      )}
    </>
  );

  return (
    <label
      htmlFor="image-picker"
      className={`border cursor-pointer hover:bg-secondary border-input border-dashed bg-background w-full flex flex-col items-center justify-center aspect-video rounded-lg overflow-hidden ${
        imgSrc ? "" : "p-4"
      }`}
    >
      {imgSrc ? ImgChosenJSX : NoImgChosenJSX}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="image-picker"
        onChange={handleChange}
        {...props}
      />
    </label>
  );
}
