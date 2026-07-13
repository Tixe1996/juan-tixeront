import "./globals.css";

export const metadata = {
  title: "Juan Tixeront | Aerospace & Data Science Portfolio",
  description:
    "Portfolio of Juan Tixeront, an aeronautical engineering student focused on aerospace systems, numerical methods and data science."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
