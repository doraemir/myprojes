'use client';
export async function prepareAvatar(file:File){
 if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw new Error('JPG, PNG veya WebP biçiminde bir fotoğraf seç.');
 if(file.size>5*1024*1024)throw new Error('En fazla 5 MB büyüklüğünde bir fotoğraf seç.');
 const bitmap=await createImageBitmap(file).catch(()=>{throw new Error('Fotoğraf açılamadı. Başka bir dosya seç.')});
 try{if(!bitmap.width||!bitmap.height||bitmap.width*bitmap.height>40000000)throw new Error('Fotoğrafın çözünürlüğü çok büyük. Daha küçük bir fotoğraf seç.');const canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;const context=canvas.getContext('2d');if(!context)throw new Error('Fotoğraf işlenemedi.');const side=Math.min(bitmap.width,bitmap.height);context.fillStyle='#ffffff';context.fillRect(0,0,512,512);context.drawImage(bitmap,(bitmap.width-side)/2,(bitmap.height-side)/2,side,side,0,0,512,512);const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error('Fotoğraf hazırlanamadı.')),'image/jpeg',.88));return new File([blob],'profile.jpg',{type:'image/jpeg'})}finally{bitmap.close()}
}
