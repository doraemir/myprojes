import {env} from 'cloudflare:workers';
import {getDb} from '@/db';
import {lessons,students} from '@/db/schema';
import {lessonMailPayload} from '@/lib/mailer';
import {eq} from 'drizzle-orm';

type ReminderEnv={MAIL_SCRIPT_TOKEN?:string};
export async function POST(request:Request){
 const secret=(env as unknown as ReminderEnv).MAIL_SCRIPT_TOKEN;
 const token=request.headers.get('Authorization')?.match(/^Bearer (\S+)$/)?.[1];
 if(!secret||!token||token!==secret)return Response.json({error:'Yetkisiz istek.'},{status:401});
 let body:{version?:number;action?:string;id?:string};try{body=await request.json()}catch{return Response.json({error:'Geçersiz istek.'},{status:400})}
 if(body.version!==3)return Response.json({lessons:[],error:'Apps Script sürüm 3 güncellemesi gerekiyor.'});
 const db=getDb();
 if(body.action==='pending'){
  const rows=await db.select({lesson:lessons,student:students}).from(lessons).innerJoin(students,eq(lessons.studentId,students.id));
  const now=Date.now();const pending=rows.filter(({lesson})=>lesson.status==='pending'&&lesson.reminderMinutes>0&&(['pending','failed'].includes(lesson.creationMailStatus)||new Date(lesson.startsAt).getTime()>now)).slice(0,100);const payloads=[];for(const {lesson,student} of pending){try{payloads.push(await lessonMailPayload(lesson,student.name))}catch{}}return Response.json({lessons:payloads});
 }
 if((body.action==='ack'||body.action==='created_ack')&&body.id&&/^[0-9a-f-]{36}$/i.test(body.id)){
  await db.update(lessons).set(body.action==='created_ack'?{creationMailStatus:'sent'}:{reminderEmailId:body.id,reminderMailStatus:'scheduled'}).where(eq(lessons.id,body.id));return Response.json({ok:true});
 }
 return Response.json({error:'Geçersiz işlem.'},{status:400});
}
