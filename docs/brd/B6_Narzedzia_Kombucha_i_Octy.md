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
