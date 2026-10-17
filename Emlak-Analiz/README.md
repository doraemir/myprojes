# 🏠 EvPusula — Emlak Analiz

**JavaScript · TypeScript · React · Vinext · Cloudflare Workers**

## Türkçe

İlan bağlantısı ve kullanıcının sağladığı bilgilerle çevre/emsal raporu hazırlayan web uygulaması. İlan metni çıkarımı, rapor şablonları, çevre sorgusu ve karşılaştırma kuralları kaynakları eklendi.

### Kurulum

Komutları bu proje klasöründe çalıştırın. Node.js/npm gereklidir; web projelerinin Node.js alt sınırı package.json içindedir.

```bash
npm install
npm run dev
# Bağımsız kontroller / Standalone checks:
node --test tests/*.test.mjs
```

### Doğrulama ve sınırlar / Validation and limitations

19 bağımsız test geçti. Build ve tarayıcı testi yapılmadı. Bağlantıdan otomatik ilan kazıma veya tüm internetten emsal arama entegre değildir; canlı harita sağlayıcısı bu kontrolde doğrulanmadı. / 19 standalone tests passed. Build/browser tests were not run. Automatic listing scraping and web-wide comparable search are not integrated; live map provider behavior is unverified.

## English

Property and neighborhood reporting app based on listing URLs and user-supplied data. Includes text parsing, report templates, nearby queries and comparable-property rules.

Run the commands above from this project folder. Web snapshots preserve their Sites-specific build integration; configure the hosting environment before deployment. A source upload does not imply production readiness.

## Kaynak ve değişiklik kaydı / Source and change log

- **17 Ekim / October 2026:** Erişilebilir en güncel kaynak paketi veya Sites kaynak deposu aktarıldı. / Imported the latest accessible package or Site source snapshot.
- Gizli dosyalar, yerel bağımlılıklar ve runtime verileri dahil edilmedi. / Secrets, local dependencies and runtime data are excluded.
- Mevcut kaynak notları varsa SOURCE_NOTES.md ve paket içindeki README belgelerinde korunur. / Original notes are retained where available.
- Uygulama özellikleri bu aktarım için yeniden yazılmadı. / Application features were not rewritten for this transfer.

[← Tüm projeler / All projects](../README.md)

