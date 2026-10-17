#!/usr/bin/env python3
"""
Apps4Brew Studio — Python Truth Oracle for SEROWAR / Cheese Domain (W3/DIFF)
Generates deterministic test corpus for:
- Psychrometry (Dew point & VPD in kPa via Magnus-Tetens & Tetens equations)
- Dutch Lever Press Mechanics (Tare force, mechanical advantage, pressure in PSI)
- Brine Acidification Equilibrium (Salt, lactic acid titration, CaCl2 buffer)
- Rennet IMCU Dosage (Milk volume, enzyme strength, volume in ml)
"""

import json
import math
import os

def calculate_dew_point(t: float, rh: float) -> float:
    a = 17.27
    b = 237.7
    alpha = (a * t) / (b + t) + math.log(rh / 100.0)
    dp = (b * alpha) / (a - alpha)
    return round(dp, 1)

def calculate_vpd(t: float, rh: float) -> dict:
    es = 0.61078 * math.exp((17.27 * t) / (t + 237.3))
    ea = es * (rh / 100.0)
    vpd = max(0.0, es - ea)
    return {
        "esKPa": round(es, 3),
        "eaKPa": round(ea, 3),
        "vpdKPa": round(vpd, 3),
    }

def calculate_dutch_lever(arm_len: float, mold_dist: float, arm_weight: float, hung_weight: float, mold_dia: float) -> dict:
    safe_arm = max(10.0, arm_len)
    safe_mold = max(5.0, min(safe_arm, mold_dist))
    safe_arm_mass = max(0.0, arm_weight)
    safe_weight = max(0.0, hung_weight)
    safe_dia = max(5.0, mold_dia)

    ratio = round(safe_arm / safe_mold, 2)
    tare_force = round((safe_arm_mass * (safe_arm / 2.0)) / safe_mold, 2)
    weight_force = round(safe_weight * ratio, 2)
    total_force = round(weight_force + tare_force, 2)

    radius = safe_dia / 2.0
    area = round(math.pi * radius * radius, 1)
    pressure_kg_cm2 = round(total_force / area, 3)
    pressure_psi = round(pressure_kg_cm2 * 14.2233, 2)

    return {
        "armTotalLengthCm": arm_len,
        "moldDistanceCm": mold_dist,
        "armSelfWeightKg": arm_weight,
        "weightHungKg": hung_weight,
        "moldDiameterCm": mold_dia,
        "expectedRatio": ratio,
        "expectedTareForceKg": tare_force,
        "expectedWeightForceKg": weight_force,
        "expectedTotalForceKg": total_force,
        "expectedAreaCm2": area,
        "expectedPressurePsi": pressure_psi,
    }

def calculate_brine(water_l: float, init_ph: float, tgt_ph: float, acid_pct: float, sal_pct: float) -> dict:
    water = max(0.5, water_l)
    cur_ph = max(4.0, min(9.0, init_ph))
    tgt = max(4.8, min(5.6, tgt_ph))
    acid_conc = max(10.0, min(100.0, acid_pct))
    sal = max(10.0, min(26.0, sal_pct))

    salt_kg = round((water * sal) / (100.0 - sal), 2)
    delta_ph = max(0.0, cur_ph - tgt)
    base_ml_l = 2.2 * (80.0 / acid_conc)
    ml_per_l = (delta_ph / 2.3) * base_ml_l
    acid_ml = round(water * ml_per_l, 1)
    cacl2_g = round(water * 2.0, 1)

    return {
        "waterLiters": water_l,
        "initialPh": init_ph,
        "targetPh": tgt_ph,
        "acidPct": acid_pct,
        "salinityPct": sal_pct,
        "expectedSaltKg": salt_kg,
        "expectedAcidMl": acid_ml,
        "expectedCacl2Grams": cacl2_g,
    }

def calculate_rennet(milk_l: float, imcu_target: float, rennet_strength: float) -> dict:
    milk = max(0.1, milk_l)
    target = max(10.0, imcu_target)
    strength = max(10.0, rennet_strength)
    volume_ml = round((milk * target) / strength, 2)

    return {
        "milkLiters": milk_l,
        "targetImcu": imcu_target,
        "rennetStrength": rennet_strength,
        "expectedVolumeMl": volume_ml,
    }

def generate_corpus():
    psychrometry_cases = []
    # Test across cave temperature grid 8C to 16C and humidity 70% to 98%
    for temp in [8.0, 10.0, 11.5, 12.0, 13.5, 15.0, 18.0]:
        for rh in [70.0, 75.0, 80.0, 85.0, 88.0, 92.0, 95.0, 98.0]:
            dp = calculate_dew_point(temp, rh)
            vpd = calculate_vpd(temp, rh)
            psychrometry_cases.append({
                "temperatureC": temp,
                "humidityRhPct": rh,
                "expectedDewPointC": dp,
                "expectedEsKPa": vpd["esKPa"],
                "expectedEaKPa": vpd["eaKPa"],
                "expectedVpdKPa": vpd["vpdKPa"],
            })

    press_cases = [
        calculate_dutch_lever(60, 20, 2.0, 5.0, 14),
        calculate_dutch_lever(80, 20, 3.0, 8.0, 16),
        calculate_dutch_lever(50, 15, 1.5, 3.5, 12),
        calculate_dutch_lever(100, 25, 4.0, 10.0, 20),
        calculate_dutch_lever(40, 20, 1.0, 0.0, 10), # Only arm weight
        calculate_dutch_lever(75, 25, 2.5, 6.0, 15),
    ]

    brine_cases = [
        calculate_brine(5.0, 7.5, 5.2, 80.0, 20.0),
        calculate_brine(10.0, 7.2, 5.2, 80.0, 18.0),
        calculate_brine(3.0, 7.8, 5.0, 80.0, 22.0),
        calculate_brine(8.0, 5.0, 5.2, 80.0, 20.0), # pH already below target
        calculate_brine(2.0, 8.0, 5.3, 50.0, 15.0), # Lower acid conc
    ]

    rennet_cases = [
        calculate_rennet(10.0, 30.0, 200.0),
        calculate_rennet(20.0, 35.0, 220.0),
        calculate_rennet(5.0, 25.0, 150.0),
        calculate_rennet(50.0, 40.0, 260.0),
        calculate_rennet(100.0, 30.0, 200.0),
    ]

    corpus = {
        "version": "1.0-cheese",
        "description": "Apps4Brew Studio Scientific Truth Oracle for Cheese & Dairy Crafting",
        "psychrometryCases": psychrometry_cases,
        "pressCases": press_cases,
        "brineCases": brine_cases,
        "rennetCases": rennet_cases,
    }

    out_path = os.path.join(os.path.dirname(__file__), "..", "tests", "fixtures", "dairy-corpus.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(corpus, f, indent=2, ensure_ascii=False)

    print(f"Generated {len(psychrometry_cases)} psychrometry cases, {len(press_cases)} press cases, {len(brine_cases)} brine cases, {len(rennet_cases)} rennet cases in {out_path}")

if __name__ == "__main__":
    generate_corpus()
