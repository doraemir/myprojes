# 🥗 NutriAI — V11

**React Native · TypeScript · C# · ASP.NET Core · PostgreSQL**

## Türkçe

Haftalık öğün planı, alışveriş listesi ve kullanıcı durumunu yöneten mobil uygulama ve C# API temeli. V11 arşivindeki MobileApp ve NutriAI.Api kaynakları birlikte aktarılmıştır.

### Kurulum

Komutları bu proje klasöründe çalıştırın. Node.js/npm gereklidir; web projelerinin Node.js alt sınırı package.json içindedir.

```bash
cd MobileApp
npm install
npx expo start
# Ayrı terminal / Separate terminal:
# cd NutriAI.Api
# dotnet run
```

### Doğrulama ve sınırlar / Validation and limitations

Mobil cihaz, bağımlılık kurulumu ve .NET derlemesi doğrulanmadı. PostgreSQL bağlantısı ve JWT anahtarı ortamda yapılandırılmalıdır. Paket sürümleri ve API bağlantısı cihazda kontrol edilmelidir. / Mobile execution, dependencies and .NET build are unverified. Configure PostgreSQL and JWT secrets before running. Nutrition and allergy outputs need user verification.

## English

Mobile meal planning and shopping list application with a C# API foundation. The V11 snapshot includes both MobileApp and NutriAI.Api, with authentication and per-user state services.

Run the commands above from this project folder. Web snapshots preserve their Sites-specific build integration; configure the hosting environment before deployment. A source upload does not imply production readiness.

## Kaynak ve değişiklik kaydı / Source and change log

- **17 Ekim / October 2026:** Erişilebilir en güncel kaynak paketi veya Sites kaynak deposu aktarıldı. / Imported the latest accessible package or Site source snapshot.
- Gizli dosyalar, yerel bağımlılıklar ve runtime verileri dahil edilmedi. / Secrets, local dependencies and runtime data are excluded.
- Mevcut kaynak notları varsa SOURCE_NOTES.md ve paket içindeki README belgelerinde korunur. / Original notes are retained where available.
- Uygulama özellikleri bu aktarım için yeniden yazılmadı. / Application features were not rewritten for this transfer.

[← Tüm projeler / All projects](../README.md)

