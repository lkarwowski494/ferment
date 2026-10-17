# ADR-005: Strategia Peryferiów BLE, Timery w Tle i Wsparcie Apple Watch / Live Activity

* **Status:** ACCEPTED
* **Data:** 17.10.2026
* **Decydent:** Principal System Architect
* **Projekt:** SEROWAR (`calm-planck`)

---

## Kontekst i Problem

Kluczowe operacje serowarskie (stoper flokulacji, odpoczynek skrzepu, prasowanie kaskadowe) wymagają precyzyjnego pomiaru czasu przy częstym przechodzeniu aplikacji do tła. Dodatkowo serowar w piwnicy posiada termohigrometry BLE (RuuviTag, Mijia). Decyzje `DEC-02` i `DEC-03` z Kontraktu Zakresu (`docs/scope-contract.md`) narzucają:
1. Wersja v1.0 (MVP): manualne wprowadzanie odczytów mikroklimatu, integracja BLE odłożona do v1.1.
2. Wsparcie zegarka i ekranu blokady w v1.0 poprzez Live Activity / ActivityKit i powiadomienia interaktywne; pełny target watchOS odłożony do v1.2.

---

## Rozważane Opcje

### Opcja A: Resilient Timers oparte o Stemple Czasu UTC + ActivityKit — Rekomendowana
* **Zalety:**
  * Czas liczony jako różnica `targetEndTimestamp - Date.now()`. Zero podatności na zamrożenie pętli `setInterval` w tle przez system iOS.
  * Harmonogramowanie powiadomień lokalnych natychmiast w momencie uruchomienia timera.
  * Wsparcie dla Live Activity / Dynamic Island (Smart Stack na Apple Watch) bez narzutu budowy i utrzymania osobnej aplikacji watchOS.
  * Zgodność z decyzją `DEC-03`.
* **Wady:**
  * Ograniczona interaktywność na zegarku (wyłącznie akcje powiadomień i widżet Live Activity).

### Opcja B: Natywna Aplikacja watchOS w Wersji 1.0
* **Zalety:**
  * Pełna aplikacja na nadgarstku.
* **Wady:**
  * Zwiększenie nakładu pracy, dodatkowy cel kompilacji Xcode, ryzyko opóźnienia premiery MVP.

---

## Decyzja i Uzasadnienie

Wybieramy **Opcję A: Resilient Timers UTC + Live Activity w v1.0**, a automatyczny odczyt BLE i niezależną aplikację watchOS odraczamy odpowiednio do wydań v1.1 i v1.2 zgodnie z Kontraktem Zakresu.
