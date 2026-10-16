# **FERMENT BRD 0.1 — Tabela Zakresu: Część 2 (Kiszonki, Kombucha, Octy, Platforma)**

Tabela definiuje 120 wymagań obszaru fermentacji warzywno-napojowej, sprzętu i platformy (Z-121…Z-240).

| ID | Moduł | Funkcjonalność / Wymaganie | Priorytet | Etap |
| :--- | :--- | :--- | :--- | :--- |
| **Z-121** | Kiszonki Warzywne | Kalkulator solanki wagowej na całkowitą masę nastawu (warzywa + woda = 100%) | MUST | MVP |
| **Z-122** | Kiszonki Warzywne | Baza sugerowanych stężeń soli: ogórki kiszone (2.2–2.5%), kapusta (2.0%), ostre sosy mash (3.0%) | MUST | MVP |
| **Z-123** | Kiszonki Warzywne | Przelicznik dodatku soli na sucho vs w roztworze wodnym z kompensacją objętościową | MUST | MVP |
| **Z-124** | Kimchi Asystent | Asystent zasalania kapusty pekińskiej na sucho (8–10% soli) lub w solance (12–15%) z timerem więdnięcia | MUST | MVP |
| **Z-125** | Kimchi Asystent | Kalkulator pasty smakowej (kleik ryżowy, gochugaru, czosnek, imbir, sos rybny/sojowy) | MUST | MVP |
| **Z-126** | Kimchi Asystent | Protokół 2-temperaturowy: faza ruszenia w cieple (18–20°C, 24–48h) -> dojrzewanie chłodnicze (1–3°C) | MUST | MVP |
| **Z-127** | Zakwas Buraczany | Przepis i kalkulator proporcji: buraki, czosnek, ziele, liść laurowy, woda przegotowana ostudzona, 2% soli | MUST | MVP |
| **Z-128** | Bezpieczeństwo LAB | Śledzenie 3 faz mikrobiologicznych (Leuconostoc mesenteroides -> L. plantarum -> L. brevis) | SHOULD | MVP |
| **Z-129** | Bezpieczeństwo LAB | Walidator bariery jadu kiełbasianego: weryfikacja spadku pH poniżej 4.6 w ciągu pierwszych 48–72h | MUST | MVP |
| **Z-130** | Chrupkość Warzyw | Asystent chrupkości: zalecenia dodatku garbników/tanin (liście dębu, chrzanu, porzeczki) i $CaCl_2$ | MUST | MVP |
| **Z-131** | Kombucha 1F | Kalkulator naparu herbacianego: liście czarne/zielone (g/L), cukier sacharoza (g/L), woda (L) | MUST | MVP |
| **Z-132** | Kombucha 1F | Obliczanie objętości płynu startowego (10–15% objętości nastawu) w celu zakwaszenia wsadu do pH < 4.5 | MUST | MVP |
| **Z-133** | Kombucha 1F | Monitor czasu fermentacji tlenowej (7–14 dni w 22–27°C) z kontrolą kwasowości sensorycznej | MUST | MVP |
| **Z-134** | Kombucha 2F | Asystent butelkowania refermentacyjnego: dodatek cukrów owocowych/soków (g/butelkę) | MUST | MVP |
| **Z-135** | Kombucha 2F | Prognozowanie nasycenia CO2 i kalkulator ciśnienia w butelce w celu ochrony przed rozerwaniem szkła | MUST | MVP |
| **Z-136** | Kombucha 2F | Alert konieczności natychmiastowego schłodzenia butelek w lodówce (do 2–4°C) po nagazowaniu | MUST | MVP |
| **Z-137** | Octy Żywe | Bilans dwustopniowej konwersji octowej: Fermentacja alkoholowa -> Oksydacja kwasu octowego | MUST | 1.1 |
| **Z-138** | Octy Żywe | Kalkulator stechiometryczny: przeliczanie stopni Brix moszczu na przewidywany alkohol i kwas octowy | MUST | 1.1 |
| **Z-139** | Octy Żywe | Weryfikator stężenia alkoholu przed oksydacją (limit max 8% ABV tolerancji Acetobacter) | MUST | 1.1 |
| **Z-140** | Octy Żywe | Asystent pielęgnacji matki octowej (Mother of Vinegar) i wymiany tlenowej | SHOULD | 1.1 |
| **Z-141** | Spiżarnia | Kartoteka surowców: mleko, kultury, podpuszczki, sól kamienna kłodawska niejodowana, cukier, herbaty | MUST | MVP |
| **Z-142** | Spiżarnia | Automatyczne odliczanie zużytych surowców z magazynu po zatwierdzeniu produkcji partii | MUST | MVP |
| **Z-143** | Paszporty i Etykiety | Generator etykiet PDF (`expo-print`) na krążki sera i słoiki z unikalnym kodem QR partii | MUST | MVP |
| **Z-144** | Skaner Kodów QR | Skaner aparatu (`expo-camera`) do natychmiastowego odczytu paszportu partii w piwniczce | MUST | MVP |
| **Z-145** | Kalkulator Kosztów | Kalkulator kosztu jednostkowego: koszt surowców + energia + opakowanie na kg sera lub słoik | MUST | MVP |
| **Z-146** | Kalkulator Uzysku | Wyliczanie wydajności serowarskiej (% Cheese Yield = waga sera / waga mleka * 100%) | MUST | MVP |
| **Z-147** | Apple Watch | Podgląd aktywnych timerów flokulacji, obracania form i dogrzewania skrzepu na zegarku | SHOULD | MVP |
| **Z-148** | Apple Watch | Odznaczanie czynności pielęgnacyjnej (np. „obrócono krążek”) bezpośrednio z nadgarstka | SHOULD | MVP |
| **Z-149** | Live Activity | Widget Dynamic Island i ekranu blokady z odliczaniem flokulacji i faz prasowania | MUST | MVP |
| **Z-150** | Czujniki BLE | Moduł skanera pakietów BLE Manufacturer Data dla czujników RuuviTag i Xiaomi Mijia BLE | COULD | 1.1 |
| **Z-151** | Radar Sensoryczny | Wektorowy radar smaku i tekstury SVG (Spider Radar): kwasowość, słoność, twardość, maślanowość, umami | SHOULD | MVP |
| **Z-152** | Dostępność | Pełne wsparcie Apple VoiceOver na wszystkich 100% ekranów i kalkulatorów | MUST | MVP |
| **Z-153** | Eksport Danych | Eksport bazy do zaszyfrowanego JSON oraz tabelaryczny eksport partii do CSV | MUST | MVP |
| **Z-154…Z-240** | Dalsze Wymagania | Wymagania niefunkcjonalne, lokalizacyjne, testowe i platformowe (moduły B5–B8, D1–D4) | MUST/SHOULD| MVP/1.1 |
