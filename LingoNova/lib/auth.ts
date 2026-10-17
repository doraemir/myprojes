import { env } from 'cloudflare:workers';
import { getDb } from '@/db';
import { accounts,students,lessons } from '@/db/schema';
import { eq } from 'drizzle-orm';

type AuthEnv={FIREBASE_API_KEY?:string;ADMIN_EMAIL?:string};
export type Permission='students'|'lessons'|'payments'|'invites';
export type Role='admin'|'teacher'|'student';
export type User={uid:string;email:string;name:string;avatarVersion:string|null;role:Role;permissions:Record<Permission,boolean>;admin:boolean};
const none={students:false,lessons:false,payments:false,invites:false};
const teacherDefaults={students:true,lessons:true,payments:true,invites:true};
export function authConfig(){const e=env as unknown as AuthEnv;return {apiKey:e.FIREBASE_API_KEY||'',adminEmail:e.ADMIN_EMAIL||''};}
export async function verifiedAccount(request:Request):Promise<User|Response>{
 const {apiKey,adminEmail}=authConfig();
 if(!apiKey||!adminEmail)return Response.json({error:'Hesap sistemi henüz yapılandırılmadı.'},{status:503});
 const token=request.headers.get('Authorization')?.match(/^Bearer (\S+)$/)?.[1];
 if(!token)return Response.json({error:'Giriş yapmanız gerekiyor.'},{status:401});
 try{
  const response=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({idToken:token}),signal:AbortSignal.timeout(15000)});
  if(!response.ok)return Response.json({error:'Oturum süresi doldu. Yeniden giriş yapın.'},{status:401});
  const data=await response.json() as {users?:{localId?:string;email?:string;displayName?:string;emailVerified?:boolean;disabled?:boolean}[]};
  const user=data.users?.[0];
  if(!user?.localId||!user.email||user.disabled)return Response.json({error:'Hesap bulunamadı.'},{status:401});
  if(!user.emailVerified)return Response.json({error:'E-posta adresinizi doğrulayın.'},{status:403});
  const email=user.email.toLowerCase();
  const [record]=await getDb().select().from(accounts).where(eq(accounts.uid,user.localId)).limit(1);
  const [existingOwner]=await getDb().select({uid:accounts.uid}).from(accounts).where(eq(accounts.role,'admin')).limit(1);const admin=record?.role==='admin'||email===adminEmail.toLowerCase()&&!existingOwner;
  if(record&&record.email!==email){const db=getDb();await db.batch([db.update(accounts).set({email}).where(eq(accounts.uid,user.localId)),db.update(students).set({email}).where(eq(students.accountUid,user.localId)),db.update(lessons).set({email}).where(eq(lessons.studentUid,user.localId))]);}
  const role:Role=admin?'admin':record?.role==='teacher'?'teacher':'student';
  let overrides:Partial<Record<Permission,boolean>>={};try{overrides=JSON.parse(record?.permissions||'{}')}catch{}
  const permissions={...(role==='teacher'?teacherDefaults:none),...overrides};
  if(admin)for(const p of Object.keys(permissions) as Permission[])permissions[p]=true;
  return {uid:user.localId,email,name:user.displayName?.trim().slice(0,100)||'',avatarVersion:record?.avatarKey?.split('/').pop()||null,role,permissions,admin};
 }catch{return Response.json({error:'Hesap doğrulanamadı.'},{status:503});}
}
export function can(user:User,permission:Permission){return user.admin||user.role==='teacher'&&user.permissions[permission];}
export async function authorize(request:Request,permission:Permission):Promise<User|Response>{const user=await account(request);return user instanceof Response?user:can(user,permission)?user:Response.json({error:'Bu işlem için yetkiniz yok.'},{status:403});}
export function ownerOfLesson(user:User,teacherEmail:string){return user.admin||user.role==='teacher'&&(teacherEmail||authConfig().adminEmail).toLowerCase()===user.email;}
export function ownerOfStudent(user:User,ownerEmail:string){return user.admin||user.role==='teacher'&&(ownerEmail||authConfig().adminEmail).toLowerCase()===user.email;}

export async function account(request:Request):Promise<User|Response>{
 const user=await verifiedAccount(request);if(user instanceof Response)return user;
 const credential=request.headers.get('X-Lingo-Session')||'';const [id,secret]=credential.split('.');
 if(!id||!secret)return Response.json({error:'Oturum süresi doldu. Yeniden giriş yapın.'},{status:401});
 const db=(env as unknown as {DB:D1Database}).DB;const row=await db.prepare('SELECT * FROM account_sessions WHERE id=? AND uid=?').bind(id,user.uid).first<{secret_hash:string;expires:number;last_seen:number}>();
 const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(secret)))).map(x=>x.toString(16).padStart(2,'0')).join('');
 if(!row||row.secret_hash!==hash||row.expires<Date.now()||row.last_seen<Date.now()-7200000)return Response.json({error:'Oturum süresi doldu. Yeniden giriş yapın.'},{status:401});
 const activity=Number(request.headers.get('X-Lingo-Activity'));if(Number.isFinite(activity)&&activity>row.last_seen+60000&&activity<=Date.now()+5000)await db.prepare('UPDATE account_sessions SET last_seen=? WHERE id=?').bind(activity,id).run();return user;
}
