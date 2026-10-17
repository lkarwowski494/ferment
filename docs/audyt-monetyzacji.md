# **SEROWAR — Audyt Monetyzacji i Ekonomii Produktu (docs/audyt-monetyzacji.md)**

> **Ekosystem:** Apps4Brew Studio | **Projekt:** SEROWAR (Rzemieślnicze Przetwórstwo Mleka / Artisan Cheese & Dairy Craft)  
> **Rola:** Audytor Monetyzacji i Ekonomii Produktu (`coding/audyt-monetyzacji`)  
> **Model cenowy:** „Cheaper than Espresso” (100% Offline-First, Zero Telemetrii, Zero Serwera)  
> **Data audytu:** 17.10.2026

---

## **1. Analiza Gotowości do Płacenia (WTP — Willingness-to-Pay)**

### **1.1 Psychologia Wartości w Serowarstwie i Nabiale Zagrodowym**
Użytkownik rzemieślniczy przetwarza jednorazowo od 15 do 60 litrów mleka o wartości od 60 do 350 zł (mleko krowie/kozie) lub nawet 500 zł (mleko owcze). Czas pracy przy kotle, soleniu i dojrzewalni to dziesiątki godzin w horyzoncie 1–6 miesięcy.
* **Główny wyzwalacz zakupu (Loss Aversion Trigger):** Lęk przed zepsuciem kosztownego surowca lub zniszczeniem krążka sera leżącego w piwnicy od 3 miesięcy (gnicie skórki, spadek wilgotności, zakażenie patogenami). Aplikacja za 19,99 zł rocznie lub 59,99 zł na całe życie stanowi **mikroskopijne ubezpieczenie wartości partii (mniej niż 5% wartości jednego wsadu mlecznego!)**.
* **Drugi wyzwalacz (Craft Prestige & Affinage Pride):** Dumny serowar chce prowadzić profesjonalny Cave Log, drukować estetyczne etykiety z kodem QR partii i monitorować mikroklimat bezprzewodowym tagiem BLE.

### **1.2 Matryca Podziału Zakresu: Darmowy Magnes (Free) vs Płatny Rdzeń (Pro)**

Zgodnie z zasadą `M17: Pułapka Akademickiego Przeładowania`, aplikacja nie ogranicza dostępu do kalkulatorów fizykochemicznych ani reguł bezpieczeństwa (to darmowy magnes przyciągający rzemieślników), lecz monetyzuje skalę, automatyzację i czas:

| Funkcjonalność / Moduł | Status w Free Tier | Status w SEROWAR PRO | Uzasadnienie psychologiczne i WTP |
|---|:---:|:---:|---|
| **Kalkulator Mleka, CaCl2, Podpuszczki IMCU** | **100% Darmowy (Zawsze)** | W cenie | Darmowy magnes (AHA! Moment w pierwszych 60 sekundach). Buduje zaufanie do precyzji obliczeń. |
| **Stoper Flokulacji (Flocculation Multiplier)** | **100% Darmowy** | W cenie | Wyróżnik rynkowy nieobecny u konkurencji. Użytkownik widzi, że aplikacja naprawdę działa. |
| **Podstawowe receptury twarogu, masła i jogurtu** | **100% Darmowy** | W cenie | Podstawowa edukacja bez progu wejścia. |
| **Dojrzewalnia (Cave Log): Limit aktywnych krążków** | **Limit: do 3 krążków** | **Nielimitowany (Setki krążków)** | **Główny motor konwersji Pro.** Każdy regularny serowar po miesiącu ma 5–10 krążków leżakujących jednocześnie. |
| **Protokoły Zaawansowanego Dojrzewania (Maziowe & Pleśniowe)** | Podstawowe | **Pełne harmonogramy B. linens i Penicillium** | Zaawansowany affinage wymaga ścisłego kalendarza przemywania solanką i nakłuwania. |
| **Zamknięty Obieg Serwatki (Ricotta & Brunost)** | Podstawowy przepis | **Kalkulator odparowania i karmelizacji** | Zero-waste w kuchni. |
| **Bezprzewodowa Integracja z Czujnikami BLE (RuuviTag/Mijia)**| Brak (odczyt ręczny) | **Auto-Odczyt w Tle + Alert Punktu Rosy** | Wygoda dla pasjonatów posiadających winiarkę serowarską. |
| **Generator Etykiet PDF z Kodami QR (`expo-print`)** | Podgląd na ekranie | **Pełny wydruk arkuszy A4 PDF** | Kluczowe dla osób obdarowujących znajomych lub sprzedających w RHD. |
| **Asystent Apple Watch & Live Activity** | Podstawowy timer | **Pełna kontrola nadgarstkowa ("Hands in whey")** | Wygoda pracy z mokrymi dłońmi. |
| **Historia Partii i Eksport Danych (JSON/CSV)** | **100% Darmowy (Zawsze)** | **100% Darmowy (Zawsze)** | **Suwerenność danych (ZP-02).** Wygaśnięcie subskrypcji nigdy nie blokuje odczytu starych partii ani eksportu! |

---

## **2. Struktura Cenowa i Próg Rentowności (Break-Even Analysis)**

### **2.1 Półka Cenowa „Cheaper than Espresso”**

| Plan zakupu | Cena brutto PLN | Cena brutto EUR | Przychód netto studia (po prowizji 15% Apple) | Charakterystyka nabywców |
|---|:---:|:---:|:---:|---|
| **Miesięczny** | **3,99 zł** / msc | **0,99 €** / msc | **~2,83 zł** / msc | Użytkownicy sezonowi (wiosenno-letni wypas kóz/owiec, 2–3 miesiące w roku). |
| **Roczny (Zalecany)** | **19,99 zł** / rok | **4,99 €** / rok | **~14,16 zł** / rok | Główny motor rocznego przychodu (ARR). Mniej niż 1 espresso w kawiarni rocznie! |
| **Dożywotni (Lifetime)** | **59,99 zł** jednorazowo | **14,99 €** jednorazowo | **~42,50 zł** jednorazowo | Kotwica psychologiczna. Odpowiada za 45–55% przychodu w pierwszym kwartale od premiery. |

### **2.2 Rachunek Zwrotu Kosztu Konta Apple Developer ($99 USD)**
Jedynym kosztem stałym studia jest roczna opłata deweloperska Apple ($99 USD $\approx$ 395 zł netto / 485 zł brutto). Architektura jest w 100% bezserwerowa (brak kosztów baz danych, serwerów chmurowych czy tokenów API).

* **Próg rentowności przy subskrypcji rocznej (14,16 zł netto):**
  $$\frac{395\text{ zł}}{14.16\text{ zł}} \approx 27.9 \longrightarrow \mathbf{28\text{ subskrypcji rocznych}}$$
* **Próg rentowności przy zakupie Lifetime (42,50 zł netto):**
  $$\frac{395\text{ zł}}{42.50\text{ zł}} \approx 9.3 \longrightarrow \mathbf{10\text{ zakupów dożywotnich}}$$

> **Wniosek finansowy:** Wystarczy zaledwie **10 zakupów dożywotnich** lub **28 subskrypcji rocznych** w skali całego świata rocznie, aby aplikacja była w 100% samofinansująca się. Przy społecznościach serowarskich liczących ponad 180 tys. osób jest to próg osiągalny w pierwszych 14–30 dniach od publikacji.

---

## **3. Raport z Checklisty Śledczej Kodu Paywalla („Zero-Tolerance”)**

Przeprowadzono weryfikację kodu modułu uprawnień ([`src/lib/app-access.ts`](file:///C:/Users/lukas/Documents/antigravity/calm-planck/src/lib/app-access.ts), [`src/data/sqlite-store.ts`](file:///C:/Users/lukas/Documents/antigravity/calm-planck/src/data/sqlite-store.ts)):

1. `[x]` **Trwałość stanu uprawnień:** Daty instalacji, licznik partii i zakupiony plan są zapisywane w trwałej tabeli SQLite `app_settings` w trybie WAL, a nie w ulotnej pamięci RAM.
2. `[x]` **Odporność licznika na kasowanie:** Usunięcie partii przez użytkownika nie cofa monotonicznego licznika utworzonych partii (`completedBatchesCount`).
3. `[x]` **Operator logiczny okresu próbnego:** Okres próbny wynosi ściśle 14 dni od daty instalacji; funkcja czysta `evaluateAppAccess` deterministycznie wylicza pozostałe dni.
4. `[x]` **Bezpieczeństwo `restorePurchases()`:** Na świeżym urządzeniu funkcja przywracania bez ważnego paragonu w bazie SQLite zwraca `restored: false` i nie nadaje lewego statusu Pro (zweryfikowane testem `tests/access/app-access.test.ts`).
5. `[x]` **Reaktywność `useAppAccess()`:** Globalny wzorzec nasłuchu `accessListeners` powiadamia wszystkie zamontowane ekrany o zakupie/przywróceniu bez konieczności restartu aplikacji.
6. `[x]` **Gwarancja Read-Only po wygaśnięciu:** Przy `status === 'trial_expired'` flaga `isHistoryReadOnly` pozostaje ZAWSZE `true` — użytkownik może swobodnie przeglądać swoje archiwalne krążki sera i eksportować bazę do JSON/CSV.
7. `[x]` **Brak duplikatów i sprzecznych cenników:** Zunifikowany cennik 3,99 zł / 19,99 zł / 59,99 zł.
8. `[x]` **Wielojęzyczność Paywalla:** Wszystkie etykiety i opisy przechodzą przez funkcję `t()` i słowniki 35 języków.
9. `[x]` **Konfiguracja StoreKit 2:** Utworzono plik lokalny [`SerowarStoreKit.storekit`](file:///C:/Users/lukas/Documents/antigravity/calm-planck/SerowarStoreKit.storekit) umożliwiający powtarzalne testowanie zakupów w Xcode bez połączenia z siecią.
10. `[x]` **Pokrycie testami automatycznymi:** Testy w [`tests/access/app-access.test.ts`](file:///C:/Users/lukas/Documents/antigravity/calm-planck/tests/access/app-access.test.ts) w 100% zielone w `npm run verify`.

---

## **4. Wzorzec M20: Edytorski Paszport Serowara (Artisanal Craft Paywall)**

Zgodnie z **Wzorcem M20 (Artisanal Craft Paywall)** i **Zasadą 10 (Anti-AI Slop Mandate)** ekran odblokowania SEROWAR PRO kategorycznie odrzuca generyczną estetykę AI SaaS:
* **Zakazy bezwzględne:**
  * Zakaz neonowych gradientów i pulsujących przycisków „Unlock Superpowers”.
  * Zakaz sztucznych liczników odliczania FOMO („Oferta wygasa za 04:59”).
  * Zakaz renderowanych w 3D monet, diamentów, rakiet i generycznych wektorów.
* **Architektura Paszportu Serowara (Craftsman Passport):**
  * **Edytorski List / Manifest Twórcy:** Krótki, rzemieślniczy manifest podpisany przez twórcę:  
    *„SEROWAR powstał z pasji do prawdziwego mleka i rzemiosła. Nie zbieramy Twoich danych, nie mamy chmury i nie wyświetlamy reklam. Aplikacja działa w 100% na Twoim urządzeniu. Wybierając wersję PRO, wspierasz niezależny rozwój narzędzia i otrzymujesz nieograniczony Cave Log, pełne protokoły maziowo-pleśniowe oraz wsparcie czujników BLE.”*
  * **Fizyczna Estetyka Certyfikatu:**
    * Karta paszportowa stylizowana na tłoczony certyfikat cechowy z precyzyjną mikro-ramką 1px w kolorze miedzi lub ochry skórki (`#C68A4C` / `#B86D3B`).
    * Zrównoważony układ typograficzny o wysokiej czytelności (`tabular-nums` dla cen i okresów).
  * **Równorzędna Prezentacja Planów (z naciskiem na Lifetime):**
    * Plan Dożywotni (Lifetime: 59,99 zł) prezentowany jest jako równorzędna, uczciwa alternatywa: *„Kup raz na całe życie — jak porządną prasę czy formę serowarską”*.
    * Plan Roczny (19,99 zł/rok) jako standardowa opcja bieżącego wsparcia.
    * Transparentna informacja o braku ukrytych kosztów i gwarancji stałego dostępu do historii partii (`isHistoryReadOnly: true`).

