import {DatabaseSync} from 'node:sqlite';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';
const sql=new DatabaseSync(':memory:');sql.exec('PRAGMA foreign_keys=ON');
for(const f of fs.readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort())sql.exec(fs.readFileSync('drizzle/'+f,'utf8'));
const DB={prepare(query){const statement={bind(...args){return {...statement,args}},args:[],q:query,async first(){return sql.prepare(query).get(...this.args)||null},async all(){return {results:sql.prepare(query).all(...this.args)}},async run(){return sql.prepare(query).run(...this.args)}};return statement},async batch(statements){sql.exec('BEGIN');try{for(const s of statements)sql.prepare(s.q).run(...s.args);sql.exec('COMMIT')}catch(e){sql.exec('ROLLBACK');throw e}}};
const teacher={uid:'t',email:'t@test.com',name:'Teacher',role:'teacher',permissions:{lessons:true},admin:false};
const student={uid:'s',email:'s@test.com',name:'Student',role:'student',permissions:{},admin:false};const extra={...student,uid:'extra'};const outsider={...student,uid:'outsider'};let user=teacher;
globalThis.__liveTest={env:{DB},account:async()=>user||Response.json({error:'auth'},{status:401}),can:u=>u.admin||u.role==='teacher'&&u.permissions.lessons,ownerOfLesson:(u,email)=>u.admin||u.role==='teacher'&&u.email===email,ownerOfStudent:(u,email)=>u.admin||u.role==='teacher'&&u.email===email};
const source="const {env,account,can,ownerOfLesson,ownerOfStudent}=globalThis.__liveTest;\n"+fs.readFileSync('app/api/live/route.ts','utf8').replace(/^import .*;\n/gm,'');
const route=await import('data:text/javascript;base64,'+Buffer.from(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64'));
for(const [id,uid,owner] of [['s1','s','t@test.com'],['s2','extra','t@test.com'],['s3','outsider','other@test.com']])sql.prepare('INSERT INTO students(id,name,account_uid,owner_email) VALUES(?,?,?,?)').run(id,id,uid,owner);
sql.prepare("INSERT INTO lessons(id,student_id,student_uid,starts_at,topic,email,reminder_minutes,teacher_email) VALUES('lesson','s1','s','2026-10-03T10:00:00Z','English','s@test.com',10,'t@test.com')").run();
const req=(body,peer='',query='')=>new Request(`https://test/api/live?lesson=lesson&peer=${peer}${query}`,body?{method:'POST',body:JSON.stringify(body)}:{});
const post=(body,peer='')=>route.POST(req(body,peer));const state=(peer='',query='')=>route.GET(req(null,peer,query));
user=null;assert.equal((await state()).status,401);
user=student;assert.equal((await post({action:'join'})).status,409);
user=teacher;assert.equal((await post({action:'join',invited:['outsider']})).status,403);
let r=await post({action:'join',invited:['extra']});assert.equal(r.status,200,await r.clone().text());const host=(await r.json()).peerId;
assert.equal((await post({action:'join'})).status,409);
user=outsider;assert.equal((await state()).status,403);assert.deepEqual(await(await route.GET(new Request('https://test/api/live'))).json(),[]);
user=extra;let directory=await(await route.GET(new Request('https://test/api/live'))).json();assert.equal(directory.length,1);r=await post({action:'join'});assert.equal(r.status,200);const guest=(await r.json()).peerId;
assert.equal((await post({action:'event',kind:'chat',payload:'blocked'},guest)).status,403);assert.equal((await post({action:'end'},guest)).status,403);
user=teacher;assert.equal((await post({action:'approve',target:guest},host)).status,200);
user=extra;assert.equal((await state(host)).status,200);assert.equal((await(await state(host)).json()).peer,null);assert.equal((await post({action:'heartbeat'},host)).status,409);
assert.equal((await post({action:'event',kind:'chat',payload:'Hello'},guest)).status,200);assert.equal((await post({action:'event',kind:'clear',payload:null},guest)).status,403);
assert.equal((await post({action:'event',kind:'stroke',payload:{points:[[0,0],[999,999]],color:'#2563eb',width:5}},guest)).status,200);
assert.equal((await post({action:'event',kind:'stroke',payload:{points:[[0,0],[1001,0]],color:'#2563eb',width:5}},guest)).status,400);
assert.equal((await post({action:'event',kind:'signal',recipient:host,payload:{candidate:{candidate:'test'}}},guest)).status,200);
user=teacher;let snapshot=await(await state(host)).json();assert.equal(snapshot.events.length,3);assert.ok(snapshot.events.some(e=>e.kind==='signal'));assert.equal((await(await state(host,'&ice=1')).json()).iceServers[0].urls,'stun:stun.cloudflare.com:3478');
user=student;r=await post({action:'join'});const primary=(await r.json()).peerId;user=teacher;await post({action:'approve',target:primary},host);user=student;snapshot=await(await state(primary)).json();assert.equal(snapshot.events.length,2);assert.ok(!snapshot.events.some(e=>e.kind==='signal'));
user=teacher;await post({action:'event',kind:'clear',payload:null},host);await post({action:'end'},host);user=student;assert.equal((await post({action:'event',kind:'chat',payload:'after end'},primary)).status,409);assert.equal((await(await state()).json()).room,null);assert.equal(sql.prepare("SELECT status FROM lessons WHERE id='lesson'").get().status,'pending');
user=teacher;r=await post({action:'join'});assert.equal(r.status,200);const restarted=(await r.json()).peerId;sql.prepare('UPDATE live_rooms SET heartbeat=? WHERE ended_at IS NULL').run(Date.now()-91000);assert.deepEqual(await(await route.GET(new Request('https://test/api/live'))).json(),[]);assert.equal((await post({action:'heartbeat'},restarted)).status,409);
console.log('Live authorization, group invitations, lobby approval, peer ownership, targeted signals, board validation, session ending, stale presence and all migrations: passed.');
// Exercise the real RTC coordinator with browser primitives mocked: offer election,
// ICE-before-SDP, answer flow, screen sender replacement and teardown.
class Track {constructor(kind){this.kind=kind}}
class Stream {constructor(tracks=[]){this.tracks=tracks}getAudioTracks(){return this.tracks.filter(t=>t.kind==='audio')}getVideoTracks(){return this.tracks.filter(t=>t.kind==='video')}addTrack(t){this.tracks.push(t)}}
class PC {constructor(){this.senders=[];this.receivers=[];this.candidates=[];this.closed=false}addTransceiver(t){const track=typeof t==='string'?null:t;this.senders.push({track,async replaceTrack(t){this.track=t}});this.receivers.push({track:track||new Track(t)})}getSenders(){return this.senders}getReceivers(){return this.receivers}async createOffer(){return {type:'offer',sdp:'offer'}}async createAnswer(){return {type:'answer',sdp:'answer'}}async setLocalDescription(d){this.localDescription={...d,toJSON:()=>d}}async setRemoteDescription(d){this.remoteDescription=d}async addIceCandidate(c){assert.ok(this.remoteDescription);this.candidates.push(c)}close(){this.closed=true}}
globalThis.RTCPeerConnection=PC;globalThis.MediaStream=Stream;
const rtcSource=ts.transpileModule(fs.readFileSync('lib/classroom-rtc.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {ClassroomRTC}=await import('data:text/javascript;base64,'+Buffer.from(rtcSource).toString('base64'));
const sent=[];const rtc=new ClassroomRTC('a',new Stream([new Track('audio'),new Track('video')]),[],async(id,p)=>sent.push({id,p}),()=>{},()=>{});
await rtc.offer('z');assert.equal(sent[0].p.description.type,'offer');await rtc.receive('z',{candidate:{candidate:'early'}});assert.equal(rtc.peers.get('z').candidates.length,0);await rtc.receive('z',{description:{type:'answer',sdp:'answer'}});assert.equal(rtc.peers.get('z').candidates.length,1);const screen=new Track('video');await rtc.replaceVideo(screen);assert.equal(rtc.peers.get('z').getSenders()[1].track,screen);const pc=rtc.peers.get('z');rtc.close();assert.equal(pc.closed,true);
const other=new ClassroomRTC('z',new Stream(),[],async(id,p)=>sent.push({id,p}),()=>{},()=>{});const count=sent.length;await other.offer('a');assert.equal(sent.length,count);await other.receive('a',{description:{type:'offer',sdp:'offer'}});assert.equal(sent.at(-1).p.description.type,'answer');other.close();console.log('RTC offer election, ICE queue, answer negotiation, screen replacement and teardown: passed.');
