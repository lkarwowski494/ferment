# **SEROWAR BRD 0.1 — Część A: Etapy Wdrożenia, Nakład Pracy i Warianty (Rozdziały 6.3–6.5)**

> **Ekosystem:** Apps4Brew Studio | **Projekt:** SEROWAR (Rzemieślnicze Przetwórstwo Mleka)

---

## **Rozdział 6.3 Klasyfikacja Etapów Wdrożenia**

Wszystkie wymagania w rejestrze funkcjonalnym posiadają przypisany dokładnie jeden etap wdrożenia:
1. **MVP (Wersja 1.0):** Kompletny rdzeń serowarski (mleko, CaCl2, podpuszczka IMCU, stoper flokulacji, prasa, solanka, Cave Log do 3 krążków) + moduł twarogów klinkowych i serów świeżych + moduł masielnictwa i ghee + jogurt/kefir + zamknięty obieg serwatki (ricotta, brunost) + spiżarnia z auto-odpisem + Live Activity + eksport CSV/JSON.
2. **Wersja 1.1:** Bezpośrednia integracja z czujnikami BLE (RuuviTag, Mijia) + nielimitowany Cave Log w wersji Pro + asystent rotacji szczepów przeciw bakteriofagom.
3. **Wersja 1.2:** Aplikacja towarzysząca Garmin Connect IQ + zaawansowane profile szczepów alpejskich + moduł komory ciepłej dla serów propionowych z wielkimi oczkami.
4. **Wersja 2.x:** Algorytmy computer vision do oceny barwy skórki i wielkości oczek sera + synchronizacja p2p między urządzeniami serowara.
5. **Nigdy (Koncepcje odrzucone):** Logowanie do chmury, publiczne fora społecznościowe, reklamy bannerowe, telemetria/tracking, obsługa produktów niemlecznych (kiszonek, kombuchy, octów).

---

## **Rozdział 6.4 Szacowany Nakład Pracy Agenta**

Szacunki bazują na modelu autonomicznego agenta inżynieryjnego studia Apps4Brew (test-driven development, zero długu technologicznego):

| Obszar / Moduł | Dni pracy agenta | Uwagi i zależności |
| :--- | :--- | :--- |
| **Architektura, relacyjna baza SQLite WAL, DDL, migracje** | 2.5 dnia | Fundament persystencji, 18 tabel relacyjnych mleczarskich, rotacja 10 kopii backupu |
| **Moduł B1: Kalkulator Serowara (Mleko, CaCl2, IMCU, Flokulacja)** | 3.5 dnia | Precyzyjne wzory enzymatyczne, interaktywny stoper flokulacji, testy Jest |
| **Moduł B2: Skrzep, Ziarno, Rampa Dogrzewania, Prasa** | 3.0 dni | Matematyka nacisku powierzchniowego, harmonogramy wieloetapowe |
| **Moduł B3: Solenie, Solanka Nasycona, Bufor pH i Ca** | 2.0 dni | Chemia solanek serowarskich, przeliczniki Baumé/Salometer |
| **Moduł B4: Cave Log (Dziennik Dojrzewania, Affinage)** | 4.0 dni | Złożony moduł harmonogramów pielęgnacji, powiadomienia, psychrometria |
| **Moduł B5: Twarogi Klinkowe i Sery Świeże (Labneh, Paneer)** | 2.5 dnia | Kinetyka pI 4.6, rampa dogrzewania 35–45°C, formowanie klinka |
| **Moduł B6: Masielnictwo, Ghee, Napoje Mleczne i Serwatka** | 3.5 dnia | Okno temperaturowe zmaślania, wytapianie ghee, ricotta i karmelizacja brunost |
| **Moduł B7: Spiżarnia, Auto-Odpis, Etykiety PDF z QR, Koszty** | 2.5 dnia | Generator PDF (`expo-print`), skaner kodów (`expo-camera`), yield calc |
| **Moduł B8: Live Activity, Apple Watch, Sensoryka SVG** | 3.5 dnia | ActivityKit na iOS, radar sensoryczny sera SVG, haptics |
| **Moduł C1–C4: Szkoła, Diagnostyk Wad, 50 Reguł Mleczarskich** | 4.5 dnia | Kompletny silnik diagnostyczny wad nabiału, 50 reguł z wektorami testowymi |
| **Moduł D1–D4: Weryfikacja jakości, i18n (35 języków), a11y VoiceOver** | 4.0 dni | Bramka `check-i18n`, macierz testów `docs/19`, audyt WCAG AAA |
| **E2E Maestro, pipeline CI w GitHub Actions, TestFlight** | 2.5 dni | Scenariusze E2E na symulatorze iOS, workflowy wolne od EAS |
| **SUMA (Pełne MVP — Etap 1.0):** | **~38 dni pracy agenta** | Czas kalendarzowy: ok. 3–4 tygodnie przy pracy ciągłej agenta |

---

## **Rozdział 6.5 Warianty Decyzyjne Startu Projektu**

* **Wariant A (Rekomendowany — Pełne Przetwórstwo Mleczne):** Realizacja pełnego ekosystemu mleczarskiego w MVP (ser podpuszczkowy + twaróg + masło + kefir/jogurt + ricotta/brunost + Cave Log). Zapewnia natychmiastowy efekt WOW i kompletną gospodarkę surowcem bez marnowania litra mleka (~38 dni agenta).
* **Wariant B (Tylko Sery Twarde i Cave Log):** Realizacja wyłącznie kalkulatora podpuszczki, prasy, solanki i leżakowania (~22 dni agenta). Odrzucenie masła i twarogów do etapu 1.1.
