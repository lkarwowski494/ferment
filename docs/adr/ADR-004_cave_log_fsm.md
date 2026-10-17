# ADR-004: Deterministyczna Maszyna Stanów (FSM) dla Dojrzewania w Dojrzewalni (Cave Log)

* **Status:** ACCEPTED
* **Data:** 17.10.2026
* **Decydent:** Principal System Architect
* **Projekt:** SEROWAR (`calm-planck`)

---

## Kontekst i Problem

Dojrzewanie sera (*affinage*) to proces trwający od kilku tygodni do kilkunastu miesięcy. W tym czasie krążek przechodzi przez fazy: osuszanie po solance, intensywna pielęgnacja skórki (obracanie, zmywanie, maziowanie, szczotkowanie, nakłuwanie dla pleśni niebieskich), zabezpieczanie (woskowanie, bandażowanie), aż po konsumpcję lub utylizację. Niespójności w logice biznesowej (np. woskowanie przed soleniem lub obracanie zutylizowanego krążka) powodują błędy w danych.

---

## Rozważane Opcje

### Opcja A: Deterministyczna Maszyna Stanów (FSM) w Czystej Domenie — Rekomendowana
* **Zalety:**
  * Zamknięty zbiór stanów krążka: `DRYING_AFTER_BRINE` $\rightarrow$ `ACTIVE_AFFINAGE` $\rightarrow$ `RIND_SEALED` $\rightarrow$ `MATURED_READY` $\rightarrow$ `CONSUMED` / `DISCARDED`.
  * Ścisła funkcja przejść: `canTransition(currentState, nextState): boolean`.
  * Walidacja dopuszczalnych akcji: np. `WASH_BRINE` dopuszczalne tylko w `ACTIVE_AFFINAGE`, zablokowane po `WAX_COATING`.
  * Czysty TypeScript w `src/core/domain/fsm/`, w 100% testowalny jednostkowo.
* **Wady:**
  * Wymaga zdefiniowania wszystkich dopuszczalnych tranzycji w kodzie domeny.

### Opcja B: Dowolna Modyfikacja Statusu w UI bez Walidacji FSM
* **Zalety:**
  * Maksymalna elastyczność w formularzu.
* **Wady:**
  * Niespójność logiczna bazy danych, trudności w wyliczaniu alertów i statystyk dojrzewalni, ryzyko uszkodzenia danych.

---

## Decyzja i Uzasadnienie

Wybieramy **Opcję A: Deterministyczna Maszyna Stanów (FSM)**.  
Proces affinage musi być modelowany deterministycznie. Reguły walidujące uniemożliwiają serowarowi przypadkowe zarejestrowanie sprzecznych czynności, a jednocześnie asystent pielęgnacji może precyzyjnie sugerować kolejne kroki w harmonogramie.
