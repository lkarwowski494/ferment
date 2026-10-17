# **SEROWAR BRD 0.1 — Rozdział 7: Narzędzia — Spiżarnia Mleczna, Etykiety PDF i Koszty (B7)**

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
  $$\text{Yield [\%]} = \frac{m_{sera\ po\ prasowaniu} [kg]}{V_{mleka} [L] \times \rho_{mleka} [kg/L]} \times 100\%$$
  *Typowa wydajność:* mleko krowie 9–11%, mleko kozie 8–10%, mleko owcze 18–25%.
* **Rachunek kosztu krążka / osełki:**
  $$\text{Koszt całkowity} = \text{Koszt mleka/śmietanki} + \text{Koszt enzymów i kultur} + \text{Koszt energii grzania} + \text{Sól}$$
  Aplikacja prezentuje porównanie z cenami delikatesów rzemieślniczych (np. ser dojrzały bio: 120 zł/kg, masło wiejskie: 18 zł/200g) z wyliczeniem kwoty zaoszczędzonej w portfelu.
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.
