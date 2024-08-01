import { LyricsPPTX } from "@/services/PPTX";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    if (!formData) {
      return createErrorResponse("No data sent", 400);
    }

    let backgroundImg: string | File | undefined = formData.get("bg") || undefined;
    const backgroundIsAColor = typeof backgroundImg === "string";

    if (!backgroundIsAColor) {
      backgroundImg = await convertImageToBase64(backgroundImg as File);
    }

    const title = formData.get("title") as string | undefined;
    let lyrics = formData.get("lyrics") as string | null;
    let options = formData.get("options") as string | any | null;

    if (!lyrics) {
      return createErrorResponse("Lyrics field is required", 400);
    }

    if (!options) {
      return createErrorResponse("Options field is required", 400);
    }

    options = JSON.parse(options as string) as any;
    lyrics = lyrics.replaceAll("\r\n", "\n");

    const createdSlideBlob = await LyricsPPTX.generate({
      bg: backgroundImg as string,
      lyrics,
      title,
      options,
      backgroundIsAColor,
    });

    return new Response(createdSlideBlob);
  } catch (error: any) {
    return createErrorResponse(error?.message || error?.name, 500);
  }
}

async function convertImageToBase64(imgFile: File): Promise<string | undefined> {
  return Buffer.from(await imgFile.arrayBuffer()).toString("base64");
}

function createErrorResponse(message: string, statusCode: number): Response {
  return new Response(JSON.stringify({ error: message || "Unknown error" }), {
    status: statusCode,
    headers: { "Content-Type": "application/json" },
  });
}
