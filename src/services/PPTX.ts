import { formSchema } from "@/utils/form-schema";
import { UnitsConverter } from "@/utils/units-format";
import PPTXGenJS from "pptxgenjs";
import { z } from "zod";

export class LyricsPPTX {
  static SIZES = {
    slide: {
      width: 10,
      height: 7.5,
    },
    textBox: {
      width: 9,
      height: 2.5,
    },
  };

  static async generate({
    lyrics,
    options,
    bg,
    title,
    backgroundIsAColor,
    watermarkImg,
  }: LyricsData) {
    const pptx = new PPTXGenJS();
    pptx.layout = "LAYOUT_4x3";

    pptx.title = title || "Presentation";

    const verses = lyrics.split("\n\n");

    options.lineHeight = UnitsConverter.pxToPt(options.lineHeight * options.fontSize);
    options.fontSize = UnitsConverter.pxToPt(options.fontSize);
    options.fontBorderWidth = UnitsConverter.pxToPt(options.fontBorderWidth);
    options.padding = UnitsConverter.pxToInches(options.padding);

    if (options.watermarkWidth && options.watermarkHeight) {
      options.watermarkWidth = UnitsConverter.pxToInches(options.watermarkWidth);
      options.watermarkHeight = UnitsConverter.pxToInches(options.watermarkHeight);
    }

    this.SIZES.textBox.width = this.SIZES.slide.width - options.padding;
    this.SIZES.textBox.height = this.SIZES.slide.height - options.padding;

    const watermarkObj = options.watermark
      ? {
          data: ("data:image/png;base64," + watermarkImg) as string,
          x: this.SIZES.textBox.width - (options.watermarkWidth as number),
          y: this.SIZES.textBox.height - (options.watermarkHeight as number),
          w: options.watermarkWidth as number,
          h: options.watermarkHeight as number,
        }
      : undefined;

    if (title) {
      const titleSlide = pptx.addSlide();

      titleSlide.background = {
        data: backgroundIsAColor ? undefined : bg,
        color: backgroundIsAColor ? bg : undefined,
      };

      titleSlide.slideNumber = {
        x: "95%",
        y: "4%",
        fontSize: 12,
        color: "#CCCCCC",
      };

      watermarkObj && titleSlide.addImage(watermarkObj);

      titleSlide.addText(title, {
        x: this.SIZES.slide.width / 2 - this.SIZES.textBox.width / 2,
        y: this.SIZES.slide.height / 2 - this.SIZES.textBox.height / 2,
        w: this.SIZES.textBox.width,
        h: this.SIZES.textBox.height,
        align: options.align,
        fontSize: options.fontSize + 5,
        lineSpacing: options.lineHeight + 5,
        color: options.fontColor,
        bold: true,
        fontFace: "Arial",
        outline: options.fontBorder
          ? {
              color: options.fontBorderColor,
              size: options.fontBorderWidth,
            }
          : undefined,
        breakLine: true,
      });
    }

    for (const verse of verses) {
      const slide = pptx.addSlide();
      slide.slideNumber = {
        x: "95%",
        y: "4%",
        fontSize: 12,
        color: "#CCCCCC",
      };

      watermarkObj && slide.addImage(watermarkObj);

      slide.background = {
        data: backgroundIsAColor ? undefined : bg,
        color: backgroundIsAColor ? bg : undefined,
      };

      slide.addText(verse.trim(), {
        x: this.SIZES.slide.width / 2 - this.SIZES.textBox.width / 2,
        y: this.SIZES.slide.height / 2 - this.SIZES.textBox.height / 2,
        w: this.SIZES.textBox.width,
        h: this.SIZES.textBox.height,
        align: options.align,
        fontSize: options.fontSize,
        lineSpacing: options.lineHeight,
        color: options.fontColor,
        bold: options.fontBold,
        fontFace: "Arial",
        outline: options.fontBorder
          ? {
              color: options.fontBorderColor,
              size: options.fontBorderWidth,
            }
          : undefined,
        breakLine: true,
      });
    }

    const createdSlideBlob = (await pptx.write({ outputType: "blob" })) as Blob;

    return createdSlideBlob;
  }
}

export type LyricsData = z.infer<typeof formSchema> & {
  bg: string;
  backgroundIsAColor: boolean;
};
