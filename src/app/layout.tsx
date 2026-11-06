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

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://niceinsurance.frequnsync.online";

const description =
  "Insurance advisory workspace for NICE – Network of Insurance & Claims Expert, Raipur, Chhattisgarh. Truck, car, bike, health, home, office, shop and travel insurance.";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "NICE – Network of Insurance & Claims Expert | Insurance Advisory Workspace",
  description,
  openGraph: {
    title: "NICE – Network of Insurance & Claims Expert",
    description,
    url: appUrl,
    siteName: "NICE – Network of Insurance & Claims Expert",
    type: "website",
  },
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
