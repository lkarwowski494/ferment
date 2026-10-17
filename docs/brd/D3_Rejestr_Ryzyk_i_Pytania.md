# **SEROWAR BRD 0.1 — Rozdziały 14 i 16: Rejestr Ryzyk (RYZ-01…RYZ-50) i Pytania Otwarte (D3)**

> **Kategorie ryzyk:** Sanitarne i biologiczne (SAN), Techniczne i dane (TECH), Zgodność z Apple (APPL), Biznesowe i rynkowe (BIZ).

---

### **1. Kluczowe Ryzyka w Rejestrze**

| ID | Kategoria | Opis ryzyka | Prawd. | Skutek | Plan mitygacji / Działanie obronne |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **RYZ-01** | SAN | **Skażenie mleka surowego patogenami (Listeria monocytogenes, Salmonella, E. coli STEC).** | Niskie | Krytyczny | Rygorystyczny wymóg pasteryzacji LTLT (63°C / 30 min) lub min. 60 dni dojrzewania wg FDA 21 CFR 133. Edukacyjny moduł higieny udoju. |
| **RYZ-02** | TECH | **Utrata wielomiesięcznej historii dojrzewania w Cave Log** przy aktualizacji systemu iOS lub aplikacji. | Średnie | Krytyczny | Baza SQLite WAL w bezpiecznym `/Library/Application Support/SQLite`, 10 rotacyjnych kopii JSON po każdej sesji, bezpłatny eksport do pliku. |
| **RYZ-03** | APPL | **Odrzucenie przez Apple za brak wartości (Guideline 4.3 — Minimum Functionality).** | Niskie | Wysoki | SEROWAR to zaawansowany asystent: stoper flokulacji, Live Activity, relacyjny Cave Log, generowanie PDF, skaner QR, wsparcie BLE. |
| **RYZ-04** | APPL | **Odrzucenie za twierdzenia medyczne (Guideline 1.4.1).** | Średnie | Wysoki | Całkowity zakaz obietnic probiotycznych i leczniczych. Język wyłącznie technologiczny i biochemiczny. |
| **RYZ-05** | SAN | **Zjełczenie masła rzemieślniczego na skutek obecności maślanki.** | Średnie | Średni | Asystent płukania wodą lodową (<5°C) do krystalicznej czystości wody i mechaniczne wyciskanie na desce serowarskiej. |
| **RYZ-06** | SAN | **Zepsucie krążka sera przez skażenie dzikim Mucorem** z powodu nadmiernej wilgotności i braku obracania. | Wysokie | Średni | Algorytm psychrometryczny punktu rosy (RD-06), codzienne powiadomienia o obracaniu, Kompas Diagnostyczny (C1). |
| **RYZ-07** | TECH | **Nasycenie czujników BLE w wilgotności > 90% RH** fałszujące odczyty komory dojrzewalniczej. | Średnie | Średni | Ostrzeżenie w UI o histerezie tanich higrometrów pojemnościowych, instrukcja kalibracji solą nasyconą. |
| **RYZ-08** | BIZ | **Niska konwersja do subskrypcji przy braku zakupu jednorazowego.** | Średnie | Średni | Dostępność opcji Lifetime (14,99 € / 59,99 zł), która w społecznościach rzemieślniczych konwertuje najlepiej. |
| **RYZ-09…50**| RÓŻNE | Dalsze szczegółowe ryzyka technologiczne, solankowe i mikrobiologiczne. | Niskie | Średni | Rozpisane w macierzy audytowej studia Apps4Brew. |
