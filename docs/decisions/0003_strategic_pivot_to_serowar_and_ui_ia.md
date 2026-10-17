# 0003: Strategiczny Pivot do SEROWAR (100% Przetwórstwo Mleczne) oraz Architektura Informacji UI

* **Data decyzji:** 17.10.2026
* **Status:** ZAAKCEPTOWANE
* **Decydent:** Łukasz (Właściciel)
* **Projekt:** SEROWAR (`calm-planck`)
* **Powiązanie z rejestrem decyzji:** `DEC-BA-01`, `DEC-BA-02`, `DEC-UX-01`
* **Dokumenty powiązane:** [`docs/brd/00b_Jedna_lista_decyzji.md`](file:///C:/Users/lukas/Documents/antigravity/calm-planck/docs/brd/00b_Jedna_lista_decyzji.md), [`docs/32-wzorce-interakcji.md`](file:///C:/Users/lukas/Documents/antigravity/calm-planck/docs/32-wzorce-interakcji.md), [`docs/ux/blueprint-ekranow.md`](file:///C:/Users/lukas/Documents/antigravity/calm-planck/docs/ux/blueprint-ekranow.md)

---

## 1. Kontekst i Uzasadnienie

W trakcie analizy cyklu życia produktu (Rola 1: Lead BA & Product Discovery) poddano weryfikacji pierwotne założenie łączenia serowarstwa zagrodowego z domowymi kiszonkami warzywnymi i kombuchą. Zastosowanie zasady **The Anti-Combine Principle (Suite Decomposition)** wykazało:
1. Rozbieżność grup docelowych (JTBD) — serowar zagrodowy potrzebuje kalkulatora IMCU, leżakowania krążków w jaskini przez 6 miesięcy i prasy o nacisku 3 kg/cm², podczas gdy kiszenie kapusty czy fermentacja kombuchy to odrębna mikrobiologia roślinna.
2. Rozmycie pozycjonowania w App Store (ASO) — połączenie osłabiało autorytet marki w kategorii profesjonalnego serowarstwa rzemieślniczego.
3. Ergonomia wykonawcza — procesy serowarskie i masielnicze charakteryzują się ścisłą synergią surowca (mleko $\rightarrow$ śmietanka na masło $\rightarrow$ skrzep na ser/twaróg $\rightarrow$ serwatka na ricottę i norweski brunost).

---

## 2. Podjęte Decyzje Strategiczne i Architektoniczne

### **DEC-BA-01: Nazwa Marki i Pozycjonowanie w App Store**
* **Decyzja:** Wybór **Opcji A**.
* **Nazwa marki:** **SEROWAR: Rzemieślnicze Przetwórstwo Mleka** (ang. *Serowar: Artisan Cheese & Dairy Craft* / *DairyLog*).
* **Bundle ID:** `com.apps4brew.serowar`.

### **DEC-BA-02: Czyste Cięcie Zakresu — 100% Przetwórstwo Mleczne**
* **Decyzja:** Wybór **Opcji A**.
* **Zakres:** Całkowite, bezwzględne wyczyszczenie fermentacji roślinnych (kiszonek, kombuchy, octów) z kodu, bazy danych SQLite i dokumentacji BRD.
* **Rozszerzenie mleczarskie:** Sery podpuszczkowe, kwasowe, twarogi klinkowe, sery świeże labneh/paneer, masielnictwo rzemieślnicze i ghee, napoje fermentowane (jogurt termofilny, kefir tradycyjny, maślanka) oraz zamknięty obieg serwatki (termiczna Ricotta i norweski karmelizowany Brunost).

### **DEC-UX-01: Architektura Informacji i 4 Zakładki Główne (Tab Bar)**
* **Decyzja:** Wybór **Opcji A**.
* **Układ Zakładek Dolnego Paska:**
  1. 🧀 **Serowar** (Kalkulator mleka i podpuszczki IMCU, stoper flokulacji, asystent obróbki skrzepu, prasa serowarska, solanka)
  2. 🧈 **Nabiał & Kuchnia** (Twarogi klinkowe, sery świeże, masielnictwo, klarowanie ghee, napoje fermentowane, obieg serwatki Ricotta/Brunost)
  3. 🏔️ **Dojrzewalnia (Cave Log)** (Kartoteka krążków w leżakowaniu, harmonogram obracania i mazi, psychrometria punktu rosy, odczyt BLE)
  4. 📦 **Spiżarnia & Wiedza** (Spiżarnia surowców, paszporty partii, generator etykiet PDF z kodami QR, kalkulator kosztów i % yield, Szkoła Mleczarstwa, Cheese Doctor, Ustawienia)
* **Uzasadnienie ergonomiczne:** 4 duże przyciski w strefie kciuka (Thumb Zone) o powierzchni min. 48×48 pt gwarantują bezbłędną obsługę w warunkach kuchennych („Hands in whey”).
