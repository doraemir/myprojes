export const normalize = v => String(v).normalize('NFKC').toLocaleLowerCase('tr-TR').replace(/\s+/g,' ').trim();
export const isSameLocation=(a,b)=>['city','district','neighborhood'].every(k=>normalize(a[k])===normalize(b[k]));
export function quantile(values,q){if(!values.length)return null;const s=[...values].sort((a,b)=>a-b),p=(s.length-1)*q,i=Math.floor(p);return s[i]+(s[Math.min(i+1,s.length-1)]-s[i])*(p-i)}
export function validateProperty(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('İlan bilgileri nesne olmalı.');
 const p={};for(const [k,max] of [['title',120],['city',60],['district',60],['neighborhood',80],['source',100]]){if(typeof raw[k]!=='string'||!raw[k].trim()||raw[k].length>max)throw Error(k+' alanı eksik veya çok uzun.');p[k]=raw[k].trim()}
 if(!['sale','rent'].includes(raw.type))throw Error('İlan türü sale veya rent olmalı.');p.type=raw.type;
 if(!['1+1','2+1','3+1','4+1','5+1'].includes(raw.rooms))throw Error('Geçerli bir oda sayısı seçin.');p.rooms=raw.rooms;
 for(const [k,min,max] of [['price',1,1e9],['area',10,1500],['age',0,150],['floor',-5,100],['dues',0,1e6]]){if(raw[k]===null||raw[k]===undefined||raw[k]===''||typeof raw[k]==='boolean'||!Number.isFinite(Number(raw[k]))||Number(raw[k])<min||Number(raw[k])>max)throw Error(k+' alanı geçerli aralıkta bir sayı olmalı.');p[k]=Number(raw[k])}
 if(!Number.isInteger(p.age)||!Number.isInteger(p.floor))throw Error('Bina yaşı ve kat tam sayı olmalı.');
 for(const k of ['elevator','parking']){if(!['yes','no','unknown'].includes(raw[k]))throw Error(k+' alanı yes, no veya unknown olmalı.');p[k]=raw[k]}
 p.url='';if(raw.url){if(typeof raw.url!=='string'||raw.url.length>2000)throw Error('İlan bağlantısı geçersiz.');let u;try{u=new URL(raw.url)}catch{throw Error('Geçerli bir ilan bağlantısı girin.')}if(!['http:','https:'].includes(u.protocol)||u.username||u.password)throw Error('Bağlantı http veya https ile başlamalı ve kullanıcı bilgisi içermemeli.');p.url=u.href}
 return p;
}
export function analyze(target,pool){
 const matches=pool.filter(p=>p.id!==target.id&&p.type===target.type&&isSameLocation(p,target)&&p.rooms===target.rooms&&Math.abs(p.area/target.area-1)<=.3&&Math.abs(p.age-target.age)<=10&&Number.isFinite(p.price/p.area));
 const units=matches.map(p=>p.price/p.area);const median=quantile(units,.5);const sufficient=matches.length>=5;
 return{matches,median,sufficient,count:matches.length,currentUnit:target.price/target.area,low:quantile(units,.25),high:quantile(units,.75),delta:median?(target.price/target.area/median-1)*100:null};
}
export function featureNotes(p){const pros=[],cons=[],checks=[];
 if(p.elevator==='yes')pros.push('İlanda asansör bulunduğu belirtiliyor.');else if(p.elevator==='no'&&p.floor>=3)cons.push(p.floor+'. katta asansör yok; günlük erişimi zorlaştırabilir.');else if(p.elevator==='unknown')checks.push('Asansör bilgisi belirtilmemiş.');
 if(p.parking==='yes')pros.push('İlanda otopark bulunduğu belirtiliyor.');else if(p.parking==='no')cons.push('Otopark yok; sokaktaki park imkânını kontrol edin.');else checks.push('Otopark bilgisi belirtilmemiş.');
 if(p.floor<=0)cons.push('Zemin veya alt kat: ışık, nem ve mahremiyet yerinde incelenmeli.');
 if(p.dues>0){if(p.type==='rent'&&p.dues/p.price>.1)cons.push('Aidat, aylık kiranın %10’undan yüksek.');else checks.push('Aylık aidat '+p.dues.toLocaleString('tr-TR')+' TL; hangi giderleri kapsadığını sorun.')}
 checks.push('Tapu, iskân ve binanın deprem performansı bu verilerden doğrulanamaz.');return{pros,cons,checks};
}
export function parseImport(text){const arr=JSON.parse(text);if(!Array.isArray(arr)||!arr.length||arr.length>500)throw Error('Dosya 1–500 ilan içeren bir JSON dizisi olmalı.');return arr.map((p,i)=>{try{return validateProperty(p)}catch(e){throw Error('Kayıt '+(i+1)+': '+e.message)}})}
