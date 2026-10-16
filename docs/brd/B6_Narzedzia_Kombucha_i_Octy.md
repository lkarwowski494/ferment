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





