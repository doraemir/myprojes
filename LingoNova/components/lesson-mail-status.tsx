'use client';
export type MailLesson={status:string;reminderMinutes:number;startsAt:string;creationMailStatus?:string;reminderMailStatus?:string;reminderEmailId?:string|null;reminderSent?:boolean};
export function mailLabels(l:MailLesson){
 const created=l.creationMailStatus==='sent'?'Gönderildi':l.creationMailStatus==='failed'?'Başarısız':l.creationMailStatus==='legacy'?'Eski kayıt · durum bilinmiyor':'Bekliyor';
 const reminder=l.status==='cancelled'?'İptal edildi':!l.reminderMinutes?'Kapalı':l.reminderMailStatus==='failed'?'Başarısız':l.reminderSent?'Gönderildi':l.reminderEmailId||l.reminderMailStatus==='scheduled'?'Planlandı · teslim doğrulanmadı':new Date(l.startsAt).getTime()-l.reminderMinutes*60000<=Date.now()?'Zamanı geçti · gönderim doğrulanmadı':'Bekliyor';
 return {created,reminder};
}
export function LessonMailStatus({lesson}:{lesson:MailLesson}){const m=mailLabels(lesson);return <section className="mail-status-panel"><h3>E-posta durumu</h3><div><span>Ders oluşturulma maili</span><b>{m.created}</b></div><div><span>Ders öncesi hatırlatma</span><b>{m.reminder}</b></div><small>Planlandı, gönderim servisine aktarıldığını gösterir. Hatırlatma teslimatı henüz siteye bildirilmez.</small></section>}
