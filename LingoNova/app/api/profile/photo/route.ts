import {env} from 'cloudflare:workers';
import {account} from '@/lib/auth';
import {limitedBody,MAX_AVATAR_BYTES,validAvatarJpeg} from '@/lib/profile-photo';

export async function GET(request:Request){
 const user=await account(request);if(user instanceof Response)return user;
 if(!env.BUCKET)return Response.json({error:'Fotoğraf servisi şu an kullanılamıyor.'},{status:503});
 try{const row=await env.DB!.prepare('SELECT avatar_key FROM accounts WHERE uid=?').bind(user.uid).first<{avatar_key:string|null}>();if(!row?.avatar_key)return new Response(null,{status:404});const photo=await env.BUCKET.get(row.avatar_key);if(!photo)return new Response(null,{status:404});return new Response(photo.body,{headers:{'Content-Type':'image/jpeg','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}})}catch(error){console.error('Profile photo read failed',error);return Response.json({error:'Fotoğraf yüklenemedi. Yeniden dene.'},{status:503})}
}
export async function POST(request:Request){
 const user=await account(request);if(user instanceof Response)return user;
 if(!env.BUCKET)return Response.json({error:'Fotoğraf servisi şu an kullanılamıyor.'},{status:503});
 let bytes:Uint8Array;
 try{const body=await limitedBody(request);const form=await new Request(request.url,{method:'POST',headers:{'Content-Type':request.headers.get('Content-Type')||''},body:body.buffer}).formData();const file=form.get('photo');if(!(file instanceof File)||file.type!=='image/jpeg'||file.size>MAX_AVATAR_BYTES)return Response.json({error:'Geçerli bir profil fotoğrafı seç.'},{status:400});bytes=new Uint8Array(await file.arrayBuffer());if(!validAvatarJpeg(bytes))return Response.json({error:'Fotoğraf biçimi veya boyutları geçersiz.'},{status:400})}catch(error){return Response.json({error:(error as Error).message==='too-large'?'Fotoğraf çok büyük. Başka bir fotoğraf seç.':'Fotoğraf okunamadı. Yeniden seç.'},{status:(error as Error).message==='too-large'?413:400})}
 const key=`avatars/${user.uid}/${crypto.randomUUID()}.jpg`;
 try{const row=await env.DB!.prepare('SELECT avatar_key FROM accounts WHERE uid=?').bind(user.uid).first<{avatar_key:string|null}>();if(!row)return Response.json({error:'Hesabını yenileyip tekrar dene.'},{status:409});await env.BUCKET.put(key,bytes,{httpMetadata:{contentType:'image/jpeg'}});const updated=await env.DB!.prepare('UPDATE accounts SET avatar_key=? WHERE uid=? AND avatar_key IS ?').bind(key,user.uid,row.avatar_key).run();if(!updated.meta.changes){await env.BUCKET.delete(key);return Response.json({error:'Fotoğraf başka bir işlemde değişti. Yenileyip tekrar dene.'},{status:409})}if(row.avatar_key)await env.BUCKET.delete(row.avatar_key).catch(error=>console.error('Old avatar cleanup failed',error));return Response.json({ok:true,avatarVersion:key.split('/').pop()})}catch(error){await env.BUCKET.delete(key).catch(()=>{});console.error('Profile photo save failed',error);return Response.json({error:'Fotoğraf kaydedilemedi. Yeniden dene.'},{status:503})}
}
export async function DELETE(request:Request){
 const user=await account(request);if(user instanceof Response)return user;
 if(!env.BUCKET)return Response.json({error:'Fotoğraf servisi şu an kullanılamıyor.'},{status:503});
 try{const row=await env.DB!.prepare('SELECT avatar_key FROM accounts WHERE uid=?').bind(user.uid).first<{avatar_key:string|null}>();if(row?.avatar_key){const updated=await env.DB!.prepare('UPDATE accounts SET avatar_key=NULL WHERE uid=? AND avatar_key IS ?').bind(user.uid,row.avatar_key).run();if(!updated.meta.changes)return Response.json({error:'Fotoğraf değişti. Yenileyip tekrar dene.'},{status:409});await env.BUCKET.delete(row.avatar_key).catch(error=>console.error('Avatar cleanup failed',error))}return Response.json({ok:true})}catch(error){console.error('Profile photo removal failed',error);return Response.json({error:'Fotoğraf kaldırılamadı. Yeniden dene.'},{status:503})}
}
