# **SEROWAR BRD 0.1 — Rozdziały 9–10: Wymagania Niefunkcjonalne (NFR) i Zgodność z Apple (D1)**

> **Rejestr:** `NFR-OFF-001` do `NFR-TEST-015` (Łącznie 115 wymagań NFR)  
> **Kontekst:** Wytyczne Apple App Store Review (1.4.1, 3.1.2, 4.3, 5.1.1, 5.2.1), standardy WCAG AAA, higiena pamięci SQLite i baterii.

---

### **1. Grupa NFR-OFF: Niezależność Offline (100% Offline-First)**
* **NFR-OFF-001:** Wszystkie funkcje kalkulatorów (IMCU, flokulacja, prasa, solanka, twarogi, masło, jogurt, ricotta, brunost, Cave Log) działają bez połączenia z siecią internetową.
* **NFR-OFF-002:** Baza danych SQLite, silnik wyszukiwania kultur oraz generator kodów QR i plików PDF funkcjonują w pełni lokalnie na urządzeniu.
* **NFR-OFF-003:** Aplikacja nigdy nie wyświetla blokującego monitu o brak sieci internetowej w trakcie wykonywania procedury rzemieślniczej.

### **2. Grupa NFR-BEZP: Prywatność i Bezpieczeństwo Danych**
* **NFR-BEZP-001:** Zero zbierania danych osobowych — certyfikacja „Data Not Collected” w karcie Privacy Nutrition Label w App Store.
* **NFR-BEZP-002:** Brak zewnętrznych SDK śledzących, analitycznych lub reklamowych (Zero Firebase, Facebook SDK, Google Analytics).
* **NFR-BEZP-003:** Baza danych SQLite przechowywana w bezpiecznym katalogu piaskownicy iOS (`/Library/Application Support/SQLite`), wyłączona z publicznego udostępniania i zabezpieczona szyfrowaniem sprzętowym urządzenia (Data Protection Class C).

### **3. Grupa NFR-I18N: Globalna Lokalizacja i Jednostki**
* **NFR-I18N-001:** Pełne wsparcie dla 35 języków, w tym polskiego i angielskiego od wersji 1.0. Zero niezlokalizowanych ciągów tekstowych (bramka CI `npm run check:i18n`).
* **NFR-I18N-002:** Dwukierunkowy konwerter metryczno-imperialny: litry/galony US, gramy/funty/uncje, °C/°F, gęstość g/cm³ / stopnie Baumé / stopnie Salometer.

### **4. Grupa NFR-DOST: Dostępność Cyfrowa (Accessibility / WCAG AAA)**
* **NFR-DOST-001:** Pełna obsługa Apple VoiceOver na 100% ekranów i kontrolek interfejsu.
* **NFR-DOST-002:** Obsługa powiększonego tekstu Dynamic Type do największych rozmiarów dostępnościowych bez obcinania treści i etykiet.
* **NFR-DOST-003:** Minimalny kontrast kolorystyczny tekstu do tła $\ge 4.5:1$ (dla małego tekstu $\ge 7:1$).
* **NFR-DOST-004:** Żadna informacja (np. alert przekwaszenia, stan solanki) nie jest przekazywana wyłącznie za pomocą koloru — zawsze towarzyszy jej czytelna ikona i tekst.

### **5. Grupa NFR-WYD: Wydajność i Efektywność Energetyczna**
* **NFR-WYD-001:** Czas zimnego startu aplikacji (Cold Launch) na iPhone 11 $\le 800\text{ ms}$.
* **NFR-WYD-002:** Renderowanie list i ekranów ze stałą płynnością 60/120 fps bez zacięć (Zero Frame Drops).
* **NFR-WYD-003:** Pomiary timera flokulacji i mieszania zużywają mniej niż 1% baterii na godzinę aktywnego odliczania.

### **6. Grupa NFR-APPLE: Rygorystyczna Zgodność z Wytycznymi App Store**
* **NFR-APPLE-001 (Guideline 1.4.1 — Bezpieczeństwo i Zdrowie):** Aplikacja nie zawiera żadnych medycznych twierdzeń probiotycznych ani dietetycznych. Język opisowy jest czysto technologiczny i biochemiczny.
* **NFR-APPLE-002 (Guideline 3.1.2 — Subskrypcje i Płatności):** Przejrzysty ekran zakupu SEROWAR PRO z wyraźnym oznaczeniem cen, brakiem ukrytych kosztów, automatycznym przywracaniem zakupów (Restore Purchases). Kopia zapasowa i eksport danych są bezpłatne na zawsze.
* **NFR-APPLE-003 (Guideline 4.3 — Brak Spamu):** Aplikacja stanowi unikalny, głęboki kombajn technologiczny (kalkulatory IMCU, flokulacja, Cave Log, relacyjna baza partii), odróżniający się od prostych liczników.
* **NFR-APPLE-004 (Guideline 5.1.1 — Ochrona Danych):** Brak wymogu podawania jakichkolwiek danych osobowych w celu korzystania z aplikacji.
