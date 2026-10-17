import {env} from 'cloudflare:workers';
import {account} from '@/lib/auth';
export async function GET(request:Request){const u=await account(request);if(u instanceof Response)return u;try{const rows=(await env.DB!.prepare('SELECT id,name FROM students WHERE account_uid=?').bind(u.uid).all()).results;return Response.json(rows,{headers:{'Cache-Control':'private, no-store'}})}catch{return Response.json({error:'Öğrenci eşleştirmesi yüklenemedi.'},{status:503})}}
