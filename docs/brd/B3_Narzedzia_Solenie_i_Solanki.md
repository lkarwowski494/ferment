# **FERMENT BRD 0.1 — Rozdział 7: Narzędzia Serowarskie — Solenie i Kąpiele Solankowe (B3)**

> **Moduł:** `BR-SOL-001` do `BR-SOL-025`  
> **Kontekst dziedzinowy:** Chemia i gęstość nasyconej solanki serowarskiej, korekty termiczne hydrometru (°Baumé / Salometer), równowaga osmotyczna wapnia i kwasowości, obliczanie czasu kąpieli.

---

### **BR-SOL-001: Kalkulator Składu Nasyconej Solanki Serowarskiej**
* **Opis:** Precyzyjne przygotowanie bezpiecznej kąpieli solankowej o stężeniu 18–22% NaCl.
* **Formuła chemiczna (na 10 litrów wody):**
  * Sól niejodowana czysta (NaCl): $2.20\text{ kg} - 2.50\text{ kg}$.
  * Chlorek wapnia ($CaCl_2$ 33%): $15\text{ ml}$ (lub $5\text{ g}$ bezwodnego). Cel: zapobieganie wypłukiwaniu jonów wapnia ze skórki sera.
  * Zakwaszenie buforowe: $5 - 10\text{ ml}$ kwasu mlekowego 80% lub $150\text{ ml}$ kwaśnej serwatki. Cel: wyrównanie pH solanki do pH sera (pH 5.20–5.40).
* **Kryteria akceptacji:**
  1. Kalkulator przelicza proporcje na dowolną objętość naczynia solankowego (od 2L do 50L).
  2. Wyraźne ostrzeżenie przed użyciem soli jodowanej z antyzbrylaczem (żelazocyjanek potasu $E536$), który hamuje florę bakteryjną i plami skórkę.
* **Persona:** P1, P2, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-SOL-005: Przelicznik Gęstości i Konwerter Hydrometryczny**
* **Opis:** Obsługa pomiarów gęstości solanki za pomocą areometru, solomierza lub wagi laboratoryjnej.
* **Tablica korelacji w algorytmie (przy temp. 15°C):**
  * $18\%\ NaCl \rightarrow$ gęstość $1.135\text{ g/cm}^3$ | $17.2^\circ\text{Bé}$ | $70^\circ\text{Salometer}$.
  * $20\%\ NaCl \rightarrow$ gęstość $1.152\text{ g/cm}^3$ | $19.1^\circ\text{Bé}$ | $78^\circ\text{Salometer}$.
  * $22\%\ NaCl \rightarrow$ gęstość $1.169\text{ g/cm}^3$ | $21.0^\circ\text{Bé}$ | $86^\circ\text{Salometer}$.
  * $24\%\ NaCl$ (nasycona) $\rightarrow$ gęstość $1.186\text{ g/cm}^3$ | $22.8^\circ\text{Bé}$ | $95^\circ\text{Salometer}$.
* **Kryteria akceptacji:**
  * Automatyczna korekta temperatury odczytu: jeśli solanka ma temperaturę 10°C, a aerometr skalowano na 20°C, algorytm wprowadza poprawkę gęstości.
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-SOL-010: Algorytm Czasu Kąpieli Solankowej (Brine Timer)**
* **Opis:** Obliczanie optymalnego czasu przebywania sera w solance na podstawie jego masy, geometrii i docelowego zasolenia.
* **Formuła dyfuzji soli Ficka (RD-08):**
  Czas kąpieli $t$ dla sera twardego/półtwardego w nasyconej solance (20% NaCl, 12°C):
  $$t [h] = m_{sera} [kg] \times K_{stylu} \times \left( \frac{grubosc [cm]}{wysokosc_{ref} [cm]} \right)$$
  Gdzie współczynnik stylu wynosi średnio:
  * Sery miękkie (Feta, Halloumi): $K = 2.0 - 3.0\text{ h/kg}$.
  * Gouda, Edam, Tylżycki: $K = 4.0 - 5.0\text{ h/kg}$ (np. krążek 2.0 kg $\rightarrow 8 - 10$ godzin).
  * Cheddar, sery twarde: $K = 6.0\text{ h/kg}$.
* **Kryteria akceptacji:**
  1. Uruchomienie odliczania z powiadomieniem w połowie czasu: *„Obróć krążek w solance”* (górna powierzchnia wystaje ponad lustro płynu).
  2. Powiadomienie krytyczne z dźwiękiem alarmowym po upływie czasu: *„Wyjmij ser z solanki i przenieś do ociekania/suszenia skórki.”*
* **Persona:** P1, P4, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-SOL-015: Kalkulator Solenia z Ręki (Dry Salting)**
* **Opis:** Dozowanie soli dla serów niesolonych w kąpieli (np. Camembert, Roquefort, sery kwasowe).
* **Kryteria akceptacji:**
  * Obliczenie dawki 1.8% do 2.5% masy zważonego krążka.
  * Rozpisanie na 2 lub 3 równe porcje: aplikacja na górę i boki w dobie 1, obrót i aplikacja na dół w dobie 2.
* **Persona:** P1, P2.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-SOL-020: Regeneracja i Wzmocnienie Stężenia Solanki (Brine Salinity Boost & Top-Up)**
* **Opis:** Zaadaptowany z silnika *Słoik* kalkulator matematyczny bilansu masowego roztworów soli (`brine-topup.ts`). W procesie solenia serów kąpiel ulega ciągłemu rozcieńczaniu (ser oddaje wodę i pobiera sól).
* **Równanie bilansowe:**
  Ilość soli $m_{soli}$ do dosypania w celu podniesienia stężenia z $S_{1}\%$ do $S_{2}\%$ w objętości $V [L]$ bez wylewania solanki:
  $$m_{soli} [g] = \frac{V \times 1000 \times (S_{2} - S_{1})}{100 - S_{2}}$$
* **Kryteria akceptacji:**
  1. Wylicza gramaturę soli kamiennej do dodania do naczynia solankowego.
  2. Obsługuje scenariusz dolewki wody do słoików warzywnych, wyliczając dawkę soli kompensującą nową objętość.
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-SOL-025: Bufor Kwasowo-Wapniowy Solanki i Ochrona Przed Rozmiękaniem Skórki (Brine Acidification & Calcium Buffer)**
* **Opis:** Zapobieganie zjawisku rozmiękania i oślizgłości skórki (*slimy rind*) w solance poprzez chemiczną stabilizację równowagi osmotycznej wapnia i kwasowości (`brine-acidification.ts`).
* **Zasada chemiczna:**
  Czysta solanka przygotowana na bazie surowej wody kranowej (pH ~7.5) gwałtownie wyciąga jony wapnia ($Ca^{2+}$) z sieci kazeinowej sera do roztworu. Skórka staje się śluzowata, galaretowata i nie tworzy prawidłowej warstwy ochronnej.
* **Formuła buforowania:**
  1. **Bufor wapniowy:** Dodatek $2.0\text{ g}$ czystego bezwodnego $CaCl_2$ na każdy litr wody w solance (lub $6.0\text{ ml}$ roztworu 33%).
  2. **Miareczkowanie kwasowości (kwas mlekowy 80%):**
     $$V_{kwas}\text{ [ml]} = V_{wody}\text{ [L]} \times \frac{\max(0, pH_{wody} - 5.20)}{2.3} \times 2.2$$
     Pozwala to na precyzyjne zbicie pH solanki do optymalnego przedziału 5.20–5.40, identycznego z pH krążka sera.
* **Kryteria akceptacji:**
  1. Kalkulator w zakładce Solanki wylicza objętość kwasu mlekowego oraz wagę chlorku wapnia.
  2. Komunikat edukacyjny wyjaśniający mechanizm wymiany jonowej i zapobiegania usterkom mikrobiologicznym.
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-SOL-030: Solenie Ziarna w Masie dla Cheddara (Milling & Dry Salting With Whey Runoff Compensation)**
* **Opis:** Bezpośrednie solenie pociętego ziarna serowarskiego w kotle (metoda anglosaska - Cheddar, Caerphilly, Lancashire) z kompensacją strat soli w odciekającej pod prasą serwatce (`curd-washing-and-salting.ts`).
* **Formuła kompensacyjna:**
  $$m_{soli\_calkowita} = \frac{m_{ziarna} \times (S_{docelowa} / 100)}{1 - (Loss_{serwatka} / 100)}$$
  gdzie domyślny odciek soli w serwatce pod prasą wynosi 33%.
* **3-etapowy protokół zadawania soli:**
  1. Krok 1 (1/3 dawki): posypanie ziarna, mieszanie 3 min, 5 min spoczynku na pierwsze wyciągnięcie wilgoci.
  2. Krok 2 (1/3 dawki): ponowne mieszanie błyszczącego ziarna, 5 min spoczynku.
  3. Krok 3 (1/3 dawki): końcowe wymieszanie i natychmiastowy załadunek do chusty prasowalniczej.
* **Persona:** P1, P2, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-SOL-035: Kalkulator Powłok Ochronnych & Woskowania Krążka (Cheese Wax & Polyvinyl Coverage)**
* **Opis:** Precyzyjne obliczanie pola powierzchni walca sera ($A = 2\pi r^2 + 2\pi r h$) oraz gramatury wosku serowarskiego lub powłoki polioctanowej (z natamycyną) potrzebnej do zabezpieczenia krążka przed wysychaniem i pleśnią.
* **Wskaźniki zużycia materiału:**
  - Wosk serowarski (parafina/mikrowosk): $0.075\text{ g/cm}^2$ na warstwę. Zapewnia barierę wilgoci (0% ubytku).
  - Powłoka polioctanowa: $0.040\text{ g/cm}^2$ na warstwę. Zapewnia paroprzepuszczalność i ochronę przeciwgrzybiczą.
* **Persona:** P1, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.


