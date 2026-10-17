# **SEROWAR BRD 0.1 — 00c Sprzeczności dziedzinowe, normy i weryfikacja merytoryczna**

Dokument przedstawia analizę sprzeczności występujących w tradycyjnej literaturze mleczarskiej, forach serowarskich i podręcznikach rzemiosła, rozstrzygniętych przez badacza dziedzinowego na podstawie 5-szczeblowej hierarchii źródeł (IDF, FAO, Codex Alimentarius dla mleka i przetworów mlecznych, literatura akademicka Fox, Kosikowski, Walstra, Bylund).

---

## **1. Serowarstwo: Mleko i chemia koagulacji**

### **Sprzeczność S-01: Chlorek wapnia ($CaCl_2$) — dodawać zawsze czy tylko do mleka pasteryzowanego?**
* **Problem w źródłach:** Część forów zaleca dodawanie chlorku wapnia do każdego mleka „na wszelki wypadek”. Inne źródła ostrzegają przed gorzkim smakiem i nadmierną kruchością skrzepu.
* **Rozstrzygnięcie badawcze:** Pasteryzacja termiczna powoduje wytrącanie rozpuszczalnego fosforanu wapnia do formy koloidalnej, co drastycznie osłabia mostki wapniowe między micelami kazeiny i wydłuża czas koagulacji. W mleku surowym, świeżym od krowy/kozy, poziom jonów $Ca^{2+}$ jest fizjologicznie optymalny.
* **Zasada w SEROWAR (RD-03):** 
  * Dla mleka pasteryzowanego/sklepowego: rekomendowany dodatek $0.2 - 0.3\text{ g}$ bezwodnego $CaCl_2$ na 1 litr mleka (lub $0.6 - 0.9\text{ ml}$ roztworu 33% na 10 litrów).
  * Dla mleka surowego: dodatek $0.0 - 0.1\text{ g/L}$, zalecany tylko w okresie zimowym przy ubogiej paszy.
  * Ostrzeżenie górnego limitu: przekroczenie $0.4\text{ g/L}$ blokuje partię z uwagi na defekt metaliczno-gorzkiego smaku.

### **Sprzeczność S-02: Dawkowanie podpuszczki — czas stały vs metoda flokulacji**
* **Problem w źródłach:** Przepisy tradycyjne podają: „dodaj 1 ml podpuszczki i odczekaj 45 minut”. W praktyce aktywność enzymatyczna spada z czasem, a mleko różni się zawartością kazeiny i kwasowością, co powoduje zacinanie skrzepu lub jego przepróchnienie.
* **Rozstrzygnięcie badawcze:** Standard światowy (metoda Berridge'a / Flocculation Multiplier) opiera się na wyznaczeniu **punktu flokulacji** (pierwsze widoczne mikroskopowe zżelowanie, sprawdzane obracającą się lekką miseczką na powierzchni mleka). Czas do flokulacji ($t_f$, zazwyczaj 10–18 min) mnoży się przez współczynnik flokulacji $M$ dedykowany dla danego typu sera.
* **Zasada w SEROWAR (RD-04):** Aplikacja odrzuca sztywne czasy oczekiwania. Wdraża stoper flokulacji: całkowity czas od zaprawienia do cięcia $= t_f \times M$.
  * Twarde/alpejskie (Parmesan, Gruyère): $M = 2.0 - 2.5$.
  * Półtwarde (Gouda, Tilsit): $M = 3.0 - 3.5$.
  * Miękkie/pleśniowe (Camembert, Brie): $M = 4.0 - 5.0$.
  * Kwasowo-podpuszczkowe: $M = 6.0$.

### **Sprzeczność S-03: Kąpiel solankowa — nasycenie solanki, pH i wapń**
* **Problem w źródłach:** Tradycyjne przepisy zalecają „zrób solankę z wody i soli, aż jajko wypłynie”. Taka solanka rozpuszcza wapń ze skórki sera, powodując jej śluzowacenie (rozpad zewnętrznej warstwy białka) oraz zakażenia mikrobiologiczne z powodu zbyt wysokiego pH wody kranowej.
* **Rozstrzygnięcie badawcze:** Prawidłowa solanka serowarska musi znajdować się w stanie potrójnej równowagi:
  1. **Nasycenie solą:** 18–22% NaCl (gęstość 1.13–1.16 g/cm³, 19–21° Baumé). W solance < 16% namnażają się drożdże i bakterie gnilne.
  2. **Równowaga pH:** pH solanki musi być zbliżone do pH solonego sera (pH 5.2–5.4). Solanka z czystej wody (pH 7.0) wyciąga kwas i rozmiękcza kazeinę.
  3. **Równowaga wapniowa:** dodatek $0.1 - 0.2\%\ CaCl_2$ zapobiega wymywaniu wapnia ze skórki krążka.
* **Zasada w SEROWAR (RD-07):** Kalkulator solanki oblicza masę soli, objętość kwasu (serwatki/octu lub kwasu mlekowego) oraz dawkę $CaCl_2$ dla bezpiecznej kąpieli.

---

## **2. Dojrzewalnia (Cave Log) i Pielęgnacja Skórki**

### **Sprzeczność S-04: Kontrola wilgotności względnej (RH) — higrometry tanie vs psychrometria**
* **Problem w źródłach:** Tanie domowe higrometry pojemnościowe w warunkach wilgotności 85–95% ulegają nasyceniu i zafałszowują wyniki o 10–15%, co prowadzi do gnicia skórki lub jej wysychania i pękania.
* **Rozstrzygnięcie badawcze:** Monitorowanie komory dojrzewalniczej wymaga uwzględnienia temperatury punktu rosy ($T_{dp}$) i unikania bezpośredniej kondensacji wody na powierzchni krążków. Skórka sera schnie, gdy prężność pary wodnej na jej powierzchni jest wyższa niż w otoczeniu.
* **Zasada w SEROWAR (RD-12):** Algorytm wylicza deficyt prężności pary wodnej (VPD) i ostrzega przed kondensacją kropelkową na serze (zarzewie pleśni czarnej *Mucor*).

### **Sprzeczność S-05: Pielęgnacja Brevibacterium linens (sery maziowe) vs pleśń Penicillium**
* **Problem w źródłach:** Próba wyhodowania czerwonej mazi na serach o zbyt niskim pH kończy się porażką, a skórka porasta dziką pleśnią.
* **Rozstrzygnięcie badawcze:** *Brevibacterium linens* jest bezwzględnym tlenowcem i nie rozwija się w środowisku o pH < 5.8. Wymaga uprzedniego odkwaszenia powierzchni przez drożdże serowarskie (*Geotrichum candidum* lub *Debaryomyces hansenii*), które konsumują kwas mlekowy i podnoszą pH skórki.
* **Zasada w SEROWAR (RD-14):** Asystent affinage prowadzi dwuetapowy protokół dla serów maziowych: najpierw rozwój welwetu *Geotrichum* (3–6 dni), następnie przemywanie roztworem maziowym przy podwyższonym pH.

---

## **3. Przetwórstwo Mleczne: Masło, Twaróg, Ricotta i Brunost**

### **Sprzeczność S-06: Zmaślanie śmietanki — temperatura i stopień ukwaszenia**
* **Problem w źródłach:** Częsty błąd: zmaślanie śmietanki zbyt ciepłej (>16°C) powoduje upłynnienie tłuszczu, mazistą strukturę, brak wyraźnego oddzielenia ziaren masła od maślanki oraz ucieczkę tłuszczu do maślanki (niską wydajność). Ze śmietanki zbyt zimnej (<8°C) czas ubijania wydłuża się do godzin.
* **Rozstrzygnięcie badawcze:** Optymalne okno zmaślania to 10–13°C (latem 10–12°C, zimą 12–14°C z uwagi na proporcję kwasów tłuszczowych nasyconych do nienasyconych w paszy). Zmaślanie śmietanki ukwaszonej mezofilnymi kulturami LD (*Lactococcus lactis subsp. diacetylactis* i *Leuconostoc*) daje tradycyjne, aromatyczne masło rzemieślnicze (cultured butter) o trwalszej strukturze i niższym pH.
* **Zasada w SEROWAR (RD-27):** Asystent masielnictwa kontroluje temperaturę wsadu i monitoruje fazy inwersji emulsji O/W -> W/O.

### **Sprzeczność S-07: Produkcja Ricotty z serwatki słodkiej vs kwasowej oraz dodatek mleka**
* **Problem w źródłach:** Próba zrobienia ricotty z serwatki po twarogu kwasowym (pH < 4.6) bez odkwaszenia lub próba wytrącenia białek serwatkowych w temperaturze < 80°C.
* **Rozstrzygnięcie badawcze:** Białka serwatkowe ($eta$-laktoglobulina, $lpha$-laktoalbumina) denaturują w wysokiej temperaturze ($85-92^\circ C$) pod warunkiem optymalnego pH ($5.8-6.1$). Serwatka słodka podpuszczkowa ma pH ok. 6.2–6.4 i wymaga lekkiego dokwaszenia kwasem cytrynowym/octowym lub odrobiną kwaśnej serwatki przy $85^\circ C$. Czysta serwatka daje delikatną ricottę, a dodatek 5–10% mleka pełnego radykalnie zwiększa wydajność i kremowość.
* **Zasada w SEROWAR (RD-28):** Precyzyjne sterowanie kwasowością i temperaturą termicznej denaturacji serwatki.

### **Sprzeczność S-08: Norweski Brunost / Mysost — karmelizacja vs przypalenie laktozy**
* **Problem w źródłach:** Gwałtowne gotowanie odparowujące na dużym ogniu powoduje przypalenie dna, gorzki smak i grudkowatą krystalizację laktozy.
* **Rozstrzygnięcie badawcze:** Odparowanie 80–90% wody z serwatki w temperaturze wrzenia, dodatek śmietanki, a następnie intensywne mieszanie w $100-105^\circ C$, gdzie reakcja Maillarda nadaje charakterystyczny bursztynowo-brązowy kolor i toffi/karmelowy posmak. Bardzo szybkie schładzanie z ciągłym mieszaniem zapobiega powstawaniu wyczuwalnych ziaren laktozy (tzw. "piaszczystość").
* **Zasada w SEROWAR (RD-29):** Kalkulator odparowania suchej masy serwatki i profil termiczny karmelizacji.
