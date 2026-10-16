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
