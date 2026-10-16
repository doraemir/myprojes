# CepPilot Mobile — MVP v0.2

**A real React Native application for Android and iOS, not a website.** Built using Expo SDK 54 + TypeScript.

## Requirements
- Windows/macOS/Linux, Node.js LTS and npm
- Expo Go mobile app (or Android emulator / iOS test build)

## Start in PowerShell
```powershell
cd myprojes/CepPilot
npm install
npx expo install --fix
npx expo start
```
Scan the Expo QR code in Expo Go while connected to the same network. If local connectivity fails try `npx expo start --tunnel` (may require extra dependencies).

## Includes
- Mobile four-tab navigation: Home, Activity, Insights, Settings
- Add expenses/income with seven expense categories
- Transactions history, hold to confirm deletion
- 7-day bar chart and spending category progress bars (native Views, no external chart service)
- Safe-to-spend estimate from remaining funds / days until next payday
- Editable starting balance, unpaid bills, reserve, payday, currency
- AsyncStorage offline persistence, minor-unit integer cents arithmetic
- No permissions required, no server, no bank login

## IMPORTANT before publishing
- **Not tested on physical Android/iOS device yet**; perform device QA.
- AsyncStorage is **not encrypted**; do not store detailed personal financial information until secure storage approach is implemented.
- Multi-currency not supported: changing currency changes **display only**, not converted amounts. Use one currency per accounting ledger.
- Balance is starting balance plus entries. If starting balance already contains recorded entries, you will double count. Use balance at app adoption and log only *new* movements.
- Bills and reserves are manual, and planned bills must not already have been subtracted from the current balance.
- Input precision is two decimal places; yen and other zero- or three-decimal currencies are not implemented.
- Estimate doesn't include irregular future income, interest, liabilities not entered by the user or overdraft. Not financial advice.
- No bank sync, cloud sync, encrypted storage, sign-in, subscriptions, push notifications or translations yet.
- Date aggregation uses UTC month keys currently. Before global release, update monthly grouping to the device's local timezone and write timezone tests.
- Before App Store / Play Store submission, add assets, bundle ID, privacy policy, user testing, accessibility, localization, appropriate security and required store disclosures.

## GitHub aktarımı

16 Ekim 2026: Mevcut mobil v0.2 arşivinden aktarıldı. Arşiv etiketi ve app.json 0.2.0, package.json 0.1.0 sürümünü taşıyor. Bu aktarımda uygulama kodu değiştirilmedi. Cihaz ve derleme testleri bu aktarım sırasında çalıştırılmadı.
