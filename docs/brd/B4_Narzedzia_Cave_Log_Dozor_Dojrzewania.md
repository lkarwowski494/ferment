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
