import { authorize, ownerOfLesson } from '@/lib/auth';
import { getDb } from '@/db';
import { lessons, students } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { mailConfigured, scheduleReminder, notifyLessonCreated } from '@/lib/mailer';
// Önceden kaydedilmiş, henüz planlanmamış dersleri ilk açılışta sağlayıcıya aktarır.
export async function POST(request:Request){const user=await authorize(request,'invites');if(user instanceof Response)return user;
 if(!mailConfigured())return Response.json({scheduled:[],configured:false});
 const db=getDb();const now=Date.now();const rows=await db.select({lesson:lessons,student:students}).from(lessons).innerJoin(students,eq(lessons.studentId,students.id));const scheduled:string[]=[];
 for(const {lesson,student} of rows){if(!ownerOfLesson(user,lesson.teacherEmail)||lesson.status!=='pending')continue;
 if(['pending','failed'].includes(lesson.creationMailStatus)){try{await notifyLessonCreated(lesson,student.name);await db.update(lessons).set({creationMailStatus:'sent'}).where(eq(lessons.id,lesson.id))}catch{await db.update(lessons).set({creationMailStatus:'failed'}).where(eq(lessons.id,lesson.id))}}
 const when=new Date(lesson.startsAt).getTime()-lesson.reminderMinutes*60000;if(lesson.reminderMinutes===0||lesson.reminderEmailId||when<=now+60000)continue;
 try{const id=await scheduleReminder(lesson,student.name);await db.update(lessons).set({reminderEmailId:id,reminderMailStatus:'scheduled'}).where(eq(lessons.id,lesson.id));scheduled.push(lesson.id)}catch{await db.update(lessons).set({reminderMailStatus:'failed'}).where(eq(lessons.id,lesson.id))}}

 return Response.json({scheduled,configured:true});
}
