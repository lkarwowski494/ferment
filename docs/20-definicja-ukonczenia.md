# Definicja Ukończenia (Definition of Done — DoD) — FERMENT 1.0

Standard dojrzałości technologicznej Apps4Brew Studio (`trening` + `organizer`).

---

## 9 Warstw Jakości DoD:

1. **Warstwa 1 — Czysta Logika:** 100% pokrycia linii, gałęzi, funkcji i instrukcji w `src/core/` i `src/lib/`.
2. **Warstwa 2 — Własności Matematyczne:** Testy `fast-check` (`tests/matrix-invariants.prop.test.ts`) weryfikujące monotoniczność, przemienność i brak dryfu jednostek `wInKeep` (min. 200 iteracji).
3. **Warstwa 3 — Niezależne Wyrocznie Pythona:** Deterministyczne korpusy weryfikowane przez `npm run check:corpus` (zasolenie, botulinum 4.60, PU, Q10, kontrast WCAG i strefy DST).
4. **Warstwa 4 — Widoki i Dostępność:** RNTL testy komponentów UI (`tests/components/`), pola dotyku $\ge 44\text{ pt}$, obsługa Dynamic Type `AX5` i ekranu `320 pt`.
5. **Warstwa 5 — Trwałość i Kopie Danych:** Dwie rozdzielne pule po 10 kopii zapasowych, ochrona `state_corrupt_*` z banerem UI i polem `recovery`, bezpieczny SQLite poza `Documents/`.
6. **Warstwa 6 — Macierz Pokrycia AST:** 100% pokrycia we wszystkich 5 kategoriach (`EKRAN`, `UI`, `TEKST`, `LOGIKA`, `WYMIAR`) egzekwowane przez `node scripts/test-matrix.mjs --check`.
7. **Warstwa 7 — Wzorce Interakcji:** Wszystkie 16 strażników `S1–S16` zweryfikowane automatycznymi testami kontraktowymi (`tests/interaction-guards.test.ts`, `close-button-guard.test.tsx`, `swipe-delete.test.tsx`).
8. **Warstwa 8 — Scenariusze E2E:** Przepływy `.maestro/*.yaml` wykonywane w pamięci przez `tests/maestro-runner.test.ts` w wirtualnym czasie poniedziałku, niedzieli i 23:55 UTC.
9. **Warstwa 9 — Bezpieczeństwo i Wydania:** `tests/public-repo.test.ts`, `brands.contract.test.ts`, brak sekretów w gicie (`.gitleaks.toml`), `scripts/verify-native.mjs`, statyczne strony w `site/`.

---

## Kryteria Zaliczenia Wydania (Release Gate):

* `npm run verify` kończy się z kodem wyjścia `0`.
* Liczba otwartych znalezisk `KRYTYCZNE` i `WYSOKIE` w audycie wynosi bezwzględnie **0**.
* Commit pochodzi z gałęzi `main`.
