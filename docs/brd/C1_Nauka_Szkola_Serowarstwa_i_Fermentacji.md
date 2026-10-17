# **SEROWAR BRD 0.1 — Rozdział 7: Szkoła Rzemiosła i Kompas Diagnostyczny (C1)**

> **Moduł:** `BR-EDU-001` do `BR-EDU-040`  
> **Kontekst dziedzinowy:** Baza wiedzy o chemii mleka i mikroorganizmach mleczarskich, interaktywny atlas kultur DVI, kompas diagnostyczny wad i zakażeń sera (Cheese Doctor), diagnostyk wad masła, twarogów i produktów mlecznych (Dairy Doctor).

---

### **BR-EDU-001: Interaktywna Szkoła Serowarstwa i Mleczarstwa Zagrodowego**
* **Opis:** System modularnych kursów i przewodników krok po kroku wyjaśniających biochemiczne podstawy koagulacji, synerezy, solenia, zmaślania i affinage.
* **Kluczowe moduły edukacyjne:**
  1. *Lekcja 1: Biochemia Kazeiny* — dlaczego micele kazeinowe odpychają się elektrostatycznie (frakcja $\kappa$-kazeiny) i jak chymozyna odcina hydrofilowy ogonek glikomakropeptydu, inicjując żelowanie.
  2. *Lekcja 2: Rola Wapnia Koloidalnego* — jak pasteryzacja niszczy mostki $Ca^{2+}$ i dlaczego $CaCl_2$ ratuje mleko pasteryzowane.
  3. *Lekcja 3: Mezofile vs Termofile* — różnice metaboliczne kultur, optymalne temperatury, szlak cytrynianowy i produkcja diacetylu (aromat maślany) vs kwas L-mlekowy.
  4. *Lekcja 4: Fizyka Synerezy* — wielkość ziarna, rampa dogrzewania i mechaniczne wyciskanie serwatki.
  5. *Lekcja 5: Ekologia Dojrzewalni* — sukcesja mikroflory na skórce: drożdże odkwaszające (*Geotrichum*) -> bakterie maziowe (*Brevibacterium linens*) lub pleśnie białe (*Penicillium camemberti*).
  6. *Lekcja 6: Masielnictwo i Inwersja Emulsji* — jak pęcherzyki powietrza rozbijają otoczki tłuszczowe MFGM i odwracają układ faza rozproszona/ciągła z O/W (śmietanka) na W/O (masło).
  7. *Lekcja 7: Denaturacja Albumin w Ricotcie* — dlaczego białka serwatkowe potrzebują wysokiej temperatury ($>85^\circ C$) i kwasu do koagulacji.
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
    * *Masłowatość mazista / miękka:* zmaślanie śmietanki w zbyt wysokiej temperaturze ($>15^\circ C$).
    * *Kropelkowanie maślanki:* niedostateczne mechaniczne wyciśnięcie na desce serowarskiej (uwięziona wilgoć skraca trwałość).
  * **Wady twarogu:**
    * *Twaróg twardy, suchy i kredowy:* przegrzanie skrzepu powyżej 44°C w trakcie dogrzewania.
    * *Twaróg mazisty, rzadki i śluzowaty:* niedogrzanie skrzepu ($<35^\circ C$) lub atak bakteriofagów opóźniający zakwaszenie.
    * *Gorzknienie twarogu:* rozwój bakterii psychrotrofowych (*Pseudomonas*) w mleku zbyt długo przechowywanym w chłodzie przed ukwaszeniem.
  * **Wady jogurtu i kefiru:**
    * *Wydzielanie serwatki (synereza jogurtu):* wstrząsanie słoikami podczas inkubacji termofilnej lub zbyt niska temperatura wstępnej pasteryzacji mleka (brak denaturacji $\beta$-laktoglobuliny).
    * *Śluzowatość ciągnąca:* inkubacja jogurtu w zbyt niskiej temperaturze ($<38^\circ C$) sprzyjająca nadprodukcji egzopolisacharydów.
* **Persona:** P2, P4, P6.
* **Priorytet:** MUST | **Etap:** MVP.
