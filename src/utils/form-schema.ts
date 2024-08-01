import { z } from "zod";

export const formSchema = z.object({
  title: z.string().min(1).optional(),
  lyrics: z.string().min(1).trim(),
  options: z.object({
    fontColor: z.string(),
    fontSize: z.number().min(1),
    align: z.enum(["left", "center", "right", "justify"]),
    fontBold: z.boolean(),
    fontUpperCase: z.enum(["capitalize", "uppercase", "none"]),
    padding: z.number().min(0),
    fontBorderColor: z.string(),
    fontBorderWidth: z.number(),
    fontBorder: z.boolean(),
  }),
  // File is undefined when page is compiling
  bg:
    typeof window === "undefined"
      ? z.string().optional()
      : z.instanceof(File).optional().or(z.string().optional()),
});
