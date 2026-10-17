# -*- coding: utf-8 -*-
"""
Generator for SEROWAR BRD 0.1 - Part 00 and Part A
Apps4Brew Studio | October 2026
"""
import os

OUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "docs", "brd")
os.makedirs(OUT_DIR, exist_ok=True)

# -------------------------------------------------------------
# 1. 00_START.md
# -------------------------------------------------------------
f00_start = os.path.join(OUT_DIR, "00_START.md")
with open(f00_start, "w", encoding="utf-8") as f:
    f.write("""# **SEROWAR (Rzemieślnicze Przetwórstwo Mleka) — Wymagania biznesowe (BRD), wersja robocza 0.1, 17.10.2026**

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
""")

print("Zapisano 00_START.md")

# -------------------------------------------------------------
# 2. 00b_Jedna_lista_decyzji.md
# -------------------------------------------------------------
f00b_dec = os.path.join(OUT_DIR, "00b_Jedna_lista_decyzji.md")
with open(f00b_dec, "w", encoding="utf-8") as f:
    f.write("""# **SEROWAR BRD 0.1 — 00b Jedna lista decyzji i pytań (DEC-BA-01…02, DEC-01…DEC-45)**

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
""")

print("Zapisano 00b_Jedna_lista_decyzji.md")

# -------------------------------------------------------------
# 3. 00c_Sprzecznosci_i_weryfikacja.md
# -------------------------------------------------------------
f00c_err = os.path.join(OUT_DIR, "00c_Sprzecznosci_i_weryfikacja.md")
with open(f00c_err, "w", encoding="utf-8") as f:
    f.write("""# **SEROWAR BRD 0.1 — 00c Sprzeczności dziedzinowe, normy i weryfikacja merytoryczna**

Dokument przedstawia analizę sprzeczności występujących w tradycyjnej literaturze mleczarskiej, forach serowarskich i podręcznikach rzemiosła, rozstrzygniętych przez badacza dziedzinowego na podstawie 5-szczeblowej hierarchii źródeł (IDF, FAO, Codex Alimentarius dla mleka i przetworów mlecznych, literatura akademicka Fox, Kosikowski, Walstra, Bylund).

---

## **1. Serowarstwo: Mleko i chemia koagulacji**

### **Sprzeczność S-01: Chlorek wapnia ($CaCl_2$) — dodawać zawsze czy tylko do mleka pasteryzowanego?**
* **Problem w źródłach:** Część forów zaleca dodawanie chlorku wapnia do każdego mleka „na wszelki wypadek”. Inne źródła ostrzegają przed gorzkim smakiem i nadmierną kruchością skrzepu.
* **Rozstrzygnięcie badawcze:** Pasteryzacja termiczna powoduje wytrącanie rozpuszczalnego fosforanu wapnia do formy koloidalnej, co drastycznie osłabia mostki wapniowe między micelami kazeiny i wydłuża czas koagulacji. W mleku surowym, świeżym od krowy/kozy, poziom jonów $Ca^{2+}$ jest fizjologicznie optymalny.
* **Zasada w SEROWAR (RD-03):** 
  * Dla mleka pasteryzowanego/sklepowego: rekomendowany dodatek $0.2 - 0.3\\text{ g}$ bezwodnego $CaCl_2$ na 1 litr mleka (lub $0.6 - 0.9\\text{ ml}$ roztworu 33% na 10 litrów).
  * Dla mleka surowego: dodatek $0.0 - 0.1\\text{ g/L}$, zalecany tylko w okresie zimowym przy ubogiej paszy.
  * Ostrzeżenie górnego limitu: przekroczenie $0.4\\text{ g/L}$ blokuje partię z uwagi na defekt metaliczno-gorzkiego smaku.

### **Sprzeczność S-02: Dawkowanie podpuszczki — czas stały vs metoda flokulacji**
* **Problem w źródłach:** Przepisy tradycyjne podają: „dodaj 1 ml podpuszczki i odczekaj 45 minut”. W praktyce aktywność enzymatyczna spada z czasem, a mleko różni się zawartością kazeiny i kwasowością, co powoduje zacinanie skrzepu lub jego przepróchnienie.
* **Rozstrzygnięcie badawcze:** Standard światowy (metoda Berridge'a / Flocculation Multiplier) opiera się na wyznaczeniu **punktu flokulacji** (pierwsze widoczne mikroskopowe zżelowanie, sprawdzane obracającą się lekką miseczką na powierzchni mleka). Czas do flokulacji ($t_f$, zazwyczaj 10–18 min) mnoży się przez współczynnik flokulacji $M$ dedykowany dla danego typu sera.
* **Zasada w SEROWAR (RD-04):** Aplikacja odrzuca sztywne czasy oczekiwania. Wdraża stoper flokulacji: całkowity czas od zaprawienia do cięcia $= t_f \\times M$.
  * Twarde/alpejskie (Parmesan, Gruyère): $M = 2.0 - 2.5$.
  * Półtwarde (Gouda, Tilsit): $M = 3.0 - 3.5$.
  * Miękkie/pleśniowe (Camembert, Brie): $M = 4.0 - 5.0$.
  * Kwasowo-podpuszczkowe: $M = 6.0$.

### **Sprzeczność S-03: Kąpiel solankowa — nasycenie solanki, pH i wapń**
* **Problem w źródłach:** Tradycyjne przepisy zalecają „zrób solankę z wody i soli, aż jajko wypłynie”. Taka solanka rozpuszcza wapń ze skórki sera, powodując jej śluzowacenie (rozpad zewnętrznej warstwy białka) oraz zakażenia mikrobiologiczne z powodu zbyt wysokiego pH wody kranowej.
* **Rozstrzygnięcie badawcze:** Prawidłowa solanka serowarska musi znajdować się w stanie potrójnej równowagi:
  1. **Nasycenie solą:** 18–22% NaCl (gęstość 1.13–1.16 g/cm³, 19–21° Baumé). W solance < 16% namnażają się drożdże i bakterie gnilne.
  2. **Równowaga pH:** pH solanki musi być zbliżone do pH solonego sera (pH 5.2–5.4). Solanka z czystej wody (pH 7.0) wyciąga kwas i rozmiękcza kazeinę.
  3. **Równowaga wapniowa:** dodatek $0.1 - 0.2\\%\\ CaCl_2$ zapobiega wymywaniu wapnia ze skórki krążka.
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
* **Rozstrzygnięcie badawcze:** Białka serwatkowe ($\beta$-laktoglobulina, $\alpha$-laktoalbumina) denaturują w wysokiej temperaturze ($85-92^\circ C$) pod warunkiem optymalnego pH ($5.8-6.1$). Serwatka słodka podpuszczkowa ma pH ok. 6.2–6.4 i wymaga lekkiego dokwaszenia kwasem cytrynowym/octowym lub odrobiną kwaśnej serwatki przy $85^\circ C$. Czysta serwatka daje delikatną ricottę, a dodatek 5–10% mleka pełnego radykalnie zwiększa wydajność i kremowość.
* **Zasada w SEROWAR (RD-28):** Precyzyjne sterowanie kwasowością i temperaturą termicznej denaturacji serwatki.

### **Sprzeczność S-08: Norweski Brunost / Mysost — karmelizacja vs przypalenie laktozy**
* **Problem w źródłach:** Gwałtowne gotowanie odparowujące na dużym ogniu powoduje przypalenie dna, gorzki smak i grudkowatą krystalizację laktozy.
* **Rozstrzygnięcie badawcze:** Odparowanie 80–90% wody z serwatki w temperaturze wrzenia, dodatek śmietanki, a następnie intensywne mieszanie w $100-105^\circ C$, gdzie reakcja Maillarda nadaje charakterystyczny bursztynowo-brązowy kolor i toffi/karmelowy posmak. Bardzo szybkie schładzanie z ciągłym mieszaniem zapobiega powstawaniu wyczuwalnych ziaren laktozy (tzw. "piaszczystość").
* **Zasada w SEROWAR (RD-29):** Kalkulator odparowania suchej masy serwatki i profil termiczny karmelizacji.
""")

print("Zapisano 00c_Sprzecznosci_i_weryfikacja.md")

# -------------------------------------------------------------
# 4. A1_rozdz_1_3_Wizja_Problem_Persony.md
# -------------------------------------------------------------
fa1 = os.path.join(OUT_DIR, "A1_rozdz_1_3_Wizja_Problem_Persony.md")
with open(fa1, "w", encoding="utf-8") as f:
    f.write("""# **SEROWAR BRD 0.1 — Część A: Wizja, Problem, Persony (Rozdziały 1–3)**

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
""")

print("Zapisano A1_rozdz_1_3_Wizja_Problem_Persony.md")

# -------------------------------------------------------------
# 5. A2_rozdz_4_6_1_Rynek_Przychod_Zakres.md
# -------------------------------------------------------------
fa2 = os.path.join(OUT_DIR, "A2_rozdz_4_6_1_Rynek_Przychod_Zakres.md")
with open(fa2, "w", encoding="utf-8") as f:
    f.write("""# **SEROWAR BRD 0.1 — Część A: Rynek, Model Przychodu i Zakres (Rozdziały 4–6.1)**

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
""")

print("Zapisano A2_rozdz_4_6_1_Rynek_Przychod_Zakres.md")

# -------------------------------------------------------------
# 6. A3a, A3b, A3c, A4
# -------------------------------------------------------------
fa3a = os.path.join(OUT_DIR, "A3a_rozdz_6_2_Tabela_zakresu_cz1.md")
with open(fa3a, "w", encoding="utf-8") as f:
    f.write("""# **SEROWAR BRD 0.1 — Tabela Zakresu: Część 1 (Serowarstwo Podpuszczkowe i Cave Log)**

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
| **Z-012** | Koagulacja i Flokulacja | Kalkulator całkowitego czasu koagulacji oparty o współczynnik flokulacji $M$ ($t_{cut} = t_f \\times M$) | MUST | MVP |
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
""")

print("Zapisano A3a_rozdz_6_2_Tabela_zakresu_cz1.md")

fa3b = os.path.join(OUT_DIR, "A3b_rozdz_6_2_Tabela_zakresu_cz2.md")
with open(fa3b, "w", encoding="utf-8") as f:
    f.write("""# **SEROWAR BRD 0.1 — Tabela Zakresu: Część 2 (Twarogi, Masło, Napoje Mleczne, Serwatka, Platforma)**

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
| **Z-137** | Obieg Serwatki | Ricotta rzemieślnicza: termiczna denaturacja albumin i globulin serwatkowych ($T \\ge 85^\\circ C$, pH 5.8–6.0) | MUST | MVP |
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
""")

print("Zapisano A3b_rozdz_6_2_Tabela_zakresu_cz2.md")

fa3c = os.path.join(OUT_DIR, "A3c_Etapy_Naklad_Warianty.md")
with open(fa3c, "w", encoding="utf-8") as f:
    f.write("""# **SEROWAR BRD 0.1 — Część A: Etapy Wdrożenia, Nakład Pracy i Warianty (Rozdziały 6.3–6.5)**

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
""")

print("Zapisano A3c_Etapy_Naklad_Warianty.md")

fa4 = os.path.join(OUT_DIR, "A4_rozdz_13_15_KPI_Marketing_ASO.md")
with open(fa4, "w", encoding="utf-8") as f:
    f.write("""# **SEROWAR BRD 0.1 — Część A: KPI, Marketing i ASO (Rozdziały 13 i 15)**

> **Ekosystem:** Apps4Brew Studio | **Projekt:** SEROWAR (Rzemieślnicze Przetwórstwo Mleka)

---

## **Rozdział 13. Prywatne Wskaźniki Sukcesu (KPI bez śledzenia użytkownika)**

Zgodnie z zasadą **ZP-03** aplikacja SEROWAR nie zawiera żadnych skryptów szpiegujących ani zewnętrznych SDK telemetrycznych. Wskaźniki sukcesu mierzone są wyłącznie za pomocą anonimowych metryk dostarczanych przez **Apple App Store Connect** oraz wskaźników lokalnych przechowywanych w urządzeniu użytkownika:

1. **Konwersja App Store (Store Conversion Rate):**
   * *Cel:* $\\ge 5.0\\%$ konwersji odsłon karty produktowej w pobranie aplikacji (wysoka intencja użytkowników szukających kalkulatora podpuszczki i serowarstwa).
   * *Narzędzie:* App Store Connect Analytics.
2. **Wskaźnik Awaryjności (Crash-Free Sessions):**
   * *Cel:* $\\ge 99.8\\%$ sesji wolnych od awarii.
   * *Narzędzie:* Apple Xcode Organizer Crash Reports.
3. **Wskaźnik Retencji Długoterminowej (Cave Log Retention):**
   * *Cel:* Średni czas życia partii sera w Cave Log $\\ge 60$ dni (dowód, że użytkownicy rzeczywiście pielęgnują dojrzewające krążki przy asyście aplikacji).
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
""")

print("Zapisano A4_rozdz_13_15_KPI_Marketing_ASO.md")
