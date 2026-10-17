export const MAX_AVATAR_BYTES=2*1024*1024;
export function validAvatarJpeg(bytes:Uint8Array){
 if(bytes.length<16||bytes.length>MAX_AVATAR_BYTES||bytes[0]!==255||bytes[1]!==216||bytes.at(-2)!==255||bytes.at(-1)!==217)return false;
 let offset=2;
 while(offset+4<bytes.length){
  if(bytes[offset++]!==255)return false;
  while(bytes[offset]===255)offset++;
  const marker=bytes[offset++];
  if(marker===218||marker===217)return false;
  if(marker===1||marker>=208&&marker<=215)continue;
  const length=(bytes[offset]<<8)|bytes[offset+1];if(length<2||offset+length>bytes.length)return false;
  if([192,193,194].includes(marker)){if(length<8)return false;const height=(bytes[offset+3]<<8)|bytes[offset+4];const width=(bytes[offset+5]<<8)|bytes[offset+6];return width>0&&height>0&&width<=1024&&height<=1024;}
  offset+=length;
 }
 return false;
}
export async function limitedBody(request:Request,maxBytes=MAX_AVATAR_BYTES+65536){
 const length=Number(request.headers.get('Content-Length'));if(length>maxBytes)throw new Error('too-large');
 if(!request.body)throw new Error('missing-body');const reader=request.body.getReader();const chunks:Uint8Array[]=[];let total=0;
 try{while(true){const {done,value}=await reader.read();if(done)break;total+=value.length;if(total>maxBytes){await reader.cancel();throw new Error('too-large')}chunks.push(value)}}finally{reader.releaseLock()}
 const bytes=new Uint8Array(total);let at=0;for(const chunk of chunks){bytes.set(chunk,at);at+=chunk.length}return bytes;
}
