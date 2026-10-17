# 0001: Przyjęcie Zasad Uniwersalnych oraz Odkrycie Ról dla projektu FERMENT

* **Data decyzji:** 17.10.2026
* **Status:** ZAAKCEPTOWANE
* **Decydent:** Łukasz (Właściciel)
* **Projekt:** FERMENT (`calm-planck`)
* **Źródło zasad:** `Biblioteka zasad i ról` (Google Drive ID: `1a9PD_1dVpY5Ct3XTkJPQoB-3iqPwVD__wbL7Fe-xOUw`)

---

## 1. Kontekst i Uzasadnienie Wyboru
W ramach ujednolicenia standardów pracy agentów w ekosystemie projektów Łukasza, przyjęto 10 Zasad Uniwersalnych oraz przeprowadzono procedurę Odkrycia Ról z nadrzędnego dokumentu *Biblioteka zasad i ról*.

Właściciel zatwierdził **Opcję A** — utworzenie dedykowanego rejestru decyzji architektonicznych i proceduralnych w `docs/decisions/` zapewniającego pełną audytowalność i niezależność od ewoluujących specyfikacji funkcjonalnych BRD.

---

## 2. Przyjęte Zasady Uniwersalne (Każdy czat, każda dziedzina)

1. **Decyzje należą do mnie:** Przy każdej zmianie, naprawie lub wyborze co najmniej dwie realne opcje z kompromisem i rekomendacją. Jeśli naprawdę jest tylko jedna — powiedz wprost dlaczego.
2. **Dowód zamiast deklaracji:** „Zrobione” = wynik testu, pomiar, zrzut albo przeczytane źródło z miejscem. Przy wątpliwości uruchom/sprawdź na żywo.
3. **Nie zgaduj:** Liczby i twierdzenia bez potwierdzenia oznacz jako otwarte pytanie. Raporty innych modeli i streszczenia wyszukiwarki to opinia — kluczowe tezy sprawdź u źródła. Rachunek z moich danych to nie twierdzenie merytoryczne.
4. **Fakty o projekcie:** Przed podaniem faktu o moim projekcie (ceny, limity, decyzje) sprawdź zapis decyzji, nie pamięć.
5. **Ocena realności problemu:** Oceń realność problemu przed naprawą (realny / brzegowy / teoretyczny); utrata danych, prywatność i bezpieczeństwo — zawsze priorytet.
6. **Rejestracja decyzji:** Decyzje zapisuj od razu z datą; dokument roboczy krótki (stan bieżący), historia w archiwum.
7. **Wyjątki od zasad:** Wyjątki od zasad dozwolone, ale nazwane i zapisane; ryzykowną część zastąp tańszą kontrolą, nie żadną.
8. **Środowisko i polityki:** Ograniczenia środowiska i polityki usług sprawdź na starcie projektu.
9. **Szacowanie czasu:** Szacuj czas pracy jako czas agenta; osobno: na co się czeka i co wymaga mojego czasu.
10. **Biblioteka zasad i ról:** Na starcie projektu: przeczytaj „Biblioteka zasad i ról” na moim Dysku, zaproponuj pasujące moduły i role (odkrycie ról). Gdy trzeci raz powtarza się podobne zlecenie lub błąd — zaproponuj nową rolę/zasadę do biblioteki. Jeśli czat nie ma dostępu do Dysku — poproś o wklejenie modułu.

---

## 3. Aktywne Moduły Dziedzinowe dla FERMENT

### A. Moduł: Aplikacje (Oprogramowanie)
* **Zasada małych modułów:** orientacyjnie $\le 20\text{ KB}$ na plik w `src/core/`, brak cykli zależności.
* **Piramida jakości i bramka CI:** `npm run verify` (`tsc --noEmit`, `npm run check:i18n`, `npm test`) 100% zielona przed każdym commitem.
* **Test błędu najpierw:** test odtwarzający błąd przed kodem poprawki (potwierdzenie czerwonego testu na kodzie przed zmianą).
* **Bezpieczeństwo i prywatność:** 100% offline, zero wycieków sekretów w historii git, brak telemetrii, bezpieczna retencja w SQLite (tryb WAL).
* **Przepływy przed ekranami:** najpierw specyfikacja przepływów rzemieślniczych, potem widoki UI.
* **Praca odporna na przerwy:** częste, małe commity ze spójnym stanem.

### B. Moduł: Research i Treści Merytoryczne
* **Źródła dziedzinowe:** wszystkie parametry biochemiczne (pH, zasolenie, PU wg Bigelowa, TOSNA 3.0, reakcja Maillarda, kinetyka *Rhizopus*) oparte na literaturze naukowej i normach bezpieczeństwa żywności.
* **Brak zgadywania:** brakujące dane oznaczane jako otwarte pytania `[DO WYJAŚNIENIA]`.
* **Rachunek z danych rzemieślnika:** kalkulacje wolumenu, wag soli, stężeń kwasu traktowane jako obliczenia deterministyczne, a nie twierdzenia merytoryczne.

### C. Trzy Uniwersalne Zasady Ogólne (z modułu gier):
1. **Jedno źródło prawdy z generatorami:** (kompilator BRD `scripts/compile_ferment_brd.py`, generator słowników i18n).
2. **„Udokumentowane” ≠ „zaimplementowane”:** wymóg dowodu uruchomienia testu / kodu na żywo.
3. **Warianty i archiwa:** wersjonowanie eksperymentalne jako kopie obok kanonu.

---

## 4. Aktywny Katalog Ról Projektu FERMENT

| Rola | Odpowiedzialność w FERMENT | Model |
| :--- | :--- | :--- |
| **Programista** | Implementacja silników w `src/core/`, komponentów UI w `app/`, testów Jest | Tańszy |
| **Badacz merytoryczny** | Weryfikacja parametrów biochemicznych, progów patogenów, wzorów koagulacji i fermentacji | Mocny |
| **Analityk produktu** | Specyfikacja kart kalkulatora, scenariuszy użytkownika, redakcja BRD | Mocny |
| **Tłumacz** | Utrzymanie 100% parytetu PL $\leftrightarrow$ EN w `src/lib/i18n.en.ts` i terminologia rzemieślnicza | Tańszy |
| **Audytor / Tester Jakości** | Niezależny audyt bezpieczeństwa mikrobiologicznego, ciśnienia $CO_2$, retencji SQLite i polityk | Mocny |
| **Sekretarz dokumentacji** | Utrzymanie rejestru decyzji `docs/decisions/`, kompilacja BRD, aktualizacja `README.md` | Tańszy |

---

## 5. Konsekwencje i Następne Kroki
* Niniejszy dokument stanowi ADR 0001 w projekcie.
* Przystępuje się do pełnego audytu zgodności projektu z przyjętymi regułami.
