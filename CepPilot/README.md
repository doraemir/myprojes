# 💰 CepPilot
### Cebindeki bütçe yardımcısı

Gelir ve giderlerini kaydetmek, harcamalarını görmek ve bir sonraki maaş gününe kadar günlük bütçeni takip etmek için geliştirilen mobil uygulama.

**Teknolojiler:** React Native · Expo SDK 54 · TypeScript · AsyncStorage  
**Durum:** Mobil MVP kaynakları yüklü; fiziksel cihaz testi bekliyor.

## Kaynakta bulunan özellikler

- Ana sayfa, işlem geçmişi, analizler ve ayarlar olmak üzere dört sekme.
- Gelir ve gider kaydı; yedi harcama kategorisi.
- İşleme uzun basarak onaylı silme.
- Son yedi günün harcama grafiği ve kategori dağılımı.
- Bakiye, planlanan faturalar ve ayrılan birikime göre günlük harcama tahmini.
- Başlangıç bakiyesi, maaş günü ve para birimi ayarları.
- Cihaz üzerinde çevrimdışı kayıt; tutarlarda tam sayı kuruş hesabı.

## Kurulum

Node.js ve npm gereklidir. Depoyu indirdikten sonra terminali **package.json dosyasının bulunduğu CepPilot klasöründe** aç:

```powershell
cd myprojes/CepPilot
npm install
npx expo install --fix
npx expo start
```

Terminal zaten CepPilot klasöründeyse ilk komutu atla. Uyumlu Expo Go uygulaması veya emülatör/test derlemesiyle aç. Yerel ağ bağlantısı kurulamazsa `npx expo start --tunnel` denenebilir; ek bağımlılık gerektirebilir.

## Dosyalar

| Dosya | Görevi |
| --- | --- |
| App.tsx | Ekranlar, bütçe hesapları ve kayıt yönetimi |
| package.json | Bağımlılıklar ve çalıştırma komutları |
| app.json | Expo ve mobil uygulama ayarları |
| tsconfig.json | TypeScript yapılandırması |
| .gitignore | Yerel bağımlılık ve gizli dosyaları dışlama |

## Mevcut sınırlar

- Fiziksel Android/iOS cihaz testi ve bu aktarım sırasında derleme testi yapılmadı.
- AsyncStorage şifreli değildir; hassas finansal ayrıntılar için uygun güvenli depolama henüz yoktur.
- Para birimi seçimi yalnızca gösterimi değiştirir; mevcut tutarları dönüştürmez. Tek kayıt düzeninde tek para birimi kullanılmalıdır.
- Başlangıç bakiyesi, uygulamaya kaydedilecek işlemlerden önceki bakiye olmalıdır; aynı hareket iki kez hesaba katılmamalıdır.
- Fatura ve birikim tutarları elle girilir. Ödenmiş faturalar yeniden planlanan tutara eklenmemelidir.
- İki ondalık basamak desteklenir; sıfır veya üç ondalıklı para birimleri uygulanmadı.
- Aylık gruplama UTC kullanır; yerel saat dilimi iyileştirmesi bekliyor.
- Banka bağlantısı, bulut yedekleme, giriş, abonelik, bildirim ve çeviri bulunmuyor.
- Günlük bütçe bir tahmindir; girilmeyen borçları, faizleri veya düzensiz gelecek gelirlerini kapsamaz ve finansal tavsiye değildir.

## Sonraki adımlar

1. Cihaz üzerinde kayıt, silme ve yeniden açma akışlarını doğrulamak.
2. Türkçe arayüz ve yerel tarih hesaplarını geliştirmek.
3. Güvenli depolama, erişilebilirlik ve mağaza gerekliliklerini tamamlamak.

## Geliştirme kaydı

- **16 Ekim 2026:** Mobil v0.2 arşivindeki kaynaklar GitHub'a aktarıldı; Türkçe kurulum ve proje tanıtımı eklendi.
- Arşiv ve app.json 0.2.0, package.json ise 0.1.0 sürümünü taşır. Aktarım sırasında uygulama kodu değiştirilmedi.

[← Tüm projeler](../README.md)
