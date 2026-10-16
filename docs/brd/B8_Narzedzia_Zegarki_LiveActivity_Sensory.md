# **FERMENT BRD 0.1 — Rozdział 7: Narzędzia — Zegarki, Live Activity, Sensory i Sensoryka (B8)**

> **Moduł:** `BR-SYS-001` do `BR-SYS-030`  
> **Kontekst dziedzinowy:** Hands-free w kuchni serowarskiej, Apple Watch, Garmin Connect IQ, widżety Live Activity w czasie rzeczywistym, odczyt z czujników BLE, wektorowy radar sensoryczny smaku i tekstury (SVG).

---

### **BR-SYS-001: Asystent Live Activity i Dynamic Island (iOS ActivityKit)**
* **Opis:** Ciągła prezentacja odliczania kluczowych faz procesu serowarskiego na zablokowanym ekranie iPhone'a oraz w Dynamic Island.
* **Scenariusze Live Activity:**
  1. **Odliczanie do punktu flokulacji:** stoper miseczki z przyciskiem szybkiej akcji „Złapano flokulację”.
  2. **Odliczanie do cięcia skrzepu:** czas mnożnika flokulacji ($t_f \times M$).
  3. **Rampa dogrzewania skrzepu:** aktualna temperatura docelowa i tempo grzania.
  4. **Fazy prasowania:** czas pozostały do następnego obrotu krążka w prasie.
* **Kryteria akceptacji:**
  * Widżet nie gaśnie, aktualizuje się co sekundę, wspiera Always-On Display.
* **Persona:** P1, P2, P6.
* **Priorytet:** MUST | **Etap:** MVP.

---

### **BR-SYS-005: Aplikacja Towarzysząca Apple Watch (Hands-Free in Whey)**
* **Opis:** Dedykowany interfejs zegarkowy dla serowara z mokrymi dłońmi.
* **Funkcje na zegarku:**
  * Duży przycisk rejestracji punktu flokulacji (obsługa tapnięciem nadgarstka lub koronką Digital Crown).
  * Wyświetlanie aktualnego kroku procesu (np. „Mieszaj gęstwę — jeszcze 4 minuty”).
  * Dźwiękowa i haptyczna sygnalizacja alarmów obrotu sera w prasie i solance.
* **Kryteria akceptacji:**
  * Niezależne działanie timera na Apple Watch nawet przy zerwanym połączeniu Bluetooth z telefonem.
* **Persona:** P1, P6.
* **Priorytet:** SHOULD | **Etap:** MVP/1.1.

---

### **BR-SYS-015: Bezprzewodowa Integracja z Czujnikami Środowiskowymi BLE**
* **Opis:** Automatyczne pobieranie odczytów temperatury i wilgotności względnej z bezprzewodowych tagów Bluetooth Low Energy umieszczonych w dojrzewalni lub pojemnikach fermentacyjnych.
* **Wspierane czujniki (protokoły broadcast Manufacturer Data):**
  * **RuuviTag (Finlandia):** format RAWv2 (temperatura, wilgotność z dokładnością do 0.1%, ciśnienie atmosferyczne).
  * **Xiaomi Mijia BLE (np. LYWSD03MMC z firmware ATC/BTHome):** temperatura i wilgotność.
* **Kryteria akceptacji:**
  1. Aplikacja nie wymaga parowania z chmurą producenta — nasłuchuje lokalnych pakietów rozgłoszeniowych BLE w tle.
  2. Automatyczne dopisywanie odczytów do wykresu mikroklimatu partii w Cave Log.
* **Persona:** P6, P7.
* **Priorytet:** COULD | **Etap:** 1.1.

---

### **BR-SYS-020: Wektorowy Radar Sensoryczny Smaku i Tekstury (Spider Radar SVG)**
* **Opis:** Interaktywny wykres pajęczynowy oceny dojrzałości sera oraz profilu smakowego kiszonek i kombuchy.
* **Osie sensoryczne sera:**
  1. Kwasowość (Acidity)
  2. Słoność (Salinity)
  3. Wilgotność / Elastyczność (Moisture / Elasticity)
  4. Maślanowość / Kremowość (Creaminess / Diacetyl)
  5. Ostrość / Pikantność (Pungency / Lipolysis)
  6. Orzechowość / Słodycz (Nuttiness / Proteolysis)
* **Kryteria akceptacji:**
  * Wektorowy komponent SVG renderowany w 100% lokalnie, z możliwością nałożenia profilu wzorcowego stylu sera na profil uzyskany przez użytkownika.
* **Persona:** P1, P3, P6, P7.
* **Priorytet:** SHOULD | **Etap:** MVP.

---

### **BR-SENS-010: Silnik Oceny Sensorycznej i Balansu Organoleptycznego (Sensory Evaluation & Artisan Critique Engine)**
* **Opis:** 6-osiowy model punktacji sensorycznej i diagnostyki wad rzemieślniczych dla wszystkich kategorii wyrobów (`sensory-evaluation.ts`).
* **Osie sensoryczne (skala 1–10):**
  1. Kwasowość (*Acidity*).
  2. Słoność (*Salinity*).
  3. Zwartość / Chrupkość (*Firmness / Crispness*).
  4. Kremowość / Tekstura (*Creaminess / Texture*).
  5. Pikantność / Ostrość (*Pungency / Sharpness*).
  6. Orzechowość / Czystość (*Nuttiness / Cleanliness*).
* **Klasyfikacja punktowa (0–100 pkt):**
  * $90 - 100\text{ pkt}$: `EXEMPLARY` (Wybitna harmonia smakowa, wzorcowa równowaga).
  * $75 - 89\text{ pkt}$: `GOOD` (Bardzo dobry, zbalansowany wyrób rzemieślniczy).
  * $55 - 74\text{ pkt}$: `ACCEPTABLE` (Wyrób poprawny z drobnymi odchyleniami).
  * Poniżej $55\text{ pkt}$: `FLAWED` (Wada technologiczna / błąd fermentacji).
* **Diagnostyka wad i rekomendacje naprawcze:**
  * Ser: wykrywanie kredowości/nadkwasowości (rekomendacja: washing the curd), przesolenia, zjełczenia tłuszczów (lipoliza).
  * Kiszonki: utrata chrupkości i rozkład pektyn (rekomendacja: liście dębu/chrzanu bogate w garbniki, obniżenie temp. fermentacji < 20°C).
  * Kombucha/Octy: mdły posmak i brak kwasowości (rekomendacja: wydłużenie 1F, lepszy dostęp tlenu).
* **Kryteria akceptacji:**
  1. Integracja w widoku partii z możliwością 1-tap zapisu oceny do tabeli `sensory_evaluations`.
  2. Wyświetlanie wykrytych wad i konkretnych porad rzemieślniczych.
* **Persona:** P1, P2, P3, P6, P7.
* **Priorytet:** MUST | **Etap:** MVP.
