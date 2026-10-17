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

### **BR-KISZ-023: Japońskie Łoże Otrębowe Nukadoko (Nukazuke Rice Bran Fermentation Bed Engine)**
* **Opis:** Fizykochemiczny i mikrobiologiczny model tradycyjnego japońskiego łoża z prażonych otrębów ryżowych (*Nukadoko*), symbiozy bakterii mlekowych (*Lactobacillus plantarum*), drożdży aromatycznych (*Pichia*) i tłumienia anaerobów gnilnych (*Clostridium butyricum*) poprzez ręczne napowietrzanie *Te-ire* (`src/core/nukazuke-engine.ts`).
* **Kluczowe reguły biochemiczne:**
  1. **Zakładanie łoża i faza Sutezuke:**
     * Proporcje wsadu: 1000g prażonych otrębów ryżowych + 900g wody + sól do poziomu 13.0% wagi całkowitej.
     * Dodatki funkcjonalne: Glon Konbu (dostawca kwasu glutaminowego/umami i regulator wilgoci), chili takano-tsume (kapsaicyna przeciwpleśniowa) oraz plasterki świeżego imbiru.
     * Faza Sutezuke (10–14 dni): codzienne zakopywanie twardych obierek warzywnych w celu zaszczepienia dzikich kultur LAB i wstępnego zbuforowania soli (warzywa sutezuke są niejadalne).
  2. **Regulacja wilgoci i bilans soli:**
     * Zakopywane świeże warzywa oddają wodę komórkową, powodując rozwodnienie łoża (spadek zasolenia poniżej 10% grozi rozwojem bakterii kwasu masłowego o zapachu zepsucia).
     * W razie stanu błotnistego (`VERY_SLUSHY`): rekomendacja odsączenia kałuży i dodanie 15% prażonych suchych otrębów z solą (13%).
  3. **Częstotliwość aeracji ręką (Te-ire):**
     * Lato / wysoka temp. ($\ge 25^\circ\text{C}$): 2 razy dziennie (rano i wieczorem).
     * Temperatura pokojowa (18–24°C): 1 raz dziennie.
     * Chłód / zima (<16°C): raz na 2–3 dni (lodówka: raz na tydzień).
  4. **Czasy penetracji solno-kwasowej warzyw:**
     * Ogórek: 6–12h (w temp. 22°C+), Bakłażan: 12–24h (tarty solą pod kolor), Daikon: 12–24h (słupki 2cm), Marchew: 18–36h, Jajko na twardo / Awokado: 4–8h.
* **Kryteria akceptacji:**
  1. Karta zintegrowana w trybie Kiszonki & Warzywa Pro Accordion z podziałem na Krok: Zakładanie (Sutezuke), Pielęgnacja & Aeracja (Te-ire) oraz Czas kiszenia warzyw.
  2. 100% testów jednostkowych (`tests/core/nukazuke-engine.test.ts`).
* **Persona:** P2, P5, P6.
* **Priorytet:** MUST | **Etap:** MVP/1.1.

---

### **BR-KISZ-024: Kinetyka Mycelium Tempehu & Ochrona Przed Przegrzaniem (Tempeh Solid-State Mycelium Fermentation Engine)**
* **Opis:** Narzędzie kontroli fermentacji stałopodłożowej (Solid-State Fermentation, SSF) nasion soi lub zbóż zaszczepionych grzybnią *Rhizopus oligosporus / oryzae*, bilansu zakwaszania zapobiegającego *Bacillus cereus*, perforacji opakowania oraz zarządzania egzotermicznym wybuchem metabolicznym (`src/core/tempeh-kinetics.ts`).
* **Kluczowe reguły biochemiczne i mikrobiologiczne:**
  1. **Bariera antybakteryjna (Hurdle Technology — Zakwaszanie ziarna):**
     * Przetrwalnikowe endospory *Bacillus cereus* przeżywają gotowanie.
     * Wymagane zakwaszenie ziarna do $\text{pH} < 4.80$ (standardowo 15 ml 5% octu jabłkowego lub spirytusowego na 500g suchych nasion soi).
     * Jeśli $\text{pH} \ge 4.80$, silnik generuje alarm blokujący `CRITICAL_BACILLUS_RISK` z nakazem natychmiastowego dokwaszenia ziarna.
  2. **Cztery fazy wzrostu grzybni *Rhizopus*:**
     * **Faza uśpienia / Lag (0–12h):** Grzybnia kiełkuje. Wymaga inkubacji zewnętrznej 30–32°C i wilgotności względnej RH ~75–85%. Ziarna muszą być suche na powierzchni, by uniknąć rozwoju bakterii.
     * **Faza wybuchu egzotermicznego / Exponential Burst (13–24h):** Grzybnia syntetyzuje enzymy i gwałtownie oddycha, wydzielając intensywne ciepło metaboliczne. Temperatura rdzenia tempehu może wzrosnąć o 8–12°C powyżej temperatury otoczenia. Silnik nakazuje obniżenie nastawy inkubatora do 24–25°C lub jego całkowite wyłączenie (`EXOTHERMIC_ACTIVE_HEAT_REDUCTION`), zapobiegając ugotowaniu grzybni.
     * **Faza dojrzałości / Mature White Cake (25–32h):** Zwarta, śnieżnobiała grzybnia wiąże ziarna w sztywny blok. Zapach świeżych pieczarek/orzechów. Czas zbioru i schłodzenia bloku.
     * **Faza przejrzałości / Over-mature Sporulation (>32h):** Grzybnia zaczyna zarodnikować (czarno-szare plamy wokół perforacji), wzrasta stężenie amoniaku z proteolizy.
  3. **Termiczna tolerancja *Rhizopus*:**
     * $< 25^\circ\text{C}$: `TOO_COLD` — spowolniony wzrost, ryzyko dominacji bakterii.
     * $28 - 32^\circ\text{C}$: `OPTIMAL` — idealne warunki wzrostu.
     * $38 - 42^\circ\text{C}$: `OVERHEATING_WARNING` — grzybnia przestaje rosnąć, zarodnikuje, rozwija się nieprzyjemny zapach.
     * $> 42^\circ\text{C}$: `CRITICAL_OVERHEAT_KILL` — denaturacja białek mycelium, gnicie bakteryjne, wsad do utylizacji.
  4. **Kalkulator aeracji i mikroperforacji woreczka:**
     * Grzybnia wymaga tlenu, lecz zbyt duży dopływ wysusza ziarna.
     * Otwory nakłuwane grubą igłą / wykałaczką co 1.5 cm po obu stronach torebki z polietylenu zamykanej strunowo:
       $$N_{holes} = 2 \times \frac{Szeroko\acute{s}\acute{c} \times D\l{}ugo\acute{s}\acute{c}}{1.5 \times 1.5}$$
* **Kryteria akceptacji:**
  1. Karta zintegrowana w trybie Kiszonki & Warzywa Pro Accordion w [`app/(tabs)/index.tsx`](file:///c:/Users/lukas/Documents/antigravity/calm-planck/app/(tabs)/index.tsx).
  2. 100% testów jednostkowych (`tests/core/tempeh-kinetics.test.ts`).
* **Persona:** P2, P5, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP/1.1.

---

### **BR-KISZ-025: Wolna Reakcja Maillarda & Czarny Czosnek (Black Garlic & Slow Maillard Aging Engine)**
* **Opis:** Silnik monitorowania termicznego dojrzewania czarnego czosnku w komorze grzewczej lub ryżowarze w oparciu o nieenzymatyczną reakcję Maillarda, degradację allicyny do przyswajalnej S-allilocysteiny (SAC), kontrolę wilgotności zapobiegającą skamienieniu oraz zapobieganie pirolizie (`src/core/black-garlic.ts`).
* **Kluczowe reguły biochemiczne i parametry procesu:**
  1. **Czterofazowy cykl starzenia Maillarda (45–50 dni):**
     * **Faza 1 — Inicjacja i Enzymatyczna Inaktywacja (Dni 1–10, 72–78°C, RH 80–90%):** Denaturacja allinazy, powolny rozpad allicyny, początek hydrolizy fruktanów do cukrów prostych (glukozy i fruktozy).
     * **Faza 2 — Intensywna Reakcja Maillarda & Synteza SAC (Dni 11–28, 68–74°C, RH 75–85%):** Kondensacja aminokwasów z cukrami redukującymi, synteza melanoidyn (smolista czerń) oraz 5- do 7-krotny przyrost S-allilocysteiny (SAC — silny antyoksydant rozpuszczalny w wodzie, łagodny dla żołądka).
     * **Faza 3 — Dojrzewanie Balsamiczne & Aromatyzacja (Dni 29–42, 62–68°C, RH 65–75%):** Koncentracja nut suszonych śliwek, melasy, tamaryndowca i octu balsamicznego; redukcja lotnych kwasów organicznych.
     * **Faza 4 — Wietrzenie i Krystalizacja Truflowa (Dni 43–50, 18–24°C, RH 45–60%):** Leżakowanie na przewiewnej siatce w temperaturze pokojowej w celu odparowania lepkiej wilgoci powierzchniowej i uzyskania struktury sprężystej trufli/żelki.
  2. **Bariery termiczne i ochrona przed wadami:**
     * $< 55^\circ\text{C}$: `TEMPERATURE_CRITICAL_LOW` — ryzyko rozwoju przetrwalników bakterii fermentacji masłowej i gnicia.
     * $> 82^\circ\text{C}$: `TEMPERATURE_CRITICAL_HIGH` — niekontrolowana piroliza, gorzki posmak spalenizny i synteza akrylamidu.
  3. **Równowaga wilgotności komory (RH):**
     * $< 60\%$ RH: `RH_CRITICAL_LOW` — wada skamienienia (ząbki wysychają w twarde, niespożywalne kamyki). Nakaz szczelnego owinięcia folią aluminiową (2–3 warstwy) lub torebkami sous-vide.
     * $> 92\%$ RH: `RH_CRITICAL_HIGH` — wada rozmoczenia ząbków w kwaśnej mazi. Nakaz osuszenia pokrywy i mikrowentylacji zaworu.
  4. **Bilans masy:** ubytek wilgoci wynosi typowo 40–48% masy wyjściowej główki czosnku.
* **Kryteria akceptacji:**
  1. Karta zintegrowana w trybie Kiszonki & Warzywa Pro Accordion w [`app/(tabs)/index.tsx`](file:///c:/Users/lukas/Documents/antigravity/calm-planck/app/(tabs)/index.tsx).
  2. 100% testów jednostkowych (`tests/core/black-garlic.test.ts`).
* **Persona:** P2, P5, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP/1.1.





