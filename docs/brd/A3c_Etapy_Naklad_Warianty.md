# **FERMENT BRD 0.1 — Część A: Etapy Wdrożenia, Nakład Pracy i Warianty (Rozdziały 6.3–6.5)**

> **Ekosystem:** Apps4Brew Studio | **Projekt:** FERMENT (Ser i Flora / Mikrobiologia Domowa)

---

## **Rozdział 6.3 Klasyfikacja Etapów Wdrożenia**

Wszystkie wymagania w rejestrze funkcjonalnym posiadają przypisany dokładnie jeden etap wdrożenia:
1. **MVP (Wersja 1.0):** Rdzeń serowarski (mleko, CaCl2, podpuszczka IMCU, flokulacja, prasa, solanka, Cave Log do 3 krążków) + asystent kiszonek i kimchi + spiżarnia z auto-odpisem + Live Activity + eksport CSV/JSON.
2. **Wersja 1.1:** Pełny moduł kombuchy (1F i 2F z ciśnieniem CO2) i żywych octów owocowych + bezpośrednia integracja z czujnikami BLE (RuuviTag, Mijia) + nielimitowany Cave Log w wersji Pro.
3. **Wersja 1.2:** Aplikacja towarzysząca Garmin Connect IQ + zaawansowane profile szczepów regionalnych + moduł serów propionowych z komorą ciepłą.
4. **Wersja 2.x:** Algorytmy computer vision do oceny barwy skórki i wielkości oczek sera + bezprzewodowa synchronizacja p2p między urządzeniami.
5. **Nigdy (Koncepcje odrzucone):** Logowanie do chmury, publiczne fora społecznościowe, reklamy bannerowe, analityka Firebase/telemetria, generowanie pseudonaukowych porad przez chmurowe LLM.

---

## **Rozdział 6.4 Szacowany Nakład Pracy Agenta**

Szacunki bazują na modelu autonomicznego agenta inżynieryjnego studia Apps4Brew pracującego zgodnie z procedurami `trening` i `Oczko` (test-driven development, rygor TypeScript, generowanie macierzy testowych, zero długu technologicznego):

| Obszar / Moduł | Dni pracy agenta | Uwagi i zależności |
| :--- | :--- | :--- |
| **Architektura, relacyjna baza SQLite WAL, DDL, migracje** | 2.5 dnia | Fundament persystencji, 18 tabel relacyjnych, rotacja 10 kopii backupu |
| **Moduł B1: Kalkulator Serowara (Mleko, CaCl2, IMCU, Flokulacja)** | 3.5 dnia | Precyzyjne wzory enzymatyczne, interaktywny stoper flokulacji, testy Jest |
| **Moduł B2: Skrzep, Ziarno, Rampa Dogrzewania, Prasa** | 3.0 dni | Matematyka nacisku powierzchniowego, harmonogramy wieloetapowe |
| **Moduł B3: Solenie, Solanka Nasycona, Bufor pH i Ca** | 2.0 dni | Chemia solanek serowarskich, przeliczniki Baumé/Salometer |
| **Moduł B4: Cave Log (Dziennik Dojrzewania, Affinage)** | 4.0 dni | Złożony moduł harmonogramów pielęgnacji, powiadomienia, psychrometria |
| **Moduł B5: Kiszonki Warzywne, Kimchi, Zakwasy (3 Fazy LAB)** | 2.5 dnia | Solanki wagowe, algorytm kapusty kimchi, walidator pH 4.6 |
| **Moduł B6: Kombucha 1F/2F i Żywe Octy (Etap 1.1)** | 3.0 dni | Kinetyka CO2 w butelkach, stechiometria kwasu octowego |
| **Moduł B7: Spiżarnia, Auto-Odpis, Etykiety PDF z QR, Koszty** | 2.5 dnia | Generator PDF (`expo-print`), skaner kodów (`expo-camera`), yield calc |
| **Moduł B8: Live Activity, Apple Watch, Sensoryka SVG** | 3.5 dnia | ActivityKit na iOS, radar sensoryczny SVG, haptics |
| **Moduł C1–C4: Szkoła, Diagnostyk Wad, 50 Reguł Dziedzinowych** | 4.5 dnia | Kompletny silnik diagnostyczny, 50 reguł z wektorami testowymi |
| **Moduł D1–D4: Weryfikacja jakości, i18n (35 języków), a11y VoiceOver** | 4.0 dni | Bramka `check-i18n`, macierz testów `docs/19`, audyt WCAG AAA |
| **E2E Maestro, pipeline CI w GitHub Actions, TestFlight** | 2.5 dni | Scenariusze E2E na symulatorze iOS, workflowy wolne od EAS |
| **SUMA (Pełne MVP — Etap 1.0):** | **~28–32 dni pracy agenta** | Czas kalendarzowy: ok. 3–4 tygodnie przy pracy ciągłej |

---

## **Rozdział 6.5 Warianty Decyzyjne Startu Projektu**

* **Wariant A (Maksymalny):** Realizacja wszystkich modułów serowarskich, kiszonkarskich, kombuchy i octów w jednym wydaniu MVP (~38 dni agenta). Wydanie TestFlight opóźnione o ok. 2 tygodnie.
* **Wariant B+ (Rekomendowany przez analityka):** Realizacja pełnego modułu serowarskiego + kiszonki/kimchi/zakwasy w MVP (~30 dni agenta). Kombucha i octy wchodzą jako aktualizacja 1.1 w drugim sprincie.
* **Wariant C (Minimalny serowarski):** Tylko i wyłącznie kalkulator sera i Cave Log bez warzyw (~20 dni agenta). Ryzyko rozmycia tożsamości „FERMENT”.
