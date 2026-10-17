'use client';
import {useEffect,useState} from 'react';
import {Palette,UserRound,Check,LoaderCircle} from 'lucide-react';
import {AppearanceSettings} from '@/components/theme-controls';
import {ProfilePhotoSetting} from '@/components/profile-photo';
export function AccountSettings({name,email,busy,onSave,photoUrl,hasPhoto,photoError,onPhotoChanged}:{name:string;email:string;busy:boolean;onSave:(name:string)=>Promise<void>;photoUrl:string;hasPhoto:boolean;photoError:string;onPhotoChanged:()=>Promise<void>}){
 const [value,setValue]=useState(name);useEffect(()=>setValue(name),[name]);
 return <div className="settings-grid"><section className="card settings-card"><div className="form-heading"><span className="section-symbol"><UserRound size={20}/></span><div><h2>Profil bilgilerin</h2><p>Sana nasıl hitap edelim?</p></div></div><ProfilePhotoSetting src={photoUrl} hasPhoto={hasPhoto} loadError={photoError} onChanged={onPhotoChanged}/><form className="lesson-form" onSubmit={event=>{event.preventDefault();onSave(value)}}><label>Adın ve soyadın<input required maxLength={100} autoComplete="name" value={value} onChange={event=>setValue(event.target.value)} placeholder="Ad Soyad"/></label><div className="settings-email"><span>E-posta adresin</span><p>{email}</p></div><button className="primary-button" disabled={busy||!value.trim()||value.trim()===name.trim()}>{busy?<><LoaderCircle className="spin" size={17}/> Kaydediliyor…</>:<><Check size={17}/> Değişiklikleri kaydet</>}</button></form></section><section className="card settings-card"><div className="form-heading"><span className="section-symbol"><Palette size={20}/></span><div><h2>Görünüm</h2><p>LingoNova'yı kendine göre ayarla.</p></div></div><AppearanceSettings/></section></div>;
}
