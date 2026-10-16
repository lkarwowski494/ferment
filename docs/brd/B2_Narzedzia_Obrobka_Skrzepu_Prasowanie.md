# **FERMENT BRD 0.1 — Rozdział 7: Narzędzia Serowarskie — Obróbka Skrzepu i Prasowanie (B2)**

> **Moduł:** `BR-CURD-001` do `BR-CURD-030`  
> **Kontekst dziedzinowy:** Kinetyka synerezy skrzepu, geometria cięcia harfą, dogrzewanie gęstwy, płukanie serwatki, dynamika nacisku prasy ($kg/cm^2$ i PSI).

---

### **BR-CURD-001: Geometria Cięcia i Kalibrator Wielkości Ziarna**
* **Opis:** Prowadzenie użytkownika przez etap krojenia skrzepu harfą serowarską lub nożem w zależności od projektowanego typu sera.
* **Kategorie wielkości ziarna:**
  * **Duże (orzech włoski, 20–30 mm):** sery miękkie, wilgotne, camembert, brie.
  * **Średnie (orzech laskowy / kukurydza, 10–15 mm):** sery półtwarde, gouda, tylżycki, koryciński.
  * **Drobne (ziarno grochu / ryżu, 4–8 mm):** sery twarde prasowane, cheddar, gruyère, manchego.
  * **Bardzo drobne (ziarno pszenicy, 2–3 mm):** sery wysokodogrzewane, parmezan, grana.
* **Kryteria akceptacji:**
  1. Instrukcja dwukierunkowego cięcia krzyżowego (kolumny pionowe -> odczekanie 3 min -> cięcie poziome).
  2. Stoper spoczynku pociętego skrzepu (5 minut) pozwalający na wytworzenie pierwszej błonki białkowej na ziarnach przed rozpoczęciem mieszania.
* **Persona:** P1, P2, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-CURD-006: Asystent Rampy Temperaturowej Dogrzewania (Cooking Ramp)**
* **Opis:** Dynamiczny nadzór nad powolnym podnoszeniem temperatury gęstwy serowej w kotle/garnku.
* **Zasada biologiczna:** Zbyt szybkie ogrzanie gęstwy (> 1°C na 2 minuty) powoduje zeszklanie zewnętrznej warstwy ziarna (case-hardening). Zamknięte pory uniemożliwiają odpływ serwatki z wnętrza ziarna, co prowadzi do przekwaszenia i zepsucia sera w trakcie dojrzewania.
* **Kryteria akceptacji:**
  1. Użytkownik wprowadza temperaturę początkową (np. 32°C) i docelową (np. 38°C dla Goudy lub 52°C dla Parmezanu).
  2. System wylicza minimalny czas grzania:
     $$t_{min} [min] = (T_{docelowa} - T_{poczatkowa}) \times 2.0\text{ min/°C}$$
  3. Dźwiękowy metronom/stoper podaje tempo: np. „Osiągnij 34°C za 4 minuty”.
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-CURD-010: Procedura Płukania Skrzepu (Washing the Curd / Gouda Style)**
* **Opis:** Obliczanie objętości odlewanej serwatki i dodawanej gorącej wody w celu usunięcia części laktozy.
* **Zasada technologiczna:** Usunięcie 30–40% serwatki i zastąpienie jej wodą o temp. 50–60°C obniża stężenie laktozy, co ogranicza zakwaszenie przez bakterie mezofilne i daje słodki, elastyczny miąższ typowy dla serów holenderskich (Gouda, Edam).
* **Kryteria akceptacji:**
  * Wyliczenie: objętość serwatki do odlania (np. 30% z 20L = 6L) oraz objętość i temperatura wody do dolania w celu osiągnięcia docelowej temperatury gęstwy 36–38°C.
* **Persona:** P1, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-CURD-015: Zaawansowany Kalkulator Nacisku Prasy Serowarskiej**
* **Opis:** Przeliczanie masy fizycznego obciążnika (odważnika, hantli, baniaka z wodą) na rzeczywisty nacisk jednostkowy wywierany na powierzchnię sera w formie.
* **Fizyka nacisku:**
  Nacisk jednostkowy $P$ zależy od pola powierzchni formy $A = \pi \times r^2$ (dla formy cylindrycznej o promieniu $r$) oraz ramienia dźwigni w prasach holenderskich:
  $$P [kg/cm^2] = \frac{m_{obciaznika} [kg] \times R}{\pi \times (\frac{d}{2})^2 [cm^2]}$$
  Gdzie $R$ to przełożenie dźwigni (dla nacisku bezpośredniego $R = 1.0$, dla prasy dźwigniowej $R = 3.0 - 5.0$), a $d$ to średnica formy serowarskiej.
* **Kryteria akceptacji:**
  1. Użytkownik wybiera średnicę formy (np. $\varnothing 14\text{ cm} \rightarrow A \approx 154\text{ cm}^2$, $\varnothing 20\text{ cm} \rightarrow A \approx 314\text{ cm}^2$).
  2. Użytkownik podaje typ prasy: Prasa bezpośrednia / grawitacyjna ($R=1$), Prasa dźwigniowa holenderska (użytkownik wpisuje długość ramienia A i B), Prasa pneumatyczna (wpisanie ciśnienia na manometrze w barach / PSI).
  3. System generuje dokładną wagę obciążnika wymaganą do uzyskania zadanego nacisku technologicznego (np. 0.05, 0.20, 0.50, 1.00 kg/cm²).
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-CURD-020: Harmonogram Etapów Prasowania i Obracania**
* **Opis:** Sekwencja czasowa stopniowego zwiększania nacisku z powiadomieniami o odwróceniu krążka w chuście serowarskiej.
* **Wzorcowy cykl prasowania (np. Cheddar / Gouda 2 kg):**
  1. Etap 1: 15 minut przy nacisku lekkim ($0.2\text{ kg/cm}^2$). Cel: ułożenie ziaren bez zamykania kanałów odpływu serwatki. Powiadomienie: *„Wyjmij ser, obróć, wygładź chustę.”*
  2. Etap 2: 30 minut przy nacisku średnim ($0.5\text{ kg/cm}^2$). Powiadomienie: *„Drugi obrót sera w formie.”*
  3. Etap 3: 2 godziny przy nacisku mocnym ($1.0\text{ kg/cm}^2$). Powiadomienie: *„Trzeci obrót.”*
  4. Etap 4: 12–16 godzin (przez noc) przy nacisku docelowym ($1.5 - 2.0\text{ kg/cm}^2$). Powiadomienie: *„Zakończ prasowanie. Zmierz pH i wagę przed kąpielą solankową.”*
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-CURD-025: Harmonogram Odwrócony Produkcji & Anti-Fatigue Sleep Guard**
* **Opis:** Zaadaptowany z silnika *Piekarz* system planowania wstecznego na osi czasu (`reverse-scheduler.ts`). Użytkownik definiuje docelową godzinę zakończenia wyrobu sera (np. sobota 22:00, przed pójściem spać), a silnik wylicza dokładny moment startu podgrzewania mleka oraz sekwencję kroków.
* **Algorytm i Bezpieczeństwo Kulinarne (Anti-Fatigue Guard):**
  1. Wyliczanie wsteczne: $T_{start} = T_{cel} - \sum t_{krokow}$.
  2. Analiza przedziału nocnego (23:00–06:00): Jeśli jakikolwiek aktywny krok wymagający interwencji (odwracanie w prasie, solenie, dogrzewanie) wypadnie w oknie snu, system generuje ostrzeżenie wysokiego priorytetu oraz rekomenduje wcześniejszą godzinę startu.
* **Persona:** P1, P2, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-CURD-030: Odzysk Serwatki i Gospodarka Zero-Waste (Ricotta & Izotonik)**
* **Opis:** Moduł zagospodarowania produktów ubocznych (`whey-utilization.ts`). Z 10 litrów mleka serowarskiego powstaje ok. 9 litrów słodkiej serwatki podpuszczkowej zawierającej cenne albuminy i globuliny.
* **Zasady technologiczne:**
  1. **Odzysk tradycyjnej Ricotty (Ziger):** Denaturacja białek w temperaturze 88–92°C z zakwaszeniem kwasem cytrynowym ($1.8\text{ g/L}$) lub octem. Obliczanie dodatku świeżego pełnego mleka (+10% / +20%) dla podwojenia kremowości i uzysku.
  2. **Rzemieślniczy napój izotoniczny (Alpejska Rivella):** Receptura bilansująca serwatkę, sok z cytryny, miód/cukier, świeżą miętę i wodę mineralną (bogaty w potas i peptydy bioaktywne).
* **Persona:** P1, P4, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-PRESS-015: Holenderska Prasa Dźwigniowa & Kaskada Prasowania (Dutch Lever & Rind Guard)**
* **Opis:** Fizyka prasy dźwigniowej z kompensacją tary belki oraz kaskadowy program formowania skórki (`press-cascade.ts`).
* **Formuła nacisku z tarą ramienia:**
  $$F_{laczna} = M_{odwaznik} \times \left(\frac{L_{ramie}}{L_{forma}}\right) + M_{ramie} \times \left(\frac{L_{ramie} / 2}{L_{forma}}\right)$$
* **Ochrona przed Rind Entrapment (Zakleszczenie Serwatki):**
  1. Faza 1 (45 min): Lekki nacisk (1.5x waga sera), swobodny odpływ serwatki bez zamykania porów.
  2. Faza 2 (120 min): Pierwszy obrót krążka, wyrównanie powierzchni (3.5x waga sera).
  3. Faza 3 (12h): Pełny docisk zamykający mikroszczeliny (7.5x waga sera).
  4. Blokada: Ostrzeżenie przed aplikacją maksymalnego obciążenia w fazie 1.
* **Persona:** P1, P2, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-PRESS-016: Przemywanie Ziarna & Odlaktozowanie (Curd Washing / Delactosing Thermal Equilibrium)**
* **Opis:** Bilans masowo-termiczny przemywania ziarna serowarskiego gorącą wodą (Gouda, Edam, Havarti). Usuwa część laktozy z serwatki, zapobiegając nadmiernemu przekwaszeniu i zapewniając elastyczną, maślaną strukturę miąższu.
* **Formuła równowagi cieplnej:**
  $$V_{woda} = \frac{(V_{mleko} - V_{odlana}) \cdot (T_{docelowa} - T_{ziarno})}{T_{goraca} - T_{docelowa}}$$
* **Wskaźnik odlaktozowania:**
  $$Ratio_{delacto} = \left(\frac{V_{odlana}}{V_{mleko}}\right) \times 100\%$$
* **Reguły ochronne:**
  - Alarm $T_{goraca} > 65^\circ\text{C}$: Ostrzeżenie przed zacięciem termicznym powierzchni ziaren (case hardening) i zniszczeniem mikroflory.
  - Alarm $T_{docelowa} > 39^\circ\text{C}$ dla kultur mezofilnych (*Lactococcus lactis*): Blokada przed zabiciem bakterii.
* **Persona:** P1, P2, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-PRESS-017: Kinetyka Synerezy Skrzepu & Dogrzewanie Ziarna (Curd Syneresis & Casein Shrinkage Kinetics)**
* **Opis:** Fizykochemiczny kalkulator dynamiki kurczenia ziaren kazeinowych podczas krojenia, mieszania i dogrzewania skrzepu (`curd-syneresis.ts`), zapobiegający defektowi zasklepienia porów kazeinowych (case hardening / protein skinning).
* **Zasady biochemiczne i parametry kinetyki:**
  1. **Rozmiary ziarna wg stylu sera:**
     * Bardzo drobne (3–5 mm): Parmezan, Grana, Emmental, Sbrinz (szybka synereza, niska wilgotność 30–35%).
     * Średnie (8–12 mm): Gouda, Edam, Cheddar, Tilsit (umiarkowana synereza, wilgotność 36–46%).
     * Grube (15–20 mm): Camembert, Brie, Reblochon (łagodna synereza, wilgotność 50–58%).
     * Płaty / fresh (25–35 mm): Feta, Halloumi, sery twarogowe (wilgotność 55–65%).
  2. **Tempo dogrzewania (Cooking Ramp Rate Kinetics):**
     * Złota zasada serowarska: tempo wzrostu temperatury nie może przekraczać 0.5°C/min (1°C na 2–3 minuty), zwłaszcza w krytycznym oknie 31–38°C.
     * Przekroczenie tempa bezpiecznego wywołuje alarm `CRITICAL_CASE_HARDENING`: gwałtowne odwodnienie zewnętrznej warstwy ziarna i wytworzenie nieprzepuszczalnej powłoki białkowej, która więzi wilgoć i laktozę w rdzeniu, prowadząc do późniejszego przekwaszenia i gorzkiego posmaku.
  3. **Równowaga micelarna wapnia a pH przy ocieku (Drain pH):**
     * Zbyt niskie pH (<6.20 w Goudzie): alarm `DECALCIFIED_BRITTLE_ACIDIC` — nadmierne wypłukanie wapnia koloidalnego, kruchy, kredowy miąższ.
     * Zbyt wysokie pH (>6.48): alarm `EXCESSIVE_CALCIUM_RUBBERY` — nadmiar wapnia micelarnego, struktura gumowata.
  4. **Wskaźnik intensywności synerezy (Syneresis Index 0–100):**
     * Zagregowana funkcja powierzchni właściwej ziarna, temperatury dogrzewania, czasu mieszania i zakwaszenia serwatki.
* **Kryteria akceptacji:**
  1. Zintegrowana karta w trybie `cheese` Pro Accordion.
  2. Testy jednostkowe (`tests/core/curd-syneresis.test.ts`) weryfikujące wykrywanie case hardening, bilans wapnia i szacowanie wilgotności końcowej.
* **Persona:** P1, P2, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP/1.1.



