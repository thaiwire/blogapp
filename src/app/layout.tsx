import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";



export const metadata: Metadata = {
  title: "Blog App",
  description: "A simple blog application built with Next.js",
};

const montserratFont = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserratFont.variable} ${montserratFont.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
