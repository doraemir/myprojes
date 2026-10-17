'use client';
import {useState} from 'react';
import {BookOpen,Mail,LockKeyhole,UserRound,Eye,EyeOff,MailCheck,CalendarDays,Video,LoaderCircle,ChevronLeft} from 'lucide-react';
import {BotChallenge} from '@/components/bot-challenge';
import {ThemeToggle} from '@/components/theme-controls';
import {login,register,sendVerification,resetPassword,signOut,authorizedFetch} from '@/lib/client-auth';
type Mode='login'|'register'|'verify'|'reset';
export function AuthScreen({onReady,initialVerify=false,initialMode='login',onBack}:{onReady:()=>void;initialVerify?:boolean;initialMode?:'login'|'register';onBack?:()=>void}){
 const [mode,setMode]=useState<Mode>(initialVerify?'verify':initialMode);
 const [name,setName]=useState('');const [email,setEmail]=useState('');const [password,setPassword]=useState('');const [passwordAgain,setPasswordAgain]=useState('');const [showPassword,setShowPassword]=useState(false);
 const [captcha,setCaptcha]=useState('');const [captchaReset,setCaptchaReset]=useState(0);const [website,setWebsite]=useState('');const [remember,setRemember]=useState(false);const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');const [error,setError]=useState('');
 async function submit(event:React.FormEvent){
  event.preventDefault();setBusy(true);setError('');setMessage('');
  try{
   if(mode==='register'){if(!name.trim())throw new Error('Adını ve soyadını gir.');if(password!==passwordAgain)throw new Error('Şifreler aynı olmalı.');await register(email,password,name,captcha,website);setMode('verify');setMessage('Doğrulama bağlantısı e-postana gönderildi.');}
   else if(mode==='login'){await login(email,password,remember,captcha,website);onReady();}
   else if(mode==='reset'){await resetPassword(email,captcha,website);setMessage('Şifre sıfırlama bağlantısı gönderildi.');}
   else{const response=await authorizedFetch('/api/auth/me');if(!response.ok){const data=await response.json() as {error:string};throw new Error(data.error)}onReady();}
  }catch(error){setError((error as Error).message)}finally{setBusy(false);setCaptchaReset(n=>n+1)}
 }
 async function resend(){setBusy(true);setError('');try{await sendVerification();setMessage('Yeni doğrulama e-postası gönderildi.')}catch(error){setError((error as Error).message)}finally{setBusy(false)}}
 function changeMode(next:Mode){setMode(next);setError('');setMessage('');setShowPassword(false)}
 return <div className="auth-page auth-split">{onBack&&<button className="auth-back" onClick={onBack}><ChevronLeft size={17}/> LingoNova’ya dön</button>}
  <aside className="auth-story"><div className="auth-story-brand"><BookOpen size={25}/><span>LingoNova</span></div><div className="auth-story-copy"><span className="story-kicker">ONE LESSON AT A TIME</span><h2>A little practice.<br/><em>A lot of progress.</em></h2><p>Her ders, kendini daha rahat ifade etmeye bir adım daha yakın.</p><div className="auth-story-tools"><span><CalendarDays size={18}/> Ders programın</span><span><Video size={18}/> Canlı derslerin</span></div></div><span className="auth-story-footer">İNGİLİZCE ÖĞRENME YOLCULUĞUN</span></aside>
  <section className="auth-form-panel"><div className="auth-theme-control"><ThemeToggle/></div><div className="auth-card"><div className="auth-brand"><span className="brand-icon"><BookOpen size={23}/></span><strong>LingoNova</strong></div>{mode==='verify'&&<div className="auth-verify-icon"><MailCheck size={28}/></div>}<span className="eyebrow">{mode==='register'?'YENİ BİR BAŞLANGIÇ':mode==='verify'?'SON BİR ADIM':mode==='reset'?'HESABINA ERİŞ': 'TEKRAR MERHABA'}</span><h1>{mode==='register'?'Aramıza katıl.':mode==='verify'?'E-postanı doğrula.':mode==='reset'?'Şifreni yenile.':'Kaldığın yerden devam.'}</h1><p>{mode==='verify'?'E-postandaki bağlantıyı açtıktan sonra buradan devam et. Gelen kutusunda yoksa spam klasörüne de bak.':mode==='register'?'Hesabını oluştur, derslerini bir arada takip et.':mode==='reset'?'Sıfırlama bağlantısını e-postana göndereceğiz.':'Ders programın seni bekliyor. Hesabına giriş yap.'}</p>
   <form onSubmit={submit}>
    {mode==='register'&&<label><span><UserRound size={16}/> Adın ve soyadın</span><input autoComplete="name" required maxLength={100} value={name} onChange={event=>setName(event.target.value)} placeholder="Ad Soyad"/></label>}
    {mode!=='verify'&&<label><span><Mail size={16}/> E-posta</span><input type="email" autoComplete="email" required value={email} onChange={event=>setEmail(event.target.value)} placeholder="ornek@mail.com"/></label>}
    {(mode==='register'||mode==='login')&&<label><span><LockKeyhole size={16}/> Şifre</span><div className="password-field"><input type={showPassword?'text':'password'} autoComplete={mode==='register'?'new-password':'current-password'} minLength={mode==='register'?12:1} required value={password} onChange={event=>setPassword(event.target.value)} placeholder="Şifren"/><button type="button" aria-label={showPassword?'Şifreyi gizle':'Şifreyi göster'} aria-pressed={showPassword} onClick={()=>setShowPassword(!showPassword)}>{showPassword?<EyeOff size={19}/>:<Eye size={19}/>}</button></div></label>}
    {mode==='register'&&<label><span><LockKeyhole size={16}/> Şifreyi tekrar gir</span><input type={showPassword?'text':'password'} autoComplete="new-password" minLength={mode==='register'?12:1} required value={passwordAgain} onChange={event=>setPasswordAgain(event.target.value)} placeholder="Aynı şifreyi tekrar yaz"/></label>}
    {mode==='register'&&<p className="security-hint">En az 12 karakter; büyük harf, küçük harf, sayı ve özel işaret kullan.</p>}{mode==='login'&&<label className="remember-choice"><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)}/> Beni hatırla</label>}
    <label className="bot-trap" aria-hidden="true">Web sitesi<input value={website} onChange={e=>setWebsite(e.target.value)} tabIndex={-1} autoComplete="off"/></label>{mode!=='verify'&&<BotChallenge onToken={setCaptcha} resetKey={captchaReset}/>}
    {error&&<div className="auth-error" role="alert">{error}</div>}{message&&<div className="auth-message" role="status">{message}</div>}
    <button className="auth-submit" disabled={busy}>{busy?<><LoaderCircle className="spin" size={18}/> Lütfen bekle…</>:mode==='register'?'Hesabımı oluştur':mode==='verify'?'Doğruladım, devam et':mode==='reset'?'Bağlantıyı gönder':'Giriş yap'}</button>
   </form>
   {mode==='verify'?<div className="auth-links"><button onClick={resend} disabled={busy}>E-postayı yeniden gönder</button><button onClick={()=>{signOut();changeMode('login')}}>Farklı hesapla giriş yap</button></div>:<div className="auth-links">{mode==='login'&&<button onClick={()=>changeMode('reset')}>Şifremi unuttum</button>}<button onClick={()=>changeMode(mode==='register'||mode==='reset'?'login':'register')}>{mode==='register'||mode==='reset'?'Zaten hesabın var mı? Giriş yap':'Hesabın yok mu? Kayıt ol'}</button></div>}
  </div><p className="auth-footer">Her gün küçük bir adım, yarın büyük bir fark.</p></section>
 </div>;
}
