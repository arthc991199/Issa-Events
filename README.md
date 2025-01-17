# ISSA Events Terminal

Nowoczesna aplikacja PWA do przeglądania wydarzeń ISSA Polska w stylu hakerskim, stworzona przy użyciu React i Tailwind CSS.

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

Jeśli nie masz zainstalowanego npm: 
```bash
sudo apt install nodejs npm
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


Instrukcja uruchomienia projektu lokalnie
Wymagania wstępne

Zainstaluj Node.js:

Wejdź na stronę https://nodejs.org/
Pobierz i zainstaluj wersję LTS (18 lub nowszą)
Sprawdź instalację w terminalu:
bashCopynode --version
npm --version



Zainstaluj Git:

Wejdź na stronę https://git-scm.com/
Pobierz i zainstaluj Git
Sprawdź instalację:
bashCopygit --version




Krok po kroku

Otwórz terminal (PowerShell lub Command Prompt w Windows)
Przejdź do katalogu, gdzie chcesz umieścić projekt:
bashCopycd C:\Users\TwojaNazwaUzytkownika\Desktop

Sklonuj repozytorium:
bashCopygit clone [URL_repozytorium]
cd issa-events

Zainstaluj zależności:
bashCopynpm install

Uruchom projekt:
bashCopynpm run dev

Otwórz przeglądarkę i przejdź pod adres:
Copyhttp://localhost:5173


Rozwiązywanie problemów

Jeśli występują błędy z modułami:
bashCopynpm clean-install

Jeśli projekt nie uruchamia się:
bashCopy# Usuń node_modules
Remove-Item -Recurse -Force node_modules
# Usuń package-lock.json
Remove-Item package-lock.json
# Zainstaluj ponownie
npm install

Jeśli nie działają style:
bashCopy# Zainstaluj ponownie Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

Sprawdź, czy wszystkie pliki są na miejscu:
Copyissa-events/
├── src/
│   ├── components/
│   │   └── HackerInterface.jsx
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
