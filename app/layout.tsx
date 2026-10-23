import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-display", weight: ["400", "500", "600"] });
const sans = Manrope({ subsets: ["latin"], variable: "--font-sans", weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://amanda-teixeira-beauty.candygecko17.chatgpt.site"),
  title: { default: "Amanda Teixeira Beauty", template: "%s — Amanda Teixeira Beauty" },
  description: "Regeneração, micropigmentação, remoção a laser e formação profissional com atendimento individualizado.",
  alternates: { canonical: "/" },
  openGraph: { title: "Amanda Teixeira Beauty", description: "Sua beleza, minha especialidade.", type: "website", locale: "pt_BR" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" className={`${display.variable} ${sans.variable}`}><body>{children}</body></html>;
}
