# CepPilot v0.9 – kayıt ekranı hata düzeltmeleri

- Tanımlanmamış `activeScroll` referansı eklendi (önemli kayıt ekranı çökmesi).
- Hatalı `scrollToEnd` klavye davranışı kaldırıldı; iOS KeyboardAvoidingView ve ScrollView korundu.
- Ana ekrandaki geçici ok benzeri logo kaldırıldı. Onaylanan orijinal Kaju dosyaları erişilebilir olmadığı için sade CP yazı logosu kullanılır.
- Gelir yeşil/gider kırmızı görünümü korundu, bakiye rengi duruma göre değişir.
- Profil sıfırlama akışında ilk adıma dönüş güncellendi.

## Kurulum
Ayrı klasöre açın. `CepPilot_Baslat.bat` dosyasına çift tıklayın. İlk çalışmada npm paketleri kurulacaktır. iPhone ile aynı Wi-Fi ağına bağlanın.

## Test
Açılış > Hadi başlayalım > Ad ve soyad > gelir türü > Abonelikler > Tamamla ve başla.
Sonra Para ekle, gider ekle, Analiz, Planlar ve Ayarlar ekranlarını kontrol edin.

*Otomatik npm derlemesi ve iPhone cihaz testi bu ortamda yapılmadı. Eski uygulama klasörünü silmeyin.*
