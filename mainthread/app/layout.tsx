import '@fortawesome/fontawesome-free/css/all.min.css'; // import awesome font
import type { Metadata } from "next";

import StructuredData from "@/components/StructuredData";
import { Geist, Geist_Mono, Lora, Newsreader, Tinos } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

const tinos = Tinos({
  variable: "--font-tinos",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "mainThread",
  description: "mainThread News Website",
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "mainThread",
    description: "mainThread News Website",
    url: `${process.env.CLIENT_URL}`,
    siteName: "mainThread",
    images: [
      {
        url: `${process.env.CLIENT_URL}/logo.png`,
        width: 512,
        height: 512,
        alt: "mainThread",
      },
    ],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lora.variable} antialiased`}
      >
        <StructuredData />
        <div className="min-h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
