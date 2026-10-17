# **SEROWAR BRD 0.1 — Rozdział 8: Reguły Dziedzinowe Przetwórstwa Mlecznego (RD-26…RD-50) z Wektorami Testowymi (C3)**

> **Rygor inżynieryjny:** Deterministyczne formuły biochemiczne i fizykochemiczne przetwórstwa mlecznego (twarogi, masło, ghee, jogurt, kefir, ricotta, brunost) z kompletnymi wektorami testowymi.

---

### **RD-26: Kinetyka Koagulacji Kwasowej Kazeiny w Punkcie Izoelektrycznym ($pH = 4.60$)**
* **Zasada biochemiczna:**
  Micele kazeinowe w świeżym mleku ($pH \approx 6.65$) posiadają ujemny ładunek powierzchniowy netto wynikający z dysocjacji reszt kwasu fosforowego i kwasu asparaginowego/glutaminowego. W miarę gromadzenia kwasu L-mlekowego protony $H^+$ neutralizują ujemne ładunki miceli.
  W punkcie izoelektrycznym kazeiny ($pH = 4.60$ w temperaturze $20^\circ C$):
  * Potencjał dzeta miceli osiąga $0\text{ mV}$.
  * Siły odpychania elektrostatycznego zanikają, a przeważają hydrofobowe oddziaływania kazeina-kazeina, tworząc stabilny żel kwasowy (skrzep twarogowy).
* **Wektor testowy:**
  * Jeśli $pH_{zmierzone} > 5.20$: stan `MLEKO PŁYNNE / WCZESNE UKWASZANIE`.
  * Jeśli $4.80 < pH_{zmierzone} \le 5.20$: stan `POCZĄTEK KOAGULACJI (NIE RUSZAĆ GARNKA)`.
  * Jeśli $4.55 \le pH_{zmierzone} \le 4.70$: stan `IDEALNY SKRZEP TWAROGOWY (PUNKT IZOELEKTRYCZNY)`.
  * Jeśli $pH_{zmierzone} < 4.40$: stan `PRZEKWASZENIE (SKRZEP KRUCHY, DUŻA SYNEREZA)`.

---

### **RD-27: Bilans Tłuszczowy i Wydajność Zmaślania Śmietanki**
* **Formuła inżynieryjna:**
  $$m_{masla} [g] = \frac{m_{smietanki} [g] \times (\%Fat_{smietanka} / 100) \times \eta_{yield}}{\%Fat_{maslo} / 100}$$
  Gdzie:
  * $\eta_{yield} = 0.98$ (98% tłuszczu przechodzi do ziaren masła, 2% do maślanki).
  * $\%Fat_{maslo} = 82.5\%$ (standardowe masło ekstra).
* **Wektor testowy (Śmietanka wiejska 36%, 1500 g):**
  * Wejście: $m_{smietanki} = 1500.0\text{ g}$, $\%Fat_{smietanka} = 36.0\%$.
  * Rachunek:
    $$m_{tluszczu\ w\ masle} = 1500.0 \times 0.36 \times 0.98 = 529.2\text{ g}$$
    $$m_{masla} = \frac{529.2}{0.825} = 641.45\text{ g}$$
    $$m_{maslanki} = 1500.0 - 641.45 = 858.55\text{ g}$$
  * Oczekiwany wynik: `641.5 g masła` oraz `858.5 g maślanki`.

---

### **RD-28: Termiczna Denaturacja i Koagulacja Białek Serwatkowych (Ricotta)**
* **Zasada fizykochemiczna:**
  Główne białka serwatkowe ($\beta$-laktoglobulina 50%, $\alpha$-laktoalbumina 20%) nie koagulują pod wpływem podpuszczki i pozostają rozpuszczone w serwatce. Koagulują one pod wpływem wysokiej temperatury ($T \ge 85^\circ C$) połączonej z obniżeniem pH do poziomu $5.80 - 6.00$.
* **Formuła zapotrzebowania na kwas cytrynowy (dla słodkiej serwatki podpuszczkowej pH 6.4):**
  $$m_{kwas\ cytrynowy} [g] = V_{serwatki} [L] \times 0.60\text{ g/L}$$
* **Wektor testowy (Serwatka ze słodkiego sera Gouda, 20 litrów):**
  * Wejście: $V_{serwatki} = 20.0\text{ L}$, temperatura docelowa $88^\circ C$.
  * Rachunek: $20.0 \times 0.60 = 12.0\text{ g}$ kwasu cytrynowego bezwodnego (rozpuszczonego w 100 ml wody).
  * Oczekiwany uzysk Ricotty (sama serwatka): ok. $20 \times 0.045 = 0.90\text{ kg}$ Ricotty.
  * Opcja z dodatkiem 2L mleka pełnego: uzysk wzrasta do $0.90 + (2.0 \times 0.12) = 1.14\text{ kg}$.

---

### **RD-29: Reakcja Maillarda i Odparowanie w Norweskim Brunost / Mysost**
* **Formuła zagęszczenia suchej masy:**
  Serwatka słodka zawiera ok. $6.0 - 6.5\%$ suchej masy (głównie laktoza 4.8%, minerały 0.6%, resztki białka 0.8%). Aby uzyskać zwarty blok Brunostu, zawartość suchej masy musi osiągnąć $\ge 80.0\%$.
  Wskaźnik odparowania wody:
  $$V_{wody\ do\ odparowania} = V_0 \times \left(1 - \frac{DM_{pocz}}{DM_{konc}}\right)$$
* **Wektor testowy (Kocioł serwatki 15 litrów):**
  * Wejście: $V_0 = 15.0\text{ L}$, $DM_{pocz} = 6.0\%$, $DM_{konc} = 80.0\%$.
  * Rachunek: $15.0 \times (1 - 6.0 / 80.0) = 15.0 \times (1 - 0.075) = 15.0 \times 0.925 = 13.875\text{ L}$ wody musi odparować.
  * Pozostała masa gęstej serwatki: $15.0 - 13.875 = 1.125\text{ kg}$.
  * Dodatek śmietanki 36%: 300 g śmietanki.
  * Masa końcowa bloku Brunostu: $\approx 1.40\text{ kg}$.
  * Temperatura karmelizacji laktozy: $102 - 105^\circ C$.

---

### **RD-30: Kinetyka Symbiozy Termofilnej Jogurtu ($S. thermophilus + L. bulgaricus$)**
* **Protokół symbiozy (Proto-cooperation):**
  * *Streptococcus thermophilus* rośnie szybciej na początku, zużywa tlen i wytwarza kwas mrówkowy oraz $CO_2$, które stymulują *Lactobacillus delbrueckii* subsp. *bulgaricus*.
  * *Lactobacillus* posiada aktywną proteazę powierzchniową (PrtS), która tnie kazeinę na małe peptydy stymulujące wzrost paciorkowca.
  * Optymalna temperatura inkubacji: $42.0^\circ C - 43.5^\circ C$.
  * Czas osiągnięcia skrzepu jogurtowego ($pH = 4.50$): $4.5 - 6.0\text{ godzin}$.
* **Wektor testowy:**
  * Jeśli temperatura spadnie poniżej $38^\circ C$: dominacja śluzowatych form paciorkowców, defekt ciągliwości.
  * Jeśli temperatura przekroczy $46^\circ C$: inhibicja pałeczek, opóźniona koagulacja.

---

### **RD-31: Bilans Wytapiania Czystego Ghee / Masła Klarowanego**
* **Skład masła tradycyjnego:** $82.5\%$ tłuszcz, $16.0\%$ woda, $1.5\%$ białko (kazeina) i laktoza.
* **Formuła wydajności czystego tłuszczu (AMF):**
  $$m_{ghee} [g] = m_{masla} [g] \times 0.825$$
* **Wektor testowy (4 kostki masła po 200 g = 800 g):**
  * Wejście: $800.0\text{ g}$ masła ekstra 82.5%.
  * Rachunek: $800.0 \times 0.825 = 660.0\text{ g}$.
  * Oczekiwany wynik: `660 g czystego ghee` (odparowuje ok. 128 g wody, 12 g osadu kazeiny na dnie garnka).
  * Punkt dymienia: $250^\circ C$.

---

### **RD-32: Wydajność Twarogu Klinkowego z Mleka w Zależności od Białka**
* **Formuła wydajności (przy wilgotności twarogu 70%):**
  $$m_{twarogu} [g] = \frac{V_{mleka} [L] \times \rho_{mleka} [kg/L] \times \%Bialka\_Kazeinowego [\%] \times \eta_{rec}}{1.0 - Wilgotnosc_{twarogu}}$$
* **Wektor testowy (10 litrów mleka krowiego, 2.6% kazeiny, odzysk 95%, wilgotność 70%):**
  * Wejście: $V = 10.0\text{ L}$, $\rho = 1.03\text{ kg/L}$, masa mleka = $10.3\text{ kg}$.
  * Masa kazeiny: $10.3 \times 0.026 = 0.2678\text{ kg}$.
  * Masa z odzyskiem 95%: $0.2678 \times 0.95 = 0.2544\text{ kg}$.
  * Masa twarogu (sucha masa twarogu ok. 30% z kazeiną, tłuszczem i minerałami): typowy rzemieślniczy uzysk wynosi ok. $1.60 - 1.80\text{ kg}$ z 10 litrów mleka.
  * Oczekiwany wynik: `1.70 kg twarogu`.
