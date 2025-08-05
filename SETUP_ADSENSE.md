# 🚀 Konfiguracja Google AdSense - Instrukcja krok po kroku

## 📋 **Krok 1: Google AdSense Setup**

### 1.1 Zaloguj się do AdSense
- Przejdź do: https://www.google.com/adsense
- Zaloguj się swoim kontem Google

### 1.2 Dodaj stronę (jeśli nie dodana)
- Przejdź do "Sites" → "Add site"
- Dodaj: `https://mood4anime.com`
- Poczekaj na weryfikację (może potrwać kilka dni)

### 1.3 Skopiuj Publisher ID
- Przejdź do "Settings" → "Account information"
- Skopiuj "Publisher ID" (format: `ca-pub-XXXXXXXXXX`)

## 🎯 **Krok 2: Utwórz jednostki reklamowe**

### 2.1 Przejdź do "Ads" → "By ad unit" → "Create new ad unit"

### 2.2 Utwórz 5 jednostek:

#### **A. Header Banner**
- Nazwa: `Header Banner`
- Format: `Display ads`
- Rozmiar: `728x90`
- **Zapisz i skopiuj kod - znajdź `data-ad-slot="XXXXXXXXXX"`**

#### **B. Sidebar Banner**
- Nazwa: `Sidebar Banner`
- Format: `Display ads`
- Rozmiar: `300x250`
- **Zapisz i skopiuj kod - znajdź `data-ad-slot="XXXXXXXXXX"`**

#### **C. Content Banner**
- Nazwa: `Content Banner`
- Format: `Display ads`
- Rozmiar: `728x90`
- **Zapisz i skopiuj kod - znajdź `data-ad-slot="XXXXXXXXXX"`**

#### **D. Footer Banner**
- Nazwa: `Footer Banner`
- Format: `Display ads`
- Rozmiar: `728x90`
- **Zapisz i skopiuj kod - znajdź `data-ad-slot="XXXXXXXXXX"`**

#### **E. Inline Banner**
- Nazwa: `Inline Banner`
- Format: `Display ads`
- Rozmiar: `728x90`
- **Zapisz i skopiuj kod - znajdź `data-ad-slot="XXXXXXXXXX"`**

## ⚙️ **Krok 3: Konfiguracja pliku .env**

### 3.1 Skopiuj plik env.example
```bash
cp env.example .env
```

### 3.2 Edytuj plik .env z Twoimi danymi:

```bash
# API Configuration
REACT_APP_API_URL=https://your-backend-url.com

# AdSense Configuration
REACT_APP_ADS_ENABLED=true
REACT_APP_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXX  # Twój Publisher ID
REACT_APP_ADSENSE_HEADER_SLOT=XXXXXXXXXX        # Header Banner slot
REACT_APP_ADSENSE_SIDEBAR_SLOT=XXXXXXXXXX       # Sidebar Banner slot
REACT_APP_ADSENSE_CONTENT_SLOT=XXXXXXXXXX       # Content Banner slot
REACT_APP_ADSENSE_FOOTER_SLOT=XXXXXXXXXX        # Footer Banner slot
REACT_APP_ADSENSE_INLINE_SLOT=XXXXXXXXXX        # Inline Banner slot

# Google Analytics (opcjonalnie)
REACT_APP_GA_TRACKING_ID=G-XXXXXXXXXX

# Environment
REACT_APP_ENVIRONMENT=production
```

## 🔧 **Krok 4: Jak znaleźć slot ID**

W kodzie AdSense znajdziesz coś takiego:
```html
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXX"
     data-ad-slot="1234567890"  ← TO JEST SLOT ID
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
```

**Skopiuj tylko numer z `data-ad-slot="1234567890"`**

## 🚀 **Krok 5: Wdrożenie**

### 5.1 Przetestuj lokalnie:
```bash
npm start
```

### 5.2 Wdróż na produkcję:
```bash
npm run build
# Wdróż build na swoją domenę
```

## ✅ **Krok 6: Weryfikacja**

### 6.1 Sprawdź w przeglądarce:
- Otwórz DevTools (F12)
- Sprawdź konsolę pod kątem błędów AdSense
- Sprawdź czy reklamy się ładują

### 6.2 Sprawdź w AdSense:
- Przejdź do "Ads" → "By ad unit"
- Sprawdź czy widzisz "impressions" i "clicks"

## 🐛 **Rozwiązywanie problemów**

### Reklamy się nie wyświetlają:
1. Sprawdź czy `REACT_APP_ADS_ENABLED=true`
2. Sprawdź czy Publisher ID jest poprawny
3. Sprawdź czy slot ID są poprawne
4. Poczekaj 24-48h na aktywację w AdSense

### Błędy w konsoli:
- `AdSense not ready` - poczekaj na załadowanie
- `Invalid ad slot` - sprawdź slot ID
- `Ad blocked` - sprawdź ustawienia przeglądarki

## 📞 **Wsparcie**

Jeśli masz problemy:
1. Sprawdź dokumentację AdSense
2. Sprawdź czy strona jest zatwierdzona w AdSense
3. Poczekaj na pełną aktywację (może potrwać kilka dni) 