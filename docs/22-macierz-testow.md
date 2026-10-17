# Macierz Testów (AST Coverage Matrix) — FERMENT

Wygenerowano automatycznie przez `scripts/test-matrix.mjs` zgodnie z wymaganiami **BR-TEST-028..031**.
Zasada dowodu: wyłącznie wykonywalny kod testu (wycięte komentarze, importy i opisy `test`/`describe`).

## Podsumowanie Pokrycia

| Kategoria | Łącznie | Pokryte | Pokrycie % | Status |
| :--- | :---: | :---: | :---: | :---: |
| **EKRAN** | 4 | 4 | **100.0%** | ✅ POKRYTE |
| **UI** | 8 | 8 | **100.0%** | ✅ POKRYTE |
| **TEKST** | 743 | 743 | **100.0%** | ✅ POKRYTE |
| **LOGIKA** | 179 | 179 | **100.0%** | ✅ POKRYTE |
| **WYMIAR** | 92 | 92 | **100.0%** | ✅ POKRYTE |

Łącznie elementów: **1026** | Pokrytych: **1026** | Brakujących: **0**

## Szczegółowa Lista Elementów

| Kategoria | Nazwa elementu | Plik źródłowy | Status | Pliki testowe |
| :--- | :--- | :--- | :---: | :--- |
| `EKRAN` | `/(tabs)/cave` | `app/(tabs)/cave.tsx` | ✅ | tests/core/cave-environment.test.ts, tests/core/flavor-wheel-data.test.ts |
| `EKRAN` | `/(tabs)/dairy` | `app/(tabs)/dairy.tsx` | ✅ | tests/core/fermentation-diagnostics.test.ts, tests/matrix-dimensions.test.tsx |
| `EKRAN` | `/(tabs)/index` | `app/(tabs)/index.tsx` | ✅ | tests/audit-fixes.test.tsx, tests/matrix-routes.test.tsx |
| `EKRAN` | `/(tabs)/pantry-knowledge` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-routes.test.tsx |
| `TEKST` | `Dojrzewalnia` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Dozór mikroklimatu jaskini, affinage i kartoteka krążków` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Dodaj krążek sera` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Nowy Krążek` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Mikroklimat Piwniczki Serowarskiej` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Psychrometria: punkt rosy T_dp i ochrona przed kondensacją` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Temperatura (°C):` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Wilgotność RH (%):` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Punkt rosy:` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Deficyt VPD:` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Status:` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Kondensacja!` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `BEZPIECZNY` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `ALARM: Ryzyko Kondensacji i Pleśni! Wilgoć skrapla się na skórce. Obniż wilgotność lub przewietrz.` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Zadania Pielęgnacyjne na Dziś` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `krążków` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Obrócono krążek` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Cofnij` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Wszystkie krążki zostały dziś pomyślnie obrócone. Dojrzewalnia odpoczywa!` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Obróć krążek` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Obróć` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Aktywne Krążki w Jaskini` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Wszystkie` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Maziowe` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Pleśń Biała` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Naturalne` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Brak krążków w dojrzewalni` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Przenieś ser po soleniu z Zakładki 1 (SEROWAR) lub dodaj krążek ręcznie.` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Dodaj Pierwszy Krążek` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `dni dojrzewania` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `ubytek` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Waga początkowa:` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Waga bieżąca:` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Typ skórki:` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Obrócono` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Pielęgnacja Skórki` | `app/(tabs)/cave.tsx` | ✅ | tests/data/knowledge-base.test.ts, tests/matrix-translations.test.ts |
| `TEKST` | `Krążek` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Przemyto 18% solanką maziową B. linens.` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Przemyj mazią` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Dodaj Nowy Krążek do Jaskini` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Waga początkowa sera (g):` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Planowany czas dojrzewania (dni):` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Anuluj` | `app/(tabs)/cave.tsx` | ✅ | tests/audit-fixes.test.tsx, tests/i18n-no-polish-in-en.test.tsx |
| `TEKST` | `Dodaj` | `app/(tabs)/cave.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Twarogi` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Masielnictwo & Ghee` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Napoje Fermentowane` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Obieg Serwatki` | `app/(tabs)/dairy.tsx` | ✅ | tests/data/knowledge-base.test.ts, tests/matrix-translations.test.ts |
| `TEKST` | `Nabiał & Kuchnia` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Tradycyjne przetwórstwo mleka, twarogi klinkowe, masło i zero-waste` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Tradycyjny Twaróg Klinkowy` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Koagulacja kwasowa w punkcie pI 4.60` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Objętość mleka zsiadłego (L):` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Temperatura dogrzewania skrzepu (°C):` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `ALARM: Temperatura > 44°C! Ryzyko stwardnienia kazeiny i gumowatego twarogu. Zdejmij z ognia!` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Czas odcieku w chuście klinkowej (godz.):` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Szacowany uzysk twarogu:` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Pozyskana serwatka kwasowa:` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Wskazówka warsztatowa:` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Podgrzewaj skrzep wolno: 1°C na 3 minuty. Przy 38–40°C ziarno jest delikatne i maślane. Nie prasuj twarogu ciężarami — grawitacyjny odciek w wiszącej chuście zapewnia aksamitną strukturę.` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Inwersja emulsji tłuszczowej i klarowanie masła` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Masa śmietanki (g):` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Zawartość tłuszczu śmietanki (%):` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Temperatura zmaślania (°C):` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Śmietanka zbyt zimna (<10°C): zmaślanie będzie trwało bardzo długo.` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Śmietanka zbyt ciepła (>14°C): masło będzie miękkie, a maślanka uwięziona w ziarnach.` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Spodziewana kostka masła (82.5%):` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Świeża maślanka rzemieślnicza:` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Wytopione klarowane Ghee (99.5%):` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Protokół płukania lodowego:` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Po zbiciu ziaren masła odsącz maślankę i przepłucz ziarna 3 razy wodą lodową (<4°C). Każda kropla usuniętej maślanki wydłuża trwałość masła z tygodnia do 6 miesięcy!` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Napoje Probiotyczne (Jogurt & Kefir)` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Fermentacja mlekowa kulturami symbiotycznymi` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Objętość mleka na jogurt (L):` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Temperatura inkubacji jogurtu (°C):` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Gęsty jogurt naturalny:` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Odsączony jogurt grecki (50%):` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Kefir na grzybku tybetańskim:` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Stosuj 30g ziaren kefirowych na 1 litr mleka w temp. 20–22°C przez 24 godziny. Do napoju przechodzi kwas mlekowy, dwutlenek węgla i kefiran o właściwościach immunostymulujących.` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Zamknięty Obieg Serwatki (Zero-Waste)` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Odzysk białek albuminowych i karmelizacja laktozy` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Objętość świeżej słodkiej serwatki (L):` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Dodatek mleka pełnego dla wydajności (L):` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Kwas spożywczy (ocet 6% lub sok cytrynowy ml):` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Spodziewana Ricotta zagrodowa:` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Wydajność norweskiego sera Brunost:` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Sekret sera Brunost (Mysost):` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Odparuj serwatkę na małym ogniu (102°C) do 1/5 objętości, dodaj śmietankę i mieszaj aż laktoza skarmelizuje się na brązowo. Schłodź w kąpieli lodowej energicznie ucierając, aby zapobiec wytrąceniu wyczuwalnych kryształków piasku.` | `app/(tabs)/dairy.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Receptura Skopiowana!` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Link offline (ferment://) ze sprawdzoną sumą kontrolną skopiowano do schowka.` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Brak Receptury` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `W schowku nie znaleziono prawidłowego linku receptury ferment://` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Wczytano Recepturę!` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Pomyślnie zweryfikowano sumę kontrolną integralności.` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `UI` | `Błąd Importu` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `UI` | `Nieprawidłowe dane receptury.` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Ser` | `app/(tabs)/index.tsx` | ✅ | tests/components/ui-components.test.tsx, tests/data/knowledge-base.test.ts |
| `TEKST` | `Krowi` | `app/(tabs)/index.tsx` | ✅ | tests/core/inventory.test.ts, tests/matrix-translations.test.ts |
| `TEKST` | `Kozi` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Owcza` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Mleko Krowie` | `app/(tabs)/index.tsx` | ✅ | tests/core/inventory.test.ts, tests/matrix-translations.test.ts |
| `TEKST` | `Mleko Kozie` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Mleko Owcze` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Mleko Bawole` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Podpuszczka` | `app/(tabs)/index.tsx` | ✅ | tests/core/inventory.test.ts, tests/matrix-translations.test.ts |
| `TEKST` | `Chlorek Wapnia` | `app/(tabs)/index.tsx` | ✅ | tests/domain-coverage.test.ts, tests/matrix-translations.test.ts |
| `TEKST` | `Utworzono z kalkulatora głównego.` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Numer partii:` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Odpisano ze spiżarni:` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Braki w spiżarni:` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `UI` | `Partia Zapisana!` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `UI` | `OK` | `app/(tabs)/index.tsx` | ✅ | tests/core/mead-kinetics.test.ts, tests/matrix-dimensions.test.tsx |
| `TEKST` | `Przekazano do Dojrzewalni!` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Krążek czeka w Zakładce 3 (Dojrzewalnia).` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `OK` | `app/(tabs)/index.tsx` | ✅ | tests/core/mead-kinetics.test.ts, tests/matrix-dimensions.test.tsx |
| `TEKST` | `Wykryto uszkodzony stan danych` | `app/(tabs)/index.tsx` | ✅ | tests/audit-fixes.test.tsx |
| `TEKST` | `Zamknij` | `app/(tabs)/index.tsx` | ✅ | tests/audit-fixes.test.tsx, tests/close-button-guard.test.tsx |
| `TEKST` | `Rzemieślniczy Warsztat Serowarski` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Tryb Mokrych Rąk (Ekran Zawsze Włączony)` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Zapobiega wygaszaniu ekranu podczas pracy przy garnku` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Przenieś krążek do Dojrzewalni (Cave Log)` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Zapisz jako Nową Partię` | `app/(tabs)/index.tsx` | ✅ | tests/matrix-translations.test.ts |
| `UI` | `Druk Etykiet` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `UI` | `Arkusz PDF wygenerowany pomyślnie.` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `UI` | `Kopia Utworzona` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `UI` | `Nowy punkt przywracania został pomyślnie zapisany w pamięci urządzenia.` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Spiżarnia` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Etykiety & Koszty` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Szkoła & Doctor` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Ustawienia & Kopia` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Spiżarnia & Wiedza` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Inwentarz surowców, generator etykiet QR, diagnostyk wad i kopia zapasowa` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Magazyn Rzemieślniczy` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Kultury starterowe, podpuszczki, chlorek wapnia i sól` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Dodaj do spiżarni` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Stan magazynowy jest synchronizowany automatycznie po każdej partii.` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Brak składników w spiżarni` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Dodaj mleko, enzymy, kultury lub sól, aby zarządzać zapasami i kosztami.` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Generator Etykiet QR PDF` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Drukuj arkusze samoprzylepne A4 z kodem QR partii` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Kod partii sera:` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Liczba naklejek na arkuszu:` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Drukuj Arkusz Etykiet PDF (AirPrint)` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Kalkulator Ekonomiczny & % Yield` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Koszt wsadu vs uzysk gotowego sera` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Objętość mleka (L):` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Cena za litr mleka (zł/L):` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Otrzymany ser po prasowaniu (kg):` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Koszt mleka:` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Koszt 1 kg sera:` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Wydajność % Yield:` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Cheese Doctor — Diagnostyk Wad` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Triage mikrobiologiczny i ratunek partii sera` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Wczesne Wzdęcia Sera (Early Blowing)` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Skażenie pałeczkami Coli (E. coli) lub drożdżami gazotwórczymi wskutek braku higieny doju.` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Działanie naprawcze:` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Wyrzucić ser! Bezwzględnie wygotować formy, chusty i zdezynfekować kocioł. Nie spożywać.` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Późne Wzdęcia Sera (Late Blowing)` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Przetrwalniki Clostridium tyrobutyricum z kiszonki dla krów wytwarzające kwas masłowy i gaz H2.` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Stosuj lizozym lub azotan potasu (saletrę) do mleka z kiszonki; nie dopuszczaj do przegrzania jaskini.` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Gorzknienie Skrzepu i Miąższu` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Nadmiar peptydów hydrofobowych wskutek przedawkowania podpuszczki mikrobiologicznej lub niedoboru soli.` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Zmniejsz dawkę podpuszczki o 20% i skontroluj stężenie solanki (min. 18% NaCl).` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Szkoła Mleczarstwa (Lekcje Polowe)` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Prawa fizykochemii kazeiny w 90 sekund` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Biochemia Kazeiny i Wiązanie Wapniowe` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Podpuszczka przecina wiązanie Phe105-Met106 w k-kazeinie. Wolne micele łączą się za pomocą mostków Ca2+ w trójwymiarową sieć żelu.` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Złota Reguła Synerezy` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Drobniejsze cięcie ziarna i wyższe dogrzewanie wypychają serwatkę. Większa wilgotność = szybsze dojrzewanie, ale większe ryzyko zakażeń.` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Ustawienia Aplikacji` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Lokalizacja, jednostki i kopia bezpieczeństwa` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Język interfejsu (35 języków):` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Układ Jednostek` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Metryczny (L, kg, °C)` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Kopie Bezpieczeństwa (SQLite WAL)` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Automatyczna rotacja 10 kopii bezpieczeństwa oraz natychmiastowy punkt przywracania.` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Utwórz Kopię Zapasową JSON` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Przywróć Zakupy (StoreKit 2)` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Przywrócono` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Brak Zakupu` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Zakup został pomyślnie przywrócony!` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Nie znaleziono zapisanego zakupu w bazie urządzenia.` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Historia kopii zapasowych:` | `app/(tabs)/pantry-knowledge.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Apps4Brew Pass` | `src/components/Apps4BrewPassModal.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Odblokuj Pełną Twórczość` | `src/components/Apps4BrewPassModal.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Okres próbny wygasł. Twoje dane i historia partii pozostają w pełni dostępne (Read-Only).` | `src/components/Apps4BrewPassModal.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `14-dniowy okres próbny jest aktywny. Wszystkie funkcje są w 100% odblokowane.` | `src/components/Apps4BrewPassModal.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Miesięczny` | `src/components/Apps4BrewPassModal.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `3,99 zł / mies.` | `src/components/Apps4BrewPassModal.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Roczny` | `src/components/Apps4BrewPassModal.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `19,99 zł / rok` | `src/components/Apps4BrewPassModal.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Dożywotni` | `src/components/Apps4BrewPassModal.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `59,99 zł raz na zawsze` | `src/components/Apps4BrewPassModal.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Subskrybuj` | `src/components/Apps4BrewPassModal.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Przywróć zakup` | `src/components/Apps4BrewPassModal.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Kalkulator Kombuchy 1F` | `src/components/calculator/BeverageCraftSection.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Objętość nastawu wody (L):` | `src/components/calculator/BeverageCraftSection.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Herbata` | `src/components/calculator/BeverageCraftSection.tsx` | ✅ | tests/data/sqlite-store.test.ts, tests/matrix-translations.test.ts |
| `TEKST` | `Cukier` | `src/components/calculator/BeverageCraftSection.tsx` | ✅ | tests/data/sqlite-store.test.ts, tests/matrix-translations.test.ts |
| `TEKST` | `Starter SCOBY` | `src/components/calculator/BeverageCraftSection.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `objętości` | `src/components/calculator/BeverageCraftSection.tsx` | ✅ | tests/core/continuous-brew.test.ts, tests/matrix-translations.test.ts |
| `TEKST` | `Zaawansowane Parametry Biochemiczne` | `src/components/calculator/BeverageCraftSection.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Czarny Czosnek (Black Garlic & Wolna Reakcja Maillarda)` | `src/components/calculator/BlackGarlicCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Termiczna transformacja allicyny w przeciwutleniającą S-allilocysteinę (SAC) i karmelizację melanoidynową bez pirolizy` | `src/components/calculator/BlackGarlicCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Masa surowego czosnku (g):` | `src/components/calculator/BlackGarlicCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Aktualny dzień cyklu (1-50):` | `src/components/calculator/BlackGarlicCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Temperatura komory (°C):` | `src/components/calculator/BlackGarlicCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Wilgotność względna (% RH):` | `src/components/calculator/BlackGarlicCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Szacowana waga:` | `src/components/calculator/BlackGarlicCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `ubytek wody:` | `src/components/calculator/BlackGarlicCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Pozostało:` | `src/components/calculator/BlackGarlicCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `dni` | `src/components/calculator/BlackGarlicCard.tsx` | ✅ | tests/core/brine-diffusion.test.ts, tests/data/sqlite-store.test.ts |
| `TEKST` | `Przyrost antyoksydantu SAC:` | `src/components/calculator/BlackGarlicCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Cukry fruktozowe:` | `src/components/calculator/BlackGarlicCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Tekstura ząbków:` | `src/components/calculator/BlackGarlicCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Profil bukietu:` | `src/components/calculator/BlackGarlicCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Botulinum Guard (Bariera pH 4.60)` | `src/components/calculator/BotulinumGuardCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Zmierzone pH:` | `src/components/calculator/BotulinumGuardCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Godzin od nastawienia:` | `src/components/calculator/BotulinumGuardCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Kinetyka Kwasowa LAB (Monitor Zakwaszania)` | `src/components/calculator/BotulinumGuardCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Oczekiwane pH po` | `src/components/calculator/BotulinumGuardCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Zmierzone:` | `src/components/calculator/BotulinumGuardCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Receptury Kanoniczne & Wymiana` | `src/components/calculator/CanonicalRecipesCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Wydajność:` | `src/components/calculator/CanonicalRecipesCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Dojrzewanie:` | `src/components/calculator/CanonicalRecipesCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Kluczowa technika:` | `src/components/calculator/CanonicalRecipesCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Kopiuj Link Receptury (ferment://)` | `src/components/calculator/CanonicalRecipesCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Wczytaj ze Schowka` | `src/components/calculator/CanonicalRecipesCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Woskowanie & Powłoki Ochronne Krążka` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Obliczanie powierzchni krążka i zapotrzebowania na wosk serowarski lub polioctan` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Wosk Serowarski` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Powłoka Polioctanowa` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Wysokość krążka (cm):` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Liczba warstw (1-3):` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Powierzchnia całkowita krążka:` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Zapotrzebowanie na wosk/powłokę:` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `warstwy` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Skład Biochemiczny & Klasyfikacja Codex Alimentarius` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Standard CODEX STAN 283-1978: MFFB, FDM oraz relacja Salt-in-Moisture (S/M)` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Szacowana wilgotność sera (%):` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Zawartość tłuszczu w serze (%):` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Stężenie soli w serze (%):` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `MFFB (woda w masie beztłuszczowej):` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `FDM (tłuszcz w suchej masie):` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Salt-in-Moisture (S/M):` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `suchej masy` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Dyfuzja Soli & Czas Solankowania (Prawo Ficka)` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Nieustalona dyfuzja NaCl w głąb kazeiny, penetracja rdzenia krążka i zapobieganie przesoleniu` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Masa krążka sera (kg):` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Średnica krążka (cm):` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Zasolenie solanki (%):` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Temperatura solanki (°C):` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Optymalny czas w solance:` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `godz.` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Tempo pochłaniania soli:` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `łącznie:` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Odległość do rdzenia geometrycznego:` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `współczynnik dyfuzji:` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Czas wyrównania stężenia w rdzeniu:` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Morfologia Gatunkowa Mleka & Kazeina` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Frakcje kazeiny, średnica kuleczek tłuszczu, dynamika enzymatyczna i szacowany uzysk sera` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Dominująca frakcja kazeiny:` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Średnia kuleczek tłuszczowych:` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Wapń:` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Doza podpuszczki:` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `na` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/audit-fixes.test.tsx, tests/brands.contract.test.ts |
| `TEKST` | `Skorygowany mnożnik flokulacji:` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Oczekiwany uzysk sera:` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Odzysk Ricotty z serwatki:` | `src/components/calculator/CheeseBiochemAndCoatingCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Zbuforowana Solanka Serowarska` | `src/components/calculator/CheeseBrineAndRegenCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Woda:` | `src/components/calculator/CheeseBrineAndRegenCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Stężenie:` | `src/components/calculator/CheeseBrineAndRegenCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `pH wody kranowej:` | `src/components/calculator/CheeseBrineAndRegenCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Ilość soli:` | `src/components/calculator/CheeseBrineAndRegenCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Wymagany CaCl2 (2 g/L):` | `src/components/calculator/CheeseBrineAndRegenCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `zapobiega mięknięciu skórki` | `src/components/calculator/CheeseBrineAndRegenCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Kwas mlekowy 80% (do pH 5.20):` | `src/components/calculator/CheeseBrineAndRegenCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `ml kwasu` | `src/components/calculator/CheeseBrineAndRegenCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Regeneracja i Wzmocnienie Stężenia Solanki` | `src/components/calculator/CheeseBrineAndRegenCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Aktualne stężenie solanki (%):` | `src/components/calculator/CheeseBrineAndRegenCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Docelowe stężenie solanki (%):` | `src/components/calculator/CheeseBrineAndRegenCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Sól do dosypania w celu przywrócenia stężenia:` | `src/components/calculator/CheeseBrineAndRegenCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Rozpuść sól bezpośrednio w solance bez wylewania roztworu.` | `src/components/calculator/CheeseBrineAndRegenCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Areometria Solanki & Kompensacja Temperatury` | `src/components/calculator/CheeseBrineAndRegenCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Przeliczanie stopni Salometru (°Sal), Baumé (°Bé), gęstości SG i % NaCl z korektą termiczną` | `src/components/calculator/CheeseBrineAndRegenCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Jednostka pomiaru:` | `src/components/calculator/CheeseBrineAndRegenCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Odczyt areometru:` | `src/components/calculator/CheeseBrineAndRegenCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Objętość solanki (L):` | `src/components/calculator/CheeseBrineAndRegenCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Profil docelowy solanki:` | `src/components/calculator/CheeseBrineAndRegenCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Status roztworu:` | `src/components/calculator/CheeseBrineAndRegenCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Gęstość skorygowana SG:` | `src/components/calculator/CheeseBrineAndRegenCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Korekta termiczna SG:` | `src/components/calculator/CheeseBrineAndRegenCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Zasolenie NaCl:` | `src/components/calculator/CheeseBrineAndRegenCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Stopnie Salometru:` | `src/components/calculator/CheeseBrineAndRegenCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `Stopnie Baumé:` | `src/components/calculator/CheeseBrineAndRegenCard.tsx` | ✅ | tests/matrix-translations.test.ts |
| `TEKST` | `NaCl na litr solanki:` | `src/components/calculator/CheeseBrineAndRegenCard.tsx` | ✅ | tests/matrix-translations.test.ts |

*(... i 726 kolejnych elementów w pełnym wykazie)*
