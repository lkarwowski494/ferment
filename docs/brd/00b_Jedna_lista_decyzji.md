# **FERMENT BRD 0.1 — 00b Jedna lista decyzji i pytań (DEC-01…DEC-45)**

Niniejszy dokument gromadzi wszystkie otwarte decyzje produktowe, biznesowe i inżynieryjne dla projektu FERMENT.  
**Zasada podejmowania decyzji:** Właściciel podejmuje decyzje produktowe i biznesowe (wygląd, koszty, priorytety, etapy wydań). Kwestie merytoryczne i mikrobiologiczne rozstrzyga badacz według 5-szczeblowej hierarchii źródeł studia. Decyzje oznaczone symbolem ⚙ posiadają jasną rekomendację techniczną – wystarczy komenda „zgoda na rekomendacje ⚙”.

---

## **Blok I — Przed startem budowy (Tydzień 0)**

### **DEC-01 Jaki zakres funkcjonalny wchodzi do MVP?**
* **Kontekst:** Pełny zakres to 315 wymagań BR. Budowa całości naraz wydłuży czas do pierwszego TestFlight do 8–10 tygodni.
* **Opcje:**
  * **A (Pełne MVP):** Kompletny kalkulator serowara, Cave Log, kiszonki, kombucha i octy (148 BR, ~4–5 tyg. pracy agenta).
  * **B+ (Rekomendowana):** Kluczowy rdzeń serowarski (kalkulator IMCU, flokulacja, prasa, solanka, Cave Log) + kalkulator kiszonek i kimchi (124 BR MUST + 10 SHOULD, ~3–4 tyg. pracy agenta). Kombucha i zaawansowane octy jako etap 1.1.
  * **C (Samo serowarstwo):** Wyłącznie moduł sera (90 BR, ~2.5 tyg.), ale ryzyko odrzucenia przez część użytkowników fermentacji warzywnej.
* **Rekomendacja:** **B+**. Zapewnia natychmiastową unikalność rynkową i spójność mikrobiologiczną.

### **DEC-02 Integracja z bezprzewodowymi czujnikami BLE (RuuviTag, Mijia) w MVP czy w 1.1?**
* **Kontekst:** Użytkownicy piwniczek serowych i komór dojrzewalniczych często stosują termohigrometry BLE. Odczyt bezpośredni w aplikacji eliminuje konieczność ręcznego wpisywania temperatury i wilgotności.
* **Opcje:**
  * **A (W MVP):** Bezpośredni skaner BLE broadcast (pakiet reklamowy Manufacturer Data) dla RuuviTag i Xiaomi Mijia. (+3–4 dni pracy).
  * **B (W 1.1 z ręcznym wprowadzaniem w MVP):** W MVP użytkownik wpisuje odczyty z higrometru ręcznie; w 1.1 dochodzi auto-odczyt BLE.
* **Rekomendacja:** **B** ⚙. Ręczne wprowadzanie jest w 100% niezawodne i nie wymaga fizycznego sprzętu do testów CI.

### **DEC-03 Aplikacja towarzysząca na Apple Watch w MVP?**
* **Kontekst:** Praca ze skrzepem serowym i solanką oznacza mokre dłonie („ręce w serwatce”). Dotykanie ekranu iPhone'a jest uciążliwe.
* **Opcje:**
  * **A (Pełna aplikacja watchOS w MVP):** Stoper flokulacji, podgląd parametrów dojrzewalni, obracanie sera jednym tapnięciem na nadgarstku.
  * **B (Live Activity + powiadomienia interaktywne):** Na zegarku pojawia się widżet Smart Stack / Live Activity z przyciskiem akcji; pełna aplikacja watchOS w wersji 1.1.
* **Rekomendacja:** **B** ⚙. Live Activity doskonale obsługuje timery flokulacji i mieszania bez kosztów osobnego celu watchOS w pierwszym sprincie.

### **DEC-04 Bundle ID aplikacji**
* **Kontekst:** Identyfikator w App Store Connect jest niezmienny po pierwszym wydaniu.
* **Opcje:**
  * **A:** `com.apps4brew.ferment` (neutralne, zunifikowane z domeną marki Apps4Brew).
  * **B:** `com.apps4brew.cheeseandflora` (bardziej opisowe, ale dłuższe).
* **Rekomendacja:** **A** ⚙.

### **DEC-05 Półka cenowa i monetyzacja**
* **Kontekst:** Zgodnie z etosem Apps4Brew („tańsze niż espresso”, bez reklam, bez konta).
* **Opcje:**
  * **A:** 0,99 € / 3,99 zł miesięcznie, 4,99 € / 19,99 zł rocznie, 14,99 € / 59,99 zł dożywotnio (Lifetime).
  * **B:** Tylko jednorazowy zakup 9,99 € / 39,99 zł bez subskrypcji.
* **Rekomendacja:** **A** ⚙. Zapewnia stałą relację z użytkownikami całorocznymi i natychmiastowy zwrot opłaty 99 USD Apple.

---

## **Blok II — W pierwszych 2 tygodniach budowy**

### **DEC-06 Obsługa mleka sklepowego z dodatkiem CaCl2 vs wyłącznie mleko surowe**
* **Kontekst:** Wielu początkujących w miastach ma dostęp tylko do mleka pasteryzowanego w niskiej temperaturze (mikrofiltrowanego). Wymaga ono suplementacji jonów wapnia $Ca^{2+}$.
* **Rekomendacja:** Wsparcie obu wariantów od pierwszego dnia. Algorytm kalkulatora musi automatycznie dobierać dawkę $CaCl_2$ (0.1–0.4 g/L).

### **DEC-07 Domyślna jednostka mocy podpuszczki (IMCU vs 1:10 000)**
* **Kontekst:** Starsza literatura polska operuje stosunkiem objętościowym (np. 1:10 000), a standard międzynarodowy IDF 157 operuje jednostkami IMCU/ml lub IMCU/g.
* **Rekomendacja:** Dwukierunkowy przelicznik w UI z domyślnym przełącznikiem IMCU / Tradycyjna (1:X).

### **DEC-08 Metoda mnożnika flokulacji (Flocculation Multiplier)**
* **Kontekst:** Tradycyjna metoda „krojenie po 45 minutach” prowadzi do błędów wilgotności skrzepu. Metoda flokulacji (czas od dodania podpuszczki do momentu, gdy miseczka na mleku przestaje się obracać, pomnożony przez współczynnik 2–6) jest złotym standardem światowego serowarstwa.
* **Rekomendacja:** Wdrożyć interaktywny asystent flokulacji ze stoperem miseczki jako kluczowy wyróżnik aplikacji.

### **DEC-09 Zakres bazy kultur starterowych w wersji 1.0**
* **Kontekst:** Na rynku dostępne są setki kultur (Danisco Choozit, Chr. Hansen, Sacco, Dalton).
* **Rekomendacja:** Baza predefiniowanych szczepów generycznych (Mezofilne typ O, Mezofilne typ LD z diacetylactis, Termofilne typ T, Termofilne jogurtowe/włoskie, Szlachetne pleśnie i bakterie maziowe) z możliwością dodawania własnych kultur handlowych.

### **DEC-10 Standard obliczania solanek warzywnych: całkowita masa vs objętość wody**
* **Kontekst:** Błąd początkujących polega na soleniu „3% na litr wody”, co przy różnej gęstości upakowania warzyw daje przypadkowe stężenie w tkankach (często poniżej 1.5% -> gnicie).
* **Rekomendacja:** Domyślny tryb „Masa Całkowita” (warzywa + woda = 100%), z wyraźnym ostrzeżeniem edukacyjnym.

---

## **Blok III — Przed publikacją w App Store (TestFlight)**

### **DEC-11 Ochrona przed roszczeniami zdrowotnymi (Apple Guideline 1.4.1)**
* **Kontekst:** Aplikacje o fermentacji i probiotykach bywają odrzucane za twierdzenia medyczne (leczenie jelit, odporność).
* **Rekomendacja:** Neutralny język mikrobiologiczny, brak obietnic medycznych, czytelna klauzula sanitarna w ustawieniach.

### **DEC-12 Bezpieczeństwo jadu kiełbasianego (Clostridium botulinum)**
* **Kontekst:** Przetwory bezkwasowe w oleju lub niedokwaszone warzywa niosą ryzyko botulizmu.
* **Rekomendacja:** Twarda reguła barierowa pH 4.6 – jeśli zmierzone lub przewidywane pH > 4.6, aplikacja wyświetla czerwony alert bezpieczeństwa.

### **DEC-13 Generowanie etykiet i paszportów krążków sera (PDF)**
* **Kontekst:** W dojrzewalni krążki leżą miesiącami. Potrzebne są papierowe etykiety odporne na wilgoć z kodem QR partii.
* **Rekomendacja:** Moduł wydruku arkuszy etykiet przez `expo-print` z unikalnym identyfikatorem partii i parametrami nastawu.

### **DEC-14 Format eksportu i kopii zapasowej**
* **Kontekst:** Użytkownicy nie mogą utracić wielomiesięcznej historii dojrzewania.
* **Rekomendacja:** Pełny eksport JSON zgodny ze standardem studia Apps4Brew + eksport arkusza CSV z partiami do wglądu na komputerze.

### **DEC-15 Nazwa międzynarodowa dla App Store**
* **Kontekst:** W Polsce „FERMENT — Serowarstwo i Kiszonki”. Na rynkach zagranicznych potrzebna krótka, chwytliwa nazwa.
* **Opcje:**
  * A: *Ferment: Artisan Cheese & Flora*
  * B: *Curd & Flora*
  * C: *Affinage: Cheese & Ferment Log*
* **Rekomendacja:** **A**. Buduje natychmiastową rozpoznawalność w kategorii domowej mikrobiologii.
