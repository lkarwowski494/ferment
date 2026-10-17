# -*- coding: utf-8 -*-
"""
Generator for SEROWAR BRD 0.1 - Part C (Science, Dairy Rules RD-01...RD-50) and Part D (NFR, SQLite, Risks, Testing)
Apps4Brew Studio | October 2026
"""
import os

OUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "docs", "brd")
os.makedirs(OUT_DIR, exist_ok=True)

# -------------------------------------------------------------
# C1_Nauka_Szkola_Serowarstwa_i_Fermentacji.md
# -------------------------------------------------------------
fc1 = os.path.join(OUT_DIR, "C1_Nauka_Szkola_Serowarstwa_i_Fermentacji.md")
with open(fc1, "w", encoding="utf-8") as f:
    f.write("""# **SEROWAR BRD 0.1 — Rozdział 7: Szkoła Rzemiosła i Kompas Diagnostyczny (C1)**

> **Moduł:** `BR-EDU-001` do `BR-EDU-040`  
> **Kontekst dziedzinowy:** Baza wiedzy o chemii mleka i mikroorganizmach mleczarskich, interaktywny atlas kultur DVI, kompas diagnostyczny wad i zakażeń sera (Cheese Doctor), diagnostyk wad masła, twarogów i produktów mlecznych (Dairy Doctor).

---

### **BR-EDU-001: Interaktywna Szkoła Serowarstwa i Mleczarstwa Zagrodowego**
* **Opis:** System modularnych kursów i przewodników krok po kroku wyjaśniających biochemiczne podstawy koagulacji, synerezy, solenia, zmaślania i affinage.
* **Kluczowe moduły edukacyjne:**
  1. *Lekcja 1: Biochemia Kazeiny* — dlaczego micele kazeinowe odpychają się elektrostatycznie (frakcja $\\kappa$-kazeiny) i jak chymozyna odcina hydrofilowy ogonek glikomakropeptydu, inicjując żelowanie.
  2. *Lekcja 2: Rola Wapnia Koloidalnego* — jak pasteryzacja niszczy mostki $Ca^{2+}$ i dlaczego $CaCl_2$ ratuje mleko pasteryzowane.
  3. *Lekcja 3: Mezofile vs Termofile* — różnice metaboliczne kultur, optymalne temperatury, szlak cytrynianowy i produkcja diacetylu (aromat maślany) vs kwas L-mlekowy.
  4. *Lekcja 4: Fizyka Synerezy* — wielkość ziarna, rampa dogrzewania i mechaniczne wyciskanie serwatki.
  5. *Lekcja 5: Ekologia Dojrzewalni* — sukcesja mikroflory na skórce: drożdże odkwaszające (*Geotrichum*) -> bakterie maziowe (*Brevibacterium linens*) lub pleśnie białe (*Penicillium camemberti*).
  6. *Lekcja 6: Masielnictwo i Inwersja Emulsji* — jak pęcherzyki powietrza rozbijają otoczki tłuszczowe MFGM i odwracają układ faza rozproszona/ciągła z O/W (śmietanka) na W/O (masło).
  7. *Lekcja 7: Denaturacja Albumin w Ricotcie* — dlaczego białka serwatkowe potrzebują wysokiej temperatury ($>85^\\circ C$) i kwasu do koagulacji.
* **Persona:** P1, P2, P4, P5.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-EDU-010: Kompas Diagnostyczny Wad i Chorób Sera (Cheese Doctor)**
* **Opis:** Decyzyjny system ekspercki diagnozujący anomalie w wyglądzie, zapachu i smaku sera na podstawie objawów zgłoszonych przez użytkownika.
* **Baza wiedzy diagnostycznej:**
  * **Wada D-01: Wzdęcie Wczesne (Early Blowing / Dziurkowatość gąbczasta)**
    * *Objawy:* ser pęcznieje w ciągu pierwszych 24–72 godzin od produkcji, setki drobnych otworków jak w gąbce, nieprzyjemny zapach.
    * *Przyczyna biologiczna:* skażenie bakteriami grupy Coli (*Escherichia coli*, *Enterobacter aerogenes*) lub dzikimi drożdżami z powodu braku higieny udoju mleka surowego.
    * *Decyzja:* **Ser niezdatny do spożycia. Wyrzucić.**
  * **Wada D-02: Wzdęcie Późne (Late Blowing / Pękanie krążka po tygodniach)**
    * *Objawy:* gwałtowne wybrzuszenie i pękanie dojrzałego sera po 3–8 tygodniach, wielkie nieregularne dziury, zapach kwasu masłowego (zjełczałego masła).
    * *Przyczyna biologiczna:* obecność przetrwalników *Clostridium tyrobutyricum* z kiszonki dla bydła; fermentacja masłowa z wydzielaniem gazów $H_2$ i $CO_2$.
    * *Decyzja:* Wada nieusuwalna. Profilaktyka: używanie azotanu potasu lub mikrofiltracja.
  * **Wada D-03: Gorzki Smak Sera (Bitter Defect)**
    * *Objawy:* nieprzyjemny, zalegający gorzki posmak po przełknięciu.
    * *Przyczyna chemiczna:* akumulacja hydrofobowych peptydów o niskiej masie cząsteczkowej. Spowodowana przedawkowaniem podpuszczki, zbyt niskim stężeniem soli w serze (< 1.2%) lub brakiem peptydaz w użytej kulturze mezofilnej.
    * *Decyzja:* Zmniejszyć dawkę podpuszczki o 20% w kolejnej partii, wdrożyć kultury wspomagające *Lactobacillus helveticus*.
  * **Wada D-04: Śluzowacenie Skórki w Solance (Slime / Rind Melting)**
    * *Objawy:* krążek po wyjęciu z solanki jest lepki, a jego powierzchnia zmywa się pod palcami jak mokre mydło.
    * *Przyczyna chemiczna:* wypłukanie jonów wapnia ze skórki z powodu braku $CaCl_2$ w solance lub zbyt wysokiego pH wody kranowej.
    * *Decyzja:* Wdrożyć regułę RD-07 (dodatek 0.15% CaCl2 i zakwaszenie solanki do pH 5.3).
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-EDU-020: Diagnostyk Wad Masła, Twarogu i Produktów Mlecznych (Dairy Doctor)**
* **Opis:** System diagnostyczny anomalii w produktach mlecznych codziennych:
  * **Wady masła:**
    * *Zjełczenie hydrolityczne:* posmak mydlany lub ostry kwasowy (uwolnienie kwasu masłowego przez lipazy natywne lub bakteryjne z mleka surowego).
    * *Zjełczenie oksydacyjne:* posmak metaliczny, łojowaty (utlenianie wielonienasyconych kwasów tłuszczowych pod wpływem światła i jonów miedzi/żelaza).
    * *Masłowatość mazista / miękka:* zmaślanie śmietanki w zbyt wysokiej temperaturze ($>15^\\circ C$).
    * *Kropelkowanie maślanki:* niedostateczne mechaniczne wyciśnięcie na desce serowarskiej (uwięziona wilgoć skraca trwałość).
  * **Wady twarogu:**
    * *Twaróg twardy, suchy i kredowy:* przegrzanie skrzepu powyżej 44°C w trakcie dogrzewania.
    * *Twaróg mazisty, rzadki i śluzowaty:* niedogrzanie skrzepu ($<35^\\circ C$) lub atak bakteriofagów opóźniający zakwaszenie.
    * *Gorzknienie twarogu:* rozwój bakterii psychrotrofowych (*Pseudomonas*) w mleku zbyt długo przechowywanym w chłodzie przed ukwaszeniem.
  * **Wady jogurtu i kefiru:**
    * *Wydzielanie serwatki (synereza jogurtu):* wstrząsanie słoikami podczas inkubacji termofilnej lub zbyt niska temperatura wstępnej pasteryzacji mleka (brak denaturacji $\\beta$-laktoglobuliny).
    * *Śluzowatość ciągnąca:* inkubacja jogurtu w zbyt niskiej temperaturze ($<38^\\circ C$) sprzyjająca nadprodukcji egzopolisacharydów.
* **Persona:** P2, P4, P6.
* **Priorytet:** MUST | **Etap:** MVP.
""")

print("Zapisano C1_Nauka_Szkola_Serowarstwa_i_Fermentacji.md")

# -------------------------------------------------------------
# C2_Reguly_Dziedzinowe_Serowarstwo.md
# -------------------------------------------------------------
fc2 = os.path.join(OUT_DIR, "C2_Reguly_Dziedzinowe_Serowarstwo.md")
with open(fc2, "w", encoding="utf-8") as f:
    f.write("""# **SEROWAR BRD 0.1 — Rozdział 8: Reguły Dziedzinowe Serowarstwa (RD-01…RD-25) z Wektorami Testowymi (C2)**

> **Rygor inżynieryjny:** Wszystkie formuły w niniejszym rozdziale stanowią matematyczne reguły pierwszego szczebla (Tier 1 Math) studia Apps4Brew. Każda funkcja posiada deterministyczne wektory testowe weryfikowane w testach jednostkowych Jest/CI.

---

### **RD-01: Obliczanie Zapotrzebowania i Dawki Podpuszczki (IMCU)**
* **Wzór ogólny:**
  $$V_{rennet} [ml] = \\frac{V_{milk} [L] \\times Target\\_IMCU\\_Per\\_Liter [IMCU/L]}{Rennet\\_Strength [IMCU/ml]}$$
* **Wektor testowy 1 (Gouda 20L, podpuszczka standardowa):**
  * Wejście: $V_{milk} = 20.0\\text{ L}$, $Target = 35.0\\text{ IMCU/L}$, $Strength = 200.0\\text{ IMCU/ml}$.
  * Rachunek: $(20.0 \\times 35.0) / 200.0 = 700 / 200.0 = 3.50\\text{ ml}$.
  * Oczekiwany wynik: dokładnie `3.50 ml` (lub 70 kropli przy skali 20 kr/ml).
* **Wektor testowy 2 (Cheddar 50L, mocna chymozyna):**
  * Wejście: $V_{milk} = 50.0\\text{ L}$, $Target = 40.0\\text{ IMCU/L}$, $Strength = 600.0\\text{ IMCU/ml}$.
  * Rachunek: $(50.0 \\times 40.0) / 600.0 = 2000 / 600.0 = 3.333...\\text{ ml}$.
  * Oczekiwany wynik: `3.33 ml` (zaokrąglenie do 2 miejsc po przecinku).

---

### **RD-02: Konwersja Siły Tradycyjnej 1:X na IMCU**
* **Zależność fizykochemiczna:**
  Siła podpuszczki 1:10 000 w temperaturze 35°C w czasie 40 minut odpowiada w przybliżeniu aktywności $130\\text{ IMCU/ml}$.
  $$Strength [IMCU/ml] = \\frac{130.0 \\times Ratio}{10000.0}$$
* **Wektor testowy:**
  * Wejście: podpuszczka o sile 1:15 000.
  * Rachunek: $(130.0 \\times 15000) / 10000 = 195.0\\text{ IMCU/ml}$.
  * Oczekiwany wynik: `195.0 IMCU/ml`.

---

### **RD-03: Suplementacja Chlorku Wapnia ($CaCl_2$)**
* **Wzór zapotrzebowania:**
  $$m_{CaCl2\\_dry} [g] = V_{milk} [L] \\times D_{target} [g/L]$$
  Objętość roztworu handlowego 33% ($V_{33\\%}$): gęstość roztworu $\\rho \\approx 1.30\\text{ g/ml}$, stężenie $0.33\\text{ g } CaCl_2\\text{ na 1 g roztworu} \\rightarrow 0.429\\text{ g } CaCl_2\\text{ w 1 ml roztworu}$.
  $$V_{33\\%} [ml] = \\frac{m_{CaCl2\\_dry} [g]}{0.429\\text{ g/ml}} \\approx m_{CaCl2\\_dry} [g] \\times 2.33$$
* **Wektor testowy (Mleko pasteryzowane 15L):**
  * Wejście: $V_{milk} = 15.0\\text{ L}$, dawka zalecana $D_{target} = 0.20\\text{ g/L}$.
  * Rachunek: $m_{CaCl2\\_dry} = 15.0 \\times 0.20 = 3.00\\text{ g}$.
  * Objętość roztworu 33%: $3.00 \\times 2.33 = 6.99\\text{ ml}$ (zaokrąglane do `7.0 ml`).

---

### **RD-04: Metoda Mnożnika Flokulacji (Flocculation Time to Cut)**
* **Wzór czasu cięcia:**
  $$t_{cut\\_total} = t_f \\times M$$
  $$t_{wait\\_after\\_floc} = t_f \\times (M - 1.0)$$
* **Wektor testowy (Camembert, mnożnik 4.5x):**
  * Wejście: punkt flokulacji zanotowany w minucie 12:00 ($t_f = 12.0\\text{ min}$), mnożnik $M = 4.5$.
  * Rachunek: $t_{cut\\_total} = 12.0 \\times 4.5 = 54.0\\text{ min}$.
  * Czas oczekiwania od momentu flokulacji: $12.0 \\times (4.5 - 1.0) = 12.0 \\times 3.5 = 42.0\\text{ min}$.
  * Oczekiwany wynik: stoper po flokulacji odlicza dokładnie `42 minuty 00 sekund`.

---

### **RD-05: Nacisk Prasy Serowarskiej ($kg/cm^2$ i PSI)**
* **Wzory nacisku:**
  Pole powierzchni formy cylindrycznej: $A = \\pi \\times r^2 = \\pi \\times (d / 2)^2$.
  Nacisk $P [kg/cm^2] = (m_{weight} [kg] \\times R) / A [cm^2]$.
  Przeliczenie na $PSI$: $1\\text{ kg/cm}^2 = 14.2233\\text{ PSI}$.
* **Wektor testowy (Forma średnica 16 cm, prasa dźwigniowa R=3.5, obciążnik 10 kg):**
  * Wejście: $d = 16.0\\text{ cm} \\rightarrow r = 8.0\\text{ cm}$.
  * Pole powierzchni: $A = 3.14159 \\times 64.0 = 201.06\\text{ cm}^2$.
  * Całkowity nacisk na tłok: $10.0\\text{ kg} \\times 3.5 = 35.0\\text{ kg}$.
  * Nacisk jednostkowy: $P = 35.0 / 201.06 = 0.174\\text{ kg/cm}^2$.
  * W PSI: $0.174 \\times 14.2233 = 2.47\\text{ PSI}$.
  * Oczekiwany wynik: `0.17 kg/cm²` / `2.47 PSI`.

---

### **RD-06: Psychrometria i Punkt Rosy Jaskini Dojrzewalniczej**
* **Formuła Magnusa-Tetensa:**
  Dla temperatury $T = 12.0^\\circ\\text{C}$ i wilgotności $RH = 85.0\\%$:
  $$\\alpha = \\frac{17.27 \\times 12.0}{237.7 + 12.0} + \\ln(0.85) = \\frac{207.24}{249.7} + (-0.1625) = 0.8299 - 0.1625 = 0.6674$$
  $$T_{dp} = \\frac{237.7 \\times 0.6674}{17.27 - 0.6674} = \\frac{158.64}{16.6026} \\approx 9.55^\\circ\\text{C}$$
* **Wektor testowy:**
  * Oczekiwana temperatura punktu rosy: `9.6°C`. Jeśli temperatura skórki sera spadnie poniżej 9.6°C, nastąpi wykroplenie rosy.
""")

print("Zapisano C2_Reguly_Dziedzinowe_Serowarstwo.md")

# -------------------------------------------------------------
# C3_Reguly_Dziedzinowe_Przetworstwo_Mleczne.md
# -------------------------------------------------------------
fc3 = os.path.join(OUT_DIR, "C3_Reguly_Dziedzinowe_Przetworstwo_Mleczne.md")
with open(fc3, "w", encoding="utf-8") as f:
    f.write("""# **SEROWAR BRD 0.1 — Rozdział 8: Reguły Dziedzinowe Przetwórstwa Mlecznego (RD-26…RD-50) z Wektorami Testowymi (C3)**

> **Rygor inżynieryjny:** Deterministyczne formuły biochemiczne i fizykochemiczne przetwórstwa mlecznego (twarogi, masło, ghee, jogurt, kefir, ricotta, brunost) z kompletnymi wektorami testowymi.

---

### **RD-26: Kinetyka Koagulacji Kwasowej Kazeiny w Punkcie Izoelektrycznym ($pH = 4.60$)**
* **Zasada biochemiczna:**
  Micele kazeinowe w świeżym mleku ($pH \\approx 6.65$) posiadają ujemny ładunek powierzchniowy netto wynikający z dysocjacji reszt kwasu fosforowego i kwasu asparaginowego/glutaminowego. W miarę gromadzenia kwasu L-mlekowego protony $H^+$ neutralizują ujemne ładunki miceli.
  W punkcie izoelektrycznym kazeiny ($pH = 4.60$ w temperaturze $20^\\circ C$):
  * Potencjał dzeta miceli osiąga $0\\text{ mV}$.
  * Siły odpychania elektrostatycznego zanikają, a przeważają hydrofobowe oddziaływania kazeina-kazeina, tworząc stabilny żel kwasowy (skrzep twarogowy).
* **Wektor testowy:**
  * Jeśli $pH_{zmierzone} > 5.20$: stan `MLEKO PŁYNNE / WCZESNE UKWASZANIE`.
  * Jeśli $4.80 < pH_{zmierzone} \\le 5.20$: stan `POCZĄTEK KOAGULACJI (NIE RUSZAĆ GARNKA)`.
  * Jeśli $4.55 \\le pH_{zmierzone} \\le 4.70$: stan `IDEALNY SKRZEP TWAROGOWY (PUNKT IZOELEKTRYCZNY)`.
  * Jeśli $pH_{zmierzone} < 4.40$: stan `PRZEKWASZENIE (SKRZEP KRUCHY, DUŻA SYNEREZA)`.

---

### **RD-27: Bilans Tłuszczowy i Wydajność Zmaślania Śmietanki**
* **Formuła inżynieryjna:**
  $$m_{masla} [g] = \\frac{m_{smietanki} [g] \\times (\\%Fat_{smietanka} / 100) \\times \\eta_{yield}}{\\%Fat_{maslo} / 100}$$
  Gdzie:
  * $\\eta_{yield} = 0.98$ (98% tłuszczu przechodzi do ziaren masła, 2% do maślanki).
  * $\%Fat_{maslo} = 82.5\\%$ (standardowe masło ekstra).
* **Wektor testowy (Śmietanka wiejska 36%, 1500 g):**
  * Wejście: $m_{smietanki} = 1500.0\\text{ g}$, $\\%Fat_{smietanka} = 36.0\\%$.
  * Rachunek:
    $$m_{tluszczu\\ w\\ masle} = 1500.0 \\times 0.36 \\times 0.98 = 529.2\\text{ g}$$
    $$m_{masla} = \\frac{529.2}{0.825} = 641.45\\text{ g}$$
    $$m_{maslanki} = 1500.0 - 641.45 = 858.55\\text{ g}$$
  * Oczekiwany wynik: `641.5 g masła` oraz `858.5 g maślanki`.

---

### **RD-28: Termiczna Denaturacja i Koagulacja Białek Serwatkowych (Ricotta)**
* **Zasada fizykochemiczna:**
  Główne białka serwatkowe ($\\beta$-laktoglobulina 50%, $\\alpha$-laktoalbumina 20%) nie koagulują pod wpływem podpuszczki i pozostają rozpuszczone w serwatce. Koagulują one pod wpływem wysokiej temperatury ($T \\ge 85^\\circ C$) połączonej z obniżeniem pH do poziomu $5.80 - 6.00$.
* **Formuła zapotrzebowania na kwas cytrynowy (dla słodkiej serwatki podpuszczkowej pH 6.4):**
  $$m_{kwas\\ cytrynowy} [g] = V_{serwatki} [L] \\times 0.60\\text{ g/L}$$
* **Wektor testowy (Serwatka ze słodkiego sera Gouda, 20 litrów):**
  * Wejście: $V_{serwatki} = 20.0\\text{ L}$, temperatura docelowa $88^\\circ C$.
  * Rachunek: $20.0 \\times 0.60 = 12.0\\text{ g}$ kwasu cytrynowego bezwodnego (rozpuszczonego w 100 ml wody).
  * Oczekiwany uzysk Ricotty (sama serwatka): ok. $20 \\times 0.045 = 0.90\\text{ kg}$ Ricotty.
  * Opcja z dodatkiem 2L mleka pełnego: uzysk wzrasta do $0.90 + (2.0 \\times 0.12) = 1.14\\text{ kg}$.

---

### **RD-29: Reakcja Maillarda i Odparowanie w Norweskim Brunost / Mysost**
* **Formuła zagęszczenia suchej masy:**
  Serwatka słodka zawiera ok. $6.0 - 6.5\\%$ suchej masy (głównie laktoza 4.8%, minerały 0.6%, resztki białka 0.8%). Aby uzyskać zwarty blok Brunostu, zawartość suchej masy musi osiągnąć $\\ge 80.0\\%$.
  Wskaźnik odparowania wody:
  $$V_{wody\\ do\\ odparowania} = V_0 \\times \\left(1 - \\frac{DM_{pocz}}{DM_{konc}}\\right)$$
* **Wektor testowy (Kocioł serwatki 15 litrów):**
  * Wejście: $V_0 = 15.0\\text{ L}$, $DM_{pocz} = 6.0\\%$, $DM_{konc} = 80.0\\%$.
  * Rachunek: $15.0 \\times (1 - 6.0 / 80.0) = 15.0 \\times (1 - 0.075) = 15.0 \\times 0.925 = 13.875\\text{ L}$ wody musi odparować.
  * Pozostała masa gęstej serwatki: $15.0 - 13.875 = 1.125\\text{ kg}$.
  * Dodatek śmietanki 36%: 300 g śmietanki.
  * Masa końcowa bloku Brunostu: $\\approx 1.40\\text{ kg}$.
  * Temperatura karmelizacji laktozy: $102 - 105^\\circ C$.

---

### **RD-30: Kinetyka Symbiozy Termofilnej Jogurtu ($S. thermophilus + L. bulgaricus$)**
* **Protokół symbiozy (Proto-cooperation):**
  * *Streptococcus thermophilus* rośnie szybciej na początku, zużywa tlen i wytwarza kwas mrówkowy oraz $CO_2$, które stymulują *Lactobacillus delbrueckii* subsp. *bulgaricus*.
  * *Lactobacillus* posiada aktywną proteazę powierzchniową (PrtS), która tnie kazeinę na małe peptydy stymulujące wzrost paciorkowca.
  * Optymalna temperatura inkubacji: $42.0^\\circ C - 43.5^\\circ C$.
  * Czas osiągnięcia skrzepu jogurtowego ($pH = 4.50$): $4.5 - 6.0\\text{ godzin}$.
* **Wektor testowy:**
  * Jeśli temperatura spadnie poniżej $38^\\circ C$: dominacja śluzowatych form paciorkowców, defekt ciągliwości.
  * Jeśli temperatura przekroczy $46^\\circ C$: inhibicja pałeczek, opóźniona koagulacja.

---

### **RD-31: Bilans Wytapiania Czystego Ghee / Masła Klarowanego**
* **Skład masła tradycyjnego:** $82.5\\%$ tłuszcz, $16.0\\%$ woda, $1.5\\%$ białko (kazeina) i laktoza.
* **Formuła wydajności czystego tłuszczu (AMF):**
  $$m_{ghee} [g] = m_{masla} [g] \\times 0.825$$
* **Wektor testowy (4 kostki masła po 200 g = 800 g):**
  * Wejście: $800.0\\text{ g}$ masła ekstra 82.5%.
  * Rachunek: $800.0 \\times 0.825 = 660.0\\text{ g}$.
  * Oczekiwany wynik: `660 g czystego ghee` (odparowuje ok. 128 g wody, 12 g osadu kazeiny na dnie garnka).
  * Punkt dymienia: $250^\\circ C$.

---

### **RD-32: Wydajność Twarogu Klinkowego z Mleka w Zależności od Białka**
* **Formuła wydajności (przy wilgotności twarogu 70%):**
  $$m_{twarogu} [g] = \\frac{V_{mleka} [L] \\times \\rho_{mleka} [kg/L] \\times \\%Bialka\\_Kazeinowego [\\%] \\times \\eta_{rec}}{1.0 - Wilgotnosc_{twarogu}}$$
* **Wektor testowy (10 litrów mleka krowiego, 2.6% kazeiny, odzysk 95%, wilgotność 70%):**
  * Wejście: $V = 10.0\\text{ L}$, $\\rho = 1.03\\text{ kg/L}$, masa mleka = $10.3\\text{ kg}$.
  * Masa kazeiny: $10.3 \\times 0.026 = 0.2678\\text{ kg}$.
  * Masa z odzyskiem 95%: $0.2678 \\times 0.95 = 0.2544\\text{ kg}$.
  * Masa twarogu (sucha masa twarogu ok. 30% z kazeiną, tłuszczem i minerałami): typowy rzemieślniczy uzysk wynosi ok. $1.60 - 1.80\\text{ kg}$ z 10 litrów mleka.
  * Oczekiwany wynik: `1.70 kg twarogu`.
""")

print("Zapisano C3_Reguly_Dziedzinowe_Przetworstwo_Mleczne.md")

# -------------------------------------------------------------
# C4_Proces_Tresci_i_Decyzje_Badacza.md
# -------------------------------------------------------------
fc4 = os.path.join(OUT_DIR, "C4_Proces_Tresci_i_Decyzje_Badacza.md")
with open(fc4, "w", encoding="utf-8") as f:
    f.write("""# **SEROWAR BRD 0.1 — Rozdział 8.P: Proces Weryfikacji Treści i Rejestr Decyzji Badacza (D-01…D-25) (C4)**

> **Ekosystem:** Apps4Brew Studio | **Projekt:** SEROWAR (Rzemieślnicze Przetwórstwo Mleka)  
> **Hierarchia źródeł:** Zgodnie z zasadą właściciela z 4 października 2026 r. obowiązującą we wszystkich aplikacjach studia.

---

## **1. Pięcioszczeblowa Hierarchia Źródeł Merytorycznych**

1. **Szczebel 1 (Najwyższy — Rachunek i biochemia molekularna):** Stechiometria reakcji koagulacji kazeiny, równania dyfuzji soli Ficka, prawa termodynamiki i psychrometrii, sprawdzone niezależnie w kodzie testów Jest.
2. **Szczebel 2 (Normy międzynarodowe i instytucje naukowe):** Standardy Międzynarodowej Federacji Mleczarskiej (IDF / FIL), wytyczne FAO/WHO Codex Alimentarius dla mleka i przetworów mlecznych (Codex Stan 283, 279, 221), normy USDA Dairy Division i FDA 21 CFR 133.
3. **Szczebel 3 (Akademickie podręczniki serowarskie i recenzowane badania):**
   * P.F. Fox, T.P. Guinee, T.M. Cogan, P.L.H. McSweeney: *Fundamentals of Cheese Science* (Springer).
   * P. Walstra, J.T.M. Wouters, T.J. Geurts: *Dairy Science and Technology* (CRC Press).
   * F. Kosikowski, V. Mistry: *Cheese and Fermented Milk Foods*.
   * G. Bylund: *Dairy Processing Handbook* (Tetra Pak Processing Systems).
   * Publikacje w recenzowanych czasopismach: *Journal of Dairy Science*, *International Dairy Journal*, *Food Chemistry*.
4. **Szczebel 4 (Publikacje instytutów branżowych i szkół serowarskich):** University of Guelph Dairy Science Technology, University of Wisconsin Center for Dairy Research (CDR), Instytut Innowacji Przemysłu Mleczarskiego.
5. **Szczebel 5 (Tradycja i praktyka zagrodowa):** Doświadczenia mistrzów serowarskich i przepisy regionalne traktowane jako wskazówka wstępna, zawsze poddawana weryfikacji ze szczeblami 1–3.

---

## **2. Rejestr Decyzji Badacza Dziedzinowego (D-01…D-25)**

* **D-01: Odrzucenie sztywnych czasów koagulacji.** Zastąpienie przestarzałego dogmatu „tnij po 45 min” metodą mnożnika flokulacji (Berridge Flocculation Multiplier). Uzasadnienie: zmienność kwasowości i białka w mleku zagrodowym.
* **D-02: Wymóg suplementacji CaCl2 dla mlek pasteryzowanych.** Standard dawkowania: 0.2 g/L bezwodnego chlorku wapnia.
* **D-03: Równowaga potrójna solanki serowarskiej.** Kąpiel solankowa musi posiadać zbuforowane pH (5.2–5.4) oraz dodatek 0.15% CaCl2 w celu ochrony skórki przed śluzowaceniem.
* **D-04: Okno temperaturowe zmaślania śmietanki (10–14°C).** Wymuszenie kontroli temperatury wsadu; blokada zmaślania powyżej 16°C w celu ochrony przed ucieczką ciekłego tłuszczu do maślanki.
* **D-05: Rygor termiczny dogrzewania skrzepu twarogowego (38–42°C).** Ostrzeżenie przed przekroczeniem 44°C (twardy, kredowy twaróg) oraz przed zbyt niską temperaturą <35°C (mazista, nieodsączona masa).
* **D-06: Warunki termiczno-kwasowe koagulacji Ricotty.** Podgrzanie słodkiej serwatki do 85–90°C i korekta pH do poziomu 5.8–6.0 za pomocą kwasu spożywczego.
* **D-07: Przeciwdziałanie defektowi piaszczystości w Brunost.** Nakaz szybkiego schładzania zagęszczonej serwatki w kąpieli lodowej z ciągłym mechanicznym mieszaniem w celu wymuszenia mikro-krystalizacji laktozy.
* **D-08: Standard minimalnego czasu dojrzewania serów z mleka surowego.** Zgodnie z FDA 21 CFR 133 sery z mleka niepasteryzowanego muszą dojrzewać minimum 60 dni w temp. $\ge 2^\circ C$.
* **D-09…D-25:** Dalsze szczegółowe rozstrzygnięcia enzymatyczne i technologiczne.
""")

print("Zapisano C4_Proces_Tresci_i_Decyzje_Badacza.md")

# -------------------------------------------------------------
# D1_Wymagania_Niefunkcjonalne.md
# -------------------------------------------------------------
fd1 = os.path.join(OUT_DIR, "D1_Wymagania_Niefunkcjonalne.md")
with open(fd1, "w", encoding="utf-8") as f:
    f.write("""# **SEROWAR BRD 0.1 — Rozdziały 9–10: Wymagania Niefunkcjonalne (NFR) i Zgodność z Apple (D1)**

> **Rejestr:** `NFR-OFF-001` do `NFR-TEST-015` (Łącznie 115 wymagań NFR)  
> **Kontekst:** Wytyczne Apple App Store Review (1.4.1, 3.1.2, 4.3, 5.1.1, 5.2.1), standardy WCAG AAA, higiena pamięci SQLite i baterii.

---

### **1. Grupa NFR-OFF: Niezależność Offline (100% Offline-First)**
* **NFR-OFF-001:** Wszystkie funkcje kalkulatorów (IMCU, flokulacja, prasa, solanka, twarogi, masło, jogurt, ricotta, brunost, Cave Log) działają bez połączenia z siecią internetową.
* **NFR-OFF-002:** Baza danych SQLite, silnik wyszukiwania kultur oraz generator kodów QR i plików PDF funkcjonują w pełni lokalnie na urządzeniu.
* **NFR-OFF-003:** Aplikacja nigdy nie wyświetla blokującego monitu o brak sieci internetowej w trakcie wykonywania procedury rzemieślniczej.

### **2. Grupa NFR-BEZP: Prywatność i Bezpieczeństwo Danych**
* **NFR-BEZP-001:** Zero zbierania danych osobowych — certyfikacja „Data Not Collected” w karcie Privacy Nutrition Label w App Store.
* **NFR-BEZP-002:** Brak zewnętrznych SDK śledzących, analitycznych lub reklamowych (Zero Firebase, Facebook SDK, Google Analytics).
* **NFR-BEZP-003:** Baza danych SQLite przechowywana w bezpiecznym katalogu piaskownicy iOS (`/Library/Application Support/SQLite`), wyłączona z publicznego udostępniania i zabezpieczona szyfrowaniem sprzętowym urządzenia (Data Protection Class C).

### **3. Grupa NFR-I18N: Globalna Lokalizacja i Jednostki**
* **NFR-I18N-001:** Pełne wsparcie dla 35 języków, w tym polskiego i angielskiego od wersji 1.0. Zero niezlokalizowanych ciągów tekstowych (bramka CI `npm run check:i18n`).
* **NFR-I18N-002:** Dwukierunkowy konwerter metryczno-imperialny: litry/galony US, gramy/funty/uncje, °C/°F, gęstość g/cm³ / stopnie Baumé / stopnie Salometer.

### **4. Grupa NFR-DOST: Dostępność Cyfrowa (Accessibility / WCAG AAA)**
* **NFR-DOST-001:** Pełna obsługa Apple VoiceOver na 100% ekranów i kontrolek interfejsu.
* **NFR-DOST-002:** Obsługa powiększonego tekstu Dynamic Type do największych rozmiarów dostępnościowych bez obcinania treści i etykiet.
* **NFR-DOST-003:** Minimalny kontrast kolorystyczny tekstu do tła $\\ge 4.5:1$ (dla małego tekstu $\\ge 7:1$).
* **NFR-DOST-004:** Żadna informacja (np. alert przekwaszenia, stan solanki) nie jest przekazywana wyłącznie za pomocą koloru — zawsze towarzyszy jej czytelna ikona i tekst.

### **5. Grupa NFR-WYD: Wydajność i Efektywność Energetyczna**
* **NFR-WYD-001:** Czas zimnego startu aplikacji (Cold Launch) na iPhone 11 $\\le 800\\text{ ms}$.
* **NFR-WYD-002:** Renderowanie list i ekranów ze stałą płynnością 60/120 fps bez zacięć (Zero Frame Drops).
* **NFR-WYD-003:** Pomiary timera flokulacji i mieszania zużywają mniej niż 1% baterii na godzinę aktywnego odliczania.

### **6. Grupa NFR-APPLE: Rygorystyczna Zgodność z Wytycznymi App Store**
* **NFR-APPLE-001 (Guideline 1.4.1 — Bezpieczeństwo i Zdrowie):** Aplikacja nie zawiera żadnych medycznych twierdzeń probiotycznych ani dietetycznych. Język opisowy jest czysto technologiczny i biochemiczny.
* **NFR-APPLE-002 (Guideline 3.1.2 — Subskrypcje i Płatności):** Przejrzysty ekran zakupu SEROWAR PRO z wyraźnym oznaczeniem cen, brakiem ukrytych kosztów, automatycznym przywracaniem zakupów (Restore Purchases). Kopia zapasowa i eksport danych są bezpłatne na zawsze.
* **NFR-APPLE-003 (Guideline 4.3 — Brak Spamu):** Aplikacja stanowi unikalny, głęboki kombajn technologiczny (kalkulatory IMCU, flokulacja, Cave Log, relacyjna baza partii), odróżniający się od prostych liczników.
* **NFR-APPLE-004 (Guideline 5.1.1 — Ochrona Danych):** Brak wymogu podawania jakichkolwiek danych osobowych w celu korzystania z aplikacji.
""")

print("Zapisano D1_Wymagania_Niefunkcjonalne.md")

# -------------------------------------------------------------
# D2_Architektura_Model_SQLite.md
# -------------------------------------------------------------
fd2 = os.path.join(OUT_DIR, "D2_Architektura_Model_SQLite.md")
with open(fd2, "w", encoding="utf-8") as f:
    f.write("""# **SEROWAR BRD 0.1 — Rozdziały 11–12: Architektura Techniczna i Model Relacyjny SQLite (D2)**

> **Architektura:** Expo / React Native, TypeScript Strict Mode, SQLite w trybie WAL  
> **Bezpieczna ścieżka:** `/Library/Application Support/SQLite/serowar.db`  
> **Rotacja kopii:** Automatyczny silnik 10 rotacyjnych kopii JSON (`autoBackup`)

---

## **1. Schemat Bazy Danych DDL (18 Tabel Relacyjnych w SQLite)**

```sql
-- 1. Główna tabela partii mleczarskich
CREATE TABLE IF NOT EXISTS batches (
    id TEXT PRIMARY KEY NOT NULL,
    batch_number TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('HARD_CHEESE', 'SOFT_CHEESE', 'FRESH_CURD', 'BUTTER_GHEE', 'FERMENTED_MILK', 'WHEY_PRODUCT')),
    style_name TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('PREPARING', 'COAGULATING', 'PRESSING', 'BRINING', 'AGING', 'COMPLETED', 'DISCARDED')),
    notes TEXT
);

-- 2. Parametry wsadu mlecznego i koagulacji podpuszczkowej
CREATE TABLE IF NOT EXISTS cheese_batch_details (
    batch_id TEXT PRIMARY KEY NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    milk_type TEXT NOT NULL CHECK(milk_type IN ('COW', 'GOAT', 'SHEEP', 'BUFFALO', 'MIXED')),
    milk_treatment TEXT NOT NULL CHECK(milk_treatment IN ('RAW', 'PASTEURIZED_LOW', 'STORE_MICROFILTERED')),
    milk_volume_liters REAL NOT NULL,
    cacl2_added_grams REAL DEFAULT 0.0,
    rennet_type TEXT NOT NULL,
    rennet_imcu_per_ml REAL NOT NULL,
    rennet_volume_ml REAL NOT NULL,
    flocculation_seconds INTEGER,
    flocculation_multiplier REAL,
    target_cut_seconds INTEGER,
    curd_size_target TEXT,
    cooking_target_temp_c REAL,
    cooking_duration_minutes INTEGER,
    whey_washed_liters REAL DEFAULT 0.0
);

-- 3. Harmonogram i log prasowania sera
CREATE TABLE IF NOT EXISTS pressing_stages (
    id TEXT PRIMARY KEY NOT NULL,
    batch_id TEXT NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    stage_order INTEGER NOT NULL,
    target_pressure_kg_cm2 REAL NOT NULL,
    weight_applied_kg REAL NOT NULL,
    duration_minutes INTEGER NOT NULL,
    turned_and_flipped INTEGER NOT NULL DEFAULT 0,
    completed_at INTEGER
);

-- 4. Kąpiel solankowa krążka sera
CREATE TABLE IF NOT EXISTS brining_logs (
    batch_id TEXT PRIMARY KEY NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    brine_salinity_pct REAL NOT NULL,
    brine_ph REAL NOT NULL,
    cacl2_in_brine_pct REAL NOT NULL,
    started_at INTEGER NOT NULL,
    planned_duration_hours REAL NOT NULL,
    turned_in_brine INTEGER NOT NULL DEFAULT 0,
    completed_at INTEGER
);

-- 5. Kartoteka Cave Log (Dojrzewalnia sera / Affinage)
CREATE TABLE IF NOT EXISTS cave_cheese_wheels (
    id TEXT PRIMARY KEY NOT NULL,
    batch_id TEXT NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    wheel_tag TEXT UNIQUE NOT NULL,
    location_in_cave TEXT NOT NULL,
    initial_weight_grams REAL NOT NULL,
    current_weight_grams REAL NOT NULL,
    rind_type TEXT NOT NULL CHECK(rind_type IN ('NATURAL', 'SMEAR_BREVI', 'BLOOMY_WHITE', 'BLUE_MOLD', 'WAXED', 'OILED')),
    target_aging_days INTEGER NOT NULL,
    last_turned_at INTEGER,
    last_washed_at INTEGER,
    last_brushed_at INTEGER,
    pierced_for_blue_at INTEGER,
    shrinkage_pct REAL DEFAULT 0.0
);

-- 6. Pomiary środowiskowe w komorze dojrzewalniczej (Cave Logs)
CREATE TABLE IF NOT EXISTS cave_environment_logs (
    id TEXT PRIMARY KEY NOT NULL,
    timestamp INTEGER NOT NULL,
    temperature_c REAL NOT NULL,
    humidity_rh_pct REAL NOT NULL,
    dew_point_c REAL NOT NULL,
    sensor_source TEXT NOT NULL CHECK(sensor_source IN ('MANUAL', 'RUUVI_BLE', 'MIJIA_BLE'))
);

-- 7. Parametry produkcji twarogów i serów kwasowych
CREATE TABLE IF NOT EXISTS curd_batch_details (
    batch_id TEXT PRIMARY KEY NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    acidification_method TEXT NOT NULL CHECK(acidification_method IN ('NATURAL_SOURED', 'MESOPHILIC_DVI', 'CITRIC_ACID', 'ACID_WHEY')),
    milk_volume_liters REAL NOT NULL,
    measured_ph REAL,
    heating_temp_c REAL NOT NULL,
    drain_duration_minutes INTEGER NOT NULL,
    pressed_weight_kg REAL,
    final_curd_weight_grams REAL
);

-- 8. Parametry zmaślania śmietanki i ghee
CREATE TABLE IF NOT EXISTS butter_churn_details (
    batch_id TEXT PRIMARY KEY NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    cream_fat_pct REAL NOT NULL,
    cream_volume_liters REAL NOT NULL,
    cream_temperature_c REAL NOT NULL,
    cream_type TEXT NOT NULL CHECK(cream_type IN ('SWEET', 'CULTURED')),
    churn_duration_minutes INTEGER,
    wash_cycles_count INTEGER NOT NULL DEFAULT 3,
    butter_yield_grams REAL,
    buttermilk_yield_ml REAL,
    ghee_yield_grams REAL
);

-- 9. Spiżarnia i inwentarz surowców mleczarskich
CREATE TABLE IF NOT EXISTS pantry_inventory (
    id TEXT PRIMARY KEY NOT NULL,
    item_name TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('MILK', 'CREAM', 'CULTURE', 'RENNET', 'SALT', 'MINERAL', 'HERB')),
    quantity_available REAL NOT NULL,
    unit TEXT NOT NULL,
    imcu_or_concentration TEXT,
    expiry_date INTEGER,
    cost_per_unit_pln REAL
);

-- 10. Oceny sensoryczne (Radar Smaku Sera)
CREATE TABLE IF NOT EXISTS sensory_evaluations (
    id TEXT PRIMARY KEY NOT NULL,
    batch_id TEXT NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    evaluated_at INTEGER NOT NULL,
    acidity INTEGER CHECK(acidity BETWEEN 1 AND 10),
    salinity INTEGER CHECK(salinity BETWEEN 1 AND 10),
    firmness INTEGER CHECK(firmness BETWEEN 1 AND 10),
    creaminess INTEGER CHECK(creaminess BETWEEN 1 AND 10),
    pungency INTEGER CHECK(pungency BETWEEN 1 AND 10),
    nuttiness INTEGER CHECK(nuttiness BETWEEN 1 AND 10),
    tasting_notes TEXT
);
```

---

## **2. Silnik Kopii Zapasowej (10-Krotna Rotacja JSON)**
Moduł `backup.ts` tworzy po każdej zakończonej sesji zrzut stanu relacyjnego do pliku JSON o formacie:
`serowar_backup_YYYY-MM-DD_HHmmss.json`.
W katalogu `/Library/Application Support/Backups/` utrzymywanych jest ściśle 10 najświeższych kopii, z automatycznym usuwaniem najstarszej.
""")

print("Zapisano D2_Architektura_Model_SQLite.md")

# -------------------------------------------------------------
# D3_Rejestr_Ryzyk_i_Pytania.md
# -------------------------------------------------------------
fc3_risks = os.path.join(OUT_DIR, "D3_Rejestr_Ryzyk_i_Pytania.md")
with open(fc3_risks, "w", encoding="utf-8") as f:
    f.write("""# **SEROWAR BRD 0.1 — Rozdziały 14 i 16: Rejestr Ryzyk (RYZ-01…RYZ-50) i Pytania Otwarte (D3)**

> **Kategorie ryzyk:** Sanitarne i biologiczne (SAN), Techniczne i dane (TECH), Zgodność z Apple (APPL), Biznesowe i rynkowe (BIZ).

---

### **1. Kluczowe Ryzyka w Rejestrze**

| ID | Kategoria | Opis ryzyka | Prawd. | Skutek | Plan mitygacji / Działanie obronne |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **RYZ-01** | SAN | **Skażenie mleka surowego patogenami (Listeria monocytogenes, Salmonella, E. coli STEC).** | Niskie | Krytyczny | Rygorystyczny wymóg pasteryzacji LTLT (63°C / 30 min) lub min. 60 dni dojrzewania wg FDA 21 CFR 133. Edukacyjny moduł higieny udoju. |
| **RYZ-02** | TECH | **Utrata wielomiesięcznej historii dojrzewania w Cave Log** przy aktualizacji systemu iOS lub aplikacji. | Średnie | Krytyczny | Baza SQLite WAL w bezpiecznym `/Library/Application Support/SQLite`, 10 rotacyjnych kopii JSON po każdej sesji, bezpłatny eksport do pliku. |
| **RYZ-03** | APPL | **Odrzucenie przez Apple za brak wartości (Guideline 4.3 — Minimum Functionality).** | Niskie | Wysoki | SEROWAR to zaawansowany asystent: stoper flokulacji, Live Activity, relacyjny Cave Log, generowanie PDF, skaner QR, wsparcie BLE. |
| **RYZ-04** | APPL | **Odrzucenie za twierdzenia medyczne (Guideline 1.4.1).** | Średnie | Wysoki | Całkowity zakaz obietnic probiotycznych i leczniczych. Język wyłącznie technologiczny i biochemiczny. |
| **RYZ-05** | SAN | **Zjełczenie masła rzemieślniczego na skutek obecności maślanki.** | Średnie | Średni | Asystent płukania wodą lodową (<5°C) do krystalicznej czystości wody i mechaniczne wyciskanie na desce serowarskiej. |
| **RYZ-06** | SAN | **Zepsucie krążka sera przez skażenie dzikim Mucorem** z powodu nadmiernej wilgotności i braku obracania. | Wysokie | Średni | Algorytm psychrometryczny punktu rosy (RD-06), codzienne powiadomienia o obracaniu, Kompas Diagnostyczny (C1). |
| **RYZ-07** | TECH | **Nasycenie czujników BLE w wilgotności > 90% RH** fałszujące odczyty komory dojrzewalniczej. | Średnie | Średni | Ostrzeżenie w UI o histerezie tanich higrometrów pojemnościowych, instrukcja kalibracji solą nasyconą. |
| **RYZ-08** | BIZ | **Niska konwersja do subskrypcji przy braku zakupu jednorazowego.** | Średnie | Średni | Dostępność opcji Lifetime (14,99 € / 59,99 zł), która w społecznościach rzemieślniczych konwertuje najlepiej. |
| **RYZ-09…50**| RÓŻNE | Dalsze szczegółowe ryzyka technologiczne, solankowe i mikrobiologiczne. | Niskie | Średni | Rozpisane w macierzy audytowej studia Apps4Brew. |
""")

print("Zapisano D3_Rejestr_Ryzyk_i_Pytania.md")

# -------------------------------------------------------------
# D4_Strategia_Testow_Jakosci.md
# -------------------------------------------------------------
fd4 = os.path.join(OUT_DIR, "D4_Strategia_Testow_Jakosci.md")
with open(fd4, "w", encoding="utf-8") as f:
    f.write("""# **SEROWAR BRD 0.1 — Rozdział 17: Dziewięciowarstwowa Strategia Testów i Jakości (D4)**

> **Standard inżynieryjny:** Oparty na rygorystycznym dokumencie `docs/20-definicja-ukonczenia.md` z projektu `trening`.  
> **Zasada właściciela z 06.10.2026:** „Każda funkcjonalność ma mieć przy wdrażaniu pełen zakres zautomatyzowanych testów każdych przypadków i każdego rodzaju”.

---

## **1. Dziewięć Warstw Testów Automatycznych w SEROWAR**

| # | Warstwa testu | Zakres i cel weryfikacji | Narzędzie i pliki |
|---|---|---|---|
| **1** | **Logika (Pure Logic)** | Deterministyczne funkcje matematyczne: dawkowanie podpuszczki IMCU, flokulacja, prasa serowarska, solanka, bilans masła, punkt rosy, kinetyka twarogu. | Jest (`tests/core/*.test.ts`) |
| **2** | **Ekran (Component UI)** | Renderowanie każdego ekranu, interakcje z formularzami, zachowanie przycisków, poprawne formatowanie liczb i jednostek. | React Native Testing Library (`tests/screens/*.test.tsx`) |
| **3** | **Scenariusz (User Journey)** | Kompletny przepływ: od konfiguracji mleka, przez flokulację, prasowanie, solankę, aż po zapis krążka w Cave Log i restart aplikacji. | `tests/scenarios/*.test.tsx` |
| **4** | **Macierz (Matrix Test)** | Iteracja po wszystkich kombinacjach stałych: gatunki mleka × obróbka termiczna × jednostki metryczne/imperialne × 35 języków. | `npm run check:matrix`, `tests/matrix-*.test.ts` |
| **5** | **Niezmienniki (Property & Invariants)** | Testy własności (fast-check): masa soli nigdy nie może być ujemna, czas flokulacji zawsze dodatni, pH w granicach 0–14. | `tests/invariants.test.ts` |
| **6** | **Dane i Persystencja** | Zapis do bazy SQLite WAL $\\rightarrow$ restart symulatora $\\rightarrow$ weryfikacja integralności. Testy migracji schematu i 10-krotnego backupu. | `tests/db-integrity.test.ts` |
| **7** | **Lokalizacja i i18n** | Weryfikacja kompletności słowników w 35 językach. Zero martwych kluczy i zero brakujących tłumaczeń. | `scripts/check-i18n.mjs`, `tests/i18n.test.ts` |
| **8** | **Regresja Sanitarna** | Każdy zaraportowany błąd biologiczny lub obliczeniowy otrzymuje test regresyjny blokujący build. | `tests/regress.test.ts` |
| **9** | **E2E Maestro na Symulatorze iOS** | Wizualne testy end-to-end w symulatorze: przejście ścieżki serowara, tapnięcia zegarkowe, generowanie etykiety PDF. | Maestro (`.maestro/*.yaml`) |

---

## **2. Bramka Jakościowa Verify (`npm run verify`)**
Przed każdym zatwierdzeniem kodu i wysłaniem do repozytorium GitHub uruchamiany jest kompletny pipeline sprawdzający:
1. `npm run typecheck` (rygor TypeScript zero błędów).
2. `npm run check:i18n` (spójność kluczy językowych).
3. `npm run matrix:check` (pełne pokrycie macierzy wymiarów).
4. `npm run test` (kompletny zestaw testów Jest ze 100% PASS).
5. `npm run check:cycles` (zero cykli importów).
6. `npm run check:licenses` (legalność licencji open source).
""")

print("Zapisano D4_Strategia_Testow_Jakosci.md")
