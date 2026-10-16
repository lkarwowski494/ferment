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

