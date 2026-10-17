import {questions,grade} from '../../../lib/placement';
import {userFromSession} from '../../../lib/auth';
import {env} from 'cloudflare:workers';
export const dynamic='force-dynamic';
export async function GET(){return Response.json({questions:questions.map(({answer,explanation,...question})=>question)},{headers:{'Cache-Control':'no-store'}})}
export async function POST(req:Request){if(req.headers.get('origin')&&req.headers.get('origin')!==new URL(req.url).origin)return Response.json({error:'Geçersiz istek kaynağı.'},{status:403});try{const b:any=await req.json(),result=grade(b.answers);const user=await userFromSession(req);if(user&&env.DB)await env.DB.prepare("UPDATE users SET level=? WHERE id=? AND status='active'").bind(result.level,user.userId).run();return Response.json(result,{headers:{'Cache-Control':'no-store'}})}catch{return Response.json({error:'Lütfen tüm soruları cevapla.'},{status:400})}}
