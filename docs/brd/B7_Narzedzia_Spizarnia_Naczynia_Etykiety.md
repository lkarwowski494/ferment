# **FERMENT BRD 0.1 — Rozdział 7: Narzędzia — Spiżarnia, Etykiety PDF i Koszty (B7)**

> **Moduł:** `BR-MAG-001` do `BR-MAG-030`  
> **Kontekst dziedzinowy:** Gospodarka surowcowa z automatycznym odpisem po sesji, druk etykiet A4 z kodami QR przez `expo-print`, kalkulator uzysku serowarskiego (% yield) i kosztu partii.

---

### **BR-MAG-001: Cyfrowa Spiżarnia i Inwentarz Surowców**
* **Opis:** Ewidencja posiadanych surowców i kultur w gospodarstwie domowym.
* **Kategorie magazynowe:**
  * Mleko (L) — data udoju, dostawca.
  * Podpuszczki (ml / g) — data ważności, moc IMCU.
  * Kultury bakterii i pleśni (fiolki / saszetki DVI) — szczepy, waga, data przydatności.
  * Sole i dodatki mineralne — chlorek wapnia (g/ml), sól kłodawska niejodowana (kg).
  * Surowce roślinne i cukry — kapusta, warzywa, herbaty, cukier sacharoza.
* **Kryteria akceptacji:**
  * Ostrzeżenie o zbliżającym się terminie przydatności kultur liofilizowanych (przechowywanych w zamrażarce -18°C).
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-MAG-005: Automatyczny Odpis Magazynowy po Sesji (Auto-Depletion)**
* **Opis:** Po zakończeniu procesu (np. przeniesienie krążka sera do solanki lub zakręcenie słojów z kimchi) aplikacja automatycznie odejmuje zużyte ilości surowców z bazy inwentarza.
* **Kryteria akceptacji:**
  1. Podsumowanie zużycia przed zatwierdzeniem: *„Z magazynu zostanie odpisane: 20L mleka krowiego, 1.2 ml podpuszczki Fromase, 0.4 g kultury Choozit MA11, 400 g soli.”*
  2. Jeśli w magazynie brakuje surowca, aplikacja ostrzega przed rozpoczęciem sesji i proponuje zamiennik.
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-MAG-010: Generator Etykiet i Paszportów PDF z Kodem QR (`expo-print`)**
* **Opis:** Generowanie profesjonalnych arkuszy etykiet PDF w formacie A4 (siatka etykiet samoprzylepnych lub zawieszek na krążki sera i słoiki).
* **Zawartość pojedynczej etykiety:**
  * Nazwa sera / przetworu i numer partii (Batch ID).
  * Data produkcji, data solenia, minimalna data dojrzałości.
  * Skład surowcowy (gatunek mleka, użyte kultury).
  * Wektorowy kod QR z zakodowanym schematem deep-link `ferment://batch/<id>` pozwalający na natychmiastowe otwarcie karty partii w telefonie za pomocą aparatu.
* **Kryteria akceptacji:**
  * Wygenerowanie pliku PDF gotowego do wydruku przez AirPrint lub zapisania w plikach systemowych iOS.
* **Persona:** P1, P2, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-MAG-015: Kalkulator Wydajności Serowej (% Cheese Yield) i Kosztu Krążka**
* **Opis:** Obliczanie realnego uzysku sera z mleka oraz kosztu jednostkowego wytworzenia kilograma produktu.
* **Wzór wydajności serowarskiej:**
  $$\text{Yield [\%]} = \frac{m_{sera\ swiezego\ po\ prasowaniu} [kg]}{V_{mleka} [L] \times \rho_{mleka} [kg/L]} \times 100\%$$
  *Typowa wydajność:* mleko krowie 9–11%, mleko kozie 8–10%, mleko owcze 18–25% (wysoka zawartość kazeiny i tłuszczu).
* **Rachunek kosztu krążka:**
  $$\text{Koszt całkowity} = \text{Koszt mleka} + \text{Koszt kultur i enzymów} + \text{Koszt energii grzania} + \text{Sól}$$
  Aplikacja prezentuje koszt całkowity partii oraz koszt w przeliczeniu na 1 kg dojrzałego sera.
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-MAG-020: Przelicznik Form i Ekwiwalentów Składników (Ingredient Substitutions Engine)**
* **Opis:** Zaadaptowany z silnika *Oczko* kalkulator przeliczania form enzymów koagulujących, starterów mikrobiologicznych i soli mineralnych (`ingredient-substitutions.ts`).
* **Kluczowe moduły przeliczeniowe:**
  1. **Konwerter podpuszczki:** Przeliczanie mocy w IMCU na różne postacie handlowe: płynna (200 IMCU/ml), proszek mikrobiologiczny Fromase (2000 IMCU/g), tabletki mikrobiologiczne Meito (ok. 2500 IMCU/tabl) oraz pasta jagnięca/koźlęca z aktywnością lipolityczną (100 IMCU/g).
  2. **Ekwiwalenty kultur naturalnych (zamiast DVS):** Zastępowanie kultur liofilizowanych naturalnymi starterami — świeżą żywą maślanką/zsiadłym mlekiem z mleka surowego (mezofile, $18\text{ ml/L}$) lub żywym gęstym jogurtem greckim (termofile, $15\text{ g/L}$).
  3. **Postacie chlorku wapnia ($CaCl_2$):** Bezwodny ($111\text{ g/mol}$) vs dwuwodny dihydrate ($147\text{ g/mol}$) vs roztwór wodny 33% i 10%.
* **Persona:** P1, P2, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-MAG-025: Dirty-Hands Steppers i Skaner Deep-Link (Pantry Steppers & Deep-Linking)**
* **Opis:** Ergonomia mokrych rąk w spiżarni oraz bezdotykowa nawigacja po partiach i krążkach (`qr-deeplink.ts` + `QrScannerModal.tsx`).
* **Kluczowe funkcjonalności:**
  1. **Dotykowe steppery $\ge 56\text{ pt}$:** Szybka korekta stanu magazynowego (`-1` / `+1`) jednym tapnięciem bez otwierania klawiatury systemowej.
  2. **Obsługa protokołu deep-link:** Obsługa schematów `ferment://batch/<id>` oraz `ferment://wheel/<id>`.
  3. **Reakcja na skan kodu QR:** Po zeskanowaniu etykiety krążka lub partii aplikacja automatycznie przełącza widok na odpowiednią zakładkę (Dziennik Partii lub Piwniczka), rozwija historię pielęgnacji oraz prezentuje modal szybkich akcji (Obróć / Zważ / Oceń sensorycznie).
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-MAG-011: Eksport Dziennika Produkcyjnego i Spiżarni do RFC 4180 CSV (Production CSV Export Engine)**
* **Opis:** Generowanie standaryzowanych arkuszy kalkulacyjnych CSV dla partii produkcyjnych, krążków piwnicznych oraz stanu magazynowego spiżarni (`csv-export.ts`).
* **Kryteria akceptacji:**
  1. Zgodność ze specyfikacją RFC 4180 (bezpieczne uciekanie znaków specjalnych, przecinków, cudzysłowów i nowych linii).
  2. Generowanie plików CSV dla:
     * Dziennika Partii (kod partii, data, nazwa, kategoria, status, parametry początkowe, notatki).
     * Dziennika Dojrzewalni Sera (kod krążka, typ sera, data wyrobienia, waga początkowa i bieżąca, ubytek masy %, stan skórki, historia obracania).
     * Magazynu Spiżarni (nazwa, kategoria, ilość, jednostka, data minimalnej trwałości, stan minimalny).
  3. Bezpieczne udostępnianie pliku przez natywny mechanizm `expo-sharing` (współdzielenie z arkuszami Excel, Google Sheets, AirDrop).
  4. Dostępność również w trybie READ-ONLY po wygaśnięciu okresu próbnego (prawo użytkownika do własnych danych).
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-MAG-015: Zaawansowany Kalkulator Kosztów Partii, Energii i Oszczędności Domowych (Batch Cost & Affinage ROI)**
* **Opis:** Kalkulator ekonomiczny partii rzemieślniczej (`batch-cost-engine.ts`) modelujący realny koszt wytworzenia sera dojrzewającego, kiszonek i kombuchy, uwzględniający energię cieplną podgrzewania mleka, zużycie prądu przez chłodziarki piwniczne/witryny winiarskie oraz porównanie z cenami rynkowymi delikatesów ekologicznych.
* **Struktura kosztów w modelu:**
  1. **Surowce bazowe i dodatki:**
     * Mleko zagrodowe (PLN/L), warzywa ekologiczne (PLN/kg), woda filtrowana.
     * Kultury DVS, podpuszczka IMCU, $CaCl_2$, sól kamienna niejodowana, cukier, liście herbaty.
     * Opakowania i powłoki (wosk serowarski, polioctan, woreczki próżniowe, kapsle koronowe).
  2. **Energia technologiczna:**
     * Gotowanie / dogrzewanie gęstwy serowarskiej: $P\text{ [kW]} \times t\text{ [h]} \times \text{cena kWh}$ (domyślnie 1.15 PLN/kWh).
     * Dojrzewalnia sera (Affinage Cave Chiller): $\text{Dni} \times 0.6\text{ kWh/dzień} \times \text{cena kWh}$.
  3. **Wskaźniki jednostkowe i ROI:**
     * Koszt całkowity partii (PLN).
     * Koszt wyrobu gotowego po odcieku serwatki i ubytku masy w piwniczce (PLN/kg lub PLN/L).
     * Koszt porcji 100g (PLN).
     * Oszczędność względem odpowiedników rzemieślniczych (np. rzemieślnicza Gouda zagrodowa: 110 PLN/kg, surowa kombucha: 22 PLN/L, kiszonki bio: 48 PLN/kg) z wyliczeniem kwoty zaoszczędzonej w PLN i procentowo (%).
* **Kryteria akceptacji:**
  1. Przełącznik profilu rzemiosła: 🧀 Serowarstwo | 🥬 Kiszonki & Kimchi | 🫖 Kombucha.
  2. Dynamiczny przelicznik kosztów w czasie rzeczywistym.
  3. Podsumowanie finansowe prezentowane użytkownikowi w czytelnym boksie z gratulacjami oszczędności.
* **Persona:** P1, P2, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.




