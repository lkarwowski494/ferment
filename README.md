# FERMENT (Ser i Flora / Mikrobiologia Domowa)

> **Ekosystem:** Apps4Brew Studio  
> **Repozytorium:** `lkarwowski494/ferment`  
> **Status:** Wersja robocza BRD 0.1 Master (74.5 stron znormalizowanych, 25 rozdziałów modularnych)

## O projekcie
**FERMENT** to kieszonkowy asystent domowego serowarstwa zagrodowego oraz zaawansowanej fermentacji warzywno-napojowej (kimchi, zakwasy, kombucha, żywe octy).

### Kluczowe moduły:
1. **Kalkulator serowara:** Precyzyjne przeliczanie dawek podpuszczki w jednostkach IMCU, suplementacja chlorku wapnia ($CaCl_2$) dla mleka sklepowego/pasteryzowanego, dobór kultur mezofilnych i termofilnych, interaktywny stoper flokulacji (metoda mnożnika flokulacji Berridge'a).
2. **Dojrzewalnia sera (Cave Log):** Monitorowanie leżakowania krążków w piwniczce (wilgotność względna, temperatura, obliczanie punktu rosy), automatyczny harmonogram obracania, przemywania skórki solanką z *Brevibacterium linens*, rozwój pleśni szlachetnych (*Penicillium camemberti/roqueforti*), woskowanie i śledzenie ubytku wagi (% shrinkage).
3. **Asystent kiszonek i kimchi:** Precyzyjne solanki wagowe bazujące na całkowitej masie nastawu, zasalanie kapusty kimchi na sucho i w solance, 3 fazy mikrobiologiczne LAB, twarda bariera bezpieczeństwa botulinowego (pH < 4.6).
4. **Asystent kombuchy i octów:** Dwuetapowa fermentacja kombuchy (1F tlenowa ze SCOBY -> 2F beztlenowa refermentacja CO2 w butelkach ze szacowaniem ciśnienia), dwustopniowa produkcja żywych octów owocowych (fermentacja alkoholowa drożdży -> tlenowa oksydacja kwasu octowego przez *Acetobacter*).
5. **Ergonomia i sensory:** Apple Watch i Live Activity dla rąk oblepionych serwatką, bezprzewodowe czujniki BLE (RuuviTag, Mijia), wektorowy radar sensoryczny smaku i tekstury SVG.

## Dokumentacja Biznesowa i Inżynieryjna (BRD)
- Kompletne kompendium: [`FERMENT_BRD_Kompletne_Wydanie.md`](./FERMENT_BRD_Kompletne_Wydanie.md)
- Moduły analityczne i techniczne: [`docs/brd/`](./docs/brd/)
  - `00_START.md` — Streszczenie wykonawcze, warianty MVP, architektura i spis treści
  - `00b_Jedna_lista_decyzji.md` — Rejestr 45 decyzji produktowo-technicznych (DEC-01…DEC-45)
  - `00c_Sprzecznosci_i_weryfikacja.md` — Sprzeczności dziedzinowe i rozstrzygnięcia badawcze
  - `A1_rozdz_1_3_Wizja_Problem_Persony.md` — Wizja, 16 zasad ZP, persony P1–P8, sytuacje SYT
  - `A2_rozdz_4_6_1_Rynek_Przychod_Zakres.md` — Analiza rynku, model ekonomiczny Apps4Brew
  - `A3a_rozdz_6_2_Tabela_zakresu_cz1.md` — Tabela zakresu serowarskiego Z-001…Z-120
  - `A3b_rozdz_6_2_Tabela_zakresu_cz2.md` — Tabela zakresu fermentacji i platformy Z-121…Z-240
  - `A3c_Etapy_Naklad_Warianty.md` — Szacunki nakładu pracy agenta, harmonogram
  - `A4_rozdz_13_15_KPI_Marketing_ASO.md` — Prywatne KPI, ASO, kręgi dotarcia
  - `B1…B8` — 8 modułów wymagań funkcjonalnych (BR-SER, BR-CURD, BR-SOL, BR-CAVE, BR-KISZ, BR-KOM, BR-MAG, BR-SYS)
  - `C1…C4` — Szkoła, kompas diagnostyczny wad sera, 50 reguł dziedzinowych RD z wektorami testowymi, decyzje badacza
  - `D1…D4` — 115 wymagań NFR, relacyjny model SQLite DDL (18 tabel), rejestr 50 ryzyk RYZ, 9-warstwowa strategia testów
