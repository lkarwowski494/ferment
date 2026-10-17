# Macierz Testów (AST Coverage Matrix) — FERMENT

Wygenerowano automatycznie przez `scripts/test-matrix.mjs` zgodnie z wymaganiami **BR-TEST-028..031**.
Zasada dowodu: wyłącznie wykonywalny kod testu (wycięte komentarze, importy i opisy `test`/`describe`).

## Podsumowanie Pokrycia

| Kategoria | Łącznie | Pokryte | Pokrycie % | Status |
| :--- | :---: | :---: | :---: | :---: |
| **EKRAN** | 5 | 5 | **100.0%** | ✅ POKRYTE |
| **UI** | 26 | 26 | **100.0%** | ✅ POKRYTE |
| **TEKST** | 845 | 845 | **100.0%** | ✅ POKRYTE |
| **LOGIKA** | 179 | 179 | **100.0%** | ✅ POKRYTE |
| **WYMIAR** | 79 | 79 | **100.0%** | ✅ POKRYTE |

Łącznie elementów: **1134** | Pokrytych: **1134** | Brakujących: **0**

## Szczegółowa Lista Elementów

| Kategoria | Nazwa elementu | Plik źródłowy | Status | Pliki testowe |
| :--- | :--- | :--- | :---: | :--- |
| `EKRAN` | `/(tabs)/batches` | `app/(tabs)/batches.tsx` | ✅ | tests/audit-fixes.test.tsx, tests/core/fermentation-statistics.test.ts |
| `EKRAN` | `/(tabs)/index` | `app/(tabs)/index.tsx` | ✅ | tests/audit-fixes.test.tsx, tests/matrix-routes.test.tsx |
| `EKRAN` | `/(tabs)/pantry` | `app/(tabs)/pantry.tsx` | ✅ | tests/core/inventory.test.ts, tests/data/sqlite-store.test.ts |
| `EKRAN` | `/(tabs)/school` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-routes.test.tsx |
| `EKRAN` | `/(tabs)/settings` | `app/(tabs)/settings.tsx` | ✅ | tests/lib/backup.test.ts, tests/matrix-routes.test.tsx |
| `UI` | `Ostrzeżenie o ubytku wagi` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Krążek Obrócony` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Krążek Przemyty` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Krążek Oczyszczony` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Krążek Zawoskowany` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Bandażowanie Zapisane` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Ważenie Zapisane!` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Akcja Zapisana` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Zapisano wpis w dzienniku piwniczki.` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `UI` | `Błąd` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `UI` | `Wpisz prawidłową wagę w gramach.` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Usuń krążek z piwniczki` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Czy na pewno chcesz usunąć krążek` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Anuluj` | `app/(tabs)/batches.tsx` | ✅ | tests/audit-fixes.test.tsx, tests/i18n-no-polish-in-en.test.tsx |
| `TEKST` | `Usuń` | `app/(tabs)/batches.tsx` | ✅ | tests/audit-fixes.test.tsx, tests/lib/confirm.test.ts |
| `UI` | `Status Zaktualizowany` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Usuń Partię` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Czy na pewno chcesz usunąć partię` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Ocena Sensoryczna Zapisana!` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Znaleziono Krążek:` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Waga:` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Ubytek:` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Wybierz szybką akcję pielęgnacyjną:` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Obróć` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Zważ` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `OK` | `app/(tabs)/batches.tsx` | ✅ | tests/core/mead-kinetics.test.ts, tests/matrix-dimensions.test.tsx |
| `TEKST` | `Nie Znaleziono Krążka` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Nie odnaleziono krążka o identyfikatorze:` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Znaleziono Partię:` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Status:` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Czy chcesz otworzyć ocenę sensoryczną tej partii?` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `⭐ Oceń Sensorycznie` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Nie Znaleziono Partii` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Nie odnaleziono partii o identyfikatorze:` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `UI` | `Odczytano Kod QR` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `UI` | `Dane:` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Dziennik Partii & Cave Log` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `partii` | `app/(tabs)/batches.tsx` | ✅ | tests/audit-fixes.test.tsx, tests/components/ui-components.test.tsx |
| `TEKST` | `krążków w piwniczce` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Doktor` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Koło` | `app/(tabs)/batches.tsx` | ✅ | tests/core/flavor-wheel-data.test.ts, tests/matrix-translations.test.ts |
| `TEKST` | `Wszystkie Partie` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Piwniczka Sera (Cave Log)` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Statystyki Produkcji & Rzemiosła` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `partii łącznie` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `sukcesu` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Partie Razem` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `akt.` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `zak.` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Wskaźnik Sukcesu` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `udanych` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Przetworzone Mleko` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `warzeń sera` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Krążki w Piwnicy` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `dojrzewa` | `app/(tabs)/batches.tsx` | ✅ | tests/core/fermentation-statistics.test.ts, tests/matrix-translations.test.ts |
| `TEKST` | `Średnia Ocena` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `ocenionych partii` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Oszczędność vs Sklep` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `70-85% oszczędności` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Wszystkie` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Sery` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Kiszonki` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Napoje` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Brak zapisanych partii` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Przejdź do zakładki Kalkulator, aby stworzyć swój pierwszy ser, kiszonkę lub kombuchę.` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Data nastawienia:` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Zmień status:` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Harmonogram:` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `dni` | `app/(tabs)/batches.tsx` | ✅ | tests/core/brine-diffusion.test.ts, tests/lib/csv-export.test.ts |
| `TEKST` | `tempo` | `app/(tabs)/batches.tsx` | ✅ | tests/core/fermentation-timeline.test.ts, tests/matrix-translations.test.ts |
| `TEKST` | `Odgazowanie 1-` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `d` | `app/(tabs)/batches.tsx` | ✅ | tests/access/app-access.test.ts, tests/audit-fixes.test.tsx |
| `TEKST` | `Następny krok:` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Ocena sensoryczna:` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `⭐ Zamknij ocenę` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `⭐ Ocena sensoryczna` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Triage` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Profil Sensoryczny & Balans Organoleptyczny` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `6-osiowy profil smakowo-teksturalny i analiza wad rzemieślniczych` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Kwasowość (1-10):` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Słoność (1-10):` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Zwartość / Chrupkość (1-10):` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Kremowość / Tekstura (1-10):` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Pikantność / Ostrość (1-10):` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Orzechowość / Czystość (1-10):` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Zidentyfikowane wady:` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Rekomendacje technologiczne:` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Notatki degustacyjne (opcjonalnie):` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Wybierz z Koła Smaków` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Wpisz własne spostrzeżenia...` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Zapisz profil sensoryczny` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Klimat Piwniczki (Psychrometria & VPD)` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `VPD:` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Punkt rosy:` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Gouda / Cheddar` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Ser Maziowy (B. linens)` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Temperatura (°C):` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Wilgotność RH (%):` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Kalibracja Higrometru Solą (ASTM E104)` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Wzorcowa kalibracja wilgotności w szczelnym słoiku z papką solną:` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Odczyt miernika w słoiku testowym (%):` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Wzorzec ASTM:` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Offset sensora:` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `UI` | `Offset Zastosowany!` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `UI` | `Skalibrowana wilgotność piwniczki:` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Zastosuj do Jaskini` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Resetuj` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `ALARM: Zagrożenie Case Hardening!` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `ALARM: Ryzyko Kondensacji i Pleśni!` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Klimat Optymalny (Brak Ryzyka)` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Rekomendowany Harmonogram Pielęgnacji (Affinage):` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Brak krążków w piwniczce` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Dodaj partię sera twardego lub dojrzewającego, aby monitorować obracanie i wilgotność.` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Waga początkowa` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Waga obecna` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Ubytek (Shrinkage)` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Obrócono:` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Brak` | `app/(tabs)/batches.tsx` | ✅ | tests/audit-fixes.test.tsx, tests/components/ui-components.test.tsx |
| `TEKST` | `Przemyto:` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Solanka` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Szczotkuj` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Woskuj` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Nowa waga krążka (g):` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Zapisz` | `app/(tabs)/batches.tsx` | ✅ | tests/components/ui-components.test.tsx, tests/i18n-no-polish-in-en.test.tsx |
| `TEKST` | `Ukryj historię` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Historia pielęgnacji` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `wpisów` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Brak wpisów historii pielęgnacji.` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Obrócenie` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Przemycie solanką` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Szczotkowanie` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Woskowanie` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Bandażowanie` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Ważenie` | `app/(tabs)/batches.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Receptura Skopiowana!` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Link offline (ferment://) ze sprawdzoną sumą kontrolną skopiowano do schowka.` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Brak Receptury` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `W schowku nie znaleziono prawidłowego linku receptury ferment://` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Wczytano Recepturę!` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Pomyślnie zweryfikowano sumę kontrolną integralności.` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `UI` | `Błąd Importu` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `UI` | `Nieprawidłowe dane receptury.` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Ser` | `app/(tabs)/index.tsx` | ✅ | tests/components/ui-components.test.tsx, tests/matrix-a11y.test.tsx |
| `TEKST` | `Krowi` | `app/(tabs)/index.tsx` | ✅ | tests/core/inventory.test.ts, tests/matrix-translations.test.ts |
| `TEKST` | `Kozi` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Owcza` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Kiszonka Warzywna` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Nastaw Kombuchy` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Mleko Krowie` | `app/(tabs)/index.tsx` | ✅ | tests/core/inventory.test.ts, tests/matrix-translations.test.ts |
| `TEKST` | `Mleko Kozie` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Mleko Owcze` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Mleko Bawole` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Podpuszczka` | `app/(tabs)/index.tsx` | ✅ | tests/core/inventory.test.ts, tests/matrix-translations.test.ts |
| `TEKST` | `Chlorek Wapnia` | `app/(tabs)/index.tsx` | ✅ | tests/domain-coverage.test.ts, tests/matrix-translations.test.ts |
| `TEKST` | `Sól Kamienna` | `app/(tabs)/index.tsx` | ✅ | tests/core/inventory.test.ts, tests/lib/csv-export.test.ts |
| `TEKST` | `Cukier` | `app/(tabs)/index.tsx` | ✅ | tests/data/sqlite-store.test.ts, tests/matrix-translations.test.ts |
| `TEKST` | `Herbata` | `app/(tabs)/index.tsx` | ✅ | tests/data/sqlite-store.test.ts, tests/matrix-translations.test.ts |
| `TEKST` | `Utworzono z kalkulatora głównego.` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Numer partii:` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Odpisano ze spiżarni:` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Braki w spiżarni:` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `UI` | `Partia Zapisana!` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `UI` | `OK` | `app/(tabs)/index.tsx` | ✅ | tests/core/mead-kinetics.test.ts, tests/matrix-dimensions.test.tsx |
| `TEKST` | `Wykryto uszkodzony stan danych` | `app/(tabs)/index.tsx` | ✅ | tests/audit-fixes.test.tsx |
| `TEKST` | `Zamknij` | `app/(tabs)/index.tsx` | ✅ | tests/audit-fixes.test.tsx, tests/close-button-guard.test.tsx |
| `TEKST` | `Serowarstwo & Flora Domowa` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Kombucha` | `app/(tabs)/index.tsx` | ✅ | tests/components/ui-components.test.tsx, tests/core/ferment-engine.test.ts |
| `TEKST` | `Tryb Mokrych Rąk (Ekran Zawsze Włączony)` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Zapobiega wygaszaniu ekranu podczas pracy przy garnku` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Zapisz jako Nową Partię` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `UI` | `Wpisz nazwę składnika.` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `UI` | `Składnik Dodany!` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Usuń Składnik` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Czy na pewno chcesz usunąć` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Brak Partii` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Najpierw utwórz co najmniej jedną partię, aby wygenerować arkusz etykiet z kodami QR.` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Najpierw utwórz co najmniej jedną partię, aby wygenerować etykiety.` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `UI` | `Pusta Spiżarnia` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `UI` | `Brak składników do wyeksportowania.` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Spiżarnia & Ekonomika` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `składników na stanie` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Dodaj` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Drukowanie Arkusza Etykiet A4` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Generuj wektorowe kody QR na krążki sera i słoiki fermentacyjne (siatka 2x4).` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Drukuj A4` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Etykiety PDF` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Eksport CSV` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Nowy Składnik w Spiżarni` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Nazwa (np. Podpuszczka chymozyna 200 IMCU)` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Ilość (np. 500)` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Jednostka (g, ml, L)` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Cena jedn. PLN` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Zapisz Składnik` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Stan Magazynowy` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Brak składników w spiżarni` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Dodaj mleko, enzymy, kultury lub sól, aby zarządzać zapasami i kosztami.` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Kalkulator Kosztów Partii & Oszczędności Domowych` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Analiza kosztów surowca, energii grzewczej, chłodzenia piwniczki i zysku vs rynek rzemieślniczy` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Mleko (L):` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Masa warzyw (kg):` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Woda (L):` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Gotowy napój (L):` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Uzyskany wyrób gotowy (kg):` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Dni dojrzewania w piwniczce:` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Koszt całkowity:` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Surowce i dodatki:` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Energia i chłodzenie:` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Oszczędzasz względem rynku:` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Przelicznik Form i Zamienników Składników` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Kalkulator ekwiwalentów enzymów, kultur naturalnych i roztworów chlorku wapnia` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Objętość mleka (L):` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Przelicznik Form Podpuszczki` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Płynna (200 IMCU/ml)` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Proszek mikrobiologiczny (2000 IMCU/g)` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Tabletka Meito (2500 IMCU/tabl)` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Pasta jagnięca z lipazą` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Wymagana dawka:` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Ekwiwalent Kultur Naturalnych (Zamiast DVS)` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Mezofilne (maślanka/zsiadłe)` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Termofilne (żywy jogurt)` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Naturalny zamiennik:` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Ilość do zadania:` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Przelicznik Postaci Chlorku Wapnia (CaCl2)` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Bezwodny CaCl2 (suchy czysty):` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Dwuwodny CaCl2 * 2H2O:` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Roztwór płynny 33%:` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Roztwór płynny 10%:` | `app/(tabs)/pantry.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Wczesne Wzdęcia Sera (Early Blowing)` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Gąbczasty ser, tysiące drobnych dziurek, krążek pęcznieje w 24–48h od sprasowania.` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Skażenie pałeczkami Coli (E. coli) lub drożdżami gazotwórczymi wskutek braku higieny doju.` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Wyrzucić ser! Bezwzględnie wygotować formy, chusty i zdezynfekować kocioł. Nie spożywać.` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Późne Wzdęcia Sera (Late Blowing)` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Wielkie, nieregularne pęknięcia i wybrzuszenia krążka po 3–8 tygodniach dojrzewania w piwnicy.` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Przetrwalniki Clostridium tyrobutyricum z kiszonki dla krów wytwarzające kwas masłowy i gaz H2.` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Ser ma ostry, zjełczały zapach. Następnym razem stosuj wyłącznie mleko od krów karmionych sianem.` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Gorzki Posmak Sera (Bitter Defect)` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Nieprzyjemna gorycz w finiszu smakowym dojrzałego sera.` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Nadmiar podpuszczki, zbyt niska zawartość soli w solance (<18%) lub zanieczyszczenie mleka bakteriami psychrotrofowymi.` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Zmniejsz dawkę enzymu o 20% i sprawdź gęstość solanki aerometrem. Dopilnuj szybkiego zakwaszenia.` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Kożuszek Fermentacyjny (Kahm) vs Prawdziwa Pleśń` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Biały nalot na powierzchni kiszonki warzywnej.` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Kożuszek Kahm to drożdże tlenowe (cienka, kredowa błona). Pleśń tworzy puszyste, wypukłe, zielone/czarne zarodnie.` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Kahm: zebrać wyparzoną łyżką, kiszonka jest zdatna. Pleśń puszysta: bezwzględnie wyrzucić cały słoik!` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Zatruta Matka Octowa / Zepsuty Ocet` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Brak kwaśnienia, zapach kleju lub acetonu, matka opada na dno i obumiera.` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Cydr/wino miało >8.0% ABV (zatrucie etanolem) lub nastaw był szczelnie zamknięty bez dostępu tlenu.` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Rozcieńcz wsad wodą do 5–6% ABV i zapewnij stały dopływ powietrza przez gazę bawełnianą.` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Baza Wiedzy & Doktor Wad` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Rozpoznawanie patogenów, higiena i profil sensoryczny` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Radar Profilu Sensorycznego (6 Osi)` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Wizualizacja organoleptyczna: oceń kwasowość, słoność, kremowość i orzechowość partii.` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Kwasowość` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Słoność` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Twardość` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Kremowość` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Ostrość` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Orzechowość` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `SOR Ratunkowy Fermentacji (Triage Awaryjny)` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Natychmiastowe protokoły ratunkowe dla krytycznych usterek biologicznych` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Wybierz zaistniałą awarię:` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Czy partię można uratować?` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `NIE — BEZWZGLĘDNIE WYRZUĆ!` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `TAK (Postępuj wg protokołu)` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Główna przyczyna:` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Objawy:` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Natychmiastowe działania ratunkowe:` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Chemia Wody & Neutralizacja Chloraminy` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Precyzyjne usuwanie dezynfektantów wodociągowych niszczących bakterie kwasu mlekowego` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Objętość wody (L):` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Typ środka w kranie:` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Chloramina (NH2Cl)` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Chlor (Cl2)` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Odchlorowanie / Neutralizacja:` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Witamina C (kwas L-askorbinowy):` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Czas odparowania wolnego chloru:` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `min wrzenia` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Twardość całkowita i bufor:` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Wapń Ca (ppm):` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Magnez Mg (ppm):` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Przydatność dla sera:` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Przydatność dla kombuchy/kiszonek:` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Koło Aromatów Mikrobiologicznych` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Przeglądaj deskryptory organoleptyczne i ich biochemiczne źródło` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Związek chemiczny:` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Doktor Wad Fermentacyjnych` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Przyczyna:` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Działanie naprawcze:` | `app/(tabs)/school.tsx` | ✅ | tests/matrix-translations.test.ts |
| `UI` | `Kopia Utworzona` | `app/(tabs)/settings.tsx` | ✅ | tests/matrix-translations.test.ts |
| `UI` | `Nowy punkt przywracania został pomyślnie zapisany w pamięci urządzenia.` | `app/(tabs)/settings.tsx` | ✅ | tests/matrix-translations.test.ts |
| `UI` | `Eksport JSON` | `app/(tabs)/settings.tsx` | ✅ | tests/matrix-translations.test.ts |
| `UI` | `Plik JSON wygenerowany pomyślnie.` | `app/(tabs)/settings.tsx` | ✅ | tests/matrix-translations.test.ts |
| `UI` | `Eksport CSV` | `app/(tabs)/settings.tsx` | ✅ | tests/matrix-translations.test.ts |
| `UI` | `Plik CSV wygenerowany pomyślnie.` | `app/(tabs)/settings.tsx` | ✅ | tests/matrix-translations.test.ts |
| `UI` | `Przywrócono` | `app/(tabs)/settings.tsx` | ✅ | tests/matrix-translations.test.ts |
| `UI` | `Zakup został pomyślnie przywrócony!` | `app/(tabs)/settings.tsx` | ✅ | tests/matrix-translations.test.ts |

*(... i 834 kolejnych elementów w pełnym wykazie)*
