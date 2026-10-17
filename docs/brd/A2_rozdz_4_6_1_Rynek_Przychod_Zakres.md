# **SEROWAR BRD 0.1 — Część A: Rynek, Model Przychodu i Zakres (Rozdziały 4–6.1)**

> **Ekosystem:** Apps4Brew Studio | **Projekt:** SEROWAR (Rzemieślnicze Przetwórstwo Mleka)

---

## **Rozdział 4. Analiza Rynku i Konkurencji**

### **4.1 Wielkość rynku i trendy kulturowe**
Rynek rzemieślniczego przetwórstwa mleka, serowarstwa zagrodowego i domowej produkcji nabiału przeżywa renesans napędzany przez trzy globalne megatrendy:
1. **Renesans tradycyjnego przetwórstwa nabiału (Artisan Dairy & Homesteading):** Gwałtowny wzrost cen masła, serów dojrzałych i twarogów w delikatesach sprawia, że konsumenci poszukują prawdziwego smaku nieprzemysłowego mleka i inwestują w mały sprzęt serowarski.
2. **Rolniczy Handel Detaliczny (RHD) i mikromleczarnie:** W Polsce, Francji, Włoszech i całej Europie rozwija się ruch małych przetwórców wiejskich przetwarzających mleko bezpośrednio w gospodarstwach (sery korycińskie, kozie goudy, bundz, oscypek, masło z maślanek).
3. **Świadomość surowca i czysta etykieta (Clean Label):** Konsumenci odrzucają nabiał ze skrobią modyfikowaną, tłuszczem palmowym i zagęszczaczami na rzecz autentycznego twarogu ze zsiadłego mleka, masła ze śmietany ukwaszonej i czystego ghee.

* **Dane rynkowe (Globalne):** Społeczności takie jak r/cheesemaking (ponad 110 tys. członków), r/homestead (ponad 2.8 mln członków) wykazują stały napływ hobbystów poszukujących rzetelnej wiedzy technologicznej.
* **Dane rynkowe (Polska i CEE):** Polska jest 4. producentem mleka w UE, z potężną tradycją twarogów klinkowych, serów zagrodowych i maślanki. Rynek bezpośredniej sprzedaży mleka i serowarstwa domowego liczy ponad 150 tys. aktywnych praktyków.

### **4.2 Analiza obecnych rozwiązań i luki rynkowej**
Analiza oferty w App Store i Google Play wykazuje całkowitą lukę w kategorii dedykowanych narzędzi mleczarskich:
* **Brak dedykowanych aplikacji serowarskich:** Dostępne kalkulatory to archaiczne arkusze Excela lub prymitywne strony www z lat 2005–2010.
* **Brak cyfrowego dziennika dojrzewania (Cave Log):** Nie istnieje na rynku żadna nowoczesna, natywna aplikacja iOS pozwalająca na profesjonalne zarządzanie leżakowaniem serów, harmonogramami przemywania maziowego i monitoringiem mikroklimatu.
* **Brak narzędzi dla masielnictwa i obiegu serwatki:** Żadna aplikacja na świecie nie łączy kalkulatora podpuszczki z technologią zmaślania śmietany, koagulacją twarogu oraz odzyskiem serwatki na Ricottę i Brunost.
* **Przeładowanie reklamami i wymuszone logowanie:** Typowe aplikacje kulinarne wymagają rejestracji i śledzą użytkowników.

**Wniosek strategiczny SEROWAR:** Stworzenie bezkonkurencyjnego, deterministycznego, bezserwerowego asystenta mleczarskiego o niezrównanej jakości inżynieryjnej.

---

## **Rozdział 5. Model Przychodu i Ekonomia Projektu**

### **5.1 Półka cenowa i struktura opłat**
Zgodnie ze standardem studia Apps4Brew:
* **Darmowy Rdzeń Narzędziowy (Free Tier):**
  * Kalkulator mleka, podpuszczki IMCU i kultur starterowych.
  * Stoper flokulacji i timer obróbki skrzepu.
  * Podstawowy kalkulator twarogu i zmaślania śmietanki.
  * Cave Log z limitem do 3 aktywnych krążków w leżakowaniu.
  * Dostęp do bazy wiedzy podstawowej.

* **Wersja Pełna (SEROWAR PRO — Lifetime & Subskrypcja):**
  * Nielimitowany Cave Log i ewidencja partii (dziesiątki krążków).
  * Zaawansowany asystent przemywania maziowego i pleśni szlachetnych.
  * Moduł zamkniętego obiegu serwatki (karmelizacja Brunost i termiczna Ricotta).
  * Bezpośrednia integracja z bezprzewodowymi czujnikami BLE (RuuviTag, Mijia).
  * Wydruk etykiet i paszportów krążków PDF z kodami QR (`expo-print`).
  * Asystent Apple Watch & Live Activity ("ręce w serwatce").
  * Diagnostyk wad sera, masła i mleka (Cheese & Dairy Doctor).

| Opcja zakupu | Cena EUR | Cena PLN | Charakterystyka |
| :--- | :--- | :--- | :--- |
| **Miesięczna** | 0,99 € | 3,99 zł | Dla osób robiących ser sezonowo (wiosna/lato). |
| **Roczna** | 4,99 € | 19,99 zł | Dla regularnych domowych serowarów i mleczarzy. |
| **Dożywotnia (Lifetime)** | 14,99 € | 59,99 zł | Jednorazowa opłata na zawsze. Najchętniej wybierana w rzemiośle. |

### **5.2 Rachunek zwrotu kosztów stałych (Apple Developer 99 USD)**
Aplikacja generuje **0 zł kosztów zmiennych** (brak chmury, brak zewnętrznych API). Jedynym kosztem stałym jest roczna opłata deweloperska Apple (99 USD ≈ 395 zł netto).
* Przy zakupie Lifetime (59,99 zł brutto → ok. 40,65 zł netto dla twórcy): **wystarczy 10 zakupów dożywotnich rocznie**, aby w pełni sfinansować konto Apple.
* Przy subskrypcji rocznej (19,99 zł brutto → ok. 13,55 zł netto): **wystarczy 29 subskrypcji rocznych**.
Każdy kolejny zakup stanowi czysty zysk studia.

---

## **Rozdział 6. Zakres Funkcjonalny i Granice Systemu (6.1)**

### **6.1 Co aplikacja robi, a czego NIE robi (Granice systemu)**

* **Co SEROWAR robi:**
  1. Wylicza precyzyjne dawki podpuszczki IMCU, kultur DVI, chlorku wapnia i soli w oparciu o parametry surowca mlecznego.
  2. Prowadzi użytkownika krok po kroku przez koagulację, stoper flokulacji, cięcie skrzepu harfą, rampę dogrzewania gęstwy i prasowanie.
  3. Rejestruje proces dojrzewania w jaskini serowej (Cave Log), wysyła powiadomienia o obracaniu, przemywaniu maziowym i pielęgnacji skórki.
  4. Nadzoruje kwasową koagulację twarogu (pI 4.6), dogrzewanie skrzepu kwasowego i ociekanie w chuście serowarskiej.
  5. Prowadzi proces zmaślania śmietanki w optymalnej temperaturze (10–14°C), płukania wodą lodową i wytapiania ghee.
  6. Prowadzi procesy fermentacji mlekowej jogurtu i tradycyjnego kefiru oraz odzysku serwatki na Ricottę i Brunost.
  7. Ewidencjonuje surowce w spiżarni z automatycznym odpisywaniem zużytych ilości i generuje etykiety PDF z kodami QR.

* **Czego SEROWAR NIE robi (Czarne granice):**
  1. **Nie obsługuje produktów niemlecznych:** Zgodnie z decyzjami DEC-BA-01 i DEC-BA-02 z aplikacji trwale usunięto fermentację warzywną, kombuchę i octy.
  2. **Nie steruje przekaźnikami sprzętowymi (SCADA/IoT):** Nie włącza fizycznych grzałek ani kompresorów chłodniczych.
  3. **Nie udziela porad medycznych ani dietetycznych:** Nie diagnozuje chorób układu pokarmowego.
  4. **Nie zawiera funkcji społecznościowych w chmurze:** Brak publicznych profili, forów i lajków.
  5. **Nie przechowuje danych użytkownika na serwerach zewnętrznych:** Całość bazy spoczywa w lokalnym SQLite na urządzeniu.
