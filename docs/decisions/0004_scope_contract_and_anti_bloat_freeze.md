# 0004: Kontrakt Zakresu MVP v1.0, Taksonomia Bloatu i Zamrożenie Wymagań

* **Data decyzji:** 17.10.2026
* **Status:** ZAAKCEPTOWANE
* **Decydent:** Head of Product & Scope Gatekeeper (Rola 4) w porozumieniu z Właścicielem
* **Projekt:** SEROWAR (`calm-planck`)
* **Powiązanie z rejestrem decyzji:** `DEC-01`, `DEC-02`, `DEC-03`, `DEC-05`, `DEC-16`...`DEC-20`
* **Dokumenty powiązane:** [`docs/scope-contract.md`](file:///C:/Users/lukas/Documents/antigravity/calm-planck/docs/scope-contract.md), [`docs/brd/00b_Jedna_lista_decyzji.md`](file:///C:/Users/lukas/Documents/antigravity/calm-planck/docs/brd/00b_Jedna_lista_decyzji.md), [`docs/audyt-monetyzacji.md`](file:///C:/Users/lukas/Documents/antigravity/calm-planck/docs/audyt-monetyzacji.md)

---

## 1. Kontekst i Uzasadnienie

Po wykonaniu analizy biznesowej BRD (Rola 1), analizy wzorców UX i blueprintu ekranów (Rola 2) oraz audytu monetyzacji StoreKit 2 (Rola 3), konieczne było sformalizowanie wiążącego **Kontraktu Zakresu (Scope Contract)**, który zamraża funkcjonalności wersji 1.0 (MVP) i bezwzględnie chroni aplikację przed syndromem "Product Bloat" oraz "Zasadą Zerowego Kosztu Kodu AI" (Zero-Cost AI Fallacy).

---

## 2. Podjęte Rozstrzygnięcia Decyzyjne

1. **Aksjomat $0 a Cognitive Load:**
   Łatwość generowania kodu przez AI nie uzasadnia wprowadzania funkcji. Każda funkcja w widoku głównym musi przejść Test Słoika (brak paraliżu poznawczego, ergonomia dla mokrych dłoni serowara).

2. **Dekompozycja na Rodzinę Aplikacji (Anti-Combine):**
   *SEROWAR* skupia się wyłącznie na przetwórstwie mlecznym (sery, twarogi, masło, napoje, serwatka). Tematyka kiszonek warzywnych, kombuchy i octów została bezpowrotnie wydzielona do satelickiej aplikacji *SŁOIK* w portfolio.

3. **Etapy Wdrożenia Funkcji Brzegowych:**
   * **BLE Sensors (RuuviTag, Mijia):** Przesunięte do wersji 1.1 PRO. W v1.0 odczyt jest manualny.
   * **Niezależny watchOS:** Przesunięty do wersji 1.1/1.2. W v1.0 wsparcie przez Live Activity i interaktywne powiadomienia.
   * **Rotacja kultur przeciw bakteriofagom:** Przesunięta do wersji 1.1 PRO.
   * **AI Vision (analiza oczek sera):** Odłożona do wersji 2.0.

4. **Granice Monetyzacji i Tarcza Odczytu:**
   * Limit darmowy: do 3 aktywnych krążków leżakujących w Dojrzewalni Cave Log. Wersja PRO odblokowuje nielimitowaną liczbę partii i zaawansowane raporty.
   * Dożywotnia Tarcza Odczytu: Użytkownik darmowy nigdy nie traci dostępu do odczytu ani eksportu własnych danych historycznych.
   * Czysty StoreKit 2 bez zewnętrznych serwerów i SDK analitycznych.

---

## 3. Skutki dla Kolejnych Ról

* **Dla Architekta Systemu (Rola 5):** Zakaz implementacji tabel synchronizacji chmurowej oraz encji niemlecznych. DDL skupiony na 18 tabelach SQLite WAL.
* **Dla Technical Writera (Rola 6):** Przejęcie całej warstwy encyklopedycznej do dedykowanego modułu Field Guide / Szkoła Mleczarstwa.
* **Dla Programistów (Role 7 i 8):** Skupienie na ergonomii 4 zakładek i utrzymaniu 100% zielonych testów w `npm run verify`.
