"use client"
import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google'
import "./globals.css";
import useServiceWorker from "./service-worker-register";

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  useServiceWorker();
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/logo.png"></link>
        <meta name="theme-color" content="#8200db"/>
        <title>Venture</title>
        <meta name="description" content="Descubre y disfruta de los mejores eventos cerca de ti. Conciertos, festivales, fiestas y mucho más en una sola aplicación." />
      </head> 
      <body
        className={`${inter.className} antialiased`}
      >
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
