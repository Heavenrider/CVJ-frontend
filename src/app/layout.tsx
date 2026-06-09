import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Poppins, Montserrat } from "next/font/google";
import "./globals.css";

// Load Premium Typography Fonts
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// Configure SEO Metadata
export const metadata: Metadata = {
  metadataBase: new URL("https://srichakrajewellers.com"),
  title: "Sri Chakra Veeralakshmi Jewellery Works | Alamuru",
  description: "Experience luxury and trust at Sri Chakra Veeralakshmi Jewellery Works by Vasabattula Srinivasu in Alamuru, AP. Handcrafted, BIS 916 Hallmarked gold and silver creations.",
  keywords: [
    "Sri Chakra Veeralakshmi Jewellery Works",
    "Vasabattula Srinivasu",
    "Gold Jewellery Alamuru",
    "Silver Jewellery Alamuru",
    "BIS 916 Hallmark Gold AP",
    "Custom jewellery orders Andhra Pradesh",
    "Live Gold Rates Alamuru",
    "Jewellery Shop near Ramu Medicals Alamuru"
  ],
  authors: [{ name: "Vasabattula Srinivasu" }],
  icons: {
    icon: "/assets/logo.jpg",
    apple: "/assets/logo.jpg",
  },
  openGraph: {
    title: "Sri Chakra Veeralakshmi Jewellery Works",
    description: "Where Tradition Meets Timeless Elegance. Handcrafted BIS 916 Hallmarked Gold & Silver in Alamuru, AP.",
    url: "https://srichakrajewellers.com",
    siteName: "Sri Chakra Veeralakshmi Jewellery Works",
    images: [
      {
        url: "/assets/logo.jpg",
        width: 800,
        height: 800,
        alt: "Sri Chakra Veeralakshmi Jewellery Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cormorant.variable} ${poppins.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory-white text-luxury-black font-sans">
        {children}
      </body>
    </html>
  );
}
