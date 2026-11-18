import "./globals.css";

export const metadata = {
  title: "Physics Runway",
  description: "Premium coaching for Class 11, 12, JEE and NEET",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
