import "./globals.css";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/components/AuthProvider";

const heading = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-heading", weight: ["600", "700", "800"] });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata = {
  title: "Physics Runway | Class 11, 12, JEE & NEET Coaching",
  description: "Premium coaching for Class 11, Class 12, JEE and NEET",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body>
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
