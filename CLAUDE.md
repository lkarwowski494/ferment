# FERMENT (Ser i Flora / Mikrobiologia Domowa) — Zasady dla agenta

Repozytorium: `lkarwowski494/ferment` | Ekosystem: **Apps4Brew Studio**

## 1. Zasady Podstawowe i Bezpieczeństwo
- **Repozytorium jest PUBLICZNE.** Nigdy nie commituj sekretów (klucze API, tokeny, certyfikaty, .p8/.p12, .env) ani danych osobowych (UDID, e-mail). Przed commitem sprawdź `git diff --cached`.
- **Narzędzia: 0 zł poza opłatą Apple Developer (99 USD).** Zero chmury, zero serwerów backendowych, zero płatnych API zewnętrznych.
- **100% Offline-First:** Wszystkie kalkulatory (IMCU, flokulacja, prasa, solanka, kiszonki, kombucha, octy), baza SQLite i generowanie dokumentów PDF działają w pełni lokalnie bez internetu.
- **Zero Logowania & Zero Telemetrii ("Data Not Collected"):** Czysta deklaracja prywatności w App Store Privacy Manifest. Brak SDK analitycznych (Firebase, Mixpanel, Amplitude).

## 2. Rygor Inżynieryjny i Jakość Kodu (Wzorce z Trening i Oczko)
- **Testy przed kodem (TDD):** Każdy błąd dostaje test odtwarzający przed naprawą.
- **Macierz testów:** Każdy ekran, element UI, funkcja kalkulatora i wartość wymiaru ma test w `tests/`.
- **Definicja Ukończenia (9 warstw jakości):** Logika, ekran, scenariusz, macierz, niezmienniki (fast-check), dane (SQLite WAL + 10 rotacyjnych backupów JSON), wielojęzyczność (35 języków), regresja, E2E Maestro.
- **Weryfikacja przed push:** Pełne `npm run verify` (typecheck, check:i18n, jest, expo export).
- **Spójność interakcji:** Modale, przyciski i etykiety działają jednolicie w całej aplikacji. Zamykanie modali z lewej u góry („Anuluj”).

## 3. Merytoryczne Podstawy (Zasada z 4 października 2026 r.)
- Wszystko, czego aplikacja uczy lub co twierdzi (IMCU, czasy flokulacji, stężenia soli, kinetyka fermentacji, barierowość pH 4.6), musi mieć twarde podstawy naukowe.
- **Hierarchia źródeł:**
  1. Rachunek stechiometryczny i równania fizykochemiczne sprawdzone w testach.
  2. Normy międzynarodowe: IDF / FIL, Codex Alimentarius, wytyczne sanitarne USDA FSIS i FDA BAM.
  3. Podręczniki akademickie i recenzowane badania: Fox et al. (*Fundamentals of Cheese Science*), Kosikowski (*Cheese and Fermented Milk Foods*), Katz (*The Art of Fermentation*).
  4. Publikacje instytutów serowarskich (np. Univ. of Guelph, Wisconsin CDR).
  5. Tradycja i praktyka rzemieślnicza (wyłącznie jako wskazówka, zawsze oznaczona).
- **Zasada co najmniej 2 niezależnych źródeł:** Żadna reguła bezpieczeństwa nie może opierać się na pojedynczym wpisie z bloga.
- **Właściciel decyduje o sprawach produktowych i biznesowych:** Przedstawiaj co najmniej dwie opcje z kompromisami i rekomendacją.

## 4. Nazwy Cudze i Prawa Autorskie
- Nazwy innych aplikacji i marek nie mogą występować w kodzie, komentarzach ani tekstach w sklepie (Wytyczne Apple 2.3.7, 5.2.1).
- W aplikacji stosujemy wyłącznie własne teksty, ryciny i wektory SVG.
