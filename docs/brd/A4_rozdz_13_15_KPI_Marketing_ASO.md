# **FERMENT BRD 0.1 — Część A: KPI, Marketing i ASO (Rozdziały 13 i 15)**

> **Ekosystem:** Apps4Brew Studio | **Projekt:** FERMENT (Ser i Flora / Mikrobiologia Domowa)

---

## **Rozdział 13. Prywatne Wskaźniki Sukcesu (KPI bez śledzenia użytkownika)**

Zgodnie z zasadą **ZP-03** aplikacja FERMENT nie zawiera żadnych skryptów szpiegujących ani zewnętrznych SDK telemetrycznych. Wskaźniki sukcesu mierzone są wyłącznie za pomocą anonimowych metryk dostarczanych przez **Apple App Store Connect** oraz wskaźników lokalnych przechowywanych w urządzeniu użytkownika:

1. **Konwersja App Store (Store Conversion Rate):**
   * *Cel:* $\ge 4.5\%$ konwersji odsłon karty produktowej w pobranie aplikacji.
   * *Narzędzie:* App Store Connect Analytics.
2. **Wskaźnik Awaryjności (Crash-Free Sessions):**
   * *Cel:* $\ge 99.8\%$ sesji wolnych od awarii.
   * *Narzędzie:* Apple Xcode Organizer Crash Reports.
3. **Wskaźnik Retencji Długoterminowej (Cave Log Retention):**
   * *Cel:* Średni czas życia partii sera w Cave Log $\ge 45$ dni (dowód, że użytkownicy rzeczywiście pielęgnują dojrzewające krążki przy asyście aplikacji).
   * *Narzędzie:* Anonimowa metryka lokalna na urządzeniu.
4. **Tempo Zwrotu Kosztu Konta Apple (Payback Velocity):**
   * *Cel:* 10 zakupów Lifetime lub 30 subskrypcji rocznych w ciągu pierwszych 60 dni od premiery w App Store.

---

## **Rozdział 15. Strategia Marketingowa, ASO i Kręgi Społeczności**

### **15.1 Strategia App Store Optimization (ASO)**
Kluczowe słowa kluczowe (PL i EN) wyselekcjonowane pod kątem zerowej konkurencji i wysokiej intencji rzemieślniczej:

* **Tytuł (PL):** FERMENT — Serowarstwo i Kiszonki
* **Podtytuł (PL):** Kalkulator podpuszczki, Cave Log, kimchi
* **Słowa kluczowe (PL):** ser,serowarstwo,podpuszczka,flokulacja,gouda,dojrzewalnia,solanka,kimchi,kiszonki,zakwas,kombucha,ocet,bakterie,kazeina,serowar
* **Tytuł (EN):** FERMENT: Cheese & Flora Log
* **Podtytuł (EN):** Cheesemaking rennet, cave aging & kimchi
* **Słowa kluczowe (EN):** cheesemaking,rennet,flocculation,cheddar,gouda,cheese cave,affinage,fermentation,kimchi,kombucha,brine,lacto,scoby,vinegar

### **15.2 Dotarcie do Kręgów Zainteresowanych (Organic Launch Circles)**
Strategia wprowadzenia na rynek opiera się na organicznym zaufaniu w wąskich kręgach pasjonatów (bez płatnych reklam):
1. **Krąg 1: Serowarzy Zagrodowi i Rzemieślnicy:**
   * Polskie fora serowarskie (Serowar.pl, wędzarnicza brać, grupy serowarstwa domowego na FB — łącznie ponad 70 tys. członków).
   * Globalne społeczności: Reddit r/cheesemaking (110k), cheeseforum.org.
   * Przekaz: „Pierwszy mobilny kalkulator z prawdziwą metodą mnożnika flokulacji, przeliczaniem IMCU i dziennikiem jaskini dojrzewalniczej, który działa w 100% offline w piwnicy”.
2. **Krąg 2: Pasjonaci Fermentacji Warzywnej i Kimchi:**
   * Społeczności: r/fermentation (350k), grupy kiszonkarskie.
   * Przekaz: „Koniec z pleśnieniem ogórków i zgadywaniem soli: kalkulator solanki wagowej na całkowitą masę z barierą pH 4.6”.
3. **Krąg 3: Rzemieślnicy Kombuchy i Octów:**
   * Społeczności: r/Kombucha (160k), grupy zero-waste i octowe.
   * Przekaz: „Kalkulator refermentacji 2F kombuchy chroniący przed rozsadzaniem butelek oraz stechiometryczny bilans octowy”.
