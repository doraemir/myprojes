import {account,ownerOfStudent,ownerOfLesson,can} from '@/lib/auth';
import {env} from 'cloudflare:workers';
export async function GET(request:Request){
 const u=await account(request);if(u instanceof Response)return u;
 const id=new URL(request.url).searchParams.get('id');if(!id)return Response.json({error:'Öğrenci seçin.'},{status:400});
 const s=await env.DB!.prepare('SELECT id,owner_email,account_uid FROM students WHERE id=?').bind(id).first<{id:string;owner_email:string;account_uid:string|null}>();
 if(!s)return Response.json({error:'Öğrenci bulunamadı.'},{status:404});
 let allowed=u.role==='student'?s.account_uid===u.uid:ownerOfStudent(u,s.owner_email);
 if(!allowed&&u.role==='teacher'){const links=await env.DB!.prepare('SELECT teacher_email FROM lessons WHERE student_id=?').bind(id).all<{teacher_email:string}>();allowed=links.results.some(l=>ownerOfLesson(u,l.teacher_email))}
 if(!allowed)return Response.json({error:'Bu öğrenciye erişim yetkiniz yok.'},{status:403});
 const activities=(await env.DB!.prepare(`SELECT a.id,a.kind,a.title,a.content,a.created_at,r.answer,r.feedback,r.verified,r.result FROM learning_activities a JOIN learning_members m ON m.activity_id=a.id LEFT JOIN learning_responses r ON r.activity_id=a.id AND r.student_id=m.student_id WHERE m.student_id=? AND m.account_uid=? ${u.admin||u.role==='student'?'':'AND lower(a.teacher_email)=?'} ORDER BY a.created_at DESC`).bind(id,s.account_uid||'',...u.admin||u.role==='student'?[]:[u.email]).all()).results;
 const words=(await env.DB!.prepare('SELECT id,word,meaning,learned_at FROM student_words WHERE student_id=? '+(u.admin||u.role==='student'?'':'AND teacher_email=?')+' ORDER BY learned_at DESC').bind(id,...u.admin||u.role==='student'?[]:[u.email]).all()).results;
 return Response.json({activities,words},{headers:{'Cache-Control':'private, no-store'}});
}

export async function POST(request:Request){
 const u=await account(request);if(u instanceof Response)return u;if(!can(u,'lessons'))return Response.json({error:'Kelime kaydetme yetkiniz yok.'},{status:403});
 let b:{id?:string;word?:string;meaning?:string};try{b=await request.json()}catch{return Response.json({error:'Geçersiz istek.'},{status:400})}
 if(typeof b.id!=='string'||typeof b.word!=='string'||typeof b.meaning!=='string'||!b.word.trim()||!b.meaning.trim()||b.word.length>100||b.meaning.length>200)return Response.json({error:'Kelimeyi ve anlamını kontrol edin.'},{status:400});
 const check=await GET(new Request(new URL('/api/students/progress?id='+encodeURIComponent(b.id),request.url),{headers:request.headers}));if(!check.ok)return check;
 await env.DB!.prepare('INSERT INTO student_words(id,student_id,teacher_email,word,meaning,learned_at) VALUES(?,?,?,?,?,?) ON CONFLICT(student_id,teacher_email,word) DO UPDATE SET meaning=excluded.meaning,learned_at=excluded.learned_at').bind(crypto.randomUUID(),b.id,u.email,b.word.trim().toLocaleLowerCase('en-US'),b.meaning.trim(),new Date().toISOString()).run();return Response.json({ok:true});
}
