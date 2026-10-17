# CLAUDE.md — Przewodnik Inżynieryjny i Standard Jakości FERMENT

**Projekt:** FERMENT (Ser i Flora / Mikrobiologia Domowa) — Apps4Brew  
**Architektura:** Expo / React Native (iOS, Android, Web), Expo Router, SQLite offline-first  
**Standard jakości:** Oficjalny standard studia Apps4Brew (Role-Model `trening` + `organizer`, BRD-QA-REL 1.0)  

---

## 1. Szesnaście Zasad Nadrzędnych Studia (ZP-01…ZP-16)

1. **ZP-01 (Koszt 0 zł poza Apple):** Maszyny CI (w tym macOS), narzędzia budowania i bazy testowe w 100% mieszczą się w bezpłatnych planach.
2. **ZP-02 (Publiczne repozytorium = darmowy macOS + rygor tajemnic):** Standardowe darmowe runner `macos-26` w GitHub Actions. W kodzie, historii, logach i artefaktach nigdy nie wolno umieszczać kluczy `.p8`, `.p12`, `.env`, tokenów ani prywatnych e-maili.
3. **ZP-03 (Pełen zakres testów — 9 warstw DoD):** Każda funkcjonalność jest ukończona dopiero wtedy, gdy posiada testy we wszystkich warstwach DoD, które jej dotyczą (`docs/20-definicja-ukonczenia.md`).
4. **ZP-04 (TDD Red-Green):** Każdy błąd najpierw otrzymuje wierny test odtwarzający (czerwony przed, zielony po naprawie).
5. **ZP-05 (Dowodem jest wyłącznie kod testu):** Bramki nie ufają komentarzom ani tytułom testów; liczy się tylko odwołanie w instrukcjach AST testu.
6. **ZP-06 (Niezależny wzorzec prawdy):** Oczekiwane wartości w korpusach (zasolenie, pH, PU, Q10, kontrast WCAG, strefy DST) wylicza niezależna wyrocznia w Pythonie (`scripts/gen-*-corpus.py`).
7. **ZP-07 (Jedno źródło prawdy i dokumenty generowane z kodu):** Stałe żyją w `src/core/` i `app.json`. Raporty `docs/22-macierz-testow.md` i `site/` są generowane i weryfikowane automatycznie (`--check`).
8. **ZP-08 (To samo działa tak samo):** Zachowanie w całej aplikacji definiują wzorce `docs/32-wzorce-interakcji.md` oraz strażnicy `S1–S16`.
9. **ZP-09 (E2E zastępuje testy ręczne):** Podróże użytkownika są weryfikowane przez scenariusze Maestro (`.maestro/*.yaml` + `tests/maestro-runner.test.ts`).
10. **ZP-10 (Szybki cykl i twarda bramka):** Przed wypchnięciem obowiązuje jedno polecenie blokujące: `npm run verify`.
11. **ZP-11 (Próg wydania):** Wydanie blokują wyłącznie znaleziska KRYTYCZNE i WYSOKIE.
12. **ZP-12 (Ocena realności problemu):** Każde znalezisko kwalifikujemy jako: realne, brzegowe lub teoretyczne. Bezpieczeństwo i utrata danych naprawiane są zawsze.
13. **ZP-13 (Jeden audyt na wydanie):** Zamrożenie zakresu po rozpoczęciu audytu. Naprawy weryfikuje test odtwarzający + `verify`, bez pętli audytowych.
14. **ZP-14 (Rozdział aktualizacji SDK od zmian schematu):** Nie łączymy aktualizacji Expo ze zmianami schematu bazy danych.
15. **ZP-15 (Dane użytkownika są święte):** Zawsze eksportowalne za darmo. Przed czyszczeniem lub importem zawsze tworzona jest kopia ratunkowa.
16. **ZP-16 (Przenośność aplikacji):** Gotowość do bezstratnego transferu między kontami Apple Developer.

---

## 2. Kluczowe Polecenia (Bramki i Weryfikacja)

| Komenda | Opis |
|---|---|
| `npm run verify` | Główna bramka blokująca: typecheck, i18n, corpus, licencje, native, macierz AST i testy |
| `npm test` | Uruchomienie wszystkich testów Jest z blokadą `act()` i `console.error` |
| `npm run typecheck` | Statyczna weryfikacja typów TypeScript (`tsc --noEmit`) |
| `npm run check:i18n` | Weryfikacja symetrii i braku martwych kluczy i18n |
| `npm run check:corpus` | Weryfikacja wyroczni prawdy w Pythonie (`tests/fixtures/*-corpus.json`) |
| `npm run check:licenses` | Weryfikacja dozwolonych licencji bibliotek produkcyjnych (MIT, Apache-2.0, BSD, ISC) |
| `npm run verify:native` | Weryfikacja 20 niezmienników natywnego projektu iOS |
| `npm run matrix:check` | Skaner AST sprawdzający 100% pokrycia macierzy testów (`docs/22-macierz-testow.md`) |

---

## 3. Dziewięć Warstw Definicji Ukończenia (DoD)

1. **Warstwa 1 (Logika):** 100% pokrycia linii, gałęzi i instrukcji w `src/core/` oraz `src/lib/`.
2. **Warstwa 2 (Własności):** Testy `fast-check` (monotoniczność, liniowość, roundtrip bez dryfu `wInKeep`, losowe sekwencje stanowe).
3. **Warstwa 2b (Korpusy):** Niezależne wyrocznie prawdy w Pythonie generujące wektory testowe dla zasolenia, botulinum, PU, Q10, kontrastu i stref czasowych.
4. **Warstwa 3 (Ekrany RNTL):** Hermetyczne renderowanie tras routera, czysty stan startowy, rygorystyczny teardown timerów.
5. **Warstwa 4 (Wzorce i strażnicy S1–S16):** Przycisk Anuluj po lewej, Zapisz po prawej, potwierdzenia destrukcyjne, pola dotyku $\ge 44\text{ pt}$.
6. **Warstwa 5 (Dane i trwałość):** Prawdziwe zapytania SQLite, dwie osobne pule po 10 kopii zapasowych (`kopia` vs `przed-importem`/`przed-czyszczeniem` z przyrostkiem `-2`), ochrona uszkodzonego stanu `state_corrupt_*`.
7. **Warstwa 6 (Macierz AST):** 100% pokrycia we wszystkich 5 kategoriach (`EKRAN`, `UI`, `TEKST`, `LOGIKA`, `WYMIAR`) z wycinaniem komentarzy i tytułów testów.
8. **Warstwa 7 (Dostępność i i18n):** Kontrast WCAG AA, Dynamic Type AX5, minimum 44 pt dotyku, 0 polskich fraz w słowniku angielskim.
9. **Warstwa 8 (E2E Maestro):** Symulacja scenariuszy podróży person dla poniedziałku, niedzieli i 23:55 UTC.

---

## 4. Zasady Bezpieczeństwa i Repozytorium Publicznego

- **Zero wycieków:** Żadnych plików `.p8`, `.p12`, `.env`, haseł ani tokenów w repozytorium. Skanowanie `.gitleaks.toml` ze scaleniami (`gitleaks-range.sh -m`).
- **Prawa autorskie i marki:** Całkowity zakaz nazw i znaków towarowych konkurentów w kodzie, komentarzach i metadanych (`tests/brands.contract.test.ts`).
- **Bezpieczeństwo CSV:** Formuły CSV są uciekane apostrofem (`escapeCsvCell`).
- **Uprawnienia GitHub Actions:** Wszystkie workflowy posiadają minimalne `permissions: contents: read`.
