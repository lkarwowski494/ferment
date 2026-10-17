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
