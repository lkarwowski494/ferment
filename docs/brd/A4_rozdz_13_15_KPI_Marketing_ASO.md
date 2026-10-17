# **SEROWAR BRD 0.1 — Część A: KPI, Marketing i ASO (Rozdziały 13 i 15)**

> **Ekosystem:** Apps4Brew Studio | **Projekt:** SEROWAR (Rzemieślnicze Przetwórstwo Mleka)

---

## **Rozdział 13. Prywatne Wskaźniki Sukcesu (KPI bez śledzenia użytkownika)**

Zgodnie z zasadą **ZP-03** aplikacja SEROWAR nie zawiera żadnych skryptów szpiegujących ani zewnętrznych SDK telemetrycznych. Wskaźniki sukcesu mierzone są wyłącznie za pomocą anonimowych metryk dostarczanych przez **Apple App Store Connect** oraz wskaźników lokalnych przechowywanych w urządzeniu użytkownika:

1. **Konwersja App Store (Store Conversion Rate):**
   * *Cel:* $\ge 5.0\%$ konwersji odsłon karty produktowej w pobranie aplikacji (wysoka intencja użytkowników szukających kalkulatora podpuszczki i serowarstwa).
   * *Narzędzie:* App Store Connect Analytics.
2. **Wskaźnik Awaryjności (Crash-Free Sessions):**
   * *Cel:* $\ge 99.8\%$ sesji wolnych od awarii.
   * *Narzędzie:* Apple Xcode Organizer Crash Reports.
3. **Wskaźnik Retencji Długoterminowej (Cave Log Retention):**
   * *Cel:* Średni czas życia partii sera w Cave Log $\ge 60$ dni (dowód, że użytkownicy rzeczywiście pielęgnują dojrzewające krążki przy asyście aplikacji).
   * *Narzędzie:* Anonimowa metryka lokalna na urządzeniu.
4. **Tempo Zwrotu Kosztu Konta Apple (Payback Velocity):**
   * *Cel:* 10 zakupów Lifetime lub 30 subskrypcji rocznych w ciągu pierwszych 45 dni od premiery w App Store.

---

## **Rozdział 15. Strategia Marketingowa, ASO i Kręgi Społeczności**

### **15.1 Strategia App Store Optimization (ASO)**
Kluczowe słowa kluczowe (PL i EN) wyselekcjonowane pod kątem zerowej konkurencji i najwyższej intencji rzemieślniczej:

* **Tytuł (PL):** SEROWAR — Rzemieślnicze Przetwórstwo Mleka
* **Podtytuł (PL):** Kalkulator podpuszczki, Cave Log, twaróg i masło
* **Słowa kluczowe (PL):** serowarstwo,serowar,podpuszczka,flokulacja,gouda,cheddar,dojrzewalnia,solanka,kazeina,twaróg,masło,ghee,ricotta,brunost,mleko,nabiał
* **Tytuł (EN):** SEROWAR: Artisan Cheese & Dairy Craft
* **Podtytuł (EN):** Rennet calculator, cheese cave, curd & butter
* **Słowa kluczowe (EN):** cheesemaking,rennet,flocculation,cheese cave,affinage,cheddar,gouda,curd,butter,ghee,ricotta,brunost,dairy,whey,raw milk,parmesan

### **15.2 Dotarcie do Kręgów Zainteresowanych (Organic Launch Circles)**
Strategia wprowadzenia na rynek opiera się na organicznym zaufaniu w wąskich kręgach pasjonatów (bez płatnych reklam):
1. **Krąg 1: Serowarzy Zagrodowi i Rzemieślnicy:**
   * Polskie fora serowarskie (Serowar.pl, wędzarnicza brać, grupy serowarstwa domowego na FB — łącznie ponad 70 tys. członków).
   * Globalne społeczności: Reddit r/cheesemaking (110k), cheeseforum.org.
   * Przekaz: „Pierwszy mobilny kalkulator z prawdziwą metodą mnożnika flokulacji, przeliczaniem IMCU i dziennikiem jaskini dojrzewalniczej, który działa w 100% offline w piwnicy”.
2. **Krąg 2: Wytwórcy Domowego Nabiału, Masła i Twarogów:**
   * Społeczności: r/homestead, grupy tradycyjnego przetwórstwa wiejskiego, zero-waste.
   * Przekaz: „Nigdy więcej twardego jak kreda twarogu i zjełczałego masła: precyzyjne temperatury koagulacji, zmaślania i zamknięty obieg serwatki”.
3. **Krąg 3: Rzemieślniczy Producenci Zagrodowi (RHD):**
   * Rolnicy i hodowcy kóz/krów sprzedający sery na targach ekologicznych.
   * Przekaz: „Ewidencja partii leżakowania krążków, kalkulator kosztu kilograma sera i kostki masła oraz profesjonalne etykiety PDF z kodami QR”.
