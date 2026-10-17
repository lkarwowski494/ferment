# **SEROWAR — Architektura Techniczna i Projekt Inżynieryjny (System Architecture)**

> **Rola:** Principal System Architect, Lead Software Engineer & Data Modeling Strategist  
> **Projekt:** SEROWAR (Rzemieślnicze Przetwórstwo Mleka) | `com.apps4brew.serowar`  
> **Data opracowania:** 17.10.2026  
> **Status:** **PROPOSED / IN REVIEW (Bramka STOP Architekta)**  
> **Powiązania:** [`docs/scope-contract.md`](file:///C:/Users/lukas/Documents/antigravity/calm-planck/docs/scope-contract.md), [`docs/brd/D2_Architektura_Model_SQLite.md`](file:///C:/Users/lukas/Documents/antigravity/calm-planck/docs/brd/D2_Architektura_Model_SQLite.md), [`docs/brd/D1_Wymagania_Niefunkcjonalne.md`](file:///C:/Users/lukas/Documents/antigravity/calm-planck/docs/brd/D1_Wymagania_Niefunkcjonalne.md)

---

## 1. Wymagania Niefunkcjonalne (NFR) i Profil Obciążeniowy

### 1.1 Wymagania NFR
* **`NFR-OFF` (100% Offline-First):** Zero zewnętrznych serwerów, brak logowania, brak wymogu dostępu do sieci. Koszt krańcowy utrzymania chmury wynosi **$0.00**.
* **`NFR-WYD` (Wydajność):**
  * Czas wykonania każdego zapytania SQL $\le 5\text{ ms}$ dzięki indeksom B-Tree.
  * Płynność interfejsu 60/120 FPS na urządzeniach z systemem iOS i Android.
  * Czas zimnego startu aplikacji $< 800\text{ ms}$.
* **`NFR-DANE` (Integralność i Trwałość):**
  * Transakcyjność ACID (`PRAGMA foreign_keys = ON`, `PRAGMA journal_mode = WAL`).
  * Ochrona przed błędem systemowym iOS `0xDEAD10CC` poprzez `PRAGMA busy_timeout = 5000`.
  * Silnik rotacji 10 kopii zapasowych JSON z sumą kontrolną SHA-256 oraz zasadą *Graceful Rejection*.
* **`NFR-ZEG` (Peryferia i Zegarki):**
  * Resilient timers oparte o czas UTC (`Date.now()`), odporne na ubicie wątków JS w tle przez iOS.
  * Wsparcie dla Live Activity / Dynamic Island na ekranie blokady oraz powiadomień na Apple Watch.

### 1.2 Profil Skali Danych (5-letnia projekcja rzemieślnika)
* Średnia produkcja domowa/zagrodowa: 1–2 partie sera / nabiału tygodniowo ($\sim 75$ partii/rok).
* Pomiary środowiskowe Cave Log: 1–2 wpisy dziennie ($\sim 500$ wpisów/rok).
* Czynności pielęgnacyjne krążków (obracanie, przemywanie, ważenie): $\sim 400$ logów/rok.
* Szacowany rozmiar bazy SQLite po 5 latach: **$< 15\text{ MB}$**.
* Całość bazy mieści się w pamięci podręcznej SQLite cache (`PRAGMA cache_size = -64000` czyli 64 MB), co gwarantuje operacje w pamięci RAM bez wąskich gardeł I/O dysku flash.

---

## 2. Podział Warstwowy: Czysta Architektura (Clean Architecture & Ports & Adapters)

Kod aplikacji podlega bezwzględnej regule jednokierunkowej zależności (Dependency Rule):

```mermaid
flowchart TD
    UI["📱 Warstwa Prezentacji (UI & Ekrany)"]
    Features["🧩 Pionowe Wycinki Funkcjonalne (Feature Slices & Hooks)"]
    Store["⚡ Ephemeral State (Zustand Stores w RAM)"]
    Repo["💾 Repozytoria Danych & Serwisy (SQLite, FileSystem, Notifications)"]
    Domain["🛡️ Czysta Domena (Domain Entities, Math RD, FSM)"]

    UI --> Features
    Features --> Store
    Features --> Repo
    Store --> Repo
    Repo --> Domain
```

> **Złoty Niezmiennik Architektury:**  
> Warstwa czystej logiki domenowej (`src/core/domain/`) składa się wyłącznie z deterministycznego TypeScriptu. **Zakaz importowania** jakichkolwiek bibliotek frameworka (`react`, `react-native`, `expo-*`, `@react-navigation/*`). Logika matematyczna (reguły `RD-01…RD-50`) testowana jest w 1 milisekundę.

---

## 3. Trójwarstwowa Architektura Stanu (3-Tier State Architecture)

Aplikacja rozróżnia trzy ściśle odseparowane poziomy stanu:

1. **Persisted State (Trwały — Baza SQLite na dysku):**
   * *Single Source of Truth:* partie mleczarskie, szczegóły koagulacji, harmonogramy prasowania, solanki, krążki w Cave Log, odczyty mikroklimatu, inwentarz spiżarni, oceny sensoryczne.
   * Dostęp poprzez asynchroniczne repozytoria transakcyjne.
2. **Ephemeral UI State (Ul جمny — Zustand w pamięci RAM):**
   * Aktywny krok w kreatorze warzenia sera, otwarte modale, wartości suwaków kalkulatora przed zatwierdzeniem, filtry listy krążków, stan wyszukiwania.
   * Wykorzystanie memoizowanych selektorów Zustand eliminujących niepotrzebne re-rendery widoków.
3. **Hardware & Peripherals State (Stan Sprzętowy):**
   * Maszyny stanów odliczania flokulacji i Live Activity w ActivityKit.
   * W wersji 1.1: stan połączenia BLE dla czujników RuuviTag/Mijia (`DISCONNECTED` $\rightarrow$ `SCANNING` $\rightarrow$ `CONNECTING` $\rightarrow$ `STREAMING`).

---

## 4. Diagram Relacji Encji (Mermaid ERD — 18 Tabel Mleczarskich)

```mermaid
erDiagram
    batches ||--o| cheese_batch_details : "1:1 koagulacja"
    batches ||--o{ pressing_stages : "1:N prasowanie"
    batches ||--o| brining_logs : "1:1 solanka"
    batches ||--o{ cave_cheese_wheels : "1:N krążki"
    batches ||--o| curd_batch_details : "1:1 twarogi"
    batches ||--o| butter_churn_details : "1:1 masło/ghee"
    batches ||--o| whey_product_details : "1:1 ricotta/brunost"
    batches ||--o| fermented_milk_details : "1:1 jogurt/kefir"
    batches ||--o{ sensory_evaluations : "1:N oceny"
    
    cave_cheese_wheels ||--o{ cave_action_logs : "1:N pielęgnacja"
    cave_cheese_wheels ||--o{ wheel_weight_logs : "1:N ubytek wagi"
    
    batches {
        text id PK
        text batch_number UK
        text category
        text style_name
        integer created_at
        text status
        text notes
    }
    
    cheese_batch_details {
        text batch_id PK,FK
        text milk_type
        text milk_treatment
        real milk_volume_liters
        real cacl2_added_grams
        text rennet_type
        real rennet_imcu_per_ml
        real rennet_volume_ml
        integer flocculation_seconds
        real flocculation_multiplier
        integer target_cut_seconds
    }
    
    pressing_stages {
        text id PK
        text batch_id FK
        integer stage_order
        real target_pressure_kg_cm2
        real weight_applied_kg
        integer duration_minutes
        integer turned_and_flipped
    }
    
    cave_cheese_wheels {
        text id PK
        text batch_id FK
        text wheel_tag UK
        text location_in_cave
        real initial_weight_grams
        real current_weight_grams
        text rind_type
        integer target_aging_days
        real shrinkage_pct
    }
    
    cave_environment_logs {
        text id PK
        integer timestamp
        real temperature_c
        real humidity_rh_pct
        real dew_point_c
        text sensor_source
    }
    
    pantry_inventory {
        text id PK
        text item_name
        text category
        real quantity_available
        text unit
        real cost_per_unit_pln
    }
```

---

## 5. Tabela Kwalifikacji Modułów Inżynieryjnych

| Moduł Inżynieryjny | Status Kwalifikacji | Uzasadnienie Architektoniczne |
| :--- | :---: | :--- |
| **`sqlite-i-migracje-ddl.md`** | **ZAKWALIFIKOWANY (Kluczowy)** | Zapewnia deterministyczny schemat 18 tabel DDL, indeksy B-Tree $<5\text{ ms}$, transakcje ACID i migracje bez utraty danych. |
| **`offline-first-i-synchronizacja.md`** | **ZAKWALIFIKOWANY (Kluczowy)** | Gwarantuje działanie w piwnicach i jaskiniach serowych bez internetu, eksport JSON z SHA-256 i zero kosztów serwerowych. |
| **`zarzadzanie-stanem-i-reaktywnosc.md`** | **ZAKWALIFIKOWANY (Kluczowy)** | Podział stanu na SQLite, Zustand w RAM i FSM; eliminuje re-rendery na iOS/Android. |
| **`modularnosc-i-clean-architecture.md`** | **ZAKWALIFIKOWANY (Kluczowy)** | Izolacja czystej domeny matematycznej (`src/core/domain/`) od frameworków UI. Umożliwia testy w 1 ms. |
| **`peryferia-i-praca-w-tle.md`** | **ZAKWALIFIKOWANY (Kluczowy)** | Resilient timer czasu flokulacji i Live Activity; wzorzec ponownego łączenia BLE przygotowany pod v1.1. |
| **`harvesting-i-synergia-portfolio.md`** | **ZAKWALIFIKOWANY (Kluczowy)** | Reużycie silnika SQLite WAL ze *Słoik* / *Napar*, logowania serii z *Trening* i powiadomień z *Organizer*. |
