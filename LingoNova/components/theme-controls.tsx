'use client';
import {useEffect,useState} from 'react';
import {ThemeProvider,useTheme} from 'next-themes';
import {Check,Moon,Sun} from 'lucide-react';
import {Toaster} from 'sonner';

export function AppThemeProvider({children}:{children:React.ReactNode}){
 return <ThemeProvider attribute="data-theme" storageKey="lingonova-theme" defaultTheme="light" enableSystem={false} themes={['light','dark']} enableColorScheme disableTransitionOnChange>{children}</ThemeProvider>;
}

export function AppToaster(){const {theme}=useTheme();return <Toaster position="top-right" theme={theme==='dark'?'dark':'light'} richColors/>;}

export function ThemeToggle(){
 const {theme,setTheme}=useTheme();const [mounted,setMounted]=useState(false);
 useEffect(()=>setMounted(true),[]);
 const dark=mounted&&theme==='dark';const label=dark?'Gündüz moduna geç':'Gece moduna geç';
 return <button type="button" className="theme-toggle" disabled={!mounted} aria-label={label} title={label} onClick={()=>setTheme(dark?'light':'dark')}><span className="theme-sun"><Sun size={20}/></span><span className="theme-moon"><Moon size={20}/></span></button>;
}

export function AppearanceSettings(){
 const {theme,setTheme}=useTheme();const [mounted,setMounted]=useState(false);
 useEffect(()=>setMounted(true),[]);
 return <div className="appearance-settings"><div className="appearance-options" aria-label="Görünüm seçimi">{([{id:'light',label:'Gündüz',description:'Aydınlık yüzeyler, mavi detaylar.',icon:<Sun size={23}/>},{id:'dark',label:'Gece',description:'Koyu lacivert, yumuşak kontrast.',icon:<Moon size={23}/>}]).map(option=><button type="button" key={option.id} className={'appearance-option '+(mounted&&theme===option.id?'selected':'')} disabled={!mounted} aria-pressed={mounted&&theme===option.id} onClick={()=>setTheme(option.id)}><span className={'theme-preview '+option.id} aria-hidden="true"><i/><span><b/><b/><b/></span></span><span className="appearance-label">{option.icon}<b>{option.label}</b>{mounted&&theme===option.id&&<Check size={17} className="appearance-check"/>}</span><small>{option.description}</small></button>)}</div><p>Seçimin bu cihazda hatırlanır; bir sonraki girişinde de aynı görünüm açılır.</p></div>;
}
