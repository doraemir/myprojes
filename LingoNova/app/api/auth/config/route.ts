import {env} from 'cloudflare:workers';
import {authConfig} from '@/lib/auth';
export async function GET(){return Response.json({apiKey:authConfig().apiKey,turnstileSiteKey:(env as unknown as {TURNSTILE_SITE_KEY?:string}).TURNSTILE_SITE_KEY||'',configured:!!authConfig().apiKey});}
