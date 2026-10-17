# **SEROWAR BRD 0.1 — 00b Jedna lista decyzji i pytań (DEC-BA-01…02, DEC-01…DEC-45)**

Niniejszy dokument gromadzi wszystkie rozstrzygnięte oraz otwarte decyzje produktowe, strategiczne i inżynieryjne dla projektu SEROWAR.  
**Zasada podejmowania decyzji:** Właściciel podejmuje decyzje produktowe i biznesowe (marka, zakres, wygląd, koszty, priorytety). Kwestie merytoryczne i biochemiczne rozstrzyga badacz według 5-szczeblowej hierarchii źródeł studia (IDF, FAO, Codex Alimentarius, literatura akademicka). Decyzje oznaczone symbolem ⚙ posiadają jasną rekomendację techniczną.

---

## **Blok Strategiczny — Zwrot Kierunku i Tożsamość Marki (ZAAKCEPTOWANE)**

### **DEC-BA-01: Nazwa Marki i Pozycjonowanie w App Store**
* **Kontekst:** Pierwotny projekt zakładał nazwę „FERMENT” i łączenie serowarstwa z kiszonkami warzywnymi i kombuchą. W toku analizy Lead BA wykazano naruszenie zasady Anti-Combine (rozbieżne grupy docelowe, odmienna ergonomia i mechanika procesów).
* **Opcje:**
  * **Opcja A (Wybrana):** **SEROWAR: Rzemieślnicze Przetwórstwo Mleka** (ang. *Serowar: Artisan Cheese & Dairy Craft* / *DairyLog*), Bundle ID: `com.apps4brew.serowar`.
  * **Opcja B:** Pozostanie przy neutralnej nazwie FERMENT jako kombajnie mikrobiologii domowej.
* **Decyzja Właściciela:** **OPCJA A (ZAAKCEPTOWANA 17.10.2026)**. Budowa silnej, jednoznacznej marki lidera w kategorii serowarstwa i przetwórstwa mlecznego.

### **DEC-BA-02: Czyste Cięcie Zakresu — 100% Przetwórstwo Mleczne (The Anti-Combine Principle)**
* **Kontekst:** Weryfikacja zakresu pod kątem spójności doświadczenia użytkownika. Kiszonki warzywne i kombucha posiadają inną dynamikę czasową i odmienny profil rzemieślniczy.
* **Opcje:**
  * **Opcja A (Wybrana):** Całkowite, bezwzględne usunięcie kiszonek, kombuchy i octów z kodu, bazy danych i dokumentacji. 100% dedykacji na pełne uniwersum mleczarskie: sery podpuszczkowe, kwasowe, twarogi klinkowe, sery świeże labneh/paneer, masło i ghee, jogurty/kefiry/maślankę oraz zamknięty obieg serwatki (ricotta, norweski brunost).
  * **Opcja B:** Pozostawienie kiszonek jako „ukrytej” lub drugorzędnej zakładki w menu bocznym.
* **Decyzja Właściciela:** **OPCJA A (ZAAKCEPTOWANA 17.10.2026)**. Realizacja czystego, bezkompromisowego asystenta mleczarskiego o niezrównanej głębokości.

---

## **Blok I — Przed startem budowy (Tydzień 0)**

### **DEC-01 Jaki zakres funkcjonalny wchodzi do MVP?**
* **Kontekst:** Pełny zakres mleczarski to 315 wymagań BR.
* **Opcje:**
  * **A (Pełne MVP):** Kompletny kalkulator serowara, Cave Log, twarogi, masło, napoje fermentowane i obieg serwatki (148 BR, ~4 tyg. pracy agenta).
  * **B (Tylko ser twardy podpuszczkowy):** Wyłącznie moduł sera (90 BR, ~2 tyg.), odłożenie masła i twarogu na 1.1.
* **Rekomendacja:** **A** ⚙. Pełen cykl mleczarski (ser + twaróg + masło + ricotta z serwatki) tworzy kompletną synergię gospodarki surowcem w kuchni i eliminuje marnowanie mleka.
* **Status:** [ZAAKCEPTOWANE: Opcja A w ramach pivotu mleczarskiego].

### **DEC-02 Integracja z bezprzewodowymi czujnikami BLE (RuuviTag, Mijia) w MVP czy w 1.1?**
* **Kontekst:** Użytkownicy piwniczek serowych i winiarko-dojrzewalni stosują termohigrometry BLE.
* **Opcje:**
  * **A (W MVP):** Bezpośredni skaner BLE broadcast dla RuuviTag i Xiaomi Mijia. (+3–4 dni pracy).
  * **B (W 1.1 z ręcznym wprowadzaniem w MVP):** W MVP użytkownik wpisuje odczyty z higrometru ręcznie; w 1.1 dochodzi auto-odczyt BLE.
* **Rekomendacja:** **B** ⚙. Ręczne wprowadzanie jest w 100% niezawodne i nie wymaga fizycznego sprzętu do testów CI.
* **Status:** **[ROZSTRZYGNIĘTE: Opcja B]** — w v1.0 ręczne wprowadzanie pomiarów mikroklimatu w Cave Log; integracja BLE w v1.1 PRO.

### **DEC-03 Aplikacja towarzysząca na Apple Watch w MVP?**
* **Kontekst:** Praca ze skrzepem serowym i solanką oznacza mokre dłonie („ręce w serwatce”).
* **Opcje:**
  * **A (Pełna aplikacja watchOS w MVP):** Stoper flokulacji, podgląd parametrów dojrzewalni, obracanie sera na nadgarstku.
  * **B (Live Activity + powiadomienia interaktywne):** Na zegarku pojawia się widżet Smart Stack / Live Activity z przyciskiem akcji; pełna aplikacja watchOS w wersji 1.1.
* **Rekomendacja:** **B** ⚙. Live Activity doskonale obsługuje timery flokulacji i mieszania bez kosztów osobnego celu watchOS w pierwszym sprincie.
* **Status:** **[ROZSTRZYGNIĘTE: Opcja B]** — wsparcie zegarka przez ActivityKit / Live Activity w v1.0; samodzielny target watchOS w v1.2.

### **DEC-04 Bundle ID aplikacji**
* **Kontekst:** Identyfikator w App Store Connect jest niezmienny po pierwszym wydaniu.
* **Decyzja:** `com.apps4brew.serowar` (zgodnie z DEC-BA-01).
* **Status:** **[ROZSTRZYGNIĘTE]** — unikalny Bundle ID `com.apps4brew.serowar`.

### **DEC-05 Półka cenowa i monetyzacja**
* **Kontekst:** Zgodnie z etosem Apps4Brew („tańsze niż espresso”, bez reklam, bez konta).
* **Opcje:**
  * **A:** 0,99 € / 3,99 zł miesięcznie, 4,99 € / 19,99 zł rocznie, 14,99 € / 59,99 zł dożywotnio (Lifetime).
  * **B:** Tylko jednorazowy zakup 9,99 € / 39,99 zł bez subskrypcji.
* **Rekomendacja:** **A** ⚙. Zapewnia stałą relację z użytkownikami całorocznymi i natychmiastowy zwrot opłaty 99 USD Apple.
* **Status:** **[ROZSTRZYGNIĘTE: Opcja A]** — wdrożony plik `SerowarStoreKit.storekit`, próg rentowności: 28 subów rocznych lub 10 zakupów Lifetime.

---

## **Blok II — W pierwszych 2 tygodniach budowy**

### **DEC-06 Obsługa mleka sklepowego z dodatkiem CaCl2 vs wyłącznie mleko surowe**
* **Kontekst:** Wielu początkujących serowarów w miastach ma dostęp tylko do mleka pasteryzowanego w niskiej temperaturze (mikrofiltrowanego). Wymaga ono suplementacji jonów wapnia $Ca^{2+}$.
* **Rekomendacja:** Wsparcie obu wariantów od pierwszego dnia. Algorytm kalkulatora musi automatycznie dobierać dawkę $CaCl_2$ (0.1–0.4 g/L). Twarda blokada mleka UHT.
* **Status:** **[ROZSTRZYGNIĘTE]** — pełne wsparcie mleka surowego i pasteryzowanego/mikrofiltrowanego z automatycznym dawkowaniem $CaCl_2$; twarda blokada UHT.

### **DEC-07 Domyślna jednostka mocy podpuszczki (IMCU vs 1:10 000)**
* **Kontekst:** Starsza literatura polska operuje stosunkiem objętościowym (np. 1:10 000), a standard międzynarodowy IDF 157 operuje jednostkami IMCU/ml lub IMCU/g.
* **Rekomendacja:** Dwukierunkowy przelicznik w UI z domyślnym przełącznikiem IMCU / Tradycyjna (1:X).
* **Status:** **[ROZSTRZYGNIĘTE]** — domyślnie IMCU z natychmiastowym przelicznikiem skali tradycyjnej 1:X.

### **DEC-08 Metoda mnożnika flokulacji (Flocculation Multiplier)**
* **Kontekst:** Tradycyjna metoda „krojenie po 45 minutach” prowadzi do błędów wilgotności skrzepu. Metoda flokulacji (czas od dodania podpuszczki do momentu, gdy miseczka na mleku przestaje się obracać, pomnożony przez współczynnik 2–6) jest złotym standardem światowego serowarstwa.
* **Rekomendacja:** Wdrożyć interaktywny asystent flokulacji ze stoperem miseczki jako kluczowy wyróżnik aplikacji.
* **Status:** **[ROZSTRZYGNIĘTE]** — stoper flokulacji metodą wirującej miseczki w v1.0 z mnożnikami dedykowanymi dla stylów serów.

### **DEC-09 Zakres bazy kultur starterowych w wersji 1.0**
* **Kontekst:** Na rynku dostępne są setki kultur (Danisco Choozit, Chr. Hansen, Sacco, Dalton).
* **Rekomendacja:** Baza predefiniowanych szczepów generycznych (Mezofilne typ O, Mezofilne typ LD z diacetylactis, Termofilne typ T, Termofilne jogurtowe/włoskie, Szlachetne pleśnie Penicillium i bakterie maziowe Brevibacterium linens) z możliwością dodawania własnych kultur handlowych.
* **Status:** **[ROZSTRZYGNIĘTE]** — generyczne profile szczepów w v1.0; asystent rotacji przeciw bakteriofagom w v1.1 PRO.

### **DEC-10 Standard technologiczny zmaślania śmietanki i solenia masła**
* **Kontekst:** Zmaślanie śmietany słodkiej vs ukwaszonej mezofilnie (cultured butter) oraz optymalna temperatura procesu.
* **Rekomendacja:** Domyślny asystent z oknem temperaturowym 10–13°C (zima/lato), kalkulator wydajności z bilansu tłuszczu i kalkulator solenia masła w fazie wodnej (ochrona mikrobiologiczna).
* **Status:** **[ROZSTRZYGNIĘTE]** — asystent zmaślania, inwersji emulsji, płukania lodowego oraz wytapiania ghee włączony do v1.0 (Tab 2).

---

## **Blok III — Przed publikacją w App Store (TestFlight)**

### **DEC-11 Ochrona przed roszczeniami zdrowotnymi (Apple Guideline 1.4.1)**
* **Kontekst:** Aplikacje o nabiale i probiotykach bywają weryfikowane pod kątem twierdzeń medycznych (leczenie mikrobioty).
* **Rekomendacja:** Neutralny język biochemiczny i technologiczny, brak obietnic leczniczych, czytelna klauzula sanitarna w ustawieniach.
* **Status:** **[ROZSTRZYGNIĘTE]** — wdrożona neutralna terminologia biochemiczna i disclaimer prawno-sanitarny w aplikacji.

### **DEC-12 Bezpieczeństwo mikrobiologiczne mleka surowego**
* **Kontekst:** Mleko surowe niepasteryzowane niesie ryzyko obecności patogenów (*Listeria monocytogenes*, *Salmonella*, *E. coli* STEC).
* **Rekomendacja:** Zgodnie z normą FDA 21 CFR 133 / unijnymi przepisami weterynaryjnymi: dla serów z mleka surowego aplikacja rekomenduje minimalny czas dojrzewania 60 dni w temperaturze $\ge 2^\circ C$ lub pasteryzację niskotemperaturową (LTLT 63°C przez 30 min / HTST 72°C przez 15 s).
* **Status:** **[ROZSTRZYGNIĘTE]** — reguła RD-42 i ostrzeżenia sanitarne wbudowane w silnik Cave Log i kalkulator mleka.

### **DEC-13 Generowanie etykiet i paszportów krążków sera (PDF)**
* **Kontekst:** W dojrzewalni krążki leżą miesiącami. Potrzebne są papierowe etykiety odporne na wilgoć z kodem QR partii.
* **Rekomendacja:** Moduł wydruku arkuszy etykiet przez `expo-print` z unikalnym identyfikatorem partii, datą, stylem i parametrami nastawu.
* **Status:** **[ROZSTRZYGNIĘTE]** — moduł generatora PDF i skanera kodów partii (`expo-camera`) w v1.0 (Tab 4).

### **DEC-14 Format eksportu i kopii zapasowej**
* **Kontekst:** Użytkownicy nie mogą utracić wielomiesięcznej historii dojrzewania.
* **Rekomendacja:** Pełny eksport JSON zgodny ze standardem studia Apps4Brew + eksport arkusza CSV z partiami do wglądu na komputerze.
* **Status:** **[ROZSTRZYGNIĘTE]** — offline export JSON i CSV dostępny bezpłatnie dla każdego użytkownika (Tarcza Odczytu).

### **DEC-15 Nazwa międzynarodowa dla App Store**
* **Kontekst:** Globalna dystrybucja w 35 językach.
* **Decyzja:** *Serowar: Artisan Cheese & Dairy Craft* (lub krótko *DairyLog*).
* **Status:** **[ROZSTRZYGNIĘTE]** — nazwa międzynarodowa zatwierdzona.

---

## **Blok IV — Granice Zakresu i Ochrona Przed Bloatem (Scope Gatekeeper DEC-16…DEC-20)**

### **DEC-16 Wydzielenie Aplikacji Satelickiej: SŁOIK (Anti-Combine Decision)**
* **Kontekst:** Analiza dekompozycji portfolio wykazała konieczność całkowitego rozdzielenia przetwórstwa mlecznego od roślinnego.
* **Decyzja:** Wszystkie zagadnienia kiszonek warzywnych, kombuchy i octów owocowych zostają bezpowrotnie wycięte z SEROWAR i wydzielone do osobnej aplikacji portfolio *SŁOIK* ze wspólnym formatem importu/eksportu JSON.
* **Status:** **[ROZSTRZYGNIĘTE]** — `docs/scope-contract.md` zatwierdzone.

### **DEC-17 Tarcza Odczytu Archiwum (Read-Only Archive Shield)**
* **Kontekst:** Monetyzacja nie może naruszać praw użytkownika do jego własnych danych ani powodować negatywnych ocen w App Store.
* **Decyzja:** Użytkownik darmowy ma dożywotni, pełny dostęp do odczytu, przeglądania i eksportu wszystkich swoich historycznych partii i notatek. Paywall ogranicza wyłącznie tworzenie nowych partii powyżej limitu bezpłatnego.
* **Status:** **[ROZSTRZYGNIĘTE]** — zasada wdrożona w StoreKit 2 i architekturze danych.

### **DEC-18 Limit Darmowy Cave Log: 3 Aktywne Krążki vs Nielimitowany PRO**
* **Kontekst:** Wyznaczenie granicy darmowej wersji dającej natychmiastową wartość (Aha! moment), a jednocześnie motywującej do zakupu PRO.
* **Decyzja:** 3 aktywne krążki w dojrzewalni jednocześnie w wersji darmowej (wystarczające dla początkującego hobbysty). Czwarty krążek wymaga zakupu PRO (3,99 zł/mies., 19,99 zł/rok lub 59,99 zł Lifetime).
* **Status:** **[ROZSTRZYGNIĘTE]** — zapisane w `docs/scope-contract.md` i `docs/audyt-monetyzacji.md`.

### **DEC-19 Architektura 100% Offline-First i Brak Kont Użytkowników**
* **Kontekst:** Ochrona prywatności i działanie w piwnicach serowych bez zasięgu sieci komórkowej.
* **Decyzja:** Całkowity zakaz wdrażania chmury, kont, rejestracji e-mail i serwerów pośredniczących. Dane zapisywane wyłącznie w lokalnej bazie SQLite WAL urządzenia.
* **Status:** **[ROZSTRZYGNIĘTE]** — dyrektywa zamrożona dla Architekta Systemowego (Rola 5).

### **DEC-20 Przeniesienie Encyklopedii do Bazy Wiedzy (Knowledge Offloading)**
* **Kontekst:** Ochrona widoków operacyjnych przed paraliżem poznawczym (Zasada Słoika).
* **Decyzja:** Złożone wykłady z mikrobiologii, kinetyki fermentacji i biochemii zostają wycięte z modalów i ekranów kalkulatora. Trafiają wyłącznie do dedykowanego modułu Field Guide / Szkoła Mleczarstwa (Rola 6).
* **Status:** **[ROZSTRZYGNIĘTE]** — zatwierdzone w `docs/scope-contract.md`.

