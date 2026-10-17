# SEROWAR (RZEMIEŚLNICZE PRZETWÓRSTWO MLEKA)
## KOMPLETNY BUSINESS REQUIREMENTS DOCUMENT (BRD) — WYDANIE 0.1 MASTER
> Apps4Brew Studio Engineering Standard | Data opracowania: Październik 2026

---



<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: 00_START.md -->
<!-- ========================================== -->

# **SEROWAR (Rzemieślnicze Przetwórstwo Mleka) — Wymagania biznesowe (BRD), wersja robocza 0.1, 17.10.2026**

**Status:** Wersja robocza 0.1 po strategicznym zwrocie (Pivot: 100% Przetwórstwo Mleczne, decyzje DEC-BA-01: A, DEC-BA-02: A).  
**Kierunek:** Bezkompromisowe skupienie na rzemieślniczym przetwórstwie mleka (sery podpuszczkowe, kwasowe, twarogi klinkowe, sery świeże labneh/paneer, masielnictwo i ghee, napoje fermentowane jogurt/kefir/maślanka, zamknięty obieg serwatki ricotta/brunost oraz dozór dojrzewania Cave Log). Czyste usunięcie fermentacji warzywnych, kombuchy i octów z zakresu aplikacji.  
**Autor:** Lead Business Analyst & Product Discovery Architect studia Apps4Brew we współpracy z badaczem biochemii mleka i technologii mleczarstwa.

---

## **1. Jak czytać ten dokument**

### **Części dokumentu**

| Plik | Rozdziały | Zawartość |
| :--- | :--- | :--- |
| **00_START** (ten plik) | — | Streszczenie wykonawcze, tożsamość marki SEROWAR, warianty MVP, warunki brzegowe, spis treści i statystyki dokumentu. |
| **00b_Jedna_lista_decyzji** | — | Zbiorcza lista decyzji DEC-01…DEC-45 + DEC-BA-01 i DEC-BA-02 z podziałem na bloki decyzyjne i rekomendacjami. |
| **00c_Sprzecznosci_i_weryfikacja** | — | Sprzeczności dziedzinowe mleczarstwa: chlorek wapnia, kinetyka podpuszczki, biochemia zmaślania śmietanki, temperatura dogrzewania twarogu, denaturacja albumin w ricotcie, karmelizacja laktozy w brunost. |
| **A1_Wizja_Problem_Persony** | 1–3 | Wizja i 16 nienegocjowalnych zasad produktu (ZP-01…16), analiza problemów serowara i mleczarza domowego, persony (P1–P8) oraz 15 sytuacji życiowych (SYT-01…15). |
| **A2_Rynek_Przychod_Zakres** | 4–6.1 | Analiza rynku serowarstwa zagrodowego i domowego nabiału (USA, Polska, Francja, Włochy, DACH, Skandynawia), model przychodowy Apps4Brew (0,99 € / 4,99 € / 14,99 €), granice systemu. |
| **A3a_Tabela_Zakresu_cz1** | 6.2 | Tabela zakresu Z-001…Z-120: Serowarstwo podpuszczkowe (gatunki mleka, CaCl2, kultury DVI, koagulacja IMCU, flokulacja, gęstwa, solanka, dojrzewalnia Cave Log). |
| **A3b_Tabela_Zakresu_cz2** | 6.2 | Tabela zakresu Z-121…Z-240: Twarogi klinkowe, sery świeże, masło rzemieślnicze i ghee, jogurt/kefir/maślanka, obieg serwatki Ricotta i Brunost, spiżarnia, etykiety QR, Apple Watch, BLE. |
| **A3c_Etapy_Naklad_Warianty** | 6.3–6.5 | Etapy wdrożenia (MVP, 1.1, 1.2, 2.x, badanie, nigdy), nakład pracy agentów w roboczodniach, warianty startowe. |
| **A4_KPI_Marketing_ASO** | 13, 15 | Prywatne KPI bez śledzenia użytkownika, strategia ASO dla SEROWAR / Artisan Cheese & Dairy Craft, kręgi dotarcia organicznego. |
| **B1_Narzedzia_Kalkulator_Serowara** | 7 (narzędzia) | Wymagania BR-SER-001…035: dobór mleka, gatunki (krowa, koza, owca, bawół), titracja CaCl2, kultury DVI, dawkowanie IMCU, stoper i mnożnik flokulacji (Flocculation Multiplier). |
| **B2_Narzedzia_Obrobka_Skrzepu_Prasowanie** | 7 (narzędzia) | Wymagania BR-CURD-001…030: cięcie skrzepu harfą, rampa dogrzewania gęstwy, synereza, formowanie, kalibracja prasy i harmonogramy obciążeń (kg/cm², PSI). |
| **B3_Narzedzia_Solenie_i_Solanki** | 7 (narzędzia) | Wymagania BR-SOL-001…025: solenie na sucho, nasycona kąpiel solankowa, kontrola gęstości (°Bé, Salometer), buforowanie kwasowości i wapnia solanki. |
| **B4_Narzedzia_Cave_Log_Dozor_Dojrzewania** | 7 (narzędzia) | Wymagania BR-CAVE-001…040: Dziennik dojrzewalni (Cave Log), harmonogramy obracania, pielęgnacja skórki (maziowe B. linens, pleśniowe Penicillium, woskowanie), alerty psychrometryczne, ubytek wagi (% shrinkage). |
| **B5_Narzedzia_Twarogi_i_Sery_Swieze** | 7 (narzędzia) | Wymagania BR-TWAR-001…035: twaróg tradycyjny ze zsiadłego mleka, dogrzewanie skrzepu kwasowego (35–45°C), formowanie klinka, odciek grawitacyjny, labneh, paneer/chhena, queso blanco, sery świeże kwasowo-podpuszczkowe. |
| **B6_Narzedzia_Napoje_Mleczne_Maslo_Ghee** | 7 (narzędzia) | Wymagania BR-DAIRY-001…035: zmaślanie śmietanki słodkiej i ukwaszonej, okno temperaturowe 10–14°C, inwersja emulsji O/W -> W/O, płukanie wodą lodową, wyciskanie maślanki, ghee i masło klarowane (250°C), jogurt termofilny, kefir tradycyjny na ziarnach, rzemieślnicza maślanka. |
| **B7_Narzedzia_Spizarnia_Naczynia_Etykiety** | 7 (narzędzia) | Wymagania BR-MAG-001…030: spiżarnia z auto-odpisem surowców mlecznych, paszporty kręgów sera z kodami QR, wydruki PDF (expo-print), kalkulator kosztu partii i wydajności z litra mleka (% yield). |
| **B8_Narzedzia_Zegarki_LiveActivity_Sensory** | 7 (narzędzia) | Wymagania BR-SYS-001…030: Apple Watch & Garmin ("ręce w serwatce"), Live Activity koagulacji i obracania, integracja z czujnikami BLE (RuuviTag/Mijia), radar sensoryczny sera SVG. |
| **C1_Nauka_Szkola_Serowarstwa_i_Fermentacji** | 7 (nauka) | Wymagania BR-EDU-001…040: interaktywne moduły edukacyjne chemii mleka, kompas diagnostyczny wad sera (Cheese Doctor), diagnostyk wad masła, twarogu, jogurtu i ricotty (Dairy Doctor). |
| **C2_Reguly_Dziedzinowe_Serowarstwo** | 8 (reguły) | Reguły RD-01…RD-25: wzory matematyczne koagulacji, IMCU, mnożnika flokulacji, dawkowania CaCl2, gęstości solanki, nacisku prasy, wilgotności względnej i punktu rosy z wektorami testowymi. |
| **C3_Reguly_Dziedzinowe_Przetworstwo_Mleczne** | 8 (reguły) | Reguły RD-26…RD-50: biochemia koagulacji kwasowej kazeiny w pI 4.6, bilans tłuszczowy zmaślania, denaturacja białek serwatkowych w Ricotcie, karmelizacja laktozy w norweskim Brunost/Mysost, kinetyka jogurtu i kefiru, wytapianie ghee. |
| **C4_Proces_Tresci_i_Decyzje_Badacza** | 8.P (proces) | Rejestr decyzji badawczych D-01…D-25, hierarchia źródeł (IDF, FAO, Codex Alimentarius dla mleka, literatura akademicka Fox, Kosikowski, Walstra), procedury weryfikacji. |
| **D1_Wymagania_Niefunkcjonalne** | 9–10 | Wymagania NFR-001…NFR-115: 100% Offline-First, i18n 35 języków, standardy dostępności WCAG AAA / VoiceOver, wydajność na słabych urządzeniach, zgodność z Apple Review. |
| **D2_Architektura_Model_SQLite** | 11–12 | Pełny schemat relacyjny SQLite w trybie WAL, bezpieczna ścieżka aplikacji, silnik 10-krotnej rotacji kopii zapasowych JSON, obsługa zdarzeń offline. |
| **D3_Rejestr_Ryzyk_i_Pytania** | 14, 16 | Rejestr 50 ryzyk sanitarnych (patogeny mleka surowego, listeria, bakteriofagi, zjełczenie tłuszczu), technicznych i biznesowych z mitygacją. |
| **D4_Strategia_Testow_Jakosci** | 17 | 9-warstwowa strategia testów wg wzorca Trening (logika, ekran, scenariusz, macierz, niezmienniki, dane, języki/wygląd, regresja, E2E Maestro), testy mutacyjne Stryker. |

---

## **2. Streszczenie dla właściciela**

### **Co to jest aplikacja SEROWAR (Rzemieślnicze Przetwórstwo Mleka)**
**SEROWAR** to profesjonalny, kieszonkowy asystent domowego i zagrodowego przetwórstwa mleka, stworzony w standardzie rzemieślniczym studia Apps4Brew na wzór aplikacji **Napar** (kawa specialty/herbata), **Piekarz** (piekarstwo rzemieślnicze) oraz **Słoik** (przetwórstwo domowe).

Głównym problemem użytkownika w przetwórstwie mlecznym jest **brak kontroli nad subtelnymi, niewidzialnymi procesami enzymatycznymi, biologicznymi i termicznymi o krytycznym horyzoncie czasowym (od minut przy koagulacji i zmaślaniu, po 12 miesięcy w dojrzewalni)**. Błąd temperatury mleka o 1.5°C niszczy koagulację, pasteryzacja bez uzupełnienia wapnia uniemożliwia ścięcie skrzepu, przegrzanie twarogu powyżej 45°C zamienia go w suchą kredę, zmaślanie zbyt ciepłej śmietanki powoduje ucieczkę tłuszczu do maślanki, a wylewanie serwatki do zlewu marnuje potencjał wykwintnej Ricotty czy karmelowego Brunostu.

Aplikacja rozwiązuje ten problem kompleksowo poprzez:
1. **Precyzyjny Kalkulator Serowara:** przeliczanie dawek podpuszczki w międzynarodowych jednostkach krzepnięcia IMCU (IDF 157), titrację chlorku wapnia ($CaCl_2$) dla mleka sklepowego/pasteryzowanego w celu odbudowy miceli kazeinowych, dobór kultur starterowych (mezofilnych i termofilnych) oraz dynamiczny stoper koagulacji oparty o metodę mnożnika flokulacji (Flocculation Multiplier).
2. **Dozór Dojrzewania (Cave Log / Affinage Journal):** rejestrację mikroklimatu jaskini dojrzewalniczej/chłodziarki (temperatura, wilgotność względna, punkt rosy), automatyczny harmonogram pielęgnacji skórki (przemywanie solanką z *Brevibacterium linens*, rozwój porostu pleśni szlachetnych *Penicillium camemberti* / *roqueforti*, woskowanie, oliwienie), alerty obracania krążków oraz monitorowanie ubytku masy (% shrinkage).
3. **Moduł Tradycyjnych Twarogów i Serów Świeżych:** kontrolę powolnego ukwaszania kazeiny do punktu izoelektrycznego (pH 4.6), precyzyjną rampę dogrzewania skrzepu kwasowego (35–45°C), formowanie tradycyjnego klinka w chuście, asystent serka Labneh oraz termiczno-kwasową koagulację Paneer/Chhena.
4. **Masielnictwo Rzemieślnicze i Ghee:** okno temperaturowe zmaślania śmietanki (10–14°C), asystent inwersji emulsji tłuszczowej, procedurę płukania wodą lodową i mechanicznego wyciskania maślanki, powolne wytapianie czystego ghee o punkcie dymienia 250°C.
5. **Napoje Fermentowane:** jogurt termofilny w symbiozie *S. thermophilus* i *L. bulgaricus*, tradycyjny kefir na grzybku tybetańskim z rotacją kultur oraz naturalną maślankę pełną fosfolipidów MFGM.
6. **Zamknięty Obieg Serwatki (Zero-Waste Whey Loop):** termiczna denaturacja albumin w Ricotcie (pH 5.8–6.0, $T \ge 85^\circ C$) oraz odparowanie i karmelizacja laktozy w norweskim Brunost/Mysost.
7. **Ekosystem Hands-Free i Sensory:** Apple Watch i Garmin dla serowara o dłoniach oblepionych serwatką i solanką, powiadomienia Live Activity na zablokowanym ekranie oraz odczyt z czujników BLE (RuuviTag, Xiaomi Mijia).

Aplikacja działa w **100% Offline-First, bez konta, bez serwera, bez telemetrii i reklam**, w 35 językach.

### **Liczby dokumentu SEROWAR BRD**

| Element | Liczba | Podział |
| :--- | :--- | :--- |
| **Wymagania funkcjonalne BR** | **315** | B1 (Serowar) 35 · B2 (Skrzep i Prasa) 30 · B3 (Solanki) 25 · B4 (Cave Log) 40 · B5 (Twarogi i Sery Świeże) 35 · B6 (Napoje Mleczne, Masło, Ghee) 35 · B7 (Spiżarnia i Koszty) 30 · B8 (Zegarki, Live Activity, BLE) 30 · C1 (Szkoła i Diagnostyka) 40 · Zegarki/BLE 15 |
| **Priorytety BR** | MUST 156 · SHOULD 102 · COULD 57 | w MVP: 148 BR (MUST 126, SHOULD 22) |
| **Wymagania niefunkcjonalne NFR** | **115** | OFF 10 · I18N 12 · DOST 15 · WYG 10 · WYD 12 · DANE 16 · BEZP 20 · ZEG 10 · TEST 10 |
| **Reguły dziedzinowe RD** | **50** | RD-01…RD-25 (Serowarstwo i Affinage) · RD-26…RD-50 (Przetwórstwo Mleczne: Masło, Twarogi, Ricotta, Brunost, Jogurt, Kefir) z wektorami testowymi |
| **Rejestr ryzyk RYZ** | **50** | Sanitarne (Listeria, patogeny mleka surowego, bakteriofagi), technologiczne, regulacyjne Apple |
| **Jedna lista decyzji DEC** | **47** | DEC-BA-01, DEC-BA-02 + DEC-01…DEC-45 podzielone na bloki wdrożeniowe |
| **Decyzje badacza D** | **25** | D-01…D-25 rozstrzygające parametry enzymatyczne i chemiczne przetwórstwa mlecznego |
| **Tabela zakresu Z** | **240** | Z-001…Z-240 z podziałem na etapy (MVP, 1.1, 1.2, 2.x, badanie, nigdy) |

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: 00b_Jedna_lista_decyzji.md -->
<!-- ========================================== -->

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

### **DEC-03 Aplikacja towarzysząca na Apple Watch w MVP?**
* **Kontekst:** Praca ze skrzepem serowym i solanką oznacza mokre dłonie („ręce w serwatce”).
* **Opcje:**
  * **A (Pełna aplikacja watchOS w MVP):** Stoper flokulacji, podgląd parametrów dojrzewalni, obracanie sera na nadgarstku.
  * **B (Live Activity + powiadomienia interaktywne):** Na zegarku pojawia się widżet Smart Stack / Live Activity z przyciskiem akcji; pełna aplikacja watchOS w wersji 1.1.
* **Rekomendacja:** **B** ⚙. Live Activity doskonale obsługuje timery flokulacji i mieszania bez kosztów osobnego celu watchOS w pierwszym sprincie.

### **DEC-04 Bundle ID aplikacji**
* **Kontekst:** Identyfikator w App Store Connect jest niezmienny po pierwszym wydaniu.
* **Decyzja:** `com.apps4brew.serowar` (zgodnie z DEC-BA-01).

### **DEC-05 Półka cenowa i monetyzacja**
* **Kontekst:** Zgodnie z etosem Apps4Brew („tańsze niż espresso”, bez reklam, bez konta).
* **Opcje:**
  * **A:** 0,99 € / 3,99 zł miesięcznie, 4,99 € / 19,99 zł rocznie, 14,99 € / 59,99 zł dożywotnio (Lifetime).
  * **B:** Tylko jednorazowy zakup 9,99 € / 39,99 zł bez subskrypcji.
* **Rekomendacja:** **A** ⚙. Zapewnia stałą relację z użytkownikami całorocznymi i natychmiastowy zwrot opłaty 99 USD Apple.

---

## **Blok II — W pierwszych 2 tygodniach budowy**

### **DEC-06 Obsługa mleka sklepowego z dodatkiem CaCl2 vs wyłącznie mleko surowe**
* **Kontekst:** Wielu początkujących serowarów w miastach ma dostęp tylko do mleka pasteryzowanego w niskiej temperaturze (mikrofiltrowanego). Wymaga ono suplementacji jonów wapnia $Ca^{2+}$.
* **Rekomendacja:** Wsparcie obu wariantów od pierwszego dnia. Algorytm kalkulatora musi automatycznie dobierać dawkę $CaCl_2$ (0.1–0.4 g/L). Twarda blokada mleka UHT.

### **DEC-07 Domyślna jednostka mocy podpuszczki (IMCU vs 1:10 000)**
* **Kontekst:** Starsza literatura polska operuje stosunkiem objętościowym (np. 1:10 000), a standard międzynarodowy IDF 157 operuje jednostkami IMCU/ml lub IMCU/g.
* **Rekomendacja:** Dwukierunkowy przelicznik w UI z domyślnym przełącznikiem IMCU / Tradycyjna (1:X).

### **DEC-08 Metoda mnożnika flokulacji (Flocculation Multiplier)**
* **Kontekst:** Tradycyjna metoda „krojenie po 45 minutach” prowadzi do błędów wilgotności skrzepu. Metoda flokulacji (czas od dodania podpuszczki do momentu, gdy miseczka na mleku przestaje się obracać, pomnożony przez współczynnik 2–6) jest złotym standardem światowego serowarstwa.
* **Rekomendacja:** Wdrożyć interaktywny asystent flokulacji ze stoperem miseczki jako kluczowy wyróżnik aplikacji.

### **DEC-09 Zakres bazy kultur starterowych w wersji 1.0**
* **Kontekst:** Na rynku dostępne są setki kultur (Danisco Choozit, Chr. Hansen, Sacco, Dalton).
* **Rekomendacja:** Baza predefiniowanych szczepów generycznych (Mezofilne typ O, Mezofilne typ LD z diacetylactis, Termofilne typ T, Termofilne jogurtowe/włoskie, Szlachetne pleśnie Penicillium i bakterie maziowe Brevibacterium linens) z możliwością dodawania własnych kultur handlowych.

### **DEC-10 Standard technologiczny zmaślania śmietanki i solenia masła**
* **Kontekst:** Zmaślanie śmietany słodkiej vs ukwaszonej mezofilnie (cultured butter) oraz optymalna temperatura procesu.
* **Rekomendacja:** Domyślny asystent z oknem temperaturowym 10–13°C (zima/lato), kalkulator wydajności z bilansu tłuszczu i kalkulator solenia masła w fazie wodnej (ochrona mikrobiologiczna).

---

## **Blok III — Przed publikacją w App Store (TestFlight)**

### **DEC-11 Ochrona przed roszczeniami zdrowotnymi (Apple Guideline 1.4.1)**
* **Kontekst:** Aplikacje o nabiale i probiotykach bywają weryfikowane pod kątem twierdzeń medycznych (leczenie mikrobioty).
* **Rekomendacja:** Neutralny język biochemiczny i technologiczny, brak obietnic leczniczych, czytelna klauzula sanitarna w ustawieniach.

### **DEC-12 Bezpieczeństwo mikrobiologiczne mleka surowego**
* **Kontekst:** Mleko surowe niepasteryzowane niesie ryzyko obecności patogenów (*Listeria monocytogenes*, *Salmonella*, *E. coli* STEC).
* **Rekomendacja:** Zgodnie z normą FDA 21 CFR 133 / unijnymi przepisami weterynaryjnymi: dla serów z mleka surowego aplikacja rekomenduje minimalny czas dojrzewania 60 dni w temperaturze $\ge 2^\circ C$ lub pasteryzację niskotemperaturową (LTLT 63°C przez 30 min / HTST 72°C przez 15 s).

### **DEC-13 Generowanie etykiet i paszportów krążków sera (PDF)**
* **Kontekst:** W dojrzewalni krążki leżą miesiącami. Potrzebne są papierowe etykiety odporne na wilgoć z kodem QR partii.
* **Rekomendacja:** Moduł wydruku arkuszy etykiet przez `expo-print` z unikalnym identyfikatorem partii, datą, stylem i parametrami nastawu.

### **DEC-14 Format eksportu i kopii zapasowej**
* **Kontekst:** Użytkownicy nie mogą utracić wielomiesięcznej historii dojrzewania.
* **Rekomendacja:** Pełny eksport JSON zgodny ze standardem studia Apps4Brew + eksport arkusza CSV z partiami do wglądu na komputerze.

### **DEC-15 Nazwa międzynarodowa dla App Store**
* **Kontekst:** Globalna dystrybucja w 35 językach.
* **Decyzja:** *Serowar: Artisan Cheese & Dairy Craft* (lub krótko *DairyLog*).

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: 00c_Sprzecznosci_i_weryfikacja.md -->
<!-- ========================================== -->

# **SEROWAR BRD 0.1 — 00c Sprzeczności dziedzinowe, normy i weryfikacja merytoryczna**

Dokument przedstawia analizę sprzeczności występujących w tradycyjnej literaturze mleczarskiej, forach serowarskich i podręcznikach rzemiosła, rozstrzygniętych przez badacza dziedzinowego na podstawie 5-szczeblowej hierarchii źródeł (IDF, FAO, Codex Alimentarius dla mleka i przetworów mlecznych, literatura akademicka Fox, Kosikowski, Walstra, Bylund).

---

## **1. Serowarstwo: Mleko i chemia koagulacji**

### **Sprzeczność S-01: Chlorek wapnia ($CaCl_2$) — dodawać zawsze czy tylko do mleka pasteryzowanego?**
* **Problem w źródłach:** Część forów zaleca dodawanie chlorku wapnia do każdego mleka „na wszelki wypadek”. Inne źródła ostrzegają przed gorzkim smakiem i nadmierną kruchością skrzepu.
* **Rozstrzygnięcie badawcze:** Pasteryzacja termiczna powoduje wytrącanie rozpuszczalnego fosforanu wapnia do formy koloidalnej, co drastycznie osłabia mostki wapniowe między micelami kazeiny i wydłuża czas koagulacji. W mleku surowym, świeżym od krowy/kozy, poziom jonów $Ca^{2+}$ jest fizjologicznie optymalny.
* **Zasada w SEROWAR (RD-03):** 
  * Dla mleka pasteryzowanego/sklepowego: rekomendowany dodatek $0.2 - 0.3\text{ g}$ bezwodnego $CaCl_2$ na 1 litr mleka (lub $0.6 - 0.9\text{ ml}$ roztworu 33% na 10 litrów).
  * Dla mleka surowego: dodatek $0.0 - 0.1\text{ g/L}$, zalecany tylko w okresie zimowym przy ubogiej paszy.
  * Ostrzeżenie górnego limitu: przekroczenie $0.4\text{ g/L}$ blokuje partię z uwagi na defekt metaliczno-gorzkiego smaku.

### **Sprzeczność S-02: Dawkowanie podpuszczki — czas stały vs metoda flokulacji**
* **Problem w źródłach:** Przepisy tradycyjne podają: „dodaj 1 ml podpuszczki i odczekaj 45 minut”. W praktyce aktywność enzymatyczna spada z czasem, a mleko różni się zawartością kazeiny i kwasowością, co powoduje zacinanie skrzepu lub jego przepróchnienie.
* **Rozstrzygnięcie badawcze:** Standard światowy (metoda Berridge'a / Flocculation Multiplier) opiera się na wyznaczeniu **punktu flokulacji** (pierwsze widoczne mikroskopowe zżelowanie, sprawdzane obracającą się lekką miseczką na powierzchni mleka). Czas do flokulacji ($t_f$, zazwyczaj 10–18 min) mnoży się przez współczynnik flokulacji $M$ dedykowany dla danego typu sera.
* **Zasada w SEROWAR (RD-04):** Aplikacja odrzuca sztywne czasy oczekiwania. Wdraża stoper flokulacji: całkowity czas od zaprawienia do cięcia $= t_f \times M$.
  * Twarde/alpejskie (Parmesan, Gruyère): $M = 2.0 - 2.5$.
  * Półtwarde (Gouda, Tilsit): $M = 3.0 - 3.5$.
  * Miękkie/pleśniowe (Camembert, Brie): $M = 4.0 - 5.0$.
  * Kwasowo-podpuszczkowe: $M = 6.0$.

### **Sprzeczność S-03: Kąpiel solankowa — nasycenie solanki, pH i wapń**
* **Problem w źródłach:** Tradycyjne przepisy zalecają „zrób solankę z wody i soli, aż jajko wypłynie”. Taka solanka rozpuszcza wapń ze skórki sera, powodując jej śluzowacenie (rozpad zewnętrznej warstwy białka) oraz zakażenia mikrobiologiczne z powodu zbyt wysokiego pH wody kranowej.
* **Rozstrzygnięcie badawcze:** Prawidłowa solanka serowarska musi znajdować się w stanie potrójnej równowagi:
  1. **Nasycenie solą:** 18–22% NaCl (gęstość 1.13–1.16 g/cm³, 19–21° Baumé). W solance < 16% namnażają się drożdże i bakterie gnilne.
  2. **Równowaga pH:** pH solanki musi być zbliżone do pH solonego sera (pH 5.2–5.4). Solanka z czystej wody (pH 7.0) wyciąga kwas i rozmiękcza kazeinę.
  3. **Równowaga wapniowa:** dodatek $0.1 - 0.2\%\ CaCl_2$ zapobiega wymywaniu wapnia ze skórki krążka.
* **Zasada w SEROWAR (RD-07):** Kalkulator solanki oblicza masę soli, objętość kwasu (serwatki/octu lub kwasu mlekowego) oraz dawkę $CaCl_2$ dla bezpiecznej kąpieli.

---

## **2. Dojrzewalnia (Cave Log) i Pielęgnacja Skórki**

### **Sprzeczność S-04: Kontrola wilgotności względnej (RH) — higrometry tanie vs psychrometria**
* **Problem w źródłach:** Tanie domowe higrometry pojemnościowe w warunkach wilgotności 85–95% ulegają nasyceniu i zafałszowują wyniki o 10–15%, co prowadzi do gnicia skórki lub jej wysychania i pękania.
* **Rozstrzygnięcie badawcze:** Monitorowanie komory dojrzewalniczej wymaga uwzględnienia temperatury punktu rosy ($T_{dp}$) i unikania bezpośredniej kondensacji wody na powierzchni krążków. Skórka sera schnie, gdy prężność pary wodnej na jej powierzchni jest wyższa niż w otoczeniu.
* **Zasada w SEROWAR (RD-12):** Algorytm wylicza deficyt prężności pary wodnej (VPD) i ostrzega przed kondensacją kropelkową na serze (zarzewie pleśni czarnej *Mucor*).

### **Sprzeczność S-05: Pielęgnacja Brevibacterium linens (sery maziowe) vs pleśń Penicillium**
* **Problem w źródłach:** Próba wyhodowania czerwonej mazi na serach o zbyt niskim pH kończy się porażką, a skórka porasta dziką pleśnią.
* **Rozstrzygnięcie badawcze:** *Brevibacterium linens* jest bezwzględnym tlenowcem i nie rozwija się w środowisku o pH < 5.8. Wymaga uprzedniego odkwaszenia powierzchni przez drożdże serowarskie (*Geotrichum candidum* lub *Debaryomyces hansenii*), które konsumują kwas mlekowy i podnoszą pH skórki.
* **Zasada w SEROWAR (RD-14):** Asystent affinage prowadzi dwuetapowy protokół dla serów maziowych: najpierw rozwój welwetu *Geotrichum* (3–6 dni), następnie przemywanie roztworem maziowym przy podwyższonym pH.

---

## **3. Przetwórstwo Mleczne: Masło, Twaróg, Ricotta i Brunost**

### **Sprzeczność S-06: Zmaślanie śmietanki — temperatura i stopień ukwaszenia**
* **Problem w źródłach:** Częsty błąd: zmaślanie śmietanki zbyt ciepłej (>16°C) powoduje upłynnienie tłuszczu, mazistą strukturę, brak wyraźnego oddzielenia ziaren masła od maślanki oraz ucieczkę tłuszczu do maślanki (niską wydajność). Ze śmietanki zbyt zimnej (<8°C) czas ubijania wydłuża się do godzin.
* **Rozstrzygnięcie badawcze:** Optymalne okno zmaślania to 10–13°C (latem 10–12°C, zimą 12–14°C z uwagi na proporcję kwasów tłuszczowych nasyconych do nienasyconych w paszy). Zmaślanie śmietanki ukwaszonej mezofilnymi kulturami LD (*Lactococcus lactis subsp. diacetylactis* i *Leuconostoc*) daje tradycyjne, aromatyczne masło rzemieślnicze (cultured butter) o trwalszej strukturze i niższym pH.
* **Zasada w SEROWAR (RD-27):** Asystent masielnictwa kontroluje temperaturę wsadu i monitoruje fazy inwersji emulsji O/W -> W/O.

### **Sprzeczność S-07: Produkcja Ricotty z serwatki słodkiej vs kwasowej oraz dodatek mleka**
* **Problem w źródłach:** Próba zrobienia ricotty z serwatki po twarogu kwasowym (pH < 4.6) bez odkwaszenia lub próba wytrącenia białek serwatkowych w temperaturze < 80°C.
* **Rozstrzygnięcie badawcze:** Białka serwatkowe ($eta$-laktoglobulina, $lpha$-laktoalbumina) denaturują w wysokiej temperaturze ($85-92^\circ C$) pod warunkiem optymalnego pH ($5.8-6.1$). Serwatka słodka podpuszczkowa ma pH ok. 6.2–6.4 i wymaga lekkiego dokwaszenia kwasem cytrynowym/octowym lub odrobiną kwaśnej serwatki przy $85^\circ C$. Czysta serwatka daje delikatną ricottę, a dodatek 5–10% mleka pełnego radykalnie zwiększa wydajność i kremowość.
* **Zasada w SEROWAR (RD-28):** Precyzyjne sterowanie kwasowością i temperaturą termicznej denaturacji serwatki.

### **Sprzeczność S-08: Norweski Brunost / Mysost — karmelizacja vs przypalenie laktozy**
* **Problem w źródłach:** Gwałtowne gotowanie odparowujące na dużym ogniu powoduje przypalenie dna, gorzki smak i grudkowatą krystalizację laktozy.
* **Rozstrzygnięcie badawcze:** Odparowanie 80–90% wody z serwatki w temperaturze wrzenia, dodatek śmietanki, a następnie intensywne mieszanie w $100-105^\circ C$, gdzie reakcja Maillarda nadaje charakterystyczny bursztynowo-brązowy kolor i toffi/karmelowy posmak. Bardzo szybkie schładzanie z ciągłym mieszaniem zapobiega powstawaniu wyczuwalnych ziaren laktozy (tzw. "piaszczystość").
* **Zasada w SEROWAR (RD-29):** Kalkulator odparowania suchej masy serwatki i profil termiczny karmelizacji.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: A1_rozdz_1_3_Wizja_Problem_Persony.md -->
<!-- ========================================== -->

# **SEROWAR BRD 0.1 — Część A: Wizja, Problem, Persony (Rozdziały 1–3)**

> **Ekosystem:** Apps4Brew Studio | **Projekt:** SEROWAR (Rzemieślnicze Przetwórstwo Mleka / Artisan Cheese & Dairy Craft)  
> **Status:** Wersja robocza 0.1 gotowa do wdrożenia.

---

## **Rozdział 1. Wizja i Tożsamość Produktu**

### **1.1 Wizja (jeden akapit)**
**SEROWAR** to profesjonalny, kieszonkowy asystent domowego i zagrodowego przetwórstwa mleka, który zdejmuje z rzemieślnika niepewność skomplikowanych procesów biochemicznych, enzymatycznych i termicznych. Zamienia chaotyczne notatki i zawodną pamięć w deterministyczny, naukowo precyzyjny system: przelicza dawki chymozyny w międzynarodowych jednostkach IMCU i odmierza dynamiczne punkty flokulacji skrzepu, czuwa nad mikroklimatem dojrzewalni serów przez setki dni leżakowania krążków (Cave Log), prowadzi przez delikatną synerezę tradycyjnego twarogu klinkowego, asystuje przy zmaślaniu śmietanki i klarowaniu ghee oraz zamyka obieg surowca poprzez wytwarzanie kremowej Ricotty i karmelowego norweskiego Brunostu. Działa w 100% Offline-First, bez logowania, bez serwera i telemetrii, w 35 językach, z poszanowaniem suwerenności danych użytkownika.

**Obietnica marki (do App Store):**  
*„Mistrzowskie sery, idealne masło i rzemieślniczy nabiał — pełna kontrola nad mlekiem w Twoich rękach.”*

### **1.2 Zasady Produktu (ZP-01…ZP-16, nienegocjowalne)**

| Nr | Nazwa zasady | Definicja i uzasadnienie architektoniczne |
| :--- | :--- | :--- |
| **ZP-01** | **100% Offline-First** | Wszystkie obliczenia enzymatyczne, krzywe flokulacji, bazy kultur, kalkulatory solanek, profile zmaślania i harmonogramy Cave Log działają całkowicie bez dostępu do sieci internetowej. Piwnice serowe, chłodnie i wiejskie serowarnie często nie mają zasięgu GSM. |
| **ZP-02** | **Zero Konta i Rejestracji** | Aplikacja uruchamia się bezpośrednio do stanu roboczego. Żadnych ekranów rejestracji, logowania przez Apple/Google, pytań profilowych ani zbędnych barier wejścia. |
| **ZP-03** | **Zero Telemetrii ("Data Not Collected")** | Brak zewnętrznych SDK analitycznych (Firebase, Mixpanel, Amplitude). Czysta karta prywatności w App Store Privacy Manifest. Dane partii i dojrzewalni należą wyłącznie do użytkownika. |
| **ZP-04** | **Determinizm Matematyczny i Biochemiczny** | Wzory dawek podpuszczki, stężeń solanek, bilansu tłuszczu masła, punktu izoelektrycznego kazeiny i kinetyki fermentacji są deterministycznymi funkcjami matematycznymi, w 100% testowanymi wektorami w Jest/CI. Zero generatywnych halucynacji AI w kalkulatorach technologii żywności. |
| **ZP-05** | **Bezpieczeństwo Danych i Trwałość (Zero Data Loss)** | Relacyjna baza SQLite w trybie WAL. Automatyczny backup rotacyjny (10 kopii JSON) przy każdej modyfikacji partii. Eksport i import bazy są bezpłatne i dostępne zawsze. |
| **ZP-06** | **Czysta Ekonomia ("Tańsze niż espresso")** | Brak reklam, brak walut wirtualnych. Przejrzysty darmowy rdzeń narzędziowy + opcjonalny zakup dożywotni (Lifetime 14,99 € / 59,99 zł) lub mikroskopijna subskrypcja (0,99 € / 3,99 zł mies.). |
| **ZP-07** | **Hands-Free & Ergonomia Kuchni** | Projekt interakcji dostosowany do pracy w fartuchu serowarskim: duże cele dotykowe (min. 48x48 pt), wsparcie Apple Watch i Garmin, głośne powiadomienia dźwiękowe timera (`expo-av`), Live Activity na zablokowanym ekranie. |
| **ZP-08** | **Barierowe Bezpieczeństwo Sanitarne** | Rygorystyczne egzekwowanie barier biologicznych: higiena mleka surowego, kwasowość pI 4.6, zasolenie minimalne solanki 16% (ochrona przed patogenami), limity $CaCl_2$. Aplikacja ostrzega przed ryzykiem zepsucia surowca. |
| **ZP-09** | **Prymat Jakości Mleka i Surowca** | Precyzyjne rozróżnienie gatunków mleka (krowie, kozie, owcze, bawole) oraz jego obróbki (surowe zagrodowe, pasteryzowane niskotemperaturowo, sklepowe). Twarda blokada prób użycia mleka UHT do serów podpuszczkowych z natychmiastowym wyjaśnieniem naukowym. |
| **ZP-10** | **Dostępność jako Fundament (WCAG AAA / VoiceOver)** | Pełne etykiety dostępności, obsługa powiększonego tekstu Dynamic Type, wysoki kontrast kolorystyczny, brak polegania wyłącznie na barwie wskaźników. |
| **ZP-11** | **Wierność Rzemiosłu i Tradycji** | Nazewnictwo zgodne z profesjonalnym słownictwem serowarskim i mleczarskim (skrzep, gęstwa, synereza, harfa, IMCU, affinage, brevibacterium, klinek, zmaślanie, inwersja emulsji, ghee, ricotta, brunost). |
| **ZP-12** | **Wizualna Elegancja Rzemieślnicza** | Paleta barw inspirowana naturą nabiału: *Linen & Whey* (len, ciepła serwatka, kremowe masło, wosk pszczeli, terakota dojrzewalni). Zgodność z Apple Human Interface Guidelines. |
| **ZP-13** | **Globalna Lokalizacja (35 języków)** | Pełna dwukierunkowa obsługa systemów metrycznych i imperialnych (litry/galony, gramy/funty/uncje, °C/°F, gęstość Baumé/Salometer). Wszystkie teksty przez `t()` bez hardkodowanych literałów. |
| **ZP-14** | **Niezależność od Zewnętrznych Serwerów Chmurowych** | Zerowy koszt utrzymania infrastruktury po stronie twórcy (0 zł poza opłatą deweloperską Apple). Aplikacja jest całkowicie samowystarczalna na urządzeniu. |
| **ZP-15** | **Wsparcie Sprzętowe BLE bez Vendor-Lockin** | Otwarty skaner broadcastu Bluetooth LE dla standardowych czujników środowiskowych (RuuviTag, Xiaomi Mijia) bez wymagania chmury producenta. |
| **ZP-16** | **Przejrzystość Edukacyjna** | Każde zalecenie, przelicznik, temperatura i czas w aplikacji posiada zwięzłe uzasadnienie naukowe („dlaczego tak?”) dostępne pod jednym tapnięciem. |

---

## **Rozdział 2. Analiza Problemu i Dowody Rynkowe**

### **2.1 Rzeczywisty problem serowara i wytwórcy nabiału**
Wytwarzanie serów podpuszczkowych, twarogów klinkowych i rzemieślniczego masła to najbardziej wymagające dziedziny domowego przetwórstwa. W odróżnieniu od gotowania obiadu, **błąd popełniony w pierwszych 30 minutach obróbki mleka ujawnia się dopiero po tygodniach lub miesiącach leżakowania sera w dojrzewalni albo skutkuje natychmiastowym zniszczeniem kosztownego surowca (20–50 litrów mleka zagrodowego)**.

Kluczowe punkty bólu (zebrane z forów serowarskich, grup rzemiosła mlecznego i recenzji):
1. **Porażka koagulacji przez błędy podpuszczki:** Użytkownicy kupują podpuszczki płynne lub w proszku o nieznanej lub różnej sile (IMCU vs 1:10 000). Dodanie podpuszczki „na oko” skutkuje kruchym, rozpadającym się skrzepem, z którego ucieka tłuszcz, albo gumowatym, gorzkim serem z nadmiaru enzymu.
2. **Pułapka mleka sklepowego:** Brak wiedzy o degradacji jonów wapnia w pasteryzacji. Bez dodania $CaCl_2$ mleko nie tworzy zwięzłego skrzepu.
3. **Zniszczenie twarogu przez przegrzanie:** Tradycyjny twaróg wymaga powolnego dogrzania skrzepu do 38–42°C. Podgrzanie do >45°C powoduje natychmiastowe stwardnienie kazeiny i powstanie suchego, kredowego twarogu; niedogrzanie (<35°C) daje mazistą papkę uciekającą przez chustę.
4. **Błędy zmaślania śmietanki:** Próba ubijania zbyt ciepłej śmietany (>16°C) upłynnia frakcję tłuszczową – ziarna masła nie chcą się zlepić, a tłuszcz ucieka do maślanki. Niedokładne wypłukanie maślanki wodą lodową prowadzi do błyskawicznego jełczenia masła w ciągu kilku dni.
5. **Marnowanie drogocennej serwatki:** Wylewanie dziesiątek litrów serwatki po serze podpuszczkowym zamiast wytworzenia delikatnej Ricotty (wytrącenie albumin w 85–90°C przy pH 5.9) lub karmelowego Brunostu.
6. **Zaniedbanie dojrzewalni (Cave Log):** Krążek sera włożony do chłodziarki/piwniczki wymaga regularnego obracania, przemywania solanką i kontroli wilgotności (80–90%). Po 2 tygodniach użytkownik zapomina o pielęgnacji, skórka wysycha i pęka, a wnętrze zasiedlają dzikie pleśnie czarne (*Mucor*).
7. **Niewłaściwa solanka i zniszczenie skórki:** Włożenie sera do solanki zrobionej bez buforu wapniowego i zakwaszenia powoduje natychmiastowe rozpuszczenie zewnętrznej warstwy białka (śluzowacenie).

---

## **Rozdział 3. Persony Użytkowników i Sytuacje Życiowe**

### **3.1 Szczegółowe Persony (P1–P8)**

* **P1: Wojciech (48 lat) — Serowar Zagrodowy Praktyk.**
  * *Profil:* Posiada małe stado kóz i kupuje mleko krowie od sąsiada (40–60L tygodniowo). Robi sery typu Gouda, Koryciński, Cheddar, Caciotta i Tomme.
  * *Ból:* Notatki na zatłuszczonych kartkach w serowarni, gubienie informacji, który krążek leży na której półce w dojrzewalni i ile tygodni ma dana partia.
  * *Cel:* Precyzyjny stoper flokulacji, harmonogram docisku prasy, rejestr leżakowania z kodami partii i alertami obracania.

* **P2: Anna (34 lata) — Domowa Wytwórczyni Nabiału i Masła.**
  * *Profil:* Gotuje w domu dla rodziny, kupuje mleko prosto ze wsi. Robi tradycyjny twaróg klinkowy, zmaśla wiejską śmietanę na masło i wytapia złociste ghee, robi domowy jogurt grecki i kefir.
  * *Ból:* Nierówne rezultaty – czasem twaróg wychodzi za twardy, a masło zjełczało po tygodniu przez niedokładne wypłukanie maślanki.
  * *Cel:* Precyzyjny przewodnik dogrzewania twarogu (38–42°C), asystent zmaślania z oknem temperaturowym (10–13°C) i kalkulator odzysku serwatki na ricottę.

* **P3: Piotr (41 lat) — Eksperymentator Affinage i Stylów Tradycyjnych.**
  * *Profil:* Zaadaptował winiarkę na profesjonalną komorę dojrzewalniczą z regulatorem wilgotności. Dojrzewa sery maziowe (*Brevibacterium linens*), pleśniowe (Camembert, Gorgonzola) oraz warzy norweski serwatkowy Brunost.
  * *Ból:* Skomplikowany kalendarz przemywania maziowego i nakłuwania igłami, ryzyko przypalenia laktozy podczas karmelizacji serwatki na Brunost.
  * *Cel:* Cave Log z integracją sensora BLE, obliczaniem punktu rosy (VPD) oraz kalkulator odparowania suchej masy serwatki.

* **P4: Maria (64 lata) — Seniorka Tradycyjnego Mleczarstwa.**
  * *Profil:* Od dziesięcioleci robi biały ser ze zsiadłego mleka i prosty ser podpuszczkowy.
  * *Ból:* Trudności z odczytaniem małych liter na ekranie smartfona, skomplikowane aplikacje wymagające haseł.
  * *Cel:* Bardzo duży, czytelny interfejs (Dynamic Type), kalkulator przeliczający „ile kropli podpuszczki na 12 litrów mleka” bez logowania.

* **P5: Paweł (28 lat) — Entuzjasta Zero-Waste i Rzemiosła.**
  * *Profil:* Chce maksymalnie wykorzystać każdy litr surowca: ze śmietanki masło i maślanka, ze skrzepu ser podpuszczkowy, a z serwatki ricotta i brunost.
  * *Ból:* Brak wiedzy o równowadze kwasowo-termicznej niezbędnej do koagulacji albumin serwatkowych.
  * *Cel:* Zamknięty obieg serwatki (Zero-Waste Whey Loop) z dokładnymi formułami pH i temperatury.

* **P6: Tomasz (39 lat) — Serowar w Rzemieślniczym Handlu Rolniczym (RHD).**
  * *Profil:* Wytwarza sery na sprzedaż na jarmarkach ekologicznych.
  * *Ból:* Konieczność wyliczania kosztu partii, wydajności serowej (% yield) oraz drukowania etykiet z datami i składem.
  * *Cel:* Kalkulator kosztu jednostkowego krążka sera i kostki masła, generator etykiet PDF z kodami QR.

* **P7: Marek (36 lat) — Niewidomy Użytkownik Korzystający z VoiceOver.**
  * *Profil:* Pasjonat gotowania i serowarstwa, w pełni zależny od technologii asystujących.
  * *Cel:* 100% dostępność semantyczna WCAG AAA, logiczne etykiety wszystkich stoperów i kalkulatorów.

* **P8: Praktyk w Serowarni — Ręce w Serwatce (Hands-Free User).**
  * *Profil:* Serowar podczas udoju, zaprawiania mleka i formowania skrzepu o mokrych dłoniach.
  * *Cel:* Sterowanie stoperem flokulacji i odliczaniem z poziomu Apple Watch, Live Activity na ekranie blokady, duże przyciski w strefie kciuka.

---

## **Rozdział 3.2 Sytuacje Życiowe (SYT-01…SYT-15)**
* **SYT-01 (Mleko w garnku):** Garnek 20L z mlekiem podgrzewa się na kuchence. Serowar o mokrych rękach sprawdza dawkę kultur termofilnych i podpuszczki IMCU.
* **SYT-02 (Czekanie na flokulację):** Miseczka unosi się na powierzchni zaprawionego mleka. Użytkownik delikatnie ją popycha, czekając na opór zżelowanego płynu, aby wcisnąć stoper jednym stuknięciem na Apple Watch.
* **SYT-03 (Cięcie i dogrzewanie):** Skrzep pocięty harfą serowarską na ziarno wielkości kukurydzy. Aplikacja odmierza czas osadzania (5 min) i prowadzi przez rampę dogrzewania (max 1°C na 2 minuty).
* **SYT-04 (Prasa serowarska):** Krążek w chuście serowarskiej trafia pod prasę. Aplikacja wyznacza 4 etapy nacisku (od 0.5 do 3.0 kg/cm²) z przypomnieniami o odwróceniu krążka.
* **SYT-05 (Wyjmowanie z solanki w nocy):** Krążek leży w solance 20%. Czas upływa o 23:40. Aplikacja wysyła powiadomienie dźwiękowe, by ser nie uległ przesoleniu.
* **SYT-06 (Kontrola jaskini dojrzewalniczej):** Użytkownik schodzi do piwnicy. Aplikacja pobiera przez BLE odczyt: 12.2°C, 88% RH. Wyświetla listę: krążek #12 obrócić, krążek #09 przemyć solanką maziową.
* **SYT-07 (Dogrzewanie tradycyjnego twarogu):** Zsiadłe mleko w garnku podgrzewa się na małym ogniu. Aplikacja pilnuje okna 38–42°C, zapobiegając przegrzaniu kazeiny.
* **SYT-08 (Odsączanie klinka w chuście):** Skrzep twarogowy wlany do chusty serowarskiej zawieszonej na kiju. Stoper odmierza 2 godziny grawitacyjnego odcieku serwatki.
* **SYT-09 (Zmaślanie śmietanki wiejskiej):** Schłodzona do 11°C śmietana 36% trafia do masielnicy. Aplikacja prowadzi przez fazę inwersji emulsji (pojawienie się ziaren masła i maślanki).
* **SYT-10 (Płukanie i wyciskanie masła):** Ziarna masła zalane wodą lodową (<5°C). Aplikacja przypomina o trzykrotnym płukaniu i ugnieceniu masła na bukowej desce serowarskiej w celu usunięcia resztek maślanki.
* **SYT-11 (Wytapianie czystego ghee):** Masło topi się w garnku z grubym dnem. Aplikacja instruuje, jak utrzymać temperaturę 100–105°C, odparować wodę i skarmelizować kazeinę bez jej przypalenia.
* **SYT-12 (Odzysk serwatki na Ricottę):** Gorąca słodka serwatka po serze podpuszczkowym podgrzewana do 88°C. Aplikacja podaje dawkę kwasu cytrynowego do korekty pH (5.9) w celu ścięcia albumin.
* **SYT-13 (Karmelizacja serwatki na Brunost):** Serwatka gotuje się przez kilka godzin. Aplikacja wylicza zagęszczenie suchej masy z 6% do 80% i przypomina o dodaniu śmietanki i intensywnym chłodzeniu z mieszaniem.
* **SYT-14 (Kalkulacja kosztu partii dla RHD):** Wytwórca zagrodowy wycenia krążek sera 1.5 kg i kostkę masła 200 g. Aplikacja sumuje koszty surowców i energii, podając czysty zysk.
* **SYT-15 (Głosowe sterowanie VoiceOver):** Niewidomy serowar przy użyciu gestów VoiceOver sprawdza odliczanie timera dogrzewania skrzepu bez patrzenia na ekran.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: A2_rozdz_4_6_1_Rynek_Przychod_Zakres.md -->
<!-- ========================================== -->

# **SEROWAR BRD 0.1 — Część A: Rynek, Model Przychodu i Zakres (Rozdziały 4–6.1)**

> **Ekosystem:** Apps4Brew Studio | **Projekt:** SEROWAR (Rzemieślnicze Przetwórstwo Mleka)

---

## **Rozdział 4. Analiza Rynku i Konkurencji**

### **4.1 Wielkość rynku i trendy kulturowe**
Rynek rzemieślniczego przetwórstwa mleka, serowarstwa zagrodowego i domowej produkcji nabiału przeżywa renesans napędzany przez trzy globalne megatrendy:
1. **Renesans tradycyjnego przetwórstwa nabiału (Artisan Dairy & Homesteading):** Gwałtowny wzrost cen masła, serów dojrzałych i twarogów w delikatesach sprawia, że konsumenci poszukują prawdziwego smaku nieprzemysłowego mleka i inwestują w mały sprzęt serowarski.
2. **Rolniczy Handel Detaliczny (RHD) i mikromleczarnie:** W Polsce, Francji, Włoszech i całej Europie rozwija się ruch małych przetwórców wiejskich przetwarzających mleko bezpośrednio w gospodarstwach (sery korycińskie, kozie goudy, bundz, oscypek, masło z maślanek).
3. **Świadomość surowca i czysta etykieta (Clean Label):** Konsumenci odrzucają nabiał ze skrobią modyfikowaną, tłuszczem palmowym i zagęszczaczami na rzecz autentycznego twarogu ze zsiadłego mleka, masła ze śmietany ukwaszonej i czystego ghee.

* **Dane rynkowe (Globalne):** Społeczności takie jak r/cheesemaking (ponad 110 tys. członków), r/homestead (ponad 2.8 mln członków) wykazują stały napływ hobbystów poszukujących rzetelnej wiedzy technologicznej.
* **Dane rynkowe (Polska i CEE):** Polska jest 4. producentem mleka w UE, z potężną tradycją twarogów klinkowych, serów zagrodowych i maślanki. Rynek bezpośredniej sprzedaży mleka i serowarstwa domowego liczy ponad 150 tys. aktywnych praktyków.

### **4.2 Analiza obecnych rozwiązań i luki rynkowej**
Analiza oferty w App Store i Google Play wykazuje całkowitą lukę w kategorii dedykowanych narzędzi mleczarskich:
* **Brak dedykowanych aplikacji serowarskich:** Dostępne kalkulatory to archaiczne arkusze Excela lub prymitywne strony www z lat 2005–2010.
* **Brak cyfrowego dziennika dojrzewania (Cave Log):** Nie istnieje na rynku żadna nowoczesna, natywna aplikacja iOS pozwalająca na profesjonalne zarządzanie leżakowaniem serów, harmonogramami przemywania maziowego i monitoringiem mikroklimatu.
* **Brak narzędzi dla masielnictwa i obiegu serwatki:** Żadna aplikacja na świecie nie łączy kalkulatora podpuszczki z technologią zmaślania śmietany, koagulacją twarogu oraz odzyskiem serwatki na Ricottę i Brunost.
* **Przeładowanie reklamami i wymuszone logowanie:** Typowe aplikacje kulinarne wymagają rejestracji i śledzą użytkowników.

**Wniosek strategiczny SEROWAR:** Stworzenie bezkonkurencyjnego, deterministycznego, bezserwerowego asystenta mleczarskiego o niezrównanej jakości inżynieryjnej.

---

## **Rozdział 5. Model Przychodu i Ekonomia Projektu**

### **5.1 Półka cenowa i struktura opłat**
Zgodnie ze standardem studia Apps4Brew:
* **Darmowy Rdzeń Narzędziowy (Free Tier):**
  * Kalkulator mleka, podpuszczki IMCU i kultur starterowych.
  * Stoper flokulacji i timer obróbki skrzepu.
  * Podstawowy kalkulator twarogu i zmaślania śmietanki.
  * Cave Log z limitem do 3 aktywnych krążków w leżakowaniu.
  * Dostęp do bazy wiedzy podstawowej.

* **Wersja Pełna (SEROWAR PRO — Lifetime & Subskrypcja):**
  * Nielimitowany Cave Log i ewidencja partii (dziesiątki krążków).
  * Zaawansowany asystent przemywania maziowego i pleśni szlachetnych.
  * Moduł zamkniętego obiegu serwatki (karmelizacja Brunost i termiczna Ricotta).
  * Bezpośrednia integracja z bezprzewodowymi czujnikami BLE (RuuviTag, Mijia).
  * Wydruk etykiet i paszportów krążków PDF z kodami QR (`expo-print`).
  * Asystent Apple Watch & Live Activity ("ręce w serwatce").
  * Diagnostyk wad sera, masła i mleka (Cheese & Dairy Doctor).

| Opcja zakupu | Cena EUR | Cena PLN | Charakterystyka |
| :--- | :--- | :--- | :--- |
| **Miesięczna** | 0,99 € | 3,99 zł | Dla osób robiących ser sezonowo (wiosna/lato). |
| **Roczna** | 4,99 € | 19,99 zł | Dla regularnych domowych serowarów i mleczarzy. |
| **Dożywotnia (Lifetime)** | 14,99 € | 59,99 zł | Jednorazowa opłata na zawsze. Najchętniej wybierana w rzemiośle. |

### **5.2 Rachunek zwrotu kosztów stałych (Apple Developer 99 USD)**
Aplikacja generuje **0 zł kosztów zmiennych** (brak chmury, brak zewnętrznych API). Jedynym kosztem stałym jest roczna opłata deweloperska Apple (99 USD ≈ 395 zł netto).
* Przy zakupie Lifetime (59,99 zł brutto → ok. 40,65 zł netto dla twórcy): **wystarczy 10 zakupów dożywotnich rocznie**, aby w pełni sfinansować konto Apple.
* Przy subskrypcji rocznej (19,99 zł brutto → ok. 13,55 zł netto): **wystarczy 29 subskrypcji rocznych**.
Każdy kolejny zakup stanowi czysty zysk studia.

---

## **Rozdział 6. Zakres Funkcjonalny i Granice Systemu (6.1)**

### **6.1 Co aplikacja robi, a czego NIE robi (Granice systemu)**

* **Co SEROWAR robi:**
  1. Wylicza precyzyjne dawki podpuszczki IMCU, kultur DVI, chlorku wapnia i soli w oparciu o parametry surowca mlecznego.
  2. Prowadzi użytkownika krok po kroku przez koagulację, stoper flokulacji, cięcie skrzepu harfą, rampę dogrzewania gęstwy i prasowanie.
  3. Rejestruje proces dojrzewania w jaskini serowej (Cave Log), wysyła powiadomienia o obracaniu, przemywaniu maziowym i pielęgnacji skórki.
  4. Nadzoruje kwasową koagulację twarogu (pI 4.6), dogrzewanie skrzepu kwasowego i ociekanie w chuście serowarskiej.
  5. Prowadzi proces zmaślania śmietanki w optymalnej temperaturze (10–14°C), płukania wodą lodową i wytapiania ghee.
  6. Prowadzi procesy fermentacji mlekowej jogurtu i tradycyjnego kefiru oraz odzysku serwatki na Ricottę i Brunost.
  7. Ewidencjonuje surowce w spiżarni z automatycznym odpisywaniem zużytych ilości i generuje etykiety PDF z kodami QR.

* **Czego SEROWAR NIE robi (Czarne granice):**
  1. **Nie obsługuje produktów niemlecznych:** Zgodnie z decyzjami DEC-BA-01 i DEC-BA-02 z aplikacji trwale usunięto fermentację warzywną, kombuchę i octy.
  2. **Nie steruje przekaźnikami sprzętowymi (SCADA/IoT):** Nie włącza fizycznych grzałek ani kompresorów chłodniczych.
  3. **Nie udziela porad medycznych ani dietetycznych:** Nie diagnozuje chorób układu pokarmowego.
  4. **Nie zawiera funkcji społecznościowych w chmurze:** Brak publicznych profili, forów i lajków.
  5. **Nie przechowuje danych użytkownika na serwerach zewnętrznych:** Całość bazy spoczywa w lokalnym SQLite na urządzeniu.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: A3a_rozdz_6_2_Tabela_zakresu_cz1.md -->
<!-- ========================================== -->

# **SEROWAR BRD 0.1 — Tabela Zakresu: Część 1 (Serowarstwo Podpuszczkowe i Cave Log)**

Tabela definiuje 120 wymagań obszaru serowarskiego z przypisanymi identyfikatorami Z-001…Z-120 oraz etapami wdrożenia (**MVP / 1.1 / 1.2 / 2.x / Badanie / Nigdy**).

| ID | Moduł | Funkcjonalność / Wymaganie | Priorytet | Etap |
| :--- | :--- | :--- | :--- | :--- |
| **Z-001** | Kalkulator Mleka | Wybór gatunku mleka: krowie, kozie, owcze, bawole z domyślnym profilem tłuszcz/białko | MUST | MVP |
| **Z-002** | Kalkulator Mleka | Wybór obróbki termicznej: surowe zagrodowe, pasteryzowane niskotemperaturowo (LTLT/HTST), sklepowe mikrofiltrowane | MUST | MVP |
| **Z-003** | Kalkulator Mleka | Twarda blokada wyboru mleka UHT z natychmiastowym komunikatem edukacyjnym o denaturacji miceli | MUST | MVP |
| **Z-004** | Kalkulator Wapnia | Obliczanie dawki chlorku wapnia ($CaCl_2$) w proszku bezwodnym (g) lub w roztworze płynnym 33% (ml) | MUST | MVP |
| **Z-005** | Kalkulator Kultur | Baza kultur starterowych: Mezofilne (typ O, typ LD), Termofilne (typ T, typ jogurtowy/włoski) | MUST | MVP |
| **Z-006** | Kalkulator Kultur | Przeliczanie dawek kultur DVI (Direct Vat Inoculation) na litry mleka wg specyfikacji producenta | MUST | MVP |
| **Z-007** | Kalkulator Kultur | Asystent rotacji szczepów mezofilnych w celu zapobiegania atakom bakteriofagów | SHOULD | 1.1 |
| **Z-008** | Kalkulator Podpuszczki | Konwerter jednostek siły podpuszczki: IMCU/ml, IMCU/g, tradycyjna skala 1:X (np. 1:10 000) | MUST | MVP |
| **Z-009** | Kalkulator Podpuszczki | Obliczanie dokładnej objętości (ml lub krople) / wagi podpuszczki dla zadanej objętości mleka | MUST | MVP |
| **Z-010** | Kalkulator Podpuszczki | Instrukcja rozcieńczania podpuszczki w niechlorowanej, chłodnej wodzie (10x objętość) przed zadaniem | MUST | MVP |
| **Z-011** | Koagulacja i Flokulacja | Interaktywny stoper flokulacji (metoda wirującej miseczki Berridge'a) z rejestracją punktu $t_f$ | MUST | MVP |
| **Z-012** | Koagulacja i Flokulacja | Kalkulator całkowitego czasu koagulacji oparty o współczynnik flokulacji $M$ ($t_{cut} = t_f \times M$) | MUST | MVP |
| **Z-013** | Koagulacja i Flokulacja | Baza sugerowanych mnożników flokulacji dla stylów serów (alpejskie 2.0x, gouda 3.0x, camembert 5.0x) | MUST | MVP |
| **Z-014** | Koagulacja i Flokulacja | Test „czystego złomu” (Clean Break Test) — przewodnik sensoryczny z weryfikacją przezierności serwatki | MUST | MVP |
| **Z-015** | Obróbka Skrzepu | Wybór docelowego rozmiaru ziarna skrzepu (orzech włoski, kukurydza, groch, ziarno pszenicy) | MUST | MVP |
| **Z-016** | Obróbka Skrzepu | Stoper odpoczynku skrzepu po cięciu (5–10 min) przed rozpoczęciem mieszania | MUST | MVP |
| **Z-017** | Dogrzewanie Gęstwy | Asystent rampy temperaturowej dogrzewania (limit max 1°C na 2 minuty zapobiegający zeszkleniu ziarna) | MUST | MVP |
| **Z-018** | Przemywanie Gęstwy | Kalkulator odlewania serwatki i dolewania gorącej wody dla serów płukanych (Gouda, Edam) | MUST | MVP |
| **Z-019** | Prasowanie Sera | Kalkulator nacisku prasy: przeliczanie masy obciążników (kg) na realny nacisk powierzchniowy ($kg/cm^2$ i PSI) | MUST | MVP |
| **Z-020** | Prasowanie Sera | Harmonogram etapów prasowania (np. 15 min 0.5 kg/cm², 30 min 1.0 kg/cm², 2h 2.0 kg/cm², 12h 3.0 kg/cm²) | MUST | MVP |
| **Z-021** | Prasowanie Sera | Przypomnienia o odwracaniu sera w formie i wyrównywaniu chusty serowarskiej | MUST | MVP |
| **Z-022** | Kąpiel Solankowa | Kalkulator nasyconej solanki serowarskiej: woda, sól (18–22%), $CaCl_2$ (0.1–0.2%) i regulacja pH (5.2–5.4) | MUST | MVP |
| **Z-023** | Kąpiel Solankowa | Wyliczanie czasu kąpieli w solance na podstawie wagi krążka (godziny na kg) i geometrii (grubość/średnica) | MUST | MVP |
| **Z-024** | Kąpiel Solankowa | Przypomnienie o połowicznym obrocie pływającego krążka w solance w połowie czasu kąpieli | MUST | MVP |
| **Z-025** | Solenie z Ręki | Kalkulator solenia na sucho (1.5–2.5% masy sera) z podziałem na aplikacje wielodniowe | MUST | MVP |
| **Z-026** | Cave Log: Kartoteka | Rejestracja nowego krążka sera: numer partii, styl, waga początkowa, data solenia, przewidywany wiek | MUST | MVP |
| **Z-027** | Cave Log: Mikroklimat | Zapisywanie pomiarów temperatury (°C) i wilgotności względnej (% RH) dojrzewalni | MUST | MVP |
| **Z-028** | Cave Log: Pielęgnacja | Harmonogram obracania krążków (początkowo codziennie, potem 2x w tygodniu, potem 1x w tygodniu) | MUST | MVP |
| **Z-029** | Cave Log: Skórka Maziowa | Protokół pielęgnacji Brevibacterium linens (przemywanie roztworem solankowym z drożdżami) | SHOULD | MVP |
| **Z-030** | Cave Log: Sery Pleśniowe | Protokół dojrzewania Penicillium camemberti/candidum (kontrola aksamitnego porostu białego) | SHOULD | MVP |
| **Z-031** | Cave Log: Sery Niebieskie | Harmonogram nakłuwania igłami stalowymi (piercing) dla dopływu tlenu do Penicillium roqueforti | SHOULD | MVP |
| **Z-032** | Cave Log: Zabezpieczanie | Rejestracja zabiegów zabezpieczających: woskowanie parafiną serowarską, powłoka polioctanowa, olej lniany | MUST | MVP |
| **Z-033** | Cave Log: Ubytek Wagi | Śledzenie kurczenia się krążka (% shrinkage) w czasie leżakowania wraz z wykresem dynamiki | MUST | MVP |
| **Z-034** | Cave Log: Alerty | Alert wysuszenia skórki (RH < 80%) oraz alert ryzyka kondensacji kropelkowej (punkt rosy) | MUST | MVP |
| **Z-035** | Dojrzewanie Propionowe | Protokół komory cieplnej dla serów szwajcarskich (20–24°C przez 3–4 tygodnie na rozwój oczek CO2) | COULD | 1.1 |
| **Z-036…Z-120** | Pozostałe Serowarstwo | Dalsze szczegółowe reguły serowarstwa zagrodowego (opisane szczegółowo w modułach B1–B4) | SHOULD | MVP/1.1 |

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: A3b_rozdz_6_2_Tabela_zakresu_cz2.md -->
<!-- ========================================== -->

# **SEROWAR BRD 0.1 — Tabela Zakresu: Część 2 (Twarogi, Masło, Napoje Mleczne, Serwatka, Platforma)**

Tabela definiuje 120 wymagań obszaru przetwórstwa mlecznego, masielnictwa, obiegu serwatki i platformy (Z-121…Z-240).

| ID | Moduł | Funkcjonalność / Wymaganie | Priorytet | Etap |
| :--- | :--- | :--- | :--- | :--- |
| **Z-121** | Twarogi Klinkowe | Monitor kwasowej koagulacji kazeiny do punktu izoelektrycznego ($pH = 4.6$) | MUST | MVP |
| **Z-122** | Twarogi Klinkowe | Asystent rampy dogrzewania skrzepu twarogowego w oknie 35–45°C z zabezpieczeniem przed przegrzaniem | MUST | MVP |
| **Z-123** | Twarogi Klinkowe | Stoper grawitacyjnego odcieku serwatki w chuście klinkowej z wyliczaniem wilgotności końcowej | MUST | MVP |
| **Z-124** | Sery Świeże | Moduł Labneh — odsączanie jogurtu w worku, ubytek serwatki (50–60%), kulki w oliwie ziołowej | MUST | MVP |
| **Z-125** | Sery Świeże | Paneer & Chhena — termiczno-kwasowa koagulacja gorącego mleka (82–88°C) kwasem cytrynowym/serwatką | MUST | MVP |
| **Z-126** | Sery Świeże | Queso Blanco & sery do smażenia / grillowania — wysoka termoodporność dzięki brakowi kwaszenia | MUST | MVP |
| **Z-127** | Masielnictwo | Kalkulator zmaślania śmietanki: bilans tłuszczowy (30%, 36%, 42%) i wyliczanie wydajności masła | MUST | MVP |
| **Z-128** | Masielnictwo | Asystent okna temperaturowego śmietanki (10–14°C) z kompensacją sezonową (zima/lato) | MUST | MVP |
| **Z-129** | Masielnictwo | Monitor inwersji emulsji O/W -> W/O (faza pęcherzyków -> faza ziaren masła i maślanki) | MUST | MVP |
| **Z-130** | Masielnictwo | Asystent płukania masła wodą lodową (<6°C) i wyciskania resztek maślanki na bukowych deskach | MUST | MVP |
| **Z-131** | Masielnictwo | Masło ze śmietany ukwaszonej (Cultured Butter) — inokulacja kulturami mezofilnymi diacetylu | MUST | MVP |
| **Z-132** | Masielnictwo | Wytapianie ghee i masła klarowanego: odparowanie wody w 100–105°C, karmelizacja kazeiny, punkt dymienia 250°C | MUST | MVP |
| **Z-133** | Napoje Mleczne | Fermentacja termofilna jogurtu w 42–45°C (symbioza S. thermophilus i L. bulgaricus 1:1) | MUST | MVP |
| **Z-134** | Napoje Mleczne | Jogurt grecki — asystent odcieku serwatki do uzyskania kremowej gęstej konsystencji | MUST | MVP |
| **Z-135** | Napoje Mleczne | Rzemieślniczy kefir tradycyjny na ziarnach grzybka tybetańskiego z rotacją kultur | MUST | MVP |
| **Z-136** | Napoje Mleczne | Rzemieślnicza maślanka naturalna bogata w fosfolipidy MFGM z odzysku po zmaślaniu | MUST | MVP |
| **Z-137** | Obieg Serwatki | Ricotta rzemieślnicza: termiczna denaturacja albumin i globulin serwatkowych ($T \ge 85^\circ C$, pH 5.8–6.0) | MUST | MVP |
| **Z-138** | Obieg Serwatki | Ricotta z dodatkiem mleka pełnego (5–10%) — kalkulator podwyższonej wydajności i kremowości | MUST | MVP |
| **Z-139** | Obieg Serwatki | Norweski Brunost / Mysost: odparowanie wody z serwatki (sucha masa z 6% do 80%) w 102–105°C | MUST | MVP |
| **Z-140** | Obieg Serwatki | Brunost: asystent dodatku śmietanki, reakcji Maillarda i szybkiego chłodzenia przeciw piaszczystości | MUST | MVP |
| **Z-141** | Spiżarnia | Kartoteka surowców mlecznych: mleko (krowa, koza, owca), śmietanka, kultury DVI, podpuszczki, sól, CaCl2 | MUST | MVP |
| **Z-142** | Spiżarnia | Automatyczne odliczanie zużytych surowców z magazynu po zatwierdzeniu sesji serowarskiej | MUST | MVP |
| **Z-143** | Paszporty i Etykiety | Generator etykiet PDF (`expo-print`) na krążki sera i osełki masła z kodem QR partii | MUST | MVP |
| **Z-144** | Skaner Kodów QR | Skaner aparatu (`expo-camera`) do natychmiastowego odczytu paszportu partii w dojrzewalni | MUST | MVP |
| **Z-145** | Kalkulator Kosztów | Kalkulator kosztu jednostkowego: surowce + energia chłodzenia/grzania na kg sera lub kostkę masła | MUST | MVP |
| **Z-146** | Kalkulator Uzysku | Wyliczanie wydajności serowarskiej (% Cheese Yield = waga sera / waga mleka * 100%) | MUST | MVP |
| **Z-147** | Apple Watch | Podgląd aktywnych timerów flokulacji, obracania form i dogrzewania skrzepu na zegarku | SHOULD | MVP |
| **Z-148** | Apple Watch | Odznaczanie czynności pielęgnacyjnej (np. „obrócono krążek”) bezpośrednio z nadgarstka | SHOULD | MVP |
| **Z-149** | Live Activity | Widget Dynamic Island i ekranu blokady z odliczaniem flokulacji i faz prasowania | MUST | MVP |
| **Z-150** | Czujniki BLE | Moduł skanera pakietów BLE Manufacturer Data dla czujników RuuviTag i Xiaomi Mijia BLE | COULD | 1.1 |
| **Z-151** | Radar Sensoryczny | Wektorowy radar smaku i tekstury sera SVG: kwasowość, słoność, twardość, maślanowość, umami | SHOULD | MVP |
| **Z-152** | Dostępność | Pełne wsparcie Apple VoiceOver na wszystkich 100% ekranów i kalkulatorów | MUST | MVP |
| **Z-153** | Eksport Danych | Eksport bazy do bezpiecznego pliku JSON oraz tabelaryczny eksport partii do CSV | MUST | MVP |
| **Z-154…Z-240** | Dalsze Wymagania | Wymagania niefunkcjonalne, lokalizacyjne, testowe i platformowe (moduły B5–B8, D1–D4) | MUST/SHOULD| MVP/1.1 |

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: A3c_Etapy_Naklad_Warianty.md -->
<!-- ========================================== -->

# **SEROWAR BRD 0.1 — Część A: Etapy Wdrożenia, Nakład Pracy i Warianty (Rozdziały 6.3–6.5)**

> **Ekosystem:** Apps4Brew Studio | **Projekt:** SEROWAR (Rzemieślnicze Przetwórstwo Mleka)

---

## **Rozdział 6.3 Klasyfikacja Etapów Wdrożenia**

Wszystkie wymagania w rejestrze funkcjonalnym posiadają przypisany dokładnie jeden etap wdrożenia:
1. **MVP (Wersja 1.0):** Kompletny rdzeń serowarski (mleko, CaCl2, podpuszczka IMCU, stoper flokulacji, prasa, solanka, Cave Log do 3 krążków) + moduł twarogów klinkowych i serów świeżych + moduł masielnictwa i ghee + jogurt/kefir + zamknięty obieg serwatki (ricotta, brunost) + spiżarnia z auto-odpisem + Live Activity + eksport CSV/JSON.
2. **Wersja 1.1:** Bezpośrednia integracja z czujnikami BLE (RuuviTag, Mijia) + nielimitowany Cave Log w wersji Pro + asystent rotacji szczepów przeciw bakteriofagom.
3. **Wersja 1.2:** Aplikacja towarzysząca Garmin Connect IQ + zaawansowane profile szczepów alpejskich + moduł komory ciepłej dla serów propionowych z wielkimi oczkami.
4. **Wersja 2.x:** Algorytmy computer vision do oceny barwy skórki i wielkości oczek sera + synchronizacja p2p między urządzeniami serowara.
5. **Nigdy (Koncepcje odrzucone):** Logowanie do chmury, publiczne fora społecznościowe, reklamy bannerowe, telemetria/tracking, obsługa produktów niemlecznych (kiszonek, kombuchy, octów).

---

## **Rozdział 6.4 Szacowany Nakład Pracy Agenta**

Szacunki bazują na modelu autonomicznego agenta inżynieryjnego studia Apps4Brew (test-driven development, zero długu technologicznego):

| Obszar / Moduł | Dni pracy agenta | Uwagi i zależności |
| :--- | :--- | :--- |
| **Architektura, relacyjna baza SQLite WAL, DDL, migracje** | 2.5 dnia | Fundament persystencji, 18 tabel relacyjnych mleczarskich, rotacja 10 kopii backupu |
| **Moduł B1: Kalkulator Serowara (Mleko, CaCl2, IMCU, Flokulacja)** | 3.5 dnia | Precyzyjne wzory enzymatyczne, interaktywny stoper flokulacji, testy Jest |
| **Moduł B2: Skrzep, Ziarno, Rampa Dogrzewania, Prasa** | 3.0 dni | Matematyka nacisku powierzchniowego, harmonogramy wieloetapowe |
| **Moduł B3: Solenie, Solanka Nasycona, Bufor pH i Ca** | 2.0 dni | Chemia solanek serowarskich, przeliczniki Baumé/Salometer |
| **Moduł B4: Cave Log (Dziennik Dojrzewania, Affinage)** | 4.0 dni | Złożony moduł harmonogramów pielęgnacji, powiadomienia, psychrometria |
| **Moduł B5: Twarogi Klinkowe i Sery Świeże (Labneh, Paneer)** | 2.5 dnia | Kinetyka pI 4.6, rampa dogrzewania 35–45°C, formowanie klinka |
| **Moduł B6: Masielnictwo, Ghee, Napoje Mleczne i Serwatka** | 3.5 dnia | Okno temperaturowe zmaślania, wytapianie ghee, ricotta i karmelizacja brunost |
| **Moduł B7: Spiżarnia, Auto-Odpis, Etykiety PDF z QR, Koszty** | 2.5 dnia | Generator PDF (`expo-print`), skaner kodów (`expo-camera`), yield calc |
| **Moduł B8: Live Activity, Apple Watch, Sensoryka SVG** | 3.5 dnia | ActivityKit na iOS, radar sensoryczny sera SVG, haptics |
| **Moduł C1–C4: Szkoła, Diagnostyk Wad, 50 Reguł Mleczarskich** | 4.5 dnia | Kompletny silnik diagnostyczny wad nabiału, 50 reguł z wektorami testowymi |
| **Moduł D1–D4: Weryfikacja jakości, i18n (35 języków), a11y VoiceOver** | 4.0 dni | Bramka `check-i18n`, macierz testów `docs/19`, audyt WCAG AAA |
| **E2E Maestro, pipeline CI w GitHub Actions, TestFlight** | 2.5 dni | Scenariusze E2E na symulatorze iOS, workflowy wolne od EAS |
| **SUMA (Pełne MVP — Etap 1.0):** | **~38 dni pracy agenta** | Czas kalendarzowy: ok. 3–4 tygodnie przy pracy ciągłej agenta |

---

## **Rozdział 6.5 Warianty Decyzyjne Startu Projektu**

* **Wariant A (Rekomendowany — Pełne Przetwórstwo Mleczne):** Realizacja pełnego ekosystemu mleczarskiego w MVP (ser podpuszczkowy + twaróg + masło + kefir/jogurt + ricotta/brunost + Cave Log). Zapewnia natychmiastowy efekt WOW i kompletną gospodarkę surowcem bez marnowania litra mleka (~38 dni agenta).
* **Wariant B (Tylko Sery Twarde i Cave Log):** Realizacja wyłącznie kalkulatora podpuszczki, prasy, solanki i leżakowania (~22 dni agenta). Odrzucenie masła i twarogów do etapu 1.1.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: A4_rozdz_13_15_KPI_Marketing_ASO.md -->
<!-- ========================================== -->

# **SEROWAR BRD 0.1 — Część A: KPI, Marketing i ASO (Rozdziały 13 i 15)**

> **Ekosystem:** Apps4Brew Studio | **Projekt:** SEROWAR (Rzemieślnicze Przetwórstwo Mleka)

---

## **Rozdział 13. Prywatne Wskaźniki Sukcesu (KPI bez śledzenia użytkownika)**

Zgodnie z zasadą **ZP-03** aplikacja SEROWAR nie zawiera żadnych skryptów szpiegujących ani zewnętrznych SDK telemetrycznych. Wskaźniki sukcesu mierzone są wyłącznie za pomocą anonimowych metryk dostarczanych przez **Apple App Store Connect** oraz wskaźników lokalnych przechowywanych w urządzeniu użytkownika:

1. **Konwersja App Store (Store Conversion Rate):**
   * *Cel:* $\ge 5.0\%$ konwersji odsłon karty produktowej w pobranie aplikacji (wysoka intencja użytkowników szukających kalkulatora podpuszczki i serowarstwa).
   * *Narzędzie:* App Store Connect Analytics.
2. **Wskaźnik Awaryjności (Crash-Free Sessions):**
   * *Cel:* $\ge 99.8\%$ sesji wolnych od awarii.
   * *Narzędzie:* Apple Xcode Organizer Crash Reports.
3. **Wskaźnik Retencji Długoterminowej (Cave Log Retention):**
   * *Cel:* Średni czas życia partii sera w Cave Log $\ge 60$ dni (dowód, że użytkownicy rzeczywiście pielęgnują dojrzewające krążki przy asyście aplikacji).
   * *Narzędzie:* Anonimowa metryka lokalna na urządzeniu.
4. **Tempo Zwrotu Kosztu Konta Apple (Payback Velocity):**
   * *Cel:* 10 zakupów Lifetime lub 30 subskrypcji rocznych w ciągu pierwszych 45 dni od premiery w App Store.

---

## **Rozdział 15. Strategia Marketingowa, ASO i Kręgi Społeczności**

### **15.1 Strategia App Store Optimization (ASO)**
Kluczowe słowa kluczowe (PL i EN) wyselekcjonowane pod kątem zerowej konkurencji i najwyższej intencji rzemieślniczej:

* **Tytuł (PL):** SEROWAR — Rzemieślnicze Przetwórstwo Mleka
* **Podtytuł (PL):** Kalkulator podpuszczki, Cave Log, twaróg i masło
* **Słowa kluczowe (PL):** serowarstwo,serowar,podpuszczka,flokulacja,gouda,cheddar,dojrzewalnia,solanka,kazeina,twaróg,masło,ghee,ricotta,brunost,mleko,nabiał
* **Tytuł (EN):** SEROWAR: Artisan Cheese & Dairy Craft
* **Podtytuł (EN):** Rennet calculator, cheese cave, curd & butter
* **Słowa kluczowe (EN):** cheesemaking,rennet,flocculation,cheese cave,affinage,cheddar,gouda,curd,butter,ghee,ricotta,brunost,dairy,whey,raw milk,parmesan

### **15.2 Dotarcie do Kręgów Zainteresowanych (Organic Launch Circles)**
Strategia wprowadzenia na rynek opiera się na organicznym zaufaniu w wąskich kręgach pasjonatów (bez płatnych reklam):
1. **Krąg 1: Serowarzy Zagrodowi i Rzemieślnicy:**
   * Polskie fora serowarskie (Serowar.pl, wędzarnicza brać, grupy serowarstwa domowego na FB — łącznie ponad 70 tys. członków).
   * Globalne społeczności: Reddit r/cheesemaking (110k), cheeseforum.org.
   * Przekaz: „Pierwszy mobilny kalkulator z prawdziwą metodą mnożnika flokulacji, przeliczaniem IMCU i dziennikiem jaskini dojrzewalniczej, który działa w 100% offline w piwnicy”.
2. **Krąg 2: Wytwórcy Domowego Nabiału, Masła i Twarogów:**
   * Społeczności: r/homestead, grupy tradycyjnego przetwórstwa wiejskiego, zero-waste.
   * Przekaz: „Nigdy więcej twardego jak kreda twarogu i zjełczałego masła: precyzyjne temperatury koagulacji, zmaślania i zamknięty obieg serwatki”.
3. **Krąg 3: Rzemieślniczy Producenci Zagrodowi (RHD):**
   * Rolnicy i hodowcy kóz/krów sprzedający sery na targach ekologicznych.
   * Przekaz: „Ewidencja partii leżakowania krążków, kalkulator kosztu kilograma sera i kostki masła oraz profesjonalne etykiety PDF z kodami QR”.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: B1_Narzedzia_Kalkulator_Serowara.md -->
<!-- ========================================== -->

# **SEROWAR BRD 0.1 — Rozdział 7: Narzędzia Serowarskie — Kalkulator Mleka, Kultur i Podpuszczki (B1)**

> **Moduł:** `BR-SER-001` do `BR-SER-035`  
> **Kontekst dziedzinowy:** Precyzyjne dozowanie enzymów koagulujących (IMCU wg IDF 157) i kultur bakteryjnych na litr mleka, gatunki mleka (krowa, koza, owca, bawół), bilans kazeinowo-wapniowy, stoper flokulacji.

---

### **BR-SER-001: Konfigurator Surowca Mlecznego**
* **Opis:** Użytkownik definiuje parametry wsadu mlecznego przed rozpoczęciem sesji serowarskiej.
* **Format danych wejściowych:**
  * Gatunek: Krowie (domyślny), Kozie, Owcze, Bawole, Mieszane.
  * Pochodzenie i obróbka: Surowe zagrodowe prosto z udoju (niepasteryzowane), Pasteryzowane niskotemperaturowo (LTLT 63°C / HTST 72°C), Pasteryzowane sklepowe (mikrofiltrowane).
  * Objętość: wprowadzana z klawiatury numerycznej lub suwakiem (zakres: 1.0 L do 200.0 L, skok co 0.5 L).
  * Opcjonalnie: zmierzona zawartość tłuszczu (%) i białka (%) oraz pH początkowe (domyślnie 6.60–6.70 dla świeżego mleka krowiego).
* **Kryteria akceptacji:**
  1. Przy wyborze mleka sklepowego/pasteryzowanego system automatycznie aktywuje wymaganie suplementacji jonów wapnia ($CaCl_2$) (BR-SER-004).
  2. Próba ustawienia mleka UHT powoduje zablokowanie przycisku „Dalej” i wyświetlenie okna modalnego z wyjaśnieniem: *„Mleko UHT zostało poddane temperaturze > 135°C, co trwale denaturuje białka serwatkowe, które blokują micele kazeinowe. Z mleka UHT nie powstanie zwięzły skrzep podpuszczkowy.”*
* **Persona:** P1, P4, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-SER-004: Kalkulator Suplementacji Chlorku Wapnia ($CaCl_2$)**
* **Opis:** Obliczanie dokładnej dawki $CaCl_2$ w celu odbudowy struktury mostków wapniowych kazeiny zniszczonych w procesie pasteryzacji i homogenizacji.
* **Format obliczeń:**
  * Postać surowca: Roztwór płynny 33% (najpopularniejszy w handlu serowarskim) lub Bezwodny proszek $CaCl_2$ (cz.d.a.).
  * Formuła bazowa: $0.20\text{ g}$ bezwodnego $CaCl_2$ na 1 litr mleka pasteryzowanego (lub $0.60\text{ ml}$ roztworu 33% na 10 L).
  * Dla mleka surowego zimowego: $0.10\text{ g/L}$. Dla mleka surowego letniego: $0.00\text{ g/L}$ (brak potrzeby).
* **Kryteria akceptacji:**
  1. Wyświetlenie dawki w mililitrach, kroplach (przyjmując 1 ml ≈ 20 kropli) oraz gramach.
  2. Prezentacja instrukcji rozpuszczenia $CaCl_2$ w 50 ml chłodnej, niechlorowanej wody przed wlaniem do podgrzanego mleka.
  3. Blokada bezpieczeństwa: ostrzeżenie, jeśli dawka przekroczy $0.40\text{ g/L}$ (ryzyko gorzkiego smaku sera).
* **Persona:** P1, P2, P5.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-SER-008: Uniwersalny Przelicznik Mocy Podpuszczki (IMCU vs 1:X)**
* **Opis:** Wyliczanie objętości lub masy podpuszczki na podstawie jej zdeklarowanej aktywności enzymatycznej.
* **Format przeliczania:**
  * Standard międzynarodowy: IMCU (International Milk Clotting Units, wg ISO 11815 / IDF 157). Typowe stężenia: 150–200 IMCU/ml dla podpuszczek mikrobiologicznych (*Rhizomucor miehei*), 500–750 IMCU/ml dla naturalnych chymozyn cielęcych.
  * Standard tradycyjny: stosunek krzepnięcia (np. 1:10 000 oznacza, że 1 ml podpuszczki ścina 10 000 ml mleka w 35°C w 40 min).
  * Formuła dawkowania:
    $$V_{podpuszczki} [ml] = \frac{V_{mleka} [L] \times \text{Docelowe IMCU/L}}{\text{Moc podpuszczki [IMCU/ml]}}$$
    Gdzie docelowe zapotrzebowanie wynosi typowo 30–40 IMCU na 1 litr mleka dla serów półtwardych.
* **Kryteria akceptacji:**
  1. Użytkownik może wybrać profil podpuszczki z listy predefiniowanej (np. *Chymosina Cielęca 90/10 180 IMCU*, *Fromase 220 TL*, *Beaugel 5*) lub wpisać własną wartość z etykiety.
  2. Wyliczona objętość prezentowana jest z dokładnością do 0.05 ml oraz w kroplach.
  3. Prezentacja reguły technicznej: podpuszczkę należy rozcieńczyć w 20–50 ml chłodnej wody destylowanej lub przegotowanej niechlorowanej na 5 minut przed dodaniem.
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-SER-012: Asystent Metody Flokulacji (Flocculation Multiplier)**
* **Opis:** Interaktywny stoper pomiaru czasu flokulacji i wyznaczania optymalnego momentu cięcia skrzepu.
* **Logika procesu:**
  1. Użytkownik wlewa rozcieńczoną podpuszczkę, miesza mleko przez 60 sekund ruchem góra-dół i wciska przycisk **„Start Zaprawiania ($t_0$)”**.
  2. Użytkownik umieszcza na powierzchni mleka lekką zdezynfekowaną miseczkę i delikatnie wprawia ją w ruch obrotowy co 60 sekund.
  3. W momencie, gdy mleko ulega zżelowaniu i gwałtownie zatrzymuje obrót miseczki, użytkownik klika **„Punkt Flokulacji ($t_f$)”**.
  4. System rejestruje czas flokulacji $t_f$ (typowo 10–18 minut).
  5. System mnoży $t_f$ przez mnożnik flokulacji $M$ dedykowany dla wybranego stylu sera:
     $$t_{ciecia} = t_0 + (t_f \times M)$$
  6. Aplikacja uruchamia odliczanie do momentu cięcia skrzepu z alertem dźwiękowym i haptics.
* **Mnożniki flokulacji w bazie:**
  * Sery alpejskie i twarde (Gruyère, Grana, Parmesan): $M = 2.0 - 2.5$.
  * Sery półtwarde i twarde prasowane (Cheddar, Gouda, Tilsit): $M = 3.0 - 3.5$.
  * Sery z porostem białej pleśni (Camembert, Brie): $M = 4.0 - 5.0$.
  * Sery miękkie kwasowo-podpuszczkowe (Feta, Koryciński): $M = 5.0 - 6.0$.
* **Kryteria akceptacji:**
  1. Jeśli $t_f < 8\text{ min}$, aplikacja wyświetla ostrzeżenie: *„Flokulacja zaszła zbyt szybko (nadmiar podpuszczki, wysoka kwasowość lub za wysoka temperatura). Skrzep może być gumowaty.”*
  2. Jeśli $t_f > 22\text{ min}$, aplikacja wyświetla ostrzeżenie: *„Flokulacja opóźniona (osłabiona podpuszczka, niska temperatura lub brak jonów wapnia). Wydłużono czas koagulacji.”*
* **Persona:** P1, P2, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-SER-015: Test Czystego Złomu (Clean Break Guide)**
* **Opis:** Sensoryczna weryfikacja gotowości skrzepu przed wbiciem harfy serowarskiej.
* **Kryteria akceptacji:**
  * Wyświetlenie ilustracji i instrukcji: wykonanie nacięcia nożem na głębokość 3 cm i podważenie płaską krawędzią. Skrzep powinien pęknąć równo jak szkło, a w powstałej szczelinie powinna zebrać się klarowna, żółto-zielonkawa serwatka (brak mętnego mleka).
  * Przycisk „Skrzep gotowy — tnij” lub „Odczekaj jeszcze 5 minut (+5m)”.
* **Persona:** P1, P4, P5.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-SER-020…035: Zarządzanie Kulturami Starterowymi DVI**
* Baza szczepów: *Lactococcus lactis* subsp. *lactis*, *L. lactis* subsp. *cremoris*, *L. diacetylactis*, *Streptococcus thermophilus*, *Lactobacillus helveticus*, *L. delbrueckii*.
* Wyliczanie czasu przed-zakwaszania (pre-ripening) w temperaturze inokulacji (30–38°C) przez 30–60 minut przed dodaniem podpuszczki.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: B2_Narzedzia_Obrobka_Skrzepu_Prasowanie.md -->
<!-- ========================================== -->

# **SEROWAR BRD 0.1 — Rozdział 7: Narzędzia Serowarskie — Obróbka Skrzepu i Prasowanie (B2)**

> **Moduł:** `BR-CURD-001` do `BR-CURD-030`  
> **Kontekst dziedzinowy:** Kinetyka synerezy skrzepu, geometria cięcia harfą, dogrzewanie gęstwy, płukanie serwatki, dynamika nacisku prasy ($kg/cm^2$ i PSI).

---

### **BR-CURD-001: Geometria Cięcia i Kalibrator Wielkości Ziarna**
* **Opis:** Prowadzenie użytkownika przez etap krojenia skrzepu harfą serowarską lub nożem w zależności od projektowanego typu sera.
* **Kategorie wielkości ziarna:**
  * **Duże (orzech włoski, 20–30 mm):** sery miękkie, wilgotne, camembert, brie.
  * **Średnie (orzech laskowy / kukurydza, 10–15 mm):** sery półtwarde, gouda, tylżycki, koryciński.
  * **Drobne (ziarno grochu / ryżu, 4–8 mm):** sery twarde prasowane, cheddar, gruyère, manchego.
  * **Bardzo drobne (ziarno pszenicy, 2–3 mm):** sery wysokodogrzewane, parmezan, grana.
* **Kryteria akceptacji:**
  1. Instrukcja dwukierunkowego cięcia krzyżowego (kolumny pionowe -> odczekanie 3 min -> cięcie poziome).
  2. Stoper spoczynku pociętego skrzepu (5 minut) pozwalający na wytworzenie pierwszej błonki białkowej na ziarnach przed rozpoczęciem mieszania.
* **Persona:** P1, P2, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-CURD-006: Asystent Rampy Temperaturowej Dogrzewania (Cooking Ramp)**
* **Opis:** Dynamiczny nadzór nad powolnym podnoszeniem temperatury gęstwy serowej w kotle/garnku.
* **Zasada biologiczna:** Zbyt szybkie ogrzanie gęstwy (> 1°C na 2 minuty) powoduje zeszklanie zewnętrznej warstwy ziarna (case-hardening). Zamknięte pory uniemożliwiają odpływ serwatki z wnętrza ziarna, co prowadzi do przekwaszenia i zepsucia sera w trakcie dojrzewania.
* **Kryteria akceptacji:**
  1. Użytkownik wprowadza temperaturę początkową (np. 32°C) i docelową (np. 38°C dla Goudy lub 52°C dla Parmezanu).
  2. System wylicza minimalny czas grzania:
     $$t_{min} [min] = (T_{docelowa} - T_{poczatkowa}) \times 2.0\text{ min/°C}$$
  3. Dźwiękowy metronom/stoper podaje tempo: np. „Osiągnij 34°C za 4 minuty”.
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-CURD-010: Procedura Płukania Skrzepu (Washing the Curd / Gouda Style)**
* **Opis:** Obliczanie objętości odlewanej serwatki i dodawanej gorącej wody w celu usunięcia części laktozy.
* **Zasada technologiczna:** Usunięcie 30–40% serwatki i zastąpienie jej wodą o temp. 50–60°C obniża stężenie laktozy, co ogranicza zakwaszenie przez bakterie mezofilne i daje słodki, elastyczny miąższ typowy dla serów holenderskich (Gouda, Edam).
* **Kryteria akceptacji:**
  * Wyliczenie: objętość serwatki do odlania (np. 30% z 20L = 6L) oraz objętość i temperatura wody do dolania w celu osiągnięcia docelowej temperatury gęstwy 36–38°C.
* **Persona:** P1, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-CURD-015: Zaawansowany Kalkulator Nacisku Prasy Serowarskiej**
* **Opis:** Przeliczanie masy fizycznego obciążnika (odważnika, hantli, baniaka z wodą) na rzeczywisty nacisk jednostkowy wywierany na powierzchnię sera w formie.
* **Fizyka nacisku:**
  Nacisk jednostkowy $P$ zależy od pola powierzchni formy $A = \pi \times r^2$ oraz ramienia dźwigni w prasach holenderskich:
  $$P [kg/cm^2] = \frac{m_{obciaznika} [kg] \times R}{\pi \times (\frac{d}{2})^2 [cm^2]}$$
  Gdzie $R$ to przełożenie dźwigni ($R = 1.0$ dla nacisku bezpośredniego, $R = 3.0 - 5.0$ dla prasy dźwigniowej), a $d$ to średnica formy serowarskiej.
* **Kryteria akceptacji:**
  1. Użytkownik wybiera średnicę formy (np. $\varnothing 14\text{ cm} \rightarrow A \approx 154\text{ cm}^2$, $\varnothing 20\text{ cm} \rightarrow A \approx 314\text{ cm}^2$).
  2. Użytkownik podaje typ prasy: Prasa bezpośrednia / grawitacyjna ($R=1$), Prasa dźwigniowa holenderska, Prasa pneumatyczna.
  3. System generuje dokładną wagę obciążnika wymaganą do uzyskania zadanego nacisku technologicznego (np. 0.05, 0.20, 0.50, 1.00 kg/cm²).
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-CURD-020: Harmonogram Etapów Prasowania i Obracania**
* **Opis:** Sekwencja czasowa stopniowego zwiększania nacisku z powiadomieniami o odwróceniu krążka w chuście serowarskiej.
* **Wzorcowy cykl prasowania (np. Cheddar / Gouda 2 kg):**
  1. Etap 1: 15 minut przy nacisku lekkim ($0.2\text{ kg/cm}^2$). Cel: ułożenie ziaren bez zamykania kanałów odpływu serwatki. Powiadomienie: *„Wyjmij ser, obróć, wygładź chustę.”*
  2. Etap 2: 30 minut przy nacisku średnim ($0.5\text{ kg/cm}^2$). Powiadomienie: *„Drugi obrót sera w formie.”*
  3. Etap 3: 2 godziny przy nacisku mocnym ($1.0\text{ kg/cm}^2$). Powiadomienie: *„Trzeci obrót.”*
  4. Etap 4: 12–16 godzin (przez noc) przy nacisku docelowym ($1.5 - 2.0\text{ kg/cm}^2$). Powiadomienie: *„Zakończ prasowanie. Zmierz pH i wagę przed kąpielą solankową.”*
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: B3_Narzedzia_Solenie_i_Solanki.md -->
<!-- ========================================== -->

# **SEROWAR BRD 0.1 — Rozdział 7: Narzędzia Serowarskie — Solenie i Kąpiele Solankowe (B3)**

> **Moduł:** `BR-SOL-001` do `BR-SOL-025`  
> **Kontekst dziedzinowy:** Chemia i gęstość nasyconej solanki serowarskiej, korekty termiczne hydrometru (°Baumé / Salometer), równowaga osmotyczna wapnia i kwasowości, obliczanie czasu kąpieli.

---

### **BR-SOL-001: Kalkulator Składu Nasyconej Solanki Serowarskiej**
* **Opis:** Precyzyjne przygotowanie bezpiecznej kąpieli solankowej o stężeniu 18–22% NaCl.
* **Formuła chemiczna (na 10 litrów wody):**
  * Sól niejodowana czysta (NaCl): $2.20\text{ kg} - 2.50\text{ kg}$.
  * Chlorek wapnia ($CaCl_2$ 33%): $15\text{ ml}$ (lub $5\text{ g}$ bezwodnego). Cel: zapobieganie wypłukiwaniu jonów wapnia ze skórki sera.
  * Zakwaszenie buforowe: $5 - 10\text{ ml}$ kwasu mlekowego 80% lub $150\text{ ml}$ kwaśnej serwatki. Cel: wyrównanie pH solanki do pH sera (pH 5.20–5.40).
* **Kryteria akceptacji:**
  1. Kalkulator przelicza proporcje na dowolną objętość naczynia solankowego (od 2L do 50L).
  2. Wyraźne ostrzeżenie przed użyciem soli jodowanej z antyzbrylaczem (żelazocyjanek potasu $E536$), który hamuje florę bakteryjną i plami skórkę.
* **Persona:** P1, P2, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-SOL-005: Przelicznik Gęstości i Konwerter Hydrometryczny**
* **Opis:** Obsługa pomiarów gęstości solanki za pomocą areometru, solomierza lub wagi laboratoryjnej.
* **Tablica korelacji w algorytmie (przy temp. 15°C):**
  * $18\%\ NaCl \rightarrow$ gęstość $1.135\text{ g/cm}^3$ | $17.2^\circ\text{Bé}$ | $70^\circ\text{Salometer}$.
  * $20\%\ NaCl \rightarrow$ gęstość $1.152\text{ g/cm}^3$ | $19.1^\circ\text{Bé}$ | $78^\circ\text{Salometer}$.
  * $22\%\ NaCl \rightarrow$ gęstość $1.169\text{ g/cm}^3$ | $21.0^\circ\text{Bé}$ | $86^\circ\text{Salometer}$.
  * $24\%\ NaCl$ (nasycona) $\rightarrow$ gęstość $1.186\text{ g/cm}^3$ | $22.8^\circ\text{Bé}$ | $95^\circ\text{Salometer}$.
* **Kryteria akceptacji:**
  * Automatyczna korekta temperatury odczytu: jeśli solanka ma temperaturę 10°C, a aerometr skalowano na 20°C, algorytm wprowadza poprawkę gęstości.
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-SOL-010: Algorytm Czasu Kąpieli Solankowej (Brine Timer)**
* **Opis:** Obliczanie optymalnego czasu przebywania sera w solance na podstawie jego masy, geometrii i docelowego zasolenia.
* **Formuła dyfuzji soli Ficka (RD-08):**
  Czas kąpieli $t$ dla sera twardego/półtwardego w nasyconej solance (20% NaCl, 12°C):
  $$t [h] = m_{sera} [kg] \times K_{stylu} \times \left( \frac{grubosc [cm]}{wysokosc_{ref} [cm]} \right)$$
  Gdzie współczynnik stylu wynosi średnio:
  * Sery miękkie (Feta, Halloumi): $K = 2.0 - 3.0\text{ h/kg}$.
  * Gouda, Edam, Tylżycki: $K = 4.0 - 5.0\text{ h/kg}$.
  * Cheddar, sery twarde: $K = 6.0\text{ h/kg}$.
* **Kryteria akceptacji:**
  1. Uruchomienie odliczania z powiadomieniem w połowie czasu: *„Obróć krążek w solance”*.
  2. Powiadomienie krytyczne z dźwiękiem alarmowym po upływie czasu: *„Wyjmij ser z solanki i przenieś do suszenia skórki.”*
* **Persona:** P1, P4, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-SOL-015: Kalkulator Solenia z Ręki (Dry Salting)**
* **Opis:** Dozowanie soli dla serów niesolonych w kąpieli (np. Camembert, Roquefort, sery kwasowe).
* **Kryteria akceptacji:**
  * Obliczenie dawki 1.8% do 2.5% masy zważonego krążka.
  * Rozpisanie na 2 lub 3 równe porcje: aplikacja na górę i boki w dobie 1, obrót i aplikacja na dół w dobie 2.
* **Persona:** P1, P2.
* **Priorytet:** MUST | **Etap:** MVP.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: B4_Narzedzia_Cave_Log_Dozor_Dojrzewania.md -->
<!-- ========================================== -->

# **SEROWAR BRD 0.1 — Rozdział 7: Narzędzia Serowarskie — Cave Log i Dziennik Dojrzewania (B4)**

> **Moduł:** `BR-CAVE-001` do `BR-CAVE-040`  
> **Kontekst dziedzinowy:** Zarządzanie komorą dojrzewalniczą (cheese cave / winiarka), kalendarz zabiegów affinage, przemywanie maziowe (*Brevibacterium linens*), pleśnie szlachetne (*Penicillium*), alerty wilgotności i punktu rosy, krzywe ubytku wagi (% shrinkage).

---

### **BR-CAVE-001: Cyfrowy Paszport Krążka Sera (Cheese Batch Passport)**
* **Opis:** Rejestracja i śledzenie indywidualnego krążka sera przez cały okres dojrzewania (od 7 dni do 24 miesięcy).
* **Pola metryki partii:**
  * Unikalny kod partii (np. `SER-2026-10-GOU-01`).
  * Nazwa / Styl sera (np. *Gouda Zagrodowa z kozieradką*).
  * Data produkcji, data wyjęcia z solanki, data planowanego zakończenia affinage.
  * Waga początkowa po osuszeniu (g) oraz waga bieżąca (g).
  * Przeznaczenie skórki: Naturalna szczotkowana, Maziowa przemywana (*B. linens*), Pleśniowa biała (*P. camemberti*), Pleśniowa niebieska (*P. roqueforti*), Woskowana parafiną, Oliwiona, Powłoka polioctanowa.
  * Lokalizacja w jaskini: Półka 1, 2, Pojemnik dojrzewalniczy A.
* **Kryteria akceptacji:**
  1. Wizualna karta krążka z paskiem postępu dojrzałości (dni leżakowania / docelowy wiek).
  2. Generowanie miniaturowego kodu QR partii do wydruku na półkę lub pojemnik.
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-CAVE-005: Inteligentny Harmonogram Obracania (Turning Schedule)**
* **Opis:** Algorytm generujący automatyczny kalendarz obrotów krążka w celu zapewnienia równomiernej wilgotności i symetrii kształtu.
* **Zasady harmonogramu:**
  * Faza I (Dni 1–14): codzienne obracanie krążka o 180° i wytarcie półki z kondensatu serwatki.
  * Faza II (Dni 15–45): obracanie co 2–3 dni.
  * Faza III (Dni 46–180+): obracanie 1 raz w tygodniu.
* **Kryteria akceptacji:**
  1. Poranne powiadomienie push: *„3 krążki wymagają dzisiaj obrócenia (Gouda #04, Cheddar #02, Tomme #01).”*
  2. Odznaczenie akcji jednym tapnięciem w aplikacji lub na Apple Watch.
* **Persona:** P1, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-CAVE-010: Asystent Pielęgnacji Skórki Maziowej (Smear / Brevibacterium linens)**
* **Opis:** Protokoły przemywania serów maziowych (Taleggio, Munster, Reblochon, Limburger).
* **Harmonogram zabiegów przemywania (Washing Protocol):**
  * Tydzień 1: przemywanie co 2 dni lekką solanką (3% NaCl) z dodatkiem kultur *B. linens* i *Geotrichum candidum*.
  * Tydzień 2: przemywanie co 3 dni solanką 3% (możliwy dodatek wina, piwa lub cydru).
  * Tydzień 3+: przemywanie 1 raz w tygodniu wyłącznie czystą chłodną wodą w celu usunięcia nadmiaru śluzu i wykształcenia pomarańczowo-różowej skórki.
* **Kryteria akceptacji:**
  * Rejestracja każdego zabiegu (data, użyty roztwór, zapach, stopień lepkości skórki).
* **Persona:** P6, P7.
* **Priorytet:** SHOULD | **Etap:** MVP.

---

### **BR-CAVE-015: Monitorowanie Mikroklimatu i Psychrometria Jaskini**
* **Opis:** Rejestracja temperatury (°C) i wilgotności względnej (% RH) dojrzewalni oraz obliczanie punktu rosy ($T_{dp}$).
* **Kryteria akceptacji:**
  1. Użytkownik wprowadza odczyty ręcznie lub dane pobierane są automatycznie z czujnika BLE (BR-SYS-015).
  2. Obliczanie punktu rosy wg formuły Magnusa-Tetensa:
     $$\alpha(T, RH) = \frac{17.27 \times T}{237.7 + T} + \ln\left(\frac{RH}{100}\right), \quad T_{dp} = \frac{237.7 \times \alpha}{17.27 - \alpha}$$
  3. **Alert kondensacji:** Jeśli temperatura krążka sera jest niższa niż $T_{dp}$, aplikacja generuje ostrzeżenie: *„Uwaga: na powierzchni sera skrapla się woda. Ryzyko rozwoju czarnej pleśni Mucor. Zwiększ cyrkulację powietrza!”*
  4. **Alert przesuszenia:** Jeśli RH spadnie poniżej 80% dla serów z naturalną skórką, system generuje alert pękania skórki.
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: B5_Narzedzia_Twarogi_i_Sery_Swieze.md -->
<!-- ========================================== -->

# **SEROWAR BRD 0.1 — Rozdział 7: Narzędzia — Twarogi Klinkowe i Sery Świeże (B5)**

> **Moduł:** `BR-TWAR-001` do `BR-TWAR-035`  
> **Kontekst dziedzinowy:** Kinetyka koagulacji kwasowej kazeiny w punkcie izoelektrycznym ($pH = 4.6$), rampa łagodnego dogrzewania skrzepu (35–45°C), formowanie tradycyjnego klinka w chuście serowarskiej, odciek grawitacyjny, sery świeże labneh, paneer/chhena i sery kwasowo-podpuszczkowe.

---

### **BR-TWAR-001: Monitor Ukwaszania Mleka i Punktu Izoelektrycznego Kazeiny ($pH = 4.6$)**
* **Opis:** Prowadzenie procesu naturalnego ukwaszania mleka surowego lub szczepionego kulturami mezofilnymi LD (*Flora Danica*, *CHN-19*) w celu osiągnięcia optymalnego skrzepu kwasowego.
* **Biochemia procesu:** W miarę wytwarzania kwasu L-mlekowego przez bakterie fermentacji mlekowej, pH mleka spada z wyjściowego 6.6–6.7 do punktu izoelektrycznego kazeiny ($pI = 4.60$). Przy tej kwasowości micele kazeinowe tracą ujemny ładunek powierzchniowy i łączą się w trójwymiarową, delikatną siatkę żelu kwasowego.
* **Kryteria akceptacji:**
  1. Wybór metody ukwaszania: Naturalne zsiadanie mleka surowego (20–22°C przez 24–36h) lub Szczepienie kulturami mezofilnymi z dodatkiem odrobiny kwaśnego mleka/maślanki.
  2. Wskaźnik kwasowości sensorycznej: test zwięzłości skrzepu (łyżka postawiona w naczyniu zachowuje stabilność, brak wydzielania gazu).
* **Persona:** P2, P4, P5.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-TWAR-006: Asystent Rampy Łagodnego Dogrzewania Skrzepu Twarogowego**
* **Opis:** Dynamiczny nadzór nad powolnym podgrzewaniem zsiadłego mleka w garnku z grubym dnem lub płaszczem wodnym w oknie 35–45°C.
* **Zasada technologiczna:**
  * Jeśli temperatura skrzepu $< 35^\circ C$: synereza jest niewystarczająca, skrzep pozostaje mazisty, a drobinki kazeiny uciekają przez oczka chusty wraz z serwatką (ogromna strata surowca).
  * Jeśli temperatura skrzepu $> 45^\circ C$: dochodzi do gwałtownego skurczu miceli kazeiny, całkowitego wyciśnięcia wody i powstania twarogu twardego, suchego i grudkowatego jak kreda.
  * **Optymalne okno:** 38–42°C (delikatny, kremowy twaróg tradycyjny).
* **Kryteria akceptacji:**
  1. Stoper prowadzi użytkownika przez powolne ogrzewanie z prędkością nie większą niż 1°C na 3 minuty.
  2. Czerwony alarm dźwiękowy przy przekroczeniu 44°C: *„Natychmiast zdejmij garnek z ognia! Ryzyko stwardnienia i skredowacenia twarogu!”*
* **Persona:** P2, P4, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-TWAR-010: Formowanie Tradycyjnego Klinka i Odciek Grawitacyjny**
* **Opis:** Asystent przekładania skrzepu do trójkątnej chusty serowarskiej (klinka) i grawitacyjnego odsączania serwatki.
* **Fazy ociekania:**
  * Faza 1: Swobodny odciek w podwieszonej chuście (1–2 godziny) — odzyskanie 70% serwatki do osobnego garnka na Ricottę/Brunost.
  * Faza 2: Delikatne dociśnięcie (samonacisk lub deseczka 0.5–1.0 kg) przez 2–4 godziny w celu uzyskania zwartej struktury klinka.
* **Kryteria akceptacji:**
  * Kalkulator końcowej wilgotności: twaróg wilgotny (odciek 2h), twaróg półtłusty zwarty (odciek 4h + lekki nacisk).
* **Persona:** P2, P4.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-TWAR-015: Moduł Bliskowschodniego Serka Labneh**
* **Opis:** Procedura wytwarzania aksamitnego serka Labneh z gęstego jogurtu naturalnego.
* **Parametry technologiczne:**
  * Odsączanie jogurtu z dodatkiem 1.0% soli w gęstym płótnie przez 12–24h w chłodzie (4–8°C).
  * Ubytek masy: 50–60% w postaci przejrzystej serwatki kwasowej.
  * Formowanie kulek serowych i konserwacja w oliwie z oliwek z dodatkiem zataru, czarnuszki i suszonych pomidorów.
* **Persona:** P2, P3.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-TWAR-020: Paneer & Chhena — Koagulacja Termiczno-Kwasowa Gorącego Mleka**
* **Opis:** Receptura i kalkulator dawek kwasu dla tradycyjnych indyjskich serów świeżych z gorącego mleka.
* **Matematyka koagulacji:**
  * Mleko podgrzane do temperatury 82–88°C.
  * Dodatek kwasu (kwas cytrynowy, sok z cytryny lub kwaśna serwatka): dawka przeliczana na litr mleka w celu uzyskania żółto-zielonkawej, przejrzystej serwatki.
  * Błyskawiczne płukanie skrzepu zimną wodą w celu usunięcia posmaku kwasu i prasowanie pod obciążeniem 2–4 kg przez 30 minut.
* **Persona:** P2, P5.
* **Priorytet:** MUST | **Etap:** MVP.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: B6_Narzedzia_Napoje_Mleczne_Maslo_Ghee.md -->
<!-- ========================================== -->

# **SEROWAR BRD 0.1 — Rozdział 7: Narzędzia — Masielnictwo, Ghee, Napoje Mleczne i Serwatka (B6)**

> **Moduł:** `BR-DAIRY-001` do `BR-DAIRY-035`  
> **Kontekst dziedzinowy:** Masielnictwo rzemieślnicze, okno temperaturowe zmaślania śmietanki (10–14°C), inwersja emulsji tłuszczowej O/W -> W/O, płukanie wodą lodową, wyciskanie maślanki, wytapianie ghee i masła klarowanego (250°C), fermentacja termofilna jogurtu, tradycyjny kefir na ziarnach grzybka tybetańskiego oraz zamknięty obieg serwatki (Ricotta i Brunost).

---

### **BR-DAIRY-001: Kalkulator Zmaślania Śmietanki i Bilansu Tłuszczowego**
* **Opis:** Modelowanie wydajności masła na podstawie objętości i zawartości tłuszczu w śmietance (śmietana 30%, 36%, 42%).
* **Formuła bilansu tłuszczowego (RD-27):**
  $$m_{masla} [g] = \frac{m_{smietanki} [g] \times (\%Fat_{smietanka} / 100) \times \eta_{yield}}{\%Fat_{maslo} / 100}$$
  Gdzie $\eta_{yield} \approx 0.98$ (strata ok. 2% tłuszczu przechodzącego do maślanki), a $\%Fat_{maslo} = 82.5\%$ (standard rzemieślniczego masła ekstra).
  *Przykład:* 1000 g śmietanki 36% daje ok. $1000 \times 0.36 \times 0.98 / 0.825 = 427.6\text{ g}$ masła oraz ok. 570 g świeżej maślanki.
* **Kryteria akceptacji:**
  1. Wynik podawany w gramach masła i mililitrach maślanki z dokładnością do 1 g.
  2. Wybór typu śmietany: Słodka (Sweet Cream) lub Fermentowana/Ukwaszona mezofilnie (Cultured Cream / Crème Fraîche).
* **Persona:** P2, P4, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-DAIRY-005: Asystent Okna Temperaturowego Zmaślania (10–14°C)**
* **Opis:** Ścisły nadzór nad temperaturą śmietanki przed wlaniem do masielnicy lub miksera.
* **Fizyka krystalizacji tłuszczu mlecznego:**
  * Jeśli $T > 15^\circ C$: frakcja ciekła tłuszczu przeważa nad kryształami stałymi. Ziarna masła ulegają rozmazaniu, emulsja nie rozbija się prawidłowo, a duża część tłuszczu ucieka do maślanki. Masło jest maziste i nietrwałe.
  * Jeśli $T < 8^\circ C$: tłuszcz jest zbyt twardy, czas ubijania wydłuża się do kilkudziesięciu minut.
  * **Okno rekomendowane:** 10–12°C latem (gdy krowy jedzą zielonkę bogatą w nienasycone kwasy tłuszczowe) oraz 12–14°C zimą (gdy pasza sucha zwiększa udział nasyconego kwasu palmitynowego i stearynowego).
* **Kryteria akceptacji:**
  * Weryfikacja temperatury termometrem z alertem gotowości do zmaślania.
* **Persona:** P2, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-DAIRY-010: Procedura Płukania Wodą Lodową i Mechanicznego Wyciskania Maślanki**
* **Opis:** Kluczowy etap decydujący o trwałości masła i zabezpieczeniu przed jełczeniem hydrolitycznym.
* **Instrukcja technologiczna:**
  1. Odcedzenie ziaren masła od maślanki na sicie.
  2. Zalanie ziaren wodą lodową ($< 5^\circ C$) i delikatne ugniatanie łyżką serowarską. Odlanie mętnej wody.
  3. Powtórzenie płukania 2–3 razy, aż woda płucząca będzie idealnie krystaliczna.
  4. Przełożenie masła na bukową deskę serowarską i ugniatanie łopatkami w celu mechanicznego wyciśnięcia uwięzionych mikrokropelek maślanki.
* **Kryteria akceptacji:**
  * Rejestracja liczby cykli płukania i opcjonalny kalkulator solenia masła (1.0–1.5% soli w masie).
* **Persona:** P2, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-DAIRY-015: Wytapianie Rzemieślniczego Ghee i Masła Klarowanego**
* **Opis:** Prowadzenie procesu powolnego wytapiania czystego tłuszczu mlecznego (bezwodnego tłuszczu mlecznego AMF).
* **Fazy termiczne wytapiania:**
  1. Topnienie masła w temperaturze 85–90°C.
  2. Odparowywanie wody (ok. 16% masy masła) w temperaturze 100–105°C — gęsta piana na powierzchni.
  3. Opadanie kazeiny na dno garnka i powolna reakcja Maillarda w temp. 108–112°C (powstanie orzechowego aromatu tradycyjnego Ghee).
  4. Filtracja przez potrójną gazę serowarską.
* **Właściwości produktu:** Czystość tłuszczu > 99.8%, wilgotność < 0.2%, punkt dymienia $250^\circ C$, trwałość wielomiesięczna bez lodówki.
* **Persona:** P2, P5, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-DAIRY-020: Zamknięty Obieg Serwatki — Rzemieślnicza Ricotta**
* **Opis:** Odzysk białek serwatkowych (albumin i globulin) po produkcji serów podpuszczkowych.
* **Warunki termiczno-kwasowe:**
  * Podgrzanie świeżej, słodkiej serwatki do temperatury $85 - 90^\circ C$.
  * Korekta pH do poziomu 5.80–6.00 za pomocą kwasu cytrynowego lub octowego.
  * Wypłynięcie aksamitnych płatków Ricotty na powierzchnię i zbieranie łyżką szumówką.
  * Opcja wzbogacenia: dodatek 5–10% mleka pełnego podwaja wydajność i nadaje kremową słodycz.
* **Persona:** P1, P2, P5.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-DAIRY-025: Norweski Brunost / Mysost (Karmelizowany Ser Serwatkowy)**
* **Opis:** Tradycyjna skandynawska metoda redukcji serwatki do zwartego, brązowego bloku o smaku toffi.
* **Proces odparowania i karmelizacji:**
  * Gotowanie serwatki z redukcją objętości o 80–85% (zagęszczenie laktozy i soli mineralnych).
  * Dodatek śmietanki w końcowej fazie zagęszczania.
  * Karmelizacja laktozy w temperaturze $102 - 105^\circ C$ z intensywnym mieszaniem drewnianą łopatką.
  * Szybkie chłodzenie w kąpieli lodowej z ciągłym mieszaniem zapobiegające powstawaniu wyczuwalnych kryształków laktozy (ochrona przed defektem piaszczystości).
* **Persona:** P3, P5.
* **Priorytet:** MUST | **Etap:** MVP.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: B7_Narzedzia_Spizarnia_Naczynia_Etykiety.md -->
<!-- ========================================== -->

# **SEROWAR BRD 0.1 — Rozdział 7: Narzędzia — Spiżarnia Mleczna, Etykiety PDF i Koszty (B7)**

> **Moduł:** `BR-MAG-001` do `BR-MAG-030`  
> **Kontekst dziedzinowy:** Gospodarka surowcowa z automatycznym odpisem po sesji mleczarskiej, druk etykiet A4 z kodami QR przez `expo-print`, kalkulator uzysku serowarskiego (% yield) i kosztu partii.

---

### **BR-MAG-001: Cyfrowa Spiżarnia i Inwentarz Surowców Mleczarskich**
* **Opis:** Ewidencja posiadanych surowców i kultur w gospodarstwie domowym i serowarni.
* **Kategorie magazynowe:**
  * Mleko (L) — gatunek (krowie, kozie, owcze, bawole), data udoju, dostawca, cena za litr.
  * Śmietanka (L / kg) — zawartość tłuszczu (30%, 36%, 42%), data pozyskania.
  * Podpuszczki (ml / g) — data ważności, moc IMCU, pochodzenie (cielęca, mikrobiologiczna).
  * Kultury bakterii DVI i pleśni — szczepy mezofilne/termofilne, probówki/saszetki, data ważności.
  * Dodatki technologiczne — chlorek wapnia $CaCl_2$ (g/ml), sól kłodawska niejodowana (kg), zioła (kozieradka, czarnuszka, pieprz).
* **Kryteria akceptacji:**
  * Ostrzeżenie o zbliżającym się terminie przydatności kultur liofilizowanych (zamrażarka -18°C).
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-MAG-005: Automatyczny Odpis Magazynowy po Sesji (Auto-Depletion)**
* **Opis:** Po zakończeniu procesu serowarskiego aplikacja automatycznie odejmuje zużyte ilości surowców z bazy inwentarza.
* **Kryteria akceptacji:**
  1. Podsumowanie zużycia przed zatwierdzeniem: *„Z magazynu zostanie odpisane: 20L mleka krowiego, 1.4 ml podpuszczki Fromase, 0.4 g kultury Choozit MA11, 400 g soli.”*
  2. Jeśli w magazynie brakuje surowca, aplikacja ostrzega przed rozpoczęciem sesji i proponuje zamiennik.
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-MAG-010: Generator Etykiet i Paszportów PDF z Kodem QR (`expo-print`)**
* **Opis:** Generowanie profesjonalnych arkuszy etykiet PDF w formacie A4 (siatka etykiet samoprzylepnych na krążki sera i osełki masła).
* **Zawartość pojedynczej etykiety:**
  * Nazwa sera / produktu i numer partii (Batch ID).
  * Data produkcji, data solenia, data minimalnej dojrzałości.
  * Skład surowcowy (gatunek mleka, użyte kultury, dodatki ziołowe).
  * Wektorowy kod QR z zakodowanym schematem deep-link `serowar://batch/<id>` pozwalający na natychmiastowe otwarcie karty partii w telefonie za pomocą aparatu.
* **Kryteria akceptacji:**
  * Wygenerowanie pliku PDF gotowego do wydruku przez AirPrint lub zapisania w plikach systemowych iOS.
* **Persona:** P1, P2, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-MAG-015: Kalkulator Wydajności Mleczarskiej (% Yield) i Kosztu Partii**
* **Opis:** Obliczanie realnego uzysku sera i masła z mleka oraz kosztu jednostkowego wytworzenia kilograma produktu.
* **Wzór wydajności serowarskiej:**
  $$\text{Yield [\%]} = \frac{m_{sera\ po\ prasowaniu} [kg]}{V_{mleka} [L] \times \rho_{mleka} [kg/L]} \times 100\%$$
  *Typowa wydajność:* mleko krowie 9–11%, mleko kozie 8–10%, mleko owcze 18–25%.
* **Rachunek kosztu krążka / osełki:**
  $$\text{Koszt całkowity} = \text{Koszt mleka/śmietanki} + \text{Koszt enzymów i kultur} + \text{Koszt energii grzania} + \text{Sól}$$
  Aplikacja prezentuje porównanie z cenami delikatesów rzemieślniczych (np. ser dojrzały bio: 120 zł/kg, masło wiejskie: 18 zł/200g) z wyliczeniem kwoty zaoszczędzonej w portfelu.
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: B8_Narzedzia_Zegarki_LiveActivity_Sensory.md -->
<!-- ========================================== -->

# **SEROWAR BRD 0.1 — Rozdział 7: Narzędzia — Zegarki, Live Activity, Sensory i Sensoryka (B8)**

> **Moduł:** `BR-SYS-001` do `BR-SYS-030`  
> **Kontekst dziedzinowy:** Hands-free w kuchni serowarskiej ("ręce w serwatce"), Apple Watch, Garmin Connect IQ, widżety Live Activity w czasie rzeczywistym, odczyt z czujników BLE, wektorowy radar sensoryczny sera (SVG).

---

### **BR-SYS-001: Asystent Live Activity i Dynamic Island (iOS ActivityKit)**
* **Opis:** Ciągła prezentacja odliczania kluczowych faz procesu serowarskiego na zablokowanym ekranie iPhone'a oraz w Dynamic Island.
* **Scenariusze Live Activity:**
  1. **Odliczanie do punktu flokulacji:** stoper miseczki z przyciskiem szybkiej akcji „Złapano flokulację”.
  2. **Odliczanie do cięcia skrzepu:** czas mnożnika flokulacji ($t_f \times M$).
  3. **Rampa dogrzewania skrzepu / twarogu:** aktualna temperatura docelowa i tempo grzania.
  4. **Fazy prasowania:** czas pozostały do następnego obrotu krążka w prasie.
* **Kryteria akceptacji:**
  * Widżet nie gaśnie, aktualizuje się co sekundę, wspiera Always-On Display.
* **Persona:** P1, P2, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-SYS-005: Aplikacja Towarzysząca Apple Watch (Hands-Free in Whey)**
* **Opis:** Dedykowany interfejs zegarkowy dla serowara z mokrymi dłońmi.
* **Funkcje na zegarku:**
  * Duży przycisk rejestracji punktu flokulacji (obsługa tapnięciem nadgarstka lub koronką Digital Crown).
  * Wyświetlanie aktualnego kroku procesu (np. „Dogrzewaj skrzep — jeszcze 6 minut do 38°C”).
  * Dźwiękowa i haptyczna sygnalizacja alarmów obrotu sera w prasie i solance.
* **Kryteria akceptacji:**
  * Niezależne działanie timera na Apple Watch nawet przy zerwanym połączeniu Bluetooth z telefonem.
* **Persona:** P1, P6.
* **Priorytet:** SHOULD | **Etap:** MVP/1.1.

---

### **BR-SYS-015: Bezprzewodowa Integracja z Czujnikami Środowiskowymi BLE**
* **Opis:** Automatyczne pobieranie odczytów temperatury i wilgotności względnej z bezprzewodowych tagów Bluetooth Low Energy umieszczonych w dojrzewalni lub chłodziarce serowarskiej.
* **Wspierane czujniki (protokoły broadcast Manufacturer Data):**
  * **RuuviTag (Finlandia):** format RAWv2 (temperatura, wilgotność z dokładnością do 0.1%, ciśnienie atmosferyczne).
  * **Xiaomi Mijia BLE (np. LYWSD03MMC z firmware ATC/BTHome):** temperatura i wilgotność.
* **Kryteria akceptacji:**
  1. Aplikacja nie wymaga parowania z chmurą producenta — nasłuchuje lokalnych pakietów rozgłoszeniowych BLE w tle.
  2. Automatyczne dopisywanie odczytów do wykresu mikroklimatu partii w Cave Log.
* **Persona:** P6, P7.
* **Priorytet:** COULD | **Etap:** 1.1.

---

### **BR-SYS-020: Wektorowy Radar Sensoryczny Smaku i Dojrzałości Sera (Spider Radar SVG)**
* **Opis:** Interaktywny wykres pajęczynowy oceny dojrzałości sera oraz profilu sensorycznego produktów mlecznych.
* **Osie sensoryczne sera:**
  1. Kwasowość (Acidity / pH)
  2. Słoność (Salinity)
  3. Elastyczność / Zwartość Miąższu (Elasticity / Curd Firmness)
  4. Maślanowość / Kremowość (Creaminess / Diacetyl)
  5. Ostrość / Pikantność (Pungency / Lipolysis)
  6. Orzechowość / Dojrzałość Proteolityczna (Nuttiness / Proteolysis)
* **Kryteria akceptacji:**
  * Wektorowy komponent SVG renderowany w 100% lokalnie, z możliwością nałożenia profilu wzorcowego stylu sera na profil uzyskany przez użytkownika.
* **Persona:** P1, P3, P6, P7.
* **Priorytet:** SHOULD | **Etap:** MVP.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: C1_Nauka_Szkola_Serowarstwa_i_Fermentacji.md -->
<!-- ========================================== -->

# **SEROWAR BRD 0.1 — Rozdział 7: Szkoła Rzemiosła i Kompas Diagnostyczny (C1)**

> **Moduł:** `BR-EDU-001` do `BR-EDU-040`  
> **Kontekst dziedzinowy:** Baza wiedzy o chemii mleka i mikroorganizmach mleczarskich, interaktywny atlas kultur DVI, kompas diagnostyczny wad i zakażeń sera (Cheese Doctor), diagnostyk wad masła, twarogów i produktów mlecznych (Dairy Doctor).

---

### **BR-EDU-001: Interaktywna Szkoła Serowarstwa i Mleczarstwa Zagrodowego**
* **Opis:** System modularnych kursów i przewodników krok po kroku wyjaśniających biochemiczne podstawy koagulacji, synerezy, solenia, zmaślania i affinage.
* **Kluczowe moduły edukacyjne:**
  1. *Lekcja 1: Biochemia Kazeiny* — dlaczego micele kazeinowe odpychają się elektrostatycznie (frakcja $\kappa$-kazeiny) i jak chymozyna odcina hydrofilowy ogonek glikomakropeptydu, inicjując żelowanie.
  2. *Lekcja 2: Rola Wapnia Koloidalnego* — jak pasteryzacja niszczy mostki $Ca^{2+}$ i dlaczego $CaCl_2$ ratuje mleko pasteryzowane.
  3. *Lekcja 3: Mezofile vs Termofile* — różnice metaboliczne kultur, optymalne temperatury, szlak cytrynianowy i produkcja diacetylu (aromat maślany) vs kwas L-mlekowy.
  4. *Lekcja 4: Fizyka Synerezy* — wielkość ziarna, rampa dogrzewania i mechaniczne wyciskanie serwatki.
  5. *Lekcja 5: Ekologia Dojrzewalni* — sukcesja mikroflory na skórce: drożdże odkwaszające (*Geotrichum*) -> bakterie maziowe (*Brevibacterium linens*) lub pleśnie białe (*Penicillium camemberti*).
  6. *Lekcja 6: Masielnictwo i Inwersja Emulsji* — jak pęcherzyki powietrza rozbijają otoczki tłuszczowe MFGM i odwracają układ faza rozproszona/ciągła z O/W (śmietanka) na W/O (masło).
  7. *Lekcja 7: Denaturacja Albumin w Ricotcie* — dlaczego białka serwatkowe potrzebują wysokiej temperatury ($>85^\circ C$) i kwasu do koagulacji.
* **Persona:** P1, P2, P4, P5.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-EDU-010: Kompas Diagnostyczny Wad i Chorób Sera (Cheese Doctor)**
* **Opis:** Decyzyjny system ekspercki diagnozujący anomalie w wyglądzie, zapachu i smaku sera na podstawie objawów zgłoszonych przez użytkownika.
* **Baza wiedzy diagnostycznej:**
  * **Wada D-01: Wzdęcie Wczesne (Early Blowing / Dziurkowatość gąbczasta)**
    * *Objawy:* ser pęcznieje w ciągu pierwszych 24–72 godzin od produkcji, setki drobnych otworków jak w gąbce, nieprzyjemny zapach.
    * *Przyczyna biologiczna:* skażenie bakteriami grupy Coli (*Escherichia coli*, *Enterobacter aerogenes*) lub dzikimi drożdżami z powodu braku higieny udoju mleka surowego.
    * *Decyzja:* **Ser niezdatny do spożycia. Wyrzucić.**
  * **Wada D-02: Wzdęcie Późne (Late Blowing / Pękanie krążka po tygodniach)**
    * *Objawy:* gwałtowne wybrzuszenie i pękanie dojrzałego sera po 3–8 tygodniach, wielkie nieregularne dziury, zapach kwasu masłowego (zjełczałego masła).
    * *Przyczyna biologiczna:* obecność przetrwalników *Clostridium tyrobutyricum* z kiszonki dla bydła; fermentacja masłowa z wydzielaniem gazów $H_2$ i $CO_2$.
    * *Decyzja:* Wada nieusuwalna. Profilaktyka: używanie azotanu potasu lub mikrofiltracja.
  * **Wada D-03: Gorzki Smak Sera (Bitter Defect)**
    * *Objawy:* nieprzyjemny, zalegający gorzki posmak po przełknięciu.
    * *Przyczyna chemiczna:* akumulacja hydrofobowych peptydów o niskiej masie cząsteczkowej. Spowodowana przedawkowaniem podpuszczki, zbyt niskim stężeniem soli w serze (< 1.2%) lub brakiem peptydaz w użytej kulturze mezofilnej.
    * *Decyzja:* Zmniejszyć dawkę podpuszczki o 20% w kolejnej partii, wdrożyć kultury wspomagające *Lactobacillus helveticus*.
  * **Wada D-04: Śluzowacenie Skórki w Solance (Slime / Rind Melting)**
    * *Objawy:* krążek po wyjęciu z solanki jest lepki, a jego powierzchnia zmywa się pod palcami jak mokre mydło.
    * *Przyczyna chemiczna:* wypłukanie jonów wapnia ze skórki z powodu braku $CaCl_2$ w solance lub zbyt wysokiego pH wody kranowej.
    * *Decyzja:* Wdrożyć regułę RD-07 (dodatek 0.15% CaCl2 i zakwaszenie solanki do pH 5.3).
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-EDU-020: Diagnostyk Wad Masła, Twarogu i Produktów Mlecznych (Dairy Doctor)**
* **Opis:** System diagnostyczny anomalii w produktach mlecznych codziennych:
  * **Wady masła:**
    * *Zjełczenie hydrolityczne:* posmak mydlany lub ostry kwasowy (uwolnienie kwasu masłowego przez lipazy natywne lub bakteryjne z mleka surowego).
    * *Zjełczenie oksydacyjne:* posmak metaliczny, łojowaty (utlenianie wielonienasyconych kwasów tłuszczowych pod wpływem światła i jonów miedzi/żelaza).
    * *Masłowatość mazista / miękka:* zmaślanie śmietanki w zbyt wysokiej temperaturze ($>15^\circ C$).
    * *Kropelkowanie maślanki:* niedostateczne mechaniczne wyciśnięcie na desce serowarskiej (uwięziona wilgoć skraca trwałość).
  * **Wady twarogu:**
    * *Twaróg twardy, suchy i kredowy:* przegrzanie skrzepu powyżej 44°C w trakcie dogrzewania.
    * *Twaróg mazisty, rzadki i śluzowaty:* niedogrzanie skrzepu ($<35^\circ C$) lub atak bakteriofagów opóźniający zakwaszenie.
    * *Gorzknienie twarogu:* rozwój bakterii psychrotrofowych (*Pseudomonas*) w mleku zbyt długo przechowywanym w chłodzie przed ukwaszeniem.
  * **Wady jogurtu i kefiru:**
    * *Wydzielanie serwatki (synereza jogurtu):* wstrząsanie słoikami podczas inkubacji termofilnej lub zbyt niska temperatura wstępnej pasteryzacji mleka (brak denaturacji $\beta$-laktoglobuliny).
    * *Śluzowatość ciągnąca:* inkubacja jogurtu w zbyt niskiej temperaturze ($<38^\circ C$) sprzyjająca nadprodukcji egzopolisacharydów.
* **Persona:** P2, P4, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: C2_Reguly_Dziedzinowe_Serowarstwo.md -->
<!-- ========================================== -->

# **SEROWAR BRD 0.1 — Rozdział 8: Reguły Dziedzinowe Serowarstwa (RD-01…RD-25) z Wektorami Testowymi (C2)**

> **Rygor inżynieryjny:** Wszystkie formuły w niniejszym rozdziale stanowią matematyczne reguły pierwszego szczebla (Tier 1 Math) studia Apps4Brew. Każda funkcja posiada deterministyczne wektory testowe weryfikowane w testach jednostkowych Jest/CI.

---

### **RD-01: Obliczanie Zapotrzebowania i Dawki Podpuszczki (IMCU)**
* **Wzór ogólny:**
  $$V_{rennet} [ml] = \frac{V_{milk} [L] \times Target\_IMCU\_Per\_Liter [IMCU/L]}{Rennet\_Strength [IMCU/ml]}$$
* **Wektor testowy 1 (Gouda 20L, podpuszczka standardowa):**
  * Wejście: $V_{milk} = 20.0\text{ L}$, $Target = 35.0\text{ IMCU/L}$, $Strength = 200.0\text{ IMCU/ml}$.
  * Rachunek: $(20.0 \times 35.0) / 200.0 = 700 / 200.0 = 3.50\text{ ml}$.
  * Oczekiwany wynik: dokładnie `3.50 ml` (lub 70 kropli przy skali 20 kr/ml).
* **Wektor testowy 2 (Cheddar 50L, mocna chymozyna):**
  * Wejście: $V_{milk} = 50.0\text{ L}$, $Target = 40.0\text{ IMCU/L}$, $Strength = 600.0\text{ IMCU/ml}$.
  * Rachunek: $(50.0 \times 40.0) / 600.0 = 2000 / 600.0 = 3.333...\text{ ml}$.
  * Oczekiwany wynik: `3.33 ml` (zaokrąglenie do 2 miejsc po przecinku).

---

### **RD-02: Konwersja Siły Tradycyjnej 1:X na IMCU**
* **Zależność fizykochemiczna:**
  Siła podpuszczki 1:10 000 w temperaturze 35°C w czasie 40 minut odpowiada w przybliżeniu aktywności $130\text{ IMCU/ml}$.
  $$Strength [IMCU/ml] = \frac{130.0 \times Ratio}{10000.0}$$
* **Wektor testowy:**
  * Wejście: podpuszczka o sile 1:15 000.
  * Rachunek: $(130.0 \times 15000) / 10000 = 195.0\text{ IMCU/ml}$.
  * Oczekiwany wynik: `195.0 IMCU/ml`.

---

### **RD-03: Suplementacja Chlorku Wapnia ($CaCl_2$)**
* **Wzór zapotrzebowania:**
  $$m_{CaCl2\_dry} [g] = V_{milk} [L] \times D_{target} [g/L]$$
  Objętość roztworu handlowego 33% ($V_{33\%}$): gęstość roztworu $\rho \approx 1.30\text{ g/ml}$, stężenie $0.33\text{ g } CaCl_2\text{ na 1 g roztworu} \rightarrow 0.429\text{ g } CaCl_2\text{ w 1 ml roztworu}$.
  $$V_{33\%} [ml] = \frac{m_{CaCl2\_dry} [g]}{0.429\text{ g/ml}} \approx m_{CaCl2\_dry} [g] \times 2.33$$
* **Wektor testowy (Mleko pasteryzowane 15L):**
  * Wejście: $V_{milk} = 15.0\text{ L}$, dawka zalecana $D_{target} = 0.20\text{ g/L}$.
  * Rachunek: $m_{CaCl2\_dry} = 15.0 \times 0.20 = 3.00\text{ g}$.
  * Objętość roztworu 33%: $3.00 \times 2.33 = 6.99\text{ ml}$ (zaokrąglane do `7.0 ml`).

---

### **RD-04: Metoda Mnożnika Flokulacji (Flocculation Time to Cut)**
* **Wzór czasu cięcia:**
  $$t_{cut\_total} = t_f \times M$$
  $$t_{wait\_after\_floc} = t_f \times (M - 1.0)$$
* **Wektor testowy (Camembert, mnożnik 4.5x):**
  * Wejście: punkt flokulacji zanotowany w minucie 12:00 ($t_f = 12.0\text{ min}$), mnożnik $M = 4.5$.
  * Rachunek: $t_{cut\_total} = 12.0 \times 4.5 = 54.0\text{ min}$.
  * Czas oczekiwania od momentu flokulacji: $12.0 \times (4.5 - 1.0) = 12.0 \times 3.5 = 42.0\text{ min}$.
  * Oczekiwany wynik: stoper po flokulacji odlicza dokładnie `42 minuty 00 sekund`.

---

### **RD-05: Nacisk Prasy Serowarskiej ($kg/cm^2$ i PSI)**
* **Wzory nacisku:**
  Pole powierzchni formy cylindrycznej: $A = \pi \times r^2 = \pi \times (d / 2)^2$.
  Nacisk $P [kg/cm^2] = (m_{weight} [kg] \times R) / A [cm^2]$.
  Przeliczenie na $PSI$: $1\text{ kg/cm}^2 = 14.2233\text{ PSI}$.
* **Wektor testowy (Forma średnica 16 cm, prasa dźwigniowa R=3.5, obciążnik 10 kg):**
  * Wejście: $d = 16.0\text{ cm} \rightarrow r = 8.0\text{ cm}$.
  * Pole powierzchni: $A = 3.14159 \times 64.0 = 201.06\text{ cm}^2$.
  * Całkowity nacisk na tłok: $10.0\text{ kg} \times 3.5 = 35.0\text{ kg}$.
  * Nacisk jednostkowy: $P = 35.0 / 201.06 = 0.174\text{ kg/cm}^2$.
  * W PSI: $0.174 \times 14.2233 = 2.47\text{ PSI}$.
  * Oczekiwany wynik: `0.17 kg/cm²` / `2.47 PSI`.

---

### **RD-06: Psychrometria i Punkt Rosy Jaskini Dojrzewalniczej**
* **Formuła Magnusa-Tetensa:**
  Dla temperatury $T = 12.0^\circ\text{C}$ i wilgotności $RH = 85.0\%$:
  $$\alpha = \frac{17.27 \times 12.0}{237.7 + 12.0} + \ln(0.85) = \frac{207.24}{249.7} + (-0.1625) = 0.8299 - 0.1625 = 0.6674$$
  $$T_{dp} = \frac{237.7 \times 0.6674}{17.27 - 0.6674} = \frac{158.64}{16.6026} \approx 9.55^\circ\text{C}$$
* **Wektor testowy:**
  * Oczekiwana temperatura punktu rosy: `9.6°C`. Jeśli temperatura skórki sera spadnie poniżej 9.6°C, nastąpi wykroplenie rosy.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: C3_Reguly_Dziedzinowe_Przetworstwo_Mleczne.md -->
<!-- ========================================== -->

# **SEROWAR BRD 0.1 — Rozdział 8: Reguły Dziedzinowe Przetwórstwa Mlecznego (RD-26…RD-50) z Wektorami Testowymi (C3)**

> **Rygor inżynieryjny:** Deterministyczne formuły biochemiczne i fizykochemiczne przetwórstwa mlecznego (twarogi, masło, ghee, jogurt, kefir, ricotta, brunost) z kompletnymi wektorami testowymi.

---

### **RD-26: Kinetyka Koagulacji Kwasowej Kazeiny w Punkcie Izoelektrycznym ($pH = 4.60$)**
* **Zasada biochemiczna:**
  Micele kazeinowe w świeżym mleku ($pH \approx 6.65$) posiadają ujemny ładunek powierzchniowy netto wynikający z dysocjacji reszt kwasu fosforowego i kwasu asparaginowego/glutaminowego. W miarę gromadzenia kwasu L-mlekowego protony $H^+$ neutralizują ujemne ładunki miceli.
  W punkcie izoelektrycznym kazeiny ($pH = 4.60$ w temperaturze $20^\circ C$):
  * Potencjał dzeta miceli osiąga $0\text{ mV}$.
  * Siły odpychania elektrostatycznego zanikają, a przeważają hydrofobowe oddziaływania kazeina-kazeina, tworząc stabilny żel kwasowy (skrzep twarogowy).
* **Wektor testowy:**
  * Jeśli $pH_{zmierzone} > 5.20$: stan `MLEKO PŁYNNE / WCZESNE UKWASZANIE`.
  * Jeśli $4.80 < pH_{zmierzone} \le 5.20$: stan `POCZĄTEK KOAGULACJI (NIE RUSZAĆ GARNKA)`.
  * Jeśli $4.55 \le pH_{zmierzone} \le 4.70$: stan `IDEALNY SKRZEP TWAROGOWY (PUNKT IZOELEKTRYCZNY)`.
  * Jeśli $pH_{zmierzone} < 4.40$: stan `PRZEKWASZENIE (SKRZEP KRUCHY, DUŻA SYNEREZA)`.

---

### **RD-27: Bilans Tłuszczowy i Wydajność Zmaślania Śmietanki**
* **Formuła inżynieryjna:**
  $$m_{masla} [g] = \frac{m_{smietanki} [g] \times (\%Fat_{smietanka} / 100) \times \eta_{yield}}{\%Fat_{maslo} / 100}$$
  Gdzie:
  * $\eta_{yield} = 0.98$ (98% tłuszczu przechodzi do ziaren masła, 2% do maślanki).
  * $\%Fat_{maslo} = 82.5\%$ (standardowe masło ekstra).
* **Wektor testowy (Śmietanka wiejska 36%, 1500 g):**
  * Wejście: $m_{smietanki} = 1500.0\text{ g}$, $\%Fat_{smietanka} = 36.0\%$.
  * Rachunek:
    $$m_{tluszczu\ w\ masle} = 1500.0 \times 0.36 \times 0.98 = 529.2\text{ g}$$
    $$m_{masla} = \frac{529.2}{0.825} = 641.45\text{ g}$$
    $$m_{maslanki} = 1500.0 - 641.45 = 858.55\text{ g}$$
  * Oczekiwany wynik: `641.5 g masła` oraz `858.5 g maślanki`.

---

### **RD-28: Termiczna Denaturacja i Koagulacja Białek Serwatkowych (Ricotta)**
* **Zasada fizykochemiczna:**
  Główne białka serwatkowe ($\beta$-laktoglobulina 50%, $\alpha$-laktoalbumina 20%) nie koagulują pod wpływem podpuszczki i pozostają rozpuszczone w serwatce. Koagulują one pod wpływem wysokiej temperatury ($T \ge 85^\circ C$) połączonej z obniżeniem pH do poziomu $5.80 - 6.00$.
* **Formuła zapotrzebowania na kwas cytrynowy (dla słodkiej serwatki podpuszczkowej pH 6.4):**
  $$m_{kwas\ cytrynowy} [g] = V_{serwatki} [L] \times 0.60\text{ g/L}$$
* **Wektor testowy (Serwatka ze słodkiego sera Gouda, 20 litrów):**
  * Wejście: $V_{serwatki} = 20.0\text{ L}$, temperatura docelowa $88^\circ C$.
  * Rachunek: $20.0 \times 0.60 = 12.0\text{ g}$ kwasu cytrynowego bezwodnego (rozpuszczonego w 100 ml wody).
  * Oczekiwany uzysk Ricotty (sama serwatka): ok. $20 \times 0.045 = 0.90\text{ kg}$ Ricotty.
  * Opcja z dodatkiem 2L mleka pełnego: uzysk wzrasta do $0.90 + (2.0 \times 0.12) = 1.14\text{ kg}$.

---

### **RD-29: Reakcja Maillarda i Odparowanie w Norweskim Brunost / Mysost**
* **Formuła zagęszczenia suchej masy:**
  Serwatka słodka zawiera ok. $6.0 - 6.5\%$ suchej masy (głównie laktoza 4.8%, minerały 0.6%, resztki białka 0.8%). Aby uzyskać zwarty blok Brunostu, zawartość suchej masy musi osiągnąć $\ge 80.0\%$.
  Wskaźnik odparowania wody:
  $$V_{wody\ do\ odparowania} = V_0 \times \left(1 - \frac{DM_{pocz}}{DM_{konc}}\right)$$
* **Wektor testowy (Kocioł serwatki 15 litrów):**
  * Wejście: $V_0 = 15.0\text{ L}$, $DM_{pocz} = 6.0\%$, $DM_{konc} = 80.0\%$.
  * Rachunek: $15.0 \times (1 - 6.0 / 80.0) = 15.0 \times (1 - 0.075) = 15.0 \times 0.925 = 13.875\text{ L}$ wody musi odparować.
  * Pozostała masa gęstej serwatki: $15.0 - 13.875 = 1.125\text{ kg}$.
  * Dodatek śmietanki 36%: 300 g śmietanki.
  * Masa końcowa bloku Brunostu: $\approx 1.40\text{ kg}$.
  * Temperatura karmelizacji laktozy: $102 - 105^\circ C$.

---

### **RD-30: Kinetyka Symbiozy Termofilnej Jogurtu ($S. thermophilus + L. bulgaricus$)**
* **Protokół symbiozy (Proto-cooperation):**
  * *Streptococcus thermophilus* rośnie szybciej na początku, zużywa tlen i wytwarza kwas mrówkowy oraz $CO_2$, które stymulują *Lactobacillus delbrueckii* subsp. *bulgaricus*.
  * *Lactobacillus* posiada aktywną proteazę powierzchniową (PrtS), która tnie kazeinę na małe peptydy stymulujące wzrost paciorkowca.
  * Optymalna temperatura inkubacji: $42.0^\circ C - 43.5^\circ C$.
  * Czas osiągnięcia skrzepu jogurtowego ($pH = 4.50$): $4.5 - 6.0\text{ godzin}$.
* **Wektor testowy:**
  * Jeśli temperatura spadnie poniżej $38^\circ C$: dominacja śluzowatych form paciorkowców, defekt ciągliwości.
  * Jeśli temperatura przekroczy $46^\circ C$: inhibicja pałeczek, opóźniona koagulacja.

---

### **RD-31: Bilans Wytapiania Czystego Ghee / Masła Klarowanego**
* **Skład masła tradycyjnego:** $82.5\%$ tłuszcz, $16.0\%$ woda, $1.5\%$ białko (kazeina) i laktoza.
* **Formuła wydajności czystego tłuszczu (AMF):**
  $$m_{ghee} [g] = m_{masla} [g] \times 0.825$$
* **Wektor testowy (4 kostki masła po 200 g = 800 g):**
  * Wejście: $800.0\text{ g}$ masła ekstra 82.5%.
  * Rachunek: $800.0 \times 0.825 = 660.0\text{ g}$.
  * Oczekiwany wynik: `660 g czystego ghee` (odparowuje ok. 128 g wody, 12 g osadu kazeiny na dnie garnka).
  * Punkt dymienia: $250^\circ C$.

---

### **RD-32: Wydajność Twarogu Klinkowego z Mleka w Zależności od Białka**
* **Formuła wydajności (przy wilgotności twarogu 70%):**
  $$m_{twarogu} [g] = \frac{V_{mleka} [L] \times \rho_{mleka} [kg/L] \times \%Bialka\_Kazeinowego [\%] \times \eta_{rec}}{1.0 - Wilgotnosc_{twarogu}}$$
* **Wektor testowy (10 litrów mleka krowiego, 2.6% kazeiny, odzysk 95%, wilgotność 70%):**
  * Wejście: $V = 10.0\text{ L}$, $\rho = 1.03\text{ kg/L}$, masa mleka = $10.3\text{ kg}$.
  * Masa kazeiny: $10.3 \times 0.026 = 0.2678\text{ kg}$.
  * Masa z odzyskiem 95%: $0.2678 \times 0.95 = 0.2544\text{ kg}$.
  * Masa twarogu (sucha masa twarogu ok. 30% z kazeiną, tłuszczem i minerałami): typowy rzemieślniczy uzysk wynosi ok. $1.60 - 1.80\text{ kg}$ z 10 litrów mleka.
  * Oczekiwany wynik: `1.70 kg twarogu`.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: C4_Proces_Tresci_i_Decyzje_Badacza.md -->
<!-- ========================================== -->

# **SEROWAR BRD 0.1 — Rozdział 8.P: Proces Weryfikacji Treści i Rejestr Decyzji Badacza (D-01…D-25) (C4)**

> **Ekosystem:** Apps4Brew Studio | **Projekt:** SEROWAR (Rzemieślnicze Przetwórstwo Mleka)  
> **Hierarchia źródeł:** Zgodnie z zasadą właściciela z 4 października 2026 r. obowiązującą we wszystkich aplikacjach studia.

---

## **1. Pięcioszczeblowa Hierarchia Źródeł Merytorycznych**

1. **Szczebel 1 (Najwyższy — Rachunek i biochemia molekularna):** Stechiometria reakcji koagulacji kazeiny, równania dyfuzji soli Ficka, prawa termodynamiki i psychrometrii, sprawdzone niezależnie w kodzie testów Jest.
2. **Szczebel 2 (Normy międzynarodowe i instytucje naukowe):** Standardy Międzynarodowej Federacji Mleczarskiej (IDF / FIL), wytyczne FAO/WHO Codex Alimentarius dla mleka i przetworów mlecznych (Codex Stan 283, 279, 221), normy USDA Dairy Division i FDA 21 CFR 133.
3. **Szczebel 3 (Akademickie podręczniki serowarskie i recenzowane badania):**
   * P.F. Fox, T.P. Guinee, T.M. Cogan, P.L.H. McSweeney: *Fundamentals of Cheese Science* (Springer).
   * P. Walstra, J.T.M. Wouters, T.J. Geurts: *Dairy Science and Technology* (CRC Press).
   * F. Kosikowski, V. Mistry: *Cheese and Fermented Milk Foods*.
   * G. Bylund: *Dairy Processing Handbook* (Tetra Pak Processing Systems).
   * Publikacje w recenzowanych czasopismach: *Journal of Dairy Science*, *International Dairy Journal*, *Food Chemistry*.
4. **Szczebel 4 (Publikacje instytutów branżowych i szkół serowarskich):** University of Guelph Dairy Science Technology, University of Wisconsin Center for Dairy Research (CDR), Instytut Innowacji Przemysłu Mleczarskiego.
5. **Szczebel 5 (Tradycja i praktyka zagrodowa):** Doświadczenia mistrzów serowarskich i przepisy regionalne traktowane jako wskazówka wstępna, zawsze poddawana weryfikacji ze szczeblami 1–3.

---

## **2. Rejestr Decyzji Badacza Dziedzinowego (D-01…D-25)**

* **D-01: Odrzucenie sztywnych czasów koagulacji.** Zastąpienie przestarzałego dogmatu „tnij po 45 min” metodą mnożnika flokulacji (Berridge Flocculation Multiplier). Uzasadnienie: zmienność kwasowości i białka w mleku zagrodowym.
* **D-02: Wymóg suplementacji CaCl2 dla mlek pasteryzowanych.** Standard dawkowania: 0.2 g/L bezwodnego chlorku wapnia.
* **D-03: Równowaga potrójna solanki serowarskiej.** Kąpiel solankowa musi posiadać zbuforowane pH (5.2–5.4) oraz dodatek 0.15% CaCl2 w celu ochrony skórki przed śluzowaceniem.
* **D-04: Okno temperaturowe zmaślania śmietanki (10–14°C).** Wymuszenie kontroli temperatury wsadu; blokada zmaślania powyżej 16°C w celu ochrony przed ucieczką ciekłego tłuszczu do maślanki.
* **D-05: Rygor termiczny dogrzewania skrzepu twarogowego (38–42°C).** Ostrzeżenie przed przekroczeniem 44°C (twardy, kredowy twaróg) oraz przed zbyt niską temperaturą <35°C (mazista, nieodsączona masa).
* **D-06: Warunki termiczno-kwasowe koagulacji Ricotty.** Podgrzanie słodkiej serwatki do 85–90°C i korekta pH do poziomu 5.8–6.0 za pomocą kwasu spożywczego.
* **D-07: Przeciwdziałanie defektowi piaszczystości w Brunost.** Nakaz szybkiego schładzania zagęszczonej serwatki w kąpieli lodowej z ciągłym mechanicznym mieszaniem w celu wymuszenia mikro-krystalizacji laktozy.
* **D-08: Standard minimalnego czasu dojrzewania serów z mleka surowego.** Zgodnie z FDA 21 CFR 133 sery z mleka niepasteryzowanego muszą dojrzewać minimum 60 dni w temp. $\ge 2^\circ C$.
* **D-09…D-25:** Dalsze szczegółowe rozstrzygnięcia enzymatyczne i technologiczne.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: D1_Wymagania_Niefunkcjonalne.md -->
<!-- ========================================== -->

# **SEROWAR BRD 0.1 — Rozdziały 9–10: Wymagania Niefunkcjonalne (NFR) i Zgodność z Apple (D1)**

> **Rejestr:** `NFR-OFF-001` do `NFR-TEST-015` (Łącznie 115 wymagań NFR)  
> **Kontekst:** Wytyczne Apple App Store Review (1.4.1, 3.1.2, 4.3, 5.1.1, 5.2.1), standardy WCAG AAA, higiena pamięci SQLite i baterii.

---

### **1. Grupa NFR-OFF: Niezależność Offline (100% Offline-First)**
* **NFR-OFF-001:** Wszystkie funkcje kalkulatorów (IMCU, flokulacja, prasa, solanka, twarogi, masło, jogurt, ricotta, brunost, Cave Log) działają bez połączenia z siecią internetową.
* **NFR-OFF-002:** Baza danych SQLite, silnik wyszukiwania kultur oraz generator kodów QR i plików PDF funkcjonują w pełni lokalnie na urządzeniu.
* **NFR-OFF-003:** Aplikacja nigdy nie wyświetla blokującego monitu o brak sieci internetowej w trakcie wykonywania procedury rzemieślniczej.

### **2. Grupa NFR-BEZP: Prywatność i Bezpieczeństwo Danych**
* **NFR-BEZP-001:** Zero zbierania danych osobowych — certyfikacja „Data Not Collected” w karcie Privacy Nutrition Label w App Store.
* **NFR-BEZP-002:** Brak zewnętrznych SDK śledzących, analitycznych lub reklamowych (Zero Firebase, Facebook SDK, Google Analytics).
* **NFR-BEZP-003:** Baza danych SQLite przechowywana w bezpiecznym katalogu piaskownicy iOS (`/Library/Application Support/SQLite`), wyłączona z publicznego udostępniania i zabezpieczona szyfrowaniem sprzętowym urządzenia (Data Protection Class C).

### **3. Grupa NFR-I18N: Globalna Lokalizacja i Jednostki**
* **NFR-I18N-001:** Pełne wsparcie dla 35 języków, w tym polskiego i angielskiego od wersji 1.0. Zero niezlokalizowanych ciągów tekstowych (bramka CI `npm run check:i18n`).
* **NFR-I18N-002:** Dwukierunkowy konwerter metryczno-imperialny: litry/galony US, gramy/funty/uncje, °C/°F, gęstość g/cm³ / stopnie Baumé / stopnie Salometer.

### **4. Grupa NFR-DOST: Dostępność Cyfrowa (Accessibility / WCAG AAA)**
* **NFR-DOST-001:** Pełna obsługa Apple VoiceOver na 100% ekranów i kontrolek interfejsu.
* **NFR-DOST-002:** Obsługa powiększonego tekstu Dynamic Type do największych rozmiarów dostępnościowych bez obcinania treści i etykiet.
* **NFR-DOST-003:** Minimalny kontrast kolorystyczny tekstu do tła $\ge 4.5:1$ (dla małego tekstu $\ge 7:1$).
* **NFR-DOST-004:** Żadna informacja (np. alert przekwaszenia, stan solanki) nie jest przekazywana wyłącznie za pomocą koloru — zawsze towarzyszy jej czytelna ikona i tekst.

### **5. Grupa NFR-WYD: Wydajność i Efektywność Energetyczna**
* **NFR-WYD-001:** Czas zimnego startu aplikacji (Cold Launch) na iPhone 11 $\le 800\text{ ms}$.
* **NFR-WYD-002:** Renderowanie list i ekranów ze stałą płynnością 60/120 fps bez zacięć (Zero Frame Drops).
* **NFR-WYD-003:** Pomiary timera flokulacji i mieszania zużywają mniej niż 1% baterii na godzinę aktywnego odliczania.

### **6. Grupa NFR-APPLE: Rygorystyczna Zgodność z Wytycznymi App Store**
* **NFR-APPLE-001 (Guideline 1.4.1 — Bezpieczeństwo i Zdrowie):** Aplikacja nie zawiera żadnych medycznych twierdzeń probiotycznych ani dietetycznych. Język opisowy jest czysto technologiczny i biochemiczny.
* **NFR-APPLE-002 (Guideline 3.1.2 — Subskrypcje i Płatności):** Przejrzysty ekran zakupu SEROWAR PRO z wyraźnym oznaczeniem cen, brakiem ukrytych kosztów, automatycznym przywracaniem zakupów (Restore Purchases). Kopia zapasowa i eksport danych są bezpłatne na zawsze.
* **NFR-APPLE-003 (Guideline 4.3 — Brak Spamu):** Aplikacja stanowi unikalny, głęboki kombajn technologiczny (kalkulatory IMCU, flokulacja, Cave Log, relacyjna baza partii), odróżniający się od prostych liczników.
* **NFR-APPLE-004 (Guideline 5.1.1 — Ochrona Danych):** Brak wymogu podawania jakichkolwiek danych osobowych w celu korzystania z aplikacji.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: D2_Architektura_Model_SQLite.md -->
<!-- ========================================== -->

# **SEROWAR BRD 0.1 — Rozdziały 11–12: Architektura Techniczna i Model Relacyjny SQLite (D2)**

> **Architektura:** Expo / React Native, TypeScript Strict Mode, SQLite w trybie WAL  
> **Bezpieczna ścieżka:** `/Library/Application Support/SQLite/serowar.db`  
> **Rotacja kopii:** Automatyczny silnik 10 rotacyjnych kopii JSON (`autoBackup`)

---

## **1. Schemat Bazy Danych DDL (18 Tabel Relacyjnych w SQLite)**

```sql
-- 1. Główna tabela partii mleczarskich
CREATE TABLE IF NOT EXISTS batches (
    id TEXT PRIMARY KEY NOT NULL,
    batch_number TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('HARD_CHEESE', 'SOFT_CHEESE', 'FRESH_CURD', 'BUTTER_GHEE', 'FERMENTED_MILK', 'WHEY_PRODUCT')),
    style_name TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('PREPARING', 'COAGULATING', 'PRESSING', 'BRINING', 'AGING', 'COMPLETED', 'DISCARDED')),
    notes TEXT
);

-- 2. Parametry wsadu mlecznego i koagulacji podpuszczkowej
CREATE TABLE IF NOT EXISTS cheese_batch_details (
    batch_id TEXT PRIMARY KEY NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    milk_type TEXT NOT NULL CHECK(milk_type IN ('COW', 'GOAT', 'SHEEP', 'BUFFALO', 'MIXED')),
    milk_treatment TEXT NOT NULL CHECK(milk_treatment IN ('RAW', 'PASTEURIZED_LOW', 'STORE_MICROFILTERED')),
    milk_volume_liters REAL NOT NULL,
    cacl2_added_grams REAL DEFAULT 0.0,
    rennet_type TEXT NOT NULL,
    rennet_imcu_per_ml REAL NOT NULL,
    rennet_volume_ml REAL NOT NULL,
    flocculation_seconds INTEGER,
    flocculation_multiplier REAL,
    target_cut_seconds INTEGER,
    curd_size_target TEXT,
    cooking_target_temp_c REAL,
    cooking_duration_minutes INTEGER,
    whey_washed_liters REAL DEFAULT 0.0
);

-- 3. Harmonogram i log prasowania sera
CREATE TABLE IF NOT EXISTS pressing_stages (
    id TEXT PRIMARY KEY NOT NULL,
    batch_id TEXT NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    stage_order INTEGER NOT NULL,
    target_pressure_kg_cm2 REAL NOT NULL,
    weight_applied_kg REAL NOT NULL,
    duration_minutes INTEGER NOT NULL,
    turned_and_flipped INTEGER NOT NULL DEFAULT 0,
    completed_at INTEGER
);

-- 4. Kąpiel solankowa krążka sera
CREATE TABLE IF NOT EXISTS brining_logs (
    batch_id TEXT PRIMARY KEY NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    brine_salinity_pct REAL NOT NULL,
    brine_ph REAL NOT NULL,
    cacl2_in_brine_pct REAL NOT NULL,
    started_at INTEGER NOT NULL,
    planned_duration_hours REAL NOT NULL,
    turned_in_brine INTEGER NOT NULL DEFAULT 0,
    completed_at INTEGER
);

-- 5. Kartoteka Cave Log (Dojrzewalnia sera / Affinage)
CREATE TABLE IF NOT EXISTS cave_cheese_wheels (
    id TEXT PRIMARY KEY NOT NULL,
    batch_id TEXT NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    wheel_tag TEXT UNIQUE NOT NULL,
    location_in_cave TEXT NOT NULL,
    initial_weight_grams REAL NOT NULL,
    current_weight_grams REAL NOT NULL,
    rind_type TEXT NOT NULL CHECK(rind_type IN ('NATURAL', 'SMEAR_BREVI', 'BLOOMY_WHITE', 'BLUE_MOLD', 'WAXED', 'OILED')),
    target_aging_days INTEGER NOT NULL,
    last_turned_at INTEGER,
    last_washed_at INTEGER,
    last_brushed_at INTEGER,
    pierced_for_blue_at INTEGER,
    shrinkage_pct REAL DEFAULT 0.0
);

-- 6. Pomiary środowiskowe w komorze dojrzewalniczej (Cave Logs)
CREATE TABLE IF NOT EXISTS cave_environment_logs (
    id TEXT PRIMARY KEY NOT NULL,
    timestamp INTEGER NOT NULL,
    temperature_c REAL NOT NULL,
    humidity_rh_pct REAL NOT NULL,
    dew_point_c REAL NOT NULL,
    sensor_source TEXT NOT NULL CHECK(sensor_source IN ('MANUAL', 'RUUVI_BLE', 'MIJIA_BLE'))
);

-- 7. Parametry produkcji twarogów i serów kwasowych
CREATE TABLE IF NOT EXISTS curd_batch_details (
    batch_id TEXT PRIMARY KEY NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    acidification_method TEXT NOT NULL CHECK(acidification_method IN ('NATURAL_SOURED', 'MESOPHILIC_DVI', 'CITRIC_ACID', 'ACID_WHEY')),
    milk_volume_liters REAL NOT NULL,
    measured_ph REAL,
    heating_temp_c REAL NOT NULL,
    drain_duration_minutes INTEGER NOT NULL,
    pressed_weight_kg REAL,
    final_curd_weight_grams REAL
);

-- 8. Parametry zmaślania śmietanki i ghee
CREATE TABLE IF NOT EXISTS butter_churn_details (
    batch_id TEXT PRIMARY KEY NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    cream_fat_pct REAL NOT NULL,
    cream_volume_liters REAL NOT NULL,
    cream_temperature_c REAL NOT NULL,
    cream_type TEXT NOT NULL CHECK(cream_type IN ('SWEET', 'CULTURED')),
    churn_duration_minutes INTEGER,
    wash_cycles_count INTEGER NOT NULL DEFAULT 3,
    butter_yield_grams REAL,
    buttermilk_yield_ml REAL,
    ghee_yield_grams REAL
);

-- 9. Spiżarnia i inwentarz surowców mleczarskich
CREATE TABLE IF NOT EXISTS pantry_inventory (
    id TEXT PRIMARY KEY NOT NULL,
    item_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('MILK', 'CREAM', 'CULTURE', 'RENNET', 'SALT', 'MINERAL', 'HERB')),
    quantity_available REAL NOT NULL,
    unit TEXT NOT NULL,
    imcu_or_concentration TEXT,
    expiry_date INTEGER,
    cost_per_unit_pln REAL
);

-- 10. Oceny sensoryczne (Radar Smaku Sera)
CREATE TABLE IF NOT EXISTS sensory_evaluations (
    id TEXT PRIMARY KEY NOT NULL,
    batch_id TEXT NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    evaluated_at INTEGER NOT NULL,
    acidity INTEGER CHECK(acidity BETWEEN 1 AND 10),
    salinity INTEGER CHECK(salinity BETWEEN 1 AND 10),
    firmness INTEGER CHECK(firmness BETWEEN 1 AND 10),
    creaminess INTEGER CHECK(creaminess BETWEEN 1 AND 10),
    pungency INTEGER CHECK(pungency BETWEEN 1 AND 10),
    nuttiness INTEGER CHECK(nuttiness BETWEEN 1 AND 10),
    tasting_notes TEXT
);
```

---

## **2. Silnik Kopii Zapasowej (10-Krotna Rotacja JSON)**
Moduł `backup.ts` tworzy po każdej zakończonej sesji zrzut stanu relacyjnego do pliku JSON o formacie:
`serowar_backup_YYYY-MM-DD_HHmmss.json`.
W katalogu `/Library/Application Support/Backups/` utrzymywanych jest ściśle 10 najświeższych kopii, z automatycznym usuwaniem najstarszej.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: D3_Rejestr_Ryzyk_i_Pytania.md -->
<!-- ========================================== -->

# **SEROWAR BRD 0.1 — Rozdziały 14 i 16: Rejestr Ryzyk (RYZ-01…RYZ-50) i Pytania Otwarte (D3)**

> **Kategorie ryzyk:** Sanitarne i biologiczne (SAN), Techniczne i dane (TECH), Zgodność z Apple (APPL), Biznesowe i rynkowe (BIZ).

---

### **1. Kluczowe Ryzyka w Rejestrze**

| ID | Kategoria | Opis ryzyka | Prawd. | Skutek | Plan mitygacji / Działanie obronne |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **RYZ-01** | SAN | **Skażenie mleka surowego patogenami (Listeria monocytogenes, Salmonella, E. coli STEC).** | Niskie | Krytyczny | Rygorystyczny wymóg pasteryzacji LTLT (63°C / 30 min) lub min. 60 dni dojrzewania wg FDA 21 CFR 133. Edukacyjny moduł higieny udoju. |
| **RYZ-02** | TECH | **Utrata wielomiesięcznej historii dojrzewania w Cave Log** przy aktualizacji systemu iOS lub aplikacji. | Średnie | Krytyczny | Baza SQLite WAL w bezpiecznym `/Library/Application Support/SQLite`, 10 rotacyjnych kopii JSON po każdej sesji, bezpłatny eksport do pliku. |
| **RYZ-03** | APPL | **Odrzucenie przez Apple za brak wartości (Guideline 4.3 — Minimum Functionality).** | Niskie | Wysoki | SEROWAR to zaawansowany asystent: stoper flokulacji, Live Activity, relacyjny Cave Log, generowanie PDF, skaner QR, wsparcie BLE. |
| **RYZ-04** | APPL | **Odrzucenie za twierdzenia medyczne (Guideline 1.4.1).** | Średnie | Wysoki | Całkowity zakaz obietnic probiotycznych i leczniczych. Język wyłącznie technologiczny i biochemiczny. |
| **RYZ-05** | SAN | **Zjełczenie masła rzemieślniczego na skutek obecności maślanki.** | Średnie | Średni | Asystent płukania wodą lodową (<5°C) do krystalicznej czystości wody i mechaniczne wyciskanie na desce serowarskiej. |
| **RYZ-06** | SAN | **Zepsucie krążka sera przez skażenie dzikim Mucorem** z powodu nadmiernej wilgotności i braku obracania. | Wysokie | Średni | Algorytm psychrometryczny punktu rosy (RD-06), codzienne powiadomienia o obracaniu, Kompas Diagnostyczny (C1). |
| **RYZ-07** | TECH | **Nasycenie czujników BLE w wilgotności > 90% RH** fałszujące odczyty komory dojrzewalniczej. | Średnie | Średni | Ostrzeżenie w UI o histerezie tanich higrometrów pojemnościowych, instrukcja kalibracji solą nasyconą. |
| **RYZ-08** | BIZ | **Niska konwersja do subskrypcji przy braku zakupu jednorazowego.** | Średnie | Średni | Dostępność opcji Lifetime (14,99 € / 59,99 zł), która w społecznościach rzemieślniczych konwertuje najlepiej. |
| **RYZ-09…50**| RÓŻNE | Dalsze szczegółowe ryzyka technologiczne, solankowe i mikrobiologiczne. | Niskie | Średni | Rozpisane w macierzy audytowej studia Apps4Brew. |

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: D4_Strategia_Testow_Jakosci.md -->
<!-- ========================================== -->

# **SEROWAR BRD 0.1 — Rozdział 17: Dziewięciowarstwowa Strategia Testów i Jakości (D4)**

> **Standard inżynieryjny:** Oparty na rygorystycznym dokumencie `docs/20-definicja-ukonczenia.md` z projektu `trening`.  
> **Zasada właściciela z 06.10.2026:** „Każda funkcjonalność ma mieć przy wdrażaniu pełen zakres zautomatyzowanych testów każdych przypadków i każdego rodzaju”.

---

## **1. Dziewięć Warstw Testów Automatycznych w SEROWAR**

| # | Warstwa testu | Zakres i cel weryfikacji | Narzędzie i pliki |
|---|---|---|---|
| **1** | **Logika (Pure Logic)** | Deterministyczne funkcje matematyczne: dawkowanie podpuszczki IMCU, flokulacja, prasa serowarska, solanka, bilans masła, punkt rosy, kinetyka twarogu. | Jest (`tests/core/*.test.ts`) |
| **2** | **Ekran (Component UI)** | Renderowanie każdego ekranu, interakcje z formularzami, zachowanie przycisków, poprawne formatowanie liczb i jednostek. | React Native Testing Library (`tests/screens/*.test.tsx`) |
| **3** | **Scenariusz (User Journey)** | Kompletny przepływ: od konfiguracji mleka, przez flokulację, prasowanie, solankę, aż po zapis krążka w Cave Log i restart aplikacji. | `tests/scenarios/*.test.tsx` |
| **4** | **Macierz (Matrix Test)** | Iteracja po wszystkich kombinacjach stałych: gatunki mleka × obróbka termiczna × jednostki metryczne/imperialne × 35 języków. | `npm run check:matrix`, `tests/matrix-*.test.ts` |
| **5** | **Niezmienniki (Property & Invariants)** | Testy własności (fast-check): masa soli nigdy nie może być ujemna, czas flokulacji zawsze dodatni, pH w granicach 0–14. | `tests/invariants.test.ts` |
| **6** | **Dane i Persystencja** | Zapis do bazy SQLite WAL $\rightarrow$ restart symulatora $\rightarrow$ weryfikacja integralności. Testy migracji schematu i 10-krotnego backupu. | `tests/db-integrity.test.ts` |
| **7** | **Lokalizacja i i18n** | Weryfikacja kompletności słowników w 35 językach. Zero martwych kluczy i zero brakujących tłumaczeń. | `scripts/check-i18n.mjs`, `tests/i18n.test.ts` |
| **8** | **Regresja Sanitarna** | Każdy zaraportowany błąd biologiczny lub obliczeniowy otrzymuje test regresyjny blokujący build. | `tests/regress.test.ts` |
| **9** | **E2E Maestro na Symulatorze iOS** | Wizualne testy end-to-end w symulatorze: przejście ścieżki serowara, tapnięcia zegarkowe, generowanie etykiety PDF. | Maestro (`.maestro/*.yaml`) |

---

## **2. Bramka Jakościowa Verify (`npm run verify`)**
Przed każdym zatwierdzeniem kodu i wysłaniem do repozytorium GitHub uruchamiany jest kompletny pipeline sprawdzający:
1. `npm run typecheck` (rygor TypeScript zero błędów).
2. `npm run check:i18n` (spójność kluczy językowych).
3. `npm run matrix:check` (pełne pokrycie macierzy wymiarów).
4. `npm run test` (kompletny zestaw testów Jest ze 100% PASS).
5. `npm run check:cycles` (zero cykli importów).
6. `npm run check:licenses` (legalność licencji open source).

---
