import "./globals.css";
import SiteFrame from "./components/site-frame";
import { TransitionProvider } from "./components/transition-link";

export const metadata = {
  metadataBase: new URL("https://tixe1996.github.io/juan-tixeront/"),
  title: {
    default: "Juan Tixeront | Engineering, Finance & Aviation",
    template: "%s | Juan Tixeront",
  },
  description:
    "Franco-Spanish aeronautical engineering student at IPSA, with experience at PLD Space. Explore projects, experience and ambitions in finance, aviation and client-facing roles.",
  openGraph: {
    title: "Juan Tixeront | Engineering, Finance & Aviation",
    description:
      "Engineering precision. Commercial curiosity. Experience, projects and an international perspective.",
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
