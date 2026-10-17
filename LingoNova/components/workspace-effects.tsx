'use client';
import {useEffect,useRef} from 'react';

export function WorkspaceEffects(){
 const ring=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const allowed=matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  let frame=0;let glow:HTMLElement|null=null;
  const hide=()=>{if(ring.current)ring.current.dataset.visible='false';if(glow)delete glow.dataset.glow;glow=null;cancelAnimationFrame(frame)};
  const move=(event:PointerEvent)=>{
   if(!allowed.matches||event.pointerType==='touch'){hide();return}
   cancelAnimationFrame(frame);
   frame=requestAnimationFrame(()=>{
    const target=event.target instanceof Element?event.target:null;
    if(ring.current){ring.current.style.transform=`translate3d(${event.clientX-18}px,${event.clientY-18}px,0)`;ring.current.dataset.visible='true';ring.current.dataset.interactive=String(!!target?.closest('button,a,input,select,textarea,[role="button"]'))}
    const next=target?.closest<HTMLElement>('.card,.stat,.welcome,.next-lesson')||null;
    if(glow!==next&&glow)delete glow.dataset.glow;glow=next;
    if(glow){const rect=glow.getBoundingClientRect();glow.style.setProperty('--pointer-x',`${event.clientX-rect.left}px`);glow.style.setProperty('--pointer-y',`${event.clientY-rect.top}px`);glow.dataset.glow='true'}
   });
  };
  const keyboard=(event:KeyboardEvent)=>{if(event.key==='Tab')hide()};
  window.addEventListener('pointermove',move,{passive:true});window.addEventListener('blur',hide);window.addEventListener('scroll',hide,{passive:true});document.documentElement.addEventListener('pointerleave',hide);window.addEventListener('keydown',keyboard);allowed.addEventListener('change',hide);
  return()=>{hide();window.removeEventListener('pointermove',move);window.removeEventListener('blur',hide);window.removeEventListener('scroll',hide);document.documentElement.removeEventListener('pointerleave',hide);window.removeEventListener('keydown',keyboard);allowed.removeEventListener('change',hide)};
 },[]);
 return <div ref={ring} className="cursor-ring" aria-hidden="true"/>;
}
