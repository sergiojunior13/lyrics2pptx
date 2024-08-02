import { formSchema } from "@/utils/form-schema";
import { getSrcFromFile } from "@/utils/getSrcFromFile";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

export function PPTXPreview({
  lyrics = "Preview",
  bgImg,
  options,
  watermarkImg,
}: {
  lyrics: string;
  bgImg?: File | string;
  watermarkImg?: File;
  options: z.infer<typeof formSchema>["options"];
}) {
  // This things below are to get the relative values of atributes (such padding, font-size) of the preview of the slide.
  const slideDefaultWidth = 960;
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewWidth, setPreviewWidth] = useState(300);

  useEffect(() => {
    const setWidth = () =>
      setPreviewWidth(previewRef.current ? previewRef.current.offsetWidth : 300);

    setWidth();

    window.addEventListener("resize", setWidth);

    return () => window.removeEventListener("resize", setWidth);
  }, []);

  const previewScaleComparedToSlideDefaultSize = previewWidth / slideDefaultWidth;

  const {
    align,
    fontBold,
    fontBorder,
    fontBorderColor,
    fontBorderWidth,
    fontColor,
    fontSize,
    fontUpperCase,
    padding,
    watermark,
    watermarkWidth,
    lineHeight,
  } = options;

  const [bgSrc, setBgSrc] = useState<string>();
  const [watermarkImgSrc, setWatermarkImgSrc] = useState<string>();

  const isBgAColor = typeof bgImg == "string";

  bgImg && !isBgAColor && getSrcFromFile(bgImg).then(setBgSrc);
  watermarkImg && getSrcFromFile(watermarkImg as File).then(setWatermarkImgSrc);

  const verses = lyrics.trim().split("\n\n");

  return (
    <div
      ref={previewRef}
      className="aspect-[4/3] flex-1 flex items-center rounded-lg overflow-hidden shadow-md relative"
      style={{
        padding: previewScaleComparedToSlideDefaultSize * padding,
        fontWeight: fontBold ? "bold" : "normal",
        color: fontColor,
        fontSize: previewScaleComparedToSlideDefaultSize * fontSize,
        textTransform: fontUpperCase,
        textAlign: align,
        backgroundColor: isBgAColor ? bgImg : undefined,
        backgroundImage: !isBgAColor ? `url(${bgSrc})` : undefined,
        backgroundSize: "100% 100%",
      }}
    >
      <p
        className="whitespace-break-spaces w-full"
        style={{
          WebkitTextStroke: fontBorder
            ? `${previewScaleComparedToSlideDefaultSize * fontBorderWidth}px ${fontBorderColor}`
            : undefined,
          overflowWrap: "anywhere",
          lineHeight,
        }}
      >
        {verses[0]}
      </p>

      {watermark && watermarkImg && watermarkImgSrc && (
        <Image
          src={watermarkImgSrc}
          alt="watermark"
          width={60}
          height={60}
          className="absolute h-auto"
          style={{
            bottom: padding * previewScaleComparedToSlideDefaultSize,
            right: padding * previewScaleComparedToSlideDefaultSize,
            width: previewScaleComparedToSlideDefaultSize * (watermarkWidth as number),
          }}
        />
      )}
    </div>
  );
}
