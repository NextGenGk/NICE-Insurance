import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Questrial, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const questrial = Questrial({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-mono-brand",
});

export const metadata: Metadata = {
  title: "NICE – Network of Insurance & Claims Expert | Insurance Advisory Workspace",
  description:
    "Insurance advisory workspace for NICE – Network of Insurance & Claims Expert, Raipur, Chhattisgarh. Truck, car, bike, health, home, office, shop and travel insurance.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider signInUrl="/sign-in" signUpUrl="/sign-up" afterSignOutUrl="/sign-in">
      <html lang="en">
        <body className={`${questrial.variable} ${inter.variable} ${plexMono.variable} antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
