'use client';
import {useEffect,useState} from 'react';
import {Trash2,ShieldAlert,RefreshCw} from 'lucide-react';
import {authorizedFetch} from '@/lib/client-auth';
import {useActionDialog} from '@/components/action-dialog';
type Summary={token:string;lessons:number;payments:number;activeRooms:number};
async function request(method='GET',body?:unknown){const r=await authorizedFetch('/api/admin/data',{method,headers:{'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});const d=await r.json() as Summary&{error?:string};if(!r.ok)throw Error(d.error||'İşlem tamamlanamadı.');return d;}
export function AdminData({onChanged}:{onChanged:()=>Promise<void>}){
 const [data,setData]=useState<Summary|null>(null),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[error,setError]=useState('');const {ask,dialog}=useActionDialog();
 async function load(){setError('');try{setData(await request())}catch(e){setData(null);setError((e as Error).message)}}
 useEffect(()=>{load()},[]);
 async function remove(scope:'lessons'|'payments'){
  if(busy)return;setBusy(true);setError('');setMessage('');
  try{
   const current=await request();setData(current);if(current.activeRooms)throw Error('Önce açık canlı dersleri sonlandırın.');
   const phrase=scope==='lessons'?'TÜM DERSLERİ SİL':'TÜM TAHSİLATLARI SİL';
   const answer=await ask({title:'Emin misin?',danger:true,submit:'Evet, kalıcı olarak sil',description:scope==='lessons'?`${current.lessons} ders ve ${current.payments} tahsilat kalıcı olarak silinecek. Ders talepleri ve canlı oda geçmişi de temizlenecek. Atölye çalışmaları korunur, ders bağlantıları kaldırılır. Bu işlem bütün öğretmenlerin ve test etiketli kayıtların tamamını kapsar.`:`${current.payments} tahsilat ve düzeltme kaydı kalıcı olarak silinecek. Dersler korunacak; kalan borçlar yeniden hesaplanacak. Bu işlem banka veya ödeme sağlayıcısında para iadesi yapmaz.`,fields:[{name:'confirmation',label:`Onay için ${phrase} yaz`,required:true},{name:'reason',label:'İşlem nedeni',required:true}]});
   if(!answer)return;if(answer.confirmation!==phrase)throw Error('Onay metni eşleşmiyor; hiçbir kayıt silinmedi.');
   await request('DELETE',{scope,token:current.token,...answer});setMessage('İşlem tamamlandı ve etkinlik geçmişine kaydedildi.');await onChanged();await load();
  }catch(e){setError((e as Error).message)}finally{setBusy(false)}
 }
 return <>{dialog}<section className="card settings-card admin-data-intro"><ShieldAlert size={28}/><h2>Yönetici veri yönetimi</h2><p>Tüm öğretmenlerin ders ve tahsilat kayıtları üzerinde işlem yapabilirsin. Öğrenci hesapları, profiller, atölye çalışmaları ve denetim geçmişi korunur.</p><p>Kalıcı silme geri alınamaz. İstersen önce Etkinlik geçmişi ekranından veritabanı yedeği al.</p><button disabled={busy} onClick={load}><RefreshCw size={16}/> Kayıt sayılarını yenile</button>{data?<p><b>{data.lessons} ders · {data.payments} tahsilat · {data.activeRooms} açık canlı ders</b></p>:!error&&<p role="status">Kayıt sayıları yükleniyor…</p>}{error&&<p role="alert" className="auth-message">{error}</p>}{message&&<p role="status">{message}</p>}</section><div className="settings-grid"><section className="card settings-card"><h2>Tüm tahsilatları sil</h2><p>Tahsilat ve düzeltme kayıtlarını temizler. Tamamlanan dersler için ödenmemiş tutarlar tekrar görünür.</p><button className="danger-button" disabled={busy||!data||!data.payments||!!data.activeRooms} onClick={()=>remove('payments')}><Trash2 size={17}/> Tahsilatları temizle</button></section><section className="card settings-card"><h2>Tüm dersleri ve tahsilatları sil</h2><p>Dersler, bağlı tahsilatlar, ders talepleri ve canlı oda geçmişi temizlenir. Planlı hatırlatmalar önce iptal edilir.</p><button className="danger-button" disabled={busy||!data||!data.lessons||!!data.activeRooms} onClick={()=>remove('lessons')}><Trash2 size={17}/> Dersleri ve tahsilatları temizle</button></section></div></>;
}
