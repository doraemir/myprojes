NutriAI V7 - V4 Korunarak Güncellendi

Bu sürüm V4 kaynak paketinden oluşturuldu. V4 backend controller'ları, özellikle PricesController.cs ve NutritionController.cs değiştirilmedi.

V7 güncellemeleri:
- Uygulama ilk açılışta Türkçe / English dil seçimi sorar.
- Profil ekranından dil yeniden değiştirilebilir.
- Plan dışı yiyecek butonu artık çalışan modal açar; yiyecek adı, kcal, protein, karbonhidrat ve yağ kaydedilir.
- Kazanılmış toplam XP plan dışı tüketim yüzünden silinmez; kayıt günlük uyum/bonus mantığında değerlendirilir.
- Bahçem bağımsız ana sekmedir. Sepet/sipariş akışına bağlı değildir.
- V4 ana tema, açık yeşil kart yapısı, avokado marka görünümü korunmuştur; dil ekranı ve modal tasarımı eklenmiştir.
- V4 market fiyat endpoint'i ve market karşılaştırma ekranı korunmuştur.

Çalıştırma:
1) NutriAI.Api klasöründe: dotnet run
2) MobileApp klasöründe ilk kurulum: npm install --legacy-peer-deps
3) Web: npx expo start --web --clear
4) Expo Go: npx expo start --tunnel --clear
