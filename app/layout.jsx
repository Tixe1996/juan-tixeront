import "./globals.css";
import "./consulting.css";
import SiteFrame from "./components/site-frame";
import { TransitionProvider } from "./components/transition-link";

export const metadata = {
  metadataBase: new URL("https://tixe1996.github.io/juan-tixeront/"),
  title: {
    default: "Juan Tixeront | Aerospace Engineering & Scientific Computing",
    template: "%s | Juan Tixeront",
  },
  description:
    "Franco-Spanish aeronautical engineering student at IPSA, with experience at PLD Space. Explore aerospace design, numerical simulation, data science and financial modelling projects.",
  openGraph: {
    title: "Juan Tixeront | Aerospace Engineering & Scientific Computing",
    description:
      "Engineering precision. Scientific curiosity. Aerospace, simulation, data and an international perspective.",
    type: "website",
    images: [
      {
        url: "https://tixe1996.github.io/juan-tixeront/assets/juan-tixeront-portrait.webp",
        width: 1536,
        height: 1024,
        alt: "Juan Tixeront",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <TransitionProvider>
          <SiteFrame>{children}</SiteFrame>
        </TransitionProvider>
      </body>
    </html>
  );
}
