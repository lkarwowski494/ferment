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
