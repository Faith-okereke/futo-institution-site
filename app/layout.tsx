import type { Metadata } from "next";
import "./globals.css";
import Footer from "./components/layout/footer";
import Navbar from "./components/layout/navbar";
import { Inter, Playfair_Display } from "next/font/google";

export const metadata: Metadata = {
  title: "Federal University of Technology, Owerri",
  description: "FUTO's institutional website",
};
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable:"--font-inter"
});
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="flex flex-col min-h-screen">
        <Navbar />

        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
