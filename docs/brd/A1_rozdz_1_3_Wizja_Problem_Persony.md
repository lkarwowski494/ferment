# **SEROWAR BRD 0.1 — Część A: Wizja, Problem, Persony (Rozdziały 1–3)**

> **Ekosystem:** Apps4Brew Studio | **Projekt:** SEROWAR (Rzemieślnicze Przetwórstwo Mleka / Artisan Cheese & Dairy Craft)  
> **Status:** Wersja robocza 0.1 gotowa do wdrożenia.

---

## **Rozdział 1. Wizja i Tożsamość Produktu**

### **1.1 Wizja (jeden akapit)**
**SEROWAR** to profesjonalny, kieszonkowy asystent domowego i zagrodowego przetwórstwa mleka, który zdejmuje z rzemieślnika niepewność skomplikowanych procesów biochemicznych, enzymatycznych i termicznych. Zamienia chaotyczne notatki i zawodną pamięć w deterministyczny, naukowo precyzyjny system: przelicza dawki chymozyny w międzynarodowych jednostkach IMCU i odmierza dynamiczne punkty flokulacji skrzepu, czuwa nad mikroklimatem dojrzewalni serów przez setki dni leżakowania krążków (Cave Log), prowadzi przez delikatną synerezę tradycyjnego twarogu klinkowego, asystuje przy zmaślaniu śmietanki i klarowaniu ghee oraz zamyka obieg surowca poprzez wytwarzanie kremowej Ricotty i karmelowego norweskiego Brunostu. Działa w 100% Offline-First, bez logowania, bez serwera i telemetrii, w 35 językach, z poszanowaniem suwerenności danych użytkownika.

**Obietnica marki (do App Store):**  
*„Mistrzowskie sery, idealne masło i rzemieślniczy nabiał — pełna kontrola nad mlekiem w Twoich rękach.”*

### **1.2 Zasady Produktu (ZP-01…ZP-16, nienegocjowalne)**

| Nr | Nazwa zasady | Definicja i uzasadnienie architektoniczne |
| :--- | :--- | :--- |
| **ZP-01** | **100% Offline-First** | Wszystkie obliczenia enzymatyczne, krzywe flokulacji, bazy kultur, kalkulatory solanek, profile zmaślania i harmonogramy Cave Log działają całkowicie bez dostępu do sieci internetowej. Piwnice serowe, chłodnie i wiejskie serowarnie często nie mają zasięgu GSM. |
| **ZP-02** | **Zero Konta i Rejestracji** | Aplikacja uruchamia się bezpośrednio do stanu roboczego. Żadnych ekranów rejestracji, logowania przez Apple/Google, pytań profilowych ani zbędnych barier wejścia. |
| **ZP-03** | **Zero Telemetrii ("Data Not Collected")** | Brak zewnętrznych SDK analitycznych (Firebase, Mixpanel, Amplitude). Czysta karta prywatności w App Store Privacy Manifest. Dane partii i dojrzewalni należą wyłącznie do użytkownika. |
| **ZP-04** | **Determinizm Matematyczny i Biochemiczny** | Wzory dawek podpuszczki, stężeń solanek, bilansu tłuszczu masła, punktu izoelektrycznego kazeiny i kinetyki fermentacji są deterministycznymi funkcjami matematycznymi, w 100% testowanymi wektorami w Jest/CI. Zero generatywnych halucynacji AI w kalkulatorach technologii żywności. |
| **ZP-05** | **Bezpieczeństwo Danych i Trwałość (Zero Data Loss)** | Relacyjna baza SQLite w trybie WAL. Automatyczny backup rotacyjny (10 kopii JSON) przy każdej modyfikacji partii. Eksport i import bazy są bezpłatne i dostępne zawsze. |
| **ZP-06** | **Czysta Ekonomia ("Tańsze niż espresso")** | Brak reklam, brak walut wirtualnych. Przejrzysty darmowy rdzeń narzędziowy + opcjonalny zakup dożywotni (Lifetime 14,99 € / 59,99 zł) lub mikroskopijna subskrypcja (0,99 € / 3,99 zł mies.). |
| **ZP-07** | **Hands-Free & Ergonomia Kuchni** | Projekt interakcji dostosowany do pracy w fartuchu serowarskim: duże cele dotykowe (min. 48x48 pt), wsparcie Apple Watch i Garmin, głośne powiadomienia dźwiękowe timera (`expo-av`), Live Activity na zablokowanym ekranie. |
| **ZP-08** | **Barierowe Bezpieczeństwo Sanitarne** | Rygorystyczne egzekwowanie barier biologicznych: higiena mleka surowego, kwasowość pI 4.6, zasolenie minimalne solanki 16% (ochrona przed patogenami), limity $CaCl_2$. Aplikacja ostrzega przed ryzykiem zepsucia surowca. |
| **ZP-09** | **Prymat Jakości Mleka i Surowca** | Precyzyjne rozróżnienie gatunków mleka (krowie, kozie, owcze, bawole) oraz jego obróbki (surowe zagrodowe, pasteryzowane niskotemperaturowo, sklepowe). Twarda blokada prób użycia mleka UHT do serów podpuszczkowych z natychmiastowym wyjaśnieniem naukowym. |
| **ZP-10** | **Dostępność jako Fundament (WCAG AAA / VoiceOver)** | Pełne etykiety dostępności, obsługa powiększonego tekstu Dynamic Type, wysoki kontrast kolorystyczny, brak polegania wyłącznie na barwie wskaźników. |
| **ZP-11** | **Wierność Rzemiosłu i Tradycji** | Nazewnictwo zgodne z profesjonalnym słownictwem serowarskim i mleczarskim (skrzep, gęstwa, synereza, harfa, IMCU, affinage, brevibacterium, klinek, zmaślanie, inwersja emulsji, ghee, ricotta, brunost). |
| **ZP-12** | **Wizualna Elegancja Rzemieślnicza** | Paleta barw inspirowana naturą nabiału: *Linen & Whey* (len, ciepła serwatka, kremowe masło, wosk pszczeli, terakota dojrzewalni). Zgodność z Apple Human Interface Guidelines. |
| **ZP-13** | **Globalna Lokalizacja (35 języków)** | Pełna dwukierunkowa obsługa systemów metrycznych i imperialnych (litry/galony, gramy/funty/uncje, °C/°F, gęstość Baumé/Salometer). Wszystkie teksty przez `t()` bez hardkodowanych literałów. |
| **ZP-14** | **Niezależność od Zewnętrznych Serwerów Chmurowych** | Zerowy koszt utrzymania infrastruktury po stronie twórcy (0 zł poza opłatą deweloperską Apple). Aplikacja jest całkowicie samowystarczalna na urządzeniu. |
| **ZP-15** | **Wsparcie Sprzętowe BLE bez Vendor-Lockin** | Otwarty skaner broadcastu Bluetooth LE dla standardowych czujników środowiskowych (RuuviTag, Xiaomi Mijia) bez wymagania chmury producenta. |
| **ZP-16** | **Przejrzystość Edukacyjna** | Każde zalecenie, przelicznik, temperatura i czas w aplikacji posiada zwięzłe uzasadnienie naukowe („dlaczego tak?”) dostępne pod jednym tapnięciem. |

---

## **Rozdział 2. Analiza Problemu i Dowody Rynkowe**

### **2.1 Rzeczywisty problem serowara i wytwórcy nabiału**
Wytwarzanie serów podpuszczkowych, twarogów klinkowych i rzemieślniczego masła to najbardziej wymagające dziedziny domowego przetwórstwa. W odróżnieniu od gotowania obiadu, **błąd popełniony w pierwszych 30 minutach obróbki mleka ujawnia się dopiero po tygodniach lub miesiącach leżakowania sera w dojrzewalni albo skutkuje natychmiastowym zniszczeniem kosztownego surowca (20–50 litrów mleka zagrodowego)**.

Kluczowe punkty bólu (zebrane z forów serowarskich, grup rzemiosła mlecznego i recenzji):
1. **Porażka koagulacji przez błędy podpuszczki:** Użytkownicy kupują podpuszczki płynne lub w proszku o nieznanej lub różnej sile (IMCU vs 1:10 000). Dodanie podpuszczki „na oko” skutkuje kruchym, rozpadającym się skrzepem, z którego ucieka tłuszcz, albo gumowatym, gorzkim serem z nadmiaru enzymu.
2. **Pułapka mleka sklepowego:** Brak wiedzy o degradacji jonów wapnia w pasteryzacji. Bez dodania $CaCl_2$ mleko nie tworzy zwięzłego skrzepu.
3. **Zniszczenie twarogu przez przegrzanie:** Tradycyjny twaróg wymaga powolnego dogrzania skrzepu do 38–42°C. Podgrzanie do >45°C powoduje natychmiastowe stwardnienie kazeiny i powstanie suchego, kredowego twarogu; niedogrzanie (<35°C) daje mazistą papkę uciekającą przez chustę.
4. **Błędy zmaślania śmietanki:** Próba ubijania zbyt ciepłej śmietany (>16°C) upłynnia frakcję tłuszczową – ziarna masła nie chcą się zlepić, a tłuszcz ucieka do maślanki. Niedokładne wypłukanie maślanki wodą lodową prowadzi do błyskawicznego jełczenia masła w ciągu kilku dni.
5. **Marnowanie drogocennej serwatki:** Wylewanie dziesiątek litrów serwatki po serze podpuszczkowym zamiast wytworzenia delikatnej Ricotty (wytrącenie albumin w 85–90°C przy pH 5.9) lub karmelowego Brunostu.
6. **Zaniedbanie dojrzewalni (Cave Log):** Krążek sera włożony do chłodziarki/piwniczki wymaga regularnego obracania, przemywania solanką i kontroli wilgotności (80–90%). Po 2 tygodniach użytkownik zapomina o pielęgnacji, skórka wysycha i pęka, a wnętrze zasiedlają dzikie pleśnie czarne (*Mucor*).
7. **Niewłaściwa solanka i zniszczenie skórki:** Włożenie sera do solanki zrobionej bez buforu wapniowego i zakwaszenia powoduje natychmiastowe rozpuszczenie zewnętrznej warstwy białka (śluzowacenie).

---

## **Rozdział 3. Persony Użytkowników i Sytuacje Życiowe**

### **3.1 Szczegółowe Persony (P1–P8)**

* **P1: Wojciech (48 lat) — Serowar Zagrodowy Praktyk.**
  * *Profil:* Posiada małe stado kóz i kupuje mleko krowie od sąsiada (40–60L tygodniowo). Robi sery typu Gouda, Koryciński, Cheddar, Caciotta i Tomme.
  * *Ból:* Notatki na zatłuszczonych kartkach w serowarni, gubienie informacji, który krążek leży na której półce w dojrzewalni i ile tygodni ma dana partia.
  * *Cel:* Precyzyjny stoper flokulacji, harmonogram docisku prasy, rejestr leżakowania z kodami partii i alertami obracania.

* **P2: Anna (34 lata) — Domowa Wytwórczyni Nabiału i Masła.**
  * *Profil:* Gotuje w domu dla rodziny, kupuje mleko prosto ze wsi. Robi tradycyjny twaróg klinkowy, zmaśla wiejską śmietanę na masło i wytapia złociste ghee, robi domowy jogurt grecki i kefir.
  * *Ból:* Nierówne rezultaty – czasem twaróg wychodzi za twardy, a masło zjełczało po tygodniu przez niedokładne wypłukanie maślanki.
  * *Cel:* Precyzyjny przewodnik dogrzewania twarogu (38–42°C), asystent zmaślania z oknem temperaturowym (10–13°C) i kalkulator odzysku serwatki na ricottę.

* **P3: Piotr (41 lat) — Eksperymentator Affinage i Stylów Tradycyjnych.**
  * *Profil:* Zaadaptował winiarkę na profesjonalną komorę dojrzewalniczą z regulatorem wilgotności. Dojrzewa sery maziowe (*Brevibacterium linens*), pleśniowe (Camembert, Gorgonzola) oraz warzy norweski serwatkowy Brunost.
  * *Ból:* Skomplikowany kalendarz przemywania maziowego i nakłuwania igłami, ryzyko przypalenia laktozy podczas karmelizacji serwatki na Brunost.
  * *Cel:* Cave Log z integracją sensora BLE, obliczaniem punktu rosy (VPD) oraz kalkulator odparowania suchej masy serwatki.

* **P4: Maria (64 lata) — Seniorka Tradycyjnego Mleczarstwa.**
  * *Profil:* Od dziesięcioleci robi biały ser ze zsiadłego mleka i prosty ser podpuszczkowy.
  * *Ból:* Trudności z odczytaniem małych liter na ekranie smartfona, skomplikowane aplikacje wymagające haseł.
  * *Cel:* Bardzo duży, czytelny interfejs (Dynamic Type), kalkulator przeliczający „ile kropli podpuszczki na 12 litrów mleka” bez logowania.

* **P5: Paweł (28 lat) — Entuzjasta Zero-Waste i Rzemiosła.**
  * *Profil:* Chce maksymalnie wykorzystać każdy litr surowca: ze śmietanki masło i maślanka, ze skrzepu ser podpuszczkowy, a z serwatki ricotta i brunost.
  * *Ból:* Brak wiedzy o równowadze kwasowo-termicznej niezbędnej do koagulacji albumin serwatkowych.
  * *Cel:* Zamknięty obieg serwatki (Zero-Waste Whey Loop) z dokładnymi formułami pH i temperatury.

* **P6: Tomasz (39 lat) — Serowar w Rzemieślniczym Handlu Rolniczym (RHD).**
  * *Profil:* Wytwarza sery na sprzedaż na jarmarkach ekologicznych.
  * *Ból:* Konieczność wyliczania kosztu partii, wydajności serowej (% yield) oraz drukowania etykiet z datami i składem.
  * *Cel:* Kalkulator kosztu jednostkowego krążka sera i kostki masła, generator etykiet PDF z kodami QR.

* **P7: Marek (36 lat) — Niewidomy Użytkownik Korzystający z VoiceOver.**
  * *Profil:* Pasjonat gotowania i serowarstwa, w pełni zależny od technologii asystujących.
  * *Cel:* 100% dostępność semantyczna WCAG AAA, logiczne etykiety wszystkich stoperów i kalkulatorów.

* **P8: Praktyk w Serowarni — Ręce w Serwatce (Hands-Free User).**
  * *Profil:* Serowar podczas udoju, zaprawiania mleka i formowania skrzepu o mokrych dłoniach.
  * *Cel:* Sterowanie stoperem flokulacji i odliczaniem z poziomu Apple Watch, Live Activity na ekranie blokady, duże przyciski w strefie kciuka.

---

## **Rozdział 3.2 Sytuacje Życiowe (SYT-01…SYT-15)**
* **SYT-01 (Mleko w garnku):** Garnek 20L z mlekiem podgrzewa się na kuchence. Serowar o mokrych rękach sprawdza dawkę kultur termofilnych i podpuszczki IMCU.
* **SYT-02 (Czekanie na flokulację):** Miseczka unosi się na powierzchni zaprawionego mleka. Użytkownik delikatnie ją popycha, czekając na opór zżelowanego płynu, aby wcisnąć stoper jednym stuknięciem na Apple Watch.
* **SYT-03 (Cięcie i dogrzewanie):** Skrzep pocięty harfą serowarską na ziarno wielkości kukurydzy. Aplikacja odmierza czas osadzania (5 min) i prowadzi przez rampę dogrzewania (max 1°C na 2 minuty).
* **SYT-04 (Prasa serowarska):** Krążek w chuście serowarskiej trafia pod prasę. Aplikacja wyznacza 4 etapy nacisku (od 0.5 do 3.0 kg/cm²) z przypomnieniami o odwróceniu krążka.
* **SYT-05 (Wyjmowanie z solanki w nocy):** Krążek leży w solance 20%. Czas upływa o 23:40. Aplikacja wysyła powiadomienie dźwiękowe, by ser nie uległ przesoleniu.
* **SYT-06 (Kontrola jaskini dojrzewalniczej):** Użytkownik schodzi do piwnicy. Aplikacja pobiera przez BLE odczyt: 12.2°C, 88% RH. Wyświetla listę: krążek #12 obrócić, krążek #09 przemyć solanką maziową.
* **SYT-07 (Dogrzewanie tradycyjnego twarogu):** Zsiadłe mleko w garnku podgrzewa się na małym ogniu. Aplikacja pilnuje okna 38–42°C, zapobiegając przegrzaniu kazeiny.
* **SYT-08 (Odsączanie klinka w chuście):** Skrzep twarogowy wlany do chusty serowarskiej zawieszonej na kiju. Stoper odmierza 2 godziny grawitacyjnego odcieku serwatki.
* **SYT-09 (Zmaślanie śmietanki wiejskiej):** Schłodzona do 11°C śmietana 36% trafia do masielnicy. Aplikacja prowadzi przez fazę inwersji emulsji (pojawienie się ziaren masła i maślanki).
* **SYT-10 (Płukanie i wyciskanie masła):** Ziarna masła zalane wodą lodową (<5°C). Aplikacja przypomina o trzykrotnym płukaniu i ugnieceniu masła na bukowej desce serowarskiej w celu usunięcia resztek maślanki.
* **SYT-11 (Wytapianie czystego ghee):** Masło topi się w garnku z grubym dnem. Aplikacja instruuje, jak utrzymać temperaturę 100–105°C, odparować wodę i skarmelizować kazeinę bez jej przypalenia.
* **SYT-12 (Odzysk serwatki na Ricottę):** Gorąca słodka serwatka po serze podpuszczkowym podgrzewana do 88°C. Aplikacja podaje dawkę kwasu cytrynowego do korekty pH (5.9) w celu ścięcia albumin.
* **SYT-13 (Karmelizacja serwatki na Brunost):** Serwatka gotuje się przez kilka godzin. Aplikacja wylicza zagęszczenie suchej masy z 6% do 80% i przypomina o dodaniu śmietanki i intensywnym chłodzeniu z mieszaniem.
* **SYT-14 (Kalkulacja kosztu partii dla RHD):** Wytwórca zagrodowy wycenia krążek sera 1.5 kg i kostkę masła 200 g. Aplikacja sumuje koszty surowców i energii, podając czysty zysk.
* **SYT-15 (Głosowe sterowanie VoiceOver):** Niewidomy serowar przy użyciu gestów VoiceOver sprawdza odliczanie timera dogrzewania skrzepu bez patrzenia na ekran.
