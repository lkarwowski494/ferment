# **SEROWAR BRD 0.1 — Rozdział 7: Narzędzia — Zegarki, Live Activity, Sensory i Sensoryka (B8)**

> **Moduł:** `BR-SYS-001` do `BR-SYS-030`  
> **Kontekst dziedzinowy:** Hands-free w kuchni serowarskiej ("ręce w serwatce"), Apple Watch, Garmin Connect IQ, widżety Live Activity w czasie rzeczywistym, odczyt z czujników BLE, wektorowy radar sensoryczny sera (SVG).

---

### **BR-SYS-001: Asystent Live Activity i Dynamic Island (iOS ActivityKit)**
* **Opis:** Ciągła prezentacja odliczania kluczowych faz procesu serowarskiego na zablokowanym ekranie iPhone'a oraz w Dynamic Island.
* **Scenariusze Live Activity:**
  1. **Odliczanie do punktu flokulacji:** stoper miseczki z przyciskiem szybkiej akcji „Złapano flokulację”.
  2. **Odliczanie do cięcia skrzepu:** czas mnożnika flokulacji ($t_f \times M$).
  3. **Rampa dogrzewania skrzepu / twarogu:** aktualna temperatura docelowa i tempo grzania.
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
  * Wyświetlanie aktualnego kroku procesu (np. „Dogrzewaj skrzep — jeszcze 6 minut do 38°C”).
  * Dźwiękowa i haptyczna sygnalizacja alarmów obrotu sera w prasie i solance.
* **Kryteria akceptacji:**
  * Niezależne działanie timera na Apple Watch nawet przy zerwanym połączeniu Bluetooth z telefonem.
* **Persona:** P1, P6.
* **Priorytet:** SHOULD | **Etap:** MVP/1.1.

---

### **BR-SYS-015: Bezprzewodowa Integracja z Czujnikami Środowiskowymi BLE**
* **Opis:** Automatyczne pobieranie odczytów temperatury i wilgotności względnej z bezprzewodowych tagów Bluetooth Low Energy umieszczonych w dojrzewalni lub chłodziarce serowarskiej.
* **Wspierane czujniki (protokoły broadcast Manufacturer Data):**
  * **RuuviTag (Finlandia):** format RAWv2 (temperatura, wilgotność z dokładnością do 0.1%, ciśnienie atmosferyczne).
  * **Xiaomi Mijia BLE (np. LYWSD03MMC z firmware ATC/BTHome):** temperatura i wilgotność.
* **Kryteria akceptacji:**
  1. Aplikacja nie wymaga parowania z chmurą producenta — nasłuchuje lokalnych pakietów rozgłoszeniowych BLE w tle.
  2. Automatyczne dopisywanie odczytów do wykresu mikroklimatu partii w Cave Log.
* **Persona:** P6, P7.
* **Priorytet:** COULD | **Etap:** 1.1.

---

### **BR-SYS-020: Wektorowy Radar Sensoryczny Smaku i Dojrzałości Sera (Spider Radar SVG)**
* **Opis:** Interaktywny wykres pajęczynowy oceny dojrzałości sera oraz profilu sensorycznego produktów mlecznych.
* **Osie sensoryczne sera:**
  1. Kwasowość (Acidity / pH)
  2. Słoność (Salinity)
  3. Elastyczność / Zwartość Miąższu (Elasticity / Curd Firmness)
  4. Maślanowość / Kremowość (Creaminess / Diacetyl)
  5. Ostrość / Pikantność (Pungency / Lipolysis)
  6. Orzechowość / Dojrzałość Proteolityczna (Nuttiness / Proteolysis)
* **Kryteria akceptacji:**
  * Wektorowy komponent SVG renderowany w 100% lokalnie, z możliwością nałożenia profilu wzorcowego stylu sera na profil uzyskany przez użytkownika.
* **Persona:** P1, P3, P6, P7.
* **Priorytet:** SHOULD | **Etap:** MVP.
