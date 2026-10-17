import { authorize } from '@/lib/auth';
import { sendTestEmail } from '@/lib/mailer';
export async function POST(request:Request){const user=await authorize(request,'invites');if(user instanceof Response)return user;const {email}=await request.json() as {email?:string};if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return Response.json({error:'Geçerli bir e-posta adresi girin.'},{status:400});try{await sendTestEmail(email);return Response.json({ok:true})}catch(error){return Response.json({error:(error as Error).message},{status:502})}}
