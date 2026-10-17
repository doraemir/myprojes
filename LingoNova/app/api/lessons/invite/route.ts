import { authorize, ownerOfLesson } from '@/lib/auth';
import { getDb } from '@/db';
import { lessons } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notifyLessonCreated } from '@/lib/mailer';
export async function POST(request:Request){const user=await authorize(request,'invites');if(user instanceof Response)return user;const {id}=await request.json() as {id?:string};if(!id)return Response.json({error:'Ders seçin.'},{status:400});const [lesson]=await getDb().select().from(lessons).where(eq(lessons.id,id)).limit(1);if(!lesson||!ownerOfLesson(user,lesson.teacherEmail))return Response.json({error:'Ders bulunamadı.'},{status:404});if(lesson.status==='cancelled')return Response.json({error:'İptal edilen derse davet gönderilemez.'},{status:400});try{await notifyLessonCreated(lesson,undefined,true);await getDb().update(lessons).set({creationMailStatus:'sent'}).where(eq(lessons.id,id));return Response.json({ok:true})}catch(error){return Response.json({error:(error as Error).message},{status:502})}}
