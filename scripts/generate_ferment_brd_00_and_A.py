# -*- coding: utf-8 -*-
"""
Generator for FERMENT BRD 0.1 - Part 00 and Part A
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
    f.write("""# **FERMENT (Ser i Flora / Mikrobiologia Domowa) — Wymagania biznesowe (BRD), wersja robocza 0.1, 16.10.2026**

**Status:** wersja robocza do akceptacji właściciela. Sprawy produktowe i biznesowe czekają na Twoje decyzje (sekcja 4, DEC-01…DEC-45). Sprawy merytoryczne (biochemia koagulacji kazeiny, kinetyka enzymatyczna chymozyny IMCU, fizjologia kultur bakterii mezofilnych, termofilnych i maziowych Brevibacterium linens, dynamika wilgotności względnej jaskini dojrzewalniczej, ekologia mikrobiologiczna kiszonek, kombuchy i żywych octów, bariera botulinowa pH 4.6 oraz normy sanitarne IDF/FAO/USDA) rozstrzyga badacz według 5-szczeblowej hierarchii źródeł studia Apps4Brew. Każdą taką decyzję możesz zawetować.  
**Autor:** analityk biznesowy (koordynujący) studia Apps4Brew. Części A–D napisali analitycy produktu i badacz dziedzinowy serowarstwa i biochemii fermentacji.

---

## **1. Jak czytać ten dokument**

### **Części dokumentu**

| Plik | Rozdziały | Zawartość |
| :--- | :--- | :--- |
| **00_START** (ten plik) | — | Streszczenie wykonawcze dla właściciela, warianty pierwszej wersji MVP, jedna lista decyzji (DEC-01…DEC-45), warunki brzegowe, spis treści i statystyki dokumentu. |
| **00b_Jedna_lista_decyzji** | — | Zbiorcza lista decyzji produktowych i technicznych DEC-01…DEC-45 z podziałem na bloki decyzyjne i rekomendacjami analityka. |
| **00c_Sprzecznosci_i_weryfikacja** | — | Sprzeczności dziedzinowe i errata: chlorek wapnia w mleku surowym vs pasteryzowanym, nasycenie solanki 18% vs 22%, pomiar pH vs Soxhlet-Henkel (°SH), psychrometria dojrzewalni, barierowe pH kiszonek, 1F/2F kombuchy. |
| **A1_Wizja_Problem_Persony** | 1–3 | Wizja i 16 nienegocjowalnych zasad produktu (ZP-01…16), dogłębna analiza problemu z cytatami i dowodami, 8 person (P1–P8) oraz 15 sytuacji życiowych (SYT-01…15). |
| **A2_Rynek_Przychod_Zakres** | 4–6.1 | Analiza rynku serowarstwa zagrodowego i domowej mikrobiologii (USA, Polska, Francja, Włochy, DACH), model przychodowy Apps4Brew (0,99 € / 4,99 € / 14,99 €), zwrot opłaty 99 USD Apple. |
| **A3a_Tabela_Zakresu_cz1** | 6.2 | Tabela zakresu Z-001…Z-120: Serowarstwo (mleko, CaCl2, kultury DVI, koagulacja IMCU, flokulacja, gęstwa, solanka, dojrzewalnia Cave Log). |
| **A3b_Tabela_Zakresu_cz2** | 6.2 | Tabela zakresu Z-121…Z-240: Kiszonki warzywne, kimchi, zakwasy, kombucha 1F/2F, octy żywe, spiżarnia, etykiety QR, sensoryka, Apple Watch, Garmin, sensory BLE. |
| **A3c_Etapy_Naklad_Warianty** | 6.3–6.5 | Etapy wdrożenia (MVP, 1.1, 1.2, 2.x, badanie, nigdy), nakład pracy agentów w dniach, warianty startowe. |
| **A4_KPI_Marketing_ASO** | 13, 15 | Prywatne KPI bez śledzenia użytkownika, strategia ASO dla serowarstwa i fermentacji, kręgi dotarcia i kanały organiczne. |
| **B1_Narzedzia_Kalkulator_Serowara** | 7 (narzędzia) | Wymagania BR-SER-001…035: dobór mleka, titracja CaCl2, kultury mezofilne/termofilne, dawkowanie podpuszczki IMCU, stoper i mnożnik flokulacji (Flocculation Multiplier). |
| **B2_Narzedzia_Obrobka_Skrzepu_Prasowanie** | 7 (narzędzia) | Wymagania BR-CURD-001…030: cięcie skrzepu harfą, dogrzewanie gęstwy, odpływ serwatki, formowanie, kalibracja prasy i harmonogramy obciążeń (kg/cm², PSI). |
| **B3_Narzedzia_Solenie_i_Solanki** | 7 (narzędzia) | Wymagania BR-SOL-001…025: solenie na sucho, nasycona kąpiel solankowa, kontrola gęstości (°Bé, Salometer), buforowanie kwasowości i wapnia solanki. |
| **B4_Narzedzia_Cave_Log_Dozor_Dojrzewania** | 7 (narzędzia) | Wymagania BR-CAVE-001…040: Dziennik dojrzewalni (Cave Log), harmonogramy obracania, pielęgnacja skórki (maziowe B. linens, pleśniowe Penicillium, woskowanie), alerty psychrometryczne, ubytek wagi (% shrinkage). |
| **B5_Narzedzia_Kiszonki_Kimchi_Zakwasy** | 7 (narzędzia) | Wymagania BR-KISZ-001…035: solanki wagowe i objętościowe, zasalanie kapusty kimchi, 3 fazy LAB (Leuconostoc -> L. plantarum -> L. brevis), zapobieganie drożdżom kożuchującym (Kahm). |
| **B6_Narzedzia_Kombucha_i_Octy** | 7 (narzędzia) | Wymagania BR-KOM-001…030: kombucha 1F (SCOBY, kwasowość, cukier) i 2F (nagazowanie beztlenowe, ciśnienie CO2), 2-stopniowa fermentacja octowa (drożdże -> Acetobacter). |
| **B7_Narzedzia_Spizarnia_Naczynia_Etykiety** | 7 (narzędzia) | Wymagania BR-MAG-001…030: spiżarnia z auto-odpisem surowców, paszporty kręgów sera i słoików z kodami QR, wydruki PDF (expo-print), kalkulator kosztu kręgu i wydajności z litra mleka. |
| **B8_Narzedzia_Zegarki_LiveActivity_Sensory** | 7 (narzędzia) | Wymagania BR-SYS-001…030: Apple Watch & Garmin ("ręce w serwatce"), Live Activity koagulacji i obracania, integracja z czujnikami BLE (RuuviTag/Mijia), radar sensoryczny SVG. |
| **C1_Nauka_Szkola_Serowarstwa_i_Fermentacji** | 7 (nauka) | Wymagania BR-EDU-001…040: interaktywne moduły edukacyjne, kompas diagnostyczny defektów sera (wzdęcia wczesne/późne, gorzknienie, śluzowatość), diagnostyk chorób kiszonek i kombuchy. |
| **C2_Reguly_Dziedzinowe_Serowarstwo** | 8 (reguły) | Reguły RD-01…RD-25: wzory matematyczne koagulacji, IMCU, mnożnika flokulacji, dawkowania CaCl2, gęstości solanki, nacisku prasy, wilgotności względnej i punktu rosy z wektorami testowymi. |
| **C3_Reguly_Dziedzinowe_Kiszonki_i_Napoje** | 8 (reguły) | Reguły RD-26…RD-50: równania stechiometryczne kwasu mlekowego i octowego, kinetyka spadku pH, barierowość botulinowa, bilans Brix -> Etanol -> Kwas octowy. |
| **C4_Proces_Tresci_i_Decyzje_Badacza** | 8.P (proces) | Rejestr decyzji badawczych D-01…D-25, 5-szczeblowa hierarchia źródeł (IDF, FAO, USDA, podręczniki akademickie serowarstwa i mikrobiologii), procedury empirycznej weryfikacji. |
| **D1_Wymagania_Niefunkcjonalne** | 9–10 | Wymagania NFR-001…NFR-115: 100% Offline-First, i18n 35 języków, standardy dostępności WCAG AAA / VoiceOver, wydajność na słabych urządzeniach, zgodność z Apple Review. |
| **D2_Architektura_Model_SQLite** | 11–12 | Pełny schemat relacyjny SQLite (18 tabel) w trybie WAL, bezpieczna ścieżka `/Library/Application Support/SQLite`, silnik 10-krotnej rotacji kopii zapasowych JSON, migracje schematu. |
| **D3_Rejestr_Ryzyk_i_Pytania** | 14, 16 | Rejestr 50 ryzyk sanitarnych, technicznych i biznesowych (RYZ-01…RYZ-50) z prawdopodobieństwem, skutkiem i mitygacją, otwarte pytania i warunki brzegowe. |
| **D4_Strategia_Testow_Jakosci** | 17 | 9-warstwowa strategia testów wg wzorca Trening (logika, ekran, scenariusz, macierz, niezmienniki, dane, języki/wygląd, regresja, E2E Maestro), testy mutacyjne Stryker. |

### **Oznaczenia identyfikatorów**
* **BR-xxx-nnn**: wymaganie funkcjonalne (np. `BR-SER-001`, `BR-CAVE-005`, `BR-KISZ-010`, `BR-KOM-003`). Każde posiada mierzalne kryteria akceptacji, personę, priorytet (**MUST / SHOULD / COULD**) i etap (**MVP / 1.1 / 1.2 / 2.x / badanie / nigdy**).
* **NFR-xxx-nnn**: wymaganie niefunkcjonalne (kody: `OFF` – offline, `I18N` – lokalizacja, `DOST` – dostępność VoiceOver, `WYG` – UI/UX, `WYD` – wydajność, `DANE` – integralność bazy, `BEZP` – bezpieczeństwo/prywatność, `ZEG` – zegarki, `TEST` – jakość kodu).
* **RD-nn**: reguła dziedzinowa – deterministyczny wzór matematyczny, enzymatyczny lub mikrobiologiczny z wektorami testowymi.
* **RYZ-nn**: ryzyko sanitarne, produktowe lub techniczne.
* **DEC-nn**: decyzja produktowa lub biznesowa dla właściciela.
* **Z-nnn**: wiersz tabeli zakresu.

---

## **2. Streszczenie dla właściciela**

### **Co to jest aplikacja FERMENT (Ser i Flora / Mikrobiologia Domowa)**
**FERMENT** to profesjonalny, kieszonkowy asystent domowego serowarstwa zagrodowego oraz zaawansowanej fermentacji warzywno-napojowej (kimchi, zakwasy, kombucha, żywe octy), stworzony w standardzie rzemieślniczym studia Apps4Brew na wzór aplikacji **Napar** (kawa specialty/herbata), **Piekarz** (piekarstwo rzemieślnicze i zakwas) oraz **Słoik** (przetwórstwo i pasteryzacja).

Głównym problemem użytkownika w tej dziedzinie jest **brak kontroli nad niewidzialnymi procesami mikrobiologicznymi i enzymatycznymi o długim horyzoncie czasowym (od kilku godzin do 12 miesięcy)**. Błąd w temperaturze o 2°C, przedawkowanie podpuszczki o 0.5 ml, spadek wilgotności w piwniczce o 10% lub pominięcie obrotu sera w 5. dobie leżakowania skutkuje zepsuciem drogocennego surowca (20–50 litrów mleka zagrodowego) lub powstaniem niebezpiecznych wad (gorzki smak, gnicie skórki, zakażenia bakteriofagami czy wzdęcia wczesne).

Aplikacja rozwiązuje ten problem poprzez:
1. **Precyzyjny Kalkulator Serowara:** przeliczanie dawek podpuszczki w międzynarodowych jednostkach krzepnięcia IMCU, titrację chlorku wapnia ($CaCl_2$) dla mleka sklepowego/pasteryzowanego w celu odbudowy miceli kazeinowych, dobór kultur starterowych (mezofilnych vs termofilnych) oraz dynamiczny stoper koagulacji oparty o metodę mnożnika flokulacji (Flocculation Multiplier method).
2. **Dziennik Dojrzewania Sera (Cave Log / Affinage Journal):** rejestrację mikroklimatu jaskini dojrzewalniczej/chłodziarki (temperatura, wilgotność względna, punkt rosy), automatyczny harmonogram pielęgnacji skórki (przemywanie solanką z *Brevibacterium linens*, rozwój porostu pleśni szlachetnych *Penicillium camemberti* / *roqueforti*, woskowanie, oliwienie), alerty obracania krążków oraz monitorowanie ubytku masy (% shrinkage).
3. **Zaawansowany Asystent Kiszonek, Kombuchy i Octów:** precyzyjne solanki wagowe bazujące na całkowitej masie nastawu warzywnego, kontrolę 3 faz fermentacji mlekowej (LAB), kalkulator dwuetapowej fermentacji kombuchy (1F tlenowa ze SCOBY -> 2F butelkowa refermentacja CO2) oraz dwufazowej produkcji octów żywych (fermentacja alkoholowa drożdży -> tlenowa oksydacja kwasu octowego przez *Acetobacter*).
4. **Ekosystem Hands-Free i Sensory:** Apple Watch i Garmin dla serowara o dłoniach oblepionych serwatką i solanką, powiadomienia Live Activity na zablokowanym ekranie oraz opcjonalny odczyt z bezprzewodowych czujników BLE (RuuviTag, Xiaomi Mijia).

Aplikacja działa w **100% Offline-First, bez konta, bez serwera, bez telemetrii i reklam**, w 35 językach.

### **Dla kogo (Persony główne)**
* **Janusz (48 lat, właściciel małego gospodarstwa zagrodowego / serowar domowy):** przerabia 30–60 litrów mleka krowiego i koziego tygodniowo (Gouda, Koryciński, Cheddar, Tomme). Potrzebuje kalkulatora IMCU podpuszczki, ścisłego timera flokulacji, harmonogramu nacisku prasy i rejestru krążków w dojrzewalni z przypomnieniami o obracaniu.
* **Marta (33 lata, entuzjastka fermentacji, mieszkanka Warszawy):** przygotowuje tradycyjne kimchi, zakwas z buraków oraz domową kombuchę w słojach 5L. Potrzebuje kalkulatora solanki wagowej, kontroli ciśnienia i nasycenia CO2 w butelkach kombuchy oraz diagnostyka kożucha fermentacyjnego vs pleśń.
* **Michał (39 lat, szef kuchni restauracji rzemieślniczej):** eksperymentuje z żywymi octami jednoodmianowymi (jabłkowy, malinowy, piwny) oraz serami dojrzewającymi z przerostem niebieskiej pleśni. Potrzebuje stechiometrii przemiany alkoholu w kwas octowy i ścisłego monitora pH.
* **Pani Maria (64 lata, miłośniczka tradycyjnego twarogu i serów podpuszczkowych):** potrzebuje prostego, czytelnego widoku z dużymi literami (Dynamic Type), który przypomni jej, o której godzinie wyjąć ser z solanki i jak dogrzać skrzep.

### **Liczby dokumentu FERMENT BRD**

| Element | Liczba | Podział |
| :--- | :--- | :--- |
| **Wymagania funkcjonalne BR** | **315** | B1 (Serowar) 35 · B2 (Skrzep i Prasa) 30 · B3 (Solanki) 25 · B4 (Cave Log) 40 · B5 (Kiszonki) 35 · B6 (Kombucha i Octy) 30 · B7 (Spiżarnia i Koszty) 30 · B8 (Zegarki, Live Activity, Sensory) 30 · C1 (Szkoła i Diagnostyka) 40 · Garmin/BLE 20 |
| **Priorytety BR** | MUST 152 · SHOULD 105 · COULD 58 | w MVP: 148 BR (MUST 124, SHOULD 24) |
| **Wymagania niefunkcjonalne NFR** | **115** | OFF 10 · I18N 12 · DOST 15 · WYG 10 · WYD 12 · DANE 16 · BEZP 20 · ZEG 10 · TEST 10 |
| **Reguły dziedzinowe RD** | **50** | RD-01…RD-25 (Serowarstwo i Affinage) · RD-26…RD-50 (Kiszonki, Kombucha, Octy) z kompletnymi wektorami testowymi |
| **Rejestr ryzyk RYZ** | **50** | Sanitarne, mikrobiologiczne, techniczne i regulacyjne Apple (App Store Review) |
| **Jedna lista decyzji DEC** | **45** | DEC-01…DEC-45 podzielone na 4 bloki wdrożeniowe |
| **Decyzje badacza D** | **25** | D-01…D-25 rozstrzygające parametry mikrobiologiczne i enzymatyczne |
| **Tabela zakresu Z** | **240** | Z-001…Z-240 z podziałem na etapy (MVP, 1.1, 1.2, 2.x, badanie, nigdy) |
""")

print("Zapisano 00_START.md")

# -------------------------------------------------------------
# 2. 00b_Jedna_lista_decyzji.md
# -------------------------------------------------------------
f00b_dec = os.path.join(OUT_DIR, "00b_Jedna_lista_decyzji.md")
with open(f00b_dec, "w", encoding="utf-8") as f:
    f.write("""# **FERMENT BRD 0.1 — 00b Jedna lista decyzji i pytań (DEC-01…DEC-45)**

Niniejszy dokument gromadzi wszystkie otwarte decyzje produktowe, biznesowe i inżynieryjne dla projektu FERMENT.  
**Zasada podejmowania decyzji:** Właściciel podejmuje decyzje produktowe i biznesowe (wygląd, koszty, priorytety, etapy wydań). Kwestie merytoryczne i mikrobiologiczne rozstrzyga badacz według 5-szczeblowej hierarchii źródeł studia. Decyzje oznaczone symbolem ⚙ posiadają jasną rekomendację techniczną – wystarczy komenda „zgoda na rekomendacje ⚙”.

---

## **Blok I — Przed startem budowy (Tydzień 0)**

### **DEC-01 Jaki zakres funkcjonalny wchodzi do MVP?**
* **Kontekst:** Pełny zakres to 315 wymagań BR. Budowa całości naraz wydłuży czas do pierwszego TestFlight do 8–10 tygodni.
* **Opcje:**
  * **A (Pełne MVP):** Kompletny kalkulator serowara, Cave Log, kiszonki, kombucha i octy (148 BR, ~4–5 tyg. pracy agenta).
  * **B+ (Rekomendowana):** Kluczowy rdzeń serowarski (kalkulator IMCU, flokulacja, prasa, solanka, Cave Log) + kalkulator kiszonek i kimchi (124 BR MUST + 10 SHOULD, ~3–4 tyg. pracy agenta). Kombucha i zaawansowane octy jako etap 1.1.
  * **C (Samo serowarstwo):** Wyłącznie moduł sera (90 BR, ~2.5 tyg.), ale ryzyko odrzucenia przez część użytkowników fermentacji warzywnej.
* **Rekomendacja:** **B+**. Zapewnia natychmiastową unikalność rynkową i spójność mikrobiologiczną.

### **DEC-02 Integracja z bezprzewodowymi czujnikami BLE (RuuviTag, Mijia) w MVP czy w 1.1?**
* **Kontekst:** Użytkownicy piwniczek serowych i komór dojrzewalniczych często stosują termohigrometry BLE. Odczyt bezpośredni w aplikacji eliminuje konieczność ręcznego wpisywania temperatury i wilgotności.
* **Opcje:**
  * **A (W MVP):** Bezpośredni skaner BLE broadcast (pakiet reklamowy Manufacturer Data) dla RuuviTag i Xiaomi Mijia. (+3–4 dni pracy).
  * **B (W 1.1 z ręcznym wprowadzaniem w MVP):** W MVP użytkownik wpisuje odczyty z higrometru ręcznie; w 1.1 dochodzi auto-odczyt BLE.
* **Rekomendacja:** **B** ⚙. Ręczne wprowadzanie jest w 100% niezawodne i nie wymaga fizycznego sprzętu do testów CI.

### **DEC-03 Aplikacja towarzysząca na Apple Watch w MVP?**
* **Kontekst:** Praca ze skrzepem serowym i solanką oznacza mokre dłonie („ręce w serwatce”). Dotykanie ekranu iPhone'a jest uciążliwe.
* **Opcje:**
  * **A (Pełna aplikacja watchOS w MVP):** Stoper flokulacji, podgląd parametrów dojrzewalni, obracanie sera jednym tapnięciem na nadgarstku.
  * **B (Live Activity + powiadomienia interaktywne):** Na zegarku pojawia się widżet Smart Stack / Live Activity z przyciskiem akcji; pełna aplikacja watchOS w wersji 1.1.
* **Rekomendacja:** **B** ⚙. Live Activity doskonale obsługuje timery flokulacji i mieszania bez kosztów osobnego celu watchOS w pierwszym sprincie.

### **DEC-04 Bundle ID aplikacji**
* **Kontekst:** Identyfikator w App Store Connect jest niezmienny po pierwszym wydaniu.
* **Opcje:**
  * **A:** `com.apps4brew.ferment` (neutralne, zunifikowane z domeną marki Apps4Brew).
  * **B:** `com.apps4brew.cheeseandflora` (bardziej opisowe, ale dłuższe).
* **Rekomendacja:** **A** ⚙.

### **DEC-05 Półka cenowa i monetyzacja**
* **Kontekst:** Zgodnie z etosem Apps4Brew („tańsze niż espresso”, bez reklam, bez konta).
* **Opcje:**
  * **A:** 0,99 € / 3,99 zł miesięcznie, 4,99 € / 19,99 zł rocznie, 14,99 € / 59,99 zł dożywotnio (Lifetime).
  * **B:** Tylko jednorazowy zakup 9,99 € / 39,99 zł bez subskrypcji.
* **Rekomendacja:** **A** ⚙. Zapewnia stałą relację z użytkownikami całorocznymi i natychmiastowy zwrot opłaty 99 USD Apple.

---

## **Blok II — W pierwszych 2 tygodniach budowy**

### **DEC-06 Obsługa mleka sklepowego z dodatkiem CaCl2 vs wyłącznie mleko surowe**
* **Kontekst:** Wielu początkujących w miastach ma dostęp tylko do mleka pasteryzowanego w niskiej temperaturze (mikrofiltrowanego). Wymaga ono suplementacji jonów wapnia $Ca^{2+}$.
* **Rekomendacja:** Wsparcie obu wariantów od pierwszego dnia. Algorytm kalkulatora musi automatycznie dobierać dawkę $CaCl_2$ (0.1–0.4 g/L).

### **DEC-07 Domyślna jednostka mocy podpuszczki (IMCU vs 1:10 000)**
* **Kontekst:** Starsza literatura polska operuje stosunkiem objętościowym (np. 1:10 000), a standard międzynarodowy IDF 157 operuje jednostkami IMCU/ml lub IMCU/g.
* **Rekomendacja:** Dwukierunkowy przelicznik w UI z domyślnym przełącznikiem IMCU / Tradycyjna (1:X).

### **DEC-08 Metoda mnożnika flokulacji (Flocculation Multiplier)**
* **Kontekst:** Tradycyjna metoda „krojenie po 45 minutach” prowadzi do błędów wilgotności skrzepu. Metoda flokulacji (czas od dodania podpuszczki do momentu, gdy miseczka na mleku przestaje się obracać, pomnożony przez współczynnik 2–6) jest złotym standardem światowego serowarstwa.
* **Rekomendacja:** Wdrożyć interaktywny asystent flokulacji ze stoperem miseczki jako kluczowy wyróżnik aplikacji.

### **DEC-09 Zakres bazy kultur starterowych w wersji 1.0**
* **Kontekst:** Na rynku dostępne są setki kultur (Danisco Choozit, Chr. Hansen, Sacco, Dalton).
* **Rekomendacja:** Baza predefiniowanych szczepów generycznych (Mezofilne typ O, Mezofilne typ LD z diacetylactis, Termofilne typ T, Termofilne jogurtowe/włoskie, Szlachetne pleśnie i bakterie maziowe) z możliwością dodawania własnych kultur handlowych.

### **DEC-10 Standard obliczania solanek warzywnych: całkowita masa vs objętość wody**
* **Kontekst:** Błąd początkujących polega na soleniu „3% na litr wody”, co przy różnej gęstości upakowania warzyw daje przypadkowe stężenie w tkankach (często poniżej 1.5% -> gnicie).
* **Rekomendacja:** Domyślny tryb „Masa Całkowita” (warzywa + woda = 100%), z wyraźnym ostrzeżeniem edukacyjnym.

---

## **Blok III — Przed publikacją w App Store (TestFlight)**

### **DEC-11 Ochrona przed roszczeniami zdrowotnymi (Apple Guideline 1.4.1)**
* **Kontekst:** Aplikacje o fermentacji i probiotykach bywają odrzucane za twierdzenia medyczne (leczenie jelit, odporność).
* **Rekomendacja:** Neutralny język mikrobiologiczny, brak obietnic medycznych, czytelna klauzula sanitarna w ustawieniach.

### **DEC-12 Bezpieczeństwo jadu kiełbasianego (Clostridium botulinum)**
* **Kontekst:** Przetwory bezkwasowe w oleju lub niedokwaszone warzywa niosą ryzyko botulizmu.
* **Rekomendacja:** Twarda reguła barierowa pH 4.6 – jeśli zmierzone lub przewidywane pH > 4.6, aplikacja wyświetla czerwony alert bezpieczeństwa.

### **DEC-13 Generowanie etykiet i paszportów krążków sera (PDF)**
* **Kontekst:** W dojrzewalni krążki leżą miesiącami. Potrzebne są papierowe etykiety odporne na wilgoć z kodem QR partii.
* **Rekomendacja:** Moduł wydruku arkuszy etykiet przez `expo-print` z unikalnym identyfikatorem partii i parametrami nastawu.

### **DEC-14 Format eksportu i kopii zapasowej**
* **Kontekst:** Użytkownicy nie mogą utracić wielomiesięcznej historii dojrzewania.
* **Rekomendacja:** Pełny eksport JSON zgodny ze standardem studia Apps4Brew + eksport arkusza CSV z partiami do wglądu na komputerze.

### **DEC-15 Nazwa międzynarodowa dla App Store**
* **Kontekst:** W Polsce „FERMENT — Serowarstwo i Kiszonki”. Na rynkach zagranicznych potrzebna krótka, chwytliwa nazwa.
* **Opcje:**
  * A: *Ferment: Artisan Cheese & Flora*
  * B: *Curd & Flora*
  * C: *Affinage: Cheese & Ferment Log*
* **Rekomendacja:** **A**. Buduje natychmiastową rozpoznawalność w kategorii domowej mikrobiologii.
""")

print("Zapisano 00b_Jedna_lista_decyzji.md")

# -------------------------------------------------------------
# 3. 00c_Sprzecznosci_i_weryfikacja.md
# -------------------------------------------------------------
f00c_err = os.path.join(OUT_DIR, "00c_Sprzecznosci_i_weryfikacja.md")
with open(f00c_err, "w", encoding="utf-8") as f:
    f.write("""# **FERMENT BRD 0.1 — 00c Sprzeczności dziedzinowe, normy i weryfikacja merytoryczna**

Dokument przedstawia analizę sprzeczności występujących w tradycyjnej literaturze kulinarnej, forach rzemieślniczych i podręcznikach serowarskich, rozstrzygniętych przez badacza dziedzinowego na podstawie 5-szczeblowej hierarchii źródeł (IDF, FAO, Codex Alimentarius, literatura akademicka Fox, Kosikowski, Katz).

---

## **1. Serowarstwo: Mleko i chemia koagulacji**

### **Sprzeczność S-01: Chlorek wapnia ($CaCl_2$) — dodawać zawsze czy tylko do mleka pasteryzowanego?**
* **Problem w źródłach:** Część forów zaleca dodawanie chlorku wapnia do każdego mleka „na wszelki wypadek”. Inne źródła ostrzegają przed gorzkim smakiem i nadmierną kruchością skrzepu.
* **Rozstrzygnięcie badawcze:** Pasteryzacja termiczna powoduje wytrącanie rozpuszczalnego fosforanu wapnia do formy koloidalnej, co drastycznie osłabia mostki wapniowe między micelami kazeiny i wydłuża czas koagulacji. W mleku surowym, świeżym od krowy/kozy, poziom jonów $Ca^{2+}$ jest fizjologicznie optymalny.
* **Zasada w FERMENT (RD-03):** 
  * Dla mleka pasteryzowanego/sklepowego: rekomendowany dodatek $0.2 - 0.3\\text{ g}$ bezwodnego $CaCl_2$ na 1 litr mleka (lub $0.6 - 0.9\\text{ ml}$ roztworu 33% na 10 litrów).
  * Dla mleka surowego: dodatek $0.0 - 0.1\\text{ g/L}$, zalecany tylko w okresie zimowym przy ubogiej paszy.
  * Ostrzeżenie górnego limitu: przekroczenie $0.5\\text{ g/L}$ blokuje wydanie partii z uwagi na defekt metaliczno-gorzkiego smaku.

### **Sprzeczność S-02: Dawkowanie podpuszczki — czas stały vs metoda flokulacji**
* **Problem w źródłach:** Przepisy tradycyjne podają: „dodaj 1 ml podpuszczki i odczekaj 45 minut”. W praktyce aktywność podpuszczki spada z czasem, a mleko różni się zawartością białka i kwasowością, co powoduje zacinanie skrzepu lub jego przepróchnienie.
* **Rozstrzygnięcie badawcze:** Standard światowy (metoda Berridge'a / Flocculation Multiplier) opiera się na wyznaczeniu **punktu flokulacji** (pierwsze widoczne mikroskopowe zżelowanie, sprawdzane obracającą się lekką miseczką na powierzchni mleka). Czas do flokulacji ($t_f$, zazwyczaj 10–18 min) mnoży się przez współczynnik flokulacji $M$ dedykowany dla danego typu sera.
* **Zasada w FERMENT (RD-04):** Aplikacja odrzuca sztywne czasy oczekiwania. Wdraża stoper flokulacji: całkowity czas od zaprawienia do cięcia $= t_f \\times M$.
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
* **Zasada w FERMENT (RD-07):** Kalkulator solanki oblicza masę soli, objętość kwasu (serwatki/octu lub kwasu mlekowego) oraz dawkę $CaCl_2$ dla bezpiecznej kąpieli.

---

## **2. Dojrzewalnia (Cave Log) i Pielęgnacja Skórki**

### **Sprzeczność S-04: Kontrola wilgotności względnej (RH) — higrometry tanie vs psychrometria**
* **Problem w źródłach:** Tanie domowe higrometry pojemnościowe w warunkach wilgotności 85–95% ulegają nasyceniu i zafałszowują wyniki o 10–15%, co prowadzi do gnicia skórki lub jej wysychania i pękania.
* **Rozstrzygnięcie badawcze:** Monitorowanie komory dojrzewalniczej wymaga uwzględnienia temperatury punktu rosy ($T_{dp}$) i unikania bezpośredniej kondensacji wody na powierzchni krążków. Skórka sera schnie, gdy prężność pary wodnej na jej powierzchni jest wyższa niż w otoczeniu.
* **Zasada w FERMENT (RD-12):** Algorytm wylicza deficyt prężności pary wodnej (VPD) i ostrzega przed kondensacją kropelkową na serze (zarzewie pleśni czarnej *Mucor*).

### **Sprzeczność S-05: Pielęgnacja Brevibacterium linens (sery maziowe) vs pleśń Penicillium**
* **Problem w źródłach:** Próba wyhodowania czerwonej mazi na serach o zbyt niskim pH kończy się porażką, a skórka porasta dziką pleśnią.
* **Rozstrzygnięcie badawcze:** *Brevibacterium linens* jest bezwzględnym tlenowcem i nie rozwija się w środowisku o pH < 5.8. Wymaga uprzedniego odkwaszenia powierzchni przez drożdże serowarskie (*Geotrichum candidum* lub *Debaryomyces hansenii*), które konsumują kwas mlekowy i podnoszą pH skórki.
* **Zasada w FERMENT (RD-14):** Asystent affinage prowadzi dwuetapowy protokół dla serów maziowych: najpierw rozwój welwetu *Geotrichum* (3–6 dni), następnie przemywanie roztworem maziowym przy podwyższonym pH.

---

## **3. Kiszonki, Kombucha i Octy Żywe**

### **Sprzeczność S-06: Solanka kiszonkowa — 2% w wodzie czy 2% w całości nastawu?**
* **Problem w źródłach:** 80% przepisów internetowych podaje „łyżka soli na litr wody”. W słoiku ściśle upakowanym warzywami ilość wody jest niewielka, a woda z komórek warzyw rozcieńcza solankę, obniżając stężenie soli do niebezpiecznego poziomu < 1.2% (sprzyja to mięknięciu pektyn i bakteriom gnilnym).
* **Rozstrzygnięcie badawcze:** Jedynym naukowo poprawnym standardem jest **Zasolenie Całkowite (Total Batch Salinity)**: masa soli liczona od łącznej wagi warzyw i dolanej wody:
  $$S_{\\%} = \\frac{m_{soli}}{m_{warzyw} + m_{wody}} \\times 100\\%$$
* **Zasada w FERMENT (RD-26):** Kalkulator solanek domyślnie wymusza bilans całkowity (rekomendowany zakres 2.0–2.5% dla warzyw twardych, 1.8–2.0% dla kimchi, 2.5–3.5% dla ostrych sosów mash).

### **Sprzeczność S-07: Kombucha — szczelne zamykanie w pierwszej fazie (1F)**
* **Problem w źródłach:** Niektórzy początkujący zamykają słoik z grzybkiem SCOBY szczelną nakrętką, licząc na szybsze nagazowanie.
* **Rozstrzygnięcie badawcze:** Bakterie kwasu octowego (*Komagataeibacter xylinus*) są bezwzględnymi tlenowcami. Brak tlenu dusi syntezę celulozy i kwasu octowego, prowadząc do dominacji drożdży, nadprodukcji alkoholu i potencjalnego skażenia pleśnią.
* **Zasada w FERMENT (RD-32):** Ścisłe rozróżnienie faz:
  * **1F (Fermentacja tlenowa):** oddychająca tkanina/gaza, wymiana gazowa, rozwój SCOBY, spadek pH do 2.8–3.2.
  * **2F (Refermentacja beztlenowa):** szczelne butelki z grubego szkła ciśnieniowego, nasycanie $CO_2$, kontrola ciśnienia i zapobieganie eksplozji butelek.

### **Sprzeczność S-08: Produkcja octu żywego — wlewanie alkoholu czy fermentacja dwufazowa?**
* **Problem w źródłach:** Próby robienia octu przez dodanie matki octowej do wódki lub wina o stężeniu 12–14% ABV.
* **Rozstrzygnięcie badawcze:** Bakterie *Acetobacter* są hamowane przy stężeniu etanolu > 8% ABV. Optymalny wsad alkoholowy do konwersji octowej wynosi 5.0–7.5% ABV.
* **Zasada w FERMENT (RD-41):** Asystent octowy weryfikuje stężenie alkoholu w nastawie owocowym i w razie potrzeby zaleca rozcieńczenie moszczu wodą przed inokulacją matką octową.
""")

print("Zapisano 00c_Sprzecznosci_i_weryfikacja.md")

# -------------------------------------------------------------
# 4. A1_rozdz_1_3_Wizja_Problem_Persony.md
# -------------------------------------------------------------
fa1 = os.path.join(OUT_DIR, "A1_rozdz_1_3_Wizja_Problem_Persony.md")
with open(fa1, "w", encoding="utf-8") as f:
    f.write("""# **FERMENT BRD 0.1 — Część A: Wizja, Problem, Persony (Rozdziały 1–3)**

> **Ekosystem:** Apps4Brew Studio | **Projekt:** FERMENT (Ser i Flora / Mikrobiologia Domowa)  
> **Status:** Wersja robocza 0.1 gotowa do wdrożenia.

---

## **Rozdział 1. Wizja i Tożsamość Produktu**

### **1.1 Wizja (jeden akapit)**
**FERMENT** to profesjonalny, kieszonkowy asystent domowego serowarstwa zagrodowego oraz zaawansowanej fermentacji warzywno-napojowej, który zdejmuje z twórcy niepewność długotrwałych procesów mikrobiologicznych. Zamienia chaotyczne notatki i zawodną pamięć w deterministyczny, naukowo precyzyjny system: przelicza enzymy i kultury z dokładnością do miligramów, prowadzi przez dynamiczne punkty flokulacji skrzepu, czuwa nad mikroklimatem dojrzewalni serów przez setki dni leżakowania krążków i chroni bezpieczeństwo biologiczne domowych kiszonek, kombuchy i octów. Działa w 100% Offline-First, bez logowania, bez serwera i telemetrii, w 35 językach, z poszanowaniem prywatności użytkownika.

**Obietnica marki (do App Store):**  
*„Panuj nad florą, nie zgaduj parametrów — perfekcyjny skrzep serowarski, bezpieczne dojrzewanie i żywa fermentacja w Twoich rękach.”*

### **1.2 Zasady Produktu (ZP-01…ZP-16, nienegocjowalne)**

| Nr | Nazwa zasady | Definicja i uzasadnienie architektoniczne |
| :--- | :--- | :--- |
| **ZP-01** | **100% Offline-First** | Wszystkie obliczenia enzymatyczne, krzywe flokulacji, bazy kultur, kalkulatory solanek i harmonogramy Cave Log działają całkowicie bez dostępu do sieci internetowej. Piwnice serowe i spiżarnie często nie mają zasięgu GSM. |
| **ZP-02** | **Zero Konta i Rejestracji** | Aplikacja uruchamia się bezpośrednio do stanu roboczego. Żadnych ekranów rejestracji, logowania przez Apple/Google, pytań profilowych ani barier wejścia. |
| **ZP-03** | **Zero Telemetrii ("Data Not Collected")** | Brak zewnętrznych SDK analitycznych (Firebase, Mixpanel, Amplitude). Czysta karta prywatności w App Store Privacy Manifest. Dane użytkownika należą wyłącznie do niego. |
| **ZP-04** | **Determinizm Matematyczny i Mikrobiologiczny** | Wzory dawek podpuszczki, stężeń solanek, równowagi kwasowości i kinetyki fermentacji są deterministycznymi funkcjami matematycznymi, w 100% testowanymi wektorami w Jest/CI. Zero generatywnych halucynacji AI w kalkulatorach bezpieczeństwa. |
| **ZP-05** | **Bezpieczeństwo Danych i Trwałość (Zero Data Loss)** | Relacyjna baza SQLite w trybie WAL. Automatyczny backup rotacyjny (10 kopii JSON) przy każdej modyfikacji partii. Eksport i import bazy są bezpłatne i dostępne zawsze. |
| **ZP-06** | **Czysta Ekonomia ("Tańsze niż espresso")** | Brak reklam, brak walut wirtualnych. Przejrzysty darmowy rdzeń narzędziowy + opcjonalny zakup dożywotni (Lifetime 14,99 € / 59,99 zł) lub mikroskopijna subskrypcja (0,99 € / 3,99 zł mies.). |
| **ZP-07** | **Hands-Free & Ergonomia Kuchni** | Projekt interakcji dostosowany do pracy w fartuchu serowarskim: duże cele dotykowe, wsparcie Apple Watch i Garmin, głośne powiadomienia dźwiękowe timera (`expo-av`), Live Activity na zablokowanym ekranie. |
| **ZP-08** | **Barierowe Bezpieczeństwo Sanitarne** | Rygorystyczne egzekwowanie barier biologicznych: granica pH 4.6 (jad kiełbasiany), zasolenie minimalne solanki 16% (patogeny), limity $CaCl_2$. Aplikacja ostrzega przed ryzykiem zepsucia surowca. |
| **ZP-09** | **Prymat Jakości Mleka i Surowca** | Rozróżnienie mleka surowego, pasteryzowanego w niskiej temperaturze i sklepowego. Blokada prób użycia mleka UHT do serów podpuszczkowych z natychmiastowym wyjaśnieniem naukowym. |
| **ZP-10** | **Dostępność jako Fundament (WCAG AAA / VoiceOver)** | Pełne etykiety dostępności, obsługa powiększonego tekstu Dynamic Type, wysoki kontrast kolorystyczny, brak polegania wyłącznie na barwie wskaźników. |
| **ZP-11** | **Wierność Rzemiosłu i Tradycji** | Nazewnictwo zgodne z profesjonalnym słownictwem serowarskim i mikrobiologicznym (skrzep, gęstwa, synereza, harfa, IMCU, affinage, brevibacterium, SCOBY, matka octowa). |
| **ZP-12** | **Wizualna Elegancja Rzemieślnicza** | Paleta barw inspirowana naturą: *Linen & Whey* (len, ciepła serwatka, wosk pszczeli, terakota, szałwiowa zieleń flory). Apple Human Interface Guidelines. |
| **ZP-13** | **Globalna Lokalizacja (35 języków)** | Pełna dwukierunkowa obsługa systemów metrycznych i imperialnych (litry/galony, gramy/uncje, °C/°F, gęstość Baumé/Salometer). Wszystkie teksty przez `t()` bez hardkodowanych literałów. |
| **ZP-14** | **Niezależność od Zewnętrznych Serwerów Chmurowych** | Zerowy koszt utrzymania infrastruktury po stronie twórcy (0 zł poza opłatą Apple). Aplikacja jest samowystarczalna na urządzeniu. |
| **ZP-15** | **Wsparcie Sprzętowe BLE bez Vendor-Lockin** | Otwarty skaner broadcastu Bluetooth LE dla standardowych czujników środowiskowych (RuuviTag, Xiaomi Mijia) bez wymagania chmury producenta. |
| **ZP-16** | **Przejrzystość Edukacyjna** | Każde zalecenie, przelicznik i czas w aplikacji posiada zwięzłe uzasadnienie naukowe („dlaczego tak?”) dostępne pod jednym tapnięciem. |

---

## **Rozdział 2. Analiza Problemu i Dowody Rynkowe**

### **2.1 Rzeczywisty problem domowego serowara i fermentatora**
Wytwarzanie serów podpuszczkowych oraz długoterminowa fermentacja to najbardziej wymagające dziedziny domowej mikrobiologii. W odróżnieniu od pieczenia chleba (gdzie cykl trwa kilkanaście godzin) lub parzenia kawy (kilka minut), **ser dojrzewa od 3 tygodni do 12 miesięcy, a błąd popełniony w pierwszych 30 minutach produkcji ujawnia się dopiero po przekrojeniu krążka po pół roku**.

Kluczowe punkty bólu (zebrane z forów serowarskich, grup dyskusyjnych i recenzji aplikacji w App Store):
1. **Porażka koagulacji przez błędy podpuszczki:** Użytkownicy kupują podpuszczki płynne lub w proszku o nieznanej lub różnej sile (IMCU vs 1:10 000). Dodanie podpuszczki „na oko” skutkuje kruchym, rozpadającym się skrzepem, z którego ucieka tłuszcz, albo gumowatym, gorzkim serem z nadmiaru enzymu.
2. **Pułapka mleka sklepowego:** Brak wiedzy o degradacji jonów wapnia w pasteryzacji. Bez dodania $CaCl_2$ mleko nie tworzy zwięzłego skrzepu.
3. **Zaniedbanie dojrzewalni (Cave Log):** Krążek sera włożony do chłodziarki/piwniczki wymaga regularnego obracania (początkowo codziennie, by serwatka spływała równomiernie), przemywania solanką i kontroli wilgotności (80–90%). Po 2 tygodniach użytkownik zapomina, kiedy krążek był obracany, skórka wysycha i pęka, a wnętrze zasiedlają dzikie pleśnie czarne (*Mucor*).
4. **Niewłaściwa solanka i zniszczenie skórki:** Włożenie sera do solanki zrobionej „na oko” bez buforu wapniowego powoduje natychmiastowe zmycie skórki (śluzowacenie) i zniszczenie struktury sera.
5. **Eksplozje butelek kombuchy w fazie 2F:** Brak kontroli nad refermentacją cukrów w szczelnych butelkach prowadzi do wybuchów szkła w spiżarni lub utraty gazu.
6. **Rozwój pleśni w kiszonkach:** Przeliczenie soli wyłącznie na wodę skutkuje zbyt niskim zasoleniem warzyw, mięknięciem ogórków i rozwojem kożucha mikotoksynowego.

---

## **Rozdział 3. Persony Użytkowników i Sytuacje Życiowe**

### **3.1 Szczegółowe Persony (P1–P8)**

* **P1: Janusz (48 lat) — Serowar Zagrodowy Praktyk.**
  * *Profil:* Posiada 4 kozy i kupuje mleko krowie od sąsiada (40L tygodniowo). Robi sery typu Feta, Koryciński, Gouda i Tomme.
  * *Ból:* Notatki na zatłuszczonych kartkach papieru w serowarni, gubienie informacji, która Gouda leży na której półce w piwnicy i ile tygodni ma dany krążek.
  * *Cel:* Precyzyjny stoper flokulacji, harmonogram docisku prasy dźwigniowej, ewidencja leżakowania z kodami partii.

* **P2: Marta (33 lata) — Miejska Pasjonatka Kiszonek i Kimchi.**
  * *Profil:* Gotuje w bloku, kisi w słojach Weck 2L i kamionkach. Robi kimchi tradycyjne, zakwas z buraków i fermentowane ostre sosy.
  * *Ból:* Niepewność, czy biały nalot na powierzchni to bezpieczne drożdże kożuchujące (Kahm), czy trująca pleśń. Zmienne proporcje soli w przepisach z internetu.
  * *Cel:* Niezawodny kalkulator solanki wagowej, diagnostyk wizualny chorób kiszonek, powiadomienia o odgazowywaniu.

* **P3: Michał (39 lat) — Szef Kuchni i Poszukiwacz Smaku (Kombucha & Octy).**
  * *Profil:* Prowadzi autorską kuchnię rzemieślniczą. Nastawia żywe octy owocowe i fermentuje kombuchę z rzadkich herbat.
  * *Ból:* Brak powtarzalności kwasowości w octach, ryzyko eksplozji butelek przy refermentacji 2F kombuchy.
  * *Cel:* Kontrola stechiometrii octowej (bilans alkohol -> kwas octowy), monitorowanie stopni Brix i ciśnienia CO2.

* **P4: Barbara (58 lat) — Tradycyjna Gospodyni Domowa.**
  * *Profil:* Od lat robi biały twaróg i proste sery podpuszczkowe na święta z mleka od zaufanego rolnika.
  * *Ból:* Małe litery w telefonie, skomplikowane aplikacje wymagające logowania.
  * *Cel:* Prosty interfejs z dużymi przyciskami (Dynamic Type), kalkulator przeliczający „ile kropli podpuszczki na 15 litrów mleka”.

* **P5: Paweł (26 lat) — Początkujący Biohaker / Zdrowe Jelita.**
  * *Profil:* Chce wytwarzać w domu fermentowaną żywność bogatą w żywe kultury bakterii (probiotyki).
  * *Ból:* Brak wiedzy biologicznej, lęk przed zatruciem jadem kiełbasianym lub bakteriami gnilnymi.
  * *Cel:* Edukacyjny asystent bezpieczeństwa z twardymi progami pH i jasnymi wskazówkami higienicznymi.

* **P6: Tomasz (42 lata) — Zaawansowany Serowar Hobbysta (Affinage Enthusiast).**
  * *Profil:* Przerobił winiarkę na profesjonalną jaskinię serową (cheese cave) z nawilżaczem ultradźwiękowym i regulatorem temperatury Inkbird. Dojrzewa sery maziowe (Munster, Taleggio) i z niebieską pleśnią (Gorgonzola).
  * *Ból:* Pielęgnacja skórki wymaga skomplikowanego kalendarza (przemywanie solanką co 2 dni, potem co 4, nakłuwanie igłami w 14. dobie).
  * *Cel:* Precyzyjny Cave Log z integracją bezprzewodowego sensora BLE (temperatura i wilgotność na żywo) i alarmem wysychania skórki.

* **P7: Anna (31 lat) — Wytwórca Mikro-Rzemieślniczy (Sprzedaż Bezpośrednia RHD).**
  * *Profil:* Prowadzi Rolniczy Handel Detaliczny, sprzedaje sery i zakwasy na jarmarkach ekologicznych.
  * *Ból:* Konieczność ścisłego kalkulowania kosztu surowca (mleko, kultury, prąd, sól) i wydajności serowej (% yield) oraz drukowania etykiet z datami partii.
  * *Cel:* Kalkulator kosztu kręgu sera, kalkulator uzysku z litra mleka oraz druk etykiet PDF z kodami QR.

* **P8: Piotr (35 lat) — Niewidomy Użytkownik Korzystający z VoiceOver.**
  * *Profil:* Pasjonat gotowania i fermentacji domowej, w pełni zależny od czytnika ekranu Apple VoiceOver.
  * *Ból:* Aplikacje kulinarne mają niezaetykietowane przyciski (np. „button_3”), a wykresy i suwaki są niedostępne.
  * *Cel:* 100% dostępność WCAG AAA: każdy element ma logiczną etykietę tekstową, wartość liczbową i informację o jednostce miary.

---

### **3.2 Sytuacje Życiowe (SYT-01…SYT-15)**
* **SYT-01 (Mleko w garnku):** Garnek 20L z mlekiem podgrzewa się na kuchence. Użytkownik musi szybko sprawdzić dawkę kultur termofilnych i podpuszczki, mając mokre ręce.
* **SYT-02 (Czekanie na flokulację):** Miseczka unosi się na powierzchni zaprawionego mleka. Użytkownik delikatnie ją popycha, czekając na opór zżelowanego płynu, aby wcisnąć stoper jednym stuknięciem na Apple Watch.
* **SYT-03 (Cięcie i dogrzewanie):** Skrzep został pocięty na ziarno wielkości kukurydzy. Aplikacja odmierza czas osadzania (5 min) i prowadzi przez krzywą dogrzewania (nie szybciej niż 1°C na 2 minuty).
* **SYT-04 (Prasa serowarska):** Krążek w chuście serowarskiej trafia pod prasę. Aplikacja wyznacza 4 etapy nacisku z przypomnieniami o odwróceniu i zmianie chusty.
* **SYT-05 (Wyjmowanie z solanki w nocy):** Krążek 2 kg leży w solance. Czas mija o 23:45. Aplikacja wysyła powiadomienie z dźwiękiem, by ser nie uległ przesoleniu.
* **SYT-06 (Kontrola jaskini dojrzewalniczej):** Użytkownik schodzi do piwnicy z telefonem. Aplikacja pobiera przez BLE odczyt: 12.2°C, 88% RH. Wyświetla listę: krążek #12 obrócić, krążek #09 przemyć solanką maziową.
* **SYT-07 (Nastawianie kimchi):** Poszatkowane 5 kg kapusty pekińskiej. Użytkownik wybiera metodę zasolenia na sucho (8% soli na 4 godziny). Aplikacja wylicza wagę soli i przypomina o trzykrotnym płukaniu.
* **SYT-08 (Butelkowanie kombuchy):** Kombucha 1F osiągnęła pH 3.0. Użytkownik przelewa ją do butelek z dodatkiem musu z marakui. Aplikacja wyznacza czas 2F (3 dni w 22°C) i ostrzega o konieczności schłodzenia przed otwarciem.
* **SYT-09 (Matka octowa na cydrze):** Użytkownik ma 5 litrów domowego cydru 6% ABV. Aplikacja instruuje, jak zabezpieczyć słoik gazą i oblicza przewidywaną kwasowość octu (5.4% kwasu octowego) po 8 tygodniach.
* **SYT-10 (Biały kożuch na ogórkach):** Na 7. dzień fermentacji ogórków pojawia się biała, pofałdowana błonka. Użytkownik uruchamia Diagnostyka: system identyfikuje drożdże kożuchujące (Kahm), podaje instrukcję zebrania łyżką i zaleca sprawdzenie szczelności docisku.
* **SYT-11 (Wzdęcie wczesne krążka sera):** W 3. dobie dojrzewania krążek sera wybrzusza się jak balonik. Diagnostyk rozpoznaje wzdęcie wczesne (bakterie z grupy Coli / drożdże), wyjaśnia przyczynę (brak higieny udoju mleka surowego) i informuje o niezdatności partii do spożycia.
* **SYT-12 (Pękanie skórki sera):** Po 3 tygodniach Gouda ma głęboką rysę na boku. Diagnostyk wykrywa zbyt niski poziom wilgotności w chłodziarce (< 75% RH) i zaleca natychmiastowe zabezpieczenie oliwą lub parafiną.
* **SYT-13 (Kalkulacja kosztu jarmarku):** Wytwórca zagrodowy musi wycenić krążek sera 1.5 kg. Aplikacja sumuje: 15L mleka (60 zł), podpuszczka i kultury (4 zł), prąd i sól (3 zł). Uzysk: 10.2%. Koszt jednostkowy: 44.66 zł/kg.
* **SYT-14 (Etykieta z kodem QR):** Gotowy ser trafia do leżakowania. Użytkownik drukuje miniaturową etykietę PDF z kodem QR partii i nakleja ją na półkę.
* **SYT-15 (Głosowe sterowanie VoiceOver):** Niewidomy serowar przy użyciu gestów VoiceOver sprawdza odliczanie timera dogrzewania skrzepu bez patrzenia na ekran.
""")

print("Zapisano A1_rozdz_1_3_Wizja_Problem_Persony.md")

# -------------------------------------------------------------
# 5. A2_rozdz_4_6_1_Rynek_Przychod_Zakres.md
# -------------------------------------------------------------
fa2 = os.path.join(OUT_DIR, "A2_rozdz_4_6_1_Rynek_Przychod_Zakres.md")
with open(fa2, "w", encoding="utf-8") as f:
    f.write("""# **FERMENT BRD 0.1 — Część A: Rynek, Model Przychodu i Zakres (Rozdziały 4–6.1)**

> **Ekosystem:** Apps4Brew Studio | **Projekt:** FERMENT (Ser i Flora / Mikrobiologia Domowa)

---

## **Rozdział 4. Analiza Rynku i Konkurencji**

### **4.1 Wielkość rynku i trendy kulturowe**
Rynek domowego przetwórstwa i mikrobiologii rzemieślniczej znajduje się w fazie gwałtownego wzrostu, napędzanego przez trzy globalne megatrendy:
1. **Zdrowie mikrobiomu i żywność fermentowana:** Badania naukowe nad osią jelitowo-mózgową i mikrobiotą doprowadziły do eksplozji zainteresowania produktami probiotycznymi z żywymi kulturami bakterii (kombucha, kimchi, żywe octy, sery z surowego mleka).
2. **Rzemiosło domowe (Homesteading & DIY Food):** Wzrost cen żywności rzemieślniczej w delikatesach sprawia, że coraz więcej osób inwestuje w mały sprzęt serowarski (prasy, garnki, formy) i wytwarza sery we własnej kuchni.
3. **Rolniczy Handel Detaliczny (RHD) i mikromleczarnie:** W Polsce i Europie rozwija się ruch małych przetwórców wiejskich sprzedających sery zagrodowe bezpośrednio konsumentom.

* **Dane rynkowe (USA):** Wartość rynku domowej fermentacji szacowana jest na ponad 850 mln USD rocznie. Społeczności takie jak r/cheesemaking (ponad 110 tys. członków), r/fermentation (ponad 350 tys. członków), r/Kombucha (ponad 160 tys. członków) wykazują stały, wielotysięczny napływ nowych hobbystów miesięcznie.
* **Dane rynkowe (Polska i region CEE):** Polska posiada jedną z najsilniejszych tradycji kiszonkarskich na świecie (ogórki, kapusta, żur, zakwas buraczany) oraz dynamicznie odradzające się tradycje serowarstwa zagrodowego (Korycin, Podhale, Mazury, Kaszuby).

### **4.2 Analiza obecnych rozwiązań i luki rynkowej**
Analiza konkurencyjnych aplikacji w App Store i Google Play wykazuje rażącą lukę:
* **Brak dedykowanych aplikacji dla serowarstwa:** Istniejące nieliczne kalkulatory to albo archaiczne arkusze kalkulacyjne Excel, albo proste webowe kalkulatory z lat 2005–2012 nieprzystosowane do ekranów mobilnych.
* **Aplikacje z przepisami ogólnokulinarnymi:** Zawierają powierzchowne, często błędne przepisy (sztywne czasy koagulacji bez flokulacji, brak bilansowania wapnia).
* **Brak cyfrowego dziennika dojrzewania (Cave Log):** Nie istnieje na rynku żadna nowoczesna, natywna aplikacja iOS pozwalająca na profesjonalne zarządzanie leżakowaniem serów, harmonogramami przemywania maziowego i monitoringiem mikroklimatu.
* **Przeładowanie reklamami i subskrypcjami:** Aplikacje kulinarne wymuszają drogie subskrypcje (30–60 USD/rok) i agresywnie śledzą użytkowników.

**Wniosek strategiczny FERMENT:** Wypełnienie niszy profesjonalnego, deterministycznego, bezserwerowego asystenta mikrobiologii domowej w etosie rzemieślniczym Apps4Brew.

---

## **Rozdział 5. Model Przychodu i Ekonomia Projektu**

### **5.1 Półka cenowa i struktura opłat**
Zgodnie ze standardem studia Apps4Brew:
* **Darmowy Rdzeń Narzędziowy (Free Tier):**
  * Kalkulator podpuszczki i podstawowych kultur serowarskich.
  * Stoper flokulacji i podstawowy timer obróbki skrzepu.
  * Kalkulator solanki warzywnej (tryb masa całkowita).
  * Cave Log z limitem do 3 aktywnych krążków/partii w leżakowaniu.
  * Dostęp do bazy wiedzy podstawowej.
* **Wersja Pełna (FERMENT PRO — Lifetime & Subskrypcja):**
  * Nielimitowany Cave Log i ewidencja partii (dziesiątki krążków i słojów).
  * Zaawansowany asystent przemywania maziowego i pleśni szlachetnych.
  * Asystent kombuchy 2F (ciśnienie CO2) i zaawansowanych octów żywych.
  * Bezpośrednia integracja z bezprzewodowymi czujnikami BLE (RuuviTag, Mijia).
  * Wydruk etykiet i paszportów krążków PDF z kodami QR (`expo-print`).
  * Asystent Apple Watch & Live Activity.
  * Diagnostyk chorób i wad serowarskich (Troubleshooting Doctor).

| Opcja zakupu | Cena EUR | Cena PLN | Charakterystyka |
| :--- | :--- | :--- | :--- |
| **Miesięczna** | 0,99 € | 3,99 zł | Dla osób robiących ser sezonowo (np. wiosna/lato przy dostępności mleka). |
| **Roczna** | 4,99 € | 19,99 zł | Dla regularnych domowych serowarów i fermentatorów. |
| **Dożywotnia (Lifetime)** | 14,99 € | 59,99 zł | Jednorazowa opłata na zawsze. Najchętniej wybierana w rzemiośle. |

### **5.2 Rachunek zwrotu kosztów stałych (Apple Developer 99 USD)**
Aplikacja generuje **0 zł kosztów zmiennych** (brak chmury, brak serwerów API, brak AI w chmurze, brak baz zewnętrznych). Jedynym kosztem stałym jest roczna opłata Apple Developer Program (99 USD ≈ 395 zł netto / 485 zł brutto).

Rachunek zwrotu w polskim App Store (po potrąceniu 15% prowizji Apple w Small Business Program i podatków):
* Przy zakupie Lifetime (59,99 zł brutto → ok. 40,65 zł netto dla twórcy): **wystarczy 10 zakupów dożywotnich rocznie**, aby w pełni sfinansować konto deweloperskie.
* Przy subskrypcji rocznej (19,99 zł brutto → ok. 13,55 zł netto): **wystarczy 29 subskrypcji rocznych**.
Każdy kolejny zakup stanowi czysty zysk studia.

---

## **Rozdział 6. Zakres Funkcjonalny i Granice Systemu (6.1)**

### **6.1 Co aplikacja robi, a czego NIE robi (Granice systemu)**

* **Co FERMENT robi:**
  1. Wylicza precyzyjne dawki podpuszczki, enzymów, soli, kwasów i kultur bakteryjnych w oparciu o parametry chemiczne i fizyczne surowca.
  2. Prowadzi użytkownika krok po kroku przez proces wytwarzania sera: od inokulacji, przez flokulację, cięcie, osuszanie, dogrzewanie, prasowanie, aż po kąpiel solankową.
  3. Rejestruje proces dojrzewania w jaskini serowej (Cave Log), wysyła powiadomienia o obracaniu, przemywaniu i zabiegach pielęgnacyjnych.
  4. Nadzoruje parametry fermentacji kiszonek, kombuchy i octów z uwzględnieniem barier mikrobiologicznych (pH 4.6).
  5. Integruje się z czujnikami BLE i zegarkami Apple/Garmin.
  6. Ewidencjonuje surowce w spiżarni z automatycznym odpisywaniem zużytych gramów/mililitrów po zakończonej sesji.

* **Czego FERMENT NIE robi (Czarne granice):**
  1. **Nie steruje fizycznymi przekaźnikami sprzętowymi:** Aplikacja nie jest systemem automatyki przemysłowej (SCADA/IoT) włączającym grzałki czy kompresory chłodnicze.
  2. **Nie udziela porad medycznych ani dietetycznych:** Nie diagnozuje chorób układu pokarmowego, nie obiecuje wyleczenia dolegliwości probiotykami.
  3. **Nie zawiera funkcji społecznościowych w chmurze (Zero Cloud Social):** Brak publicznych profili, lajków, komentarzy i forów internetowych.
  4. **Nie przechowuje danych użytkownika na zewnętrznych serwerach:** Całość danych spoczywa w lokalnej bazie SQLite na urządzeniu.
""")

print("Zapisano A2_rozdz_4_6_1_Rynek_Przychod_Zakres.md")

# -------------------------------------------------------------
# 6. A3a, A3b, A3c, A4
# -------------------------------------------------------------
fa3a = os.path.join(OUT_DIR, "A3a_rozdz_6_2_Tabela_zakresu_cz1.md")
with open(fa3a, "w", encoding="utf-8") as f:
    f.write("""# **FERMENT BRD 0.1 — Tabela Zakresu: Część 1 (Serowarstwo i Cave Log)**

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
    f.write("""# **FERMENT BRD 0.1 — Tabela Zakresu: Część 2 (Kiszonki, Kombucha, Octy, Platforma)**

Tabela definiuje 120 wymagań obszaru fermentacji warzywno-napojowej, sprzętu i platformy (Z-121…Z-240).

| ID | Moduł | Funkcjonalność / Wymaganie | Priorytet | Etap |
| :--- | :--- | :--- | :--- | :--- |
| **Z-121** | Kiszonki Warzywne | Kalkulator solanki wagowej na całkowitą masę nastawu (warzywa + woda = 100%) | MUST | MVP |
| **Z-122** | Kiszonki Warzywne | Baza sugerowanych stężeń soli: ogórki kiszone (2.2–2.5%), kapusta (2.0%), ostre sosy mash (3.0%) | MUST | MVP |
| **Z-123** | Kiszonki Warzywne | Przelicznik dodatku soli na sucho vs w roztworze wodnym z kompensacją objętościową | MUST | MVP |
| **Z-124** | Kimchi Asystent | Asystent zasalania kapusty pekińskiej na sucho (8–10% soli) lub w solance (12–15%) z timerem więdnięcia | MUST | MVP |
| **Z-125** | Kimchi Asystent | Kalkulator pasty smakowej (kleik ryżowy, gochugaru, czosnek, imbir, sos rybny/sojowy) | MUST | MVP |
| **Z-126** | Kimchi Asystent | Protokół 2-temperaturowy: faza ruszenia w cieple (18–20°C, 24–48h) -> dojrzewanie chłodnicze (1–3°C) | MUST | MVP |
| **Z-127** | Zakwas Buraczany | Przepis i kalkulator proporcji: buraki, czosnek, ziele, liść laurowy, woda przegotowana ostudzona, 2% soli | MUST | MVP |
| **Z-128** | Bezpieczeństwo LAB | Śledzenie 3 faz mikrobiologicznych (Leuconostoc mesenteroides -> L. plantarum -> L. brevis) | SHOULD | MVP |
| **Z-129** | Bezpieczeństwo LAB | Walidator bariery jadu kiełbasianego: weryfikacja spadku pH poniżej 4.6 w ciągu pierwszych 48–72h | MUST | MVP |
| **Z-130** | Chrupkość Warzyw | Asystent chrupkości: zalecenia dodatku garbników/tanin (liście dębu, chrzanu, porzeczki) i $CaCl_2$ | MUST | MVP |
| **Z-131** | Kombucha 1F | Kalkulator naparu herbacianego: liście czarne/zielone (g/L), cukier sacharoza (g/L), woda (L) | MUST | MVP |
| **Z-132** | Kombucha 1F | Obliczanie objętości płynu startowego (10–15% objętości nastawu) w celu zakwaszenia wsadu do pH < 4.5 | MUST | MVP |
| **Z-133** | Kombucha 1F | Monitor czasu fermentacji tlenowej (7–14 dni w 22–27°C) z kontrolą kwasowości sensorycznej | MUST | MVP |
| **Z-134** | Kombucha 2F | Asystent butelkowania refermentacyjnego: dodatek cukrów owocowych/soków (g/butelkę) | MUST | MVP |
| **Z-135** | Kombucha 2F | Prognozowanie nasycenia CO2 i kalkulator ciśnienia w butelce w celu ochrony przed rozerwaniem szkła | MUST | MVP |
| **Z-136** | Kombucha 2F | Alert konieczności natychmiastowego schłodzenia butelek w lodówce (do 2–4°C) po nagazowaniu | MUST | MVP |
| **Z-137** | Octy Żywe | Bilans dwustopniowej konwersji octowej: Fermentacja alkoholowa -> Oksydacja kwasu octowego | MUST | 1.1 |
| **Z-138** | Octy Żywe | Kalkulator stechiometryczny: przeliczanie stopni Brix moszczu na przewidywany alkohol i kwas octowy | MUST | 1.1 |
| **Z-139** | Octy Żywe | Weryfikator stężenia alkoholu przed oksydacją (limit max 8% ABV tolerancji Acetobacter) | MUST | 1.1 |
| **Z-140** | Octy Żywe | Asystent pielęgnacji matki octowej (Mother of Vinegar) i wymiany tlenowej | SHOULD | 1.1 |
| **Z-141** | Spiżarnia | Kartoteka surowców: mleko, kultury, podpuszczki, sól kamienna kłodawska niejodowana, cukier, herbaty | MUST | MVP |
| **Z-142** | Spiżarnia | Automatyczne odliczanie zużytych surowców z magazynu po zatwierdzeniu produkcji partii | MUST | MVP |
| **Z-143** | Paszporty i Etykiety | Generator etykiet PDF (`expo-print`) na krążki sera i słoiki z unikalnym kodem QR partii | MUST | MVP |
| **Z-144** | Skaner Kodów QR | Skaner aparatu (`expo-camera`) do natychmiastowego odczytu paszportu partii w piwniczce | MUST | MVP |
| **Z-145** | Kalkulator Kosztów | Kalkulator kosztu jednostkowego: koszt surowców + energia + opakowanie na kg sera lub słoik | MUST | MVP |
| **Z-146** | Kalkulator Uzysku | Wyliczanie wydajności serowarskiej (% Cheese Yield = waga sera / waga mleka * 100%) | MUST | MVP |
| **Z-147** | Apple Watch | Podgląd aktywnych timerów flokulacji, obracania form i dogrzewania skrzepu na zegarku | SHOULD | MVP |
| **Z-148** | Apple Watch | Odznaczanie czynności pielęgnacyjnej (np. „obrócono krążek”) bezpośrednio z nadgarstka | SHOULD | MVP |
| **Z-149** | Live Activity | Widget Dynamic Island i ekranu blokady z odliczaniem flokulacji i faz prasowania | MUST | MVP |
| **Z-150** | Czujniki BLE | Moduł skanera pakietów BLE Manufacturer Data dla czujników RuuviTag i Xiaomi Mijia BLE | COULD | 1.1 |
| **Z-151** | Radar Sensoryczny | Wektorowy radar smaku i tekstury SVG (Spider Radar): kwasowość, słoność, twardość, maślanowość, umami | SHOULD | MVP |
| **Z-152** | Dostępność | Pełne wsparcie Apple VoiceOver na wszystkich 100% ekranów i kalkulatorów | MUST | MVP |
| **Z-153** | Eksport Danych | Eksport bazy do zaszyfrowanego JSON oraz tabelaryczny eksport partii do CSV | MUST | MVP |
| **Z-154…Z-240** | Dalsze Wymagania | Wymagania niefunkcjonalne, lokalizacyjne, testowe i platformowe (moduły B5–B8, D1–D4) | MUST/SHOULD| MVP/1.1 |
""")

print("Zapisano A3b_rozdz_6_2_Tabela_zakresu_cz2.md")

fa3c = os.path.join(OUT_DIR, "A3c_Etapy_Naklad_Warianty.md")
with open(fa3c, "w", encoding="utf-8") as f:
    f.write("""# **FERMENT BRD 0.1 — Część A: Etapy Wdrożenia, Nakład Pracy i Warianty (Rozdziały 6.3–6.5)**

> **Ekosystem:** Apps4Brew Studio | **Projekt:** FERMENT (Ser i Flora / Mikrobiologia Domowa)

---

## **Rozdział 6.3 Klasyfikacja Etapów Wdrożenia**

Wszystkie wymagania w rejestrze funkcjonalnym posiadają przypisany dokładnie jeden etap wdrożenia:
1. **MVP (Wersja 1.0):** Rdzeń serowarski (mleko, CaCl2, podpuszczka IMCU, flokulacja, prasa, solanka, Cave Log do 3 krążków) + asystent kiszonek i kimchi + spiżarnia z auto-odpisem + Live Activity + eksport CSV/JSON.
2. **Wersja 1.1:** Pełny moduł kombuchy (1F i 2F z ciśnieniem CO2) i żywych octów owocowych + bezpośrednia integracja z czujnikami BLE (RuuviTag, Mijia) + nielimitowany Cave Log w wersji Pro.
3. **Wersja 1.2:** Aplikacja towarzysząca Garmin Connect IQ + zaawansowane profile szczepów regionalnych + moduł serów propionowych z komorą ciepłą.
4. **Wersja 2.x:** Algorytmy computer vision do oceny barwy skórki i wielkości oczek sera + bezprzewodowa synchronizacja p2p między urządzeniami.
5. **Nigdy (Koncepcje odrzucone):** Logowanie do chmury, publiczne fora społecznościowe, reklamy bannerowe, analityka Firebase/telemetria, generowanie pseudonaukowych porad przez chmurowe LLM.

---

## **Rozdział 6.4 Szacowany Nakład Pracy Agenta**

Szacunki bazują na modelu autonomicznego agenta inżynieryjnego studia Apps4Brew pracującego zgodnie z procedurami `trening` i `Oczko` (test-driven development, rygor TypeScript, generowanie macierzy testowych, zero długu technologicznego):

| Obszar / Moduł | Dni pracy agenta | Uwagi i zależności |
| :--- | :--- | :--- |
| **Architektura, relacyjna baza SQLite WAL, DDL, migracje** | 2.5 dnia | Fundament persystencji, 18 tabel relacyjnych, rotacja 10 kopii backupu |
| **Moduł B1: Kalkulator Serowara (Mleko, CaCl2, IMCU, Flokulacja)** | 3.5 dnia | Precyzyjne wzory enzymatyczne, interaktywny stoper flokulacji, testy Jest |
| **Moduł B2: Skrzep, Ziarno, Rampa Dogrzewania, Prasa** | 3.0 dni | Matematyka nacisku powierzchniowego, harmonogramy wieloetapowe |
| **Moduł B3: Solenie, Solanka Nasycona, Bufor pH i Ca** | 2.0 dni | Chemia solanek serowarskich, przeliczniki Baumé/Salometer |
| **Moduł B4: Cave Log (Dziennik Dojrzewania, Affinage)** | 4.0 dni | Złożony moduł harmonogramów pielęgnacji, powiadomienia, psychrometria |
| **Moduł B5: Kiszonki Warzywne, Kimchi, Zakwasy (3 Fazy LAB)** | 2.5 dnia | Solanki wagowe, algorytm kapusty kimchi, walidator pH 4.6 |
| **Moduł B6: Kombucha 1F/2F i Żywe Octy (Etap 1.1)** | 3.0 dni | Kinetyka CO2 w butelkach, stechiometria kwasu octowego |
| **Moduł B7: Spiżarnia, Auto-Odpis, Etykiety PDF z QR, Koszty** | 2.5 dnia | Generator PDF (`expo-print`), skaner kodów (`expo-camera`), yield calc |
| **Moduł B8: Live Activity, Apple Watch, Sensoryka SVG** | 3.5 dnia | ActivityKit na iOS, radar sensoryczny SVG, haptics |
| **Moduł C1–C4: Szkoła, Diagnostyk Wad, 50 Reguł Dziedzinowych** | 4.5 dnia | Kompletny silnik diagnostyczny, 50 reguł z wektorami testowymi |
| **Moduł D1–D4: Weryfikacja jakości, i18n (35 języków), a11y VoiceOver** | 4.0 dni | Bramka `check-i18n`, macierz testów `docs/19`, audyt WCAG AAA |
| **E2E Maestro, pipeline CI w GitHub Actions, TestFlight** | 2.5 dni | Scenariusze E2E na symulatorze iOS, workflowy wolne od EAS |
| **SUMA (Pełne MVP — Etap 1.0):** | **~28–32 dni pracy agenta** | Czas kalendarzowy: ok. 3–4 tygodnie przy pracy ciągłej |

---

## **Rozdział 6.5 Warianty Decyzyjne Startu Projektu**

* **Wariant A (Maksymalny):** Realizacja wszystkich modułów serowarskich, kiszonkarskich, kombuchy i octów w jednym wydaniu MVP (~38 dni agenta). Wydanie TestFlight opóźnione o ok. 2 tygodnie.
* **Wariant B+ (Rekomendowany przez analityka):** Realizacja pełnego modułu serowarskiego + kiszonki/kimchi/zakwasy w MVP (~30 dni agenta). Kombucha i octy wchodzą jako aktualizacja 1.1 w drugim sprincie.
* **Wariant C (Minimalny serowarski):** Tylko i wyłącznie kalkulator sera i Cave Log bez warzyw (~20 dni agenta). Ryzyko rozmycia tożsamości „FERMENT”.
""")

print("Zapisano A3c_Etapy_Naklad_Warianty.md")

fa4 = os.path.join(OUT_DIR, "A4_rozdz_13_15_KPI_Marketing_ASO.md")
with open(fa4, "w", encoding="utf-8") as f:
    f.write("""# **FERMENT BRD 0.1 — Część A: KPI, Marketing i ASO (Rozdziały 13 i 15)**

> **Ekosystem:** Apps4Brew Studio | **Projekt:** FERMENT (Ser i Flora / Mikrobiologia Domowa)

---

## **Rozdział 13. Prywatne Wskaźniki Sukcesu (KPI bez śledzenia użytkownika)**

Zgodnie z zasadą **ZP-03** aplikacja FERMENT nie zawiera żadnych skryptów szpiegujących ani zewnętrznych SDK telemetrycznych. Wskaźniki sukcesu mierzone są wyłącznie za pomocą anonimowych metryk dostarczanych przez **Apple App Store Connect** oraz wskaźników lokalnych przechowywanych w urządzeniu użytkownika:

1. **Konwersja App Store (Store Conversion Rate):**
   * *Cel:* $\\ge 4.5\\%$ konwersji odsłon karty produktowej w pobranie aplikacji.
   * *Narzędzie:* App Store Connect Analytics.
2. **Wskaźnik Awaryjności (Crash-Free Sessions):**
   * *Cel:* $\\ge 99.8\\%$ sesji wolnych od awarii.
   * *Narzędzie:* Apple Xcode Organizer Crash Reports.
3. **Wskaźnik Retencji Długoterminowej (Cave Log Retention):**
   * *Cel:* Średni czas życia partii sera w Cave Log $\\ge 45$ dni (dowód, że użytkownicy rzeczywiście pielęgnują dojrzewające krążki przy asyście aplikacji).
   * *Narzędzie:* Anonimowa metryka lokalna na urządzeniu.
4. **Tempo Zwrotu Kosztu Konta Apple (Payback Velocity):**
   * *Cel:* 10 zakupów Lifetime lub 30 subskrypcji rocznych w ciągu pierwszych 60 dni od premiery w App Store.

---

## **Rozdział 15. Strategia Marketingowa, ASO i Kręgi Społeczności**

### **15.1 Strategia App Store Optimization (ASO)**
Kluczowe słowa kluczowe (PL i EN) wyselekcjonowane pod kątem zerowej konkurencji i wysokiej intencji rzemieślniczej:

* **Tytuł (PL):** FERMENT — Serowarstwo i Kiszonki
* **Podtytuł (PL):** Kalkulator podpuszczki, Cave Log, kimchi
* **Słowa kluczowe (PL):** ser,serowarstwo,podpuszczka,flokulacja,gouda,dojrzewalnia,solanka,kimchi,kiszonki,zakwas,kombucha,ocet,bakterie,kazeina,serowar
* **Tytuł (EN):** FERMENT: Cheese & Flora Log
* **Podtytuł (EN):** Cheesemaking rennet, cave aging & kimchi
* **Słowa kluczowe (EN):** cheesemaking,rennet,flocculation,cheddar,gouda,cheese cave,affinage,fermentation,kimchi,kombucha,brine,lacto,scoby,vinegar

### **15.2 Dotarcie do Kręgów Zainteresowanych (Organic Launch Circles)**
Strategia wprowadzenia na rynek opiera się na organicznym zaufaniu w wąskich kręgach pasjonatów (bez płatnych reklam):
1. **Krąg 1: Serowarzy Zagrodowi i Rzemieślnicy:**
   * Polskie fora serowarskie (Serowar.pl, wędzarnicza brać, grupy serowarstwa domowego na FB — łącznie ponad 70 tys. członków).
   * Globalne społeczności: Reddit r/cheesemaking (110k), cheeseforum.org.
   * Przekaz: „Pierwszy mobilny kalkulator z prawdziwą metodą mnożnika flokulacji, przeliczaniem IMCU i dziennikiem jaskini dojrzewalniczej, który działa w 100% offline w piwnicy”.
2. **Krąg 2: Pasjonaci Fermentacji Warzywnej i Kimchi:**
   * Społeczności: r/fermentation (350k), grupy kiszonkarskie.
   * Przekaz: „Koniec z pleśnieniem ogórków i zgadywaniem soli: kalkulator solanki wagowej na całkowitą masę z barierą pH 4.6”.
3. **Krąg 3: Rzemieślnicy Kombuchy i Octów:**
   * Społeczności: r/Kombucha (160k), grupy zero-waste i octowe.
   * Przekaz: „Kalkulator refermentacji 2F kombuchy chroniący przed rozsadzaniem butelek oraz stechiometryczny bilans octowy”.
""")

print("Zapisano A4_rozdz_13_15_KPI_Marketing_ASO.md")
