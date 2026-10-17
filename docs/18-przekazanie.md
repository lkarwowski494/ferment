# Dokument Przekazania i Operacji (Handoff) — FERMENT 1.0

Dokument zgodny ze standardem Role-Model Apps4Brew Studio (`trening` + `organizer`).

---

## 1. Architektura i Przepływ Danych

* **Frontend:** Expo 57 / React Native 0.86 / React 19 / Expo Router.
* **Zarządzanie Stanem:** Lokalna warstwa danych SQLite (`src/data/sqlite-store.ts`) z automatycznymi kopiami rotacyjnymi JSON w `Backup/`.
* **Czysta Logika:** Wszystkie moduły obliczeniowe w `src/core/` oraz adaptery w `src/lib/` są całkowicie odseparowane od widoków i w 100% testowalne w Node.
* **Bezpieczeństwo Danych:**
  - Podwójna pula 10 kopii zapasowych (`ferment-kopia-*` oraz `ferment-przed-importem-*` / `ferment-przed-czyszczeniem-*`).
  - Ochrona uszkodzonego stanu `state_corrupt_<timestamp>.json` z polem `recovery` i banerem w UI.
  - Odporność na wstrzyknięcie formuł CSV (`escapeCsvCell`).
  - Odporność na dryf zaokrągleń jednostek (`wInKeep` + `NumInput stored`).

---

## 2. Bramka Jakości `npm run verify`

Przed każdym commitem i w potoku CI wymagane jest przejście jednej centralnej komendy:

```bash
npm run verify
```

Wykonuje ona sekwencyjnie:
1. `npm run typecheck` (`tsc --noEmit` w trybie strict)
2. `node scripts/check-i18n.mjs` (weryfikacja symetrii i kompletności tłumaczeń EN/PL)
3. `node scripts/check-corpus.mjs` (weryfikacja 3 wyroczni prawdy w Pythonie)
4. `node scripts/check-licenses.mjs` (kontrola licencji zależności produkcyjnych)
5. `node scripts/test-matrix.mjs --check` (weryfikacja 100% pokrycia AST w 5 kategoriach)
6. `npm test` (uruchomienie pełnego zestawu testów jednostkowych, integracyjnych, własnościowych i Maestro)

---

## 3. Sekrety i Konfiguracja GitHub Actions

Repozytorium jest w 100% publiczne i bezpieczne.
Sekrety wymagane w GitHub Repository Secrets (dla zadania `testflight.yml`):
* `APPLE_TEAM_ID`: 10-znakowy identyfikator zespołu Apple Developer (np. `8NQ9GHY8GF`).
* `ASC_KEY_ID`: Identyfikator klucza App Store Connect API.
* `ASC_ISSUER_ID`: Identyfikator wystawcy (UUID).
* `ASC_KEY_P8_BASE64`: Zawartość klucza prywatnego `.p8` zakodowana w Base64.

---

## 4. Wyrocznie Prawdy w Pythonie (`scripts/`)

* `scripts/gen-ferment-corpus.py` $\to$ `tests/fixtures/ferment-corpus.json`: testy zasolenia, botulinum pH 4.60, pasteryzacji PU i Q10.
* `scripts/gen-theme-contrast-corpus.py` $\to$ `tests/fixtures/theme-contrast-corpus.json`: luminancja i kontrast WCAG 2.1 AA/AAA.
* `scripts/gen-dst-corpus.py` $\to$ `tests/fixtures/dst-corpus.json`: weryfikacja dób 23h, 24h, 25h w 7 strefach czasowych.
