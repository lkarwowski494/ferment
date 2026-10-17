#!/usr/bin/env python3
"""
Apps4Brew Studio — Python Truth Oracle for FERMENT Domain (BR-TEST-011)
Generates deterministic test corpus for:
- Batch salinity calculations (RD-26)
- Botulinum safety barrier (RD-27, pH <= 4.60)
- Bigelow model Pasteurization Units (PU/min)
- Q10 temperature kinetics
"""

import json
import os

def calculate_salinity(veg_g: int, water_g: int, salinity_pct: float) -> dict:
    total_g = veg_g + water_g
    raw_salt = (salinity_pct / (100.0 - salinity_pct)) * total_g
    salt_g = round(raw_salt, 1)
    effective_pct = round((salt_g / (total_g + salt_g)) * 100.0, 1)
    return {
        "vegGrams": veg_g,
        "waterGrams": water_g,
        "salinityPct": salinity_pct,
        "expectedTotalMassGrams": total_g,
        "expectedSaltGrams": salt_g,
        "expectedEffectivePct": effective_pct,
    }

def calculate_botulinum(ph: float, hours: int) -> dict:
    if ph <= 4.40:
        status = "SAFE"
        is_safe = True
    elif ph <= 4.60:
        status = "BORDERLINE"
        is_safe = True
    elif hours >= 72:
        status = "CRITICAL_DANGER"
        is_safe = False
    else:
        status = "ACIDIFYING"
        is_safe = True

    return {
        "measuredPh": ph,
        "fermentHours": hours,
        "expectedIsSafe": is_safe,
        "expectedStatus": status,
    }

def calculate_pu_rate(t: float, t_ref: float, z: float) -> dict:
    if t < t_ref - 10.0:
        rate = 0.0
    else:
        exponent = (t - t_ref) / z
        rate = round(10.0 ** exponent, 4)
    return {
        "currentTempC": t,
        "referenceTempC": t_ref,
        "zValueC": z,
        "expectedPuRate": rate,
    }

def calculate_q10_velocity(t: float, culture: str, q10: float) -> dict:
    delta_t = t - 20.0
    multiplier = round(q10 ** (delta_t / 10.0), 2)
    safe_vel = max(0.1, multiplier)
    return {
        "cultureType": culture,
        "ambientTempC": t,
        "q10": q10,
        "expectedVelocityMultiplier": multiplier,
        "expectedSafeVelocity": safe_vel,
    }

def main():
    salinity_cases = []
    for veg in [500, 1000, 2500, 5000]:
        for water in [0, 500, 1000, 2000]:
            for pct in [1.5, 2.0, 2.5, 3.0, 5.0]:
                salinity_cases.append(calculate_salinity(veg, water, pct))

    botulinum_cases = []
    for ph in [3.8, 4.0, 4.40, 4.5, 4.60, 4.65, 5.0, 5.5]:
        for hours in [12, 24, 36, 48, 72, 120]:
            botulinum_cases.append(calculate_botulinum(ph, hours))

    pu_cases = []
    for t in [50.0, 55.0, 60.0, 65.0, 70.0, 75.0]:
        for t_ref, z in [(60.0, 7.0), (60.0, 6.0), (65.0, 8.0), (65.0, 10.0)]:
            pu_cases.append(calculate_pu_rate(t, t_ref, z))

    q10_cases = []
    cultures = [
        ("VEG_LAB", 2.2),
        ("KOMBUCHA_SCOBY", 2.0),
        ("VINEGAR_ACETIC", 1.9),
        ("CHEESE_MESOPHILIC", 2.1),
    ]
    for temp in [12.0, 16.0, 18.0, 20.0, 22.0, 25.0, 28.0, 32.0]:
        for culture, q in cultures:
            q10_cases.append(calculate_q10_velocity(temp, culture, q))

    corpus = {
        "generator": "scripts/gen-ferment-corpus.py",
        "salinityCases": salinity_cases,
        "botulinumCases": botulinum_cases,
        "puRateCases": pu_cases,
        "q10Cases": q10_cases,
    }

    out_dir = os.path.join(os.path.dirname(__file__), "..", "tests", "fixtures")
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "ferment-corpus.json")

    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(corpus, f, indent=2, ensure_ascii=False)

    print(f"Generated {len(salinity_cases)} salinity, {len(botulinum_cases)} botulinum, {len(pu_cases)} PU, {len(q10_cases)} Q10 test cases -> {out_file}")

if __name__ == "__main__":
    main()
