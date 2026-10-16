# **FERMENT BRD 0.1 — Rozdział 7: Szkoła Rzemiosła i Kompas Diagnostyczny (C1)**

> **Moduł:** `BR-EDU-001` do `BR-EDU-040`  
> **Kontekst dziedzinowy:** Baza wiedzy o mikroorganizmach serowarskich i fermentacyjnych, interaktywny atlas kultur, kompas diagnostyczny defektów i zakażeń sera, diagnostyk chorób przetwórstwa.

---

### **BR-EDU-001: Interaktywna Szkoła Serowarstwa Zagrodowego**
* **Opis:** System modularnych kursów i przewodników krok po kroku wyjaśniających biochemiczne podstawy koagulacji, synerezy, solenia i affinage.
* **Kluczowe moduły edukacyjne:**
  1. *Lekcja 1: Biochemia Kazeiny* — dlaczego micele kazeinowe odpychają się elektrostatycznie (frakcja k-kazeiny) i jak chymozyna odcina hydrofilowy ogonek glikomakropeptydu, inicjując żelowanie.
  2. *Lekcja 2: Rola Wapnia Koloidalnego* — jak temperatura niszczy mostki $Ca^{2+}$ i dlaczego $CaCl_2$ ratuje mleko pasteryzowane.
  3. *Lekcja 3: Mezofile vs Termofile* — różnice metaboliczne kultur, optymalne temperatury, szlak cytrynianowy i produkcja diacetylu (aromat maślany) vs kwas L-mlekowy.
  4. *Lekcja 4: Fizyka Synerezy* — wielkość ziarna, rampa dogrzewania i mechaniczne wyciskanie serwatki.
  5. *Lekcja 5: Ekologia Dojrzewalni* — sukcesja mikroflory na skórce: drożdże odkwaszające (*Geotrichum*) -> bakterie maziowe (*Brevibacterium linens*) lub pleśnie białe (*Penicillium camemberti*).
* **Persona:** P1, P4, P5.
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

### **BR-EDU-020: Diagnostyk Chorób Kiszonek i Fermentów Roślinnych**
* Diagnoza: kożuch drożdżowy Kahm vs pleśnie mikotoksynowe, mięknięcie ogórków (brak garbników/enzymy pektynazy), ciągliwość/śluzowatość solanki (*Leuconostoc* w niskiej temperaturze tworzący dekstran), przebarwienia czosnku na niebiesko-zielono (nieszkodliwe związki izoalliiny w środowisku kwasowym).

---

### **BR-EDU-025: SOR Ratunkowy Fermentacji & Triage Awaryjny (Emergency Recovery Protocols)**
* **Opis:** Zaadaptowany z silnika *Słoik* protokół natychmiastowego ratowania zagrożonych partii biologicznych (`emergency-recovery.ts`).
* **Szybka kategoryzacja usterki i plan ratunkowy:**
  1. **Brak zestalenia skrzepu:** dogrzanie do 35°C w płaszczu wodnym, suplementacja $CaCl_2$, zadanie 50% świeżej podpuszczki bez wirowania. W ostateczności konwersja na twaróg kwasowy.
  2. **Ucieczka kwasowości (przekwaszenie):** natychmiastowe zlanie kwaśnej serwatki, płukanie wodą 38°C (curd washing), redukcja czasu solenia o 25%.
  3. **Śluzowata skórka w solance:** kąpiel naprawcza w zbuforowanej solance z 1% $CaCl_2$ i pH 5.2.
  4. **Kożuszek Kahm na powierzchni:** zebranie cienkiej błony wyparzoną łyżką, sprawdzenie anaerobowości, dociążenie wsadu. Partia zdatna do spożycia.
  5. **Zakażenie pleśnią grzybka SCOBY:** puszysta, zielona/czarna grzybnia z zarodnikami — **BEZWZGLĘDNY NAKAZ UTYLIZACJI (FATAL_DISCARD)** całego słoika ze względu na mikotoksyny wnikające w głąb płynu.
  6. **Zatrzymana fermentacja octowa:** rozcieńczenie wsadu wodą do 5–6% ABV i zapewnienie stałego dopływu tlenu przez przewiewną gazę.
* **Persona:** P1, P2, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-EDU-030: Chemia Wody & Neutralizacja Chloraminy (Water Chemistry Engine)**
* **Opis:** Zaadaptowany z silnika *Napar* kalkulator uzdatniania wody wodociągowej dla mikrobiologii domowej (`water-chemistry.ts`).
* **Zasady biochemiczne:**
  * Chloramina ($NH_2Cl$) stosowana w nowoczesnych wodociągach nie ulatnia się podczas odstania i gotowania. Nawet śladowe ilości (0.5 ppm) zabijają bakterie kwasu mlekowego (*Lactobacillus*, *Lactococcus*) oraz drożdże kombuchy.
  * **Neutralizacja chemiczna:** Zastosowanie kwasu L-askorbinowego (witaminy C) w proporcji $8\text{ mg}$ na każdy litr wody redukuje chloraminę do nieszkodliwych chlorków.
  * **Bufor alkaliczny (dKH):** Wysoka zawartość wodorowęglanów ($dKH > 10$) buforuje kwas mlekowy, opóźniając osiągnięcie bezpiecznego pH < 4.2. Algorytm rekomenduje częściowe kupażowanie z wodą demineralizowaną/RO.
* **Persona:** P1, P4, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-EDU-035: Koło Aromatów Mikrobiologicznych (Microbiological Flavor Wheel)**
* **Opis:** Zaadaptowane z silnika sensorycznego *Napar* 6-osiowe organoleptyczne koło smaków i zapachów (`flavor-wheel-data.ts`).
* **Struktura leksykonu sensorycznego:**
  * 5 głównych klas: Mleczne & Maślane, Owocowo-Kwasowe, Orzechowo-Karmelowe, Ziemisto-Grzybowe, Zwierzęco-Pikantne.
  * 15 podkategorii i 40 deskryptorów przypisanych do związków chemicznych (diacetyl, kwas L-mlekowy, octan etylu, kwas masłowy, kwas izowalerianowy, 1-okten-3-ol, p-krezol) wraz z identyfikacją mikroorganizmów odpowiedzialnych za ich powstanie.
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

