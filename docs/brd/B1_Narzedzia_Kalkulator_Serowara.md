# **SEROWAR BRD 0.1 — Rozdział 7: Narzędzia Serowarskie — Kalkulator Mleka, Kultur i Podpuszczki (B1)**

> **Moduł:** `BR-SER-001` do `BR-SER-035`  
> **Kontekst dziedzinowy:** Precyzyjne dozowanie enzymów koagulujących (IMCU wg IDF 157) i kultur bakteryjnych na litr mleka, gatunki mleka (krowa, koza, owca, bawół), bilans kazeinowo-wapniowy, stoper flokulacji.

---

### **BR-SER-001: Konfigurator Surowca Mlecznego**
* **Opis:** Użytkownik definiuje parametry wsadu mlecznego przed rozpoczęciem sesji serowarskiej.
* **Format danych wejściowych:**
  * Gatunek: Krowie (domyślny), Kozie, Owcze, Bawole, Mieszane.
  * Pochodzenie i obróbka: Surowe zagrodowe prosto z udoju (niepasteryzowane), Pasteryzowane niskotemperaturowo (LTLT 63°C / HTST 72°C), Pasteryzowane sklepowe (mikrofiltrowane).
  * Objętość: wprowadzana z klawiatury numerycznej lub suwakiem (zakres: 1.0 L do 200.0 L, skok co 0.5 L).
  * Opcjonalnie: zmierzona zawartość tłuszczu (%) i białka (%) oraz pH początkowe (domyślnie 6.60–6.70 dla świeżego mleka krowiego).
* **Kryteria akceptacji:**
  1. Przy wyborze mleka sklepowego/pasteryzowanego system automatycznie aktywuje wymaganie suplementacji jonów wapnia ($CaCl_2$) (BR-SER-004).
  2. Próba ustawienia mleka UHT powoduje zablokowanie przycisku „Dalej” i wyświetlenie okna modalnego z wyjaśnieniem: *„Mleko UHT zostało poddane temperaturze > 135°C, co trwale denaturuje białka serwatkowe, które blokują micele kazeinowe. Z mleka UHT nie powstanie zwięzły skrzep podpuszczkowy.”*
* **Persona:** P1, P4, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-SER-004: Kalkulator Suplementacji Chlorku Wapnia ($CaCl_2$)**
* **Opis:** Obliczanie dokładnej dawki $CaCl_2$ w celu odbudowy struktury mostków wapniowych kazeiny zniszczonych w procesie pasteryzacji i homogenizacji.
* **Format obliczeń:**
  * Postać surowca: Roztwór płynny 33% (najpopularniejszy w handlu serowarskim) lub Bezwodny proszek $CaCl_2$ (cz.d.a.).
  * Formuła bazowa: $0.20\text{ g}$ bezwodnego $CaCl_2$ na 1 litr mleka pasteryzowanego (lub $0.60\text{ ml}$ roztworu 33% na 10 L).
  * Dla mleka surowego zimowego: $0.10\text{ g/L}$. Dla mleka surowego letniego: $0.00\text{ g/L}$ (brak potrzeby).
* **Kryteria akceptacji:**
  1. Wyświetlenie dawki w mililitrach, kroplach (przyjmując 1 ml ≈ 20 kropli) oraz gramach.
  2. Prezentacja instrukcji rozpuszczenia $CaCl_2$ w 50 ml chłodnej, niechlorowanej wody przed wlaniem do podgrzanego mleka.
  3. Blokada bezpieczeństwa: ostrzeżenie, jeśli dawka przekroczy $0.40\text{ g/L}$ (ryzyko gorzkiego smaku sera).
* **Persona:** P1, P2, P5.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-SER-008: Uniwersalny Przelicznik Mocy Podpuszczki (IMCU vs 1:X)**
* **Opis:** Wyliczanie objętości lub masy podpuszczki na podstawie jej zdeklarowanej aktywności enzymatycznej.
* **Format przeliczania:**
  * Standard międzynarodowy: IMCU (International Milk Clotting Units, wg ISO 11815 / IDF 157). Typowe stężenia: 150–200 IMCU/ml dla podpuszczek mikrobiologicznych (*Rhizomucor miehei*), 500–750 IMCU/ml dla naturalnych chymozyn cielęcych.
  * Standard tradycyjny: stosunek krzepnięcia (np. 1:10 000 oznacza, że 1 ml podpuszczki ścina 10 000 ml mleka w 35°C w 40 min).
  * Formuła dawkowania:
    $$V_{podpuszczki} [ml] = \frac{V_{mleka} [L] \times \text{Docelowe IMCU/L}}{\text{Moc podpuszczki [IMCU/ml]}}$$
    Gdzie docelowe zapotrzebowanie wynosi typowo 30–40 IMCU na 1 litr mleka dla serów półtwardych.
* **Kryteria akceptacji:**
  1. Użytkownik może wybrać profil podpuszczki z listy predefiniowanej (np. *Chymosina Cielęca 90/10 180 IMCU*, *Fromase 220 TL*, *Beaugel 5*) lub wpisać własną wartość z etykiety.
  2. Wyliczona objętość prezentowana jest z dokładnością do 0.05 ml oraz w kroplach.
  3. Prezentacja reguły technicznej: podpuszczkę należy rozcieńczyć w 20–50 ml chłodnej wody destylowanej lub przegotowanej niechlorowanej na 5 minut przed dodaniem.
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-SER-012: Asystent Metody Flokulacji (Flocculation Multiplier)**
* **Opis:** Interaktywny stoper pomiaru czasu flokulacji i wyznaczania optymalnego momentu cięcia skrzepu.
* **Logika procesu:**
  1. Użytkownik wlewa rozcieńczoną podpuszczkę, miesza mleko przez 60 sekund ruchem góra-dół i wciska przycisk **„Start Zaprawiania ($t_0$)”**.
  2. Użytkownik umieszcza na powierzchni mleka lekką zdezynfekowaną miseczkę i delikatnie wprawia ją w ruch obrotowy co 60 sekund.
  3. W momencie, gdy mleko ulega zżelowaniu i gwałtownie zatrzymuje obrót miseczki, użytkownik klika **„Punkt Flokulacji ($t_f$)”**.
  4. System rejestruje czas flokulacji $t_f$ (typowo 10–18 minut).
  5. System mnoży $t_f$ przez mnożnik flokulacji $M$ dedykowany dla wybranego stylu sera:
     $$t_{ciecia} = t_0 + (t_f \times M)$$
  6. Aplikacja uruchamia odliczanie do momentu cięcia skrzepu z alertem dźwiękowym i haptics.
* **Mnożniki flokulacji w bazie:**
  * Sery alpejskie i twarde (Gruyère, Grana, Parmesan): $M = 2.0 - 2.5$.
  * Sery półtwarde i twarde prasowane (Cheddar, Gouda, Tilsit): $M = 3.0 - 3.5$.
  * Sery z porostem białej pleśni (Camembert, Brie): $M = 4.0 - 5.0$.
  * Sery miękkie kwasowo-podpuszczkowe (Feta, Koryciński): $M = 5.0 - 6.0$.
* **Kryteria akceptacji:**
  1. Jeśli $t_f < 8\text{ min}$, aplikacja wyświetla ostrzeżenie: *„Flokulacja zaszła zbyt szybko (nadmiar podpuszczki, wysoka kwasowość lub za wysoka temperatura). Skrzep może być gumowaty.”*
  2. Jeśli $t_f > 22\text{ min}$, aplikacja wyświetla ostrzeżenie: *„Flokulacja opóźniona (osłabiona podpuszczka, niska temperatura lub brak jonów wapnia). Wydłużono czas koagulacji.”*
* **Persona:** P1, P2, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-SER-015: Test Czystego Złomu (Clean Break Guide)**
* **Opis:** Sensoryczna weryfikacja gotowości skrzepu przed wbiciem harfy serowarskiej.
* **Kryteria akceptacji:**
  * Wyświetlenie ilustracji i instrukcji: wykonanie nacięcia nożem na głębokość 3 cm i podważenie płaską krawędzią. Skrzep powinien pęknąć równo jak szkło, a w powstałej szczelinie powinna zebrać się klarowna, żółto-zielonkawa serwatka (brak mętnego mleka).
  * Przycisk „Skrzep gotowy — tnij” lub „Odczekaj jeszcze 5 minut (+5m)”.
* **Persona:** P1, P4, P5.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-SER-020…035: Zarządzanie Kulturami Starterowymi DVI**
* Baza szczepów: *Lactococcus lactis* subsp. *lactis*, *L. lactis* subsp. *cremoris*, *L. diacetylactis*, *Streptococcus thermophilus*, *Lactobacillus helveticus*, *L. delbrueckii*.
* Wyliczanie czasu przed-zakwaszania (pre-ripening) w temperaturze inokulacji (30–38°C) przez 30–60 minut przed dodaniem podpuszczki.
