import type { Metadata } from "next";

import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lyrics2PPTX: Transform Lyrics Into Presentation File",
  description: "Generate presentations from lyrics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
