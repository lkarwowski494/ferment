# **SEROWAR BRD 0.1 — Rozdział 7: Narzędzia Serowarskie — Obróbka Skrzepu i Prasowanie (B2)**

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
  Nacisk jednostkowy $P$ zależy od pola powierzchni formy $A = \pi \times r^2$ oraz ramienia dźwigni w prasach holenderskich:
  $$P [kg/cm^2] = \frac{m_{obciaznika} [kg] \times R}{\pi \times (\frac{d}{2})^2 [cm^2]}$$
  Gdzie $R$ to przełożenie dźwigni ($R = 1.0$ dla nacisku bezpośredniego, $R = 3.0 - 5.0$ dla prasy dźwigniowej), a $d$ to średnica formy serowarskiej.
* **Kryteria akceptacji:**
  1. Użytkownik wybiera średnicę formy (np. $\varnothing 14\text{ cm} \rightarrow A \approx 154\text{ cm}^2$, $\varnothing 20\text{ cm} \rightarrow A \approx 314\text{ cm}^2$).
  2. Użytkownik podaje typ prasy: Prasa bezpośrednia / grawitacyjna ($R=1$), Prasa dźwigniowa holenderska, Prasa pneumatyczna.
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
