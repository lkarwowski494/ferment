# Raport Audytu Jakości, Bezpieczeństwa i Gotowości Wydania — SEROWAR

> **Projekt:** SEROWAR (`calm-planck`) — Rzemieślniczy asystent serowarstwa domowego i dojrzewalni (affinage)  
> **Rola:** Forensic QA & Release Auditor (`coding/audyt-qa`)  
> **Zasada:** **Dowód Zamiast Deklaracji** (Zero papierowych audytów, rygor instrumentalny)

---

## 1. Metryka Audytu

* **Repozytorium:** `lkarwowski494/ferment` (`calm-planck`)
* **Badany SHA:** `f35bd8779cb2c382b34680ab734db24d160f1f01`
* **Gałąź:** `main` (stan roboczy: czysty, zsynchronizowany z `origin/main`)
* **Data badania:** 18 października 2026 r.
* **Środowisko audytorskie:** Node.js v24.20.0, npm 11.6.0, Python 3.12, Windows 11
* **Zakres audytu:** Pełny audyt poprodukcyjny (10 soczewek jakościowych, 22 wzorce usterek `A1`–`A22`, 4 moduły domenowe)

---

## 2. Podsumowanie Wykonawcze (Executive Scorecard)

> **Werdykt:** `🟠 WYDANIE WARUNKOWE` (CONDITIONAL PASS)  
> Aplikacja prezentuje najwyższy kunszt inżynieryjny (100% zielonych testów, zero wycieków pamięci, deterministyczny PBT, autentyczny silnik SQLite DDL, brak telemetrii third-party), lecz wydanie produkcyjne jest warunkowane uzupełnieniem zapadki `coverageThreshold` oraz przetestowaniem modułu generowania arkuszy produkcyjnych PDF (`pdf-sheet-generator.ts`).

### Bilans Znalezisk wg Wag:
* 🔴 **KRYTYCZNE (Blokery):** `0`
* 🟠 **WYSOKIE (Poważne luki):** `2`
* 🟡 **ŚREDNIE (Dług techniczny/brzegowe):** `2`
* 🟢 **NISKIE (Kosmetyczne):** `0`

### Tabela Wskaźników Instrumentalnych:
| Metryka Jakościowa | Wymagane | Zmierzono | Status |
| :--- | :---: | :---: | :---: |
| **Kompilacja TypeScript (`tsc --noEmit`)** | 0 błędów | **0 błędów** | ✅ ZDANE |
| **Błędy i wycieki testów (`jest`)** | 0 fail | **0 fail (482/482 pass)** | ✅ ZDANE |
| **Pokrycie Macierzy AST (`matrix:check`)** | 100.0% | **100.0% (1026/1026)** | ✅ ZDANE |
| **Pokrycie słownika i18n (`check:i18n`)** | 100.0% | **100.0% (752/752 w kodzie)** | ✅ ZDANE |
| **Zgodność z Wyroczniami Python (`check:corpus`)** | 100.0% | **100.0% (4 korpusy zgodne)** | ✅ ZDANE |
| **Zgodność licencji (`check:licenses`)** | 100% Permissive | **100% (22 biblioteki)** | ✅ ZDANE |
| **Cykliczne zależności (`check:cycles`)** | 0 cykli | **0 cykli** | ✅ ZDANE |
| **Format ikony App Store (`assets/icon.png`)** | ColorType 2 (RGB) | **ColorType 2 (1024x1024)** | ✅ ZDANE |
| **Zapadka pokrycia `coverageThreshold` w Jest** | Wymagana | **BRAK w `jest.config.js`** | ❌ LUKA |
| **Pokrycie linii `pdf-sheet-generator.ts`** | > 80% | **0.0% (linie 25-215)** | ❌ LUKA |

---

## 3. Konfrontacja Deklaracji z Rzeczywistością

| ID | Twierdzenie z Dokumentacji (`docs/20`, `docs/macierz-testow.md`) | Stan Rzeczywisty w Kodzie (Pomiar Instrumentalny) | Werdykt |
| :---: | :--- | :--- | :---: |
| **C1** | *Macierz AST:* 100% pokrycia we wszystkich 5 kategoriach | Potwierdzone przez `node scripts/test-matrix.mjs --check`: 1026/1026 elementów (100.0%). | **POTWIERDZONE** ✅ |
| **C2** | *Wyrocznie Python:* 100% zgodności obliczeń z fizyką i formułami Pythona | Potwierdzone przez `node scripts/check-corpus.mjs`: 56 psychrometria, 6 prasy, 5 solanka, 5 enzymy, 15 DST. | **POTWIERDZONE** ✅ |
| **C3** | *PBT Determinizm:* powtarzalność prób generatora z ziarnem | Potwierdzone w `tests/matrix-invariants.prop.test.ts`: stałe ziarno `PROP_SEED=1592594996` dla 200 przebiegów. | **POTWIERDZONE** ✅ |
| **C4** | *Realne testy SQLite:* brak mocków, autentyczny DDL i rollback | Potwierdzone w `tests/data/sqlite-real.test.ts`: silnik `node:sqlite` weryfikuje DDL, foreign keys i rollback. | **POTWIERDZONE** ✅ |
| **C5** | *Wymiary dotykowe Apple HIG:* min. 44x44 pt bez tolerancji | Potwierdzone w `src/components/ui/index.tsx`: jawne `minWidth: 44, minHeight: 44`, usunięto tolerancję `?? 44`. | **POTWIERDZONE** ✅ |
| **C6** | *Odporność timerów i ochrona przed podwójnym tapnięciem* | Potwierdzone: listener `AppState` w `index.tsx`, blokada synchroniczna `isMutatingRef` w `cave.tsx`. | **POTWIERDZONE** ✅ |
| **C7** | *Bezpieczeństwo i brak telemetrii third-party* | Potwierdzone: `PrivacyInfo.xcprivacy` zawiera wymagane kategorie API, zero trackerów SDK w `package.json`. | **POTWIERDZONE** ✅ |
| **C8** | *Zasoby binarne:* ikona sklepowa zgodna z Apple ITMS-90717 | Potwierdzone: nagłówek IHDR `assets/icon.png`: 1024x1024, bitDepth=8, **colorType=2** (RGB bez kanału alfa). | **POTWIERDZONE** ✅ |
| **C9** | *Warstwa 1 DoD:* „100% pokrycia linii, gałęzi, funkcji i instrukcji w `src/core/` i `src/lib/`” | **OBALONE!** (Wzorce `A1` i `A3`): `jest.config.js` **nie posiada zdefiniowanego `coverageThreshold`**! Pomiar pokrycia ujawnił moduły o zerowym lub obniżonym pokryciu (`pdf-sheet-generator.ts`: 0%, `backup.ts`: 57.3%, `app-access.ts`: 54.5%). | **OBALONE** ❌ |

---

## 4. Porównanie z Linią Bazową (`audit-baseline.json`)

Zainicjalizowano formalny plik linii bazowej [`audit-baseline.json`](file:///C:/Users/lukas/Documents/antigravity/calm-planck/audit-baseline.json) na badanym commicie `f35bd87`:
* Liczba zestawów testów: **82**
* Liczba testów: **482** (100% zdanych)
* Czas wykonania: **7.88 s**
* Elementy macierzy AST: **1026 / 1026 (100.0%)**
* Klucze słownika i18n: **752 w kodzie / 1053 w EN (100.0%)**
* Zależności produkcyjne: **22** (0 cykli, 0 podatności)

---

## 5. Rejestr Znalezisk (Defect Log)

### 🟠 QA-01 [WYSOKA] [Realne] [TST / Wzorzec A3]
**Brak zdefiniowanego `coverageThreshold` i `collectCoverageFrom` w konfiguracji Jest**
* **Kryterium:** Wzorzec `A3` (Dziurawa zapadka pokrycia).
* **Dowód:** [`jest.config.js:1-13`](file:///C:/Users/lukas/Documents/antigravity/calm-planck/jest.config.js#L1-L13) nie zawiera klucza `coverageThreshold` ani reguł `collectCoverageFrom`.
* **Kroki reprodukcji:** Uruchomienie `npx jest` nie weryfikuje żadnych minimalnych progów pokrycia kodu. Kod bez testów przechodzi bez ostrzeżenia.
* **Wpływ na wydanie:** Ryzyko cichej regresji i wprowadzania nieprzetestowanych modułów na gałąź `main`.
* **Rekomendowana naprawa:** Dodać do `jest.config.js` definicję `collectCoverageFrom: ['src/core/**/*.ts', 'src/lib/**/*.ts', '!src/core/domain/**']` oraz skonfigurować twarde progi pokrycia.

---

### 🟠 QA-02 [WYSOKA] [Realne] [TST / Wzorzec A1]
**Moduł generowania arkuszy produkcyjnych PDF (`pdf-sheet-generator.ts`) posiada 0% pokrycia testami**
* **Kryterium:** Wzorzec `A1` (Deklaratywna zieleń / Papierowy Audyt) oraz Warstwa 1 DoD.
* **Dowód:** Raport pokrycia Jest dla [`src/lib/pdf-sheet-generator.ts`](file:///C:/Users/lukas/Documents/antigravity/calm-planck/src/lib/pdf-sheet-generator.ts) wykazuje `0%` linii (linie 25-215 niepokryte).
* **Kroki reprodukcji:** Uruchomienie `npx jest --coverage --collectCoverageFrom="src/lib/pdf-sheet-generator.ts"`.
* **Wpływ na wydanie:** Błędy formatowania szablonu HTML/PDF, brak walidacji pustych partii lub błędy stylów CSS w wygenerowanym dokumencie PDF dla serowara.
* **Rekomendowana naprawa:** Napisać kompleksowy zestaw testów jednostkowych [`tests/lib/pdf-sheet-generator.test.ts`](file:///C:/Users/lukas/Documents/antigravity/calm-planck/tests/lib/pdf-sheet-generator.test.ts) testujący strukturę generowanego HTML, formatowanie dat, etykiety serowarskie i brak podatności XSS.

---

### 🟡 QA-03 [ŚREDNIA] [Brzegowe] [DAT / Wzorzec A10]
**Niepełne pokrycie ścieżek odzysku i rotacji kopii w `src/lib/backup.ts`**
* **Kryterium:** Wzorzec `A10` (Krucha trwałość i brak ścieżki odzysku / Data Loss).
* **Dowód:** Raport pokrycia wykazuje 57.3% linii w [`src/lib/backup.ts`](file:///C:/Users/lukas/Documents/antigravity/calm-planck/src/lib/backup.ts#L181-L213) (linie 45, 60-71, 153-158, 181-186, 193-213, 249-253 niepokryte).
* **Kroki reprodukcji:** Analiza pokrycia `backup.ts` w teście `tests/lib/backup.test.ts`.
* **Wpływ na wydanie:** Potencjalne błędy przy rotacji kopii zapasowych lub przywracaniu z uszkodzonego pliku JSON.
* **Rekomendowana naprawa:** Rozszerzyć `tests/lib/backup.test.ts` o testy odrzucenia nieprawidłowego schematu JSON, rotacji przy kolizji nazw i usuwania przeterminowanych kopii.

---

### 🟡 QA-04 [ŚREDNIA] [Brzegowe] [SEC / Wzorzec A11]
**Brak testów obsługi błędów w module udostępniania eksportu CSV (`shareCsvExport`)**
* **Kryterium:** Wzorzec `A11` (Niebezpieczny eksport/import).
* **Dowód:** W [`src/lib/csv-export.ts:158-180`](file:///C:/Users/lukas/Documents/antigravity/calm-planck/src/lib/csv-export.ts#L158-L180) funkcja `shareCsvExport` nie jest przetestowana pod kątem zachowania, gdy natywny moduł `Sharing` jest niedostępny lub rzuca błąd I/O.
* **Kroki reprodukcji:** Analiza pokrycia `src/lib/csv-export.ts` (linie 158-180 niepokryte).
* **Wpływ na wydanie:** Niezłapany błąd systemowego share sheetu na rzadkich konfiguracjach Androida.
* **Rekomendowana naprawa:** Dodać testy dla `shareCsvExport` w `tests/lib/csv-export.test.ts` weryfikujące poprawność generowanej ścieżki pliku i fallback.

---

## 6. Przegląd w 10 Soczewkach Audytorskich

| Soczewka | Ocena | Podsumowanie stanu |
| :--- | :---: | :--- |
| **1. `ARCH` (Architektura)** | ✅ | Czysty podział na warstwy `core/`, `data/`, `lib/`, `ui/`, `app/`. 0 cykli zależności (`madge`), deterministyczny build `npm ci`. |
| **2. `LOG` (Logika i Obliczenia)** | ✅ | Formuły psychrometrii, kaskady pras i solanek w 100% zgodne z niezależnymi wyliczeniami w Pythonie. 7 niezmienników PBT. |
| **3. `DAT` (Trwałość Danych)** | ⚠️ | Schemat DDL `FERMENT_SQL_DDL` z `PRAGMA foreign_keys = ON` i `Zero Partial Writes`. Wymaga domknięcia testów rotacji w `backup.ts`. |
| **4. `UI` (Interfejs Użytkownika)** | ✅ | 4-zakładkowa nawigacja serowarska, spójne komponenty, brak alertów systemowych z „Tak/Nie”, blokada wielokliku. |
| **5. `UX` (Doświadczenie Użytkownika)** | ✅ | Zero wymuszonego onboardingu (TTV < 15s), timery odporne na usypianie systemu, bezpieczne cofanie akcji w dojrzewalni. |
| **6. `A11Y` (Dostępność i i18n)** | ✅ | Touch targets min. 44x44pt bez tolerancji w stylach bazowych, obsługa Dynamic Type AX5 i ekranu 320pt, 0 wycieków i18n. |
| **7. `TST` (Szczelność Testów)** | ⚠️ | 82 test suites, 482 tests zdanych, eliminacja test-theatru. Wykryto brak zapadki `coverageThreshold` i 0% w `pdf-sheet-generator.ts`. |
| **8. `SEC` (Bezpieczeństwo i Prywatność)** | ✅ | Zero trackerów, brak telemetrii, sanitizacja SQL (`?` bindings), ochrona przed CSV Formula Injection (`'`), Privacy Manifests zgodne z Apple. |
| **9. `PERF` (Wydajność)** | ✅ | Wszystkie operacje na dużych zbiorach poniżej twardych limitów CPU: 5k logów < 50ms, 1k partii < 50ms, CSV < 80ms. |
| **10. `REL` (Gotowość Wydania)** | ✅ | Poprawny format ikony PNG ColorType 2, zweryfikowane potoki GitHub Actions (`ci.yml`, `testflight.yml`, `tests-tz.yml`). |

---

## 7. Obszary Niezweryfikowane (Środowiskowe)

* **Kompilacja `.ipa` w Xcode:** Z uwagi na środowisko Windows, generowanie natywnego archiwum iOS `.xcarchive` / `.ipa` jest weryfikowane statycznie (`verify-native.mjs`), a właściwa kompilacja z kodowaniem certyfikatów TestFlight jest powierzona środowisku `macos-14` w workflow `.github/workflows/testflight.yml`.

---

## 8. Plan Naprawczy (Remediation Plan — Krok po Kroku)

W celu osiągnięcia bezwzględnego statusu `🟢 GOTOWE DO WYDANIA` zaplanowano 3 precyzyjne kroki w cyklu TDD:

### Krok 1 (Bloker Jakościowy — QA-02 & QA-04):
* Utworzenie zestawu testów [`tests/lib/pdf-sheet-generator.test.ts`](file:///C:/Users/lukas/Documents/antigravity/calm-planck/tests/lib/pdf-sheet-generator.test.ts) pokrywającego generowanie szablonu HTML, formatowanie parametrów serowarskich i zabezpieczenia przed wstrzykiwaniem HTML.
* Rozszerzenie [`tests/lib/csv-export.test.ts`](file:///C:/Users/lukas/Documents/antigravity/calm-planck/tests/lib/csv-export.test.ts) o testy `shareCsvExport`.

### Krok 2 (Ochrona Danych i Odzysk — QA-03):
* Rozszerzenie [`tests/lib/backup.test.ts`](file:///C:/Users/lukas/Documents/antigravity/calm-planck/tests/lib/backup.test.ts) o testy odrzucenia uszkodzonego JSON, czyszczenia starych kopii i rotacji przy kolizji nazw.

### Krok 3 (Twarda Zapadka Jakościowa — QA-01):
* Dodanie do [`jest.config.js`](file:///C:/Users/lukas/Documents/antigravity/calm-planck/jest.config.js) zapadki `coverageThreshold` oraz `collectCoverageFrom` chroniącej katalogi `src/core/` oraz `src/lib/`.
* Aktualizacja `.github/workflows/ci.yml` o wywołanie `npm run verify:pr`.

---

## 9. Ostateczny Werdykt Audytu

> **Werdykt:** `🟠 WYDANIE WARUNKOWE` (CONDITIONAL RELEASE)  
> Przejście do publikacji w App Store / Google Play wymaga zrealizowania powyższego 3-krokowego Planu Naprawczego w celu podniesienia werdyktu do `🟢 GOTOWE DO WYDANIA`.
