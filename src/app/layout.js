"use client"
import localFont from "next/font/local";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Header from "./compoents/Header";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';



const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SessionProvider>
          <Header />
        <ToastContainer />
        {children}
        </SessionProvider>
      </body>
    </html>
  );
}
