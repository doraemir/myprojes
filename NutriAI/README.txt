NUTRIAI - KİŞİSELLEŞTİRME GÜNCELLEMESİ

Bu paket, çalışan NutriAI akışını koruyup üzerine yeni özellikler ekler.

EKLENENLER
- Beslenme tipi: Normal / Vejetaryen / Vegan / Pesketaryen
- Çoklu alerji seçimi
- Sevmediğin yiyecekleri yazma alanı
- Günlük 2 / 3 / 4 / 5 öğün seçimi
- 1-8 kişi için alışveriş miktarı
- Bütçe tarzı: Ekonomik / Ortalama / Lüks
- Haftalık bütçeyi alışveriş ekranında sonradan değiştirme
- Öğünlerde “Değiştir” butonu ve uygun alternatif üretme
- Alışveriş listesi, öğün değişince otomatik yeniden hazırlanır
- Mevcut canlı market fiyat karşılaştırması korunur
- A101, BİM, ŞOK, CarrefourSA, Migros fiyatları
- Sepet toplamı seçilen bütçe tarzına göre yeniden hesaplanır

ÖNEMLİ
- Alerji filtresi yardımcı bir filtredir. Paketli ürünlerde etiket ve çapraz bulaşma uyarıları mutlaka ayrıca kontrol edilmelidir.
- Market fiyatları stok, gramaj, mağaza ve konuma göre değişebilir.

ÇALIŞTIRMA
1) API terminali:
   cd "<Klasor>\NutriAI.Api"
   dotnet run
   API: http://localhost:5276

2) İkinci PowerShell:
   cd "<Klasor>\MobileApp"
   npm install --legacy-peer-deps
   npx expo start --web --port 8085
   Web: http://localhost:8085

İki terminali de açık tut.
