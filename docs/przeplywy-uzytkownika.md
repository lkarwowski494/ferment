# **SEROWAR — Inwentaryzacja Przepływów Użytkownika As-Is (docs/przeplywy-uzytkownika.md)**

> **Ekosystem:** Apps4Brew Studio | **Projekt:** SEROWAR (Rzemieślnicze Przetwórstwo Mleka)  
> **Rola:** BPR & UX Refactor (`coding/bpr-ux`)  
> **Data inwentaryzacji:** 17.10.2026  
> **Stan bazy:** Przed refaktorem To-Be (Kod As-Is w gałęzi `main`)

---

## **1. Przepływ 1: Pierwsze Uruchomienie (First Launch / Onboarding)**

* **Kiedy używasz:** Nowy użytkownik po instalacji wchodzi do aplikacji, stojąc w kuchni lub serowarni ze świeżym mlekiem i chce natychmiast sprawdzić parametry nastawu.
* **Sekwencja:**
  ```text
  [Uruchomienie App] 
          │
          ▼
  [Inicjalizacja SQLite WAL] 
          │
          ▼
  [Ekran Główny: app/(tabs)/index.tsx] 
          │
          ├──> [Segmented Control: Serowarstwo | Kiszonki & Kimchi | Kombucha & Ocet]
          └──> [Rozwijana ściana kart i akordeonów]
  ```
  Aplikacja otwiera widok `app/(tabs)/index.tsx`. Użytkownik widzi 5 zakładek na dolnym pasku nawigacyjnym (`Kalkulator`, `Partie`, `Spiżarnia`, `Wiedza`, `Ustawienia`) oraz górny przełącznik trzech diametralnie różnych dziedzin (sery, warzywa, napoje).
* **Koszt ścieżki minimalnej:**
  * Ekrany: **1**
  * Kliknięcia / interakcje: **3–5** (przewijanie ekranu, próba odnalezienia kalkulatora mleka)
  * Pola do wypełnienia: **0**
  * Decyzje: **2** (wybór trybu z menu, ignorowanie modułów kiszonek i kombuchy)
* **Zidentyfikowane tarcia UX:**
  * 🔴 **`P17: Przeładowany Monolit (Anti-Combine)`** (`app/(tabs)/index.tsx:193`): Obecność przełącznika `craftMode: 'cheese' | 'veg' | 'beverage'` i renderowanie `VegCraftSection` oraz `BeverageCraftSection` na ekranie głównym. Serowar zostaje zarzucony kalkulatorami kimchi i octu, co łamie zasadę pojedynczego zadania (*Single-Job Primacy*) i zamrożony kontrakt `[BLOAT-COMBINE]`.
  * 🟡 **`P18: Generyczny Szablon AI`** (`src/components/calculator/calculator.styles.ts:40`): Duże, puste karty z niepotrzebnymi marginesami i brakiem gęstości informacyjnej, zmuszające do nieustannego przewijania w warunkach kuchennych.
  * 🟡 **`P8: Brak Domyślnych Wartości`** (`app/(tabs)/index.tsx:210`): Aplikacja nie zapamiętuje ostatnio używanego gatunku mleka ani profilu serowarskiego.

---

## **2. Przepływ 2: Główny Proces — Wsad Mleczny, Koagulacja i Prasa (Core Cheese Making)**

* **Kiedy używasz:** Serowar przygotowuje wsad (np. 20L mleka), potrzebuje precyzyjnie odmierzyć podpuszczkę IMCU, chlorek wapnia $CaCl_2$, zmierzyć czas flokulacji stoperem i sprasować skrzep.
* **Sekwencja:**
  ```text
  [index.tsx] ──> [Wybór Mleka & Objętości] ──> [Odczyt Dawki Podpuszczki & CaCl2]
                         │
                         ▼
  [Rozwinięcie Akordeonu Flokulacji] ──> [Start Stopera t0] ──> [Punkt tf] ──> [Odliczanie t_cut]
                         │
                         ▼
  [Rozwinięcie Akordeonu Prasy] ──> [Kalkulator Nacisku kg/cm²]
                         │
                         ▼
  [Przejście do Zakładki Partie: batches.tsx] ──> [Ręczne wklepanie partii od nowa]
  ```
  Użytkownik wprowadza litry mleka, odczytuje dawki, następnie rozwija osobną kartę `CheeseFlocculationAndMoldCard.tsx`, uruchamia stoper. Gdy ser jest sprasowany, proces urywa się — aby zachować historię partii, użytkownik musi opuścić kalkulator, przejść do zakładki `Partie` (`batches.tsx`) i ręcznie wprowadzić parametry od zera.
* **Koszt ścieżki minimalnej:**
  * Ekrany: **2** (`index.tsx` $\to$ `batches.tsx`)
  * Kliknięcia / interakcje: **12–16** (wielokrotne rozwijanie akordeonów, przełączanie zakładek, zatwierdzanie formularzy)
  * Pola do wypełnienia: **6–8**
  * Decyzje: **4** (mnożnik flokulacji, typ prasy, ręczne powiązanie danych partii)
* **Zidentyfikowane tarcia UX:**
  * 🔴 **`P14: Rozproszony Proces`** (`app/(tabs)/index.tsx` vs `app/(tabs)/batches.tsx`): Brak ciągłości operacyjnej. Po zakończeniu obliczeń w kalkulatorze dane nie przepływają automatycznie do rejestru partii. Serowar z mokrymi dłońmi musi przepisywać objętość i rodzaj sera w innej zakładce.
  * 🔴 **`P4: Odwrócona Sekwencja`** (`src/components/calculator/CheeseCraftSection.tsx:85`): Parametry formy i prasy są fizycznie oddzielone od wielkości wsadu mlecznego i porozrzucane po 4 niezależnych kartach akordeonowych.
  * 🔴 **`P5: Narzędzie Oderwane od Kontekstu`** (`src/components/calculator/CheeseFlocculationAndMoldCard.tsx:42`): Stoper flokulacji jest schowany w głębi akordeonu zamiast stanowić centralny, odporny na uśpienie punkt skupionej uwagi (*Focused View*).
  * 🟡 **`P16: Zagnieżdżone Akordeony`** (`src/components/calculator/CheeseCraftSection.tsx:120`): Użytkownik musi rozwijać i zwijać liczne karty (`CheeseBrineAndRegenCard`, `CheeseCurdCookingAndSaltingCard`), gubiąc pozycję na ekranie.

---

## **3. Przepływ 3: Dojrzewalnia i Pielęgnacja Krążków (Cave Aging & Affinage Tracking)**

* **Kiedy używasz:** Codzienny poranny lub wieczorny obchód domowej piwniczki serowarskiej / winiarki (temp. 11–13°C, 85% RH) w celu obrócenia krążków, przemycia solanką maziową lub sprawdzenia wilgotności.
* **Sekwencja:**
  ```text
  [Otwarcie batches.tsx] 
          │
          ▼
  [Przełączenie przełącznika: Partie / Dojrzewalnia (Cave Log)]
          │
          ▼
  [Długa lista krążków bez priorytetyzacji]
          │
          ├──> [Wyszukanie krążka Gouda #01]
          └──> [Dotknięcie akcji "Obrócono"] ──> [Wyskakujące okienko potwierdzenia]
  ```
  Dojrzewalnia nie posiada własnej zakładki pierwszego rzędu. Ukryta jest wewnątrz `app/(tabs)/batches.tsx` jako opcja przełącznika `activeTabSection: 'batches' | 'cave'`.
* **Koszt ścieżki minimalnej:**
  * Ekrany: **1** (ale z zagnieżdżonym przełącznikiem widoków)
  * Kliknięcia / interakcje: **4–6** (przełączenie widoku, przewijanie, potwierdzanie dialogu)
  * Pola do wypełnienia: **0–1**
  * Decyzje: **2** (analiza, który ser wymagał pielęgnacji dzisiaj)
* **Zidentyfikowane tarcia UX:**
  * 🔴 **`P6: Pasywna Lista zamiast Proaktywnego Feedu`** (`app/(tabs)/batches.tsx:450`): Lista krążków prezentuje wszystkie sery w jednym ciągu. Aplikacja nie mówi serowarowi wprost: *„Na dziś masz 2 krążki do obrócenia i 1 do przemycia mazią”*. Użytkownik musi ręcznie kalkulować dni od ostatniego zabiegu.
  * 🔴 **`P2: Podzbiór jako Osobny Tryb`** (`app/(tabs)/batches.tsx:76`): Dojrzewalnia (Cave Log) — mimo że stanowi wielomiesięczny, kluczowy etap życia sera — jest stłoczona w jednej zakładce z archiwum ogólnych partii.
  * 🟡 **`P10: Potwierdzenie zamiast Cofnięcia (Undo)`** (`app/(tabs)/batches.tsx:620`): Zwykłe odznaczenie obrotu krążka wywołuje blokujący dialog `Alert.alert("Potwierdź obrót")` zamiast natychmiastowego zapisu z możliwością cofnięcia (Snackbar Undo).
  * 🟡 **`P11: Ukryty Punkt Rosy`** (`app/(tabs)/batches.tsx:830`): Dane mikroklimatu (temperatura i RH) wymagają ręcznego rozwijania sekcji psychrometrycznej zamiast stałego wskaźnika bezpieczeństwa skórki na górze ekranu.

---

## **4. Przepływ 4: Spiżarnia, Generator Etykiet QR PDF i Ekonomia Partii**

* **Kiedy używasz:** Zakup surowców (mleko, podpuszczka, chlorek wapnia, kultury DVI) oraz generowanie arkusza etykiet A4 z kodem QR partii do naklejenia na leżakujący krążek.
* **Sekwencja:**
  ```text
  [Otwarcie pantry.tsx] 
          │
          ├──> [Lista surowców w spiżarni] ──> [Modal: Dodaj surowiec]
          │
          ├──> [Przewinięcie w dół: Kalkulator wydajności i kosztów % Yield]
          │
          └──> [Przewinięcie w dół: Konfigurator arkusza etykiet QR PDF] ──> [expo-print]
  ```
* **Koszt ścieżki minimalnej:**
  * Ekrany: **1**
  * Kliknięcia / interakcje: **7–9**
  * Pola do wypełnienia: **4**
  * Decyzje: **2**
* **Zidentyfikowane tarcia UX:**
  * 🟡 **`P1: Zdublowane Narzędzia Kosztowe`** (`app/(tabs)/pantry.tsx:55`): Obliczanie kosztu partii i wydajności z litra mleka jest zduplikowane w spiżarni, zamiast stanowić naturalny finisz w karcie podsumowującej partię.
  * 🟡 **`P5: Generator Etykiet Oderwany od Partii`** (`app/(tabs)/pantry.tsx:210`): Serowar, który chce wydrukować etykietę dla świeżo zrobionej partii, musi przejść do zakładki Spiżarnia i tam szukać generatora PDF.

---

## **5. Przepływ 5: Szkoła Serowarstwa, Diagnostyka Wad i Zarządzanie Danymi**

* **Kiedy używasz:** Pojawienie się wady sera (np. wczesne wzdęcia, gorzki posmak), zmiana języka interfejsu (35 języków) lub tworzenie lokalnej kopii zapasowej JSON.
* **Sekwencja:**
  ```text
  [Wada sera] ──> [Otwarcie school.tsx] ──> [Przewijanie przez lekcje] ──> [Tabela DEFECTS]
  
  [Kopia danych] ──> [Otwarcie settings.tsx] ──> [Eksport kopii zapasowej JSON]
  ```
* **Koszt ścieżki minimalnej:**
  * Ekrany: **2** (`school.tsx` oraz `settings.tsx`)
  * Kliknięcia / interakcje: **5–8**
  * Pola do wypełnienia: **0**
  * Decyzje: **2**
* **Zidentyfikowane tarcia UX:**
  * 🔴 **`P1: Zdublowany Moduł Cheese Doctor`** (`app/(tabs)/school.tsx:45` vs `src/components/FermentationDoctorModal.tsx`): Diagnostyka wad występuje w dwóch formach: jako statyczna lista na ekranie wiedzy oraz jako interaktywny modal objawowy w zakładce partii.
  * 🟡 **`P3: Zatłoczony Pasek Dolny (5 Zakładek)`** (`app/(tabs)/_layout.tsx:17`): Pięć wąskich przycisków na dole ekranu (`Kalkulator`, `Partie`, `Spiżarnia`, `Wiedza`, `Ustawienia`) skutkuje małymi polami dotykowymi i trudnością w obsłudze jedną ręką.

---

## **6. Tabela Zbiorcza Kosztów i Tarć As-Is**

| Przepływ As-Is | Ekrany | Kliknięcia (ścieżka min.) | Pola danych | Liczba tarć krytycznych 🔴 | Główne wzorce do zaaplikowania |
|---|:---:|:---:|:---:|:---:|---|
| **1. Pierwsze Uruchomienie** | 1 | 3–5 | 0 | **1** | `P17` (usunięcie kiszonek), `P18` (pulpit warsztatowy), `P8` |
| **2. Główny Proces (Wsad, IMCU, Flokulacja, Prasa)** | 2 | 12–16 | 6–8 | **3** | `P14` (ciągły proces), `P4` (ciąg przyczynowy), `P5` (stoper w kroku), `P16` |
| **3. Dojrzewalnia (Cave Log & Affinage)** | 1 (ukryty) | 4–6 | 0–1 | **2** | `P6` (feed akcji na dziś), `P2` (dedykowana zakładka), `P10` (undo) |
| **4. Spiżarnia i Etykiety QR PDF** | 1 | 7–9 | 4 | **0** (2 🟡) | `P1` (usunięcie duplikatów), `P5` (etykieta w partii) |
| **5. Szkoła, Doctor i Ustawienia** | 2 | 5–8 | 0 | **1** (1 🟡) | `P1` (jeden kanoniczny Doctor), `P3` (redukcja do 4 zakładek DEC-UX-01) |
| **SUMA PROCESU BAZOWEGO** | **7** | **31–44** | **10–13** | **7 🔴** | **Docelowy zysk BPR To-Be: redukcja kliknięć o > 40%** |
