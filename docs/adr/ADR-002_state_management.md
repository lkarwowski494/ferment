# ADR-002: Architektura Zarządzania Stanem Globalnym i Reaktywność UI

* **Status:** ACCEPTED
* **Data:** 17.10.2026
* **Decydent:** Principal System Architect
* **Projekt:** SEROWAR (`calm-planck`)

---

## Kontekst i Problem

W aplikacji rzemieślniczej użytkownik wykonuje operacje kuchenne w czasie rzeczywistym (stoper flokulacji, suwaki dawek kultur i podpuszczki) oraz przegląda długie listy historycznych partii i krążków. Umieszczenie całości stanu w pojedynczym kontekście Reacta prowadzi do lawiny niepotrzebnych re-renderów całego drzewa widoków i spadków klatkażu poniżej 60 FPS.

---

## Rozważane Opcje

### Opcja A: Trójwarstwowy Stan z Zustand i Selektorami — Rekomendowana
* **Zalety:**
  * Czysty podział na:
    1. *Persisted State* (SQLite — źródło prawdy dla partii i inwentarza),
    2. *Ephemeral UI State* (Zustand w pamięci RAM — formularze, modale, filtry),
    3. *Hardware State* (Timery i FSM).
  * Subskrypcje z atomowymi selektorami (`useCalculatorStore(state => state.milkVolumeLiters)`), renderujące wyłącznie zmieniony komponent.
  * Znikomy narzut pamięciowy i brak boilerplate'u.
* **Wady:**
  * Wymaga dyscypliny w pisaniu selektorów (unikanie subskrypcji całego obiektu stanu).

### Opcja B: Redux Toolkit (RTK)
* **Zalety:**
  * Dojrzały ekosystem, Redux DevTools, przewidywalny jednokierunkowy przepływ.
* **Wady:**
  * Duży boilerplate (akcje, reducery, thunki), większy rozmiar paczki, niepotrzebny narzut w aplikacji mobile-first.

### Opcja C: Wbudowany React Context API
* **Zalety:**
  * Brak zewnętrznych zależności bibliotecznych.
* **Wady:**
  * Brak wbudowanych selektorów — każda zmiana dowolnego pola w kontekście wymusza ponowne renderowanie wszystkich komponentów konsumujących ten kontekst.

---

## Decyzja i Uzasadnienie

Wybieramy **Opcję A: Trójwarstwowy Stan z Zustand**.  
Gwarantuje ona płynność 60/120 FPS na urządzeniach mobilnych, natychmiastową reakcję suwaków kalkulatora i brak zacinania interfejsu w trakcie równoczesnego odliczania stopera flokulacji.
