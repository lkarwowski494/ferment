# FERMENT (SER I FLORA / MIKROBIOLOGIA DOMOWA)
## KOMPLETNY BUSINESS REQUIREMENTS DOCUMENT (BRD) — WYDANIE 0.1 MASTER
> Apps4Brew Studio Engineering Standard | Data opracowania: Październik 2026

---



<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: 00_START.md -->
<!-- ========================================== -->

# **FERMENT (Ser i Flora / Mikrobiologia Domowa) — Wymagania biznesowe (BRD), wersja robocza 0.1, 16.10.2026**

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

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: 00b_Jedna_lista_decyzji.md -->
<!-- ========================================== -->

# **FERMENT BRD 0.1 — 00b Jedna lista decyzji i pytań (DEC-01…DEC-45)**

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

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: 00c_Sprzecznosci_i_weryfikacja.md -->
<!-- ========================================== -->

# **FERMENT BRD 0.1 — 00c Sprzeczności dziedzinowe, normy i weryfikacja merytoryczna**

Dokument przedstawia analizę sprzeczności występujących w tradycyjnej literaturze kulinarnej, forach rzemieślniczych i podręcznikach serowarskich, rozstrzygniętych przez badacza dziedzinowego na podstawie 5-szczeblowej hierarchii źródeł (IDF, FAO, Codex Alimentarius, literatura akademicka Fox, Kosikowski, Katz).

---

## **1. Serowarstwo: Mleko i chemia koagulacji**

### **Sprzeczność S-01: Chlorek wapnia ($CaCl_2$) — dodawać zawsze czy tylko do mleka pasteryzowanego?**
* **Problem w źródłach:** Część forów zaleca dodawanie chlorku wapnia do każdego mleka „na wszelki wypadek”. Inne źródła ostrzegają przed gorzkim smakiem i nadmierną kruchością skrzepu.
* **Rozstrzygnięcie badawcze:** Pasteryzacja termiczna powoduje wytrącanie rozpuszczalnego fosforanu wapnia do formy koloidalnej, co drastycznie osłabia mostki wapniowe między micelami kazeiny i wydłuża czas koagulacji. W mleku surowym, świeżym od krowy/kozy, poziom jonów $Ca^{2+}$ jest fizjologicznie optymalny.
* **Zasada w FERMENT (RD-03):** 
  * Dla mleka pasteryzowanego/sklepowego: rekomendowany dodatek $0.2 - 0.3\text{ g}$ bezwodnego $CaCl_2$ na 1 litr mleka (lub $0.6 - 0.9\text{ ml}$ roztworu 33% na 10 litrów).
  * Dla mleka surowego: dodatek $0.0 - 0.1\text{ g/L}$, zalecany tylko w okresie zimowym przy ubogiej paszy.
  * Ostrzeżenie górnego limitu: przekroczenie $0.5\text{ g/L}$ blokuje wydanie partii z uwagi na defekt metaliczno-gorzkiego smaku.

### **Sprzeczność S-02: Dawkowanie podpuszczki — czas stały vs metoda flokulacji**
* **Problem w źródłach:** Przepisy tradycyjne podają: „dodaj 1 ml podpuszczki i odczekaj 45 minut”. W praktyce aktywność podpuszczki spada z czasem, a mleko różni się zawartością białka i kwasowością, co powoduje zacinanie skrzepu lub jego przepróchnienie.
* **Rozstrzygnięcie badawcze:** Standard światowy (metoda Berridge'a / Flocculation Multiplier) opiera się na wyznaczeniu **punktu flokulacji** (pierwsze widoczne mikroskopowe zżelowanie, sprawdzane obracającą się lekką miseczką na powierzchni mleka). Czas do flokulacji ($t_f$, zazwyczaj 10–18 min) mnoży się przez współczynnik flokulacji $M$ dedykowany dla danego typu sera.
* **Zasada w FERMENT (RD-04):** Aplikacja odrzuca sztywne czasy oczekiwania. Wdraża stoper flokulacji: całkowity czas od zaprawienia do cięcia $= t_f \times M$.
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
  $$S_{\%} = \frac{m_{soli}}{m_{warzyw} + m_{wody}} \times 100\%$$
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

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: A1_rozdz_1_3_Wizja_Problem_Persony.md -->
<!-- ========================================== -->

# **FERMENT BRD 0.1 — Część A: Wizja, Problem, Persony (Rozdziały 1–3)**

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

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: A2_rozdz_4_6_1_Rynek_Przychod_Zakres.md -->
<!-- ========================================== -->

# **FERMENT BRD 0.1 — Część A: Rynek, Model Przychodu i Zakres (Rozdziały 4–6.1)**

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

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: A3a_rozdz_6_2_Tabela_zakresu_cz1.md -->
<!-- ========================================== -->

# **FERMENT BRD 0.1 — Tabela Zakresu: Część 1 (Serowarstwo i Cave Log)**

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

# **FERMENT BRD 0.1 — Tabela Zakresu: Część 2 (Kiszonki, Kombucha, Octy, Platforma)**

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

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: A3c_Etapy_Naklad_Warianty.md -->
<!-- ========================================== -->

# **FERMENT BRD 0.1 — Część A: Etapy Wdrożenia, Nakład Pracy i Warianty (Rozdziały 6.3–6.5)**

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

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: A4_rozdz_13_15_KPI_Marketing_ASO.md -->
<!-- ========================================== -->

# **FERMENT BRD 0.1 — Część A: KPI, Marketing i ASO (Rozdziały 13 i 15)**

> **Ekosystem:** Apps4Brew Studio | **Projekt:** FERMENT (Ser i Flora / Mikrobiologia Domowa)

---

## **Rozdział 13. Prywatne Wskaźniki Sukcesu (KPI bez śledzenia użytkownika)**

Zgodnie z zasadą **ZP-03** aplikacja FERMENT nie zawiera żadnych skryptów szpiegujących ani zewnętrznych SDK telemetrycznych. Wskaźniki sukcesu mierzone są wyłącznie za pomocą anonimowych metryk dostarczanych przez **Apple App Store Connect** oraz wskaźników lokalnych przechowywanych w urządzeniu użytkownika:

1. **Konwersja App Store (Store Conversion Rate):**
   * *Cel:* $\ge 4.5\%$ konwersji odsłon karty produktowej w pobranie aplikacji.
   * *Narzędzie:* App Store Connect Analytics.
2. **Wskaźnik Awaryjności (Crash-Free Sessions):**
   * *Cel:* $\ge 99.8\%$ sesji wolnych od awarii.
   * *Narzędzie:* Apple Xcode Organizer Crash Reports.
3. **Wskaźnik Retencji Długoterminowej (Cave Log Retention):**
   * *Cel:* Średni czas życia partii sera w Cave Log $\ge 45$ dni (dowód, że użytkownicy rzeczywiście pielęgnują dojrzewające krążki przy asyście aplikacji).
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

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: B1_Narzedzia_Kalkulator_Serowara.md -->
<!-- ========================================== -->

# **FERMENT BRD 0.1 — Rozdział 7: Narzędzia Serowarskie — Kalkulator Mleka, Kultur i Podpuszczki (B1)**

> **Moduł:** `BR-SER-001` do `BR-SER-035`  
> **Kontekst dziedzinowy:** Precyzyjne dozowanie enzymów koagulujących (IMCU) i kultur bakteryjnych na litr mleka, bilans kazeinowo-wapniowy, stoper flokulacji.

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
  2. Użytkownik umieszcza na powierzchni mleka lekką zdezynfekowaną miseczkę (lub zakrętkę) i delikatnie wprawia ją w ruch obrotowy co 60 sekund.
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

### **BR-MOLD-001: Dobór i Geometria Formy Serowarskiej (Mold Sizing & Curd Geometry)**
* **Opis:** Obliczanie kubatury form serowarskich (cylindrycznych i prostopadłościennych), objętości gęstwy nieodprasowanej oraz weryfikacja stopnia napełnienia formy.
* **Format obliczeń:**
  * Cylindryczne: $V = \pi r^2 h$. Prostopadłościenne: $V = a \cdot b \cdot h$.
  * Przelicznik objętości skrzepu przed odciekiem: ~1.7 L objętości na 1 kg gotowego sera.
  * Baza szablonów: Kadova Gouda (1 kg, 2 kg), Forma Korycińska, Camembert, Feta/Twaróg prostokątna.
* **Kryteria akceptacji:**
  1. Wizualizacja stopnia wypełnienia (%) oraz statusu pojemności (wystarczająca vs za mała).
  2. Automatyczne rekomendowanie optymalnej formy na podstawie zadanej objętości mleka i spodziewanego plonu.
* **Persona:** P1, P2, P5, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-SER-040: Skład Biochemiczny i Klasyfikacja Codex Alimentarius (MFFB, FDM, S/M Ratio)**
* **Opis:** Silnik analityczny klasyfikujący ser według międzynarodowego standardu CODEX STAN 283-1978 oraz monitorujący krytyczną równowagę soli w fazie wodnej (`cheese-composition-engine.ts`).
* **Wzory chemiczne i biochemiczne:**
  1. **MFFB (Moisture on a Fat-Free Basis %):**
     $$MFFB = \frac{\% \text{Moisture}}{100\% - \% \text{Fat}} \times 100\%$$
     * `< 51.0%`: `EXTRA_HARD` (Parmezan, Grana Padano, Sbrinz)
     * `51.0% - 56.0%`: `HARD` (Cheddar, Dojrzała Gouda, Emmentaler)
     * `56.0% - 63.0%`: `SEMI_HARD` (Młoda Gouda, Edam, Tilsit)
     * `63.0% - 69.0%`: `SEMI_SOFT` (Ser Koryciński, Havarti, Butterkäse)
     * `> 69.0%`: `SOFT` (Feta, Camembert, Twaróg, Ricotta)
  2. **FDM (Fat in Dry Matter %):**
     $$FDM = \frac{\% \text{Fat}}{100\% - \% \text{Moisture}} \times 100\%$$
     * `HIGH_FAT` ($\ge 60\%$), `FULL_FAT` ($45–60\%$), `MEDIUM_FAT` ($25–45\%$), `LOW_FAT` ($10–25\%$), `SKIM` ($<10\%$)
  3. **Salt-in-Moisture (S/M %):**
     $$S/M = \frac{\% \text{Salt}}{\% \text{Moisture}} \times 100\%$$
     * `S/M < 4.0% (UNDER_SALTED_ACIDIC)`: Nadmierna aktywność bakterii starterowych i chymozyny; akumulacja gorzkich hydrofobowych peptydów (wada technologiczna goryczki).
     * `S/M = 4.0% - 6.0% (OPTIMAL_BALANCED)`: Idealna proteoliza i rozwój bukietu aromatycznego podczas affinage.
     * `S/M > 6.0% (OVER_SALTED_INHIBITED)`: Zahamowanie enzymów proteolitycznych, zatrzymanie dojrzewania, krucha sucha struktura.
* **Kryteria akceptacji:**
  1. Automatyczne obliczanie suchej masy, wskaźnika MFFB, FDM i relacji S/M.
  2. Prezentacja oficjalnych klas konsystencji i tłuszczowości z opisem handlowym.
  3. Alerty biochemiczne i rekomendacje technologiczne dotyczące czasu solenia.
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP/1.1.

---

### **BR-SER-025: Propagacja Zakwasu Serwatkowego & Sierroinnesto (Mother Whey Levain & Starter Propagation Engine)**
* **Opis:** Moduł modelowania biologicznej propagacji naturalnych kultur matecznych ze słodkiej, nieposolonej serwatki z poprzedniego warzenia (włoskie *sierroinnesto*, tradycyjna serwatka tatrzańska, zakwas zagrodowy) (`whey-levain-engine.ts`).
* **Kluczowe reguły biochemiczne i technologiczne:**
  1. **Profile kultur matecznych:**
     * `THERMOPHILIC_ALPINE` (Sierroinnesto alpejskie, 43°C, 20h nominalnie, $pH \in [3.40, 3.65]$, *S. thermophilus*, *L. delbrueckii*, *L. helveticus*).
     * `MESOPHILIC_FARMHOUSE` (Zagrodowe mezofilne, 30°C, 24h nominalnie, $pH \in [3.80, 4.10]$, *L. lactis*, *Leuconostoc*).
     * `HIGHLAND_SMOKED` (Serwatka na Oscypek i Gołkę, 37°C, 18h, $pH \in [3.60, 3.90]$, *L. plantarum*, *S. thermophilus*).
     * `VEGETABLE_BRINE_BACKSLOP` (Pasażowanie solanki warzywnej, 20°C, 24h, $pH \in [3.40, 3.80]$).
  2. **Wyliczanie dozy inokulacyjnej do mleka:**
     * Dozowanie $\% \text{ v/v}$ na podstawie zaplanowanej objętości mleka (np. $2.5\%$ dla alpejskich $= 250\text{ ml}$ na $10\text{L}$ mleka, $2.0\%$ dla mezofilnych).
  3. **Ocena dojrzałości technologicznej:**
     * Weryfikacja fazy według mierzonego pH: `WARMING_UP` ($pH > 4.2$), `ACTIVE_ACIDIFYING` ($pH > 3.65$), `PEAK_RIPE` ($pH \in [3.40, 3.65]$ — moment zadania do mleka), `OVER_ACIDIFIED` ($pH < 3.40$).
  4. **Dozór witalności pasażu i ochrona przed bakteriofagami (Phage Drift Guard):**
     * Monitorowanie liczby kolejnych generacji serwatki ($G_1, G_2, \dots$).
     * Generacja $\ge 11$: status `VIGILANCE_MONITOR` (ostrzeżenie o konieczności obserwacji czasu koagulacji).
     * Generacja $\ge 18$: status `DEGENERATION_RESET_REQUIRED` (krytyczny nakaz zresetowania matki z surowego mleka lub czystych kultur ze względu na presję bakteriofagów serowarskich).
* **Kryteria akceptacji:**
  1. Karta zintegrowana w trybie Serowarstwo Pro Accordion.
  2. Pełne testy jednostkowe (`tests/core/whey-levain-engine.test.ts`).
* **Persona:** P1, P2, P5, P6.
* **Priorytet:** MUST | **Etap:** MVP/1.1.

---

### **BR-SER-036: Morfologia Gatunkowa Mleka & Kinetyka Koagulacji (Milk Species Coagulation & Proteolysis Profile Engine)**
* **Opis:** Fizykochemiczny model różnic gatunkowych mleka (krowie, kozie, owcze, bawole) wpływających na strukturę żelu kazeinowego, wielkość miceli i kuleczek tłuszczowych, dawkę podpuszczki, mnożnik flokulacji i uzysk sera (`milk-species-profile.ts`).
* **Profile gatunkowe w modelu:**
  1. **Mleko krowie (*Bos taurus*):**
     * Tłuszcz: 3.8–4.4%, Białko: 3.2–3.5%, Stosunek kazeina/serwatka: 80:20.
     * Frakcja wiodąca: $\alpha_{s1}$-kazeina (mocny, sprężysty żel).
     * Średnica kuleczek tłuszczu: 4.0 µm. Wydajność świeża: ~10.5%.
     * Mnożnik podpuszczki: 1.0x, Mnożnik flokulacji: 1.0x, Temp. optymalna: 31–33°C.
  2. **Mleko kozie (*Capra hircus*):**
     * Tłuszcz: 3.6–4.6%, Białko: 3.1–3.6%, Stosunek kazeina/serwatka: 78:22.
     * Frakcja wiodąca: $\beta$-kazeina (brak lub znikoma ilość $\alpha_{s1}$, co daje bardzo miękki, podatny na rozpad skrzep *friable curd*).
     * Średnica kuleczek tłuszczu: 3.2 µm (naturalna homogenizacja, brak wyraźnej warstwy śmietanki).
     * Wysoka lipoliza: obfitość kwasów C6 (kapronowy), C8 (kaprylowy) i C10 (kaprynowy).
     * Mnożnik flokulacji: 1.15x (wydłużenie czasu wiązania żelu), Temp. optymalna: 29–31°C (ochrona przed zacięciem termicznym).
  3. **Mleko owcze (*Ovis aries*):**
     * Tłuszcz: 6.5–8.5%, Białko: 5.5–6.8%, Sucha masa: 18–20% (podwójny ekstrakt!).
     * Ekstremalnie bogate w micele kazeinowe i wapń koloidalny (190 mg/100g).
     * Błyskawiczna koagulacja: zalecana redukcja dawki podpuszczki o 25% (26.3 IMCU/L zamiast 35 IMCU/L) oraz obniżony mnożnik flokulacji 0.85x w celu uniknięcia gumowatości.
     * Wybitny uzysk sera: ~20.0% świeżego skrzepu (prawie dwukrotnie więcej niż z mleka krowiego).
  4. **Mleko bawole (*Bubalus bubalis*):**
     * Tłuszcz: 7.5–9.2%, Białko: 4.2–4.8%, Wapń: 180 mg/100g.
     * Średnica kuleczek: 5.0 µm. Porcelanowo-biały miąższ (brak $\beta$-karotenu).
     * Niezrównana termoplastyczność struktury micelarnej (idealna do ugniatania i wyciągania w gorącej wodzie dla Mozzarella di Bufala / pasta filata).
     * Wydajność świeża: ~17.0%, Temp. optymalna zaprawiania: 34–36°C.
* **Kryteria akceptacji:**
  1. Wybór gatunku mleka w głównym selektorze trybu serowarskiego (Krowie, Kozie, Owcze, Bawole).
  2. Karta profilu w akordeonie Pro z dynamicznymi wskazówkami technologicznymi i wyliczeniem odzysku Ricotty.
  3. Testy jednostkowe (`tests/core/milk-species-profile.test.ts`).
* **Persona:** P1, P4, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP/1.1.

---

### **BR-SER-037: Areometria Solanki & Kompensacja Temperatury (Brine Densitometry & Hydrometer Temp Compensation Engine)**
* **Opis:** Laboratoryjny model przeliczeń gęstości i zasolenia roztworów solankowych z użyciem areometrów serowarskich (skala Salometru °Sal, Baumé °Bé, Specific Gravity SG oraz % wagowy NaCl) wraz z kompensacją temperaturowej rozszerzalności cieczy (`src/core/brine-densitometry.ts`).
* **Zasady fizykochemiczne modelu:**
  1. **Konwersje skal:**
     * Salometr: $100^\circ\text{Sal} = 26.395\%\text{ wagowo NaCl}$ (roztwór nasycony przy 60°F / 15.56°C).
     * Skala Baumé: $^\circ\text{Bé} = 145 \times (1 - 1 / \text{SG})$ oraz $\text{SG} = 145 / (145 - ^\circ\text{Bé})$.
     * Wielomian gęstości pozornej CRC: $\text{SG}_{20} = 1.000 + 0.007077 \cdot P + 0.0000305 \cdot P^2$ dla $P \in [0, 26.4\%]$.
  2. **Kompensacja temperaturowa:**
     * Ciecz w chłodni dojrzewalniczej (10–12°C) jest gęstsza od wzorca 20°C (areometr wypływa wyżej, wskazując zawyżone zasolenie).
     * Współczynnik korekcji termicznej: $\Delta \text{SG} = (T_{próbki} - T_{wzorca}) \times 0.00032$.
  3. **Wbudowane profile serowarskie:**
     * Sery twarde (Gouda, Parmezan, Cheddar): 18–20°Bé / 72–80°Sal (19–21% NaCl).
     * Sery miękkie (Camembert, Brie): 13.5–15.5°Bé / 53–61°Sal (14–16% NaCl).
     * Sery parzone Pasta Filata (Mozzarella): 15.5–17.5°Bé / 60–68°Sal (16–18% NaCl).
     * Solanka do Fety: 6.8–8.3°Bé / 26–32°Sal (7–8.5% NaCl).
  4. **Kalkulator korekty dosypki soli:**
     * Dokładne wyliczenie gramów soli kamiennej do dosypania do istniejącej objętości solanki w celu osiągnięcia stężenia docelowego z uwzględnieniem bilansu masy rozpuszczalnika.
* **Kryteria akceptacji:**
  1. Karta zintegrowana w akordeonie Pro z selektorem jednostek (°Sal, °Bé, SG, % wag.).
  2. Alerty przed przesyceniem (>26% NaCl) i skrajnym rozcieńczeniem (<6% NaCl).
  3. 100% testów jednostkowych (`tests/core/brine-densitometry.test.ts`).
* **Persona:** P1, P2, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP/1.1.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: B2_Narzedzia_Obrobka_Skrzepu_Prasowanie.md -->
<!-- ========================================== -->

# **FERMENT BRD 0.1 — Rozdział 7: Narzędzia Serowarskie — Obróbka Skrzepu i Prasowanie (B2)**

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
  Nacisk jednostkowy $P$ zależy od pola powierzchni formy $A = \pi \times r^2$ (dla formy cylindrycznej o promieniu $r$) oraz ramienia dźwigni w prasach holenderskich:
  $$P [kg/cm^2] = \frac{m_{obciaznika} [kg] \times R}{\pi \times (\frac{d}{2})^2 [cm^2]}$$
  Gdzie $R$ to przełożenie dźwigni (dla nacisku bezpośredniego $R = 1.0$, dla prasy dźwigniowej $R = 3.0 - 5.0$), a $d$ to średnica formy serowarskiej.
* **Kryteria akceptacji:**
  1. Użytkownik wybiera średnicę formy (np. $\varnothing 14\text{ cm} \rightarrow A \approx 154\text{ cm}^2$, $\varnothing 20\text{ cm} \rightarrow A \approx 314\text{ cm}^2$).
  2. Użytkownik podaje typ prasy: Prasa bezpośrednia / grawitacyjna ($R=1$), Prasa dźwigniowa holenderska (użytkownik wpisuje długość ramienia A i B), Prasa pneumatyczna (wpisanie ciśnienia na manometrze w barach / PSI).
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

### **BR-CURD-025: Harmonogram Odwrócony Produkcji & Anti-Fatigue Sleep Guard**
* **Opis:** Zaadaptowany z silnika *Piekarz* system planowania wstecznego na osi czasu (`reverse-scheduler.ts`). Użytkownik definiuje docelową godzinę zakończenia wyrobu sera (np. sobota 22:00, przed pójściem spać), a silnik wylicza dokładny moment startu podgrzewania mleka oraz sekwencję kroków.
* **Algorytm i Bezpieczeństwo Kulinarne (Anti-Fatigue Guard):**
  1. Wyliczanie wsteczne: $T_{start} = T_{cel} - \sum t_{krokow}$.
  2. Analiza przedziału nocnego (23:00–06:00): Jeśli jakikolwiek aktywny krok wymagający interwencji (odwracanie w prasie, solenie, dogrzewanie) wypadnie w oknie snu, system generuje ostrzeżenie wysokiego priorytetu oraz rekomenduje wcześniejszą godzinę startu.
* **Persona:** P1, P2, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-CURD-030: Odzysk Serwatki i Gospodarka Zero-Waste (Ricotta & Izotonik)**
* **Opis:** Moduł zagospodarowania produktów ubocznych (`whey-utilization.ts`). Z 10 litrów mleka serowarskiego powstaje ok. 9 litrów słodkiej serwatki podpuszczkowej zawierającej cenne albuminy i globuliny.
* **Zasady technologiczne:**
  1. **Odzysk tradycyjnej Ricotty (Ziger):** Denaturacja białek w temperaturze 88–92°C z zakwaszeniem kwasem cytrynowym ($1.8\text{ g/L}$) lub octem. Obliczanie dodatku świeżego pełnego mleka (+10% / +20%) dla podwojenia kremowości i uzysku.
  2. **Rzemieślniczy napój izotoniczny (Alpejska Rivella):** Receptura bilansująca serwatkę, sok z cytryny, miód/cukier, świeżą miętę i wodę mineralną (bogaty w potas i peptydy bioaktywne).
* **Persona:** P1, P4, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-PRESS-015: Holenderska Prasa Dźwigniowa & Kaskada Prasowania (Dutch Lever & Rind Guard)**
* **Opis:** Fizyka prasy dźwigniowej z kompensacją tary belki oraz kaskadowy program formowania skórki (`press-cascade.ts`).
* **Formuła nacisku z tarą ramienia:**
  $$F_{laczna} = M_{odwaznik} \times \left(\frac{L_{ramie}}{L_{forma}}\right) + M_{ramie} \times \left(\frac{L_{ramie} / 2}{L_{forma}}\right)$$
* **Ochrona przed Rind Entrapment (Zakleszczenie Serwatki):**
  1. Faza 1 (45 min): Lekki nacisk (1.5x waga sera), swobodny odpływ serwatki bez zamykania porów.
  2. Faza 2 (120 min): Pierwszy obrót krążka, wyrównanie powierzchni (3.5x waga sera).
  3. Faza 3 (12h): Pełny docisk zamykający mikroszczeliny (7.5x waga sera).
  4. Blokada: Ostrzeżenie przed aplikacją maksymalnego obciążenia w fazie 1.
* **Persona:** P1, P2, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-PRESS-016: Przemywanie Ziarna & Odlaktozowanie (Curd Washing / Delactosing Thermal Equilibrium)**
* **Opis:** Bilans masowo-termiczny przemywania ziarna serowarskiego gorącą wodą (Gouda, Edam, Havarti). Usuwa część laktozy z serwatki, zapobiegając nadmiernemu przekwaszeniu i zapewniając elastyczną, maślaną strukturę miąższu.
* **Formuła równowagi cieplnej:**
  $$V_{woda} = \frac{(V_{mleko} - V_{odlana}) \cdot (T_{docelowa} - T_{ziarno})}{T_{goraca} - T_{docelowa}}$$
* **Wskaźnik odlaktozowania:**
  $$Ratio_{delacto} = \left(\frac{V_{odlana}}{V_{mleko}}\right) \times 100\%$$
* **Reguły ochronne:**
  - Alarm $T_{goraca} > 65^\circ\text{C}$: Ostrzeżenie przed zacięciem termicznym powierzchni ziaren (case hardening) i zniszczeniem mikroflory.
  - Alarm $T_{docelowa} > 39^\circ\text{C}$ dla kultur mezofilnych (*Lactococcus lactis*): Blokada przed zabiciem bakterii.
* **Persona:** P1, P2, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-PRESS-017: Kinetyka Synerezy Skrzepu & Dogrzewanie Ziarna (Curd Syneresis & Casein Shrinkage Kinetics)**
* **Opis:** Fizykochemiczny kalkulator dynamiki kurczenia ziaren kazeinowych podczas krojenia, mieszania i dogrzewania skrzepu (`curd-syneresis.ts`), zapobiegający defektowi zasklepienia porów kazeinowych (case hardening / protein skinning).
* **Zasady biochemiczne i parametry kinetyki:**
  1. **Rozmiary ziarna wg stylu sera:**
     * Bardzo drobne (3–5 mm): Parmezan, Grana, Emmental, Sbrinz (szybka synereza, niska wilgotność 30–35%).
     * Średnie (8–12 mm): Gouda, Edam, Cheddar, Tilsit (umiarkowana synereza, wilgotność 36–46%).
     * Grube (15–20 mm): Camembert, Brie, Reblochon (łagodna synereza, wilgotność 50–58%).
     * Płaty / fresh (25–35 mm): Feta, Halloumi, sery twarogowe (wilgotność 55–65%).
  2. **Tempo dogrzewania (Cooking Ramp Rate Kinetics):**
     * Złota zasada serowarska: tempo wzrostu temperatury nie może przekraczać 0.5°C/min (1°C na 2–3 minuty), zwłaszcza w krytycznym oknie 31–38°C.
     * Przekroczenie tempa bezpiecznego wywołuje alarm `CRITICAL_CASE_HARDENING`: gwałtowne odwodnienie zewnętrznej warstwy ziarna i wytworzenie nieprzepuszczalnej powłoki białkowej, która więzi wilgoć i laktozę w rdzeniu, prowadząc do późniejszego przekwaszenia i gorzkiego posmaku.
  3. **Równowaga micelarna wapnia a pH przy ocieku (Drain pH):**
     * Zbyt niskie pH (<6.20 w Goudzie): alarm `DECALCIFIED_BRITTLE_ACIDIC` — nadmierne wypłukanie wapnia koloidalnego, kruchy, kredowy miąższ.
     * Zbyt wysokie pH (>6.48): alarm `EXCESSIVE_CALCIUM_RUBBERY` — nadmiar wapnia micelarnego, struktura gumowata.
  4. **Wskaźnik intensywności synerezy (Syneresis Index 0–100):**
     * Zagregowana funkcja powierzchni właściwej ziarna, temperatury dogrzewania, czasu mieszania i zakwaszenia serwatki.
* **Kryteria akceptacji:**
  1. Zintegrowana karta w trybie `cheese` Pro Accordion.
  2. Testy jednostkowe (`tests/core/curd-syneresis.test.ts`) weryfikujące wykrywanie case hardening, bilans wapnia i szacowanie wilgotności końcowej.
* **Persona:** P1, P2, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP/1.1.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: B3_Narzedzia_Solenie_i_Solanki.md -->
<!-- ========================================== -->

# **FERMENT BRD 0.1 — Rozdział 7: Narzędzia Serowarskie — Solenie i Kąpiele Solankowe (B3)**

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
  * Gouda, Edam, Tylżycki: $K = 4.0 - 5.0\text{ h/kg}$ (np. krążek 2.0 kg $\rightarrow 8 - 10$ godzin).
  * Cheddar, sery twarde: $K = 6.0\text{ h/kg}$.
* **Kryteria akceptacji:**
  1. Uruchomienie odliczania z powiadomieniem w połowie czasu: *„Obróć krążek w solance”* (górna powierzchnia wystaje ponad lustro płynu).
  2. Powiadomienie krytyczne z dźwiękiem alarmowym po upływie czasu: *„Wyjmij ser z solanki i przenieś do ociekania/suszenia skórki.”*
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

### **BR-SOL-020: Regeneracja i Wzmocnienie Stężenia Solanki (Brine Salinity Boost & Top-Up)**
* **Opis:** Zaadaptowany z silnika *Słoik* kalkulator matematyczny bilansu masowego roztworów soli (`brine-topup.ts`). W procesie solenia serów kąpiel ulega ciągłemu rozcieńczaniu (ser oddaje wodę i pobiera sól).
* **Równanie bilansowe:**
  Ilość soli $m_{soli}$ do dosypania w celu podniesienia stężenia z $S_{1}\%$ do $S_{2}\%$ w objętości $V [L]$ bez wylewania solanki:
  $$m_{soli} [g] = \frac{V \times 1000 \times (S_{2} - S_{1})}{100 - S_{2}}$$
* **Kryteria akceptacji:**
  1. Wylicza gramaturę soli kamiennej do dodania do naczynia solankowego.
  2. Obsługuje scenariusz dolewki wody do słoików warzywnych, wyliczając dawkę soli kompensującą nową objętość.
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-SOL-025: Bufor Kwasowo-Wapniowy Solanki i Ochrona Przed Rozmiękaniem Skórki (Brine Acidification & Calcium Buffer)**
* **Opis:** Zapobieganie zjawisku rozmiękania i oślizgłości skórki (*slimy rind*) w solance poprzez chemiczną stabilizację równowagi osmotycznej wapnia i kwasowości (`brine-acidification.ts`).
* **Zasada chemiczna:**
  Czysta solanka przygotowana na bazie surowej wody kranowej (pH ~7.5) gwałtownie wyciąga jony wapnia ($Ca^{2+}$) z sieci kazeinowej sera do roztworu. Skórka staje się śluzowata, galaretowata i nie tworzy prawidłowej warstwy ochronnej.
* **Formuła buforowania:**
  1. **Bufor wapniowy:** Dodatek $2.0\text{ g}$ czystego bezwodnego $CaCl_2$ na każdy litr wody w solance (lub $6.0\text{ ml}$ roztworu 33%).
  2. **Miareczkowanie kwasowości (kwas mlekowy 80%):**
     $$V_{kwas}\text{ [ml]} = V_{wody}\text{ [L]} \times \frac{\max(0, pH_{wody} - 5.20)}{2.3} \times 2.2$$
     Pozwala to na precyzyjne zbicie pH solanki do optymalnego przedziału 5.20–5.40, identycznego z pH krążka sera.
* **Kryteria akceptacji:**
  1. Kalkulator w zakładce Solanki wylicza objętość kwasu mlekowego oraz wagę chlorku wapnia.
  2. Komunikat edukacyjny wyjaśniający mechanizm wymiany jonowej i zapobiegania usterkom mikrobiologicznym.
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-SOL-030: Solenie Ziarna w Masie dla Cheddara (Milling & Dry Salting With Whey Runoff Compensation)**
* **Opis:** Bezpośrednie solenie pociętego ziarna serowarskiego w kotle (metoda anglosaska - Cheddar, Caerphilly, Lancashire) z kompensacją strat soli w odciekającej pod prasą serwatce (`curd-washing-and-salting.ts`).
* **Formuła kompensacyjna:**
  $$m_{soli\_calkowita} = \frac{m_{ziarna} \times (S_{docelowa} / 100)}{1 - (Loss_{serwatka} / 100)}$$
  gdzie domyślny odciek soli w serwatce pod prasą wynosi 33%.
* **3-etapowy protokół zadawania soli:**
  1. Krok 1 (1/3 dawki): posypanie ziarna, mieszanie 3 min, 5 min spoczynku na pierwsze wyciągnięcie wilgoci.
  2. Krok 2 (1/3 dawki): ponowne mieszanie błyszczącego ziarna, 5 min spoczynku.
  3. Krok 3 (1/3 dawki): końcowe wymieszanie i natychmiastowy załadunek do chusty prasowalniczej.
* **Persona:** P1, P2, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-SOL-035: Kalkulator Powłok Ochronnych & Woskowania Krążka (Cheese Wax & Polyvinyl Coverage)**
* **Opis:** Precyzyjne obliczanie pola powierzchni walca sera ($A = 2\pi r^2 + 2\pi r h$) oraz gramatury wosku serowarskiego lub powłoki polioctanowej (z natamycyną) potrzebnej do zabezpieczenia krążka przed wysychaniem i pleśnią.
* **Wskaźniki zużycia materiału:**
  - Wosk serowarski (parafina/mikrowosk): $0.075\text{ g/cm}^2$ na warstwę. Zapewnia barierę wilgoci (0% ubytku).
  - Powłoka polioctanowa: $0.040\text{ g/cm}^2$ na warstwę. Zapewnia paroprzepuszczalność i ochronę przeciwgrzybiczą.
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-SOL-025: Dyfuzja Soli & Czas Przenikania Solanki wg Prawa Ficka (Fickian Salt Diffusion & Core Penetration Engine)**
* **Opis:** Fizykochemiczny model nieustalonej dyfuzji jonów $Na^+$ i $Cl^-$ w porowatym żelu kazeinowym oparty na II Prawie Ficka oraz modelach Geurtsa i Guinee (`brine-diffusion.ts`).
* **Zasady modelowania i parametry:**
  1. **Geometria i droga dyfuzji:**
     * Najkrótsza droga do rdzenia geometrycznego: $x_{core} = \min(r, h/2)$.
     * Czas dyfuzji skaluje się z kwadratem odległości ($t \propto x^2$), przez co krążki wysokie wymagają nieproporcjonalnie dłuższego leżakowania do wyrównania stężenia niż krążki płaskie.
  2. **Efektywny współczynnik dyfuzji ($D_{eff}$):**
     * Bazowy $D_0 \approx 0.28\text{ cm}^2/\text{dzień}$ w $12^\circ\text{C}$ dla wilgotności 42% i tłuszczu 48% FDM.
     * Wyższa wilgotność przyspiesza dyfuzję; wyższy tłuszcz działa jak geometryczna zawada (tortuosity) i ją spowalnia; temperatura wpływa zgodnie z relacją Arrheniusa (~3.5% na każdy $1^\circ\text{C}$).
  3. **Wyrównanie stężenia w centrum ($C_{core} \ge 1.0\%$):**
     * Oszacowanie liczby dni w piwniczce do osiągnięcia stężenia ochronnego w rdzeniu: $t_{eq} = \frac{x_{core}^2}{4 D_{eff}}$.
     * Alerty ochronne: ostrzeżenie o ryzyku zakażenia niedosolonego rdzenia przy $t_{eq} > 40\text{ dni}$ oraz zalecenie obniżenia temperatury dojrzewalni $<12^\circ\text{C}$.
  4. **Inwarianty solankowe:**
     * Wykrywanie zbyt słabej solanki ($<16\% \to$ slimy rind) oraz zbyt mocnej ($>23\% \to$ krystalizacja soli na skórce i blokada dyfuzji).
* **Kryteria akceptacji:**
  1. Reaktywny kalkulator w akordeonie Pro Serowarstwa wyliczający optymalny czas w solance (godz. i dni) oraz tempo pochłaniania soli (g/godz.).
  2. Wyliczanie liczby dni leżakowania w piwniczce do wyrównania stężenia soli w całym przekroju krążka.
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: B4_Narzedzia_Cave_Log_Dozor_Dojrzewania.md -->
<!-- ========================================== -->

# **FERMENT BRD 0.1 — Rozdział 7: Narzędzia Serowarskie — Cave Log i Dziennik Dojrzewania (B4)**

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

### **BR-CAVE-020: Krzywa Ubytku Masy (% Shrinkage Tracking)**
* **Opis:** Śledzenie parowania wody i zagęszczania smaku krążka sera w czasie.
* **Formuła ubytku:**
  $$\text{Shrinkage [\%]} = \frac{m_{poczatkowa} - m_{biezaca}}{m_{poczatkowa}} \times 100\%$$
* **Kryteria akceptacji:**
  * Wykres liniowy utraty wagi. Typowy ubytek dla sera twardego po 3 miesiącach to 8–14%. Przekroczenie 20% sygnalizuje zbyt suchą komorę dojrzewalniczą.
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-CAVE-025: Psychrometria Piwniczki, VPD & Case Hardening Guard**
* **Opis:** Ciągła analiza mikroklimatu dojrzewalni w oparciu o Deficyt Prężności Pary (VPD) i punkt rosy (`cave-environment.ts`).
* **Wskaźniki psychrometryczne:**
  * Prężność pary nasyconej: $VP_{sat} = 0.61078 \times \exp((17.27 \times T)/(T + 237.3))\text{ kPa}$.
  * Deficyt Prężności Pary: $VPD = VP_{sat} \times (1 - RH/100)$.
  * Punkt rosy $T_{dp}$ i delta temperaturowa.
* **Inwarianty bezpieczeństwa dojrzewania:**
  1. $VPD > 0.32\text{ kPa}$ lub $RH < 75\%$: **Alarm Case Hardening** (skórka twardnieje za szybko, blokując ucieczkę serwatki z wnętrza).
  2. $RH > 94\%$ lub delta do punktu rosy $< 1.0^\circ\text{C}$: **Alarm Kondensacji** (krople na krążku, rozwój dzikich pleśni Mucor/Aspergillus).
  3. Harmonogram affinage: generowanie etapów (obracanie, przemywanie solanką 4–18%, szczotkowanie, woskowanie) dla wybranego stylu sera.
* **Persona:** P1, P2, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-CAVE-030: Rejestr Czynności Pielęgnacyjnych Affinage & Trajektoria Ubytku Wagi (Affinage Actions & Shrinkage Tracker)**
* **Opis:** Kompleksowa rejestracja zabiegów pielęgnacyjnych na pojedynczych krążkach serów leżakujących w dojrzewalni oraz nadzór nad ubytkiem masy (`cave-log-actions.ts`).
* **Katalog akcji affinage:**
  1. `TURN` (Obrócenie krążka o 180°).
  2. `WASH_BRINE` (Przemycie roztworem solanki, wina, piwa lub zaszczepki *B. linens*).
  3. `DRY_BRUSH` (Wyszczotkowanie na sucho ze zbyt grubej warstwy pleśni *Penicillium* lub pyłu).
  4. `WAX_COATING` (Nałożenie ochronnej warstwy wosku serowarskiego lub parafiny).
  5. `CLOTHBOUND` (Bandażowanie krążka tkaniną bawełnianą nasączoną tłuszczem).
  6. `WEIGH` (Zważenie krążka i wyliczenie bieżącego ubytku wagi).
* **Inwarianty ochronne utraty wilgoci:**
  * Jeśli całkowity ubytek masy $\text{Shrinkage} > 20\%$, system generuje ostrzeżenie o krytycznym przesuszeniu miąższu i stwardnieniu skórki.
  * Historia czynności zapisywana w relacyjnej tabeli SQLite `cave_action_logs` i prezentowana w osi czasu krążka.
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-CAVE-031: Zagregowana Analityka Rzemieślnicza & Wskaźniki Produktywności (Artisan Production & Cave Statistics Engine)**
* **Opis:** Narządzie analityczne agregujące całościową historię rzemieślniczą gospodarstwa/serowarni: wolumen przetworzonego mleka, sukces partii, obciążenie piwniczki dojrzewalniczej, średnią jakość sensoryczną oraz zsumowane oszczędności finansowe (`fermentation-statistics.ts`).
* **Kluczowe wskaźniki rzemieślnicze:**
  1. **Bilans partii i wskaźnik sukcesu:**
     * Łączna liczba zarejestrowanych partii, liczba partii w toku vs zakończonych.
     * Wskaźnik sukcesu technologicznego: $\text{SuccessRate} = (\text{BatchesCompleted} / \text{TotalBatches}) \times 100\%$.
  2. **Skala surowcowa i obciążenie dojrzewalni:**
     * Zsumowana objętość przerobionego mleka (w litrach) w podziale na gatunki (krowie, kozie, owcze).
     * Liczba aktywnych krążków serów w piwniczce oraz ich sumaryczna masa w kilogramach po uwzględnieniu ubytku affinage.
  3. **Wskaźnik jakości organoleptycznej:**
     * Średnia ważona ocena sensoryczna partii w skali 0–100 pkt oraz rozkład klasyfikacyjny (Wybitny 90–100, Dobry 75–89, Akceptowalny 60–74, Wadliwy <60).
  4. **Ekonomiczny bilans oszczędności vs rynek:**
     * Szacowana oszczędność portfela użytkownika względem cen rzemieślniczych delikatesów ekologicznych (sery dojrzewające: ~45 zł / 10L mleka; kiszonki rzemieślnicze: ~35 zł / partię; kombucha craftowa: ~25 zł / 5L warkę).
* **Kryteria akceptacji:**
  1. Prezentacja rozwijanego panelu analitycznego na szczycie widoku Dziennika Partii.
  2. Automatyczne, reaktywne przeliczanie metryk po dodaniu, zważeniu, ocenie sensorycznej lub zakończeniu partii.
  3. Motywujące podsumowania postępów serowara i fermentatora domowego.
* **Persona:** P1, P4, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-CAV-016: Kalibracja Higrometru Solą wg ASTM E104 (Saturated Salt Hygrometer Calibration & Sensor Drift Guard)**
* **Opis:** Narządzie precyzyjnej kalibracji laboratoryjnej higrometrów i czujników wilgotności względnej (RH %) stosowanych w domowych dojrzewalniach sera przy użyciu roztworów nasyconych soli wg normy ASTM E104-02 (`hygrometer-calibration.ts`).
* **Wzorce soli nasyconych i wilgotności równowagowej:**
  1. **Sól kuchenna ($NaCl$):** $75.3\% \text{ RH}$ (przy 20°C) — podstawowa kalibracja domowa dostępna bez odczynników specjalistycznych.
  2. **Chlorek potasu ($KCl$):** $84.3\% \text{ RH}$ (przy 20°C) — złoty wzorzec dla serów twardych (Gouda, Cheddar, Gruyère).
  3. **Siarczan potasu ($K_2SO_4$):** $97.6\% \text{ RH}$ (przy 20°C) — wzorzec wysokiej wilgotności dla serów maziowych i pleśniowych.
  4. **Chlorek magnezu ($MgCl_2$):** $33.1\% \text{ RH}$ (przy 20°C) — dolny punkt odniesienia do kalibracji dwupunktowej ($y = ax + b$).
* **Klasyfikacja stanu sensora i alerty ochrony mikroklimatu:**
  * Błąd $\le \pm 2\%$: `EXCELLENT` (Wzorcowa precyzja sensora).
  * Błąd $\pm 3\% - \pm 6\%$: `ACCEPTABLE_DRIFT` (Typowy dryf sensora domowego skorygowany offsetem).
  * Błąd $\pm 7\% - \pm 12\%$: `SIGNIFICANT_DRIFT` (Znaczący błąd pomiaru wymagający stałej korekty programowej).
  * Błąd $> \pm 12\%$: `DEFECTIVE_SENSOR` (Krytyczne rozkalibrowanie sensora — zalecana wymiana sondy).
* **Diagnoza zagrożenia technologicznego:**
  * Gdy sensor zawyża wilgotność ($Offset < -4\%$): fałszywe poczucie wilgoci w piwniczce prowadzące do gwałtownego przesuszenia miąższu, pękania skórki i wady *case hardening*.
  * Gdy sensor zaniża wilgotność ($Offset > +4\%$): ukryta nadmierna wilgoć prowadząca do zjawiska *slip skin* (rozpływania się skórki) oraz inwazji czarnej pleśni *Mucor*.
* **Kryteria akceptacji:**
  1. Zintegrowana szuflada kalibracji solą w karcie Psychrometrii Piwniczki w Dzienniku Partii.
  2. Możliwość 1-tap zapisania offsetu i automatycznego uwzględniania go przy kalkulacji wskaźnika VPD i punktu rosy.
  3. Pełne testy jednostkowe (`tests/core/hygrometer-calibration.test.ts`).
* **Persona:** P1, P2, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP/1.1.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: B5_Narzedzia_Kiszonki_Kimchi_Zakwasy.md -->
<!-- ========================================== -->

# **FERMENT BRD 0.1 — Rozdział 7: Narzędzia Fermentacji — Kiszonki, Kimchi i Zakwasy (B5)**

> **Moduł:** `BR-KISZ-001` do `BR-KISZ-035`  
> **Kontekst dziedzinowy:** Prawdziwe solanki wagowe bazujące na całkowitej masie nastawu, dynamika 3 faz bakterii kwasu mlekowego (LAB), technologia kimchi, ochrona przed drożdżami kożuchującymi (Kahm).

---

### **BR-KISZ-001: Kalkulator Solanki Wagowej na Całkowitą Masę Nastawu**
* **Opis:** Eliminacja błędu „łyżki soli na litr wody”. Precyzyjne wyliczanie soli na łączną wagę warzyw i wody w naczyniu.
* **Matematyka bilansu (RD-26):**
  Użytkownik wprowadza wagę przygotowanych warzyw $m_w$ oraz przewidywaną objętość wody $V_{H2O}$ (lub waży naczynie zalane wodą).
  Wymagana masa czystej soli $m_{soli}$:
  $$m_{soli} [g] = \frac{S_{\%}}{100 - S_{\%}} \times (m_{warzyw} + m_{wody})$$
  Dla uproszczonego inżynieryjnego bilansu domowego (błąd < 0.05%):
  $$m_{soli} [g] = (m_{warzyw} [g] + m_{wody} [g]) \times \frac{S_{\%}}{100}$$
* **Sugerowane profile zasolenia w bazie:**
  * Ogórki małosolne: 1.5% – 1.8% (krótka fermentacja 2–4 dni).
  * Ogórki kiszone tradycyjne: 2.2% – 2.5% (długie leżakowanie).
  * Kapusta kiszona w soku własnym: 2.0% (solenie na sucho z ugniataniem).
  * Warzywa twarde (marchew, kalafior, rzodkiew): 2.5%.
  * Ostre sosy fermentowane (chilli mash): 3.0% – 3.5%.
* **Kryteria akceptacji:**
  1. Wynik podawany w gramach z dokładnością do 0.1 g.
  2. Komunikat ostrzegawczy przy próbie ustawienia stężenia < 1.5% (ryzyko mięknięcia i namnażania patogenów).
* **Persona:** P2, P4, P5.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-KISZ-006: Asystent Tradycyjnego Kimchi (Baechu-Kimchi)**
* **Opis:** Dwuetapowy proces przygotowania autentycznego kimchi z kapusty pekińskiej.
* **Etap 1 — Zasalanie i więdnięcie kapusty:**
  * Metoda sucha: nacieranie nasady liści solą morską (8–10% wagi kapusty na 4–6 godzin) z timerem obracania co 2 godziny.
  * Test elastyczności: liść zgięty w najgrubszym miejscu nie pęka, lecz wygina się w łuk.
  * Trzykrotne płukanie w zimnej wodzie i odsączanie na sicie przez minimum 60 minut (docelowe zasolenie w tkance: 1.8–2.0%).
* **Etap 2 — Przygotowanie pasty i inokulacja:**
  * Kalkulator proporcji: kleik z mąki ryżowej słodkiej (glutinous rice flour) + woda, płatki papryki gochugaru, tarty czosnek, świeży imbir, sos rybny (lub sojowy dla wegan), rzodkiew mu w słupki, szczypior.
* **Etap 3 — Protokół dwutemperaturowy:**
  * Faza 1 (Ruszenie w cieple): 24–48 godzin w temperaturze 18–20°C (aktywacja *Leuconostoc mesenteroides*, powstawanie pęcherzyków CO2).
  * Faza 2 (Powolna dojrzałość chłodnicza): przeniesienie do lodówki (2–4°C) na minimum 2–4 tygodnie w celu wykształcenia głębokiego profilu umami.
* **Persona:** P2, P3.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-KISZ-012: Monitor Trzech Faz Mikrobiologicznych LAB**
* **Opis:** Edukacyjny wskaźnik dynamiki populacyjnej bakterii fermentacji mlekowej w czasie trwania kiszenia:
  1. **Faza I (Dni 1–3, Heterofermentatywna):** dominacja *Leuconostoc mesenteroides*. Wytwarzanie kwasu mlekowego, kwasu octowego, etanolu i $CO_2$. Szybki spadek pH z 6.5 do 4.5.
  2. **Faza II (Dni 4–10, Homofermentatywna):** dominacja kwasolubnego *Lactiplantibacillus plantarum*. Intensywna produkcja kwasu mlekowego, spadek pH do 3.8–4.0. Stabilizacja środowiska.
  3. **Faza III (Dni 11+, Dojrzewanie):** dominacja *Levilactobacillus brevis* i *Pediococcus pentosaceus*. Wykończenie profilu aromatycznego.
* **Kryteria akceptacji:**
  * Graficzna oś czasu prezentująca dominujący szczep bakteryjny na podstawie bieżącego dnia nastawu i zmierzonego pH.
* **Persona:** P2, P5.
* **Priorytet:** SHOULD | **Etap:** MVP.

---

### **BR-KISZ-018: Diagnostyk Drożdży Kożuchujących (Kahm Yeast vs Pleśń)**
* **Opis:** Algorytm decyzyjny pomagający użytkownikowi odróżnić nieszkodliwy kożuch drożdżowy od niebezpiecznej pleśni wytwarzającej mikotoksyny.
* **Kryteria diagnostyczne w aplikacji:**
  * **Drożdże kożuchujące (Kahm / Pichia / Debaryomyces):** cienka, biała lub kremowa błonka na powierzchni, pofałdowana jak bibuła, brak pionowych włosków, nie jest zielona/czarna, zapach chlebowy/drożdżowy. Instrukcja: zebrać czystą łyżką, upewnić się, że warzywa są pod dociskiem, sprawdzić szczelność naczynia.
  * **Pleśń (Mold / Aspergillus / Penicillium):** plamisty porost z widocznymi meszkowatymi włoskami (grzybnia), kolory: zielony, czarny, niebieski, różowy lub puszysty biały. Zapach stęchły, ziemisty. Instrukcja: **Wyrzucić cały nastaw! Toksyny grzybowe przenikają w głąb roztworu.**
* **Persona:** P2, P4, P5.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-LAB-010: Monitor Kinetyki Zakwaszania LAB (Acidification Curve & Safety Guard)**
* **Opis:** Modelowanie dynamiki spadku pH w czasie i ocena aktywności bakterii kwasu mlekowego (`fermentation-kinetics.ts`).
* **Wzorzec kinetyki fermentacji spontanicznej:**
  * Faza rozruchu (0–24h): *Leuconostoc mesenteroides* obniża pH do ~5.20.
  * Faza krytyczna (24–48h): przejście przez barierę $pH \le 4.60$ (blokada jadu kiełbasianego).
  * Faza dojrzała (48–72h+): dominacja *Lactobacillus plantarum* z docelowym plateau $pH \approx 3.60 - 3.90$.
* **Kryteria akceptacji:**
  1. Wyliczanie teoretycznego pH oczekiwanego dla danego czasu od nastawienia.
  2. Generowanie alarmu krytycznego przy braku zakwaszenia po 72h ($pH > 4.60$).
  3. Sugestie interwencyjne przy spowolnionej fermentacji (docieplenie, kontrola wody).
* **Persona:** P2, P4, P5, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-LAB-011: Kompensacja Kinetyki Temperaturowej Q10 (Ambient Q10 Velocity & Spoilage Barrier)**
* **Opis:** Silnik dynamicznego skalowania czasu fermentacji mlekowej w zależności od wahań temperatury pokojowej (`fermentation-q10.ts`), oparty na empirycznym współczynniku $Q_{10} = 2.2$ dla bakterii kwasu mlekowego.
* **Wzory matematyczne i strefy termiczne:**
  $$v = Q_{10}^{(\Delta T / 10)}, \quad t_{\text{adj}} = \frac{t_{\text{nom}}}{v}$$
  * `< 16°C (DORMANT_SLUGGISH)`: Uśpienie LAB, ryzyko gnicia i namnażania drożdży kożuchujących przed przełamaniem bariery pH 4.60.
  * `16–19°C (SLOW_CRISP)`: Powolna fermentacja, maksymalna chrupkość i jędrność warzyw (bardzo stabilne pektyny).
  * `20–23°C (GOLDILOCKS_OPTIMAL)`: Idealna równowaga heterofermentacji i homofermentacji.
  * `24–27°C (RAPID_ACCELERATED)`: Bardzo szybki spadek pH, zalecany monitoring co 12h.
  * `> 27°C (HEAT_STRESS_SPOILAGE)`: Ryzyko rozmiękania tkanek (rozpad pektyn) i posmaku drożdżowego.
* **Kryteria akceptacji:**
  1. Reaktywne przeliczanie dni i godzin fermentacji oraz szacowanego momentu sforsowania bariery $pH \le 4.60$.
  2. Dedykowane komunikaty ostrzegawcze i zalecenia profilaktyczne w UI.
* **Persona:** P2, P5, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-KISZ-019: Obliczanie Pojemności Słoja, Wyporności Docisku i Wolnej Przestrzeni (Crock Headspace & Overflow Guard)**
* **Opis:** Fizyczny kalkulator objętości wsadu warzywnego, solanki oraz wyporności ciężarka dociskowego (`crock-headspace.ts`), zabezpieczający przed zalaniem blatu wyciekiem z naczynia oraz nadmiarem tlenu.
* **Kryteria akceptacji:**
  1. Uwzględnienie gęstości materiału docisku (szkło bezołowiowe: $2.50\text{ g/ml}$, ceramika: $2.30\text{ g/ml}$, granit: $2.70\text{ g/ml}$).
  2. Wyliczanie wolnej przestrzeni (headspace w ml oraz % objętości słoja).
  3. Klasyfikacja ryzyka:
     * `headspace < 40 ml`: `RISK_OVERFLOW` (ostrzeżenie przed wylewaniem solanki podczas fazy burzliwej $CO_2$).
     * `headspace > 25%`: `RISK_EXCESS_OXYGEN` (ostrzeżenie przed dużą poduszką tlenową sprzyjającą kożuchowi).
     * `totalVolume > jarCapacity`: `CRITICAL_SPILL` (blokada przed przelaniem naczynia).
  4. Rekomendacja optymalnej masy docisku (min. 20% masy warzyw).
* **Persona:** P2, P5.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-KISZ-020: Dynamiczny Harmonogram Kamieni Milowych i Odgazowywania Słoików (Adaptive Fermentation Timeline & Jar Burping Engine)**
* **Opis:** Adaptacyjny silnik harmonogramowania etapów fermentacji, terminów odgazowywania naczynia (burping) oraz punktów kontroli sensorycznej (tasting gates), skalowany kinetyką temperaturową $Q_{10}$ (`fermentation-timeline.ts`).
* **Kluczowe reguły harmonogramowania:**
  1. **Odgazowywanie słoików (Jar Burping Schedule):**
     * Dla beztlenowych kiszonek warzywnych i refermentacji kombuchy (2F) w hermetycznych słojach generowany jest harmonogram codziennego uchylania wieczka przez pierwsze 2–4 dni w celu uwolnienia nadmiaru ciśnienia $CO_2$ i zapobieżenia pęknięciu szkła.
  2. **Skalowanie kinetyką termiczną ($Q_{10} = 2.2$ dla LAB):**
     * W temperaturze 25°C czas fermentacji ulega skróceniu o ok. 32% (tempo 1.48x); w 15°C proces ulega wydłużeniu o 47% (tempo 0.68x).
  3. **Kamienie milowe procesu:**
     * Dzień 1: faza burzliwa (*Leuconostoc mesenteroides*), gwałtowne odgazowywanie.
     * Dzień 3: bariera biologiczna $pH \le 4.60$ (*Lactobacillus plantarum*), pierwsza degustacja kwasowości.
     * Dzień 7: wyciszenie gazowania, rekomendacja schłodzenia do 4°C w celu zahamowania nadmiernego przekwaszania.
     * Dzień 14: pełna dojrzałość stołowa i zbalansowana chrupkość.
* **Kryteria akceptacji:**
  1. Dynamiczne wyliczanie dat i godzin każdego kamienia milowego na podstawie znacznika czasu utworzenia partii (`createdAt`).
  2. Prezentacja plakietki z alertem o odgazowywaniu oraz najbliższym zadaniem na karcie aktywnej partii w Dzienniku Partii.
  3. Formułowanie spersonalizowanych zaleceń technologicznych w zależności od temperatury otoczenia.
* **Persona:** P2, P5, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-KISZ-021: Ekstrakcja Botaniczna & Ochrona Chrupkości Przed Pektynazami (Botanical Extraction & Pectinase Tannin Engine)**
* **Opis:** Moduł biochemiczny szacujący stężenie garbników roślinnych (elagotanin, garbników skondensowanych) niezbędnych do denaturacji endogennych i pleśniowych enzymów pektolitycznych (pektynaz) niszczących chrupkość ogórków i warzyw kiszonych, wraz z kinetyką uwalniania allicyny z czosnku (`botanical-extraction.ts`).
* **Kluczowe reguły biochemiczne i parametry dawek:**
  1. **Baza surowców garbnikowych:**
     * Liście dębu szypułkowego (*Quercus robur*): 45 mg garbników / g.
     * Liście wiśni (*Prunus cerasus*): 30 mg / g.
     * Liście czarnej porzeczki (*Ribes nigrum*): 25 mg / g.
     * Korzeń chrzanu (*Armoracia rusticana*): 12 mg / g + glukozynolany (synigryna).
     * Liście chrzanu: 15 mg / g.
     * Liść laurowy (*Laurus nobilis*): 20 mg / g.
     * Liście winorośli (*Vitis vinifera*): 35 mg / g.
     * Liście czarnej herbaty (*Camellia sinensis*): 80 mg / g.
  2. **Próg denaturacji pektynaz:**
     * Minimalna dawka ochronna: $80\text{ mg}$ aktywnych garbników na 1 kg masy wsadu warzywnego.
     * Klasyfikacja: poniżej 40 mg/kg (`INADEQUATE_RISK_OF_MUSHY` — ryzyko kapcanienia i zmiękczenia ogórków), 40–80 mg/kg (`MODERATE_PROTECTION`), 80–250 mg/kg (`OPTIMAL_CRISP` — idealna jędrność), powyżej 350 mg/kg (`OVER_ASTRINGENT` — nieprzyjemna ściągająca cierpkość).
  3. **Kinetyka uwalniania allicyny z alliliny (*Allium sativum*):**
     * Ząbki w łupinie: 5% wydajności allicyny.
     * Całe ząbki obrane: 20% wydajności.
     * Zgniecione płasko nożem (bruised): 85% wydajności (optimum rzemieślnicze).
     * Drobno posiekane / starte: 100% natychmiastowej allicyny (ostrzeżenie przy dawce >20 g/kg o przejściowym zahamowaniu kultur *Lactobacillus*).
* **Kryteria akceptacji:**
  1. Zintegrowana karta w trybie `veg` Pro Accordion.
  2. Pełne pokrycie testami jednostkowymi (`tests/core/botanical-extraction.test.ts`).
* **Persona:** P2, P5, P6.
* **Priorytet:** MUST | **Etap:** MVP/1.1.

---

### **BR-KISZ-022: Enzymatyka Koji, Shio Koji & Słodkie Amazake (Koji Solid-State Hydrolysis & Formulation Engine)**
* **Opis:** Fizjologiczno-enzymatyczny model produktów hydrolizowanych przez *Aspergillus oryzae* (shio koji, słodkie amazake, formulacje miso Shiro i Akamiso) z rygorystyczną kontrolą okna termicznego enzymów amylolitycznych i proteolitycznych (`src/core/koji-fermentation.ts`).
* **Kluczowe reguły biochemiczne:**
  1. **Shio Koji (Enzymatyczna pasta do marynowania):**
     * Proporcje wsadu: Koji (100g) + Woda (135g dla suszonego / 110g dla świeżego nama-koji) + Sól (ok. 30–35g) = bezpieczne zasolenie ok. 11.5% masy ogólnej.
     * Alerty bezpieczeństwa: zasolenie <9% grozi niekontrolowanym skwaszeniem mlekowym; zasolenie >15% silnie hamuje aktywność proteaz (słabe kruszenie włókien mięśniowych).
     * Tryb termiczny: fermentacja pokojowa (22°C, 7–10 dni, wymagane codzienne mieszanie i napowietrzanie) vs przyspieszona hydroliza sous-vide (58°C, 8 godzin, gotowe w 1 dzień).
     * Dawkowanie kulinarne: 10% wagi mięsa / tofu, czas marinacji 2–12 godzin.
  2. **Amazake (Słodki bezalkoholowy napój ryżowy):**
     * Okno termiczne amylaz: ściśle 55°C – 60°C (optymalna produkcja glukozy i maltozy do ~24°Bx).
     * Alert $T < 52^\circ\text{C}$: `RISK_OF_LACTIC_SOURING` (namnażanie dzikich bakterii kwasu mlekowego, kwaszenie zamiast słodyczy).
     * Alert $T > 63^\circ\text{C}$: `CRITICAL_AMYLASE_DENATURATION` (nieodwracalne zniszczenie enzymów $\alpha$-amylazy i glukoamylazy, utrata słodkości, surowy kleik).
  3. **Formulacje Miso i ciężary dociskowe:**
     * Shiro Miso (jasne, słodkie): 5.5% soli, fermentacja 1.5 miesiąca, docisk 20% wagi wsadu.
     * Akamiso (ciemne, wytrawne): 12.0% soli, fermentacja 12 miesięcy, docisk 30% wagi wsadu (ochrona przed zakażeniem powierzchniowym).
* **Kryteria akceptacji:**
  1. Karta zintegrowana w trybie Kiszonki & Warzywa Pro Accordion z selektorem trybów (Shio Koji, Amazake, Miso).
  2. 100% testów jednostkowych (`tests/core/koji-fermentation.test.ts`).
* **Persona:** P2, P5, P6.
* **Priorytet:** MUST | **Etap:** MVP/1.1.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: B6_Narzedzia_Kombucha_i_Octy.md -->
<!-- ========================================== -->

# **FERMENT BRD 0.1 — Rozdział 7: Narzędzia Fermentacji — Kombucha i Żywe Octy (B6)**

> **Moduł:** `BR-KOM-001` do `BR-KOM-030`  
> **Kontekst dziedzinowy:** Symbiotyczne kultury bakterii i drożdży (SCOBY), 1F fermentacja tlenowa, 2F nasycanie CO2 w butelkach i zapobieganie eksplozjom, dwuetapowa konwersja kwasu octowego (*Acetobacter*).

---

### **BR-KOM-001: Kalkulator Nastawu Bazowego Kombuchy (Faza 1F)**
* **Opis:** Obliczanie proporcji naparu herbacianego, cukru i płynu starterowego dla zadanego naczynia fermentacyjnego.
* **Receptura wzorcowa (na 1.0 litr gotowego napoju):**
  * Herbata czarna lub zielona (*Camellia sinensis*): $6.0 - 8.0\text{ g}$.
  * Cukier sacharoza: $60.0 - 70.0\text{ g}$ (pożywka dla drożdży).
  * Woda filtrowana/przegotowana: dopełnienie.
  * Płyn starterowy (dojrzała, kwaśna kombucha z poprzedniej partii o pH < 3.0): $100 - 150\text{ ml}$ ($10 - 15\%\$ objętości). Cel: natychmiastowe obniżenie pH wsadu poniżej 4.5 w celu ochrony grzybka SCOBY przed zakażeniem dzikimi pleśniami.
* **Kryteria akceptacji:**
  1. Kalkulator dynamicznie skaluje gramatury herbaty i cukru dla słojów o pojemności od 1L do 25L.
  2. Przypomnienie o konieczności całkowitego ostudzenia herbaty (< 26°C) przed włożeniem krążka SCOBY (temperatura > 35°C zabija mikroorganizmy).
  3. Instrukcja przykrycia słoja przewiewną tkaniną lnianą/bawełnianą zabezpieczoną gumką (bakterie kwasu octowego wymagają tlenu).
* **Persona:** P2, P3, P5.
* **Priorytet:** MUST | **Etap:** MVP/1.1.

---

### **BR-KOM-008: Asystent Refermentacji Butelkowej (Faza 2F) i Kalkulator Ciśnienia**
* **Opis:** Nadzór nad nasycaniem kombuchy dwutlenkiem węgla w szczelnie zamkniętych butelkach szklanych z dodatkiem owoców lub soków.
* **Fizyka i biochemia 2F:**
  Drożdże w warunkach beztlenowych konsumują cukry proste zawarte w owocach i wytwarzają $CO_2$ oraz śladowy etanol.
  Rozpuszczalność gazu zależy od ciśnienia i temperatury (prawo Henry'ego).
* **Kryteria akceptacji:**
  1. Kalkulator dodatku cukrów w 2F: bezpieczna dawka cukru owocowego wynosi $5 - 10\text{ g/L}$.
  2. Czas refermentacji w temp. pokojowej (20–23°C): 2 do 4 dni.
  3. **Krytyczny Alert Eksplozji Szkła:** aplikacja wysyła powiadomienie push w 3. dobie: *„Sprawdź ciśnienie w butelkach! Jeśli napój jest nagazowany, natychmiast wstaw butelki do lodówki (2–4°C). Niska temperatura usypia drożdże i zatrzymuje wzrost ciśnienia.”*
  4. Ostrzeżenie przed użyciem butelek ozdobnych z cienkiego szkła (nakaz stosowania butelek z grubego szkła ciśnieniowego do piwa/szampana z zamknięciem kabłąkowym).
* **Persona:** P2, P3.
* **Priorytet:** MUST | **Etap:** MVP/1.1.

---

### **BR-KOM-015: Stechiometryczny Kalkulator Żywych Octów Owocowych**
* **Opis:** Nadzór nad dwuetapową produkcją octów rzemieślniczych (np. jabłkowy, malinowy, miodowy).
* **Etap 1 — Fermentacja alkoholowa (Beztlenowa / Drożdże):**
  $$C_6H_{12}O_6 \xrightarrow{Drożdże} 2 C_2H_5OH + 2 CO_2$$
  Z $1^\circ\text{Brix}$ cukru powstaje w przybliżeniu $0.55\%\text{ ABV}$ alkoholu.
  Moszcz owocowy o gęstości 12°Brix daje wino/cydr o mocy ok. 6.6% ABV.
* **Etap 2 — Oksydacja kwasu octowego (Tlenowa / Acetobacter):**
  $$C_2H_5OH + O_2 \xrightarrow{Acetobacter} CH_3COOH + H_2O + 493\text{ kJ/mol}$$
  Wydajność stechiometryczna: z $1.0\%\$ alkoholu powstaje w optymalnych warunkach ok. $0.9 - 1.0\%\$ kwasu octowego.
* **Kryteria akceptacji:**
  1. Użytkownik wpisuje początkowe °Brix owoców lub zmierzony procent alkoholu bazy.
  2. System wylicza przewidywaną kwasowość octu (% kwasu octowego).
  3. Jeśli wsad alkoholowy ma > 8% ABV (np. mocne wino), aplikacja nakazuje rozcieńczenie czystą wodą: bakterie octowe ulegają inhibicji przy zbyt wysokim stężeniu etanolu.
* **Persona:** P3, P7.
* **Priorytet:** MUST | **Etap:** 1.1.

---

### **BR-VIN-020: Miareczkowanie Kwasowości Miareczkowej Octu (Titratable Acidity TA)**
* **Opis:** Precyzyjne laboratoryjne wyznaczanie rzeczywistego stężenia kwasu octowego metodą miareczkowania roztworem $0.1\text{ M NaOH}$ w obecności fenoloftaleiny (`fermentation-kinetics.ts`).
* **Formuła chemiczna:**
  $$\% \text{ Kwasu Octowego (w/v)} = \frac{V_{NaOH}\text{ [ml]} \times 0.0060052}{V_{probki}\text{ [ml]}} \times 100\%$$
* **Kryteria akceptacji:**
  1. Klasyfikacja wyrobu: poniżej 5.0% (substandard, łagodny ocet stołowy), 5.0–6.0% (standardowy ocet stołowy zgodny z normą spożywczą), powyżej 6.0% (moc marynatowa).
  2. Ostrzeżenie przy zbyt niskiej kwasowości o obniżonej trwałości mikrobiologicznej octu.
* **Persona:** P3, P6, P7.
* **Priorytet:** MUST | **Etap:** 1.1.

---

### **BR-KOM-020: Mieszanie Owocowe 2F & Dynamika Wysycenia (Fruit Blending & Bottle Pressure Rating)**
* **Opis:** Fizykochemiczne modelowanie ciśnienia i objętości rozpuszczonego $CO_2$ w butelkach podczas refermentacji 2F z owocami i sokami (`kombucha-blending.ts`).
* **Wzorcowe profile ekstraktu cukrów (°Brix):**
  * Sok jabłkowy 100% tłoczony: $11.5^\circ\text{Bx}$
  * Sok malinowy / puree: $7.5^\circ\text{Bx}$
  * Ekstrakt imbirowo-cytrynowy z miodem: $14.0^\circ\text{Bx}$
  * Sok z granatu: $13.0^\circ\text{Bx}$
  * Cukier trzcinowy (syrop): $65.0^\circ\text{Bx}$
* **Klasyfikacja odporności ciśnieniowej butelek:**
  * Butelka z pałąkiem (Heavy Swing-Top Amber): limit $4.5\text{ vol } CO_2$ (~3.8 bar).
  * Butelka do piwa kapslowana (Crown Cap): limit $3.5\text{ vol } CO_2$ (~2.8 bar).
  * Ciężka butelka do szampana: limit $6.0\text{ vol } CO_2$.
  * **Butelka kwadratowa / ozdobna (Square Decorative):** limit $1.8\text{ vol } CO_2$ — **BEZWZGLĘDNY ZAKAZ UŻYCIA / ZAGROŻENIE EKSPLOZJĄ SZKŁA!**
* **Kryteria akceptacji:**
  1. Wyliczenie stężenia cukru dodanego z sokiem oraz przewidywanych vol $CO_2$ i ciśnienia w barach przy 20°C.
  2. Krytyczny alert w przypadku wyboru butelki kwadratowej lub przekroczenia limitu ciśnienia.
  3. Zalecenie schłodzenia butelek do 4°C przed otwarciem (zwiększenie rozpuszczalności $CO_2$ i zapobieganie gushingowi).
* **Persona:** P2, P3, P5.
* **Priorytet:** MUST | **Etap:** MVP/1.1.

---

### **BR-OCT-012: Korektor Refraktometru Optycznego w Środowisku Alkoholowym (Terrill Brix-to-SG Engine)**
* **Opis:** Fizykochemiczny korektor odczytu refraktometru optycznego (°Bx) uwzględniający zakłócenie współczynnika załamania światła przez powstający w procesie fermentacji etanol (`refractometer-alcohol.ts`).
* **Zastosowane modele matematyczne:**
  1. **Dla win owocowych i cydrów ($OB \ge 8^\circ\text{Bx}$):** sześcienny wielomian Terrilla:
     $$SG = 1.001843 - 0.002318474 \cdot OB + 0.000007775 \cdot OB^2 - 0.000000034 \cdot OB^3 + 0.00574 \cdot FB - 0.00003344 \cdot FB^2 + 0.000000086 \cdot FB^3$$
  2. **Dla kombuchy ($OB < 8^\circ\text{Bx}$):** stechiometryczna konwersja empiryczna:
     $$\Delta\text{Brix} = OB - FB, \quad \text{ABV} = \max(0, \Delta\text{Brix} \times 0.58)$$
* **Kryteria akceptacji:**
  1. Wyznaczanie skorygowanej gęstości pozornej (corrected SG) oraz ekstraktu rzeczywistego w stopniach Plato (°P).
  2. Wyliczanie stężenia alkoholu (% ABV).
  3. Alerty bezpieczeństwa biologicznego:
     * Ostrzeżenie przed inhibicją bakterii octowych (*Acetobacter*) przy $\text{ABV} > 8.0\%$.
     * Weryfikacja statusu bezalkoholowości kombuchy ($\le 0.5\% \text{ ABV}$).
* **Persona:** P3, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP/1.1.

---

### **BR-KOM-025: Hotel SCOBY & Zarządzanie Matecznikiem Kultur Żywych (Mother Colony Hotel & Invariant Safety)**
* **Opis:** Moduł zarządzania długoterminową rezerwą starterową dla kolonii symbiotycznych: Hotel SCOBY, Matka Octowa (*Mycoderma aceti*), Ziarna Kefiru Mlecznego, Kryształy Wodne (Tibicos) oraz Serwatka Mateczna (`culture-hotel-engine.ts`).
* **Kluczowe reguły biologiczne:**
  1. **Harmonogram zasilania i głodu:**
     * Hotel SCOBY w temp. pokojowej: nominalne zasilanie słodką herbatą (25–30% objętości) co 35 dni; krytyczny próg głodu po 60 dniach. W chłodzie (lodówka 4°C): zasilanie co 90 dni, limit 150 dni.
     * Matka octowa: napowietrzenie i zasilenie 5% etanolem co 28 dni.
     * Ziarna kefiru: room temp 24–48h; chłodnia co 14 dni. Przyrost ziaren: typowo +15% na cykl fermentacyjny.
  2. **Bariera antypleśniowa ($pH \le 3.20$):**
     * Jeśli pH w hotelu wzrośnie powyżej 3.20 (kombucha) lub 3.40 (ocet), system natychmiast generuje alarm krytyczny (ryzyko zasiedlenia przez zarodniki pleśni *Penicillium* / *Aspergillus*) i nakazuje natychmiastowe dokwaszenie.
  3. **Wskaźnik autolizy drożdży (Yeast Sludge Purge):**
     * Gdy warstwa martwego osadu drożdżowego na dnie słoja przekroczy 2.0 cm, generowane jest zalecenie dekantacji i płukania naczynia, aby zapobiec autolizie i uwalnianiu do roztworu nieprzyjemnych nut siarkowych.
* **Kryteria akceptacji:**
  1. Reaktywna ocena stanu witalności kolonii (`HEALTHY_ACTIVE`, `DUE_FOR_FEEDING`, `STARVATION_RISK`, `DORMANT_REFRIGERATED`).
  2. Precyzyjna receptura dolewki (objętość płynu, gramatura cukru, liści herbaty).
  3. Lista kontrolna pielęgnacji i checklisty ochronne (tkanina bawełniana, brak metalowych narzędzi).
* **Persona:** P2, P3, P5, P6.
* **Priorytet:** MUST | **Etap:** MVP/1.1.

---

### **BR-OCT-013: Tradycyjny Żywy Niefiltrowany Ocet Jabłkowy (Living Apple Cider Vinegar Heritage Recipe)**
* **Opis:** Kanoniczna receptura rzemieślnicza żywego, biologicznie czynnego octu jabłkowego z matką octową (*Mycoderma aceti*), obejmująca 2-fazowy proces: fermentację alkoholową z dzikimi drożdżami oraz tlenowe utlenianie octowe przez *Acetobacter* (`canonical-recipes.ts`).
* **Kluczowe parametry i reguły technologiczne:**
  1. **Dwufazowy cykl biochemiczny:**
     * Faza 1 (beztlenowa/półtlenowa, 14–21 dni): drożdże przekształcają cukry owocowe w etanol (target: 5–7% ABV).
     * Faza 2 (tlenowa oksydacja, 4–6 tygodni): bakterie kwasu octowego utleniają etanol do kwasu octowego ($CH_3CH_2OH + O_2 \rightarrow CH_3COOH + H_2O$).
  2. **Optymalne warunki środowiskowe:**
     * Temperatura 20–25°C przy stałym dostępie tlenu atmosferycznego (naczynie zabezpieczone gęstą tkaniną bawełnianą przed muszkami owocówkami *Drosophila melanogaster*).
     * Końcowe pH: $2.80 - 3.20$ (minimalne stężenie kwasu octowego $\ge 5\%$).
* **Kryteria akceptacji:**
  1. Dostępność receptury w bibliotece kanonicznej z dokładnymi proporcjami (jabłka ekologiczne, woda niechlorowana, cukier/miód, matka octowa).
  2. Wyliczanie kamieni milowych w osi czasu: dekantacja owoców, tworzenie błonki celulozowej matki octowej, miareczkowanie kwasowości.
* **Persona:** P3, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-KOM-026: Kombucha Ciągła (Continuous Brew Siphon & Maintenance Engine)**
* **Opis:** Moduł zarządzania systemem ciągłej fermentacji kombuchy w naczyniu ze stali nierdzewnej lub szkła z kranikiem spustowym (`continuous-brew.ts`).
* **Kluczowe reguły biochemiczne i serwisowe:**
  1. **Bezpieczny współczynnik rozlewu (Safe Draw Ratio 20–30%):**
     * Z naczynia zlewane jest periodycznie od 20% do maksymalnie 33% dojrzałego napoju.
     * Przekroczenie 35% objętości poboru generuje alarm krytyczny: ryzyko załamania tarczy kwasowej i wzrostu pH powyżej 4.20 przed dogonieniem kwasowości przez *Komagataeibacter*, co stwarza wrota zakażenia dla pleśni.
     * Pozostawione $\ge 70\%$ objętości stanowi bufor ochronny i aktywny inokulant.
  2. **Parametry uzupełniania słodkiej herbaty:**
     * Objętość dolewki równa objętości poboru.
     * Zrównoważone stężenie sacharozy w ciągłym warzeniu: nominalnie 70 g/L (obniżone względem 80–100 g/L warzenia wsadowego, ze względu na dużą gęstość komórkową SCOBY i zapobieganie zbyt gwałtownemu przekwaszeniu octowemu).
     * Herbata: 5 g/L (czas parzenia zależny od bazy: 10 min zielona/biała, 12 min oolong, 15 min czarna). Schłodzenie do $\le 28^\circ\text{C}$ przed wlaniem.
  3. **Logarytmiczne rozcieńczenie pH (Antimicrobial Shield Verification):**
     * Dynamiczne szacowanie pH po dolaniu: $[H^+]_{mix} = \frac{[H^+]_{res} \cdot V_{res} + [H^+]_{refill} \cdot V_{refill}}{V_{tot}}$.
     * Wartość docelowa po dolaniu musi spełniać $pH \le 4.00$ (rekomendowane $\le 3.60$).
  4. **Dozór osadu drożdżowego (Yeast Trub Purge & SCOBY Trimming):**
     * Gromadzenie pasm drożdżowych przy dnie w tempie ok. 2 mm na cykl.
     * Po 8 cyklach: status `UPCOMING` (przygotowanie do serwisu).
     * Po 12 cyklach: status `OVERDUE` (nakaz dekantacji 20% czystego starteru, usunięcia brunatnych warstw z dołu grzybka SCOBY, wypłukania osadu z dna i udrożnienia kranika).
* **Kryteria akceptacji:**
  1. Kalkulator zintegrowany w trybie `beverage` Pro Accordion.
  2. Pełne testy jednostkowe (`tests/core/continuous-brew.test.ts`) pokrywające tempo cyklu, rozcieńczenie pH, granice poboru i alerty serwisu.
* **Persona:** P3, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP/1.1.

---

### **BR-KOM-027: Jednostki Pasteryzacji (PU) & Termiczna Stabilizacja Biologiczna (Pasteurization Units & Thermal Stabilization Engine)**
* **Opis:** Matematyczny model termicznego czasu śmierci drobnoustrojów (Thermal Death Time / model Bigelowa) dla stabilizacji refermentacji kombuchy (2F), utrwalania żywych octów owocowych, fermentowanych sosów chili i niskotemperaturowej pasteryzacji kiszonek (`pasteurization-units.ts`).
* **Formuła akumulacji jednostek pasteryzacji:**
  $$PU = t \times 10^{\frac{T - T_{ref}}{z}}$$
  gdzie $t$ to czas przetrzymania (minuty), $T$ to temperatura w rdzeniu butelki (°C), $T_{ref}$ to temperatura referencyjna (60.0°C lub 65.0°C), a $z$ to współczynnik wrażliwości termicznej drobnoustrojów docelowych (°C).
* **Profile docelowe i ochrona sensoryczna:**
  1. **Kombucha owocowa 2F (`KOMBUCHA_STABILIZATION`):**
     * Cel: 15–25 PU ($T_{ref} = 60^\circ\text{C}, z = 7.0^\circ\text{C}$).
     * Dezaktywacja drożdży (*Saccharomyces*, *Brettanomyces*), zatrzymująca wzrost ciśnienia w butelkach swing-top.
     * Limit sensoryczny: $T_{max} \le 68^\circ\text{C}$ (ochrona przed posmakiem gotowanej herbaty i degradacją polifenoli).
  2. **Żywy ocet owocowy (`LIVING_VINEGAR_PRESERVATION`):**
     * Cel: 20–30 PU ($T_{ref} = 60^\circ\text{C}, z = 6.0^\circ\text{C}$).
     * Zatrzymanie ciągłego narastania matki octowej w butelkach handlowych bez utraty rześkiego aromatu.
  3. **Fermentowane sosy chili (`FERMENTED_HOT_SAUCE`):**
     * Cel: 50–100 PU ($T_{ref} = 65^\circ\text{C}, z = 8.0^\circ\text{C}$) — stabilność w temperaturze pokojowej.
  4. **Pasteryzacja niskotemperaturowa kiszonek (`CRISP_PICKLE_JAR`):**
     * Cel: 100–180 PU ($T_{ref} = 65^\circ\text{C}, z = 10.0^\circ\text{C}$) — inaktywacja enzymów pektolitycznych bez gotowania miąższu.
* **Kryteria akceptacji:**
  1. Zintegrowana karta w trybie `beverage` Pro Accordion z protokołem powolnego chłodzenia (zapobieganie szokowi termicznemu szkła).
  2. Testy jednostkowe (`tests/core/pasteurization-units.test.ts`) weryfikujące obliczenia Bigelowa i detekcję ryzyka sensorycznego.
* **Persona:** P3, P5, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP/1.1.

---

### **BR-KOM-028: Standaryzacja Kwasowości Octu & Natlenianie Lustra Cieczy (Vinegar Grain Strength & Surface Aeration Engine)**
* **Opis:** Narzędzie standaryzacji mocy kwasowej octu rzemieślniczego w stopniach Grain ($10\text{ Grain} = 1.0\%\text{ kwasu octowego}$), bilansu rozcieńczania kwadratem Pearsona, stechiometrii konwersji etanolu oraz aeracji naczynia w zależności od stosunku powierzchni do objętości ($A/V$) (`vinegar-standardization.ts`).
* **Kluczowe moduły i reguły biochemiczne:**
  1. **Skala mocy Grain Strength & Klasyfikacja Handlowa:**
     * 40 Grain (4.0%): minimalna dopuszczalna norma spożywcza (poniżej: alert `SUB_STANDARD_LOW` — ryzyko rozwoju pleśni i drożdży kożuchujących).
     * 50 Grain (5.0%): wzorcowy stołowy ocet żywy jabłkowy / winny (`STANDARD_TABLE_50_GRAIN`).
     * 60 Grain (6.0%): ocet marynatowy do trwałych przetworów i pikli (`PICKLING_PRESERVE_60_GRAIN`).
  2. **Rozcieńczanie Kwadratem Pearsona (Pearson Square Dilution):**
     * Precyzyjne wyliczanie ilości wody niechlorowanej lub soku owocowego wymaganej do zredukowania wysokiej kwasowości wyjściowej (np. 7.5% $\to$ 5.0%):
       $$V_{rozc} = V_{surowy} \times \frac{C_{surowy} - C_{docelowy}}{C_{docelowy} - C_{rozc}}$$
     * Rekomendacja zachowania 15–20% surowego nierościeńczonego octu jako aktywnego inokulantu (starter mother liquor) przed dolewką wody.
  3. **Stechiometria Pastera (Etanol $\to$ Kwas Octowy):**
     * Teoretyczna wydajność: $1.0\text{ g etanolu} \to 1.303\text{ g kwasu octowego}$ ($1\% \text{ ABV} \approx 1.05\%\text{ kwasu}$).
     * Uwzględnienie 85% sprawności biologicznej *Acetobacter*.
     * Alerty stężenia alkoholu: $>8.0\%$ ABV generuje ostrzeżenie o inhibicji bakterii octowych i zepsuciu wsadu zapachem rozpuszczalnika (octan etylu); $<4.0\%$ ABV generuje ostrzeżenie o zbyt słabym occie (<3.5% kwasowości).
  4. **Kinetyka Natleniania Powierzchniowego ($A/V$ Ratio):**
     * Bakterie octowe są bezwzględnymi tlenowcami tworzącymi błonkę matki na powierzchni cieczy.
     * Stosunek powierzchni do objętości $A/V\text{ [cm}^2/\text{L]}$:
       * $< 25\text{ cm}^2/\text{L}$ (wąskoszyjkowy gąsior): `STAGNANT_SUFFOCATION` — dławienie bakterii, fermentacja przeciąga się do 4–6 miesięcy lub zatrzymuje.
       * $60 - 160\text{ cm}^2/\text{L}$ (szeroki słój / płytka kamionka): `OPTIMAL_ARTISAN` — dynamiczna fermentacja w 3–5 tygodni.
       * $> 180\text{ cm}^2/\text{L}$: `EXCESSIVE_EVAPORATION` — ryzyko nadmiernego odparowania lotnych estrów.
* **Kryteria akceptacji:**
  1. Karta zintegrowana w akordeonie Pro napojów w [`app/(tabs)/index.tsx`](file:///c:/Users/lukas/Documents/antigravity/calm-planck/app/(tabs)/index.tsx).
  2. Pełne testy jednostkowe (`tests/core/vinegar-standardization.test.ts`).
* **Persona:** P3, P5, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP/1.1.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: B7_Narzedzia_Spizarnia_Naczynia_Etykiety.md -->
<!-- ========================================== -->

# **FERMENT BRD 0.1 — Rozdział 7: Narzędzia — Spiżarnia, Etykiety PDF i Koszty (B7)**

> **Moduł:** `BR-MAG-001` do `BR-MAG-030`  
> **Kontekst dziedzinowy:** Gospodarka surowcowa z automatycznym odpisem po sesji, druk etykiet A4 z kodami QR przez `expo-print`, kalkulator uzysku serowarskiego (% yield) i kosztu partii.

---

### **BR-MAG-001: Cyfrowa Spiżarnia i Inwentarz Surowców**
* **Opis:** Ewidencja posiadanych surowców i kultur w gospodarstwie domowym.
* **Kategorie magazynowe:**
  * Mleko (L) — data udoju, dostawca.
  * Podpuszczki (ml / g) — data ważności, moc IMCU.
  * Kultury bakterii i pleśni (fiolki / saszetki DVI) — szczepy, waga, data przydatności.
  * Sole i dodatki mineralne — chlorek wapnia (g/ml), sól kłodawska niejodowana (kg).
  * Surowce roślinne i cukry — kapusta, warzywa, herbaty, cukier sacharoza.
* **Kryteria akceptacji:**
  * Ostrzeżenie o zbliżającym się terminie przydatności kultur liofilizowanych (przechowywanych w zamrażarce -18°C).
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-MAG-005: Automatyczny Odpis Magazynowy po Sesji (Auto-Depletion)**
* **Opis:** Po zakończeniu procesu (np. przeniesienie krążka sera do solanki lub zakręcenie słojów z kimchi) aplikacja automatycznie odejmuje zużyte ilości surowców z bazy inwentarza.
* **Kryteria akceptacji:**
  1. Podsumowanie zużycia przed zatwierdzeniem: *„Z magazynu zostanie odpisane: 20L mleka krowiego, 1.2 ml podpuszczki Fromase, 0.4 g kultury Choozit MA11, 400 g soli.”*
  2. Jeśli w magazynie brakuje surowca, aplikacja ostrzega przed rozpoczęciem sesji i proponuje zamiennik.
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-MAG-010: Generator Etykiet i Paszportów PDF z Kodem QR (`expo-print`)**
* **Opis:** Generowanie profesjonalnych arkuszy etykiet PDF w formacie A4 (siatka etykiet samoprzylepnych lub zawieszek na krążki sera i słoiki).
* **Zawartość pojedynczej etykiety:**
  * Nazwa sera / przetworu i numer partii (Batch ID).
  * Data produkcji, data solenia, minimalna data dojrzałości.
  * Skład surowcowy (gatunek mleka, użyte kultury).
  * Wektorowy kod QR z zakodowanym schematem deep-link `ferment://batch/<id>` pozwalający na natychmiastowe otwarcie karty partii w telefonie za pomocą aparatu.
* **Kryteria akceptacji:**
  * Wygenerowanie pliku PDF gotowego do wydruku przez AirPrint lub zapisania w plikach systemowych iOS.
* **Persona:** P1, P2, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-MAG-015: Kalkulator Wydajności Serowej (% Cheese Yield) i Kosztu Krążka**
* **Opis:** Obliczanie realnego uzysku sera z mleka oraz kosztu jednostkowego wytworzenia kilograma produktu.
* **Wzór wydajności serowarskiej:**
  $$\text{Yield [\%]} = \frac{m_{sera\ swiezego\ po\ prasowaniu} [kg]}{V_{mleka} [L] \times \rho_{mleka} [kg/L]} \times 100\%$$
  *Typowa wydajność:* mleko krowie 9–11%, mleko kozie 8–10%, mleko owcze 18–25% (wysoka zawartość kazeiny i tłuszczu).
* **Rachunek kosztu krążka:**
  $$\text{Koszt całkowity} = \text{Koszt mleka} + \text{Koszt kultur i enzymów} + \text{Koszt energii grzania} + \text{Sól}$$
  Aplikacja prezentuje koszt całkowity partii oraz koszt w przeliczeniu na 1 kg dojrzałego sera.
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-MAG-020: Przelicznik Form i Ekwiwalentów Składników (Ingredient Substitutions Engine)**
* **Opis:** Zaadaptowany z silnika *Oczko* kalkulator przeliczania form enzymów koagulujących, starterów mikrobiologicznych i soli mineralnych (`ingredient-substitutions.ts`).
* **Kluczowe moduły przeliczeniowe:**
  1. **Konwerter podpuszczki:** Przeliczanie mocy w IMCU na różne postacie handlowe: płynna (200 IMCU/ml), proszek mikrobiologiczny Fromase (2000 IMCU/g), tabletki mikrobiologiczne Meito (ok. 2500 IMCU/tabl) oraz pasta jagnięca/koźlęca z aktywnością lipolityczną (100 IMCU/g).
  2. **Ekwiwalenty kultur naturalnych (zamiast DVS):** Zastępowanie kultur liofilizowanych naturalnymi starterami — świeżą żywą maślanką/zsiadłym mlekiem z mleka surowego (mezofile, $18\text{ ml/L}$) lub żywym gęstym jogurtem greckim (termofile, $15\text{ g/L}$).
  3. **Postacie chlorku wapnia ($CaCl_2$):** Bezwodny ($111\text{ g/mol}$) vs dwuwodny dihydrate ($147\text{ g/mol}$) vs roztwór wodny 33% i 10%.
* **Persona:** P1, P2, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-MAG-025: Dirty-Hands Steppers i Skaner Deep-Link (Pantry Steppers & Deep-Linking)**
* **Opis:** Ergonomia mokrych rąk w spiżarni oraz bezdotykowa nawigacja po partiach i krążkach (`qr-deeplink.ts` + `QrScannerModal.tsx`).
* **Kluczowe funkcjonalności:**
  1. **Dotykowe steppery $\ge 56\text{ pt}$:** Szybka korekta stanu magazynowego (`-1` / `+1`) jednym tapnięciem bez otwierania klawiatury systemowej.
  2. **Obsługa protokołu deep-link:** Obsługa schematów `ferment://batch/<id>` oraz `ferment://wheel/<id>`.
  3. **Reakcja na skan kodu QR:** Po zeskanowaniu etykiety krążka lub partii aplikacja automatycznie przełącza widok na odpowiednią zakładkę (Dziennik Partii lub Piwniczka), rozwija historię pielęgnacji oraz prezentuje modal szybkich akcji (Obróć / Zważ / Oceń sensorycznie).
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-MAG-011: Eksport Dziennika Produkcyjnego i Spiżarni do RFC 4180 CSV (Production CSV Export Engine)**
* **Opis:** Generowanie standaryzowanych arkuszy kalkulacyjnych CSV dla partii produkcyjnych, krążków piwnicznych oraz stanu magazynowego spiżarni (`csv-export.ts`).
* **Kryteria akceptacji:**
  1. Zgodność ze specyfikacją RFC 4180 (bezpieczne uciekanie znaków specjalnych, przecinków, cudzysłowów i nowych linii).
  2. Generowanie plików CSV dla:
     * Dziennika Partii (kod partii, data, nazwa, kategoria, status, parametry początkowe, notatki).
     * Dziennika Dojrzewalni Sera (kod krążka, typ sera, data wyrobienia, waga początkowa i bieżąca, ubytek masy %, stan skórki, historia obracania).
     * Magazynu Spiżarni (nazwa, kategoria, ilość, jednostka, data minimalnej trwałości, stan minimalny).
  3. Bezpieczne udostępnianie pliku przez natywny mechanizm `expo-sharing` (współdzielenie z arkuszami Excel, Google Sheets, AirDrop).
  4. Dostępność również w trybie READ-ONLY po wygaśnięciu okresu próbnego (prawo użytkownika do własnych danych).
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-MAG-015: Zaawansowany Kalkulator Kosztów Partii, Energii i Oszczędności Domowych (Batch Cost & Affinage ROI)**
* **Opis:** Kalkulator ekonomiczny partii rzemieślniczej (`batch-cost-engine.ts`) modelujący realny koszt wytworzenia sera dojrzewającego, kiszonek i kombuchy, uwzględniający energię cieplną podgrzewania mleka, zużycie prądu przez chłodziarki piwniczne/witryny winiarskie oraz porównanie z cenami rynkowymi delikatesów ekologicznych.
* **Struktura kosztów w modelu:**
  1. **Surowce bazowe i dodatki:**
     * Mleko zagrodowe (PLN/L), warzywa ekologiczne (PLN/kg), woda filtrowana.
     * Kultury DVS, podpuszczka IMCU, $CaCl_2$, sól kamienna niejodowana, cukier, liście herbaty.
     * Opakowania i powłoki (wosk serowarski, polioctan, woreczki próżniowe, kapsle koronowe).
  2. **Energia technologiczna:**
     * Gotowanie / dogrzewanie gęstwy serowarskiej: $P\text{ [kW]} \times t\text{ [h]} \times \text{cena kWh}$ (domyślnie 1.15 PLN/kWh).
     * Dojrzewalnia sera (Affinage Cave Chiller): $\text{Dni} \times 0.6\text{ kWh/dzień} \times \text{cena kWh}$.
  3. **Wskaźniki jednostkowe i ROI:**
     * Koszt całkowity partii (PLN).
     * Koszt wyrobu gotowego po odcieku serwatki i ubytku masy w piwniczce (PLN/kg lub PLN/L).
     * Koszt porcji 100g (PLN).
     * Oszczędność względem odpowiedników rzemieślniczych (np. rzemieślnicza Gouda zagrodowa: 110 PLN/kg, surowa kombucha: 22 PLN/L, kiszonki bio: 48 PLN/kg) z wyliczeniem kwoty zaoszczędzonej w PLN i procentowo (%).
* **Kryteria akceptacji:**
  1. Przełącznik profilu rzemiosła: 🧀 Serowarstwo | 🥬 Kiszonki & Kimchi | 🫖 Kombucha.
  2. Dynamiczny przelicznik kosztów w czasie rzeczywistym.
  3. Podsumowanie finansowe prezentowane użytkownikowi w czytelnym boksie z gratulacjami oszczędności.
* **Persona:** P1, P2, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: B8_Narzedzia_Zegarki_LiveActivity_Sensory.md -->
<!-- ========================================== -->

# **FERMENT BRD 0.1 — Rozdział 7: Narzędzia — Zegarki, Live Activity, Sensory i Sensoryka (B8)**

> **Moduł:** `BR-SYS-001` do `BR-SYS-030`  
> **Kontekst dziedzinowy:** Hands-free w kuchni serowarskiej, Apple Watch, Garmin Connect IQ, widżety Live Activity w czasie rzeczywistym, odczyt z czujników BLE, wektorowy radar sensoryczny smaku i tekstury (SVG).

---

### **BR-SYS-001: Asystent Live Activity i Dynamic Island (iOS ActivityKit)**
* **Opis:** Ciągła prezentacja odliczania kluczowych faz procesu serowarskiego na zablokowanym ekranie iPhone'a oraz w Dynamic Island.
* **Scenariusze Live Activity:**
  1. **Odliczanie do punktu flokulacji:** stoper miseczki z przyciskiem szybkiej akcji „Złapano flokulację”.
  2. **Odliczanie do cięcia skrzepu:** czas mnożnika flokulacji ($t_f \times M$).
  3. **Rampa dogrzewania skrzepu:** aktualna temperatura docelowa i tempo grzania.
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
  * Wyświetlanie aktualnego kroku procesu (np. „Mieszaj gęstwę — jeszcze 4 minuty”).
  * Dźwiękowa i haptyczna sygnalizacja alarmów obrotu sera w prasie i solance.
* **Kryteria akceptacji:**
  * Niezależne działanie timera na Apple Watch nawet przy zerwanym połączeniu Bluetooth z telefonem.
* **Persona:** P1, P6.
* **Priorytet:** SHOULD | **Etap:** MVP/1.1.

---

### **BR-SYS-015: Bezprzewodowa Integracja z Czujnikami Środowiskowymi BLE**
* **Opis:** Automatyczne pobieranie odczytów temperatury i wilgotności względnej z bezprzewodowych tagów Bluetooth Low Energy umieszczonych w dojrzewalni lub pojemnikach fermentacyjnych.
* **Wspierane czujniki (protokoły broadcast Manufacturer Data):**
  * **RuuviTag (Finlandia):** format RAWv2 (temperatura, wilgotność z dokładnością do 0.1%, ciśnienie atmosferyczne).
  * **Xiaomi Mijia BLE (np. LYWSD03MMC z firmware ATC/BTHome):** temperatura i wilgotność.
* **Kryteria akceptacji:**
  1. Aplikacja nie wymaga parowania z chmurą producenta — nasłuchuje lokalnych pakietów rozgłoszeniowych BLE w tle.
  2. Automatyczne dopisywanie odczytów do wykresu mikroklimatu partii w Cave Log.
* **Persona:** P6, P7.
* **Priorytet:** COULD | **Etap:** 1.1.

---

### **BR-SYS-020: Wektorowy Radar Sensoryczny Smaku i Tekstury (Spider Radar SVG)**
* **Opis:** Interaktywny wykres pajęczynowy oceny dojrzałości sera oraz profilu smakowego kiszonek i kombuchy.
* **Osie sensoryczne sera:**
  1. Kwasowość (Acidity)
  2. Słoność (Salinity)
  3. Wilgotność / Elastyczność (Moisture / Elasticity)
  4. Maślanowość / Kremowość (Creaminess / Diacetyl)
  5. Ostrość / Pikantność (Pungency / Lipolysis)
  6. Orzechowość / Słodycz (Nuttiness / Proteolysis)
* **Kryteria akceptacji:**
  * Wektorowy komponent SVG renderowany w 100% lokalnie, z możliwością nałożenia profilu wzorcowego stylu sera na profil uzyskany przez użytkownika.
* **Persona:** P1, P3, P6, P7.
* **Priorytet:** SHOULD | **Etap:** MVP.

---

### **BR-SENS-010: Silnik Oceny Sensorycznej i Balansu Organoleptycznego (Sensory Evaluation & Artisan Critique Engine)**
* **Opis:** 6-osiowy model punktacji sensorycznej i diagnostyki wad rzemieślniczych dla wszystkich kategorii wyrobów (`sensory-evaluation.ts`).
* **Osie sensoryczne (skala 1–10):**
  1. Kwasowość (*Acidity*).
  2. Słoność (*Salinity*).
  3. Zwartość / Chrupkość (*Firmness / Crispness*).
  4. Kremowość / Tekstura (*Creaminess / Texture*).
  5. Pikantność / Ostrość (*Pungency / Sharpness*).
  6. Orzechowość / Czystość (*Nuttiness / Cleanliness*).
* **Klasyfikacja punktowa (0–100 pkt):**
  * $90 - 100\text{ pkt}$: `EXEMPLARY` (Wybitna harmonia smakowa, wzorcowa równowaga).
  * $75 - 89\text{ pkt}$: `GOOD` (Bardzo dobry, zbalansowany wyrób rzemieślniczy).
  * $55 - 74\text{ pkt}$: `ACCEPTABLE` (Wyrób poprawny z drobnymi odchyleniami).
  * Poniżej $55\text{ pkt}$: `FLAWED` (Wada technologiczna / błąd fermentacji).
* **Diagnostyka wad i rekomendacje naprawcze:**
  * Ser: wykrywanie kredowości/nadkwasowości (rekomendacja: washing the curd), przesolenia, zjełczenia tłuszczów (lipoliza).
  * Kiszonki: utrata chrupkości i rozkład pektyn (rekomendacja: liście dębu/chrzanu bogate w garbniki, obniżenie temp. fermentacji < 20°C).
  * Kombucha/Octy: mdły posmak i brak kwasowości (rekomendacja: wydłużenie 1F, lepszy dostęp tlenu).
* **Kryteria akceptacji:**
  1. Integracja w widoku partii z możliwością 1-tap zapisu oceny do tabeli `sensory_evaluations`.
  2. Wyświetlanie wykrytych wad i konkretnych porad rzemieślniczych.
* **Persona:** P1, P2, P3, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-SENS-015: Doktor Fermentacji — Drzewo Decyzyjne Diagnostyki Wad i Triage Bezpieczeństwa Biologicznego (Fermentation Doctor)**
* **Opis:** Interaktywny asystent diagnozowania anomalii wizualnych, zapachowych i teksturalnych we wszystkich 4 rzemiosłach (serowarstwo, kiszonki, kombucha, żywe octy) z automatyczną klasyfikacją ryzyka biologicznego (`fermentation-diagnostics.ts`, `FermentationDoctorModal.tsx`).
* **Kategorie bezpieczeństwa (Safety Verdicts):**
  1. `SAFE_EDIBLE`: wyrób w pełni bezpieczny biologicznie, obecna jedynie kosmetyczna lub przejściowa wada smakowa (np. goryczka kazeinowa w młodym serze, papkowate ogórki z rozpadem pektyn nadające się na zupę).
  2. `COSMETIC_FLAW`: wada powierzchniowa nieszkodliwa po usunięciu (np. drożdże kożuchujące Kahm *Pichia* / *Debaryomyces* — usunięcie łyżką i przemycie ścianek octem).
  3. `REPAIRABLE_RISK`: aktywne zagrożenie technologiczne wymagające natychmiastowej interwencji krok po kroku (np. zapach acetonu w kombuchy, zapach siarkowodoru $H_2S$ w occie usuwany drucikiem miedzianym i napowietrzaniem, zasklepienie skórki *case hardening*).
  4. `BIOHAZARD_DISCARD`: bezwzględny nakaz natychmiastowej utylizacji wyrobu (zagrożenie mykotoksynami pleśni *Aspergillus*, jadem kiełbasianym *Clostridium botulinum*, wczesnym wzdęciem coliformami *E. coli* czy zgnilizną beztlenową przy $pH > 4.60$).
* **Kryteria akceptacji:**
  1. Wyszukiwarka objawów po słowach kluczowych (np. "gąbka", "pleśń", "gorzki", "kahm", "smród").
  2. Podział na rzemiosła (Sery, Kiszonki, Kombucha, Octy).
  3. Szczegółowe wyjaśnienie mikrobiologiczne z łacińskimi nazwami gatunków bakterii i grzybów.
  4. Instrukcja naprawcza krok po kroku oraz zalecenia profilaktyczne na przyszłość.
* **Persona:** P1, P2, P3, P5, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-SEN-004: Koło Smaków Mikrobiologicznych (Microbial Flavor Wheel Lexicon & Distribution Engine)**
* **Opis:** Interaktywny leksykon sensoryczny i koło smaków modelujące 40 standaryzowanych deskryptorów smakowo-zapachowych dla serowarstwa, kiszonek, kombuchy i żywych octów (`flavor-wheel-data.ts`, `FlavorWheelModal.tsx`).
* **5 Fundamentalnych Wektorów Smakowych:**
  1. **Mleczne & Maślane (`LACTIC`):** Świeże mleko (laktoza), Świeże masło / Diacetyl (2,3-butanodion), Zsiadłe mleko (kwas L-mlekowy), Słodka serwatka, Mleko skondensowane, Jogurt grecki (acetaldehyd), Twaróg klinkowy, Masło klarowane ghee (laktony gamma).
  2. **Kwasowo-Owocowe (`FRUITY_ACID`):** Zielone jabłko (kwas jabłkowy), Czysty kwas octowy (*Acetobacter*), Ananas/marakuja (maślan etylu), Skórka cytryny (limonen), Kiszona śliwka (benzaldehyd), Czerwona porzeczka, Kwas winowy, Dojrzała gruszka (octan izoamylu).
  3. **Orzechowo-Karmelowe (`NUTTY_CARAMEL`):** Prażony orzech laskowy (pirazyny), Palone masło/toffee (reakcja Maillarda), Skórka chleba na zakwasie (2-acetylo-1-pirolina), Prażone migdały (kwas propionowy), Ciemny karmel (maltol), Skórka orzecha włoskiego (taniny), Słód jęczmienny, Miód gryczany.
  4. **Ziemisto-Grzybowe (`EARTHY_FUNGAL`):** Świeża pieczarka (*1-okten-3-ol*, *P. camemberti*), Wilgotna piwnica (geosmina), Leśna ściółka (2-metyloizoborneol), Błękitna trufla (*P. roqueforti*, dwusiarczek dimetylu), Kora świerkowa (elagotaniny), Wapienna ściana (krzemień), Korzeń pietruszki, Ciemny torf humusowy.
  5. **Zwierzęco-Pikantne (`ANIMAL_PUNGENT`):** Dojrzały kozi profil (kwasy kapronowy/kaprylowy/kaprynowy), Skóra juchtowa (p-krezol, skatol), Fermentowany czosnek/kimchi (dwusiarczek allilu), Czerwona maź (*Brevibacterium linens*, metanotiol), Ostra gorczyca (alliloizotiocyjanian), Ostry amoniak (deaminacja aminokwasów), Zagroda/siano (kwas izowalerianowy), Wędzarnia olchowa (gwajakol, eugenol).
* **Kluczowe funkcjonalności:**
  1. Wyszukiwanie pełnotekstowe po nazwie, opisie i cząsteczce chemicznej.
  2. Zrównoważenie wektorów smakowych: wykres rozkładu procentowego i liczbowego w zaznaczonej partii.
  3. 1-tap wklejanie sformatowanego znacznika `[Koło Smaków: ...]` bezpośrednio do notatek degustacyjnych partii w bazie SQLite.
* **Kryteria akceptacji:**
  1. Pełne testy jednostkowe (`tests/core/flavor-wheel-data.test.ts`) potwierdzające obecność 40 deskryptorów i 8 na kategorię.
  2. Dostępność modalnego koła smaków zarówno z nagłówka ekranu partii, jak i wewnątrz karty oceny organoleptycznej.
* **Persona:** P1, P2, P3, P4, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: C1_Nauka_Szkola_Serowarstwa_i_Fermentacji.md -->
<!-- ========================================== -->

# **FERMENT BRD 0.1 — Rozdział 7: Szkoła Rzemiosła i Kompas Diagnostyczny (C1)**

> **Moduł:** `BR-EDU-001` do `BR-EDU-040`  
> **Kontekst dziedzinowy:** Baza wiedzy o mikroorganizmach serowarskich i fermentacyjnych, interaktywny atlas kultur, kompas diagnostyczny defektów i zakażeń sera, diagnostyk chorób przetwórstwa.

---

### **BR-EDU-001: Interaktywna Szkoła Serowarstwa Zagrodowego**
* **Opis:** System modularnych kursów i przewodników krok po kroku wyjaśniających biochemiczne podstawy koagulacji, synerezy, solenia i affinage.
* **Kluczowe moduły edukacyjne:**
  1. *Lekcja 1: Biochemia Kazeiny* — dlaczego micele kazeinowe odpychają się elektrostatycznie (frakcja k-kazeiny) i jak chymozyna odcina hydrofilowy ogonek glikomakropeptydu, inicjując żelowanie.
  2. *Lekcja 2: Rola Wapnia Koloidalnego* — jak temperatura niszczy mostki $Ca^{2+}$ i dlaczego $CaCl_2$ ratuje mleko pasteryzowane.
  3. *Lekcja 3: Mezofile vs Termofile* — różnice metaboliczne kultur, optymalne temperatury, szlak cytrynianowy i produkcja diacetylu (aromat maślany) vs kwas L-mlekowy.
  4. *Lekcja 4: Fizyka Synerezy* — wielkość ziarna, rampa dogrzewania i mechaniczne wyciskanie serwatki.
  5. *Lekcja 5: Ekologia Dojrzewalni* — sukcesja mikroflory na skórce: drożdże odkwaszające (*Geotrichum*) -> bakterie maziowe (*Brevibacterium linens*) lub pleśnie białe (*Penicillium camemberti*).
* **Persona:** P1, P4, P5.
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

### **BR-EDU-020: Diagnostyk Chorób Kiszonek i Fermentów Roślinnych**
* Diagnoza: kożuch drożdżowy Kahm vs pleśnie mikotoksynowe, mięknięcie ogórków (brak garbników/enzymy pektynazy), ciągliwość/śluzowatość solanki (*Leuconostoc* w niskiej temperaturze tworzący dekstran), przebarwienia czosnku na niebiesko-zielono (nieszkodliwe związki izoalliiny w środowisku kwasowym).

---

### **BR-EDU-025: SOR Ratunkowy Fermentacji & Triage Awaryjny (Emergency Recovery Protocols)**
* **Opis:** Zaadaptowany z silnika *Słoik* protokół natychmiastowego ratowania zagrożonych partii biologicznych (`emergency-recovery.ts`).
* **Szybka kategoryzacja usterki i plan ratunkowy:**
  1. **Brak zestalenia skrzepu:** dogrzanie do 35°C w płaszczu wodnym, suplementacja $CaCl_2$, zadanie 50% świeżej podpuszczki bez wirowania. W ostateczności konwersja na twaróg kwasowy.
  2. **Ucieczka kwasowości (przekwaszenie):** natychmiastowe zlanie kwaśnej serwatki, płukanie wodą 38°C (curd washing), redukcja czasu solenia o 25%.
  3. **Śluzowata skórka w solance:** kąpiel naprawcza w zbuforowanej solance z 1% $CaCl_2$ i pH 5.2.
  4. **Kożuszek Kahm na powierzchni:** zebranie cienkiej błony wyparzoną łyżką, sprawdzenie anaerobowości, dociążenie wsadu. Partia zdatna do spożycia.
  5. **Zakażenie pleśnią grzybka SCOBY:** puszysta, zielona/czarna grzybnia z zarodnikami — **BEZWZGLĘDNY NAKAZ UTYLIZACJI (FATAL_DISCARD)** całego słoika ze względu na mikotoksyny wnikające w głąb płynu.
  6. **Zatrzymana fermentacja octowa:** rozcieńczenie wsadu wodą do 5–6% ABV i zapewnienie stałego dopływu tlenu przez przewiewną gazę.
* **Persona:** P1, P2, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-EDU-030: Chemia Wody & Neutralizacja Chloraminy (Water Chemistry Engine)**
* **Opis:** Zaadaptowany z silnika *Napar* kalkulator uzdatniania wody wodociągowej dla mikrobiologii domowej (`water-chemistry.ts`).
* **Zasady biochemiczne:**
  * Chloramina ($NH_2Cl$) stosowana w nowoczesnych wodociągach nie ulatnia się podczas odstania i gotowania. Nawet śladowe ilości (0.5 ppm) zabijają bakterie kwasu mlekowego (*Lactobacillus*, *Lactococcus*) oraz drożdże kombuchy.
  * **Neutralizacja chemiczna:** Zastosowanie kwasu L-askorbinowego (witaminy C) w proporcji $8\text{ mg}$ na każdy litr wody redukuje chloraminę do nieszkodliwych chlorków.
  * **Bufor alkaliczny (dKH):** Wysoka zawartość wodorowęglanów ($dKH > 10$) buforuje kwas mlekowy, opóźniając osiągnięcie bezpiecznego pH < 4.2. Algorytm rekomenduje częściowe kupażowanie z wodą demineralizowaną/RO.
* **Persona:** P1, P4, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-EDU-035: Koło Aromatów Mikrobiologicznych (Microbiological Flavor Wheel)**
* **Opis:** Zaadaptowane z silnika sensorycznego *Napar* 6-osiowe organoleptyczne koło smaków i zapachów (`flavor-wheel-data.ts`).
* **Struktura leksykonu sensorycznego:**
  * 5 głównych klas: Mleczne & Maślane, Owocowo-Kwasowe, Orzechowo-Karmelowe, Ziemisto-Grzybowe, Zwierzęco-Pikantne.
  * 15 podkategorii i 40 deskryptorów przypisanych do związków chemicznych (diacetyl, kwas L-mlekowy, octan etylu, kwas masłowy, kwas izowalerianowy, 1-okten-3-ol, p-krezol) wraz z identyfikacją mikroorganizmów odpowiedzialnych za ich powstanie.
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: C2_Reguly_Dziedzinowe_Serowarstwo.md -->
<!-- ========================================== -->

# **FERMENT BRD 0.1 — Rozdział 8: Reguły Dziedzinowe Serowarstwa (RD-01…RD-25) z Wektorami Testowymi (C2)**

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
<!-- ROZPOCZĘCIE ROZDZIAŁU: C3_Reguly_Dziedzinowe_Kiszonki_i_Napoje.md -->
<!-- ========================================== -->

# **FERMENT BRD 0.1 — Rozdział 8: Reguły Dziedzinowe Kiszonek, Kombuchy i Octów (RD-26…RD-50) z Wektorami Testowymi (C3)**

> **Rygor inżynieryjny:** Deterministyczne formuły biochemiczne i mikrobiologiczne z wektorami testowymi.

---

### **RD-26: Całkowite Zasolenie Masowe Nastawu Kiszonkowego**
* **Wzór chemiczny:**
  $$m_{soli} [g] = \frac{S_{\%}}{100 - S_{\%}} \times (m_{warzyw} [g] + m_{wody} [g])$$
* **Wektor testowy (Słój ogórków: 1200 g ogórków + 800 g wody, zasolenie 2.2%):**
  * Masa wsadu: $1200 + 800 = 2000.0\text{ g}$.
  * Rachunek ścisły: $(2.2 / (100 - 2.2)) \times 2000.0 = (2.2 / 97.8) \times 2000.0 = 0.022495 \times 2000.0 = 44.99\text{ g}$.
  * Oczekiwany wynik: `45.0 g` soli kamiennej niejodowanej.

---

### **RD-27: Bariera Kwasowości Bezpieczeństwa Botulinowego (pH < 4.6)**
* **Zasada biologiczna FDA/USDA:**
  Zarodniki *Clostridium botulinum* nie są w stanie kiełkować ani syntetyzować neurotoksyny w środowisku o stężeniu jonów wodorowych $pH < 4.60$.
* **Reguła weryfikacyjna:**
  * Jeśli $pH_{zmierzone} \le 4.40$: status `BEZPIECZNE (ZAKWASZONE)`.
  * Jeśli $4.40 < pH_{zmierzone} \le 4.60$: status `GRANICA BEZPIECZEŃSTWA (DOKWAŚ LUB ZWIĘKSZ MONITORING)`.
  * Jeśli $pH_{zmierzone} > 4.60$ po 72h fermentacji: status `ALARM KRYTYCZNY (RYZYKO PATOGENÓW)`.

---

### **RD-32: Stechiometria Konwersji Octowej (Bilans Cukier -> Alkohol -> Kwas Octowy)**
* **Równania stechiometryczne:**
  1. Z $1.0\text{ g}$ sacharozy/glukozy powstaje w warunkach beztlenowych maksymalnie $0.51\text{ g}$ etanolu (z uwzględnieniem biomasy drożdży w praktyce $\approx 0.48\text{ g}$).
  2. Z $1.0\text{ g}$ etanolu w obecności tlenu powstaje stechiometrycznie $1.304\text{ g}$ kwasu octowego:
     $$CH_3CH_2OH (46.07\text{ g/mol}) + O_2 (32.00) \rightarrow CH_3COOH (60.05\text{ g/mol}) + H_2O (18.02)$$
  3. Wydajność praktyczna układów otwartych: $\approx 80 - 85\%$ (część alkoholu odparowuje w napowietrzaniu).
  4. Formuła inżynieryjna FERMENT:
     $$\%\text{ Kwasu Octowego} \approx \%\text{ ABV wsadu} \times 0.85$$
* **Wektor testowy (Cydr domowy 6.0% ABV):**
  * Wejście: wsad alkoholowy $6.0\%\text{ ABV}$.
  * Rachunek: $6.0 \times 0.85 = 5.10\%\text{ kwasu octowego}$.
  * Oczekiwany wynik: `5.1% kwasu octowego` (spełnia wymóg standardu kulinarnego $\ge 5.0\%$).

---

### **RD-35: Szacowanie Ciśnienia CO2 w Refermentacji Butelkowej Kombuchy 2F**
* **Formuła rozpuszczalności:**
  Wzrost nasycenia $CO_2$ w g/L w zależności od zużytego cukru w fazie beztlenowej:
  $$CO_2 [g/L] = Cukier_{dodany} [g/L] \times 0.48$$
  Objętości gazu (Volumes of CO2): $1\text{ vol} \approx 1.96\text{ g/L } CO_2$.
* **Wektor testowy:**
  * Dodatek $8.0\text{ g/L}$ cukru owocowego $\rightarrow 8.0 \times 0.48 = 3.84\text{ g/L } CO_2 \rightarrow 3.84 / 1.96 \approx 1.96\text{ vol } CO_2$.
  * Dodając nasycenie bazowe z 1F (ok. 1.0 vol), łączne nagazowanie wynosi $\approx 2.96\text{ vol}$ (idealne musowanie szampańskie).

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: C4_Proces_Tresci_i_Decyzje_Badacza.md -->
<!-- ========================================== -->

# **FERMENT BRD 0.1 — Rozdział 8.P: Proces Weryfikacji Treści i Rejestr Decyzji Badacza (D-01…D-25) (C4)**

> **Ekosystem:** Apps4Brew Studio | **Projekt:** FERMENT  
> **Hierarchia źródeł:** Zgodnie z zasadą właściciela z 4 października 2026 r. obowiązującą we wszystkich aplikacjach studia.

---

## **1. Pięcioszczeblowa Hierarchia Źródeł Merytorycznych**

1. **Szczebel 1 (Najwyższy — Rachunek i biochemia molekularna):** Stechiometria reakcji enzymatycznych, równania dyfuzji soli Ficka, prawa termodynamiki i psychrometrii, sprawdzone niezależnie w kodzie testów.
2. **Szczebel 2 (Normy międzynarodowe i instytucje naukowe):** Standardy Międzynarodowej Federacji Mleczarskiej (IDF / FIL), wytyczne FAO/WHO Codex Alimentarius, normy sanitarno-mikrobiologiczne USDA Food Safety and Inspection Service (FSIS) oraz FDA BAM (Bacteriological Analytical Manual).
3. **Szczebel 3 (Akademickie podręczniki serowarskie i recenzowane badania):**
   * P.F. Fox, T.P. Guinee, T.M. Cogan, P.L.H. McSweeney: *Fundamentals of Cheese Science* (Springer).
   * F. Kosikowski, V. Mistry: *Cheese and Fermented Milk Foods*.
   * Sandor Ellix Katz: *The Art of Fermentation*.
   * Publikacje w recenzowanych czasopismach: *Journal of Dairy Science*, *International Dairy Journal*, *Food Microbiology*.
4. **Szczebel 4 (Publikacje instytutów branżowych i szkół serowarskich):** Instytut Przemysłu Mleczarskiego, University of Guelph Dairy Science Technology, University of Wisconsin Center for Dairy Research (CDR).
5. **Szczebel 5 (Tradycja i praktyka zagrodowa):** Doświadczenia mistrzów serowarskich i przepisy regionalne traktowane wyłącznie jako wskazówka wstępna, zawsze poddawana weryfikacji ze szczeblami 1–3.

---

## **2. Rejestr Decyzji Badacza Dziedzinowego (D-01…D-25)**

* **D-01: Odrzucenie sztywnych czasów koagulacji.** Zastąpienie przestarzałego dogmatu „tnij po 45 min” metodą mnożnika flokulacji (Berridge Flocculation Multiplier). Uzasadnienie: zmienność kwasowości i białka w mleku zagrodowym.
* **D-02: Wymóg suplementacji CaCl2 dla mlek pasteryzowanych.** Standard dawkowania: 0.2 g/L bezwodnego chlorku wapnia.
* **D-03: Równowaga potrójna solanki serowarskiej.** Kąpiel solankowa musi posiadać zbuforowane pH (5.2–5.4) oraz dodatek 0.15% CaCl2 w celu ochrony skórki przed śluzowaceniem.
* **D-04: Zasolenie całkowite w kiszonkach.** Wymuszenie liczenia soli na masę całkowitą (warzywa + woda).
* **D-05: Bariera biologiczna pH 4.6.** Każdy nastaw warzywny, który nie osiąga pH < 4.6 w ciągu 72h, otrzymuje ostrzeżenie sanitarne.
* **D-06: Dwutemperaturowy profil dojrzewania kimchi.** Faza ciepła (18–20°C, 24–48h) na start Leuconostoc, faza zimna (2–4°C) na rozwój estrów i umami.
* **D-07: Zakaz szczelnego zamykania 1F kombuchy.** Bakterie Komagataeibacter wymagają tlenu atmosferycznego do syntezy celulozowego SCOBY i kwasu octowego.
* **D-08: Górny limit alkoholu dla octów żywych.** Wsad do fermentacji octowej nie może przekraczać 8.0% ABV pod rygorem zatrucia kolonii Acetobacter.
* **D-09…D-25:** Dalsze rozstrzygnięcia enzymatyczne i mikrobiologiczne (zapisane w specyfikacjach modułowych).

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: D1_Wymagania_Niefunkcjonalne.md -->
<!-- ========================================== -->

# **FERMENT BRD 0.1 — Rozdziały 9–10: Wymagania Niefunkcjonalne (NFR) i Zgodność z Apple (D1)**

> **Rejestr:** `NFR-OFF-001` do `NFR-TEST-015` (Łącznie 115 wymagań NFR)  
> **Kontekst:** Wytyczne Apple App Store Review (1.4.1, 3.1.2, 4.3, 5.1.1, 5.2.1), standardy WCAG AAA, higiena pamięci SQLite i baterii.

---

### **1. Grupa NFR-OFF: Niezależność Offline (100% Offline-First)**
* **NFR-OFF-001:** Wszystkie funkcje kalkulatorów (IMCU, flokulacja, prasa, solanka, kiszonki, kombucha, octy) działają bez połączenia z siecią internetową.
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
* **NFR-APPLE-001 (Guideline 1.4.1 — Bezpieczeństwo i Zdrowie):** Aplikacja nie zawiera żadnych medycznych twierdzeń probiotycznych ani dietetycznych. Język opisowy jest czysto technologiczny i mikrobiologiczny.
* **NFR-APPLE-002 (Guideline 3.1.2 — Subskrypcje i Płatności):** Przejrzysty ekran zakupu FERMENT PRO z wyraźnym oznaczeniem cen, brakiem ukrytych kosztów, automatycznym przywracaniem zakupów (Restore Purchases). Kopia zapasowa i eksport danych są bezpłatne na zawsze.
* **NFR-APPLE-003 (Guideline 4.3 — Brak Spamu):** Aplikacja stanowi unikalny, głęboki kombajn technologiczny (kalkulatory IMCU, flokulacja, Cave Log, relacyjna baza partii), odróżniający się od prostych liczników.
* **NFR-APPLE-004 (Guideline 5.1.1 — Ochrona Danych):** Brak wymogu podawania jakichkolwiek danych osobowych w celu korzystania z aplikacji.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: D2_Architektura_Model_SQLite.md -->
<!-- ========================================== -->

# **FERMENT BRD 0.1 — Rozdziały 11–12: Architektura Techniczna i Model Relacyjny SQLite (D2)**

> **Architektura:** Expo / React Native, TypeScript Strict Mode, SQLite w trybie WAL  
> **Bezpieczna ścieżka:** `/Library/Application Support/SQLite/ferment.db`  
> **Rotacja kopii:** Automatyczny silnik 10 rotacyjnych kopii JSON (`autoBackup`)

---

## **1. Schemat Bazy Danych DDL (18 Tabel Relacyjnych w SQLite)**

```sql
-- 1. Tabela partii serowarskich i fermentacyjnych
CREATE TABLE IF NOT EXISTS batches (
    id TEXT PRIMARY KEY NOT NULL,
    batch_number TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('CHEESE', 'VEG_FERMENT', 'KIMCHI', 'KOMBUCHA', 'VINEGAR')),
    style_name TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('PREPARING', 'COAGULATING', 'PRESSING', 'BRINING', 'AGING', 'COMPLETED', 'DISCARDED')),
    notes TEXT
);

-- 2. Parametry wsadu serowarskiego
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

-- 4. Kąpiel solankowa krążka
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

-- 7. Nastawy kiszonek warzywnych i kimchi
CREATE TABLE IF NOT EXISTS veg_ferment_details (
    batch_id TEXT PRIMARY KEY NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    vegetables_weight_grams REAL NOT NULL,
    water_weight_grams REAL NOT NULL,
    total_batch_weight_grams REAL NOT NULL,
    salt_target_pct REAL NOT NULL,
    salt_added_grams REAL NOT NULL,
    salting_method TEXT NOT NULL CHECK(salting_method IN ('TOTAL_MASS_BRINE', 'DRY_SALTING_CABBAGE', 'LIQUID_BRINE')),
    initial_ph REAL,
    current_ph REAL,
    botulinum_safe INTEGER DEFAULT 0
);

-- 8. Nastawy kombuchy i octów
CREATE TABLE IF NOT EXISTS symbiotic_beverage_details (
    batch_id TEXT PRIMARY KEY NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    tea_type TEXT,
    tea_grams REAL,
    sugar_grams REAL,
    water_liters REAL,
    starter_liquid_ml REAL,
    scoby_tag TEXT,
    phase TEXT NOT NULL CHECK(phase IN ('1F_AEROBIC', '2F_BOTTLE_PRESSURE', 'ACETIC_OXIDATION')),
    estimated_abv_pct REAL,
    estimated_co2_volumes REAL,
    target_acetic_acid_pct REAL
);

-- 9. Spiżarnia i inwentarz surowców
CREATE TABLE IF NOT EXISTS pantry_inventory (
    id TEXT PRIMARY KEY NOT NULL,
    item_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('MILK', 'CULTURE', 'RENNET', 'SALT', 'MINERAL', 'TEA', 'SUGAR')),
    quantity_available REAL NOT NULL,
    unit TEXT NOT NULL,
    imcu_or_concentration TEXT,
    expiry_date INTEGER,
    cost_per_unit_pln REAL
);

-- 10. Oceny sensoryczne (Radar Smaku)
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
Podobnie jak we wzorcowych aplikacjach `trening` i `piekarz`, moduł `backup.ts` tworzy po każdej zakończonej sesji zrzut stanu relacyjnego do pliku JSON o formacie:
`ferment_backup_YYYY-MM-DD_HHmmss.json`.
W katalogu `/Library/Application Support/Backups/` utrzymywanych jest ściśle 10 najświeższych kopii, z automatycznym usuwaniem najstarszej.

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: D3_Rejestr_Ryzyk_i_Pytania.md -->
<!-- ========================================== -->

# **FERMENT BRD 0.1 — Rozdziały 14 i 16: Rejestr Ryzyk (RYZ-01…RYZ-50) i Pytania Otwarte (D3)**

> **Kategorie ryzyk:** Sanitarne i biologiczne (SAN), Techniczne i dane (TECH), Zgodność z Apple (APPL), Biznesowe i rynkowe (BIZ).

---

### **1. Kluczowe Ryzyka w Rejestrze**

| ID | Kategoria | Opis ryzyka | Prawd. | Skutek | Plan mitygacji / Działanie obronne |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **RYZ-01** | SAN | **Zatrucie jadem kiełbasianym (Clostridium botulinum)** w przetworach warzywnych o zbyt niskiej kwasowości. | Niskie | Krytyczny | Twarda bramka barierowa pH 4.6 (RD-27), czerwony alert bezpieczeństwa przy powolnym zakwaszaniu, edukacyjny moduł higieny. |
| **RYZ-02** | TECH | **Utrata wielomiesięcznej historii dojrzewania w Cave Log** przy aktualizacji systemu iOS lub aplikacji. | Średnie | Krytyczny | Baza SQLite WAL w bezpiecznym `/Library/Application Support/SQLite`, 10 rotacyjnych kopii JSON po każdej sesji, bezpłatny eksport do pliku. |
| **RYZ-03** | APPL | **Odrzucenie przez Apple za brak wartości (Guideline 4.3 — Minimum Functionality).** | Niskie | Wysoki | FERMENT to zaawansowany kombajn: stoper flokulacji, Live Activity, relacyjny Cave Log, generowanie PDF, skaner QR, wsparcie BLE. |
| **RYZ-04** | APPL | **Odrzucenie za twierdzenia medyczne (Guideline 1.4.1).** | Średnie | Wysoki | Całkowity zakaz obietnic zdrowotnych/probiotycznych. Język wyłącznie mikrobiologiczny i rzemieślniczy. |
| **RYZ-05** | SAN | **Wybuch butelek kombuchy w fazie 2F** na skutek nadmiernego nagazowania CO2. | Średnie | Wysoki | Kalkulator cukru refermentacyjnego, limit czasu 2F (max 3 dni), głośne powiadomienie o konieczności schłodzenia w lodówce. |
| **RYZ-06** | SAN | **Zepsucie krążka sera przez skażenie maziowe dzikim Mucorem** z powodu nadmiernej wilgotności i braku obracania. | Wysokie | Średni | Algorytm psychrometryczny punktu rosy (RD-06), codzienne powiadomienia o obracaniu, Kompas Diagnostyczny (C1). |
| **RYZ-07** | TECH | **Nasycenie czujników BLE w wilgotności > 90% RH** fałszujące odczyty komory dojrzewalniczej. | Średnie | Średni | Ostrzeżenie w UI o histerezie tanich higrometrów pojemnościowych, instrukcja kalibracji solą nasyconą. |
| **RYZ-08** | BIZ | **Niska konwersja do subskrypcji przy braku zakupu jednorazowego.** | Średnie | Średni | Dostępność opcji Lifetime (14,99 € / 59,99 zł), która w społecznościach rzemieślniczych konwertuje najlepiej. |
| **RYZ-09…50**| RÓŻNE | Dalsze szczegółowe ryzyka technologiczne, solankowe i mikrobiologiczne. | Niskie | Średni | Rozpisane w macierzy audytowej studia Apps4Brew. |

---


<!-- ========================================== -->
<!-- ROZPOCZĘCIE ROZDZIAŁU: D4_Strategia_Testow_Jakosci.md -->
<!-- ========================================== -->

# **FERMENT BRD 0.1 — Rozdział 17: Dziewięciowarstwowa Strategia Testów i Jakości (D4)**

> **Standard inżynieryjny:** Oparty na rygorystycznym dokumencie `docs/20-definicja-ukonczenia.md` z projektu `trening`.  
> **Zasada właściciela z 06.10.2026:** „Każda funkcjonalność ma mieć przy wdrażaniu pełen zakres zautomatyzowanych testów każdych przypadków i każdego rodzaju”.

---

## **1. Dziewięć Warstw Testów Automatycznych w FERMENT**

| # | Warstwa testu | Zakres i cel weryfikacji | Narzędzie i pliki |
|---|---|---|---|
| **1** | **Logika (Pure Logic)** | Deterministyczne funkcje matematyczne: dawkowanie podpuszczki IMCU, flokulacja, prasa serowarska, solanka masowa, punkt rosy, kinetyka CO2. | Jest (`tests/core/*.test.ts`) |
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
3. `npm run check:matrix` (pełne pokrycie macierzy wymiarów).
4. `npm run test` (kompletny zestaw testów Jest ze 100% PASS).
5. `npm run expo:export` (weryfikacja bezbłędnej kompilacji bundla produkcyjnego).

---
