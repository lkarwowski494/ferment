# **FERMENT BRD 0.1 — Część A: Rynek, Model Przychodu i Zakres (Rozdziały 4–6.1)**

> **Ekosystem:** Apps4Brew Studio | **Projekt:** FERMENT (Ser i Flora / Mikrobiologia Domowa)

---

## **Rozdział 4. Analiza Rynku i Konkurencji**

### **4.1 Wielkość rynku i trendy kulturowe**
Rynek domowego przetwórstwa i mikrobiologii rzemieślniczej znajduje się w fazie gwałtownego wzrostu, napędzanego przez trzy globalne megatrendy:
1. **Zdrowie mikrobiomu i żywność fermentowana:** Badania naukowe nad osią jelitowo-mózgową i mikrobiotą doprowadziły do eksplozji zainteresowania produktami probiotycznymi z żywymi kulturami bakterii (kombucha, kimchi, żywe octy, sery z surowego mleka).
2. **Rzemiosło domowe (Homesteading & DIY Food):** Wzrost cen żywności rzemieślniczej w delikatesach sprawia, że coraz więcej osób inwestuje w mały sprzęt serowarski (prasy, garnki, formy) i wytwarza sery we własnej kuchni.
3. **Rolniczy Handel Detaliczny (RHD) i mikromleczarnie:** W Polsce i Europie rozwija się ruch małych przetwórców wiejskich sprzedających sery zagrodowe bezpośrednio konsumentom.

* **Dane rynkowe (USA):** Wartość rynku domowej fermentacji szacowana jest na ponad 850 mln USD rocznie. Społeczności takie jak r/cheesemaking (ponad 110 tys. członków), r/fermentation (ponad 350 tys. członków), r/Kombucha (ponad 160 tys. członków) wykazują stały, wielotysięczny napływ nowych hobbystów miesięcznie.
* **Dane rynkowe (Polska i region CEE):** Polska posiada jedną z najsilniejszych tradycji kiszonkarskich na świecie (ogórki, kapusta, żur, zakwas buraczany) oraz dynamicznie odradzające się tradycje serowarstwa zagrodowego (Korycin, Podhale, Mazury, Kaszuby).

### **4.2 Analiza obecnych rozwiązań i luki rynkowej**
Analiza konkurencyjnych aplikacji w App Store i Google Play wykazuje rażącą lukę:
* **Brak dedykowanych aplikacji dla serowarstwa:** Istniejące nieliczne kalkulatory to albo archaiczne arkusze kalkulacyjne Excel, albo proste webowe kalkulatory z lat 2005–2012 nieprzystosowane do ekranów mobilnych.
* **Aplikacje z przepisami ogólnokulinarnymi:** Zawierają powierzchowne, często błędne przepisy (sztywne czasy koagulacji bez flokulacji, brak bilansowania wapnia).
* **Brak cyfrowego dziennika dojrzewania (Cave Log):** Nie istnieje na rynku żadna nowoczesna, natywna aplikacja iOS pozwalająca na profesjonalne zarządzanie leżakowaniem serów, harmonogramami przemywania maziowego i monitoringiem mikroklimatu.
* **Przeładowanie reklamami i subskrypcjami:** Aplikacje kulinarne wymuszają drogie subskrypcje (30–60 USD/rok) i agresywnie śledzą użytkowników.

**Wniosek strategiczny FERMENT:** Wypełnienie niszy profesjonalnego, deterministycznego, bezserwerowego asystenta mikrobiologii domowej w etosie rzemieślniczym Apps4Brew.

---

## **Rozdział 5. Model Przychodu i Ekonomia Projektu**

### **5.1 Półka cenowa i struktura opłat**
Zgodnie ze standardem studia Apps4Brew:
* **Darmowy Rdzeń Narzędziowy (Free Tier):**
  * Kalkulator podpuszczki i podstawowych kultur serowarskich.
  * Stoper flokulacji i podstawowy timer obróbki skrzepu.
  * Kalkulator solanki warzywnej (tryb masa całkowita).
  * Cave Log z limitem do 3 aktywnych krążków/partii w leżakowaniu.
  * Dostęp do bazy wiedzy podstawowej.
* **Wersja Pełna (FERMENT PRO — Lifetime & Subskrypcja):**
  * Nielimitowany Cave Log i ewidencja partii (dziesiątki krążków i słojów).
  * Zaawansowany asystent przemywania maziowego i pleśni szlachetnych.
  * Asystent kombuchy 2F (ciśnienie CO2) i zaawansowanych octów żywych.
  * Bezpośrednia integracja z bezprzewodowymi czujnikami BLE (RuuviTag, Mijia).
  * Wydruk etykiet i paszportów krążków PDF z kodami QR (`expo-print`).
  * Asystent Apple Watch & Live Activity.
  * Diagnostyk chorób i wad serowarskich (Troubleshooting Doctor).

| Opcja zakupu | Cena EUR | Cena PLN | Charakterystyka |
| :--- | :--- | :--- | :--- |
| **Miesięczna** | 0,99 € | 3,99 zł | Dla osób robiących ser sezonowo (np. wiosna/lato przy dostępności mleka). |
| **Roczna** | 4,99 € | 19,99 zł | Dla regularnych domowych serowarów i fermentatorów. |
| **Dożywotnia (Lifetime)** | 14,99 € | 59,99 zł | Jednorazowa opłata na zawsze. Najchętniej wybierana w rzemiośle. |

### **5.2 Rachunek zwrotu kosztów stałych (Apple Developer 99 USD)**
Aplikacja generuje **0 zł kosztów zmiennych** (brak chmury, brak serwerów API, brak AI w chmurze, brak baz zewnętrznych). Jedynym kosztem stałym jest roczna opłata Apple Developer Program (99 USD ≈ 395 zł netto / 485 zł brutto).

Rachunek zwrotu w polskim App Store (po potrąceniu 15% prowizji Apple w Small Business Program i podatków):
* Przy zakupie Lifetime (59,99 zł brutto → ok. 40,65 zł netto dla twórcy): **wystarczy 10 zakupów dożywotnich rocznie**, aby w pełni sfinansować konto deweloperskie.
* Przy subskrypcji rocznej (19,99 zł brutto → ok. 13,55 zł netto): **wystarczy 29 subskrypcji rocznych**.
Każdy kolejny zakup stanowi czysty zysk studia.

---

## **Rozdział 6. Zakres Funkcjonalny i Granice Systemu (6.1)**

### **6.1 Co aplikacja robi, a czego NIE robi (Granice systemu)**

* **Co FERMENT robi:**
  1. Wylicza precyzyjne dawki podpuszczki, enzymów, soli, kwasów i kultur bakteryjnych w oparciu o parametry chemiczne i fizyczne surowca.
  2. Prowadzi użytkownika krok po kroku przez proces wytwarzania sera: od inokulacji, przez flokulację, cięcie, osuszanie, dogrzewanie, prasowanie, aż po kąpiel solankową.
  3. Rejestruje proces dojrzewania w jaskini serowej (Cave Log), wysyła powiadomienia o obracaniu, przemywaniu i zabiegach pielęgnacyjnych.
  4. Nadzoruje parametry fermentacji kiszonek, kombuchy i octów z uwzględnieniem barier mikrobiologicznych (pH 4.6).
  5. Integruje się z czujnikami BLE i zegarkami Apple/Garmin.
  6. Ewidencjonuje surowce w spiżarni z automatycznym odpisywaniem zużytych gramów/mililitrów po zakończonej sesji.

* **Czego FERMENT NIE robi (Czarne granice):**
  1. **Nie steruje fizycznymi przekaźnikami sprzętowymi:** Aplikacja nie jest systemem automatyki przemysłowej (SCADA/IoT) włączającym grzałki czy kompresory chłodnicze.
  2. **Nie udziela porad medycznych ani dietetycznych:** Nie diagnozuje chorób układu pokarmowego, nie obiecuje wyleczenia dolegliwości probiotykami.
  3. **Nie zawiera funkcji społecznościowych w chmurze (Zero Cloud Social):** Brak publicznych profili, lajków, komentarzy i forów internetowych.
  4. **Nie przechowuje danych użytkownika na zewnętrznych serwerach:** Całość danych spoczywa w lokalnej bazie SQLite na urządzeniu.
