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
