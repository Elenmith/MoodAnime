# 🛒 Amazon Associates - Konfiguracja i wdrożenie

## 🎯 **Przegląd**

System Amazon Associates został zaimplementowany jako alternatywa dla Google AdSense. Pozwala na zarabianie prowizji od sprzedaży produktów anime na Amazon.

## 📋 **Krok 1: Rejestracja Amazon Associates**

### **1.1 Wybierz kraj:**
- **Polska:** https://affiliate-program.amazon.pl/
- **USA:** https://affiliate-program.amazon.com/
- **UK:** https://affiliate-program.amazon.co.uk/

### **1.2 Proces rejestracji:**
1. **Zaloguj się** swoim kontem Amazon
2. **Wypełnij formularz:**
   - Website URL: `https://mood4anime.com`
   - Website description: "Anime recommendation website based on mood"
   - Primary category: "Entertainment" lub "Books"
   - Content language: "English"
3. **Akceptuj warunki** i kliknij "Submit"

### **1.3 Po rejestracji otrzymasz:**
- **Tracking ID** (format: `mood4ani-20` lub podobny)
- **Dostęp do Amazon Product Advertising API**
- **Linki partnerskie** do produktów

## ⚙️ **Krok 2: Konfiguracja**

### **2.1 Edytuj plik .env:**

```bash
# API Configuration
REACT_APP_API_URL=https://mood-for-anime-443a0efbedff.herokuapp.com

# Ad Configuration
REACT_APP_ADS_ENABLED=true
REACT_APP_AD_TYPE=amazon

# Amazon Associates Configuration
REACT_APP_AMAZON_TRACKING_ID=mood4ani-20  # Twój Tracking ID
REACT_APP_AMAZON_COUNTRY=US                # Kraj Amazon

# Environment
REACT_APP_ENVIRONMENT=production
```

### **2.2 Znajdź swój Tracking ID:**
1. **Zaloguj się do Amazon Associates**
2. **Przejdź do "Account" → "Account Settings"**
3. **Skopiuj "Tracking ID"**

## 🎨 **Krok 3: Kategorie produktów**

System automatycznie wyświetla różne kategorie produktów:

### **A. Anime (anime):**
- Manga, książki o anime
- DVD/Blu-ray anime
- Streaming anime

### **B. Figurki (figures):**
- Figurki anime
- Kolekcjonerskie przedmioty
- Modele do składania

### **C. Merchandise (merchandise):**
- Koszulki anime
- Akcesoria
- Gadżety

## 🚀 **Krok 4: Wdrożenie**

### **4.1 Test lokalny:**
```bash
npm start
```

### **4.2 Wdrożenie na Netlify:**
1. **Zbuduj aplikację:**
   ```bash
   npm run build
   ```

2. **Wdróż na Netlify:**
   - Przeciągnij folder `build` na Netlify
   - Lub połącz z repozytorium Git

3. **Dodaj zmienne środowiskowe w Netlify:**
   - `REACT_APP_ADS_ENABLED=true`
   - `REACT_APP_AD_TYPE=amazon`
   - `REACT_APP_AMAZON_TRACKING_ID=mood4ani-20`
   - `REACT_APP_AMAZON_COUNTRY=US`

## 📊 **Krok 5: Monitoring i zarobki**

### **5.1 Sprawdź w Amazon Associates:**
- **Reports** → "Earnings"
- **Reports** → "Link Performance"
- **Reports** → "Orders"

### **5.2 Prowizje:**
- **Książki:** 4-8%
- **Elektronika:** 1-4%
- **Zabawki:** 4-8%
- **Odzież:** 4-10%

## 🔧 **Krok 6: Optymalizacja**

### **6.1 Lepsze produkty:**
- Dodaj więcej kategorii
- Personalizuj produkty według nastroju
- Dodaj recenzje produktów

### **6.2 Więcej zarobków:**
- Dodaj linki w opisach anime
- Stwórz stronę z rekomendacjami produktów
- Dodaj newsletter z ofertami

## 🐛 **Rozwiązywanie problemów**

### **Reklamy się nie wyświetlają:**
1. Sprawdź `REACT_APP_ADS_ENABLED=true`
2. Sprawdź Tracking ID
3. Sprawdź czy konto jest aktywne

### **Brak zarobków:**
1. Sprawdź czy linki mają Tracking ID
2. Poczekaj 24-48h na aktualizację
3. Sprawdź czy produkty są w odpowiedniej kategorii

## 📈 **Przewidywane zarobki**

Przy 1000 odwiedzin dziennie:
- **Kliknięcia:** 50-100 dziennie
- **Konwersja:** 2-5%
- **Zarobki:** $50-200 miesięcznie

## 🔄 **Aktualizacje**

System jest zaprojektowany do łatwego rozszerzania:

1. **Dodaj nowe kategorie** w `AmazonBanner.js`
2. **Zmień produkty** w `mockProducts`
3. **Dostosuj style** w `AmazonBanner.css`

## 📞 **Wsparcie**

Jeśli masz problemy:
1. Sprawdź dokumentację Amazon Associates
2. Sprawdź czy konto jest zatwierdzone
3. Skontaktuj się z supportem Amazon 