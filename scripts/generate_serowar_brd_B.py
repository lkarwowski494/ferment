# -*- coding: utf-8 -*-
"""
Generator for SEROWAR BRD 0.1 - Part B (Dairy Craft Tools & Requirements)
Apps4Brew Studio | October 2026
"""
import os

OUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "docs", "brd")
os.makedirs(OUT_DIR, exist_ok=True)

# -------------------------------------------------------------
# B1_Narzedzia_Kalkulator_Serowara.md
# -------------------------------------------------------------
fb1 = os.path.join(OUT_DIR, "B1_Narzedzia_Kalkulator_Serowara.md")
with open(fb1, "w", encoding="utf-8") as f:
    f.write("""# **SEROWAR BRD 0.1 — Rozdział 7: Narzędzia Serowarskie — Kalkulator Mleka, Kultur i Podpuszczki (B1)**

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
  * Formuła bazowa: $0.20\\text{ g}$ bezwodnego $CaCl_2$ na 1 litr mleka pasteryzowanego (lub $0.60\\text{ ml}$ roztworu 33% na 10 L).
  * Dla mleka surowego zimowego: $0.10\\text{ g/L}$. Dla mleka surowego letniego: $0.00\\text{ g/L}$ (brak potrzeby).
* **Kryteria akceptacji:**
  1. Wyświetlenie dawki w mililitrach, kroplach (przyjmując 1 ml ≈ 20 kropli) oraz gramach.
  2. Prezentacja instrukcji rozpuszczenia $CaCl_2$ w 50 ml chłodnej, niechlorowanej wody przed wlaniem do podgrzanego mleka.
  3. Blokada bezpieczeństwa: ostrzeżenie, jeśli dawka przekroczy $0.40\\text{ g/L}$ (ryzyko gorzkiego smaku sera).
* **Persona:** P1, P2, P5.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-SER-008: Uniwersalny Przelicznik Mocy Podpuszczki (IMCU vs 1:X)**
* **Opis:** Wyliczanie objętości lub masy podpuszczki na podstawie jej zdeklarowanej aktywności enzymatycznej.
* **Format przeliczania:**
  * Standard międzynarodowy: IMCU (International Milk Clotting Units, wg ISO 11815 / IDF 157). Typowe stężenia: 150–200 IMCU/ml dla podpuszczek mikrobiologicznych (*Rhizomucor miehei*), 500–750 IMCU/ml dla naturalnych chymozyn cielęcych.
  * Standard tradycyjny: stosunek krzepnięcia (np. 1:10 000 oznacza, że 1 ml podpuszczki ścina 10 000 ml mleka w 35°C w 40 min).
  * Formuła dawkowania:
    $$V_{podpuszczki} [ml] = \\frac{V_{mleka} [L] \\times \\text{Docelowe IMCU/L}}{\\text{Moc podpuszczki [IMCU/ml]}}$$
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
     $$t_{ciecia} = t_0 + (t_f \\times M)$$
  6. Aplikacja uruchamia odliczanie do momentu cięcia skrzepu z alertem dźwiękowym i haptics.
* **Mnożniki flokulacji w bazie:**
  * Sery alpejskie i twarde (Gruyère, Grana, Parmesan): $M = 2.0 - 2.5$.
  * Sery półtwarde i twarde prasowane (Cheddar, Gouda, Tilsit): $M = 3.0 - 3.5$.
  * Sery z porostem białej pleśni (Camembert, Brie): $M = 4.0 - 5.0$.
  * Sery miękkie kwasowo-podpuszczkowe (Feta, Koryciński): $M = 5.0 - 6.0$.
* **Kryteria akceptacji:**
  1. Jeśli $t_f < 8\\text{ min}$, aplikacja wyświetla ostrzeżenie: *„Flokulacja zaszła zbyt szybko (nadmiar podpuszczki, wysoka kwasowość lub za wysoka temperatura). Skrzep może być gumowaty.”*
  2. Jeśli $t_f > 22\\text{ min}$, aplikacja wyświetla ostrzeżenie: *„Flokulacja opóźniona (osłabiona podpuszczka, niska temperatura lub brak jonów wapnia). Wydłużono czas koagulacji.”*
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
""")

print("Zapisano B1_Narzedzia_Kalkulator_Serowara.md")

# -------------------------------------------------------------
# B2_Narzedzia_Obrobka_Skrzepu_Prasowanie.md
# -------------------------------------------------------------
fb2 = os.path.join(OUT_DIR, "B2_Narzedzia_Obrobka_Skrzepu_Prasowanie.md")
with open(fb2, "w", encoding="utf-8") as f:
    f.write("""# **SEROWAR BRD 0.1 — Rozdział 7: Narzędzia Serowarskie — Obróbka Skrzepu i Prasowanie (B2)**

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
     $$t_{min} [min] = (T_{docelowa} - T_{poczatkowa}) \\times 2.0\\text{ min/°C}$$
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
  Nacisk jednostkowy $P$ zależy od pola powierzchni formy $A = \\pi \\times r^2$ oraz ramienia dźwigni w prasach holenderskich:
  $$P [kg/cm^2] = \\frac{m_{obciaznika} [kg] \\times R}{\\pi \\times (\\frac{d}{2})^2 [cm^2]}$$
  Gdzie $R$ to przełożenie dźwigni ($R = 1.0$ dla nacisku bezpośredniego, $R = 3.0 - 5.0$ dla prasy dźwigniowej), a $d$ to średnica formy serowarskiej.
* **Kryteria akceptacji:**
  1. Użytkownik wybiera średnicę formy (np. $\\varnothing 14\\text{ cm} \\rightarrow A \\approx 154\\text{ cm}^2$, $\\varnothing 20\\text{ cm} \\rightarrow A \\approx 314\\text{ cm}^2$).
  2. Użytkownik podaje typ prasy: Prasa bezpośrednia / grawitacyjna ($R=1$), Prasa dźwigniowa holenderska, Prasa pneumatyczna.
  3. System generuje dokładną wagę obciążnika wymaganą do uzyskania zadanego nacisku technologicznego (np. 0.05, 0.20, 0.50, 1.00 kg/cm²).
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-CURD-020: Harmonogram Etapów Prasowania i Obracania**
* **Opis:** Sekwencja czasowa stopniowego zwiększania nacisku z powiadomieniami o odwróceniu krążka w chuście serowarskiej.
* **Wzorcowy cykl prasowania (np. Cheddar / Gouda 2 kg):**
  1. Etap 1: 15 minut przy nacisku lekkim ($0.2\\text{ kg/cm}^2$). Cel: ułożenie ziaren bez zamykania kanałów odpływu serwatki. Powiadomienie: *„Wyjmij ser, obróć, wygładź chustę.”*
  2. Etap 2: 30 minut przy nacisku średnim ($0.5\\text{ kg/cm}^2$). Powiadomienie: *„Drugi obrót sera w formie.”*
  3. Etap 3: 2 godziny przy nacisku mocnym ($1.0\\text{ kg/cm}^2$). Powiadomienie: *„Trzeci obrót.”*
  4. Etap 4: 12–16 godzin (przez noc) przy nacisku docelowym ($1.5 - 2.0\\text{ kg/cm}^2$). Powiadomienie: *„Zakończ prasowanie. Zmierz pH i wagę przed kąpielą solankową.”*
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.
""")

print("Zapisano B2_Narzedzia_Obrobka_Skrzepu_Prasowanie.md")

# -------------------------------------------------------------
# B3_Narzedzia_Solenie_i_Solanki.md
# -------------------------------------------------------------
fb3 = os.path.join(OUT_DIR, "B3_Narzedzia_Solenie_i_Solanki.md")
with open(fb3, "w", encoding="utf-8") as f:
    f.write("""# **SEROWAR BRD 0.1 — Rozdział 7: Narzędzia Serowarskie — Solenie i Kąpiele Solankowe (B3)**

> **Moduł:** `BR-SOL-001` do `BR-SOL-025`  
> **Kontekst dziedzinowy:** Chemia i gęstość nasyconej solanki serowarskiej, korekty termiczne hydrometru (°Baumé / Salometer), równowaga osmotyczna wapnia i kwasowości, obliczanie czasu kąpieli.

---

### **BR-SOL-001: Kalkulator Składu Nasyconej Solanki Serowarskiej**
* **Opis:** Precyzyjne przygotowanie bezpiecznej kąpieli solankowej o stężeniu 18–22% NaCl.
* **Formuła chemiczna (na 10 litrów wody):**
  * Sól niejodowana czysta (NaCl): $2.20\\text{ kg} - 2.50\\text{ kg}$.
  * Chlorek wapnia ($CaCl_2$ 33%): $15\\text{ ml}$ (lub $5\\text{ g}$ bezwodnego). Cel: zapobieganie wypłukiwaniu jonów wapnia ze skórki sera.
  * Zakwaszenie buforowe: $5 - 10\\text{ ml}$ kwasu mlekowego 80% lub $150\\text{ ml}$ kwaśnej serwatki. Cel: wyrównanie pH solanki do pH sera (pH 5.20–5.40).
* **Kryteria akceptacji:**
  1. Kalkulator przelicza proporcje na dowolną objętość naczynia solankowego (od 2L do 50L).
  2. Wyraźne ostrzeżenie przed użyciem soli jodowanej z antyzbrylaczem (żelazocyjanek potasu $E536$), który hamuje florę bakteryjną i plami skórkę.
* **Persona:** P1, P2, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-SOL-005: Przelicznik Gęstości i Konwerter Hydrometryczny**
* **Opis:** Obsługa pomiarów gęstości solanki za pomocą areometru, solomierza lub wagi laboratoryjnej.
* **Tablica korelacji w algorytmie (przy temp. 15°C):**
  * $18\\%\\ NaCl \\rightarrow$ gęstość $1.135\\text{ g/cm}^3$ | $17.2^\\circ\\text{Bé}$ | $70^\\circ\\text{Salometer}$.
  * $20\\%\\ NaCl \\rightarrow$ gęstość $1.152\\text{ g/cm}^3$ | $19.1^\\circ\\text{Bé}$ | $78^\\circ\\text{Salometer}$.
  * $22\\%\\ NaCl \\rightarrow$ gęstość $1.169\\text{ g/cm}^3$ | $21.0^\\circ\\text{Bé}$ | $86^\\circ\\text{Salometer}$.
  * $24\\%\\ NaCl$ (nasycona) $\\rightarrow$ gęstość $1.186\\text{ g/cm}^3$ | $22.8^\\circ\\text{Bé}$ | $95^\\circ\\text{Salometer}$.
* **Kryteria akceptacji:**
  * Automatyczna korekta temperatury odczytu: jeśli solanka ma temperaturę 10°C, a aerometr skalowano na 20°C, algorytm wprowadza poprawkę gęstości.
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-SOL-010: Algorytm Czasu Kąpieli Solankowej (Brine Timer)**
* **Opis:** Obliczanie optymalnego czasu przebywania sera w solance na podstawie jego masy, geometrii i docelowego zasolenia.
* **Formuła dyfuzji soli Ficka (RD-08):**
  Czas kąpieli $t$ dla sera twardego/półtwardego w nasyconej solance (20% NaCl, 12°C):
  $$t [h] = m_{sera} [kg] \\times K_{stylu} \\times \\left( \\frac{grubosc [cm]}{wysokosc_{ref} [cm]} \\right)$$
  Gdzie współczynnik stylu wynosi średnio:
  * Sery miękkie (Feta, Halloumi): $K = 2.0 - 3.0\\text{ h/kg}$.
  * Gouda, Edam, Tylżycki: $K = 4.0 - 5.0\\text{ h/kg}$.
  * Cheddar, sery twarde: $K = 6.0\\text{ h/kg}$.
* **Kryteria akceptacji:**
  1. Uruchomienie odliczania z powiadomieniem w połowie czasu: *„Obróć krążek w solance”*.
  2. Powiadomienie krytyczne z dźwiękiem alarmowym po upływie czasu: *„Wyjmij ser z solanki i przenieś do suszenia skórki.”*
* **Persona:** P1, P4, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-SOL-015: Kalkulator Solenia z Ręki (Dry Salting)**
* **Opis:** Dozowanie soli dla serów niesolonych w kąpieli (np. Camembert, Roquefort, sery kwasowe).
* **Kryteria akceptacji:**
  * Obliczenie dawki 1.8% do 2.5% masy zważonego krążka.
  * Rozpisanie na 2 lub 3 równe porcje: aplikacja na górę i boki w dobie 1, obrót i aplikacja na dół w dobie 2.
* **Persona:** P1, P2.
* **Priorytet:** MUST | **Etap:** MVP.
""")

print("Zapisano B3_Narzedzia_Solenie_i_Solanki.md")

# -------------------------------------------------------------
# B4_Narzedzia_Cave_Log_Dozor_Dojrzewania.md
# -------------------------------------------------------------
fb4 = os.path.join(OUT_DIR, "B4_Narzedzia_Cave_Log_Dozor_Dojrzewania.md")
with open(fb4, "w", encoding="utf-8") as f:
    f.write("""# **SEROWAR BRD 0.1 — Rozdział 7: Narzędzia Serowarskie — Cave Log i Dziennik Dojrzewania (B4)**

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
     $$\\alpha(T, RH) = \\frac{17.27 \\times T}{237.7 + T} + \\ln\\left(\\frac{RH}{100}\\right), \\quad T_{dp} = \\frac{237.7 \\times \\alpha}{17.27 - \\alpha}$$
  3. **Alert kondensacji:** Jeśli temperatura krążka sera jest niższa niż $T_{dp}$, aplikacja generuje ostrzeżenie: *„Uwaga: na powierzchni sera skrapla się woda. Ryzyko rozwoju czarnej pleśni Mucor. Zwiększ cyrkulację powietrza!”*
  4. **Alert przesuszenia:** Jeśli RH spadnie poniżej 80% dla serów z naturalną skórką, system generuje alert pękania skórki.
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.
""")

print("Zapisano B4_Narzedzia_Cave_Log_Dozor_Dojrzewania.md")

# -------------------------------------------------------------
# B5_Narzedzia_Twarogi_i_Sery_Swieze.md
# -------------------------------------------------------------
fb5 = os.path.join(OUT_DIR, "B5_Narzedzia_Twarogi_i_Sery_Swieze.md")
with open(fb5, "w", encoding="utf-8") as f:
    f.write("""# **SEROWAR BRD 0.1 — Rozdział 7: Narzędzia — Twarogi Klinkowe i Sery Świeże (B5)**

> **Moduł:** `BR-TWAR-001` do `BR-TWAR-035`  
> **Kontekst dziedzinowy:** Kinetyka koagulacji kwasowej kazeiny w punkcie izoelektrycznym ($pH = 4.6$), rampa łagodnego dogrzewania skrzepu (35–45°C), formowanie tradycyjnego klinka w chuście serowarskiej, odciek grawitacyjny, sery świeże labneh, paneer/chhena i sery kwasowo-podpuszczkowe.

---

### **BR-TWAR-001: Monitor Ukwaszania Mleka i Punktu Izoelektrycznego Kazeiny ($pH = 4.6$)**
* **Opis:** Prowadzenie procesu naturalnego ukwaszania mleka surowego lub szczepionego kulturami mezofilnymi LD (*Flora Danica*, *CHN-19*) w celu osiągnięcia optymalnego skrzepu kwasowego.
* **Biochemia procesu:** W miarę wytwarzania kwasu L-mlekowego przez bakterie fermentacji mlekowej, pH mleka spada z wyjściowego 6.6–6.7 do punktu izoelektrycznego kazeiny ($pI = 4.60$). Przy tej kwasowości micele kazeinowe tracą ujemny ładunek powierzchniowy i łączą się w trójwymiarową, delikatną siatkę żelu kwasowego.
* **Kryteria akceptacji:**
  1. Wybór metody ukwaszania: Naturalne zsiadanie mleka surowego (20–22°C przez 24–36h) lub Szczepienie kulturami mezofilnymi z dodatkiem odrobiny kwaśnego mleka/maślanki.
  2. Wskaźnik kwasowości sensorycznej: test zwięzłości skrzepu (łyżka postawiona w naczyniu zachowuje stabilność, brak wydzielania gazu).
* **Persona:** P2, P4, P5.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-TWAR-006: Asystent Rampy Łagodnego Dogrzewania Skrzepu Twarogowego**
* **Opis:** Dynamiczny nadzór nad powolnym podgrzewaniem zsiadłego mleka w garnku z grubym dnem lub płaszczem wodnym w oknie 35–45°C.
* **Zasada technologiczna:**
  * Jeśli temperatura skrzepu $< 35^\\circ C$: synereza jest niewystarczająca, skrzep pozostaje mazisty, a drobinki kazeiny uciekają przez oczka chusty wraz z serwatką (ogromna strata surowca).
  * Jeśli temperatura skrzepu $> 45^\\circ C$: dochodzi do gwałtownego skurczu miceli kazeiny, całkowitego wyciśnięcia wody i powstania twarogu twardego, suchego i grudkowatego jak kreda.
  * **Optymalne okno:** 38–42°C (delikatny, kremowy twaróg tradycyjny).
* **Kryteria akceptacji:**
  1. Stoper prowadzi użytkownika przez powolne ogrzewanie z prędkością nie większą niż 1°C na 3 minuty.
  2. Czerwony alarm dźwiękowy przy przekroczeniu 44°C: *„Natychmiast zdejmij garnek z ognia! Ryzyko stwardnienia i skredowacenia twarogu!”*
* **Persona:** P2, P4, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-TWAR-010: Formowanie Tradycyjnego Klinka i Odciek Grawitacyjny**
* **Opis:** Asystent przekładania skrzepu do trójkątnej chusty serowarskiej (klinka) i grawitacyjnego odsączania serwatki.
* **Fazy ociekania:**
  * Faza 1: Swobodny odciek w podwieszonej chuście (1–2 godziny) — odzyskanie 70% serwatki do osobnego garnka na Ricottę/Brunost.
  * Faza 2: Delikatne dociśnięcie (samonacisk lub deseczka 0.5–1.0 kg) przez 2–4 godziny w celu uzyskania zwartej struktury klinka.
* **Kryteria akceptacji:**
  * Kalkulator końcowej wilgotności: twaróg wilgotny (odciek 2h), twaróg półtłusty zwarty (odciek 4h + lekki nacisk).
* **Persona:** P2, P4.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-TWAR-015: Moduł Bliskowschodniego Serka Labneh**
* **Opis:** Procedura wytwarzania aksamitnego serka Labneh z gęstego jogurtu naturalnego.
* **Parametry technologiczne:**
  * Odsączanie jogurtu z dodatkiem 1.0% soli w gęstym płótnie przez 12–24h w chłodzie (4–8°C).
  * Ubytek masy: 50–60% w postaci przejrzystej serwatki kwasowej.
  * Formowanie kulek serowych i konserwacja w oliwie z oliwek z dodatkiem zataru, czarnuszki i suszonych pomidorów.
* **Persona:** P2, P3.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-TWAR-020: Paneer & Chhena — Koagulacja Termiczno-Kwasowa Gorącego Mleka**
* **Opis:** Receptura i kalkulator dawek kwasu dla tradycyjnych indyjskich serów świeżych z gorącego mleka.
* **Matematyka koagulacji:**
  * Mleko podgrzane do temperatury 82–88°C.
  * Dodatek kwasu (kwas cytrynowy, sok z cytryny lub kwaśna serwatka): dawka przeliczana na litr mleka w celu uzyskania żółto-zielonkawej, przejrzystej serwatki.
  * Błyskawiczne płukanie skrzepu zimną wodą w celu usunięcia posmaku kwasu i prasowanie pod obciążeniem 2–4 kg przez 30 minut.
* **Persona:** P2, P5.
* **Priorytet:** MUST | **Etap:** MVP.
""")

print("Zapisano B5_Narzedzia_Twarogi_i_Sery_Swieze.md")

# -------------------------------------------------------------
# B6_Narzedzia_Napoje_Mleczne_Maslo_Ghee.md
# -------------------------------------------------------------
fb6 = os.path.join(OUT_DIR, "B6_Narzedzia_Napoje_Mleczne_Maslo_Ghee.md")
with open(fb6, "w", encoding="utf-8") as f:
    f.write("""# **SEROWAR BRD 0.1 — Rozdział 7: Narzędzia — Masielnictwo, Ghee, Napoje Mleczne i Serwatka (B6)**

> **Moduł:** `BR-DAIRY-001` do `BR-DAIRY-035`  
> **Kontekst dziedzinowy:** Masielnictwo rzemieślnicze, okno temperaturowe zmaślania śmietanki (10–14°C), inwersja emulsji tłuszczowej O/W -> W/O, płukanie wodą lodową, wyciskanie maślanki, wytapianie ghee i masła klarowanego (250°C), fermentacja termofilna jogurtu, tradycyjny kefir na ziarnach grzybka tybetańskiego oraz zamknięty obieg serwatki (Ricotta i Brunost).

---

### **BR-DAIRY-001: Kalkulator Zmaślania Śmietanki i Bilansu Tłuszczowego**
* **Opis:** Modelowanie wydajności masła na podstawie objętości i zawartości tłuszczu w śmietance (śmietana 30%, 36%, 42%).
* **Formuła bilansu tłuszczowego (RD-27):**
  $$m_{masla} [g] = \\frac{m_{smietanki} [g] \\times (\\%Fat_{smietanka} / 100) \\times \\eta_{yield}}{\\%Fat_{maslo} / 100}$$
  Gdzie $\\eta_{yield} \\approx 0.98$ (strata ok. 2% tłuszczu przechodzącego do maślanki), a $\%Fat_{maslo} = 82.5\\%$ (standard rzemieślniczego masła ekstra).
  *Przykład:* 1000 g śmietanki 36% daje ok. $1000 \\times 0.36 \\times 0.98 / 0.825 = 427.6\\text{ g}$ masła oraz ok. 570 g świeżej maślanki.
* **Kryteria akceptacji:**
  1. Wynik podawany w gramach masła i mililitrach maślanki z dokładnością do 1 g.
  2. Wybór typu śmietany: Słodka (Sweet Cream) lub Fermentowana/Ukwaszona mezofilnie (Cultured Cream / Crème Fraîche).
* **Persona:** P2, P4, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-DAIRY-005: Asystent Okna Temperaturowego Zmaślania (10–14°C)**
* **Opis:** Ścisły nadzór nad temperaturą śmietanki przed wlaniem do masielnicy lub miksera.
* **Fizyka krystalizacji tłuszczu mlecznego:**
  * Jeśli $T > 15^\\circ C$: frakcja ciekła tłuszczu przeważa nad kryształami stałymi. Ziarna masła ulegają rozmazaniu, emulsja nie rozbija się prawidłowo, a duża część tłuszczu ucieka do maślanki. Masło jest maziste i nietrwałe.
  * Jeśli $T < 8^\\circ C$: tłuszcz jest zbyt twardy, czas ubijania wydłuża się do kilkudziesięciu minut.
  * **Okno rekomendowane:** 10–12°C latem (gdy krowy jedzą zielonkę bogatą w nienasycone kwasy tłuszczowe) oraz 12–14°C zimą (gdy pasza sucha zwiększa udział nasyconego kwasu palmitynowego i stearynowego).
* **Kryteria akceptacji:**
  * Weryfikacja temperatury termometrem z alertem gotowości do zmaślania.
* **Persona:** P2, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-DAIRY-010: Procedura Płukania Wodą Lodową i Mechanicznego Wyciskania Maślanki**
* **Opis:** Kluczowy etap decydujący o trwałości masła i zabezpieczeniu przed jełczeniem hydrolitycznym.
* **Instrukcja technologiczna:**
  1. Odcedzenie ziaren masła od maślanki na sicie.
  2. Zalanie ziaren wodą lodową ($< 5^\\circ C$) i delikatne ugniatanie łyżką serowarską. Odlanie mętnej wody.
  3. Powtórzenie płukania 2–3 razy, aż woda płucząca będzie idealnie krystaliczna.
  4. Przełożenie masła na bukową deskę serowarską i ugniatanie łopatkami w celu mechanicznego wyciśnięcia uwięzionych mikrokropelek maślanki.
* **Kryteria akceptacji:**
  * Rejestracja liczby cykli płukania i opcjonalny kalkulator solenia masła (1.0–1.5% soli w masie).
* **Persona:** P2, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-DAIRY-015: Wytapianie Rzemieślniczego Ghee i Masła Klarowanego**
* **Opis:** Prowadzenie procesu powolnego wytapiania czystego tłuszczu mlecznego (bezwodnego tłuszczu mlecznego AMF).
* **Fazy termiczne wytapiania:**
  1. Topnienie masła w temperaturze 85–90°C.
  2. Odparowywanie wody (ok. 16% masy masła) w temperaturze 100–105°C — gęsta piana na powierzchni.
  3. Opadanie kazeiny na dno garnka i powolna reakcja Maillarda w temp. 108–112°C (powstanie orzechowego aromatu tradycyjnego Ghee).
  4. Filtracja przez potrójną gazę serowarską.
* **Właściwości produktu:** Czystość tłuszczu > 99.8%, wilgotność < 0.2%, punkt dymienia $250^\\circ C$, trwałość wielomiesięczna bez lodówki.
* **Persona:** P2, P5, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-DAIRY-020: Zamknięty Obieg Serwatki — Rzemieślnicza Ricotta**
* **Opis:** Odzysk białek serwatkowych (albumin i globulin) po produkcji serów podpuszczkowych.
* **Warunki termiczno-kwasowe:**
  * Podgrzanie świeżej, słodkiej serwatki do temperatury $85 - 90^\\circ C$.
  * Korekta pH do poziomu 5.80–6.00 za pomocą kwasu cytrynowego lub octowego.
  * Wypłynięcie aksamitnych płatków Ricotty na powierzchnię i zbieranie łyżką szumówką.
  * Opcja wzbogacenia: dodatek 5–10% mleka pełnego podwaja wydajność i nadaje kremową słodycz.
* **Persona:** P1, P2, P5.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-DAIRY-025: Norweski Brunost / Mysost (Karmelizowany Ser Serwatkowy)**
* **Opis:** Tradycyjna skandynawska metoda redukcji serwatki do zwartego, brązowego bloku o smaku toffi.
* **Proces odparowania i karmelizacji:**
  * Gotowanie serwatki z redukcją objętości o 80–85% (zagęszczenie laktozy i soli mineralnych).
  * Dodatek śmietanki w końcowej fazie zagęszczania.
  * Karmelizacja laktozy w temperaturze $102 - 105^\\circ C$ z intensywnym mieszaniem drewnianą łopatką.
  * Szybkie chłodzenie w kąpieli lodowej z ciągłym mieszaniem zapobiegające powstawaniu wyczuwalnych kryształków laktozy (ochrona przed defektem piaszczystości).
* **Persona:** P3, P5.
* **Priorytet:** MUST | **Etap:** MVP.
""")

print("Zapisano B6_Narzedzia_Napoje_Mleczne_Maslo_Ghee.md")

# -------------------------------------------------------------
# B7_Narzedzia_Spizarnia_Naczynia_Etykiety.md
# -------------------------------------------------------------
fb7 = os.path.join(OUT_DIR, "B7_Narzedzia_Spizarnia_Naczynia_Etykiety.md")
with open(fb7, "w", encoding="utf-8") as f:
    f.write("""# **SEROWAR BRD 0.1 — Rozdział 7: Narzędzia — Spiżarnia Mleczna, Etykiety PDF i Koszty (B7)**

> **Moduł:** `BR-MAG-001` do `BR-MAG-030`  
> **Kontekst dziedzinowy:** Gospodarka surowcowa z automatycznym odpisem po sesji mleczarskiej, druk etykiet A4 z kodami QR przez `expo-print`, kalkulator uzysku serowarskiego (% yield) i kosztu partii.

---

### **BR-MAG-001: Cyfrowa Spiżarnia i Inwentarz Surowców Mleczarskich**
* **Opis:** Ewidencja posiadanych surowców i kultur w gospodarstwie domowym i serowarni.
* **Kategorie magazynowe:**
  * Mleko (L) — gatunek (krowie, kozie, owcze, bawole), data udoju, dostawca, cena za litr.
  * Śmietanka (L / kg) — zawartość tłuszczu (30%, 36%, 42%), data pozyskania.
  * Podpuszczki (ml / g) — data ważności, moc IMCU, pochodzenie (cielęca, mikrobiologiczna).
  * Kultury bakterii DVI i pleśni — szczepy mezofilne/termofilne, probówki/saszetki, data ważności.
  * Dodatki technologiczne — chlorek wapnia $CaCl_2$ (g/ml), sól kłodawska niejodowana (kg), zioła (kozieradka, czarnuszka, pieprz).
* **Kryteria akceptacji:**
  * Ostrzeżenie o zbliżającym się terminie przydatności kultur liofilizowanych (zamrażarka -18°C).
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-MAG-005: Automatyczny Odpis Magazynowy po Sesji (Auto-Depletion)**
* **Opis:** Po zakończeniu procesu serowarskiego aplikacja automatycznie odejmuje zużyte ilości surowców z bazy inwentarza.
* **Kryteria akceptacji:**
  1. Podsumowanie zużycia przed zatwierdzeniem: *„Z magazynu zostanie odpisane: 20L mleka krowiego, 1.4 ml podpuszczki Fromase, 0.4 g kultury Choozit MA11, 400 g soli.”*
  2. Jeśli w magazynie brakuje surowca, aplikacja ostrzega przed rozpoczęciem sesji i proponuje zamiennik.
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-MAG-010: Generator Etykiet i Paszportów PDF z Kodem QR (`expo-print`)**
* **Opis:** Generowanie profesjonalnych arkuszy etykiet PDF w formacie A4 (siatka etykiet samoprzylepnych na krążki sera i osełki masła).
* **Zawartość pojedynczej etykiety:**
  * Nazwa sera / produktu i numer partii (Batch ID).
  * Data produkcji, data solenia, data minimalnej dojrzałości.
  * Skład surowcowy (gatunek mleka, użyte kultury, dodatki ziołowe).
  * Wektorowy kod QR z zakodowanym schematem deep-link `serowar://batch/<id>` pozwalający na natychmiastowe otwarcie karty partii w telefonie za pomocą aparatu.
* **Kryteria akceptacji:**
  * Wygenerowanie pliku PDF gotowego do wydruku przez AirPrint lub zapisania w plikach systemowych iOS.
* **Persona:** P1, P2, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-MAG-015: Kalkulator Wydajności Mleczarskiej (% Yield) i Kosztu Partii**
* **Opis:** Obliczanie realnego uzysku sera i masła z mleka oraz kosztu jednostkowego wytworzenia kilograma produktu.
* **Wzór wydajności serowarskiej:**
  $$\\text{Yield [\\%]} = \\frac{m_{sera\\ po\\ prasowaniu} [kg]}{V_{mleka} [L] \\times \\rho_{mleka} [kg/L]} \\times 100\\%$$
  *Typowa wydajność:* mleko krowie 9–11%, mleko kozie 8–10%, mleko owcze 18–25%.
* **Rachunek kosztu krążka / osełki:**
  $$\\text{Koszt całkowity} = \\text{Koszt mleka/śmietanki} + \\text{Koszt enzymów i kultur} + \\text{Koszt energii grzania} + \\text{Sól}$$
  Aplikacja prezentuje porównanie z cenami delikatesów rzemieślniczych (np. ser dojrzały bio: 120 zł/kg, masło wiejskie: 18 zł/200g) z wyliczeniem kwoty zaoszczędzonej w portfelu.
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.
""")

print("Zapisano B7_Narzedzia_Spizarnia_Naczynia_Etykiety.md")

# -------------------------------------------------------------
# B8_Narzedzia_Zegarki_LiveActivity_Sensory.md
# -------------------------------------------------------------
fb8 = os.path.join(OUT_DIR, "B8_Narzedzia_Zegarki_LiveActivity_Sensory.md")
with open(fb8, "w", encoding="utf-8") as f:
    f.write("""# **SEROWAR BRD 0.1 — Rozdział 7: Narzędzia — Zegarki, Live Activity, Sensory i Sensoryka (B8)**

> **Moduł:** `BR-SYS-001` do `BR-SYS-030`  
> **Kontekst dziedzinowy:** Hands-free w kuchni serowarskiej ("ręce w serwatce"), Apple Watch, Garmin Connect IQ, widżety Live Activity w czasie rzeczywistym, odczyt z czujników BLE, wektorowy radar sensoryczny sera (SVG).

---

### **BR-SYS-001: Asystent Live Activity i Dynamic Island (iOS ActivityKit)**
* **Opis:** Ciągła prezentacja odliczania kluczowych faz procesu serowarskiego na zablokowanym ekranie iPhone'a oraz w Dynamic Island.
* **Scenariusze Live Activity:**
  1. **Odliczanie do punktu flokulacji:** stoper miseczki z przyciskiem szybkiej akcji „Złapano flokulację”.
  2. **Odliczanie do cięcia skrzepu:** czas mnożnika flokulacji ($t_f \\times M$).
  3. **Rampa dogrzewania skrzepu / twarogu:** aktualna temperatura docelowa i tempo grzania.
  4. **Fazy prasowania:** czas pozostały do następnego obrotu krążka w prasie.
* **Kryteria akceptacji:**
  * Widżet nie gaśnie, aktualizuje się co sekundę, wspiera Always-On Display.
* **Persona:** P1, P2, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-SYS-005: Aplikacja Towarzysząca Apple Watch (Hands-Free in Whey)**
* **Opis:** Dedykowany interfejs zegarkowy dla serowara z mokrymi dłońmi.
* **Funkcje na zegarku:**
  * Duży przycisk rejestracji punktu flokulacji (obsługa tapnięciem nadgarstka lub koronką Digital Crown).
  * Wyświetlanie aktualnego kroku procesu (np. „Dogrzewaj skrzep — jeszcze 6 minut do 38°C”).
  * Dźwiękowa i haptyczna sygnalizacja alarmów obrotu sera w prasie i solance.
* **Kryteria akceptacji:**
  * Niezależne działanie timera na Apple Watch nawet przy zerwanym połączeniu Bluetooth z telefonem.
* **Persona:** P1, P6.
* **Priorytet:** SHOULD | **Etap:** MVP/1.1.

---

### **BR-SYS-015: Bezprzewodowa Integracja z Czujnikami Środowiskowymi BLE**
* **Opis:** Automatyczne pobieranie odczytów temperatury i wilgotności względnej z bezprzewodowych tagów Bluetooth Low Energy umieszczonych w dojrzewalni lub chłodziarce serowarskiej.
* **Wspierane czujniki (protokoły broadcast Manufacturer Data):**
  * **RuuviTag (Finlandia):** format RAWv2 (temperatura, wilgotność z dokładnością do 0.1%, ciśnienie atmosferyczne).
  * **Xiaomi Mijia BLE (np. LYWSD03MMC z firmware ATC/BTHome):** temperatura i wilgotność.
* **Kryteria akceptacji:**
  1. Aplikacja nie wymaga parowania z chmurą producenta — nasłuchuje lokalnych pakietów rozgłoszeniowych BLE w tle.
  2. Automatyczne dopisywanie odczytów do wykresu mikroklimatu partii w Cave Log.
* **Persona:** P6, P7.
* **Priorytet:** COULD | **Etap:** 1.1.

---

### **BR-SYS-020: Wektorowy Radar Sensoryczny Smaku i Dojrzałości Sera (Spider Radar SVG)**
* **Opis:** Interaktywny wykres pajęczynowy oceny dojrzałości sera oraz profilu sensorycznego produktów mlecznych.
* **Osie sensoryczne sera:**
  1. Kwasowość (Acidity / pH)
  2. Słoność (Salinity)
  3. Elastyczność / Zwartość Miąższu (Elasticity / Curd Firmness)
  4. Maślanowość / Kremowość (Creaminess / Diacetyl)
  5. Ostrość / Pikantność (Pungency / Lipolysis)
  6. Orzechowość / Dojrzałość Proteolityczna (Nuttiness / Proteolysis)
* **Kryteria akceptacji:**
  * Wektorowy komponent SVG renderowany w 100% lokalnie, z możliwością nałożenia profilu wzorcowego stylu sera na profil uzyskany przez użytkownika.
* **Persona:** P1, P3, P6, P7.
* **Priorytet:** SHOULD | **Etap:** MVP.
""")

print("Zapisano B8_Narzedzia_Zegarki_LiveActivity_Sensory.md")
