import type { Metadata } from "next";
import { Courier_Prime } from "next/font/google";
import "./globals.css";

const courierPrime = Courier_Prime({
  variable: "--font-courier-prime",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "PAUL FUSTER // ARCHIVE & WORKSHOP",
  description:
    "Experimental brutalist platform. Archive, workshop and sound cartography of Paul Fuster — unclassifiable songwriter based in Cardona (Bages).",
  keywords: [
    "Paul Fuster",
    "Cardona",
    "Bages",
    "folk-rock",
    "workshop",
    "bicycle tour",
    "Repte",
    "Happy Nothing",
    "Go/Between",
    "Organ-ism",
    "brutalist web",
  ],
  authors: [{ name: "Paul Fuster Archive" }],
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='black'/%3E%3Ctext x='16' y='22' font-family='monospace' font-size='18' font-weight='bold' fill='white' text-anchor='middle'%3EPF%3C/text%3E%3C/svg%3E",
  },
  openGraph: {
    title: "PAUL FUSTER // ARCHIVE & WORKSHOP",
    description: "Experimental brutalist platform. Archive, workshop and sound cartography.",
    siteName: "Paul Fuster Archive",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ca" suppressHydrationWarning>
      <body
        className={`${courierPrime.variable} antialiased bg-background text-foreground`}
        style={{ fontFamily: "var(--font-courier-prime), 'Courier Prime', 'Courier New', monospace" }}
      >
        {children}
      </body>
    </html>
  );
}
