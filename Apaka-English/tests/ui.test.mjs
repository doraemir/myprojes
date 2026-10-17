import './api.test.mjs';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const nodes={'#app':{innerHTML:''},'#modal':{innerHTML:'',addEventListener(){},showModal(){},close(){}}};
const context=vm.createContext({document:{querySelector:s=>nodes[s]||null,addEventListener(){},querySelectorAll:()=>[]},localStorage:{getItem:()=>null,setItem(){}},window:{addEventListener(){}},location:{hash:''},console,Date,Intl,URL,URLSearchParams,setTimeout,clearTimeout,Blob,HTMLFormElement:class{},FormData});
const source=readFileSync('public/portal.js','utf8').split('refresh().then(readRoute)')[0];
vm.runInContext(source+`\nglobalThis.testUI={html(state,mode,page,id=''){S=state;view=mode;route=page;detail=id;return content()},full(state,mode,page){S=state;view=mode;route=page;render();return document.querySelector('#app').innerHTML},edit(kind,id){editEntity(kind,id)}};`,context);
let total=0;const state=globalThis.apakaTestStates;
for(const page of ['home','courses','lessons','quizzes','homework','resources','speaking','calendar','certificates','messages','payments','profile','placement','search']){const html=context.testUI.html(state.student,'student',page,page==='search'?'Present':'');assert(html.length>20,page);assert(!html.includes('undefined'),page);total++;}
for(const page of ['home','students','courses','content','quizzes','homework','payments','calendar','messages','reports','settings']){const html=context.testUI.full(state.admin,'admin',page);assert(html.includes('sidebar'),page);assert(!html.includes('undefined'),page);total++;}
const lesson=context.testUI.html(state.student,'student','lesson','course-A2-lesson-0');assert(lesson.includes('<video'));assert(lesson.includes('sample-lesson.mp4'));assert(lesson.includes('Ders Notları (PDF)'));
const quiz=context.testUI.html(state.student,'student','quiz','course-A2-quiz');assert.equal((quiz.match(/class="quiz-q"/g)||[]).length,3);assert(!quiz.includes('Doğru Seçenek'));
for(const kind of ['course','lesson','quiz','assignment','resource','event']){context.testUI.edit(kind,'');assert(nodes['#modal'].innerHTML.includes('entity-form'));}
const cert=context.testUI.html(state.student,'student','certificate',encodeURIComponent(state.student.certificates[0].id));assert(cert.includes('BAŞARI SERTİFİKASI'));assert(cert.includes('Alice Student'));
console.log(`PASS: ${total} student/admin screen renderings, six editor forms, lesson player, quiz questions, certificate rendering.`);
