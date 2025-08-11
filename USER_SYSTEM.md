# 👤 System Użytkowników - Dokumentacja

## 🎯 Przegląd

System użytkowników został zaimplementowany w Mood4Anime, umożliwiając użytkownikom rejestrację, logowanie i zarządzanie swoimi profilami oraz listami anime.

## 🏗️ Architektura

### Backend (Node.js/Express)
- **Model User** - Schemat MongoDB z metodami pomocniczymi
- **Middleware Auth** - Autoryzacja JWT i middleware bezpieczeństwa
- **Routes Users** - API endpoints dla operacji użytkowników

### Frontend (React)
- **UserContext** - Globalny stan użytkownika z React Context
- **Komponenty Auth** - Logowanie i rejestracja
- **UserProfile** - Profil użytkownika z edycją
- **Header Integration** - Menu użytkownika w nagłówku

## 🔐 Bezpieczeństwo

### Autoryzacja JWT
```javascript
// Token generowany przy logowaniu/rejestracji
const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

// Middleware sprawdzający token
const authenticateToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  const decoded = jwt.verify(token, JWT_SECRET);
  req.user = await User.findById(decoded.userId);
  next();
};
```

### Hashowanie haseł
```javascript
// Automatyczne hashowanie przy zapisie
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});
```

## 📊 Model Użytkownika

### Podstawowe pola
```javascript
{
  username: String,        // Unikalna nazwa użytkownika
  email: String,          // Unikalny email
  password: String,       // Zahashowane hasło
  avatar: String,         // URL avataru
  bio: String,           // Opis użytkownika
  isAdmin: Boolean,      // Uprawnienia administratora
  isVerified: Boolean,   // Weryfikacja email
  lastLogin: Date        // Ostatnie logowanie
}
```

### Preferencje użytkownika
```javascript
preferences: {
  favoriteGenres: [String],    // Ulubione gatunki
  favoriteMoods: [String],     // Ulubione nastroje
  notifications: {
    email: Boolean,            // Powiadomienia email
    push: Boolean,             // Push notifications
    newAnime: Boolean,         // Nowe anime
    recommendations: Boolean   // Rekomendacje
  }
}
```

### Lista anime użytkownika
```javascript
watchlist: [{
  animeId: ObjectId,           // Referencja do anime
  status: String,              // plan_to_watch, watching, completed, dropped
  rating: Number,              // Ocena 1-10
  review: String,              // Recenzja
  addedAt: Date,               // Data dodania
  completedAt: Date            // Data ukończenia
}]
```

## 🚀 API Endpoints

### Publiczne endpoints
```javascript
POST /api/users/register    // Rejestracja użytkownika
POST /api/users/login       // Logowanie użytkownika
```

### Chronione endpoints (wymagają tokenu)
```javascript
GET    /api/users/profile           // Pobierz profil
PUT    /api/users/profile           // Aktualizuj profil
GET    /api/users/watchlist         // Pobierz listę anime
POST   /api/users/watchlist         // Dodaj anime do listy
DELETE /api/users/watchlist/:id     // Usuń anime z listy
POST   /api/users/rate              // Oceń anime
GET    /api/users/recommendations   // Personalizowane rekomendacje
```

## 🎨 Komponenty Frontend

### UserContext
```javascript
const { 
  user,                    // Dane użytkownika
  isAuthenticated,         // Czy zalogowany
  loading,                 // Stan ładowania
  register,                // Funkcja rejestracji
  login,                   // Funkcja logowania
  logout,                  // Funkcja wylogowania
  updateProfile,           // Aktualizacja profilu
  addToWatchlist,          // Dodaj do listy
  removeFromWatchlist,     // Usuń z listy
  rateAnime,               // Oceń anime
  getRecommendations       // Pobierz rekomendacje
} = useUser();
```

### Komponenty Auth
- **Login.js** - Formularz logowania
- **Register.js** - Formularz rejestracji
- **Auth.js** - Kontener przełączający między logowaniem/rejestracją

### UserProfile
- Wyświetlanie danych użytkownika
- Edycja profilu (username, bio, avatar)
- Statystyki oglądania
- Preferencje użytkownika

## 🔧 Konfiguracja

### Zmienne środowiskowe
```bash
# Backend (.env)
JWT_SECRET=your-super-secret-jwt-key
MONGODB_URI=mongodb://localhost:27017/mood4anime

# Frontend (.env)
REACT_APP_API_URL=http://localhost:5000
```

### Walidacja danych
```javascript
// Rejestracja
username: 3-30 znaków, tylko litery/cyfry/_
email: Poprawny format email
password: Min. 6 znaków, wielkie/male litery + cyfra

// Profil
bio: Max 500 znaków
avatar: Poprawny URL
```

## 📱 Funkcjonalności

### Rejestracja i logowanie
- ✅ Rejestracja z walidacją
- ✅ Logowanie z JWT
- ✅ Automatyczne wylogowanie po wygaśnięciu tokenu
- ✅ Obsługa błędów i komunikatów

### Profil użytkownika
- ✅ Wyświetlanie danych użytkownika
- ✅ Edycja profilu (username, bio, avatar)
- ✅ Statystyki oglądania
- ✅ Preferencje i ulubione

### Lista anime
- ✅ Dodawanie anime do listy
- ✅ Zmiana statusu (plan to watch, watching, completed, dropped)
- ✅ Oceny i recenzje
- ✅ Usuwanie z listy

### Rekomendacje
- ✅ Personalizowane rekomendacje na podstawie preferencji
- ✅ Wykluczanie już obejrzanych anime
- ✅ Sortowanie według ocen

## 🎯 Użycie

### Rejestracja użytkownika
```javascript
const result = await register({
  username: 'anime_lover',
  email: 'user@example.com',
  password: 'SecurePass123'
});

if (result.success) {
  // Użytkownik zalogowany automatycznie
  navigate('/profile');
}
```

### Dodanie anime do listy
```javascript
const result = await addToWatchlist(animeId, 'plan_to_watch');
if (result.success) {
  // Anime dodane do listy
}
```

### Pobranie rekomendacji
```javascript
const result = await getRecommendations(10);
if (result.success) {
  const recommendations = result.data.recommendations;
  // Wyświetl rekomendacje
}
```

## 🔄 Przyszłe rozszerzenia

### Planowane funkcje
- [ ] Weryfikacja email
- [ ] Resetowanie hasła
- [ ] Social login (Google, Facebook)
- [ ] System znajomych
- [ ] Komentarze i recenzje
- [ ] System osiągnięć
- [ ] Powiadomienia push
- [ ] Eksport listy anime

### Optymalizacje
- [ ] Cache'owanie danych użytkownika
- [ ] Lazy loading listy anime
- [ ] Paginacja dla dużych list
- [ ] Offline support
- [ ] Progressive Web App features

## 🐛 Rozwiązywanie problemów

### Częste problemy
1. **Token wygasł** - Automatyczne przekierowanie do logowania
2. **Błąd walidacji** - Sprawdź format danych w formularzu
3. **Błąd sieci** - Sprawdź połączenie z API
4. **Duplikat username/email** - Użyj innej nazwy/email

### Debugowanie
```javascript
// Sprawdź stan użytkownika
console.log(user, isAuthenticated, loading);

// Sprawdź token
console.log(localStorage.getItem('token'));

// Sprawdź błędy API
console.log(error);
```

## 📈 Metryki

### Śledzone dane
- Liczba zarejestrowanych użytkowników
- Aktywność użytkowników (logowania)
- Popularne anime w listach
- Średnie oceny
- Preferowane gatunki/nastroje

### Analityka
- Najpopularniejsze anime według statusu
- Trendy w ocenach
- Wzorce oglądania
- Skuteczność rekomendacji
