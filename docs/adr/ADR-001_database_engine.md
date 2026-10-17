# ADR-001: Wybór Silnika Bazy Danych SQLite i Warstwy Persystencji

* **Status:** ACCEPTED
* **Data:** 17.10.2026
* **Decydent:** Principal System Architect
* **Projekt:** SEROWAR (`calm-planck`)

---

## Kontekst i Problem

Aplikacja **SEROWAR** operuje na relacyjnych danych procesów mleczarskich: powiązania partii z wieloetapowym prasowaniem, kąpielami solankowymi, kartoteką dojrzewających krążków oraz logami mikroklimatu. Wymagania niefunkcjonalne (`NFR-OFF`, `NFR-WYD`, `NFR-DANE`) narzucają:
1. 100% działanie w trybie offline bez zewnętrznych serwerów.
2. Odporność na awarie i ubicie procesu w tle na iOS (`0xDEAD10CC`).
3. Czas zapytań złożonych $< 5\text{ ms}$.
4. Ścisłe reguły integralności referencyjnej (`FOREIGN KEY ... ON DELETE CASCADE`).

---

## Rozważane Opcje

### Opcja A: Relacyjna Baza SQLite w Trybie WAL (`expo-sqlite/next`) — Rekomendowana
* **Zalety:**
  * Pełne wsparcie dla transakcji ACID, kluczy obcych (`PRAGMA foreign_keys = ON`), ograniczeń `CHECK` i indeksów B-Tree.
  * Tryb WAL (`PRAGMA journal_mode = WAL`) pozwala na współbieżny odczyt i zapis bez blokowania bazy.
  * `PRAGMA busy_timeout = 5000` eliminuje błędy blokady dysku przy usypianiu procesu przez iOS.
  * Sprawdzona stabilność w aplikacjach studia Apps4Brew (*Słoik*, *Napar*).
* **Wady:**
  * Wymaga ręcznego lub asystowanego pisania migracji DDL.

### Opcja B: Magazyn Dokumentowy / Klucz-Wartość (`AsyncStorage` / wielki plik JSON)
* **Zalety:**
  * Prosty start, brak konieczności schematu DDL.
* **Wady:**
  * Brak integralności referencyjnej (ryzyko osieroconych rekordów).
  * Drastyczny spadek wydajności: konieczność parsowania i serializacji całego JSON-a przy każdym odczycie/zapisie.
  * Ryzyko uszkodzenia danych przy nagłym zaniku zasilania lub ubiciu procesu w trakcie zapisu.

### Opcja C: WatermelonDB
* **Zalety:**
  * Zaawansowany ORM i reaktywne obserwatory.
* **Wady:**
  * Ciężka zależność biblioteczna, złożona konfiguracja modeli i adapterów, utrudnione testy w środowisku Jest bez natywnego runtime'u.

---

## Decyzja i Uzasadnienie

Wybieramy **Opcję A: Relacyjna Baza SQLite w trybie WAL (`expo-sqlite/next`)**.  
Relacyjny charakter danych przetwórstwa mlecznego (jeden wsad mleczny $\rightarrow$ wiele krążków $\rightarrow$ dziesiątki czynności pielęgnacyjnych) wymaga bezwzględnej spójności relacyjnej. Konfiguracja pragmatyk:
```sql
PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
PRAGMA busy_timeout = 5000;
PRAGMA temp_store = MEMORY;
PRAGMA cache_size = -64000;
```
gwarantuje niezawodność klasy enterprise na urządzeniach mobilnych przy $0 kosztów serwerowych.
