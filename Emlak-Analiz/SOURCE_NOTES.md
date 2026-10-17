# EvPusula v0.2 — linkten başlayan ilan ve çevre raporu

Kullanıcı bir platformda ilanı bulur, linki buraya gönderir. Uygulama bir ilan portalı değildir. Korunan koyu yeşil/krem tasarım; ana ekran URL girişi, altı değerlendirme alanı ve açıkça ayrılmış örnek rapor içerir.

## Çalışan akışlar
- POST /api/listing: bilinen https ilan adresinin kaynağını tanır, `awaiting_source` döndürür. Siteye dış istek atmaz. Kullanıcı tarafından yapıştırılan ilan metnindeki temel alanları çıkarır (`user_text`) ve doğrulamaya sunar.
- Kaynaklar: Sahibinden (shbd.io dahil), Hepsiemlak, Emlakjet, Zingat. Bunlar otomatik okuma/arama sağlayıcıları olarak entegre değildir.
- Fiyat, toplam bilinen maliyet, ulaşım, günlük yaşam, ev/bina, altyapı, deprem/çevre, alternatifler ve tüm rapor sekmeleri.
- Her özellik için olası artı, olası eksi ve bu evde kontrol edilmesi gereken bilgi; kaynak ve veri bekleniyor durumları.
- POST /api/nearby: kullanıcı kesin Türkiye koordinatını doğruladığında OpenStreetMap/Overpass 1,5 km çevre sorgusu. Metro, diğer raylı sistem, durak, market, sağlık, okul ve park kayıtları. Bina/tesis merkezine kuş uçuşu uzaklık, yürüme rotası değil. 18 s timeout, çıktı sınırı ve isolate içi basit rate limit. Eksik kayıt çevrede tesis yok demek değildir.
- Kullanıcı emsallerine JSON ve elle giriş; örnek veriler kullanıcı hesabına katılmaz. Fiyat hesabında en az 5 eşleşme. Alternatiflerde aynı tür/oda/ilçe, net alan ±%15 ve yaş ±3 yıl.
- Tarayıcıda rapor kaydı ve JSON yedeği; tüm sekmelerin print/PDF çıktısı. Sunucuya kalıcı ilan/rapor kaydı yapılmaz.

## Mimari
Vinext/Cloudflare Workers starter'ın Sites build entegrasyonu korunur. / route responsive deneyimi aynı-origin iframe içinde sunar; arayüz kaynakları public/experience içindedir. API rotaları app/api içinde. lib/report-core.mjs metin çıkarma ve coğrafi hesaplamayı UI'dan bağımsız tutar. Bu servisler gelecekte mobil istemciyle paylaşılabilir. D1/R2 şu an kullanılmaz.

## Henüz tamamlanmayan bağlantılar
- Linkten otomatik ilan okuma ve tüm internetten alternatif arama: izinli sağlayıcı/API sözleşmeleri ve canlı adaptörler gerekiyor. Mevcut API bilinmeyen alana istek atmaz; erişim engeli veya CAPTCHA aşılmaz.
- İlan aktifliği, yayın/son görülme tarihi, kaynaklar arası mükerrer kayıt kontrolü.
- Otomatik kesin konum çıkarma; yaya güzergâhı ve kapıdan kapıya işe gidiş.
- Su/elektrik kesinti geçmişi, fiber sorgusu, AFAD değerleri, zemin/parsel ve yapı belgeleri.
- Kullanıcı hesapları, sunucu rapor geçmişi ve cihazlar arası senkronizasyon.

İlan veya yaş bilgisinden yapı güvenlik puanı üretilmez. AFAD bölgesel tehlike, yerel zemin ve bina performansı ayrı değerlendirmelerdir. Anlık su kesintisi kronik problem olarak yorumlanmaz. Gider belirsizse sıfır varsayılmaz.

## Kontroller
`node --test tests/*.test.mjs`
`node --check public/experience/app.mjs`
Sites build helper ile üretim build'i.
API dış sağlayıcı testleri kontrollü mock ile yapılır; canlı harita sağlayıcı yanıtı doğrulanmış sayılmaz. Bu ortamda control-browser becerisi olmadığı için gerçek tarayıcıda görsel/etkileşim QA yapılmadı.
