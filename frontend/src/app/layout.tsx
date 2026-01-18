import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { I18nProvider } from "@/contexts/I18nContext";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Smart Restaurant",
  description: "A smart restaurant management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased`}
      >
        <I18nProvider>
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              duration: 3000,
              style: {
                background: "#333",
                color: "#fff",
                borderRadius: "10px",
              },
              success: {
                style: {
                  background: "green",
                },
                iconTheme: {
                  primary: "white",
                  secondary: "green",
                },
              },
            }}
          />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
