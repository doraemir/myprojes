import {env} from 'cloudflare:workers';
import {account,can,ownerOfLesson,ownerOfStudent} from '@/lib/auth';
type Room={id:string;lesson_id:string;host_uid:string;invited:string;started_at:number;heartbeat:number;ended_at:number|null};
type Peer={id:string;room_id:string;uid:string;name:string;approved:number;heartbeat:number};
type Lesson={id:string;topic:string;description:string;starts_at:string;teacher_email:string;student_uid:string|null;status:string};
const turnCache=new Map<string,{expires:number;servers:RTCIceServer[]}>();
async function iceServers(key:string){const config=env as unknown as {LIVE_TURN_KEY_ID?:string;LIVE_TURN_API_TOKEN?:string};if(!config.LIVE_TURN_KEY_ID||!config.LIVE_TURN_API_TOKEN)return [{urls:'stun:stun.cloudflare.com:3478'}];const cached=turnCache.get(key);if(cached&&cached.expires>Date.now())return cached.servers;const r=await fetch(`https://rtc.live.cloudflare.com/v1/turn/keys/${encodeURIComponent(config.LIVE_TURN_KEY_ID)}/credentials/generate-ice-servers`,{method:'POST',headers:{Authorization:`Bearer ${config.LIVE_TURN_API_TOKEN}`,'Content-Type':'application/json'},body:JSON.stringify({ttl:7200}),signal:AbortSignal.timeout(10000)});if(!r.ok)throw Error('TURN credentials unavailable');const data=await r.json() as {iceServers:RTCIceServer[]};if(turnCache.size>500)turnCache.clear();turnCache.set(key,{expires:Date.now()+3600000,servers:data.iceServers});return data.iceServers}
const bad=(error:string,status=400)=>Response.json({error},{status});
export async function GET(request:Request){return handle(request)}
export async function POST(request:Request){return handle(request)}
async function handle(request:Request){
 const user=await account(request);if(user instanceof Response)return user;const db=env.DB;if(!db)return bad('Canlı ders servisi hazır değil.',503);
 const now=Date.now();const url=new URL(request.url);
 try{
 if(request.method==='GET'&&!url.searchParams.get('lesson')){
 const result=await db.prepare("SELECT r.*,l.topic,l.starts_at,l.teacher_email,l.student_uid FROM live_rooms r JOIN lessons l ON l.id=r.lesson_id WHERE r.ended_at IS NULL AND r.heartbeat>? AND l.status='pending' ORDER BY r.started_at DESC").bind(now-90000).all<Room&Lesson>();
 const rooms=[];for(const r of result.results){if(r.student_uid!==user.uid&&!JSON.parse(r.invited).includes(user.uid)&&!ownerOfLesson(user,r.teacher_email))continue;const peers=await db.prepare('SELECT name,approved FROM live_peers WHERE room_id=? AND heartbeat>?').bind(r.id,now-45000).all();rooms.push({id:r.id,lesson_id:r.lesson_id,topic:r.topic,started_at:r.started_at,peers:peers.results,host:ownerOfLesson(user,r.teacher_email)&&can(user,'lessons')})}return Response.json(rooms,{headers:{'Cache-Control':'no-store'}});
 }
 const lessonId=url.searchParams.get('lesson')||'';const lesson=await db.prepare('SELECT * FROM lessons WHERE id=?').bind(lessonId).first<Lesson>();
 if(!lesson)return bad('Ders bulunamadı.',404);
 if(user.role!=='student'&&!can(user,'lessons'))return bad('Canlı ders yetkiniz yok.',403);
 const host=ownerOfLesson(user,lesson.teacher_email)&&can(user,'lessons');
 let room=await db.prepare('SELECT * FROM live_rooms WHERE lesson_id=? AND ended_at IS NULL AND heartbeat>? ORDER BY started_at DESC LIMIT 1').bind(lessonId,now-90000).first<Room>();
 if(lesson.student_uid!==user.uid&&!ownerOfLesson(user,lesson.teacher_email)&&!JSON.parse(room?.invited||'[]').includes(user.uid))return bad('Bu ders için erişiminiz yok.',403);
 const peerId=url.searchParams.get('peer')||'';let peer=room&&peerId?await db.prepare('SELECT * FROM live_peers WHERE id=? AND room_id=? AND uid=?').bind(peerId,room.id,user.uid).first<Peer>():null;
 if(request.method==='GET'){
 if(url.searchParams.get('ice')==='1'){if(!peer?.approved||peer.heartbeat<now-45000)return bad('Öğretmen onayı gerekli.',403);return Response.json({iceServers:await iceServers(room!.id+user.uid)},{headers:{'Cache-Control':'no-store'}})}
 if(!room)return Response.json({lesson,host,room:null,peers:[],events:[]});
 const peers=peer?await db.prepare('SELECT id,name,approved,uid FROM live_peers WHERE room_id=? AND heartbeat>?').bind(room.id,now-45000).all():{results:[]};
 const cursor=Math.max(0,Number(url.searchParams.get('after'))||0);
 const events=peer?.approved?await db.prepare("SELECT id,sender,kind,payload FROM live_events WHERE room_id=? AND id>? AND (recipient='' OR recipient=?) ORDER BY id LIMIT 300").bind(room.id,cursor,peerId).all():{results:[]};
 return Response.json({lesson,host:host&&room.host_uid===user.uid,room,peer,peers:peers.results,events:events.results,iceServers:[{urls:'stun:stun.cloudflare.com:3478'}]},{headers:{'Cache-Control':'no-store'}});
 }
 const text=await request.text();if(text.length>70000)return bad('İstek çok büyük.',413);const body=JSON.parse(text) as Record<string,unknown>;const action=body.action;
 if(action==='join'){
 if(lesson.status!=='pending')return bad('Bu ders tamamlandı veya iptal edildi.',409);
 if(!room){if(!host)return bad('Öğretmen henüz dersi başlatmadı.',409);const invited=Array.isArray(body.invited)?[...new Set(body.invited.map(String))].filter(uid=>uid!==lesson.student_uid):[];if(invited.length>2)return bad('En fazla iki ek öğrenci davet edebilirsiniz.');for(const uid of invited){const student=await db.prepare('SELECT owner_email FROM students WHERE account_uid=?').bind(uid).first<{owner_email:string}>();if(!student||!ownerOfStudent(user,student.owner_email))return bad('Davet edilecek öğrenci size bağlı değil.',403)}const id=crypto.randomUUID();await db.batch([db.prepare('UPDATE live_rooms SET ended_at=? WHERE lesson_id=? AND ended_at IS NULL AND heartbeat<=?').bind(now,lessonId,now-90000),db.prepare('INSERT INTO live_rooms(id,lesson_id,host_uid,invited,started_at,heartbeat) VALUES(?,?,?,?,?,?)').bind(id,lessonId,user.uid,JSON.stringify(invited),now,now)]);room={id,lesson_id:lessonId,host_uid:user.uid,invited:JSON.stringify(invited),started_at:now,heartbeat:now,ended_at:null}}
 const existing=await db.prepare('SELECT id FROM live_peers WHERE room_id=? AND uid=? AND heartbeat>?').bind(room.id,user.uid,now-45000).first();if(existing)return bad('Bu hesap başka bir sekmede derse bağlı. Önce o odadan ayrılın.',409);
 await db.prepare('DELETE FROM live_peers WHERE room_id=? AND uid=?').bind(room.id,user.uid).run();const id=crypto.randomUUID();await db.prepare('INSERT INTO live_peers(id,room_id,uid,name,approved,heartbeat) VALUES(?,?,?,?,?,?)').bind(id,room.id,user.uid,user.name||user.email.split('@')[0],room.host_uid===user.uid?1:0,now).run();return Response.json({peerId:id});
 }
 if(!room||!peer)return bad('Oturum sona erdi. Yeniden katılın.',409);
 if(action==='heartbeat'){await db.prepare('UPDATE live_peers SET heartbeat=? WHERE id=?').bind(now,peer.id).run();if(room.host_uid===user.uid&&host)await db.batch([db.prepare('UPDATE live_rooms SET heartbeat=? WHERE id=?').bind(now,room.id),db.prepare("DELETE FROM live_events WHERE kind='signal' AND created_at<?").bind(now-120000),db.prepare('DELETE FROM live_rooms WHERE started_at<? AND (ended_at IS NOT NULL OR heartbeat<?)').bind(now-86400000,now-90000)]);return Response.json({ok:true})}
 if(action==='leave'){await db.prepare('DELETE FROM live_peers WHERE id=?').bind(peer.id).run();if(room.host_uid===user.uid)await db.prepare('UPDATE live_rooms SET ended_at=? WHERE id=?').bind(now,room.id).run();return Response.json({ok:true})}
 if(action==='approve'||action==='end'){
 if(!host||room.host_uid!==user.uid)return bad('Yalnızca dersi başlatan öğretmen bu işlemi yapabilir.',403);
 if(action==='end')await db.prepare('UPDATE live_rooms SET ended_at=? WHERE id=?').bind(now,room.id).run();else await db.prepare('UPDATE live_peers SET approved=1 WHERE id=? AND room_id=?').bind(String(body.target||''),room.id).run();return Response.json({ok:true});
 }
 if(!peer.approved||peer.heartbeat<now-45000)return bad('Öğretmen onayı gerekli.',403);
 if(action!=='event')return bad('Geçersiz işlem.');
 const kind=String(body.kind||'');const recipient=String(body.recipient||'');const payload=body.payload;const serialized=JSON.stringify(payload);
 if(!['signal','chat','stroke','clear'].includes(kind)||!serialized||serialized.length>60000)return bad('Geçersiz oda verisi.');
 if(kind==='signal'){const target=await db.prepare('SELECT id FROM live_peers WHERE id=? AND room_id=? AND approved=1 AND heartbeat>?').bind(recipient,room.id,now-45000).first();if(!target)return bad('Katılımcı artık odada değil.',409)}else if(recipient)return bad('Geçersiz alıcı.');
 if(kind==='clear'&&(!host||room.host_uid!==user.uid))return bad('Tahtayı yalnızca öğretmen temizleyebilir.',403);
 if(kind==='chat'&&(typeof payload!=='string'||payload.length>2000))return bad('Mesaj en fazla 2000 karakter olmalı.');
 if(kind==='stroke'){const s=payload as {points?:number[][];color?:string;width?:number};if(!s||!Array.isArray(s.points)||s.points.length>1500||s.points.length<2||!s.points.every(p=>Array.isArray(p)&&p.length===2&&p.every(n=>typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=1000))||!/^#[0-9a-f]{6}$/i.test(s.color||'')||![2,5,12].includes(s.width||0))return bad('Geçersiz tahta çizimi.')}
 const recent=await db.prepare('SELECT COUNT(*) AS n FROM live_events WHERE room_id=? AND sender=? AND created_at>?').bind(room.id,peer.id,now-10000).first<{n:number}>();if((recent?.n||0)>100)return bad('Biraz bekleyip tekrar deneyin.',429);
 await db.prepare('INSERT INTO live_events(room_id,sender,recipient,kind,payload,created_at) VALUES(?,?,?,?,?,?)').bind(room.id,peer.id,recipient,kind,serialized,now).run();return Response.json({ok:true});
 }catch{return bad('Canlı ders işlemi tamamlanamadı.',500)}
}
