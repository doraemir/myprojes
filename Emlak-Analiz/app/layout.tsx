import type { Metadata } from 'next';
export const metadata: Metadata={title:'EvPusula — İlanı buldunuz. Şimdi tamamını görün.',description:'Bulduğunuz evin fiyatını, çevresini, ulaşımını, kontrol noktalarını ve alternatiflerini tek bir raporda inceleyin.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="tr"><body style={{margin:0}}>{children}</body></html>}
