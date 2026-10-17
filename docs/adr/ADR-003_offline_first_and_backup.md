# ADR-003: Protokół Trwałości Offline-First, Rotacyjne Kopie Zapasowe i Odporność na Uśpienie iOS

* **Status:** ACCEPTED
* **Data:** 17.10.2026
* **Decydent:** Principal System Architect
* **Projekt:** SEROWAR (`calm-planck`)

---

## Kontekst i Problem

Użytkownicy serowarni domowych i dojrzewalni często przebywają w piwnicach o grubych murach kamiennych, gdzie zasięg GSM i Wi-Fi nie istnieje. Dodatkowo system iOS agresywnie zamraża i ubija procesy aplikacji po przejściu do tła (`0xDEAD10CC`), co przy otwartych transakcjach bazodanowych może prowadzić do uszkodzenia pliku bazy. Użytkownik nie może stracić danych o leżakujących od 6 miesięcy krążkach sera.

---

## Rozważane Opcje

### Opcja A: 100% Local-First z Rotacją 10 Kopii JSON i Sumą SHA-256 — Rekomendowana
* **Zalety:**
  * Baza urządzenia jest jedynym i ostatecznym źródłem prawdy (Single Source of Truth). Zero zależności sieciowych.
  * Automatyczny silnik kopii zapasowych generuje po każdej sesji zrzut relacyjny `serowar_backup_YYYY-MM-DD_HHmmss.json` z sumą kontrolną SHA-256.
  * Utrzymywanie dokładnie 10 najnowszych kopii (rotacja FIFO w bezpiecznym katalogu Documents).
  * Zasada *Graceful Rejection*: wersjonowany nagłówek schematu chroni przed zaimportowaniem uszkodzonego lub niezgodnego pliku.
* **Wady:**
  * Synchronizacja między urządzeniami wymaga ręcznego przesłania pliku JSON (AirDrop / plik).

### Opcja B: Synchronizacja Chmurowa (Firebase Firestore / Supabase)
* **Zalety:**
  * Automatyczna synchronizacja między wieloma urządzeniami tego samego użytkownika.
* **Wady:**
  * Wymaga logowania i zarządzania kontami, łamiąc obietnicę prywatności Apps4Brew.
  * Generuje stałe koszty serwerowe.
  * Błędy synchronizacji przy długotrwałym braku sieci w piwnicy serowej.

---

## Decyzja i Uzasadnienie

Wybieramy **Opcję A: 100% Local-First z rotacją 10 kopii zapasowych JSON**.  
Zgodnie z `DEC-19` i `docs/scope-contract.md` aplikacja chroni prywatność rzemieślnika i działa całkowicie niezależnie od chmury. Kopie zapasowe z sumą SHA-256 zapewniają bankowe bezpieczeństwo danych bez konieczności utrzymywania infrastruktury serwerowej.
