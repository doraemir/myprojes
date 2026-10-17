'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {Dialog,DialogContent,DialogDescription,DialogTitle} from '@/components/ui/dialog';
type Field={name:string;label:string;value?:string;type?:string;required?:boolean;min?:string;step?:string;options?:{value:string;label:string}[];hint?:string;maxLength?:number};
type Request={title:string;description:string;fields?:Field[];submit?:string;danger?:boolean};
export function useActionDialog(){
 const [request,setRequest]=useState<Request|null>(null);
 const resolve=useRef<((value:Record<string,string>|null)=>void)|null>(null);
 const trigger=useRef<HTMLElement|null>(null);
 const finish=useCallback((value:Record<string,string>|null)=>{resolve.current?.(value);resolve.current=null;setRequest(null);requestAnimationFrame(()=>trigger.current?.isConnected&&trigger.current.focus())},[]);
 useEffect(()=>()=>{resolve.current?.(null)},[]);
 const ask=useCallback((value:Request)=>new Promise<Record<string,string>|null>(done=>{resolve.current?.(null);trigger.current=document.activeElement instanceof HTMLElement?document.activeElement:null;resolve.current=done;setRequest(value)}),[]);
 const dialog=<Dialog open={!!request} onOpenChange={open=>{if(!open)finish(null)}}><DialogContent className="workspace-dialog" onCloseAutoFocus={event=>event.preventDefault()}><DialogTitle>{request?.title}</DialogTitle><DialogDescription>{request?.description}</DialogDescription>{request&&<form key={request.title} onSubmit={event=>{event.preventDefault();finish(Object.fromEntries(new FormData(event.currentTarget).entries()) as Record<string,string>)}}><div className="dialog-fields">{request.fields?.map(field=><label key={field.name}>{field.label}{field.options?<select name={field.name} defaultValue={field.value} required={field.required}>{field.options.map(option=><option key={option.value} value={option.value}>{option.label}</option>)}</select>:field.type==='textarea'?<textarea name={field.name} defaultValue={field.value} required={field.required} maxLength={field.maxLength||2000} rows={5}/>:<input name={field.name} type={field.type||'text'} defaultValue={field.value} required={field.required} min={field.min} step={field.step} maxLength={field.type==='text'||!field.type?100:undefined}/>} {field.hint&&<small>{field.hint}</small>}</label>)}</div><div className="dialog-actions"><button type="button" className="secondary-button" onClick={()=>finish(null)}>Vazgeç</button><button type="submit" className={request.danger?'danger-button':'primary-button'}>{request.submit||'Kaydet'}</button></div></form>}</DialogContent></Dialog>;
 return {ask,dialog};
}
