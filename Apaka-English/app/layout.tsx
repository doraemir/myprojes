import type { Metadata } from 'next';
export const metadata: Metadata = {title:'Apaka Online Dil Okulu',description:'Apaka öğrenci portalı ve yönetim paneli.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="tr"><body style={{margin:0}}>{children}</body></html>}
