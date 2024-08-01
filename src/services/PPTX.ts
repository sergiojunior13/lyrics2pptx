import { formSchema } from "@/utils/form-schema";
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

  static async generate({ lyrics, options, bg, title, backgroundIsAColor }: LyricsData) {
    const pptx = new PPTXGenJS();
    pptx.layout = "LAYOUT_4x3";

    pptx.title = title || "Presentation";

    const verses = lyrics.split("\n\n");

    this.SIZES.textBox.width = this.SIZES.slide.width - options.padding / 96;
    this.SIZES.textBox.height = this.SIZES.slide.height - options.padding / 96;

    if (title) {
      const titleSlide = pptx.addSlide();

      titleSlide.background = {
        type: "cover" as "none",
        data: backgroundIsAColor ? undefined : bg,
        color: backgroundIsAColor ? bg : undefined,
      };

      titleSlide.slideNumber = {
        x: "95%",
        y: "94%",
        fontSize: 12,
        color: "#CCCCCC",
      };

      titleSlide.addText(title, {
        x: this.SIZES.slide.width / 2 - this.SIZES.textBox.width / 2,
        y: this.SIZES.slide.height / 2 - this.SIZES.textBox.height / 2,
        w: this.SIZES.textBox.width,
        h: this.SIZES.textBox.height,
        align: options.align,
        fontSize: options.fontSize + 5,
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

    for (const verse of verses) {
      const slide = pptx.addSlide();
      slide.slideNumber = {
        x: "95%",
        y: "94%",
        fontSize: 12,
        color: "#CCCCCC",
      };

      slide.background = {
        data: backgroundIsAColor ? undefined : bg,
        color: backgroundIsAColor ? bg : undefined,
        type: "cover" as "none",
      };

      slide.addText(verse.trim(), {
        x: this.SIZES.slide.width / 2 - this.SIZES.textBox.width / 2,
        y: this.SIZES.slide.height / 2 - this.SIZES.textBox.height / 2,
        w: this.SIZES.textBox.width,
        h: this.SIZES.textBox.height,
        align: options.align,
        fontSize: options.fontSize,
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

    const createdSlideBlob = (await pptx.write({ outputType: "blob" })) as Blob;

    return createdSlideBlob;
  }
}

export type LyricsData = {
  lyrics: string;
  title?: string;
  bg: string;
  options: z.infer<typeof formSchema>["options"];
  backgroundIsAColor: boolean;
};
