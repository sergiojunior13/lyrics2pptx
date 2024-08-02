import type { Metadata } from "next";

import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import { GoogleAnalytics } from "@/components/config/google-analytics";

const inter = Inter({ subsets: ["latin"] });

const url = process.env.URL || "https://lyrics2pptx.vercel.app";

const { title, images, description } = {
  title: "Lyrics2PPTX: Convert Song Lyrics to PPTX Presentations",
  description:
    "Effortlessly convert song lyrics into PowerPoint presentations with Lyrics2PPTX. Ideal for churches, musicians, teachers, and more. Create personalized PPTX slides from your favorite lyrics. Try it now!",
  images: [
    {
      url: `${url}/site-shot.png`,
      width: 1024,
      height: 768,
      alt: "Lyrics2PPTX website screenshot",
    },
    {
      url: `${url}/banner.png`,
      width: 1440,
      height: 1080,
      alt: "Lyrics2PPTX banner",
    },
  ],
};

export const metadata: Metadata = {
  title,
  description,
  applicationName: title,
  manifest: `${url}/manifest.json`,
  appleWebApp: {
    title,
    statusBarStyle: "black-translucent",
  },
  keywords:
    "convert song lyrics, PPTX presentations, church presentations, musician tools, teacher resources, PowerPoint lyrics, lyrics to PPTX, Lyrics2PPTX",
  authors: { name: "Sérgio Júnior", url: "https://linkedin.com/in/sergiojunior15" },
  robots: "index, follow",
  openGraph: {
    title,
    description,
    images,
    url,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images,
  },
  other: {
    "msapplication-TileColor": "#ffffff",
    "theme-color": "#ffffff",
  },
  icons: {
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#5bbad5",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleAnalytics />

      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <header className="p-4 bg-foreground flex gap-4 items-center">
          <Image src="/logo.png" alt="logo" width={32} height={40} className="h-full w-auto" />
          <h1 className="text-2xl font-bold text-background">Lyrics2PPTX</h1>
        </header>

        {children}

        <footer className="bg-foreground text-background py-4 text-center text-xs mt-10">
          <div className="flex gap-2 mx-auto w-min mb-3">
            <Image src="/logo.png" alt="logo" width={32} height={40} className="h-6 w-auto" />
            <span className="text-lg font-bold text-background">Lyrics2PPTX</span>
          </div>

          <p>
            Copyright © 2024{" "}
            <a
              target="_blank"
              href="https://linkedin.com/in/sergiojunior15"
              className="text-accent font-bold"
            >
              Sérgio Júnior
            </a>
            . All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
