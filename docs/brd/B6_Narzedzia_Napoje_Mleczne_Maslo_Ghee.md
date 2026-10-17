# **SEROWAR BRD 0.1 — Rozdział 7: Narzędzia — Masielnictwo, Ghee, Napoje Mleczne i Serwatka (B6)**

> **Moduł:** `BR-DAIRY-001` do `BR-DAIRY-035`  
> **Kontekst dziedzinowy:** Masielnictwo rzemieślnicze, okno temperaturowe zmaślania śmietanki (10–14°C), inwersja emulsji tłuszczowej O/W -> W/O, płukanie wodą lodową, wyciskanie maślanki, wytapianie ghee i masła klarowanego (250°C), fermentacja termofilna jogurtu, tradycyjny kefir na ziarnach grzybka tybetańskiego oraz zamknięty obieg serwatki (Ricotta i Brunost).

---

### **BR-DAIRY-001: Kalkulator Zmaślania Śmietanki i Bilansu Tłuszczowego**
* **Opis:** Modelowanie wydajności masła na podstawie objętości i zawartości tłuszczu w śmietance (śmietana 30%, 36%, 42%).
* **Formuła bilansu tłuszczowego (RD-27):**
  $$m_{masla} [g] = \frac{m_{smietanki} [g] \times (\%Fat_{smietanka} / 100) \times \eta_{yield}}{\%Fat_{maslo} / 100}$$
  Gdzie $\eta_{yield} \approx 0.98$ (strata ok. 2% tłuszczu przechodzącego do maślanki), a $\%Fat_{maslo} = 82.5\%$ (standard rzemieślniczego masła ekstra).
  *Przykład:* 1000 g śmietanki 36% daje ok. $1000 \times 0.36 \times 0.98 / 0.825 = 427.6\text{ g}$ masła oraz ok. 570 g świeżej maślanki.
* **Kryteria akceptacji:**
  1. Wynik podawany w gramach masła i mililitrach maślanki z dokładnością do 1 g.
  2. Wybór typu śmietany: Słodka (Sweet Cream) lub Fermentowana/Ukwaszona mezofilnie (Cultured Cream / Crème Fraîche).
* **Persona:** P2, P4, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-DAIRY-005: Asystent Okna Temperaturowego Zmaślania (10–14°C)**
* **Opis:** Ścisły nadzór nad temperaturą śmietanki przed wlaniem do masielnicy lub miksera.
* **Fizyka krystalizacji tłuszczu mlecznego:**
  * Jeśli $T > 15^\circ C$: frakcja ciekła tłuszczu przeważa nad kryształami stałymi. Ziarna masła ulegają rozmazaniu, emulsja nie rozbija się prawidłowo, a duża część tłuszczu ucieka do maślanki. Masło jest maziste i nietrwałe.
  * Jeśli $T < 8^\circ C$: tłuszcz jest zbyt twardy, czas ubijania wydłuża się do kilkudziesięciu minut.
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
  2. Zalanie ziaren wodą lodową ($< 5^\circ C$) i delikatne ugniatanie łyżką serowarską. Odlanie mętnej wody.
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
* **Właściwości produktu:** Czystość tłuszczu > 99.8%, wilgotność < 0.2%, punkt dymienia $250^\circ C$, trwałość wielomiesięczna bez lodówki.
* **Persona:** P2, P5, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-DAIRY-020: Zamknięty Obieg Serwatki — Rzemieślnicza Ricotta**
* **Opis:** Odzysk białek serwatkowych (albumin i globulin) po produkcji serów podpuszczkowych.
* **Warunki termiczno-kwasowe:**
  * Podgrzanie świeżej, słodkiej serwatki do temperatury $85 - 90^\circ C$.
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
  * Karmelizacja laktozy w temperaturze $102 - 105^\circ C$ z intensywnym mieszaniem drewnianą łopatką.
  * Szybkie chłodzenie w kąpieli lodowej z ciągłym mieszaniem zapobiegające powstawaniu wyczuwalnych kryształków laktozy (ochrona przed defektem piaszczystości).
* **Persona:** P3, P5.
* **Priorytet:** MUST | **Etap:** MVP.
