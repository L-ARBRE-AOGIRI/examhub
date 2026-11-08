import { Bricolage_Grotesque, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SCRIPT_THEME } from "@/components/BoutonTheme";

const titre = Bricolage_Grotesque({
  variable: "--font-titre",
  subsets: ["latin"],
});

const corps = Plus_Jakarta_Sans({
  variable: "--font-corps",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ExamHECM — Les épreuves de HECM au même endroit",
  description: "Épreuves, cours, concours et examens des étudiants de HECM",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="fr"
      className={`${titre.variable} ${corps.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_THEME }} />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          <Navbar />
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
