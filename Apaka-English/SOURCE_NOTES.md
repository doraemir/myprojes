# Apaka Online Dil Okulu

Mevcut giriş sayfası korunarak hazırlanan öğrenci portalı ve yönetim paneli.

## Giriş ve roller

- Giriş / kayıt ve çıkış, Apaka e-posta / şifre sistemiyle yapılır. Şifreler PBKDF2-SHA256 ve rastgele tuz ile hash edilir. Oturum belirteçlerinin yalnızca SHA256 hashleri D1 içinde tutulur; çerez HttpOnly, Secure, SameSite=Lax niteliğindedir. Eski ChatGPT kimlik başlıkları giriş yetkisi vermez.
- Site sahibinin mevcut yönetici kaydı korunur. İlk şifre, kaynakta bulunmayan bir kurulum belirtecinin runtime secret hashine karşı doğrulanmasıyla kurulur. Yönetici e-postası genel kayıtta kullanılamaz. Yeni hesaplar öğrenci olur; gönderilen rol alanı dikkate alınmaz.
- ChatGPT giriş zorunluluğu kaldırıldığında ana sayfa ve giriş/kayıt sayfaları herkesçe erişilebilir; öğrenci ve yönetici verileri sunucu tarafındaki parola oturumları ve rollerle korunur.
- Önceden açılmış hesaplar genel kayıtta yeniden sahiplenilemez. Yönetici Öğrenci Detay ekranından 24 saatlik, tek kullanımlık şifre bağlantısı üretir. Şifre değişimi diğer oturumları iptal eder. E-posta doğrulama / otomatik e-posta şifre yenileme servisi bu aşamada yoktur; şifre bağlantıları yönetici tarafından paylaşılır.

## Çalışan alanlar

Öğrenci: programlara katılım, ders listesi ve sıralı ders kilitleri, video / metin dersleri, tamamlanma ve son ders takibi, sunucuda değerlendirilen quizler, puan geçmişi, metin veya dosyayla ödev teslimi, öğretmen geri bildirimi, PDF / kaynak indirme, Speaking Club katılımı, takvim ve ICS dışa aktarma, mesajlar ve bildirimler, ödeme kayıtları, profil, seviye ön testi ve program tamamlama sertifikası.

Yönetici / öğretmen: gerçek kayıtlarla hesaplanan dashboard, öğrenci arama / filtreleme / CSV, öğrenci profili ve program kaydı, program / dönemsel program / ders / quiz / ödev / kaynak / etkinlik oluşturma ve düzenleme, quiz sonuçları, ödev puanlama, toplantı bağlantısı ekleme, dosya yükleme, ödeme kaydı ve tahsilat işaretleme, mesajlar, aylık grafikler, rapor CSV. Okul ayarları ve rol yönetimi yalnızca yöneticidedir.

Ücretli programa katılım, tek bir bekleyen program ücreti kaydı oluşturur. Tekrar katılmak aynı ücreti tekrar oluşturmaz. Bu sistem karttan para çekmez; banka veya ödeme sağlayıcısı entegrasyonu eklenmemiştir.

## İçerik

İlk yönetici girişinde örnek A1–C1 programları ve dönemsel program, ders metinleri, quizler, yazma ödevleri ve iki örnek etkinlik oluşturulur. Gerçek öğrenci veya tahsilat kayıtları uydurulmaz. Kısa örnek video 24 saniyedir ve referans alpaka görselini kullanır. Örnek PDF iki sayfadır. Ders videoları yönetim panelinde doğrudan HTTPS MP4 bağlantısıyla, toplantılar gerçek HTTPS toplantı bağlantısıyla değiştirilir. Site içinde video konferans sunucusu veya e-posta teslim servisi bulunmaz.

Sertifika tüm dersler ve tüm quizler tamamlanınca oluşturulan Apaka program tamamlama belgesidir; akreditasyon veya resmî CEFR sertifikası iddiası yoktur. Kısa seviye testi program önerisidir.

## Veri ve yetki

D1 kalıcı kayıtları, R2 ders ve ödev dosyalarını tutar. Her API isteği platform kimliğini ve hesap durumunu kontrol eder. Öğrenci sorguları, mesajlar ve indirilen dosyalar kullanıcı / program kapsamındadır. API cevaplarında öğrenciye doğru quiz cevapları sınavdan önce gönderilmez. Yazma isteklerinde origin kontrol edilir. Öğretmen yönetim yetkisine sahiptir; yönetici rolü veremez ve okul ayarlarını değiştiremez. Öğrenci başkalarına mesaj gönderemez; yalnızca aktif öğretmen / yöneticiyle iletişim kurar.

## Doğrulama

- `node --check public/portal.js`
- `node tests/ui.test.mjs`: SQLite üzerinde gerçek API işleyicisiyle rol sınırları, veri izolasyonu, ön kayıt eşleştirme, ders sırası, quiz puanlama, sertifika koşulları, ödev ve geri bildirim, dosya kapsamı, mesajlar, ödemeler ve yinelenen ücret önleme; ayrıca 25 ekran ve altı editörün render kontrolleri.
- `node node_modules/typescript/bin/tsc --noEmit`
- Sites `scripts/build-site.mjs` ile production build.

Bu ortamda desteklenen tarayıcı QA becerisi mevcut olmadığından görsel tarayıcı kontrolü yapılmamıştır.

## Tema

Ana sayfa, giriş/kayıt, şifre belirleme ve panellerde gece/gündüz düğmesi vardır. Tercih localStorage içinde tutulur, ilk açılışta sistem teması izlenir. Özgün marka ve alpaka resimleri değiştirilmez.

`node tests/auth.test.mjs`: gerçek PBKDF2 ve gerçek SQLite üzerinden 24 parola/oturum testi.

## Girişsiz Seviye Tespiti

Ana sayfa Seviyeni Öğren düğmesi `/placement.html` açar. `/api/public-placement` kayıt veya oturum gerektirmeden 20 soruyu cevap anahtarı olmadan verir; sonuç sunucuda hesaplanır. Test dil bilgisi ve okuma ön değerlendirmesidir, CEFR akreditasyonu iddiası yoktur. Giriş yapmış aktif öğrencinin seviye önerisi profilinde de güncellenir. `node tests/placement.test.mjs` anonim erişimi, cevap gizliliğini, puanlamayı, geçersiz istekleri ve ana sayfa bağlantısını kontrol eder.
