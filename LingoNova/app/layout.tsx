import type { Metadata } from "next";
import "./globals.css";
import {WorkspaceEffects} from '@/components/workspace-effects';
import {AppThemeProvider} from '@/components/theme-controls';

export const metadata: Metadata = {
  metadataBase: new URL("https://ingilizce-ders-programi.emircanndora.chatgpt.site"),
  title: "LingoNova | İngilizce Öğrenme Alanın",
  description: "Ders programın, canlı derslerin ve ödeme takibin tek bir yerde.",
  openGraph: {title:"LingoNova | Birlikte öğren, kendini aş",description:"Canlı ders, ortak tahta ve sana ait öğrenme alanı.",locale:"tr_TR",type:"website",images:[{url:"/images/learning-worlds.png",width:1200,height:630,alt:"LingoNova İngilizce öğrenme alanı"}]},
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="antialiased"><AppThemeProvider>{children}<WorkspaceEffects/></AppThemeProvider></body>
    </html>
  );
}
