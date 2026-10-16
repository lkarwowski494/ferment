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
