import type { Metadata } from "next";
import "./globals.css";
import Footer from "./components/layout/footer";
import Navbar from "./components/layout/navbar";

export const metadata: Metadata = {
  title: "Federal University of Technology, Owerri",
  description: "FUTO's institutional website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex flex-col min-h-screen">
        <Navbar />

        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
