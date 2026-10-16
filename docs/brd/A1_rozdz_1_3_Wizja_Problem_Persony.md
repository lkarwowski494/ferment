# **FERMENT BRD 0.1 — Część A: Wizja, Problem, Persony (Rozdziały 1–3)**

> **Ekosystem:** Apps4Brew Studio | **Projekt:** FERMENT (Ser i Flora / Mikrobiologia Domowa)  
> **Status:** Wersja robocza 0.1 gotowa do wdrożenia.

---

## **Rozdział 1. Wizja i Tożsamość Produktu**

### **1.1 Wizja (jeden akapit)**
**FERMENT** to profesjonalny, kieszonkowy asystent domowego serowarstwa zagrodowego oraz zaawansowanej fermentacji warzywno-napojowej, który zdejmuje z twórcy niepewność długotrwałych procesów mikrobiologicznych. Zamienia chaotyczne notatki i zawodną pamięć w deterministyczny, naukowo precyzyjny system: przelicza enzymy i kultury z dokładnością do miligramów, prowadzi przez dynamiczne punkty flokulacji skrzepu, czuwa nad mikroklimatem dojrzewalni serów przez setki dni leżakowania krążków i chroni bezpieczeństwo biologiczne domowych kiszonek, kombuchy i octów. Działa w 100% Offline-First, bez logowania, bez serwera i telemetrii, w 35 językach, z poszanowaniem prywatności użytkownika.

**Obietnica marki (do App Store):**  
*„Panuj nad florą, nie zgaduj parametrów — perfekcyjny skrzep serowarski, bezpieczne dojrzewanie i żywa fermentacja w Twoich rękach.”*

### **1.2 Zasady Produktu (ZP-01…ZP-16, nienegocjowalne)**

| Nr | Nazwa zasady | Definicja i uzasadnienie architektoniczne |
| :--- | :--- | :--- |
| **ZP-01** | **100% Offline-First** | Wszystkie obliczenia enzymatyczne, krzywe flokulacji, bazy kultur, kalkulatory solanek i harmonogramy Cave Log działają całkowicie bez dostępu do sieci internetowej. Piwnice serowe i spiżarnie często nie mają zasięgu GSM. |
| **ZP-02** | **Zero Konta i Rejestracji** | Aplikacja uruchamia się bezpośrednio do stanu roboczego. Żadnych ekranów rejestracji, logowania przez Apple/Google, pytań profilowych ani barier wejścia. |
| **ZP-03** | **Zero Telemetrii ("Data Not Collected")** | Brak zewnętrznych SDK analitycznych (Firebase, Mixpanel, Amplitude). Czysta karta prywatności w App Store Privacy Manifest. Dane użytkownika należą wyłącznie do niego. |
| **ZP-04** | **Determinizm Matematyczny i Mikrobiologiczny** | Wzory dawek podpuszczki, stężeń solanek, równowagi kwasowości i kinetyki fermentacji są deterministycznymi funkcjami matematycznymi, w 100% testowanymi wektorami w Jest/CI. Zero generatywnych halucynacji AI w kalkulatorach bezpieczeństwa. |
| **ZP-05** | **Bezpieczeństwo Danych i Trwałość (Zero Data Loss)** | Relacyjna baza SQLite w trybie WAL. Automatyczny backup rotacyjny (10 kopii JSON) przy każdej modyfikacji partii. Eksport i import bazy są bezpłatne i dostępne zawsze. |
| **ZP-06** | **Czysta Ekonomia ("Tańsze niż espresso")** | Brak reklam, brak walut wirtualnych. Przejrzysty darmowy rdzeń narzędziowy + opcjonalny zakup dożywotni (Lifetime 14,99 € / 59,99 zł) lub mikroskopijna subskrypcja (0,99 € / 3,99 zł mies.). |
| **ZP-07** | **Hands-Free & Ergonomia Kuchni** | Projekt interakcji dostosowany do pracy w fartuchu serowarskim: duże cele dotykowe, wsparcie Apple Watch i Garmin, głośne powiadomienia dźwiękowe timera (`expo-av`), Live Activity na zablokowanym ekranie. |
| **ZP-08** | **Barierowe Bezpieczeństwo Sanitarne** | Rygorystyczne egzekwowanie barier biologicznych: granica pH 4.6 (jad kiełbasiany), zasolenie minimalne solanki 16% (patogeny), limity $CaCl_2$. Aplikacja ostrzega przed ryzykiem zepsucia surowca. |
| **ZP-09** | **Prymat Jakości Mleka i Surowca** | Rozróżnienie mleka surowego, pasteryzowanego w niskiej temperaturze i sklepowego. Blokada prób użycia mleka UHT do serów podpuszczkowych z natychmiastowym wyjaśnieniem naukowym. |
| **ZP-10** | **Dostępność jako Fundament (WCAG AAA / VoiceOver)** | Pełne etykiety dostępności, obsługa powiększonego tekstu Dynamic Type, wysoki kontrast kolorystyczny, brak polegania wyłącznie na barwie wskaźników. |
| **ZP-11** | **Wierność Rzemiosłu i Tradycji** | Nazewnictwo zgodne z profesjonalnym słownictwem serowarskim i mikrobiologicznym (skrzep, gęstwa, synereza, harfa, IMCU, affinage, brevibacterium, SCOBY, matka octowa). |
| **ZP-12** | **Wizualna Elegancja Rzemieślnicza** | Paleta barw inspirowana naturą: *Linen & Whey* (len, ciepła serwatka, wosk pszczeli, terakota, szałwiowa zieleń flory). Apple Human Interface Guidelines. |
| **ZP-13** | **Globalna Lokalizacja (35 języków)** | Pełna dwukierunkowa obsługa systemów metrycznych i imperialnych (litry/galony, gramy/uncje, °C/°F, gęstość Baumé/Salometer). Wszystkie teksty przez `t()` bez hardkodowanych literałów. |
| **ZP-14** | **Niezależność od Zewnętrznych Serwerów Chmurowych** | Zerowy koszt utrzymania infrastruktury po stronie twórcy (0 zł poza opłatą Apple). Aplikacja jest samowystarczalna na urządzeniu. |
| **ZP-15** | **Wsparcie Sprzętowe BLE bez Vendor-Lockin** | Otwarty skaner broadcastu Bluetooth LE dla standardowych czujników środowiskowych (RuuviTag, Xiaomi Mijia) bez wymagania chmury producenta. |
| **ZP-16** | **Przejrzystość Edukacyjna** | Każde zalecenie, przelicznik i czas w aplikacji posiada zwięzłe uzasadnienie naukowe („dlaczego tak?”) dostępne pod jednym tapnięciem. |

---

## **Rozdział 2. Analiza Problemu i Dowody Rynkowe**

### **2.1 Rzeczywisty problem domowego serowara i fermentatora**
Wytwarzanie serów podpuszczkowych oraz długoterminowa fermentacja to najbardziej wymagające dziedziny domowej mikrobiologii. W odróżnieniu od pieczenia chleba (gdzie cykl trwa kilkanaście godzin) lub parzenia kawy (kilka minut), **ser dojrzewa od 3 tygodni do 12 miesięcy, a błąd popełniony w pierwszych 30 minutach produkcji ujawnia się dopiero po przekrojeniu krążka po pół roku**.

Kluczowe punkty bólu (zebrane z forów serowarskich, grup dyskusyjnych i recenzji aplikacji w App Store):
1. **Porażka koagulacji przez błędy podpuszczki:** Użytkownicy kupują podpuszczki płynne lub w proszku o nieznanej lub różnej sile (IMCU vs 1:10 000). Dodanie podpuszczki „na oko” skutkuje kruchym, rozpadającym się skrzepem, z którego ucieka tłuszcz, albo gumowatym, gorzkim serem z nadmiaru enzymu.
2. **Pułapka mleka sklepowego:** Brak wiedzy o degradacji jonów wapnia w pasteryzacji. Bez dodania $CaCl_2$ mleko nie tworzy zwięzłego skrzepu.
3. **Zaniedbanie dojrzewalni (Cave Log):** Krążek sera włożony do chłodziarki/piwniczki wymaga regularnego obracania (początkowo codziennie, by serwatka spływała równomiernie), przemywania solanką i kontroli wilgotności (80–90%). Po 2 tygodniach użytkownik zapomina, kiedy krążek był obracany, skórka wysycha i pęka, a wnętrze zasiedlają dzikie pleśnie czarne (*Mucor*).
4. **Niewłaściwa solanka i zniszczenie skórki:** Włożenie sera do solanki zrobionej „na oko” bez buforu wapniowego powoduje natychmiastowe zmycie skórki (śluzowacenie) i zniszczenie struktury sera.
5. **Eksplozje butelek kombuchy w fazie 2F:** Brak kontroli nad refermentacją cukrów w szczelnych butelkach prowadzi do wybuchów szkła w spiżarni lub utraty gazu.
6. **Rozwój pleśni w kiszonkach:** Przeliczenie soli wyłącznie na wodę skutkuje zbyt niskim zasoleniem warzyw, mięknięciem ogórków i rozwojem kożucha mikotoksynowego.

---

## **Rozdział 3. Persony Użytkowników i Sytuacje Życiowe**

### **3.1 Szczegółowe Persony (P1–P8)**

* **P1: Janusz (48 lat) — Serowar Zagrodowy Praktyk.**
  * *Profil:* Posiada 4 kozy i kupuje mleko krowie od sąsiada (40L tygodniowo). Robi sery typu Feta, Koryciński, Gouda i Tomme.
  * *Ból:* Notatki na zatłuszczonych kartkach papieru w serowarni, gubienie informacji, która Gouda leży na której półce w piwnicy i ile tygodni ma dany krążek.
  * *Cel:* Precyzyjny stoper flokulacji, harmonogram docisku prasy dźwigniowej, ewidencja leżakowania z kodami partii.

* **P2: Marta (33 lata) — Miejska Pasjonatka Kiszonek i Kimchi.**
  * *Profil:* Gotuje w bloku, kisi w słojach Weck 2L i kamionkach. Robi kimchi tradycyjne, zakwas z buraków i fermentowane ostre sosy.
  * *Ból:* Niepewność, czy biały nalot na powierzchni to bezpieczne drożdże kożuchujące (Kahm), czy trująca pleśń. Zmienne proporcje soli w przepisach z internetu.
  * *Cel:* Niezawodny kalkulator solanki wagowej, diagnostyk wizualny chorób kiszonek, powiadomienia o odgazowywaniu.

* **P3: Michał (39 lat) — Szef Kuchni i Poszukiwacz Smaku (Kombucha & Octy).**
  * *Profil:* Prowadzi autorską kuchnię rzemieślniczą. Nastawia żywe octy owocowe i fermentuje kombuchę z rzadkich herbat.
  * *Ból:* Brak powtarzalności kwasowości w octach, ryzyko eksplozji butelek przy refermentacji 2F kombuchy.
  * *Cel:* Kontrola stechiometrii octowej (bilans alkohol -> kwas octowy), monitorowanie stopni Brix i ciśnienia CO2.

* **P4: Barbara (58 lat) — Tradycyjna Gospodyni Domowa.**
  * *Profil:* Od lat robi biały twaróg i proste sery podpuszczkowe na święta z mleka od zaufanego rolnika.
  * *Ból:* Małe litery w telefonie, skomplikowane aplikacje wymagające logowania.
  * *Cel:* Prosty interfejs z dużymi przyciskami (Dynamic Type), kalkulator przeliczający „ile kropli podpuszczki na 15 litrów mleka”.

* **P5: Paweł (26 lat) — Początkujący Biohaker / Zdrowe Jelita.**
  * *Profil:* Chce wytwarzać w domu fermentowaną żywność bogatą w żywe kultury bakterii (probiotyki).
  * *Ból:* Brak wiedzy biologicznej, lęk przed zatruciem jadem kiełbasianym lub bakteriami gnilnymi.
  * *Cel:* Edukacyjny asystent bezpieczeństwa z twardymi progami pH i jasnymi wskazówkami higienicznymi.

* **P6: Tomasz (42 lata) — Zaawansowany Serowar Hobbysta (Affinage Enthusiast).**
  * *Profil:* Przerobił winiarkę na profesjonalną jaskinię serową (cheese cave) z nawilżaczem ultradźwiękowym i regulatorem temperatury Inkbird. Dojrzewa sery maziowe (Munster, Taleggio) i z niebieską pleśnią (Gorgonzola).
  * *Ból:* Pielęgnacja skórki wymaga skomplikowanego kalendarza (przemywanie solanką co 2 dni, potem co 4, nakłuwanie igłami w 14. dobie).
  * *Cel:* Precyzyjny Cave Log z integracją bezprzewodowego sensora BLE (temperatura i wilgotność na żywo) i alarmem wysychania skórki.

* **P7: Anna (31 lat) — Wytwórca Mikro-Rzemieślniczy (Sprzedaż Bezpośrednia RHD).**
  * *Profil:* Prowadzi Rolniczy Handel Detaliczny, sprzedaje sery i zakwasy na jarmarkach ekologicznych.
  * *Ból:* Konieczność ścisłego kalkulowania kosztu surowca (mleko, kultury, prąd, sól) i wydajności serowej (% yield) oraz drukowania etykiet z datami partii.
  * *Cel:* Kalkulator kosztu kręgu sera, kalkulator uzysku z litra mleka oraz druk etykiet PDF z kodami QR.

* **P8: Piotr (35 lat) — Niewidomy Użytkownik Korzystający z VoiceOver.**
  * *Profil:* Pasjonat gotowania i fermentacji domowej, w pełni zależny od czytnika ekranu Apple VoiceOver.
  * *Ból:* Aplikacje kulinarne mają niezaetykietowane przyciski (np. „button_3”), a wykresy i suwaki są niedostępne.
  * *Cel:* 100% dostępność WCAG AAA: każdy element ma logiczną etykietę tekstową, wartość liczbową i informację o jednostce miary.

---

### **3.2 Sytuacje Życiowe (SYT-01…SYT-15)**
* **SYT-01 (Mleko w garnku):** Garnek 20L z mlekiem podgrzewa się na kuchence. Użytkownik musi szybko sprawdzić dawkę kultur termofilnych i podpuszczki, mając mokre ręce.
* **SYT-02 (Czekanie na flokulację):** Miseczka unosi się na powierzchni zaprawionego mleka. Użytkownik delikatnie ją popycha, czekając na opór zżelowanego płynu, aby wcisnąć stoper jednym stuknięciem na Apple Watch.
* **SYT-03 (Cięcie i dogrzewanie):** Skrzep został pocięty na ziarno wielkości kukurydzy. Aplikacja odmierza czas osadzania (5 min) i prowadzi przez krzywą dogrzewania (nie szybciej niż 1°C na 2 minuty).
* **SYT-04 (Prasa serowarska):** Krążek w chuście serowarskiej trafia pod prasę. Aplikacja wyznacza 4 etapy nacisku z przypomnieniami o odwróceniu i zmianie chusty.
* **SYT-05 (Wyjmowanie z solanki w nocy):** Krążek 2 kg leży w solance. Czas mija o 23:45. Aplikacja wysyła powiadomienie z dźwiękiem, by ser nie uległ przesoleniu.
* **SYT-06 (Kontrola jaskini dojrzewalniczej):** Użytkownik schodzi do piwnicy z telefonem. Aplikacja pobiera przez BLE odczyt: 12.2°C, 88% RH. Wyświetla listę: krążek #12 obrócić, krążek #09 przemyć solanką maziową.
* **SYT-07 (Nastawianie kimchi):** Poszatkowane 5 kg kapusty pekińskiej. Użytkownik wybiera metodę zasolenia na sucho (8% soli na 4 godziny). Aplikacja wylicza wagę soli i przypomina o trzykrotnym płukaniu.
* **SYT-08 (Butelkowanie kombuchy):** Kombucha 1F osiągnęła pH 3.0. Użytkownik przelewa ją do butelek z dodatkiem musu z marakui. Aplikacja wyznacza czas 2F (3 dni w 22°C) i ostrzega o konieczności schłodzenia przed otwarciem.
* **SYT-09 (Matka octowa na cydrze):** Użytkownik ma 5 litrów domowego cydru 6% ABV. Aplikacja instruuje, jak zabezpieczyć słoik gazą i oblicza przewidywaną kwasowość octu (5.4% kwasu octowego) po 8 tygodniach.
* **SYT-10 (Biały kożuch na ogórkach):** Na 7. dzień fermentacji ogórków pojawia się biała, pofałdowana błonka. Użytkownik uruchamia Diagnostyka: system identyfikuje drożdże kożuchujące (Kahm), podaje instrukcję zebrania łyżką i zaleca sprawdzenie szczelności docisku.
* **SYT-11 (Wzdęcie wczesne krążka sera):** W 3. dobie dojrzewania krążek sera wybrzusza się jak balonik. Diagnostyk rozpoznaje wzdęcie wczesne (bakterie z grupy Coli / drożdże), wyjaśnia przyczynę (brak higieny udoju mleka surowego) i informuje o niezdatności partii do spożycia.
* **SYT-12 (Pękanie skórki sera):** Po 3 tygodniach Gouda ma głęboką rysę na boku. Diagnostyk wykrywa zbyt niski poziom wilgotności w chłodziarce (< 75% RH) i zaleca natychmiastowe zabezpieczenie oliwą lub parafiną.
* **SYT-13 (Kalkulacja kosztu jarmarku):** Wytwórca zagrodowy musi wycenić krążek sera 1.5 kg. Aplikacja sumuje: 15L mleka (60 zł), podpuszczka i kultury (4 zł), prąd i sól (3 zł). Uzysk: 10.2%. Koszt jednostkowy: 44.66 zł/kg.
* **SYT-14 (Etykieta z kodem QR):** Gotowy ser trafia do leżakowania. Użytkownik drukuje miniaturową etykietę PDF z kodem QR partii i nakleja ją na półkę.
* **SYT-15 (Głosowe sterowanie VoiceOver):** Niewidomy serowar przy użyciu gestów VoiceOver sprawdza odliczanie timera dogrzewania skrzepu bez patrzenia na ekran.
