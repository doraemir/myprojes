import {readFileSync,readdirSync} from 'node:fs';import assert from 'node:assert/strict';
const pkg=readdirSync('node_modules/.pnpm').find(n=>n.startsWith('esbuild@'));const {build}=await import('../node_modules/.pnpm/'+pkg+'/node_modules/esbuild/lib/main.js');
await build({entryPoints:['app/api/public-placement/route.ts'],outfile:'.sites-runtime/placement-test.mjs',bundle:true,format:'esm',platform:'node',plugins:[{name:'mock-env',setup(b){b.onResolve({filter:/^cloudflare:workers$/},()=>({path:'env',namespace:'mock'}));b.onLoad({filter:/.*/,namespace:'mock'},()=>({contents:'export const env={};'}))}}]});const api=await import('../.sites-runtime/placement-test.mjs');
const get=await api.GET();assert.equal(get.status,200);const q=(await get.json()).questions;assert.equal(q.length,20);assert(q.every(q=>!('answer'in q)&&!('explanation'in q)));
const correct=[0,1,1,2,1,3,2,1,2,0,1,1,1,2,1,2,1,2,2,1];
async function post(answers,status=200,origin='https://apaka.test'){const r=await api.POST(new Request('https://apaka.test/api/public-placement',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify({answers})}));assert.equal(r.status,status);return r.json()}
const perfect=await post(correct);assert.equal(perfect.correct,20);assert.equal(perfect.level,'C1');assert.equal(perfect.results.length,20);assert.equal(perfect.breakdown.length,5);
const wrong=await post(correct.map(x=>(x+1)%4));assert.equal(wrong.correct,0);assert.equal(wrong.level,'A1');
const middle=await post(correct.map((v,i)=>i<10?v:(v+1)%4));assert.equal(middle.level,'B1');
await post(correct.slice(0,-1),400);await post(correct.map((v,i)=>i===0?null:v),400);await post(correct.map((v,i)=>i===0?4:v),400);await post(correct,403,'https://other.test');
const html=readFileSync('public/home.html','utf8');assert(html.includes("if(a==='Seviyeni Öğren'){location.href='/placement.html';return;}"));assert(!readFileSync('public/placement.js','utf8').includes('signin-with'));assert(readFileSync('public/placement.html','utf8').includes('/theme.js'));
console.log('PASS: 20-question anonymous exam, no answer leakage before submission, A1/B1/C1 results, malformed answers, origin check, direct landing-page link and theme support.');
