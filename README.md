# ISSA Events Terminal

Nowoczesna aplikacja PWA do przeglądania wydarzeń ISSA Polska w stylu hakerskim, stworzona przy użyciu React i Tailwind CSS.

![ISSA Events Terminal Preview](./preview.png)

## 🚀 Funkcjonalności

- 🌍 Przeglądanie wydarzeń ISSA dla różnych miast w Polsce
- 📱 Responsywny interfejs w stylu terminalowym
- 💻 Wsparcie dla PWA (Progressive Web App)
- 📊 Integracja z RSS dla aktualnych wydarzeń
- ⏰ Licznik dni do wydarzenia
- 📝 Wyświetlanie agendy i lokalizacji
- 🔄 Automatyczne odświeżanie danych
- 📍 Zapamiętywanie wybranego miasta

## 🛠️ Technologie

- React 18
- Vite
- Tailwind CSS
- Lucide Icons
- PWA

## 📋 Wymagania

- Node.js (v18+)
- npm (v7+)
- Git

## 💻 Instalacja lokalna

1. Sklonuj repozytorium:
```bash
git clone https://github.com/twoja-nazwa/issa-events.git
cd issa-events
```

2. Zainstaluj zależności:
```bash
npm install
```

3. Uruchom aplikację w trybie deweloperskim:
```bash
npm run dev
```

4. Otwórz w przeglądarce:
```
http://localhost:5173
```

## 🚀 Budowanie projektu

1. Zbuduj wersję produkcyjną:
```bash
npm run build
```

2. Przetestuj lokalnie wersję produkcyjną:
```bash
npm run preview
```

## 📱 Instalacja PWA

### Android (Chrome)
1. Otwórz stronę w Chrome
2. Kliknij menu (⋮)
3. Wybierz "Dodaj do ekranu głównego"
4. Potwierdź instalację

### iOS (Safari)
1. Otwórz stronę w Safari
2. Kliknij przycisk "Udostępnij"
3. Wybierz "Dodaj do ekranu początkowego"
4. Potwierdź instalację

## 📂 Struktura projektu

```
issa-events/
├── public/            # Statyczne assety
│   ├── icons/        # Ikony PWA
│   └── manifest.json # Konfiguracja PWA
├── src/
│   ├── components/   # Komponenty React
│   ├── styles/       # Style CSS
│   ├── App.jsx      # Główny komponent
│   └── main.jsx     # Punkt wejścia
└── ...
```

## 🔄 RSS Feeds

Aplikacja pobiera dane z następujących źródeł RSS:
- Poznań: https://local.issa.org.pl/spotkania/category/poznan/feed
- Szczecin: https://local.issa.org.pl/spotkania/category/szczecin/feed
- Rzeszów: https://local.issa.org.pl/spotkania/category/rzeszow/feed
[...]

## 🛠️ Rozwój

1. Fork repozytorium
2. Stwórz branch z funkcjonalnością: `git checkout -b feature/nazwa`
3. Commituj zmiany: `git commit -m 'Dodano funkcjonalność'`
4. Push do brancha: `git push origin feature/nazwa`
5. Stwórz Pull Request

## 📝 TODO

- [ ] Dodanie powiadomień push
- [ ] Dodanie trybu offline
- [ ] Rozszerzenie widoku agendy
- [ ] Integracja z kalendarzem
- [ ] Dodanie filtrowania wydarzeń
