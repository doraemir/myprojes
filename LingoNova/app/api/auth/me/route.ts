import {account} from '@/lib/auth';
import {getDb} from '@/db';
import {eq} from 'drizzle-orm';
import {accounts} from '@/db/schema';
export async function GET(request:Request){const user=await account(request);if(user instanceof Response)return user;await getDb().insert(accounts).values({uid:user.uid,email:user.email,role:user.admin?'admin':'student',permissions:'{}',createdAt:new Date().toISOString(),name:user.name}).onConflictDoNothing();await getDb().update(accounts).set({name:user.name}).where(eq(accounts.uid,user.uid));return Response.json(user);}
