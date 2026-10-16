# FERMENT (Ser i Flora / Mikrobiologia Domowa)

> **Ekosystem:** Apps4Brew Studio  
> **Repozytorium:** `lkarwowski494/ferment`  
> **Technologia:** Expo 57, React Native 0.86, TypeScript Strict, SQLite (tryb WAL)  
> **Piramida Jakości:** 37 zestawów testów (100% PASS, 172 testów), pełna zgodność i18n (PL/EN, 604 klucze), `npm run verify` zielony  

---

## 🧀 O projekcie
**FERMENT** to profesjonalny asystent rzemieślniczego serowarstwa zagrodowego oraz zaawansowanej domowej mikrobiologii fermentacyjnej (baechu-kimchi, zakwasy warzywne, kombucha 1F/2F, żywe octy owocowe). Aplikacja powstała w oparciu o rygorystyczne standardy studia **Apps4Brew**, łącząc prostotę obsługi 1-Tap dla nowicjuszy z potężnym silnikiem kalkulacyjno-biochemicznym dla mistrzów rzemiosła.

---

## 🚀 Model Biznesowy Apps4Brew (Zero-Tolerance)
- **Cennik:** 3,99 zł ($0.99) / miesięcznie | 19,99 zł ($4.99) / rocznie | 59,99 zł ($14.99) Lifetime (bez subskrypcji).
- **14-dniowy bezwarunkowy okres próbny:** 100% funkcji odblokowanych od pierwszego uruchomienia. Brak sztucznych kłódek i fałszywych ograniczeń "Pro".
- **Tryb Read-Only po wygaśnięciu trialu:** Użytkownik zachowuje dożywotni, nielimitowany dostęp do swoich danych, historii partii, notatek w Cave Logu oraz eksportu JSON/CSV. Akcje tworzenia nowych partii, dodawania ważeń, uruchamiania timerów flokulacji i druku arkuszy etykiet są chronione przez `<Apps4BrewPassModal />`.
- **Przywracanie zakupów (`restorePurchases`):** Autentyczna weryfikacja istnienia wpisu licencyjnego w lokalnej tabeli SQLite `app_settings` z natychmiastowym reaktywnym powiadomieniem całego drzewa komponentów.
- **Prywatność i Bezpieczeństwo Danych:** 100% offline, zero telemetrii, 10 rotacyjnych kopii bezpieczeństwa JSON zapisywanych po każdej mutacji oraz kopia bezpieczeństwa (`safetyBackup`) przed operacjami importu.

---

## 🔬 Nowe Moduły Rzemieślnicze (Zaadaptowane z projektów Napar, Piekarz, Słoik i Oczko)

Zgodnie z audytem technologicznym ekosystemu Apps4Brew, do projektu włączono 9 wyspecjalizowanych silników dziedzinowych:

1. **Harmonogram Odwrócony Produkcji & Anti-Fatigue Guard (`src/core/reverse-scheduler.ts` — z projektu *Piekarz*):**
   - Pozwala zaplanować godzinę zakończenia produkcji (np. sobota 22:00) i automatycznie wylicza wsteczny harmonogram etapów (ogrzewanie, flokulacja, krojenie ziarna, dogrzewanie, etapy prasowania).
   - Wykrywa kolizje z oknem snu rzemieślnika (23:00–06:00), ostrzegając przed nocnym przewracaniem krążków w prasie i rekomendując optymalną porę startu.
2. **Odzysk Serwatki i Zero-Waste (`src/core/whey-utilization.ts` — z projektu *Piekarz*):**
   - 10 litrów mleka daje ~1 kg sera i aż ~9 litrów słodkiej serwatki.
   - Silnik wylicza odzysk białek serwatkowych (albumin i globulin) w postaci tradycyjnej Ricotty (Ziger) w temp. 88–92°C z dawką kwasu cytrynowego, wzmocnienie uzysku mlekiem pełnym (+10% / +20%), recepturę na naturalny napój izotoniczny z serwatki (Alpejska Rivella) oraz suszone przysmaki z nadmiaru grzybka SCOBY.
3. **Kalkulator Regeneracji i Wzmocnienia Solanki (`src/core/brine-topup.ts` — z projektu *Słoik*):**
   - Dokładne obliczanie gramów soli kamiennej potrzebnych do przywrócenia rozcieńczonej kąpieli solankowej (np. z 16% z powrotem do 20%) lub uzupełnienia słoików wodą bez utraty docelowego zasolenia.
4. **Chemia Wody & Neutralizacja Chloraminy (`src/core/water-chemistry.ts` — z projektu *Napar*):**
   - Usuwanie chloru (odparowanie 24h / gotowanie 15 min) oraz chloraminy ($NH_2Cl$), która nie paruje i niszczy bakterie fermentacji mlekowej.
   - Dozowanie witaminy C (kwasu L-askorbinowego, 8 mg/L) do natychmiastowej redukcji chloraminy.
   - Analiza twardości ogólnej dGH ($Ca^{2+}$, $Mg^{2+}$) i alkaliczności buforowej dKH (wodorowęglany zapobiegające zakwaszeniu).
5. **SOR Ratunkowy Fermentacji / Triage Awaryjny (`src/core/emergency-recovery.ts` — z projektu *Słoik*):**
   - Natychmiastowe protokoły dla 6 krytycznych incydentów biologicznych: brak zestalenia skrzepu, ucieczka kwasowości (przekwaszenie gęstwy), śluzowata skórka w solance, kożuszek fermentacyjny Kahm, zakażenie pleśnią grzybka SCOBY (bezwzględny nakaz utylizacji) oraz zatrzymanie fermentacji octowej przez nadmiar alkoholu (>8% ABV).
6. **Biblioteka Receptur Kanonicznych (`src/core/canonical-recipes.ts` — z projektów *Słoik* i *Piekarz*):**
   - Standardowe receptury dziedzictwa serowarskiego i zielarskiego: Gouda Zagrodowa Półtwarda, Ser Koryciński Swojski, Feta Zagrodowa w Solance Oliwnej, Tradycyjne Baechu-Kimchi, Staropolski Zakwas z Buraków, Kombucha Sencha.
   - 1-Tap ładowanie parametrów prosto do kalkulatorów.
7. **Koło Aromatów Mikrobiologicznych (`src/core/flavor-wheel-data.ts` — z projektu *Napar*):**
   - 5 głównych kategorii sensorycznych (Mleczne & Maślane, Owocowo-Kwasowe, Orzechowo-Karmelowe, Ziemisto-Grzybowe, Zwierzęco-Pikantne), 15 podkategorii i 40 deskryptorów smakowych powiązanych z ich biochemicznym źródłem (diacetyl, kwas mlekowy, octan etylu, geotrichum, kwas masłowy, fenole).
8. **Przelicznik Form i Ekwiwalentów Składników (`src/core/ingredient-substitutions.ts` — z projektu *Oczko*):**
   - Przeliczanie enzymów koagulujących: podpuszczka płynna 200 IMCU $\leftrightarrow$ proszek Fromase 2000 IMCU $\leftrightarrow$ tabletki Meito $\leftrightarrow$ pasta jagnięca z lipazą.
   - Zastępowanie kultur DVS świeżą maślanką/zsiadłym mlekiem (mezofile) lub żywym jogurtem (termofile).
   - Formy chlorku wapnia ($CaCl_2$ bezwodny vs dwuwodny vs roztwór 33% vs 10%).
9. **Protokół Wymiany Receptur Offline (`src/core/recipe-share.ts` — z projektu *Napar*):**
   - Udostępnianie receptur za pomocą kompaktowych deep-linków (`ferment://recipe?data=...`) i kodów QR.
   - Sprawdzanie integralności danych algorytmem sumy kontrolnej DJB2 / CRC32 bez konieczności połączenia z chmurą.
10. **Dobór i Geometria Form Serowarskich (`src/core/mold-sizing.ts`):**
    - Obliczanie kubatury form cylindrycznych ($V = \pi r^2 h$) i prostopadłościennych ($V = a \cdot b \cdot h$).
    - Wyliczanie objętości surowej gęstwy przed odciekiem serwatki (~1.7 L/kg sera) oraz stopnia wypełnienia i dopasowania do standardowych form (Kadova Gouda, Korycin, Camembert, Feta).
11. **Holenderska Prasa Dźwigniowa & Kaskada Prasowania (`src/core/press-cascade.ts`):**
    - Mechanika ramienia dźwigniowego z kompensacją masy własnej belki (tara ramienia).
    - 3-etapowy program kaskadowego prasowania (faza 1: ułożenie gęstwy 1.5x waga sera, faza 2: obrót i ułożenie skórki 3.5x, faza 3: zamknięcie szczelin 7.5x) z blokadą przed wadą *rind entrapment* (zakleszczenie serwatki).
12. **Psychrometria Piwniczki, VPD & Affinage Care (`src/core/cave-environment.ts`):**
    - Precyzyjna psychrometria: Prężność pary nasyconej, rzeczywistej, punkt rosy i Deficyt Prężności Pary (VPD w kPa).
    - Wczesne wykrywanie alarmów Case Hardening ($VPD > 0.32\text{ kPa}$) oraz ryzyka kondensacji i czarnej pleśni ($RH > 94\%$).
    - Harmonogram pielęgnacji skórki krążków (obracanie, przemywanie solanką 4–18%, szczotkowanie, woskowanie).
13. **Kinetyka Kwasowa LAB & Miareczkowanie Octu (`src/core/fermentation-kinetics.ts`):**
    - Modelowanie kinetyki spadku pH w fermentacji mlekowej (faza *Leuconostoc* $\to$ *Lactobacillus plantarum* $\to$ plateau).
    - Laboratoryjny kalkulator miareczkowania kwasowości octu (TA z roztworem $0.1\text{ M NaOH}$) wyliczający rzeczywisty $\% \text{ kwasu octowego}$ z klasyfikacją spożywczą.
14. **Bufor Kwasowo-Wapniowy Solanki & Ochrona Przed Rozmiękaniem Skórki (`src/core/brine-acidification.ts`):**
    - Zapobieganie zjawisku obślizgłej skórki (*slimy rind*) poprzez stabilizację równowagi osmotycznej wapnia ($2.0\text{ g/L } CaCl_2$) oraz miareczkowanie kwasem mlekowym do docelowego pH 5.20–5.40.
15. **Mieszanie Owocowe 2F & Dynamika Wysycenia Kombuchy (`src/core/kombucha-blending.ts`):**
    - Precyzyjne modelowanie objętości $CO_2$ i ciśnienia w barach (20°C) z uwzględnieniem ekstraktów cukrów owocowych (°Brix) oraz typu butelki.
    - Bezwzględna blokada i alarm bezpieczeństwa przed użyciem butelek kwadratowych/ozdobnych (zagrożenie eksplozją szkła).
16. **Rejestr Czynności Pielęgnacyjnych Affinage (`src/core/cave-log-actions.ts`):**
    - Pełny audyt zabiegów leżakowania (obracanie, przemywanie solanką, szczotkowanie, woskowanie, bandażowanie, ważenie).
    - Analiza trajektorii ubytku wagi (% shrinkage) z wbudowanym ostrzeżeniem przy przekroczeniu 20% masy.
17. **6-Osiowy Silnik Oceny Sensorycznej & Balansu Organoleptycznego (`src/core/sensory-evaluation.ts`):**
    - Standaryzowana skala 0–100 pkt i klasyfikacja (EXEMPLARY, GOOD, ACCEPTABLE, FLAWED).
    - Analiza kwasowości, słoności, zwartości/chrupkości, kremowości, pikantności i orzechowości z automatycznym wykrywaniem wad technologicznych i poradami naprawczymi.
18. **Przemywanie Ziarna & Odlaktozowanie (Curd Washing / Delactosing — `src/core/curd-washing-and-salting.ts`):**
    - Bilans masowo-termiczny przemywania ziarna serowarskiego gorącą wodą (Gouda, Edam, Havarti).
    - Obliczanie objętości dolewanej wody o danej temperaturze, by podnieść temperaturę gęstwy i odlaktozować wsad do pożądanego profilu słodyczy/elastyczności.
    - Ochrona przed zacięciem termicznym ($>65^\circ\text{C}$) i inaktywacją mezofili ($>39^\circ\text{C}$).
19. **Solenie Ziarna w Masie dla Cheddara (Milling & Dry Salting — `src/core/curd-washing-and-salting.ts`):**
    - Bezpośrednie solenie na sucho pociętych bloków skrzepu z kompensacją 33% strat soli w odciekającej pod prasą serwatce.
    - 3-etapowy protokół zadawania soli z przerwami na osmozę kapilarną.
20. **Kalkulator Powłok Ochronnych & Woskowania Krążka (Wax & Polyvinyl Coverage — `src/core/curd-washing-and-salting.ts`):**
    - Precyzyjne obliczanie pola powierzchni walca sera ($A = 2\pi r^2 + 2\pi r h$) oraz gramatury wosku serowarskiego (bariera 0% ubytku) lub powłoki polioctanowej (paroprzepuszczalna bariera przeciwgrzybicza).
21. **Automatyczny Odpis ze Spiżarni i Steppery Ergonomiczne (`src/core/inventory.ts`, `src/data/sqlite-store.ts`):**
    - Automatyczne odejmowanie składników (mleko, podpuszczka, CaCl2, sól, cukier, herbata) ze spiżarni podczas tworzenia nowej partii, ze skalowaniem wg receptur kanonicznych lub wprowadzonych parametrów.
    - Steppery $\ge 56\text{ pt}$ (`-1` / `+1`) i natychmiastowe usuwanie pozycji ze spiżarni.
22. **Skaner Kodów QR i Obsługa Protokołu Deep-Link (`src/core/qr-deeplink.ts`, `src/components/QrScannerModal.tsx`):**
    - Obsługa protokołów `ferment://batch/<id>` oraz `ferment://wheel/<id>`, JSON i kodów etykiet A4 z natychmiastowym przełączeniem widoku i prezentacją modalnych akcji.
23. **Kompensacja Kinetyki Temperaturowej Q10 (`src/core/fermentation-q10.ts`):**
    - Modelowanie dynamiki prędkości fermentacji $v = Q_{10}^{(\Delta T / 10)}$ względem bazowej temperatury 20°C.
    - Adaptacyjny czas fermentacji w dniach i godzinach, estymacja momentu przejścia przez barierę $pH \le 4.60$ (Botulinum Guard) oraz klasyfikacja 5 stref termicznych (od uśpienia po stres cieplny i degradację pektyn).
24. **Kalkulator Pojemności Słoja & Wolna Przestrzeń / Headspace Guard (`src/core/crock-headspace.ts`):**
    - Fizyczne modelowanie upakowania warzyw (szatkowana kapusta, cząstki kimchi, całe ogórki), objętości solanki oraz wyporności ciężarków dociskowych (szkło, ceramika, granit).
    - Ochrona przed wykipieniem solanki ($< 40\text{ ml}$) oraz nadmiarem tlenu sprzyjającym drożdżom kożuchującym ($> 25\%$).
25. **Korektor Refraktometru Optycznego (°Bx → SG → ABV) (`src/core/refractometer-alcohol.ts`):**
    - Eliminacja zakłócenia optycznego wywołanego etanolem przy użyciu sześciennego wielomianu Terrilla ($OB \ge 8^\circ\text{Bx}$) oraz stechiometrii kombuchy ($OB < 8^\circ\text{Bx}$).
    - Wyliczanie skorygowanego SG, ekstraktu rzeczywistego w °P, stężenia alkoholu (% ABV), alarmu inhibicji bakterii octowych (>8% ABV) oraz weryfikacji bezalkoholowości kombuchy ($\le 0.5\%$).
26. **Standaryzowany Eksport Dziennika Produkcyjnego do RFC 4180 CSV (`src/lib/csv-export.ts`):**
    - Eksport partii produkcyjnych, krążków dojrzewalni oraz spiżarni do formatu CSV z obsługą natywnego udostępniania (`expo-sharing`).
    - Dostępność eksportu danych również w trybie READ-ONLY po wygaśnięciu okresu próbnego.
27. **Skład Biochemiczny & Klasyfikacja Codex Alimentarius (`src/core/cheese-composition-engine.ts`):**
    - Międzynarodowy standard CODEX STAN 283-1978: wilgotność w masie beztłuszczowej (MFFB) $\to$ klasyfikacja twardości (Extra Hard, Hard, Semi-Hard, Semi-Soft, Soft).
    - Tłuszcz w suchej masie (FDM) $\to$ klasyfikacja tłuszczowości (High Fat, Full Fat, Medium Fat, Low Fat, Skim).
    - Kluczowy niezmiennik biochemiczny Salt-in-Moisture (S/M %): optymalny zakres 4.0–6.0%, wczesne wykrywanie ryzyka goryczki technologicznej ($S/M < 4.0\%$) oraz zahamowania dojrzewania ($S/M > 6.0\%$).
28. **Hotel SCOBY & Matecznik Kultur Żywych (`src/core/culture-hotel-engine.ts`):**
    - Bezpieczna rezerwa starterowa dla: Hotelu SCOBY, Matki Octowej (*Mycoderma aceti*), ziaren kefiru mlecznego, kryształów wodnych (Tibicos) i serwatki matecznej.
    - Automatyczne wyliczanie interwałów karmienia, dawki słodkiej herbaty/etanolu, alarmy głodowe, monitoring bariery antypleśniowej ($pH \le 3.20$) oraz detekcja konieczności usunięcia osadu drożdżowego (trub purge $> 2\text{ cm}$).
29. **Zaawansowany Kalkulator Kosztów Partii & Affinage ROI (`src/core/batch-cost-engine.ts`):**
    - Pełny bilans ekonomiczny: surowce bazowe (mleko/warzywa/woda), dodatki (podpuszczka, kultury, sól, wosk), energia dogrzewania gęstwy serowarskiej oraz prąd chłodziarek piwnicznych/witryn (kWh $\times$ taryfa).
    - Wyliczanie kosztu partii, kosztu 1 kg i porcji 100g, porównanie z cenami ekologicznych delikatesów rzemieślniczych i prezentacja kwoty zaoszczędzonej w PLN (często 70–85% taniej niż w sklepie).
30. **Dynamiczny Harmonogram Kamieni Milowych i Odgazowywania Słoików (`src/core/fermentation-timeline.ts`):**
    - Skalowanie osi czasu fermentacji kinetyką $Q_{10}$ w zależności od temperatury otoczenia.
    - Harmonogram bezpiecznego odgazowywania słoików (jar burping) dla beztlenowych kiszonek i kombuchy 2F (dni 1–4) zapobiegający eksplozji szkła.
    - Kamienie milowe: faza burzliwa, sforsowanie bariery biologicznej pH 4.60, wyciszenie fermentacji i rekomendowane schłodzenie do 4°C.
    - Zintegrowane plakietki i alerty w kartach aktywnych partii w Dzienniku Partii.
31. **Zagregowana Analityka Rzemieślnicza & Wskaźniki Produktywności (`src/core/fermentation-statistics.ts`):**
    - Panel analityczny na szczycie Dziennika Partii: łączna liczba partii, aktywne vs zakończone, wskaźnik sukcesu technologicznego (%).
    - Wolumen przerobionego mleka w litrach, liczba i łączna waga leżakujących krążków sera w piwniczce.
    - Średnia ważona ocena sensoryczna (0–100 pkt) i profil wad.
    - Zsumowane oszczędności finansowe gospodarstwa domowego vs ceny rzemieślnicze w PLN (70–85% oszczędności).
32. **Tradycyjny Żywy Niefiltrowany Ocet Jabłkowy — Kanoniczna Receptura Dziedzictwa (`src/core/canonical-recipes.ts`):**
    - 2-fazowy proces: faza dzikich drożdży (alkoholowa 14–21 dni) $\to$ faza tlenowa bakterii *Acetobacter* z matką octową (*Mycoderma aceti*, 4–6 tygodni).
    - Pełna specyfikacja składników, optymalnych warunków (20–25°C, dostęp tlenu, pH < 3.20) i kroków technologicznych.
33. **Doktor Fermentacji — Drzewo Decyzyjne Diagnostyki Wad i Triage Bezpieczeństwa (`src/core/fermentation-diagnostics.ts`, `src/components/FermentationDoctorModal.tsx`):**
    - Interaktywny asystent diagnozowania wad sensorycznych, mikrobiologicznych i fizycznych w serach, kiszonkach, kombuchy i occie.
    - Automatyczna kategoryzacja bezpieczeństwa biologicznego: `SAFE_EDIBLE` (bezpieczne wady smakowe), `COSMETIC_FLAW` (np. drożdże Kahm), `REPAIRABLE_RISK` (zagrożenia naprawialne procedurą ratunkową, np. $H_2S$ w occie lub aceton), `BIOHAZARD_DISCARD` (bezwzględna utylizacja: pleśń na SCOBY, wzdęcie coliformami, jad kiełbasiany).
    - Wyszukiwarka objawów po słowach kluczowych i procedury naprawcze krok po kroku.
34. **Dyfuzja Soli & Czas Przenikania Solanki wg Prawa Ficka (`src/core/brine-diffusion.ts`):**
    - Fizykochemiczne modelowanie nieustalonej dyfuzji NaCl w żelu kazeinowym (II Prawo Ficka, model Geurtsa).
    - Zależność od geometrii walca (droga do rdzenia $x_{core} = \min(r, h/2)$ ze skalowaniem $t \propto x^2$).
    - Wyliczanie optymalnego czasu w solance (godziny/dni), tempa pochłaniania soli oraz liczby dni dojrzewania do osiągnięcia stężenia ochronnego w rdzeniu ($C_{core} \ge 1.0\%$).
    - Alerty ochronne przed zakażeniem niedosolonego centrum oraz szoku osmotycznego przy słabej solance (<16%).

---

## 🛠️ Weryfikacja i Piramida Testów
Każdy commit w projekcie przechodzi przez zautomatyzowaną bramkę `npm run verify`:
```bash
# 1. Sprawdzenie typowania TypeScript (Strict Mode)
npm run typecheck

# 2. Sprawdzenie 100% pokrycia tekstów UI w słowniku angielskim
npm run check:i18n

# 3. Wykonanie 37 pakietów testowych Jest
npm test

# 4. Uruchomienie całościowej bramki
npm run verify
```

Stan testów na dzień 16.10.2026:
- **37 test suites PASS** (100%)
- **172 unit & integration tests PASS** (100%)
- **550 tekstów UI w kodzie przetłumaczonych na PL i EN (604 w słowniku EN, 100% parytet)**
- **BRD: 96.2 stron znormalizowanych (173,141 znaków ze spacjami, 25 modularnych rozdziałów)**

---

## 📱 Ekrany Aplikacji
1. **Kalkulator (`app/(tabs)/index.tsx`):**
   - 3 tryby rzemieślnicze: 🧀 Serowarstwo | 🥬 Kiszonki & Kimchi | 🫖 Kombucha & Żywe Octy.
   - 1-Tap start z kartami receptur kanonicznych i udostępnianiem `ferment://`.
   - Harmonogram odwrócony (Anti-Fatigue Guard) z alertami kolizji ze snem.
   - Tryb mokrych rąk (Keep-Awake).
   - Zaawansowany akordeon biochemiczny Pro:
     - Stoper Berridge'a i cięcie skrzepu.
     - Dobór i geometria formy serowarskiej (standardowe szablony Kadova, Korycin, Camembert, Feta).
     - Holenderska prasa dźwigniowa z tarą ramienia i 3-etapowym programem kaskadowym (ochrona przed rind entrapment).
     - Zbuforowana solanka serowarska z $CaCl_2$ (2 g/L) i kwasem mlekowym (pH 5.20).
     - Dogrzewanie gęstwy i Case Hardening Guard.
     - Regeneracja i wzmocnienie stężenia solanki bez wylewania roztworu.
     - Odzysk słodkiej serwatki na tradycyjną Ricottę (Ziger) i napój izotoniczny Rivella.
     - Botulinum Guard (bariera pH 4.60) i Monitor Kinetyki Zakwaszania LAB.
     - Asystent tradycyjnego Kimchi (proporcje kleiku, gochugaru, soli).
     - Kombucha 2F Fruit Blending & Bottle Pressure Guard (ochrona przed wybuchem butelek).
     - Żywe octy owocowe i laboratoryjne miareczkowanie kwasowości całkowitej TA z $0.1\text{ M NaOH}$.
2. **Partie & Dojrzewalnia (`app/(tabs)/batches.tsx`):**
   - Lista partii i dziennik piwniczki (Cave Log).
   - Sterowanie cyklem życia partii: `PREPARING` $\to$ `COAGULATING` $\to$ `PRESSING` $\to$ `BRINING` $\to$ `AGING` $\to$ `COMPLETED`.
   - 6-osiowa ocena sensoryczna partii (0–100 pkt) z wykrywaniem wad i rekomendacjami naprawczymi zapisywana do SQLite.
   - Psychrometr piwniczki z pomiarem VPD, punktu rosy i alarmem Case Hardening vs Kondensacja.
   - Harmonogram pielęgnacji skórki (Affinage Care) dla serów twardych i maziowych.
   - Rejestracja 5 akcji affinage (Obrócenie, Przemycie solanką, Szczotkowanie, Woskowanie, Ważenie z alertem shrinkage > 20%).
   - Rozwijana historia pielęgnacji dla każdego krążka.
   - Usuwanie partii i krążków z potwierdzeniem.
   - Skaner kodów QR partii i krążków.
3. **Spiżarnia & Etykiety (`app/(tabs)/pantry.tsx`):**
   - Stany magazynowe, kalkulator wydajności i kosztów partii.
   - Przelicznik form enzymów, kultur naturalnych i roztworów $CaCl_2$.
   - Drukowanie arkusza wektorowych etykiet samoprzylepnych A4 z kodami QR.
4. **Wiedza & SOR Wad (`app/(tabs)/school.tsx`):**
   - 6-osiowy wektorowy radar profilu sensorycznego SVG.
   - SOR Ratunkowy Fermentacji (Triage Awaryjny z natychmiastowymi protokołami).
   - Kalkulator uzdatniania wody i neutralizacji chloraminy witaminą C.
   - Przeglądarka Koła Aromatów Mikrobiologicznych.
   - Doktor Wad Fermentacyjnych (wczesne/późne wzdęcia, goryczka, pleśń).
5. **Ustawienia (`app/(tabs)/settings.tsx`):**
   - Stan licencji Apps4Brew Pass, przywracanie zakupów.
   - Zarządzanie 10 rotacyjnymi kopiami zapasowymi SQLite.
   - Przełącznik języka (PL / EN) i układu jednostek (Metryczny / Imperialny).

---

## 📖 Dokumentacja Biznesowa i Inżynieryjna (BRD)
- Kompletne kompendium wydania: [`FERMENT_BRD_Kompletne_Wydanie.md`](./FERMENT_BRD_Kompletne_Wydanie.md)
- Moduły analityczne i techniczne w katalogu [`docs/brd/`](./docs/brd/):
  - `00_START.md` — Wprowadzenie, architektura, spis treści.
  - `00b_Jedna_lista_decyzji.md` — Rejestr decyzji produktowo-architektonicznych.
  - `B1_BR_SER_Serowarstwo.md` … `B8_BR_SYS_System.md` — Wymagania funkcjonalne.
  - `C1_Szkoła_i_doktor_wad.md` … `C4_Decyzje_badacza.md` — Wiedza dziedzinowa i reguły biologiczne.
  - `D1_NFR_Wymagania_pozafunkcjonalne.md` … `D4_Strategia_testow.md` — NFR, DDL bazy danych, macierz ryzyk i testy.
