import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ProviderWrapper from "@/redux/ProviderWrapper";
import NavbarWrapper from "@/components/NavbarWrapper";
import { ToastProvider } from "@/components/Toast"; 
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Taskify",
  description: "Task Management App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white">
        <ProviderWrapper>
          <ToastProvider>
            <NavbarWrapper />
            <Toaster position="top-right" reverseOrder={false} />
            <main>{children}</main>
          </ToastProvider>
        </ProviderWrapper>
      </body>
    </html>
  );
}
