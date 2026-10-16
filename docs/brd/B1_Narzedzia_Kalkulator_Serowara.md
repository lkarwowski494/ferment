# **FERMENT BRD 0.1 — Rozdział 7: Narzędzia Serowarskie — Kalkulator Mleka, Kultur i Podpuszczki (B1)**

> **Moduł:** `BR-SER-001` do `BR-SER-035`  
> **Kontekst dziedzinowy:** Precyzyjne dozowanie enzymów koagulujących (IMCU) i kultur bakteryjnych na litr mleka, bilans kazeinowo-wapniowy, stoper flokulacji.

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
  2. Użytkownik umieszcza na powierzchni mleka lekką zdezynfekowaną miseczkę (lub zakrętkę) i delikatnie wprawia ją w ruch obrotowy co 60 sekund.
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

---

### **BR-MOLD-001: Dobór i Geometria Formy Serowarskiej (Mold Sizing & Curd Geometry)**
* **Opis:** Obliczanie kubatury form serowarskich (cylindrycznych i prostopadłościennych), objętości gęstwy nieodprasowanej oraz weryfikacja stopnia napełnienia formy.
* **Format obliczeń:**
  * Cylindryczne: $V = \pi r^2 h$. Prostopadłościenne: $V = a \cdot b \cdot h$.
  * Przelicznik objętości skrzepu przed odciekiem: ~1.7 L objętości na 1 kg gotowego sera.
  * Baza szablonów: Kadova Gouda (1 kg, 2 kg), Forma Korycińska, Camembert, Feta/Twaróg prostokątna.
* **Kryteria akceptacji:**
  1. Wizualizacja stopnia wypełnienia (%) oraz statusu pojemności (wystarczająca vs za mała).
  2. Automatyczne rekomendowanie optymalnej formy na podstawie zadanej objętości mleka i spodziewanego plonu.
* **Persona:** P1, P2, P5, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-SER-040: Skład Biochemiczny i Klasyfikacja Codex Alimentarius (MFFB, FDM, S/M Ratio)**
* **Opis:** Silnik analityczny klasyfikujący ser według międzynarodowego standardu CODEX STAN 283-1978 oraz monitorujący krytyczną równowagę soli w fazie wodnej (`cheese-composition-engine.ts`).
* **Wzory chemiczne i biochemiczne:**
  1. **MFFB (Moisture on a Fat-Free Basis %):**
     $$MFFB = \frac{\% \text{Moisture}}{100\% - \% \text{Fat}} \times 100\%$$
     * `< 51.0%`: `EXTRA_HARD` (Parmezan, Grana Padano, Sbrinz)
     * `51.0% - 56.0%`: `HARD` (Cheddar, Dojrzała Gouda, Emmentaler)
     * `56.0% - 63.0%`: `SEMI_HARD` (Młoda Gouda, Edam, Tilsit)
     * `63.0% - 69.0%`: `SEMI_SOFT` (Ser Koryciński, Havarti, Butterkäse)
     * `> 69.0%`: `SOFT` (Feta, Camembert, Twaróg, Ricotta)
  2. **FDM (Fat in Dry Matter %):**
     $$FDM = \frac{\% \text{Fat}}{100\% - \% \text{Moisture}} \times 100\%$$
     * `HIGH_FAT` ($\ge 60\%$), `FULL_FAT` ($45–60\%$), `MEDIUM_FAT` ($25–45\%$), `LOW_FAT` ($10–25\%$), `SKIM` ($<10\%$)
  3. **Salt-in-Moisture (S/M %):**
     $$S/M = \frac{\% \text{Salt}}{\% \text{Moisture}} \times 100\%$$
     * `S/M < 4.0% (UNDER_SALTED_ACIDIC)`: Nadmierna aktywność bakterii starterowych i chymozyny; akumulacja gorzkich hydrofobowych peptydów (wada technologiczna goryczki).
     * `S/M = 4.0% - 6.0% (OPTIMAL_BALANCED)`: Idealna proteoliza i rozwój bukietu aromatycznego podczas affinage.
     * `S/M > 6.0% (OVER_SALTED_INHIBITED)`: Zahamowanie enzymów proteolitycznych, zatrzymanie dojrzewania, krucha sucha struktura.
* **Kryteria akceptacji:**
  1. Automatyczne obliczanie suchej masy, wskaźnika MFFB, FDM i relacji S/M.
  2. Prezentacja oficjalnych klas konsystencji i tłuszczowości z opisem handlowym.
  3. Alerty biochemiczne i rekomendacje technologiczne dotyczące czasu solenia.
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP/1.1.

---

### **BR-SER-025: Propagacja Zakwasu Serwatkowego & Sierroinnesto (Mother Whey Levain & Starter Propagation Engine)**
* **Opis:** Moduł modelowania biologicznej propagacji naturalnych kultur matecznych ze słodkiej, nieposolonej serwatki z poprzedniego warzenia (włoskie *sierroinnesto*, tradycyjna serwatka tatrzańska, zakwas zagrodowy) (`whey-levain-engine.ts`).
* **Kluczowe reguły biochemiczne i technologiczne:**
  1. **Profile kultur matecznych:**
     * `THERMOPHILIC_ALPINE` (Sierroinnesto alpejskie, 43°C, 20h nominalnie, $pH \in [3.40, 3.65]$, *S. thermophilus*, *L. delbrueckii*, *L. helveticus*).
     * `MESOPHILIC_FARMHOUSE` (Zagrodowe mezofilne, 30°C, 24h nominalnie, $pH \in [3.80, 4.10]$, *L. lactis*, *Leuconostoc*).
     * `HIGHLAND_SMOKED` (Serwatka na Oscypek i Gołkę, 37°C, 18h, $pH \in [3.60, 3.90]$, *L. plantarum*, *S. thermophilus*).
     * `VEGETABLE_BRINE_BACKSLOP` (Pasażowanie solanki warzywnej, 20°C, 24h, $pH \in [3.40, 3.80]$).
  2. **Wyliczanie dozy inokulacyjnej do mleka:**
     * Dozowanie $\% \text{ v/v}$ na podstawie zaplanowanej objętości mleka (np. $2.5\%$ dla alpejskich $= 250\text{ ml}$ na $10\text{L}$ mleka, $2.0\%$ dla mezofilnych).
  3. **Ocena dojrzałości technologicznej:**
     * Weryfikacja fazy według mierzonego pH: `WARMING_UP` ($pH > 4.2$), `ACTIVE_ACIDIFYING` ($pH > 3.65$), `PEAK_RIPE` ($pH \in [3.40, 3.65]$ — moment zadania do mleka), `OVER_ACIDIFIED` ($pH < 3.40$).
  4. **Dozór witalności pasażu i ochrona przed bakteriofagami (Phage Drift Guard):**
     * Monitorowanie liczby kolejnych generacji serwatki ($G_1, G_2, \dots$).
     * Generacja $\ge 11$: status `VIGILANCE_MONITOR` (ostrzeżenie o konieczności obserwacji czasu koagulacji).
     * Generacja $\ge 18$: status `DEGENERATION_RESET_REQUIRED` (krytyczny nakaz zresetowania matki z surowego mleka lub czystych kultur ze względu na presję bakteriofagów serowarskich).
* **Kryteria akceptacji:**
  1. Karta zintegrowana w trybie Serowarstwo Pro Accordion.
  2. Pełne testy jednostkowe (`tests/core/whey-levain-engine.test.ts`).
* **Persona:** P1, P2, P5, P6.
* **Priorytet:** MUST | **Etap:** MVP/1.1.

---

### **BR-SER-036: Morfologia Gatunkowa Mleka & Kinetyka Koagulacji (Milk Species Coagulation & Proteolysis Profile Engine)**
* **Opis:** Fizykochemiczny model różnic gatunkowych mleka (krowie, kozie, owcze, bawole) wpływających na strukturę żelu kazeinowego, wielkość miceli i kuleczek tłuszczowych, dawkę podpuszczki, mnożnik flokulacji i uzysk sera (`milk-species-profile.ts`).
* **Profile gatunkowe w modelu:**
  1. **Mleko krowie (*Bos taurus*):**
     * Tłuszcz: 3.8–4.4%, Białko: 3.2–3.5%, Stosunek kazeina/serwatka: 80:20.
     * Frakcja wiodąca: $\alpha_{s1}$-kazeina (mocny, sprężysty żel).
     * Średnica kuleczek tłuszczu: 4.0 µm. Wydajność świeża: ~10.5%.
     * Mnożnik podpuszczki: 1.0x, Mnożnik flokulacji: 1.0x, Temp. optymalna: 31–33°C.
  2. **Mleko kozie (*Capra hircus*):**
     * Tłuszcz: 3.6–4.6%, Białko: 3.1–3.6%, Stosunek kazeina/serwatka: 78:22.
     * Frakcja wiodąca: $\beta$-kazeina (brak lub znikoma ilość $\alpha_{s1}$, co daje bardzo miękki, podatny na rozpad skrzep *friable curd*).
     * Średnica kuleczek tłuszczu: 3.2 µm (naturalna homogenizacja, brak wyraźnej warstwy śmietanki).
     * Wysoka lipoliza: obfitość kwasów C6 (kapronowy), C8 (kaprylowy) i C10 (kaprynowy).
     * Mnożnik flokulacji: 1.15x (wydłużenie czasu wiązania żelu), Temp. optymalna: 29–31°C (ochrona przed zacięciem termicznym).
  3. **Mleko owcze (*Ovis aries*):**
     * Tłuszcz: 6.5–8.5%, Białko: 5.5–6.8%, Sucha masa: 18–20% (podwójny ekstrakt!).
     * Ekstremalnie bogate w micele kazeinowe i wapń koloidalny (190 mg/100g).
     * Błyskawiczna koagulacja: zalecana redukcja dawki podpuszczki o 25% (26.3 IMCU/L zamiast 35 IMCU/L) oraz obniżony mnożnik flokulacji 0.85x w celu uniknięcia gumowatości.
     * Wybitny uzysk sera: ~20.0% świeżego skrzepu (prawie dwukrotnie więcej niż z mleka krowiego).
  4. **Mleko bawole (*Bubalus bubalis*):**
     * Tłuszcz: 7.5–9.2%, Białko: 4.2–4.8%, Wapń: 180 mg/100g.
     * Średnica kuleczek: 5.0 µm. Porcelanowo-biały miąższ (brak $\beta$-karotenu).
     * Niezrównana termoplastyczność struktury micelarnej (idealna do ugniatania i wyciągania w gorącej wodzie dla Mozzarella di Bufala / pasta filata).
     * Wydajność świeża: ~17.0%, Temp. optymalna zaprawiania: 34–36°C.
* **Kryteria akceptacji:**
  1. Wybór gatunku mleka w głównym selektorze trybu serowarskiego (Krowie, Kozie, Owcze, Bawole).
  2. Karta profilu w akordeonie Pro z dynamicznymi wskazówkami technologicznymi i wyliczeniem odzysku Ricotty.
  3. Testy jednostkowe (`tests/core/milk-species-profile.test.ts`).
* **Persona:** P1, P4, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP/1.1.



