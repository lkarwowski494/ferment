# **FERMENT BRD 0.1 — Rozdział 17: Dziewięciowarstwowa Strategia Testów i Jakości (D4)**

> **Standard inżynieryjny:** Oparty na rygorystycznym dokumencie `docs/20-definicja-ukonczenia.md` z projektu `trening`.  
> **Zasada właściciela z 06.10.2026:** „Każda funkcjonalność ma mieć przy wdrażaniu pełen zakres zautomatyzowanych testów każdych przypadków i każdego rodzaju”.

---

## **1. Dziewięć Warstw Testów Automatycznych w FERMENT**

| # | Warstwa testu | Zakres i cel weryfikacji | Narzędzie i pliki |
|---|---|---|---|
| **1** | **Logika (Pure Logic)** | Deterministyczne funkcje matematyczne: dawkowanie podpuszczki IMCU, flokulacja, prasa serowarska, solanka masowa, punkt rosy, kinetyka CO2. | Jest (`tests/core/*.test.ts`) |
| **2** | **Ekran (Component UI)** | Renderowanie każdego ekranu, interakcje z formularzami, zachowanie przycisków, poprawne formatowanie liczb i jednostek. | React Native Testing Library (`tests/screens/*.test.tsx`) |
| **3** | **Scenariusz (User Journey)** | Kompletny przepływ: od konfiguracji mleka, przez flokulację, prasowanie, solankę, aż po zapis krążka w Cave Log i restart aplikacji. | `tests/scenarios/*.test.tsx` |
| **4** | **Macierz (Matrix Test)** | Iteracja po wszystkich kombinacjach stałych: gatunki mleka × obróbka termiczna × jednostki metryczne/imperialne × 35 języków. | `npm run check:matrix`, `tests/matrix-*.test.ts` |
| **5** | **Niezmienniki (Property & Invariants)** | Testy własności (fast-check): masa soli nigdy nie może być ujemna, czas flokulacji zawsze dodatni, pH w granicach 0–14. | `tests/invariants.test.ts` |
| **6** | **Dane i Persystencja** | Zapis do bazy SQLite WAL $\rightarrow$ restart symulatora $\rightarrow$ weryfikacja integralności. Testy migracji schematu i 10-krotnego backupu. | `tests/db-integrity.test.ts` |
| **7** | **Lokalizacja i i18n** | Weryfikacja kompletności słowników w 35 językach. Zero martwych kluczy i zero brakujących tłumaczeń. | `scripts/check-i18n.mjs`, `tests/i18n.test.ts` |
| **8** | **Regresja Sanitarna** | Każdy zaraportowany błąd biologiczny lub obliczeniowy otrzymuje test regresyjny blokujący build. | `tests/regress.test.ts` |
| **9** | **E2E Maestro na Symulatorze iOS** | Wizualne testy end-to-end w symulatorze: przejście ścieżki serowara, tapnięcia zegarkowe, generowanie etykiety PDF. | Maestro (`.maestro/*.yaml`) |

---

## **2. Bramka Jakościowa Verify (`npm run verify`)**
Przed każdym zatwierdzeniem kodu i wysłaniem do repozytorium GitHub uruchamiany jest kompletny pipeline sprawdzający:
1. `npm run typecheck` (rygor TypeScript zero błędów).
2. `npm run check:i18n` (spójność kluczy językowych).
3. `npm run check:matrix` (pełne pokrycie macierzy wymiarów).
4. `npm run test` (kompletny zestaw testów Jest ze 100% PASS).
5. `npm run expo:export` (weryfikacja bezbłędnej kompilacji bundla produkcyjnego).
