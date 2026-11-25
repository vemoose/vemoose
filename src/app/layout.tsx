import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vemoose.com"),
  title: {
    default: "Vemoose — Independent product studio",
    template: "%s · Vemoose",
  },
  description:
    "Digital products, useful tools, and experiments born from curiosity. An independent studio by Vemoose.",
  openGraph: {
    title: "Vemoose — Ideas into existence.",
    description:
      "Independent product studio building digital products, tools, and experiments.",
    url: "https://vemoose.com",
    siteName: "Vemoose",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vemoose",
    description:
      "Independent product studio — digital products, tools, and experiments.",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      id="top"
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}