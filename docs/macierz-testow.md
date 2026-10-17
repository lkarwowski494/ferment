# Architektura Testów i Macierz Weryfikacji (Test Architecture Matrix) — SEROWAR

> **Projekt:** SEROWAR (`calm-planck`) — Rzemieślniczy asystent serowarstwa domowego i dojrzewalni (affinage)  
> **Rola:** Rola 8 — Architekt Testów i Automatyzacji Weryfikacji (`coding/architekt-testow`)  
> **Zasada Przewodnia:** **Zero False Confidence** (eliminacja test-theatru, 100% autentyczne testy bez pozorowania)

---

## 1. Architektura Piramidy Testów (9 Warstw Weryfikacji)

System weryfikacji aplikacji SEROWAR opiera się na 9 komplementarnych warstwach zapewniających pełne pokrycie wertykalne i horyzontalne:

```mermaid
flowchart TD
    L9["Warstwa 9: Mutation Testing (Stryker Mutator)"]
    L8["Warstwa 8: E2E Black-box UI Flows (Maestro E2E + CI Triage)"]
    L7["Warstwa 7: Concurrency, Timers & Background Resilience"]
    L6["Warstwa 6: UI Accessibility (WCAG 44x44pt, A11y Guards)"]
    L5["Warstwa 5: Real SQLite Storage (In-Memory DDL, Foreign Keys, Zero Partial Writes)"]
    L4["Warstwa 4: Property-Based Testing (Fast-Check, Monotonic Invariants)"]
    L3["Warstwa 3: Unit & Truth Oracles (Python Reference Corpus, Differential Testing)"]
    L2["Warstwa 2: Statyczna Integralność (i18n AST, Licencje, Cykle, SQL Injection Guards)"]
    L1["Warstwa 1: Type Safety & Soundness (TypeScript strict, zero any / @ts-ignore)"]

    L9 --> L8 --> L7 --> L6 --> L5 --> L4 --> L3 --> L2 --> L1
```

### Podsumowanie Warstw:
1. **L1 — Type Safety & Soundness:** `tsc --noEmit` w trybie strict, zero `any`, zero `@ts-ignore`, zero `@ts-expect-error` w kodzie produkcyjnym.
2. **L2 — Statyczna Integralność:** Weryfikacja brakujących kluczy i18n (`check:i18n`), zależności cyklicznych (`check:cycles`), legalności licencji dependencies (`check:licenses`), oraz audyt parametryzacji zapytań SQL (`tests/guards/sql-guards.test.ts`).
3. **L3 — Unit & Truth Oracles:** 51 zestawów testowych w `tests/core/` sprawdzających fizykę i biochemię serowarstwa (kwasowość, syneraza, psychrometria, dojrzałość, solanka). Orzekanie różnicowe (differential testing) z wyrocznią referencyjną `scripts/gen-dairy-corpus.py` w `tests/corpus.test.ts`.
4. **L4 — Property-Based Testing (PBT):** Deterministyczny PBT (`fast-check`) z rejestracją ziarna `PROP_SEED` w `tests/matrix-invariants.prop.test.ts`. Sprawdza niezmienniki fizyczne (np. monotoniczność prasy holenderskiej, punkt rosy $\le$ temperatura, VPD $\ge 0$).
5. **L5 — Real SQLite Storage:** Autentyczny silnik SQLite (`node:sqlite` / `DatabaseSync`) testujący pełny produkcyjny DDL (`FERMENT_SQL_DDL`), egzekwowanie `PRAGMA foreign_keys = ON`, `ON DELETE CASCADE`, integralność indeksów `PRAGMA integrity_check`, unikalność `wheel_tag` oraz atomowe wycofywanie transakcji (`Zero Partial Writes`) w `tests/data/sqlite-real.test.ts`.
6. **L6 — UI Accessibility & Native Components:** Testy celów dotykowych (Touch Targets $\ge 44 \times 44\,\text{pt}$) bez tolerancji i sztucznych fallbacków, rzeczywista weryfikacja stylów renderowanych komponentów (`tests/matrix-a11y.test.tsx`), guardy przycisków zamykania (`tests/close-button-guard.test.tsx`) oraz testowanie rzeczywistych produkcyjnych komponentów (`DeletableRow` w `tests/swipe-delete.test.tsx`).
7. **L7 — Concurrency & Background Resilience:** Weryfikacja zachowania liczników i interwałów po powrocie z tła systemowego (`AppState` background/active z timestamp trackingiem) w `tests/lib/resilient-timer-background.test.ts`, oraz ochrona przed wyścigami wielodotyku (`Double-Tap Race`) za pomocą synchronicznych referencji `useRef` w `tests/concurrency/double-tap.test.tsx`.
8. **L8 — E2E Black-box UI Flows:** Walidacja przepływów Maestro E2E (`.maestro/dairy-flow.yaml`), linter syntaktyczny (`scripts/check-maestro.mjs`) oraz automatyczny parser i triager awarii CI dla GitHub Step Summary (`scripts/ci/maestro-failures.py`).
9. **L9 — Mutation Testing:** Stryker Mutator skonfigurowany dla kluczowych silników serowarskich (`cheese-engine.ts`, `press-cascade.ts`, `brine-acidification.ts`, `cave-environment.ts`, `psychrometry.ts`, `ferment-engine.ts` itd.), z progiem break = 75%.

---

## 2. Dziesięć Wymiarów Jakości (Quality Dimensions)

| Wymiar Jakości | Cel & Zakres | Mechanizm Weryfikacji | Pliki Testowe / Narzędzia |
| :--- | :--- | :--- | :--- |
| **D1: Poprawność domenowa** | Precyzja wzorów biochemicznych, fizyki affinage i psychrometrii | Unit testy, differential testing z korpusem Python | `tests/core/*`, `tests/corpus.test.ts` |
| **D2: Stabilność i odporność** | Brak crashy przy pustych danych, błędach I/O, powrocie z tła | Testy brzegowe, weryfikacja timestampów | `tests/lib/resilient-timer-background.test.ts`, `tests/core/emergency-recovery.test.ts` |
| **D3: Wydajność (Budżety)** | Limity czasowe dla operacji na dużych zbiorach (1k-5k wpisów) | Testy budżetów czasowych (<50ms, <40ms) | `tests/perf/performance-budgets.test.ts` |
| **D4: Dostępność (a11y)** | Zgodność z WCAG 2.1 AA (min. 44x44pt touch targets, accessibilityLabel) | Rzeczywista inspekcja stylów `minWidth`/`minHeight` | `tests/matrix-a11y.test.tsx`, `tests/close-button-guard.test.tsx` |
| **D5: Bezpieczeństwo i Prywatność** | Zero SQL Injection, brak telemetrii third-party, Privacy Manifests | Statyczne guardy AST SQL, audyt `app.json` | `tests/guards/sql-guards.test.ts`, `tests/storekit/store-guidelines.test.ts` |
| **D6: Zgodność ze sklepami (StoreKit)** | Poprawne przejścia automatu stanów zakupów, offline restore | Automat 7 stanów transakcji, Guideline 3.1.1/5.1.1 | `tests/storekit/storekit-machine.test.ts`, `tests/storekit/store-guidelines.test.ts` |
| **D7: Czystość kodu i architektury** | Brak cykli zależności, zgodność z i18n, zero martwych ścieżek | AST i18n checker, madge cycle detector | `scripts/check-i18n.mjs`, `scripts/check-cycles.mjs` |
| **D8: Determinizm i Inwarianty** | Niezmienniczość matematyczna w losowych przejściach | Property-based testing z kontrolowanym ziarnem | `tests/matrix-invariants.prop.test.ts` |
| **D9: Współbieżność i Interakcje** | Eliminacja dublowania wpisów przy podwójnym kliknięciu | Guard synchroniczny `useRef`, symulacja wyścigów | `tests/concurrency/double-tap.test.tsx` |
| **D10: Integralność Bazy Danych** | Spójność relacyjna, transakcyjność, kaskadowe usuwanie | Real in-memory SQLite DDL, testy rollbacku | `tests/data/sqlite-real.test.ts` |

---

## 3. Matryca Pokrycia Luk (T1–T19 Gap Catalog)

| Kod Luki | Opis i Ryzyko | Zaimplementowane Rozwiązanie | Status |
| :--- | :--- | :--- | :---: |
| **T1: SQLite Mock Theater** | Pozorowanie bazy przez `jest.fn()` maskujące błędy DDL | Wdrożenie `tests/data/sqlite-real.test.ts` na `node:sqlite` z realnym `FERMENT_SQL_DDL` |  Rozwiązane |
| **T2: Partial Writes** | Błędy zapisu partii pozostawiające osierocone rekordy w tabelach powiązanych | Test atomowości transakcji i rollbacku w `tests/data/sqlite-real.test.ts` |  Rozwiązane |
| **T3: UI A11y Fallback Theater** | Testy a11y akceptujące brak wymiarów przez sztuczny fallback `?? 44` | Usunięcie fallbacku, dodanie `minWidth: 44` do `src/components/ui/index.tsx` |  Rozwiązane |
| **T4: Component Mock Bypass** | Testowanie lokalnej atrapy zamiast prawdziwego komponentu `DeletableRow` | Eksport produkcyjnego `DeletableRow` w `src/components/ui/index.tsx` i test w `tests/swipe-delete.test.tsx` |  Rozwiązane |
| **T5: Floating Point Drifts** | Błędy zaokrągleń w obliczeniach solanki i masy skrzepu | Orzekanie oparte na `scripts/gen-dairy-corpus.py` i `tests/corpus.test.ts` |  Rozwiązane |
| **T6: Double-Tap Race** | Wielokrotne kliknięcie tworzące zduplikowane obroty krążka w jaskini | Blokada synchroniczna `isMutatingRef` w `app/(tabs)/cave.tsx` i test w `tests/concurrency/double-tap.test.tsx` |  Rozwiązane |
| **T7: Background Timer Drift** | Zatrzymanie `setInterval` w uśpionej aplikacji mobilnej | Timestamp tracking + subskrypcja `AppState` w `app/(tabs)/index.tsx`, test w `tests/lib/resilient-timer-background.test.ts` |  Rozwiązane |
| **T8: StoreKit Edge-Cases** | Brak testów odrzucenia transakcji, zwrotów i pracy offline | 7-stanowa maszyna w `tests/storekit/storekit-machine.test.ts` z obsługą offline cache |  Rozwiązane |
| **T9: App Store Guideline Violations** | Odrzucenie w App Store Review za brak Restore lub naruszenie prywatności | Statyczna weryfikacja Guideline 3.1.1, 5.1.1 i Privacy Manifests w `tests/storekit/store-guidelines.test.ts` |  Rozwiązane |
| **T10: Large Batch Degradation** | Spadek responsywności UI przy tysiącach wpisów w jaskini | Testy rygorystycznych budżetów czasowych (<50ms dla 5000 wpisów) w `tests/perf/performance-budgets.test.ts` |  Rozwiązane |
| **T11: SQL String Interpolation** | Podatność na wstrzykiwanie SQL przy dynamicznych filtrach | Statyczny guard AST weryfikujący brak interpolacji `${}` i wymuszający `?` w `tests/guards/sql-guards.test.ts` |  Rozwiązane |
| **T12: PBT Non-Determinism** | Losowe nieodtwarzalne błędy w testach inwariantów | Zastosowanie kontrolowanego `PROP_SEED` logowanego w konsoli w `tests/matrix-invariants.prop.test.ts` |  Rozwiązane |
| **T13: Missing Physics Monotonicity** | Niefizyczne wyniki prasy dźwigniowej i psychrometrii | Weryfikacja monotoniczności siły prasy i punktu rosy ($T_{dp} \le T$, $\text{VPD} \ge 0$) w PBT |  Rozwiązane |
| **T14: Unhandled Psychrometry Bounds** | Ujemne ciśnienia pary lub dzielenie przez zero przy $RH = 0\%$ | Rozszerzenie silnika i testów w `tests/core/psychrometry.test.ts` o pełen zakres parametrów |  Rozwiązane |
| **T15: Untested Brine Salt Drift** | Brak testów bilansu soli przy dokarmianiu i soleniu na sucho | Rozszerzenie `tests/core/brine-acidification.test.ts` o testy bilansu masy |  Rozwiązane |
| **T16: Missing Cave Action Reducers** | Nieprzetestowane akcje pielęgnacyjne w jaskini (przemywanie mazią) | Kompleksowe testy reduktora `applyCaveAction` w `tests/core/cave-log-actions.test.ts` |  Rozwiązane |
| **T17: Untested AST Translations** | Pomijanie nowych widoków serowarskich przez parser macierzy testów | Aktualizacja `scripts/test-matrix.mjs` z pełnym pokryciem 1026/1026 elementów (100%) |  Rozwiązane |
| **T18: Mutation Blindspots** | Pozorne pokrycie linii kodu bez sprawdzania asercji logicznych | Rozszerzenie `stryker.config.json` o wszystkie moduły serowarskie z progiem break = 75% |  Rozwiązane |
| **T19: Opaque Maestro CI Failures** | Trudne do zdiagnozowania awarie E2E w logach CI | Narzędzie `scripts/ci/maestro-failures.py` generujące czytelne tabele Markdown dla Step Summary |  Rozwiązane |

---

## 4. Czteropoziomowe Tiery Wykonania CI/CD (Pipeline Execution Tiers)

Dla zachowania maksymalnej ergonomii developerskiej oraz bezkompromisowej ochrony gałęzi produkcyjnej, pipeline testowy został podzielony na 4 zbalansowane poziomy:

```mermaid
flowchart LR
    subgraph T1["Tier 1: Fast Feedback (<5s)"]
        A1["npm run test:fast"]
        A2["Zmienione pliki lokalnie"]
    end

    subgraph T2["Tier 2: PR Verification (<30s)"]
        B1["npm run verify:pr"]
        B2["typecheck + i18n"]
        B3["domain + pbt + a11y + security"]
    end

    subgraph T3["Tier 3: Release Gate (<90s)"]
        C1["npm run verify:release"]
        C2["verify:pr + real DB"]
        C3["StoreKit + Concurrency + Native + Matrix"]
    end

    subgraph T4["Tier 4: Nightly / Heavy"]
        D1["npm run test:mutation"]
        D2["Maestro E2E Devices"]
        D3["Pełna mutacja Stryker"]
    end

    T1 --> T2 --> T3 --> T4
```

### Skrypty `package.json`:
- `npm run test:fast` — natychmiastowe uruchomienie testów dla zmienionych plików (`jest --onlyChanged`).
- `npm run verify:pr` — brama dla Pull Requestów: kompilacja TypeScript, spójność i18n, testy domenowe, PBT inwarianty, a11y UI i guardy bezpieczeństwa.
- `npm run verify:release` — brama przed wdrożeniem i scaleniem do `main`: zawiera `verify:pr`, testy rzeczywistej bazy SQLite, StoreKit Guidelines, odporność współbieżności, niezmienniki iOS/Android oraz 100% AST Matrix Check.
- `npm run verify` — pełny audyt lokalny (typecheck, i18n, corpus, licenses, cycles, maestro syntax, native verify, matrix check, 100% test suites).
- `npm run test:mutation` — głęboka analiza mutacyjna Stryker sprawdzająca odporność testów na zmiany logiki.

---

## 5. Podsumowanie Weryfikacji (Instrumental Verification Results)

Wszystkie polecenia weryfikacyjne w projekcie SEROWAR kończą się kodem wyjścia `0` (Zero Errors, Zero Warnings, Zero Skipped Tests):

- **TypeScript Typecheck:** 0 błędów (`tsc --noEmit`)
- **i18n Coverage:** 752 teksty w kodzie, 1053 klucze w słowniku EN — 100% pokrycia
- **Dairy Corpus Oracle:** 100% zgodności algorytmów TypeScript z wyrocznią referencyjną Python
- **AST Coverage Matrix:** 1026/1026 elementów pokrytych (100.0%)
- **Test Suites Count:** 59 test suites, 321 tests — **100% PASSING**
- **Security & Privacy:** 0 wycieków danych telemetrycznych, 0 podatności SQL injection
