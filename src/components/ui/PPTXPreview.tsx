import { formSchema } from "@/app/page";
import { getSrcFromFile } from "@/utils/getSrcFromFile";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

export function PPTXPreview({
  lyrics = "Preview",
  bgImg,
  options,
}: {
  lyrics: string;
  bgImg?: File | string;
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

  const [bgSrc, setBgSrc] = useState<string>();
  const isBgAColor = typeof bgImg == "string";

  bgImg && !isBgAColor && getSrcFromFile(bgImg).then(setBgSrc);

  const verses = lyrics.trim().split("\n\n");

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
  } = options;
  return (
    <div
      ref={previewRef}
      className="sticky top-3 self-start aspect-[4/3] flex-1 flex items-center rounded-lg max-w-[418px] overflow-hidden"
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
        }}
      >
        {verses[0]}
      </p>
    </div>
  );
}
