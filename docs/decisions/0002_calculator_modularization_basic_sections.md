# 0002: Modularizacja Podstawowych Sekcji i Stylów Kalkulatora FERMENT

* **Data decyzji:** 17.10.2026
* **Status:** ZAAKCEPTOWANE
* **Decydent:** Łukasz (Właściciel)
* **Projekt:** FERMENT (`calm-planck`)
* **Powiązanie:** ADR 0001 (Zasady Uniwersalne & Apps4Brew standard małych modułów)

---

## 1. Kontekst
W ramach realizacji standardu Apps4Brew ($\le 20\text{ KB}$ na moduł) po pomyślnej ekstrakcji 19 kart zaawansowanych parametrów biochemicznych (Pro), główny plik `app/(tabs)/index.tsx` pozostał na poziomie 94.6 KB (2713 linii).

Właściciel zatwierdził **Opcję A** — ekstrakcję podstawowych paneli wejściowych trybów rzemieślniczych, komponentów receptur kanonicznych, harmonogramu odwróconego oraz centralnego arkusza stylów do `src/components/calculator/`.

---

## 2. Zakres Zmian Architektonicznych

1. **Arkusz stylów:**
   * Utworzenie `src/components/calculator/calculator.styles.ts` (~15 KB) zawierającego wszystkie deklaracje stylów widoku kalkulatora.
2. **Karty pomocnicze:**
   * `CanonicalRecipesCard.tsx` — wybór receptur kanonicznych, podgląd parametrów i udostępnianie offline via `ferment://`.
   * `ReverseSchedulerCard.tsx` — harmonogram odwrócony (Anti-Fatigue Guard) z prewencją konfliktów nocnych.
3. **Główne sekcje trybów rzemieślniczych:**
   * `CheeseCraftSection.tsx` — tryb serowarski (dawkowanie podpuszczki, CaCl2, akordeon Pro).
   * `VegCraftSection.tsx` — tryb kiszonek i kimchi (stężenie soli, masa wsadu, akordeon Pro).
   * `BeverageCraftSection.tsx` — tryb kombuchy i octów (herbata, cukier, starter SCOBY, akordeon Pro).

---

## 3. Zgodność z Zasadami
* **Zasada 1 (Decyzje należą do mnie):** Wdrożono Opcję A wybraną przez użytkownika.
* **Zasada 2 (Dowód zamiast deklaracji):** Weryfikacja `npm run verify` (`tsc --noEmit`, `check:i18n`, `npm test`) 100% zielona po zakończeniu zmian.
* **Zasada małych modułów:** Każdy nowo powstały plik zachowuje rozmiar $\le 17\text{ KB}$.
