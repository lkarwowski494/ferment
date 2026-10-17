# **SEROWAR — Standard Projektowy UX i 8 Wzorców Interakcji (docs/32)**

> **Ekosystem:** Apps4Brew / Apps4Craft Studio  
> **Projekt:** SEROWAR (Rzemieślnicze Przetwórstwo Mleka / Artisan Cheese & Dairy Craft)  
> **Norma nadrzędna:** Standard wzorców interakcji rzemieślniczych `docs/32`  
> **Data opracowania:** 17.10.2026

---

## **1. Słownik 8 Kluczowych Pojęć Interakcji w Rzemiośle Mleczarskim**

W całej aplikacji SEROWAR (we wszystkich 35 językach i na każdym ekranie) obowiązuje ścisły, ujednolicony słownik 8 pojęć interakcji. Zakaz stosowania synonimów wprowadzających chaos poznawczy u użytkownika.

| # | Pojęcie interakcji | Nazwa angielska | Precyzyjna definicja i zastosowanie w SEROWAR |
|---|---|---|---|
| **1** | **Karta Podsumowująca** | *Summary Card* | Statyczna lub klikalna karta prezentująca kluczowe parametry obiektu (np. karta krążka sera w dojrzewalni z wiekiem i wagą, karta partii twarogu, karta surowca w spiżarni). Zawiera status, identyfikator partii oraz wyrazisty wskaźnik postępu/jakości. |
| **2** | **Formularz Edycji** | *Edit Form* | Pełnoekranowy widok modalny służący do wprowadzania lub modyfikacji danych (np. dodanie nowej partii mleka, edycja parametrów dojrzewania, konfiguracja prasy). Działa na stanie lokalnego szkicu (draft state). |
| **3** | **Arkusz Opcji** | *Option Sheet* | Dolny wysuwany arkusz (Bottom Sheet) prezentujący wybór spośród 2 do 6 opcji (np. wybór gatunku mleka: krowie, kozie, owcze, bawole; wybór typu obróbki skórki; wybór kultury mezofilnej/termofilnej). |
| **4** | **Pasek Zadań** | *Task Bar* | Pasek w dolnej strefie ekranu (Thumb Zone) zawierający główne przyciski akcji operacyjnej podczas trwania procesu (np. „Start Flokulacji”, „Obrócono Krążek”, „Zakończ Prasowanie”). |
| **5** | **Widok Przeglądowy** | *Overview View* | Ekrany listowe i analityczne dające pełny wgląd w archiwum (tabela partii w Cave Log, stan spiżarni, spis lekcji w Szkole Serowarstwa, historia pomiarów mikroklimatu). |
| **6** | **Widok Skupiony** | *Focused View* | Tryb jednokrokowej egzekucji rzemieślniczej („Hands in whey”). Wyświetla wyłącznie bieżący krok (np. odliczanie czasu dogrzewania skrzepu, stoper miseczki flokulacyjnej, faza płukania masła wodą lodową) z gigantycznym przyciskiem zatwierdzenia. |
| **7** | **Pole Wyszukiwania** | *Search Field* | Standaryzowane pole wyszukiwania z ikoną lupy, przyciskiem natychmiastowego czyszczenia tekstu (`clearButtonMode="while-editing"`), automatycznym przycinaniem spacji i precyzyjnym placeholderem (np. „Szukaj w przepisach…”, „Szukaj partii w jaskini…”). |
| **8** | **Przełącznik Trybu** | *Mode Switcher* | Segmentowy przełącznik (Segmented Control) na górze ekranu umożliwiający przełączanie podkategorii (np. w Zakładce Serowar: `Kalkulator Mleka` | `Flokulacja` | `Prasa` | `Solanka`; w Zakładce Nabiał: `Twarogi` | `Masielnictwo & Ghee` | `Napoje Fermentowane` | `Obieg Serwatki`). |

---

## **2. Żelazne Wzorce Dialogów, Formularzy i Przycisków**

### **2.1 Formularze Modalne (Wzorzec Zapis / Anuluj)**
* **Przycisk rezygnacji:** ZAWSZE w lewym górnym rogu nagłówka (`headerLeft`). Etykieta dosłownie: **„Anuluj”** (wersja angielska: **„Cancel”**).  
  *Kategoryczny zakaz:* stosowania etykiet „Zamknij”, „Wróć” ani samej ikony „X” do rezygnacji z formularza edycji!
* **Przycisk zatwierdzenia:** ZAWSZE w prawym górnym rogu nagłówka (`headerRight`). Etykieta precyzyjna:
  * **„Dodaj”** (*„Add”*) — przy tworzeniu nowego obiektu (nowa partia, nowy surowiec w spiżarni).
  * **„Zapisz”** (*„Save”*) — przy edycji istniejącego obiektu.
* **Zabezpieczenie przed przypadkową utratą zmian (Dirty State Guard):**  
  Jeśli użytkownik zmodyfikował którekolwiek pole formularza i dotknął przycisku „Anuluj”, aplikacja natychmiast wyświetla alert potwierdzający:  
  *Tytuł:* **„Odrzucić zmiany?”**  
  *Opcje:* `[Wróć do edycji, Odrzuć zmiany (destructive)]`.

### **2.2 Ekrany List i Przycisk „+”**
* Na każdym ekranie listy przycisk dodawania nowego elementu to stały symbol „+” w prawym górnym rogu nagłówka (`headerRight`).
* **Etykieta dostępności (VoiceOver):** Przycisk „+” posiada bezwzględnie semantyczną etykietę:  
  `accessibilityLabel="Dodaj {obiekt}"` (np. *„Dodaj partię sera”*, *„Dodaj surowiec do spiżarni”*, *„Dodaj odczyt mikroklimatu”*), a nie bezużyteczne „Dodaj” lub „Plus”.

### **2.3 Edycja na Szkicu vs Zapis Natychmiastowy**
* **Edycja złożona (formularz, profil sera, wsad mleczny):** Praca wyłącznie na stanie lokalnego szkicu (`draft state`). Zmiany trafiają do relacyjnej bazy SQLite dopiero po dotknięciu „Zapisz” / „Dodaj”.
* **Interakcje proste (przełączniki, liczniki, odznaczenia):** Zmiana wartości licznika (+1 obrót krążka), zmiana filtru lub odznaczenie przemycia solanką maziową zapisują się natychmiast w lokalnej bazie SQLite w transakcji WAL z wpisem w kolejce `pending_ops`.

### **2.4 Usuwanie i Operacje Destrukcyjne**
* **Usuwanie rutynowe:** Usunięcie pojedynczego wpisu przenosi obiekt do archiwum/kosza z natychmiastowym wyświetleniem dolnego paska Snackbar z przyciskiem **„Cofnij”** (`Undo`).
* **Operacje destrukcyjne nieodwracalne:** Usunięcie całej partii sera z Cave Log, reset bazy danych lub usunięcie historii leżakowania wymaga jawnego monitu potwierdzającego:  
  *Tytuł:* **„Usunąć partię sera {nazwa}?”**  
  *Komunikat:* *„Ta operacja jest nieodwracalna. Utracisz wszystkie zanotowane pomiary i historię affinage.”*  
  *Opcje:* `[Anuluj, Usuń trwale (destructive)]`.

### **2.5 Komunikaty Błędów i Puste Stany**
* **Brak blokujących wyskakujących okienek sukcesu:** Pomyślny zapis objawia się zamknięciem arkusza i natychmiastowym pojawieniem się wpisu na liście.
* **Precyzja komunikatów błędów:** Zakaz ogólnikowych alertów typu „Błąd”. Komunikat musi precyzować naturę problemu: *„Nieprawidłowa objętość mleka — wpisz wartość od 1.0 do 200.0 litrów”*, *„Temperatura przekracza bezpieczną granicę — zdejmij garnek z ognia”*.
* **Puste stany (Empty States):** Gdy lista jest pusta, prezentowana jest estetyczna ilustracja tematyczna, zrozumiałe wyjaśnienie i wyrazisty przycisk CTA (np. *„Brak dojrzewających krążków w jaskini serowej”* + przycisk *„+ Dodaj pierwszy ser”*).

---

## **3. System Wzorniczy i Typografia (Apps4Craft Design System)**

### **3.1 Archetyp Typograficzny A: Precyzja Techniczna Rzemiosła**
Dla aplikacji SEROWAR stosujemy rygorystyczny archetyp typograficzny studia Apps4Craft:

| Rola w UI | Krój pisma | Charakterystyka i uzasadnienie |
|---|---|---|
| **Nagłówki i Duże Liczniki** | **Tektur** | Geometryczny, techniczny krój o mocnej tożsamości inżynieryjnej; nadaje serowarstwu sznyt profesjonalnej kontroli. |
| **Tekst Podstawowy i Etykiety** | **IBM Plex Sans** | Neutralny, wybitnie czytelny krój interfejsowy z doskonałym kerningiem w małych rozmiarach. |
| **Dane, Czasy, Wagi, IMCU, pH** | **IBM Plex Mono** | Stała szerokość znaków (tabular numbers) eliminuje drganie interfejsu przy odliczaniu sekund na stoperze i titracji mililitrów. |

### **3.2 Paleta Barw „Linen & Whey” (Kontrast WCAG AAA)**
Kolorystyka aplikacji czerpie bezpośrednio z naturalnych odcieni wiejskiego przetwórstwa mleka:

| Nazwa tokenu | Wartość Hex (Light) | Wartość Hex (Dark) | Zastosowanie semantyczne | Kontrast do tła |
|---|---|---|---|---|
| `bg-primary` | `#FDFBF7` (Linen White) | `#14120E` (Deep Cellar) | Główne tło aplikacji | — |
| `surface-card` | `#FFFFFF` (Pure Milk) | `#1F1B16` (Oak Shelf) | Karty podsumowujące, arkusze modalne | $\ge 12:1$ |
| `text-primary` | `#292524` (Charcoal) | `#F5F5F4` (Warm Cream) | Tytuły, główne odczyty liczbowe | $\ge 11.5:1$ (WCAG AAA) |
| `text-secondary`| `#57534E` (Stone) | `#D6D3D1` (Soft Whey) | Etykiety, podtytuły, jednostki miar | $\ge 7.2:1$ (WCAG AAA) |
| `accent-whey` | `#B45309` (Warm Amber) | `#F59E0B` (Golden Curd) | Główne przyciski akcji, stoper flokulacji | $\ge 4.5:1$ |
| `status-success`| `#15803D` (Pasture Green)| `#22C55E` (Fresh Clover) | Zakończenie etapu, bezpieczne pH | $\ge 4.5:1$ |
| `status-warning`| `#B45309` (Raw Honey) | `#FBBF24` (Affinage Crust)| Alerty obracania, uwaga na temperaturę | $\ge 4.5:1$ |
| `status-danger` | `#B91C1C` (Warning Red) | `#EF4444` (Pathogen Alert)| Odrzucenie mleka UHT, wzdęcie wczesne | $\ge 4.5:1$ |

### **3.3 Ergonomia Pracy w Kuchni („Hands in Whey”)**
* **Strefa Kciuka (Thumb Zone):** Wszystkie kluczowe kontrolki operacyjne umieszczone w dolnych 40% ekranu.
* **Minimalne Pole Dotykowe:** Każdy element klikalny posiada wymiar minimum **48 × 48 pt** (z powiększonym polem `hitSlop` min. 10 pt na stronę) — serowar operujący dłońmi w rękawicach lub wilgotnymi palcami nie może chybić przycisku.

---

## **4. Macierz 9 Stanów UI (Matrix of 9 States)**

Dla każdego widoku głównego SEROWAR architektura UI definiuje 9 stanów:

```mermaid
stateDiagram-v2
    [*] --> ZeroData: Pierwsze uruchomienie
    ZeroData --> Loading: Dodanie pierwszej partii
    Loading --> Default: Pomyślny zapis
    Default --> PartialData: Częściowy formularz
    PartialData --> Default: Uzupełnienie
    Default --> BackgroundWork: Start timera / Live Activity
    BackgroundWork --> Default: Zakończenie procesu
    Default --> SecurityWarning: Przekroczenie limitu / pH
    SecurityWarning --> Default: Interwencja / Dokwaszenie
    Default --> EmptySearch: Wyszukiwanie bez dopasowań
    EmptySearch --> Default: Wyczyszczenie filtra
    Default --> NoPermissions: Brak BLE / Powiadomień
    NoPermissions --> Default: Nadanie uprawnień
    Default --> ErrorRecovery: Błąd / Awaria bazy
    ErrorRecovery --> Default: Przywrócenie z backupu JSON
```

1. **Stan Domyślny (Golden Path):** Pełne dane partii, aktywny postęp leżakowania, czytelne wykresy i wskaźniki.
2. **Stan Pierwszego Użycia (Zero Data / Onboarding):** Przyjazny widok pusty z wyjaśnieniem rzemieślniczym i wyrazistym przyciskiem „+ Dodaj pierwszy nastaw”.
3. **Stan Ładowania (Skeleton Layout):** Subtelne, pulsujące szare szkielety odwzorowujące układ kart (brak blokujących spinnerów).
4. **Stan Błędu / Awarii (Error Recovery):** Zrozumiałe wyjaśnienie w języku rzemiosła (zero kodów błędu SQL) + przycisk ratunkowy „Przywróć z kopii zapasowej”.
5. **Stan Częściowy (Partial Data):** Użytkownik podał tylko litry mleka, bez pomiaru kwasowości — aplikacja podpowiada domyślne parametry fizjologiczne.
6. **Stan Braku Wyników Wyszukiwania:** Pusty widok z komunikatem: *„Brak partii sera dla frazy »Gouda«. Wyczyść filtry.”*
7. **Stan Braku Uprawnień:** Rzeczowe wyjaśnienie, dlaczego uprawnienie jest potrzebne (np. *„Powiadomienia lokalne są niezbędne, by przypomnieć Ci o wyjęciu sera z solanki o 23:45”*) z przyciskiem przekierowującym do Ustawień iOS.
8. **Stan Przekroczenia Limitów / Ostrzeżeń Sanitarnych:** Zmiana kolorystyki na bursztyn/czerwień, wyraźna ikona ostrzegawcza i instrukcja naprawcza (np. *„Temperatura skrzepu 45.5°C — zdejmij z ognia, by uniknąć stwardnienia twarogu!”*).
9. **Stan Aktywnej Pracy w Tle (Background Process / Live Activity):** Pulsujący wskaźnik timera flokulacji, podgląd w Dynamic Island oraz interaktywny widżet na Apple Watch.
