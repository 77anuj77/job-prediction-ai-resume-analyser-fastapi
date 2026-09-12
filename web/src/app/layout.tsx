import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Chrome } from "@/components/chrome";
import { LoadingOverlay } from "@/components/loading";
import { ToastProvider } from "@/components/toast";
import { StoreProvider } from "@/lib/store";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ResumeAI — Turn your resume into your competitive advantage",
  description:
    "Private-first ATS resume analysis. Drop your resume, see your score in seconds, and get a prioritized plan to rank higher.",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "ResumeAI",
    description: "Private-first ATS resume analysis with a prioritized improvement plan.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${plusJakarta.variable}`}>
      <body className="min-h-[100dvh] antialiased">
        <StoreProvider>
          <ToastProvider>
            <Chrome />
            <Navbar />
            {children}
            <Footer />
            <LoadingOverlay />
          </ToastProvider>
        </StoreProvider>
      </body>
    </html>
  );
}