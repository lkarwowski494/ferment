# **FERMENT BRD 0.1 — 00c Sprzeczności dziedzinowe, normy i weryfikacja merytoryczna**

Dokument przedstawia analizę sprzeczności występujących w tradycyjnej literaturze kulinarnej, forach rzemieślniczych i podręcznikach serowarskich, rozstrzygniętych przez badacza dziedzinowego na podstawie 5-szczeblowej hierarchii źródeł (IDF, FAO, Codex Alimentarius, literatura akademicka Fox, Kosikowski, Katz).

---

## **1. Serowarstwo: Mleko i chemia koagulacji**

### **Sprzeczność S-01: Chlorek wapnia ($CaCl_2$) — dodawać zawsze czy tylko do mleka pasteryzowanego?**
* **Problem w źródłach:** Część forów zaleca dodawanie chlorku wapnia do każdego mleka „na wszelki wypadek”. Inne źródła ostrzegają przed gorzkim smakiem i nadmierną kruchością skrzepu.
* **Rozstrzygnięcie badawcze:** Pasteryzacja termiczna powoduje wytrącanie rozpuszczalnego fosforanu wapnia do formy koloidalnej, co drastycznie osłabia mostki wapniowe między micelami kazeiny i wydłuża czas koagulacji. W mleku surowym, świeżym od krowy/kozy, poziom jonów $Ca^{2+}$ jest fizjologicznie optymalny.
* **Zasada w FERMENT (RD-03):** 
  * Dla mleka pasteryzowanego/sklepowego: rekomendowany dodatek $0.2 - 0.3\text{ g}$ bezwodnego $CaCl_2$ na 1 litr mleka (lub $0.6 - 0.9\text{ ml}$ roztworu 33% na 10 litrów).
  * Dla mleka surowego: dodatek $0.0 - 0.1\text{ g/L}$, zalecany tylko w okresie zimowym przy ubogiej paszy.
  * Ostrzeżenie górnego limitu: przekroczenie $0.5\text{ g/L}$ blokuje wydanie partii z uwagi na defekt metaliczno-gorzkiego smaku.

### **Sprzeczność S-02: Dawkowanie podpuszczki — czas stały vs metoda flokulacji**
* **Problem w źródłach:** Przepisy tradycyjne podają: „dodaj 1 ml podpuszczki i odczekaj 45 minut”. W praktyce aktywność podpuszczki spada z czasem, a mleko różni się zawartością białka i kwasowością, co powoduje zacinanie skrzepu lub jego przepróchnienie.
* **Rozstrzygnięcie badawcze:** Standard światowy (metoda Berridge'a / Flocculation Multiplier) opiera się na wyznaczeniu **punktu flokulacji** (pierwsze widoczne mikroskopowe zżelowanie, sprawdzane obracającą się lekką miseczką na powierzchni mleka). Czas do flokulacji ($t_f$, zazwyczaj 10–18 min) mnoży się przez współczynnik flokulacji $M$ dedykowany dla danego typu sera.
* **Zasada w FERMENT (RD-04):** Aplikacja odrzuca sztywne czasy oczekiwania. Wdraża stoper flokulacji: całkowity czas od zaprawienia do cięcia $= t_f \times M$.
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
* **Zasada w FERMENT (RD-07):** Kalkulator solanki oblicza masę soli, objętość kwasu (serwatki/octu lub kwasu mlekowego) oraz dawkę $CaCl_2$ dla bezpiecznej kąpieli.

---

## **2. Dojrzewalnia (Cave Log) i Pielęgnacja Skórki**

### **Sprzeczność S-04: Kontrola wilgotności względnej (RH) — higrometry tanie vs psychrometria**
* **Problem w źródłach:** Tanie domowe higrometry pojemnościowe w warunkach wilgotności 85–95% ulegają nasyceniu i zafałszowują wyniki o 10–15%, co prowadzi do gnicia skórki lub jej wysychania i pękania.
* **Rozstrzygnięcie badawcze:** Monitorowanie komory dojrzewalniczej wymaga uwzględnienia temperatury punktu rosy ($T_{dp}$) i unikania bezpośredniej kondensacji wody na powierzchni krążków. Skórka sera schnie, gdy prężność pary wodnej na jej powierzchni jest wyższa niż w otoczeniu.
* **Zasada w FERMENT (RD-12):** Algorytm wylicza deficyt prężności pary wodnej (VPD) i ostrzega przed kondensacją kropelkową na serze (zarzewie pleśni czarnej *Mucor*).

### **Sprzeczność S-05: Pielęgnacja Brevibacterium linens (sery maziowe) vs pleśń Penicillium**
* **Problem w źródłach:** Próba wyhodowania czerwonej mazi na serach o zbyt niskim pH kończy się porażką, a skórka porasta dziką pleśnią.
* **Rozstrzygnięcie badawcze:** *Brevibacterium linens* jest bezwzględnym tlenowcem i nie rozwija się w środowisku o pH < 5.8. Wymaga uprzedniego odkwaszenia powierzchni przez drożdże serowarskie (*Geotrichum candidum* lub *Debaryomyces hansenii*), które konsumują kwas mlekowy i podnoszą pH skórki.
* **Zasada w FERMENT (RD-14):** Asystent affinage prowadzi dwuetapowy protokół dla serów maziowych: najpierw rozwój welwetu *Geotrichum* (3–6 dni), następnie przemywanie roztworem maziowym przy podwyższonym pH.

---

## **3. Kiszonki, Kombucha i Octy Żywe**

### **Sprzeczność S-06: Solanka kiszonkowa — 2% w wodzie czy 2% w całości nastawu?**
* **Problem w źródłach:** 80% przepisów internetowych podaje „łyżka soli na litr wody”. W słoiku ściśle upakowanym warzywami ilość wody jest niewielka, a woda z komórek warzyw rozcieńcza solankę, obniżając stężenie soli do niebezpiecznego poziomu < 1.2% (sprzyja to mięknięciu pektyn i bakteriom gnilnym).
* **Rozstrzygnięcie badawcze:** Jedynym naukowo poprawnym standardem jest **Zasolenie Całkowite (Total Batch Salinity)**: masa soli liczona od łącznej wagi warzyw i dolanej wody:
  $$S_{\%} = \frac{m_{soli}}{m_{warzyw} + m_{wody}} \times 100\%$$
* **Zasada w FERMENT (RD-26):** Kalkulator solanek domyślnie wymusza bilans całkowity (rekomendowany zakres 2.0–2.5% dla warzyw twardych, 1.8–2.0% dla kimchi, 2.5–3.5% dla ostrych sosów mash).

### **Sprzeczność S-07: Kombucha — szczelne zamykanie w pierwszej fazie (1F)**
* **Problem w źródłach:** Niektórzy początkujący zamykają słoik z grzybkiem SCOBY szczelną nakrętką, licząc na szybsze nagazowanie.
* **Rozstrzygnięcie badawcze:** Bakterie kwasu octowego (*Komagataeibacter xylinus*) są bezwzględnymi tlenowcami. Brak tlenu dusi syntezę celulozy i kwasu octowego, prowadząc do dominacji drożdży, nadprodukcji alkoholu i potencjalnego skażenia pleśnią.
* **Zasada w FERMENT (RD-32):** Ścisłe rozróżnienie faz:
  * **1F (Fermentacja tlenowa):** oddychająca tkanina/gaza, wymiana gazowa, rozwój SCOBY, spadek pH do 2.8–3.2.
  * **2F (Refermentacja beztlenowa):** szczelne butelki z grubego szkła ciśnieniowego, nasycanie $CO_2$, kontrola ciśnienia i zapobieganie eksplozji butelek.

### **Sprzeczność S-08: Produkcja octu żywego — wlewanie alkoholu czy fermentacja dwufazowa?**
* **Problem w źródłach:** Próby robienia octu przez dodanie matki octowej do wódki lub wina o stężeniu 12–14% ABV.
* **Rozstrzygnięcie badawcze:** Bakterie *Acetobacter* są hamowane przy stężeniu etanolu > 8% ABV. Optymalny wsad alkoholowy do konwersji octowej wynosi 5.0–7.5% ABV.
* **Zasada w FERMENT (RD-41):** Asystent octowy weryfikuje stężenie alkoholu w nastawie owocowym i w razie potrzeby zaleca rozcieńczenie moszczu wodą przed inokulacją matką octową.
