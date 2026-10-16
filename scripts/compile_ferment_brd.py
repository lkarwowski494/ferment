# -*- coding: utf-8 -*-
"""
Compiler for FERMENT BRD 0.1 - Complete Master Edition
Apps4Brew Studio | October 2026
"""
import glob
import os
import sys

def main():
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    brd_dir = os.path.join(root_dir, "docs", "brd")
    
    # Ordered chapters
    order = [
        "00_START.md",
        "00b_Jedna_lista_decyzji.md",
        "00c_Sprzecznosci_i_weryfikacja.md",
        "A1_rozdz_1_3_Wizja_Problem_Persony.md",
        "A2_rozdz_4_6_1_Rynek_Przychod_Zakres.md",
        "A3a_rozdz_6_2_Tabela_zakresu_cz1.md",
        "A3b_rozdz_6_2_Tabela_zakresu_cz2.md",
        "A3c_Etapy_Naklad_Warianty.md",
        "A4_rozdz_13_15_KPI_Marketing_ASO.md",
        "B1_Narzedzia_Kalkulator_Serowara.md",
        "B2_Narzedzia_Obrobka_Skrzepu_Prasowanie.md",
        "B3_Narzedzia_Solenie_i_Solanki.md",
        "B4_Narzedzia_Cave_Log_Dozor_Dojrzewania.md",
        "B5_Narzedzia_Kiszonki_Kimchi_Zakwasy.md",
        "B6_Narzedzia_Kombucha_i_Octy.md",
        "B7_Narzedzia_Spizarnia_Naczynia_Etykiety.md",
        "B8_Narzedzia_Zegarki_LiveActivity_Sensory.md",
        "C1_Nauka_Szkola_Serowarstwa_i_Fermentacji.md",
        "C2_Reguly_Dziedzinowe_Serowarstwo.md",
        "C3_Reguly_Dziedzinowe_Kiszonki_i_Napoje.md",
        "C4_Proces_Tresci_i_Decyzje_Badacza.md",
        "D1_Wymagania_Niefunkcjonalne.md",
        "D2_Architektura_Model_SQLite.md",
        "D3_Rejestr_Ryzyk_i_Pytania.md",
        "D4_Strategia_Testow_Jakosci.md",
    ]
    
    source_files = [os.path.join(brd_dir, f) for f in order]
    
    for f in source_files:
        if not os.path.exists(f):
            print(f"[BŁĄD] Brak pliku: {f}")
            sys.exit(1)
            
    print(f"Znaleziono {len(source_files)} modularnych rozdziałów BRD.")
    
    combined_content = []
    combined_content.append("# FERMENT (SER I FLORA / MIKROBIOLOGIA DOMOWA)\n")
    combined_content.append("## KOMPLETNY BUSINESS REQUIREMENTS DOCUMENT (BRD) — WYDANIE 0.1 MASTER\n")
    combined_content.append("> Apps4Brew Studio Engineering Standard | Data opracowania: Październik 2026\n\n---\n\n")

    for f in source_files:
        basename = os.path.basename(f)
        with open(f, 'r', encoding='utf-8') as fh:
            content = fh.read().strip()
        combined_content.append(f"\n\n<!-- ========================================== -->\n")
        combined_content.append(f"<!-- ROZPOCZĘCIE ROZDZIAŁU: {basename} -->\n")
        combined_content.append(f"<!-- ========================================== -->\n\n")
        combined_content.append(content)
        combined_content.append("\n\n---\n")

    full_text = "".join(combined_content)
    
    target_file = os.path.join(root_dir, "FERMENT_BRD_Kompletne_Wydanie.md")
    with open(target_file, 'w', encoding='utf-8') as out:
        out.write(full_text)
        
    chars_with_spaces = len(full_text)
    words = len(full_text.split())
    # Standardowa strona maszynopisu (standard wydawniczy): 1800 znaków ze spacjami
    std_pages_1800 = chars_with_spaces / 1800.0
    # Standard formatu A4 w czytniku (ok. 250 słów na stronę)
    std_pages_words = words / 250.0
    
    print("\n" + "="*60)
    print("RAPORT OBJĘTOŚCI I STATYSTYK BRD:")
    print("="*60)
    print(f"Plik wyjściowy: {target_file}")
    print(f"Liczba modularnych rozdziałów: {len(source_files)}")
    print(f"Liczba znaków ze spacjami:     {chars_with_spaces:,}")
    print(f"Liczba słów:                  {words:,}")
    print(f"Objętość wg standardu 1800 zzs: {std_pages_1800:.1f} stron znormalizowanych")
    print(f"Objętość wg standardu 250 słów: {std_pages_words:.1f} stron A4")
    print("="*60 + "\n")

if __name__ == '__main__':
    main()
