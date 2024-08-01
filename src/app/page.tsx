"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PPTXPreview } from "@/components/ui/PPTXPreview";
import { Input } from "@/components/ui/input";
import { ColorPicker } from "@/components/ui/color-picker";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  CaseLower,
  CaseSensitive,
  CaseUpper,
} from "lucide-react";
import { formatString as formatStringCase } from "@/utils/formatString";
import { useRef } from "react";

import { getLyricsAndTitleFromText } from "@/utils/get-lyrics-and-title-from-text";
import { formSchema } from "@/utils/form-schema";

import { compressImage } from "@/services/img-compressor";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import Image from "next/image";

export default function Home() {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bg: "#18181b",
      options: {
        align: "center",
        fontBold: false,
        fontBorder: true,
        fontBorderColor: "#ffff00",
        fontBorderWidth: 1,
        fontColor: "#ffffff",
        fontSize: 40,
        fontUpperCase: "none",
        padding: 24,
      },
    },
  });

  async function onSubmit({ lyrics, options, bg, title }: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();

      if (bg instanceof File) {
        bg = await compressImage(bg);
      }

      title && formData.append("title", title);
      bg && formData.append("bg", bg);
      formData.append("lyrics", lyrics);
      formData.append("options", JSON.stringify(options));

      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      if (!res) throw new Error("An error ocurred: Server didn't respond.");
      if (!res.ok) {
        throw new Error(`${(await res.json())?.error || "Unknown error"}`);
      }

      const createdSlide = await res.blob();

      const blobUrl = URL.createObjectURL(createdSlide);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${title?.replaceAll(" ", "-").toLowerCase() || "presentation"}.pptx`;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(blobUrl);
    } catch (e: any) {
      toast(`An error ocurred: ${e?.message || e?.name}.\nPlease try again.`);
    }
  }

  const lyrics = form.watch("lyrics");
  const options = form.watch("options");

  return (
    <>
      <header className="p-4 bg-foreground flex gap-4 items-center">
        <Image src="/logo.png" alt="logo" width={32} height={40} className="h-full w-auto" />
        <h1 className="text-2xl font-bold text-background">PowerPoint Lyrics Generator</h1>
      </header>

      <Toaster />

      <main className="flex flex-1 flex-col items-center justify-center p-6 w-full max-w-screen-lg m-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1">
            <FormField
              control={form.control}
              name="lyrics"
              render={({ field: { onChange, value, ref, ...field } }) => (
                <FormItem className=" flex flex-col flex-1">
                  <FormLabel>Lyrics</FormLabel>
                  <FormControl>
                    <Textarea
                      ref={textAreaRef}
                      className="flex-1 resize-none bg-secondary"
                      placeholder="Insert your lyrics here..."
                      onChange={e => {
                        let content: string[] | string = e.target.value.trim();

                        content = formatStringCase(content, form.watch("options.fontUpperCase"));

                        const { lyrics, title } = getLyricsAndTitleFromText(content);

                        if (title) form.setValue("title", title);

                        onChange({ ...e, target: { ...e.target, value: lyrics } });
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="whitespace-break-spaces">
                    Each slide contains one verse(the verses are separated by two line-breaks).
                    {"\n"}Use "-" in the first line to indicate the title of the lyrics.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator orientation="vertical" className="mx-3 h-auto" />

            <section className="flex flex-col flex-1">
              <FormItem>
                <FormLabel>Preview</FormLabel>
                <PPTXPreview options={options} lyrics={lyrics} bgImg={form.watch("bg") as File} />
              </FormItem>

              <Separator className="my-5" />

              <FormField
                control={form.control}
                name="bg"
                render={({ field: { value, onChange, ref, ...field } }) => (
                  <FormItem className=" flex flex-col flex-1">
                    <FormLabel>Presentation background</FormLabel>
                    <Input
                      type="file"
                      accept="image/*"
                      className="cursor-pointer"
                      onChange={e => e.target.files && onChange(e.target.files[0])}
                    />

                    <span className="my-4 text-xs text-center text-muted-foreground">OR</span>

                    <ColorPicker setColor={onChange} />
                  </FormItem>
                )}
              />

              <Separator className="my-5" />

              <FormField
                control={form.control}
                name="options.fontColor"
                render={({ field: { onChange } }) => (
                  <FormItem className="flex flex-col flex-1">
                    <FormLabel>Font color</FormLabel>
                    <ColorPicker setColor={onChange} />
                  </FormItem>
                )}
              />

              <Separator className="my-5" />

              <FormField
                control={form.control}
                name="options.fontBorder"
                render={({ field: { onChange, value } }) => (
                  <FormItem className="flex flex-col flex-1">
                    <FormLabel>Text stroke</FormLabel>
                    <div className="flex flex-col gap-2">
                      <Switch defaultChecked={value} onCheckedChange={onChange} />
                      {value && (
                        <>
                          <FormField
                            control={form.control}
                            name="options.fontBorderWidth"
                            render={({ field: { onChange, value } }) => (
                              <div className="flex gap-3">
                                <span className="font-medium text-sm">{value}px</span>
                                <Slider
                                  defaultValue={[value]}
                                  max={20}
                                  step={1}
                                  min={1}
                                  onValueChange={v => onChange(v[0])}
                                />
                              </div>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="options.fontBorderColor"
                            render={({ field: { onChange, value } }) => (
                              <ColorPicker setColor={onChange} />
                            )}
                          />
                        </>
                      )}
                    </div>
                  </FormItem>
                )}
              />

              <Separator className="my-5" />

              <FormField
                control={form.control}
                name="options.padding"
                render={({ field: { onChange, value } }) => (
                  <FormItem className="flex flex-col flex-1">
                    <FormLabel>Padding</FormLabel>
                    <div className="flex gap-3">
                      <span className="font-medium text-sm">{value}px</span>
                      <Slider
                        defaultValue={[value]}
                        max={150}
                        step={1}
                        min={1}
                        onValueChange={v => onChange(v[0])}
                      />
                    </div>
                  </FormItem>
                )}
              />

              <Separator className="my-5" />

              <FormField
                control={form.control}
                name="options.fontSize"
                render={({ field: { onChange, value } }) => (
                  <FormItem className="flex flex-col flex-1">
                    <FormLabel>Font size</FormLabel>
                    <div className="flex gap-3">
                      <span className="font-medium text-sm">{value}px</span>
                      <Slider
                        defaultValue={[value]}
                        max={150}
                        step={1}
                        min={1}
                        onValueChange={v => onChange(v[0])}
                      />
                    </div>
                  </FormItem>
                )}
              />

              <Separator className="my-5" />

              <FormField
                control={form.control}
                name="options.fontBold"
                render={({ field: { onChange, value } }) => (
                  <FormItem className="flex flex-col flex-1">
                    <FormLabel>Font bold</FormLabel>
                    <Switch defaultChecked={value} onCheckedChange={onChange} />
                  </FormItem>
                )}
              />

              <Separator className="my-5" />

              <FormField
                control={form.control}
                name="options.fontUpperCase"
                render={({ field: { onChange, value } }) => (
                  <FormItem className="flex flex-col flex-1">
                    <FormLabel>Font case</FormLabel>
                    <ToggleGroup
                      className="justify-start"
                      defaultValue={value}
                      onValueChange={fontCase => {
                        if (textAreaRef.current) {
                          const { lyrics } = getLyricsAndTitleFromText(textAreaRef.current.value);

                          form.setValue("lyrics", formatStringCase(lyrics, fontCase));
                        }

                        onChange(fontCase);
                      }}
                      type="single"
                    >
                      <ToggleGroupItem value="uppercase">
                        <CaseUpper />
                      </ToggleGroupItem>
                      <ToggleGroupItem value="capitalize">
                        <CaseSensitive />
                      </ToggleGroupItem>
                      <ToggleGroupItem value="none">
                        <CaseLower />
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </FormItem>
                )}
              />

              <Separator className="my-5" />

              <FormField
                control={form.control}
                name="options.align"
                render={({ field: { onChange, value } }) => (
                  <FormItem className="flex flex-col flex-1">
                    <FormLabel>Text align</FormLabel>
                    <ToggleGroup
                      className="justify-start"
                      defaultValue={value}
                      onValueChange={onChange}
                      type="single"
                    >
                      <ToggleGroupItem value="left">
                        <AlignLeft />
                      </ToggleGroupItem>
                      <ToggleGroupItem value="center">
                        <AlignCenter />
                      </ToggleGroupItem>
                      <ToggleGroupItem value="right">
                        <AlignRight />
                      </ToggleGroupItem>
                      <ToggleGroupItem value="justify">
                        <AlignJustify />
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </FormItem>
                )}
              />

              <Separator className="my-5" />

              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Generating..." : "Generate PPTX"}
              </Button>
            </section>
          </form>
        </Form>
      </main>
    </>
  );
}
