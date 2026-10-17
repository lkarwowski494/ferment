# **SEROWAR BRD 0.1 — Tabela Zakresu: Część 2 (Twarogi, Masło, Napoje Mleczne, Serwatka, Platforma)**

Tabela definiuje 120 wymagań obszaru przetwórstwa mlecznego, masielnictwa, obiegu serwatki i platformy (Z-121…Z-240).

| ID | Moduł | Funkcjonalność / Wymaganie | Priorytet | Etap |
| :--- | :--- | :--- | :--- | :--- |
| **Z-121** | Twarogi Klinkowe | Monitor kwasowej koagulacji kazeiny do punktu izoelektrycznego ($pH = 4.6$) | MUST | MVP |
| **Z-122** | Twarogi Klinkowe | Asystent rampy dogrzewania skrzepu twarogowego w oknie 35–45°C z zabezpieczeniem przed przegrzaniem | MUST | MVP |
| **Z-123** | Twarogi Klinkowe | Stoper grawitacyjnego odcieku serwatki w chuście klinkowej z wyliczaniem wilgotności końcowej | MUST | MVP |
| **Z-124** | Sery Świeże | Moduł Labneh — odsączanie jogurtu w worku, ubytek serwatki (50–60%), kulki w oliwie ziołowej | MUST | MVP |
| **Z-125** | Sery Świeże | Paneer & Chhena — termiczno-kwasowa koagulacja gorącego mleka (82–88°C) kwasem cytrynowym/serwatką | MUST | MVP |
| **Z-126** | Sery Świeże | Queso Blanco & sery do smażenia / grillowania — wysoka termoodporność dzięki brakowi kwaszenia | MUST | MVP |
| **Z-127** | Masielnictwo | Kalkulator zmaślania śmietanki: bilans tłuszczowy (30%, 36%, 42%) i wyliczanie wydajności masła | MUST | MVP |
| **Z-128** | Masielnictwo | Asystent okna temperaturowego śmietanki (10–14°C) z kompensacją sezonową (zima/lato) | MUST | MVP |
| **Z-129** | Masielnictwo | Monitor inwersji emulsji O/W -> W/O (faza pęcherzyków -> faza ziaren masła i maślanki) | MUST | MVP |
| **Z-130** | Masielnictwo | Asystent płukania masła wodą lodową (<6°C) i wyciskania resztek maślanki na bukowych deskach | MUST | MVP |
| **Z-131** | Masielnictwo | Masło ze śmietany ukwaszonej (Cultured Butter) — inokulacja kulturami mezofilnymi diacetylu | MUST | MVP |
| **Z-132** | Masielnictwo | Wytapianie ghee i masła klarowanego: odparowanie wody w 100–105°C, karmelizacja kazeiny, punkt dymienia 250°C | MUST | MVP |
| **Z-133** | Napoje Mleczne | Fermentacja termofilna jogurtu w 42–45°C (symbioza S. thermophilus i L. bulgaricus 1:1) | MUST | MVP |
| **Z-134** | Napoje Mleczne | Jogurt grecki — asystent odcieku serwatki do uzyskania kremowej gęstej konsystencji | MUST | MVP |
| **Z-135** | Napoje Mleczne | Rzemieślniczy kefir tradycyjny na ziarnach grzybka tybetańskiego z rotacją kultur | MUST | MVP |
| **Z-136** | Napoje Mleczne | Rzemieślnicza maślanka naturalna bogata w fosfolipidy MFGM z odzysku po zmaślaniu | MUST | MVP |
| **Z-137** | Obieg Serwatki | Ricotta rzemieślnicza: termiczna denaturacja albumin i globulin serwatkowych ($T \ge 85^\circ C$, pH 5.8–6.0) | MUST | MVP |
| **Z-138** | Obieg Serwatki | Ricotta z dodatkiem mleka pełnego (5–10%) — kalkulator podwyższonej wydajności i kremowości | MUST | MVP |
| **Z-139** | Obieg Serwatki | Norweski Brunost / Mysost: odparowanie wody z serwatki (sucha masa z 6% do 80%) w 102–105°C | MUST | MVP |
| **Z-140** | Obieg Serwatki | Brunost: asystent dodatku śmietanki, reakcji Maillarda i szybkiego chłodzenia przeciw piaszczystości | MUST | MVP |
| **Z-141** | Spiżarnia | Kartoteka surowców mlecznych: mleko (krowa, koza, owca), śmietanka, kultury DVI, podpuszczki, sól, CaCl2 | MUST | MVP |
| **Z-142** | Spiżarnia | Automatyczne odliczanie zużytych surowców z magazynu po zatwierdzeniu sesji serowarskiej | MUST | MVP |
| **Z-143** | Paszporty i Etykiety | Generator etykiet PDF (`expo-print`) na krążki sera i osełki masła z kodem QR partii | MUST | MVP |
| **Z-144** | Skaner Kodów QR | Skaner aparatu (`expo-camera`) do natychmiastowego odczytu paszportu partii w dojrzewalni | MUST | MVP |
| **Z-145** | Kalkulator Kosztów | Kalkulator kosztu jednostkowego: surowce + energia chłodzenia/grzania na kg sera lub kostkę masła | MUST | MVP |
| **Z-146** | Kalkulator Uzysku | Wyliczanie wydajności serowarskiej (% Cheese Yield = waga sera / waga mleka * 100%) | MUST | MVP |
| **Z-147** | Apple Watch | Podgląd aktywnych timerów flokulacji, obracania form i dogrzewania skrzepu na zegarku | SHOULD | MVP |
| **Z-148** | Apple Watch | Odznaczanie czynności pielęgnacyjnej (np. „obrócono krążek”) bezpośrednio z nadgarstka | SHOULD | MVP |
| **Z-149** | Live Activity | Widget Dynamic Island i ekranu blokady z odliczaniem flokulacji i faz prasowania | MUST | MVP |
| **Z-150** | Czujniki BLE | Moduł skanera pakietów BLE Manufacturer Data dla czujników RuuviTag i Xiaomi Mijia BLE | COULD | 1.1 |
| **Z-151** | Radar Sensoryczny | Wektorowy radar smaku i tekstury sera SVG: kwasowość, słoność, twardość, maślanowość, umami | SHOULD | MVP |
| **Z-152** | Dostępność | Pełne wsparcie Apple VoiceOver na wszystkich 100% ekranów i kalkulatorów | MUST | MVP |
| **Z-153** | Eksport Danych | Eksport bazy do bezpiecznego pliku JSON oraz tabelaryczny eksport partii do CSV | MUST | MVP |
| **Z-154…Z-240** | Dalsze Wymagania | Wymagania niefunkcjonalne, lokalizacyjne, testowe i platformowe (moduły B5–B8, D1–D4) | MUST/SHOULD| MVP/1.1 |
