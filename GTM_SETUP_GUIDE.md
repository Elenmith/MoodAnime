# Google Tag Manager Setup Guide - Mood4Anime

## 🎯 **Krok 1: Google Analytics 4**

### 1. Utwórz GA4 Property:
- **Link:** https://analytics.google.com/
- **Kliknij:** "Create Property"
- **Nazwa:** "Mood4Anime"
- **Skopiuj Measurement ID:** `G-XXXXXXXXXX`

### 2. Dodaj do GTM:
- **GTM Link:** https://tagmanager.google.com/
- **Tags → New → Google Analytics: GA4 Configuration**
- **Measurement ID:** Twój GA4 ID
- **Trigger:** All Pages

## 🎯 **Krok 2: Affiliate Click Tracking**

### 1. Utwórz Custom Event Tag:
- **Nazwa:** "Affiliate Click Tracking"
- **Tag Type:** "Google Analytics: GA4 Event"
- **Event Name:** `affiliate_click`
- **Parameters:**
  - `platform` → `{{Event - platform}}`
  - `anime_title` → `{{Event - anime_title}}`
  - `link_type` → `{{Event - link_type}}`

### 2. Utwórz Trigger:
- **Trigger Type:** "Custom Event"
- **Event Name:** `affiliate_click`

## 🎯 **Krok 3: Testowanie**

### 1. Preview Mode:
- **Kliknij "Preview"** w GTM
- **Otwórz:** mood4anime.com
- **Sprawdź:** Czy tagi się ładują

### 2. Test Affiliate:
- **Przejdź do:** `/test-affiliate`
- **Kliknij anime**
- **Sprawdź:** GTM Preview

## 📊 **Monitoring**

### Co będziesz widzieć:
- **Kliknięcia affiliate** w Google Analytics
- **Konwersje** w Amazon Associates
- **User behavior** w GA4
- **Performance** w GTM

## 🔗 **Przydatne Linki**

- **GTM:** https://tagmanager.google.com/
- **GA4:** https://analytics.google.com/
- **Amazon Associates:** https://affiliate-program.amazon.com/
- **Test Page:** mood4anime.com/test-affiliate
