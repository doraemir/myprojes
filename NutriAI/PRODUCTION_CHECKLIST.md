# NutriAI V11 Production Checklist

## Paket içinde tamamlanan temel altyapı
- PostgreSQL/Npgsql ve EF Core Design
- JWT access token + döndürülen refresh token ve refresh-token rotation
- PBKDF2-SHA256 parola hashing (210k iterasyon, random salt)
- Yetkilendirilmiş UserState: kullanıcı yalnızca kendi kaydına erişir
- XPTransactions audit tablosu ve sunucu tarafı XP event endpoint'i
- Rate limiting, kontrollü CORS, production HTTPS redirect, global exception response, /health
- Mobile login/register ekranı, secure token storage (native SecureStore), web fallback
- EXPO_PUBLIC_API_URL ile production API adresi
- Mevcut V10 akışı, market, Bahçem, konum, plan, tarif, rapor ekranları korunmuştur

## Dış servis/işletme bilgisi gerektirdiği için yayıncı tarafından tamamlanacaklar
- Supabase DB şifresi ve Jwt:Key secret değerleri
- Production API hosting + HTTPS domain
- Web/app production domainlerini Cors:AllowedOrigins'e ekleme
- Gerçek market fiyat sağlayıcısı sözleşmesi/API'si. PricesController mevcut demo fiyat davranışını korur; canlı fiyat diye sunulmamalı.
- E-posta sağlayıcısı bağlandıktan sonra email verification / forgot password gönderimi
- Gizlilik/Kullanım Koşulları metninin gerçek işletmeci ve KVKK süreçleriyle hukuk incelemesi
- App Store / Play Store hesapları, privacy declarations, icon/splash final assets
- Analytics/crash reporting sağlayıcısı seçimi

## İlk kurulum
1. `dotnet restore`
2. User Secrets'a `ConnectionStrings:NutriAiDb` ve en az 32 karakter rastgele `Jwt:Key` ekle.
3. Eski provider'a ait migrations varsa production migration oluşturmadan önce gözden geçir.
4. `dotnet ef migrations add V11ProductionFoundation`
5. `dotnet ef database update`
6. `dotnet run`; `/health` 200 dönmeli.
7. MobileApp: `npm install --legacy-peer-deps`; `.env` içinde `EXPO_PUBLIC_API_URL` ayarla; `npx expo start --clear`.

## Yayın öncesi test zorunluları
Register/login/refresh/logout; iki hesabın verilerinin birbirine kapalı olması; plan oluşturma; alerji filtreleri; plan save/restore; market demo etiketi; XP event manipülasyonu; offline/API error; iOS/Android/web layout; account deletion (eklenmeden store yayını yapma).
