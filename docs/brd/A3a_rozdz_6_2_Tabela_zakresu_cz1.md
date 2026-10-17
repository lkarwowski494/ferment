# **SEROWAR BRD 0.1 — Tabela Zakresu: Część 1 (Serowarstwo Podpuszczkowe i Cave Log)**

Tabela definiuje 120 wymagań obszaru serowarskiego z przypisanymi identyfikatorami Z-001…Z-120 oraz etapami wdrożenia (**MVP / 1.1 / 1.2 / 2.x / Badanie / Nigdy**).

| ID | Moduł | Funkcjonalność / Wymaganie | Priorytet | Etap |
| :--- | :--- | :--- | :--- | :--- |
| **Z-001** | Kalkulator Mleka | Wybór gatunku mleka: krowie, kozie, owcze, bawole z domyślnym profilem tłuszcz/białko | MUST | MVP |
| **Z-002** | Kalkulator Mleka | Wybór obróbki termicznej: surowe zagrodowe, pasteryzowane niskotemperaturowo (LTLT/HTST), sklepowe mikrofiltrowane | MUST | MVP |
| **Z-003** | Kalkulator Mleka | Twarda blokada wyboru mleka UHT z natychmiastowym komunikatem edukacyjnym o denaturacji miceli | MUST | MVP |
| **Z-004** | Kalkulator Wapnia | Obliczanie dawki chlorku wapnia ($CaCl_2$) w proszku bezwodnym (g) lub w roztworze płynnym 33% (ml) | MUST | MVP |
| **Z-005** | Kalkulator Kultur | Baza kultur starterowych: Mezofilne (typ O, typ LD), Termofilne (typ T, typ jogurtowy/włoski) | MUST | MVP |
| **Z-006** | Kalkulator Kultur | Przeliczanie dawek kultur DVI (Direct Vat Inoculation) na litry mleka wg specyfikacji producenta | MUST | MVP |
| **Z-007** | Kalkulator Kultur | Asystent rotacji szczepów mezofilnych w celu zapobiegania atakom bakteriofagów | SHOULD | 1.1 |
| **Z-008** | Kalkulator Podpuszczki | Konwerter jednostek siły podpuszczki: IMCU/ml, IMCU/g, tradycyjna skala 1:X (np. 1:10 000) | MUST | MVP |
| **Z-009** | Kalkulator Podpuszczki | Obliczanie dokładnej objętości (ml lub krople) / wagi podpuszczki dla zadanej objętości mleka | MUST | MVP |
| **Z-010** | Kalkulator Podpuszczki | Instrukcja rozcieńczania podpuszczki w niechlorowanej, chłodnej wodzie (10x objętość) przed zadaniem | MUST | MVP |
| **Z-011** | Koagulacja i Flokulacja | Interaktywny stoper flokulacji (metoda wirującej miseczki Berridge'a) z rejestracją punktu $t_f$ | MUST | MVP |
| **Z-012** | Koagulacja i Flokulacja | Kalkulator całkowitego czasu koagulacji oparty o współczynnik flokulacji $M$ ($t_{cut} = t_f \times M$) | MUST | MVP |
| **Z-013** | Koagulacja i Flokulacja | Baza sugerowanych mnożników flokulacji dla stylów serów (alpejskie 2.0x, gouda 3.0x, camembert 5.0x) | MUST | MVP |
| **Z-014** | Koagulacja i Flokulacja | Test „czystego złomu” (Clean Break Test) — przewodnik sensoryczny z weryfikacją przezierności serwatki | MUST | MVP |
| **Z-015** | Obróbka Skrzepu | Wybór docelowego rozmiaru ziarna skrzepu (orzech włoski, kukurydza, groch, ziarno pszenicy) | MUST | MVP |
| **Z-016** | Obróbka Skrzepu | Stoper odpoczynku skrzepu po cięciu (5–10 min) przed rozpoczęciem mieszania | MUST | MVP |
| **Z-017** | Dogrzewanie Gęstwy | Asystent rampy temperaturowej dogrzewania (limit max 1°C na 2 minuty zapobiegający zeszkleniu ziarna) | MUST | MVP |
| **Z-018** | Przemywanie Gęstwy | Kalkulator odlewania serwatki i dolewania gorącej wody dla serów płukanych (Gouda, Edam) | MUST | MVP |
| **Z-019** | Prasowanie Sera | Kalkulator nacisku prasy: przeliczanie masy obciążników (kg) na realny nacisk powierzchniowy ($kg/cm^2$ i PSI) | MUST | MVP |
| **Z-020** | Prasowanie Sera | Harmonogram etapów prasowania (np. 15 min 0.5 kg/cm², 30 min 1.0 kg/cm², 2h 2.0 kg/cm², 12h 3.0 kg/cm²) | MUST | MVP |
| **Z-021** | Prasowanie Sera | Przypomnienia o odwracaniu sera w formie i wyrównywaniu chusty serowarskiej | MUST | MVP |
| **Z-022** | Kąpiel Solankowa | Kalkulator nasyconej solanki serowarskiej: woda, sól (18–22%), $CaCl_2$ (0.1–0.2%) i regulacja pH (5.2–5.4) | MUST | MVP |
| **Z-023** | Kąpiel Solankowa | Wyliczanie czasu kąpieli w solance na podstawie wagi krążka (godziny na kg) i geometrii (grubość/średnica) | MUST | MVP |
| **Z-024** | Kąpiel Solankowa | Przypomnienie o połowicznym obrocie pływającego krążka w solance w połowie czasu kąpieli | MUST | MVP |
| **Z-025** | Solenie z Ręki | Kalkulator solenia na sucho (1.5–2.5% masy sera) z podziałem na aplikacje wielodniowe | MUST | MVP |
| **Z-026** | Cave Log: Kartoteka | Rejestracja nowego krążka sera: numer partii, styl, waga początkowa, data solenia, przewidywany wiek | MUST | MVP |
| **Z-027** | Cave Log: Mikroklimat | Zapisywanie pomiarów temperatury (°C) i wilgotności względnej (% RH) dojrzewalni | MUST | MVP |
| **Z-028** | Cave Log: Pielęgnacja | Harmonogram obracania krążków (początkowo codziennie, potem 2x w tygodniu, potem 1x w tygodniu) | MUST | MVP |
| **Z-029** | Cave Log: Skórka Maziowa | Protokół pielęgnacji Brevibacterium linens (przemywanie roztworem solankowym z drożdżami) | SHOULD | MVP |
| **Z-030** | Cave Log: Sery Pleśniowe | Protokół dojrzewania Penicillium camemberti/candidum (kontrola aksamitnego porostu białego) | SHOULD | MVP |
| **Z-031** | Cave Log: Sery Niebieskie | Harmonogram nakłuwania igłami stalowymi (piercing) dla dopływu tlenu do Penicillium roqueforti | SHOULD | MVP |
| **Z-032** | Cave Log: Zabezpieczanie | Rejestracja zabiegów zabezpieczających: woskowanie parafiną serowarską, powłoka polioctanowa, olej lniany | MUST | MVP |
| **Z-033** | Cave Log: Ubytek Wagi | Śledzenie kurczenia się krążka (% shrinkage) w czasie leżakowania wraz z wykresem dynamiki | MUST | MVP |
| **Z-034** | Cave Log: Alerty | Alert wysuszenia skórki (RH < 80%) oraz alert ryzyka kondensacji kropelkowej (punkt rosy) | MUST | MVP |
| **Z-035** | Dojrzewanie Propionowe | Protokół komory cieplnej dla serów szwajcarskich (20–24°C przez 3–4 tygodnie na rozwój oczek CO2) | COULD | 1.1 |
| **Z-036…Z-120** | Pozostałe Serowarstwo | Dalsze szczegółowe reguły serowarstwa zagrodowego (opisane szczegółowo w modułach B1–B4) | SHOULD | MVP/1.1 |
