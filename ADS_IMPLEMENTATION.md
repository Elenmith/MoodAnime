# System Reklam - Dokumentacja Implementacji

## 🎯 Przegląd

System reklam został zaimplementowany w sposób modułowy i bezpieczny, nie wpływając na istniejącą funkcjonalność aplikacji.

## 📁 Struktura plików

```
src/
├── components/
│   └── Ads/
│       ├── AdBanner.js          # Główny komponent reklamy
│       ├── AdBanner.css         # Style dla reklam
│       ├── AdPlaceholder.js     # Wrapper do łatwego dodawania reklam
│       ├── CookieConsent.js     # Komponent zgody na cookies
│       └── CookieConsent.css    # Style dla cookie consent
├── context/
│   └── AdContext.js             # Kontekst React do zarządzania reklamami
└── App.js                       # Główna aplikacja (zintegrowana)
```

## 🔧 Konfiguracja

### Zmienne środowiskowe

Skopiuj `env.example` do `.env` i skonfiguruj:

```bash
# Włącz/wyłącz reklamy
REACT_APP_ADS_ENABLED=true

# ID klienta AdSense
REACT_APP_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX

# Sloty reklamowe
REACT_APP_ADSENSE_HEADER_SLOT=XXXXXXXXXX
REACT_APP_ADSENSE_SIDEBAR_SLOT=XXXXXXXXXX
REACT_APP_ADSENSE_CONTENT_SLOT=XXXXXXXXXX
REACT_APP_ADSENSE_FOOTER_SLOT=XXXXXXXXXX
REACT_APP_ADSENSE_INLINE_SLOT=XXXXXXXXXX
```

## 🚀 Użycie

### 1. Podstawowe użycie

```jsx
import AdPlaceholder from './components/Ads/AdPlaceholder';

// W komponencie
<AdPlaceholder position="header" />
<AdPlaceholder position="sidebar" />
<AdPlaceholder position="content" />
```

### 2. Zaawansowane użycie

```jsx
import { useAds } from './context/AdContext';

const MyComponent = () => {
  const { shouldShowAd, trackAdShown } = useAds();
  
  // Sprawdź czy powinna być wyświetlona reklama
  if (shouldShowAd('inline')) {
    trackAdShown('inline');
    // Wyświetl reklamę
  }
};
```

## 📍 Pozycje reklam

- `header` - Banner górny (728x90)
- `sidebar` - Sidebar (300x250)
- `content` - W treści (728x90)
- `footer` - Footer (728x90)
- `inline` - W linii z treścią (728x90)

## 🔒 Bezpieczeństwo i GDPR

- System automatycznie sprawdza zgodę użytkownika
- Reklamy są wyłączone domyślnie
- Zgoda jest przechowywana w localStorage
- Cookie consent banner jest wyświetlany automatycznie

## 🎛️ Kontrola reklam

### Wyłączenie reklam dla użytkownika

```jsx
const { setUserConsent } = useAds();
setUserConsent(false); // Wyłącz reklamy
```

### Sprawdzenie statusu

```jsx
const { adState } = useAds();
console.log(adState.enabled); // Czy reklamy są włączone
console.log(adState.userConsent); // Czy użytkownik wyraził zgodę
```

## 📊 Monitoring

System automatycznie śledzi:
- Liczbę wyświetlonych reklam na stronie
- Pozycje reklam
- Zgodę użytkownika
- Błędy ładowania reklam

## 🐛 Rozwiązywanie problemów

### Reklamy się nie wyświetlają

1. Sprawdź `REACT_APP_ADS_ENABLED=true`
2. Sprawdź czy użytkownik wyraził zgodę
3. Sprawdź konfigurację AdSense
4. Sprawdź konsolę przeglądarki pod kątem błędów

### Błędy AdSense

```javascript
// W konsoli przeglądarki
console.log(window.adsbygoogle); // Powinno być zdefiniowane
```

## 🔄 Aktualizacje

System jest zaprojektowany do łatwego rozszerzania:

1. Dodaj nową pozycję w `AD_CONFIG.positions`
2. Dodaj odpowiednią zmienną środowiskową
3. Użyj `AdPlaceholder` z nową pozycją

## 📈 Optymalizacja

- Reklamy są ładowane asynchronicznie
- System sprawdza częstotliwość wyświetlania
- Responsywny design dla urządzeń mobilnych
- Lazy loading dla lepszej wydajności 