@echo off
setlocal EnableExtensions
chcp 65001 >nul
title CepPilot - iPhone Baslatici
cd /d "%~dp0"
echo.
echo =========================================
echo        CepPilot Mobil Baslatici
echo =========================================
echo.
if not exist "package.json" (
  echo [HATA] package.json bulunamadi.
  echo Bu BAT dosyasini CepPilot proje klasorune,
  echo package.json ile AYNI klasore kopyalayin.
  echo.
  echo Mevcut klasor: %CD%
  goto :fail
)
where node >nul 2>nul
if errorlevel 1 (
  echo [HATA] Node.js bulunamadi. Node.js kurup tekrar deneyin.
  goto :fail
)
where npm >nul 2>nul
if errorlevel 1 (
  echo [HATA] npm bulunamadi. Node.js kurulumunu kontrol edin.
  goto :fail
)
if not exist "node_modules\expo\bin\cli" (
  echo Ilk kurulum veya eksik paketler algilandi.
  echo npm install calistiriliyor, bu biraz surebilir...
  call npm install
  if errorlevel 1 (
    echo [HATA] Paket kurulumu basarisiz oldu.
    goto :fail
  )
)
echo.
echo iPhone ile PC ayni Wi-Fi agindaysa QR kodu okutun.
echo Expo Go icinde CepPilot acilacaktir.
echo.
echo Expo LAN sunucusu baslatiliyor...
echo Kapatmak icin bu pencerede Ctrl+C kullanabilirsiniz.
echo.
call npx --no-install expo start --lan
if errorlevel 1 (
  echo.
  echo [UYARI] LAN baslatilamadi. Tunnel denemek ister misiniz?
  choice /C EH /M "E=Evet, H=Hayir"
  if errorlevel 2 goto :fail
  call npx --no-install expo start --tunnel
  if errorlevel 1 goto :fail
)
echo.
echo CepPilot oturumu sona erdi.
pause
exit /b 0
:fail
echo.
echo Yukaridaki hata mesajini bana gonderebilirsin.
pause
exit /b 1
