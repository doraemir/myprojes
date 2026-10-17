import {account} from '@/lib/auth';
import {env} from 'cloudflare:workers';
import {digest,jsonBody} from '@/lib/security';
import {cancelReminder} from '@/lib/mailer';
const tables=['lessons','payments','lesson_requests','live_rooms','live_peers','live_events'] as const;
const signature=(table:string)=>`(SELECT COALESCE(json_group_array(id),'[]') FROM (SELECT id FROM ${table} ORDER BY id))`;
async function snapshot(){
 const db=env.DB!;const values:Record<string,string>={};
 // One statement gives an internally consistent preview of every affected table.
 const row=await db.prepare('SELECT '+tables.map(t=>signature(t)+' AS '+t).join(',')).first<Record<string,string>>();
 for(const t of tables)values[t]=row![t];
 const active=await db.prepare('SELECT COUNT(*) n FROM live_rooms WHERE ended_at IS NULL AND heartbeat>?').bind(Date.now()-90000).first<{n:number}>();
 return {values,token:await digest(JSON.stringify(values)),lessons:JSON.parse(values.lessons).length,payments:JSON.parse(values.payments).length,activeRooms:active?.n||0};
}
export async function GET(request:Request){const user=await account(request);if(user instanceof Response)return user;if(!user.admin)return Response.json({error:'Bu ekran yalnızca yöneticiye açıktır.'},{status:403});const s=await snapshot();return Response.json({token:s.token,lessons:s.lessons,payments:s.payments,activeRooms:s.activeRooms},{headers:{'Cache-Control':'no-store'}});}
export async function DELETE(request:Request){
 const user=await account(request);if(user instanceof Response)return user;
 if(!user.admin)return Response.json({error:'Toplu silme yalnızca yöneticiye açıktır.'},{status:403});
 let body:Record<string,unknown>;try{body=await jsonBody(request,2000)}catch{return Response.json({error:'Geçersiz istek.'},{status:400})}
 const scope=body.scope;if(scope!=='payments'&&scope!=='lessons')return Response.json({error:'Geçersiz silme alanı.'},{status:400});
 const phrase=scope==='lessons'?'TÜM DERSLERİ SİL':'TÜM TAHSİLATLARI SİL';
 if(body.confirmation!==phrase||typeof body.reason!=='string'||body.reason.trim().length<3||body.reason.length>500)return Response.json({error:'Onay metnini ve işlem nedenini kontrol edin.'},{status:400});
 const s=await snapshot();if(body.token!==s.token)return Response.json({error:'Kayıtlar değişti. Sayıları yenileyip tekrar onaylayın.'},{status:409});
 if(s.activeRooms)return Response.json({error:'Önce açık canlı dersleri sonlandırın.'},{status:409});
 if(scope==='lessons'){
  const pending=await env.DB!.prepare("SELECT id,reminder_email_id FROM lessons WHERE status='pending' AND reminder_minutes>0 AND reminder_sent=0").all<{id:string;reminder_email_id:string|null}>();
  try{for(const l of pending.results)await cancelReminder(l.reminder_email_id||l.id)}catch{return Response.json({error:'Planlı hatırlatmalar iptal edilemedi. Kayıtlar silinmedi; mail bağlantısını kontrol edip yeniden deneyin.'},{status:502})}
 }
 const guard=tables.map(t=>signature(t)+'=?').join(' AND ')+ ' AND NOT EXISTS (SELECT 1 FROM live_rooms WHERE ended_at IS NULL AND heartbeat>?)';
 // The NOT NULL constraint aborts the entire D1 transaction if the preview changed.
 const gate=env.DB!.prepare(`INSERT INTO audit_events(id,actor_uid,actor_email,action,target,details,created_at) VALUES(?,CASE WHEN ${guard} THEN ? ELSE NULL END,?,?,?,?,?)`).bind(crypto.randomUUID(),...tables.map(t=>s.values[t]),Date.now()-90000,user.uid,user.email,'data.bulk_deleted',scope,JSON.stringify({reason:body.reason.trim(),lessons:scope==='lessons'?s.lessons:0,payments:s.payments}),new Date().toISOString());
 const statements=[gate,env.DB!.prepare('DELETE FROM payments')];
 if(scope==='lessons')statements.push(env.DB!.prepare('DELETE FROM live_events'),env.DB!.prepare('DELETE FROM live_peers'),env.DB!.prepare('DELETE FROM live_rooms'),env.DB!.prepare('DELETE FROM lesson_requests'),env.DB!.prepare('UPDATE learning_activities SET lesson_id=NULL WHERE lesson_id IS NOT NULL'),env.DB!.prepare('DELETE FROM lessons'));
 try{await env.DB!.batch(statements)}catch{return Response.json({error:'Silme tamamlanmadı; kayıtlar değişmiş olabilir. Listeyi yenileyin. Veritabanı işlemi geri alındı.'},{status:409})}
 return Response.json({ok:true,deletedLessons:scope==='lessons'?s.lessons:0,deletedPayments:s.payments});
}
