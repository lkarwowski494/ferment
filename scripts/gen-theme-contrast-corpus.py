#!/usr/bin/env python3
"""
Apps4Brew Studio — WCAG 2.1 Color Contrast Truth Oracle (BR-TEST-014)
Calculates relative luminance and contrast ratios for semantic UI color pairs.
- Normal text: >= 4.5:1 (AA) or >= 7.0:1 (AAA)
- Large/bold text & UI components (buttons, tabs, chips): >= 3.0:1 (AA)
"""

import json
import math
import os

def hex_to_rgb(hex_code: str) -> tuple[float, float, float]:
    hex_clean = hex_code.lstrip("#")
    if len(hex_clean) == 3:
        hex_clean = "".join(c * 2 for c in hex_clean)
    r = int(hex_clean[0:2], 16) / 255.0
    g = int(hex_clean[2:4], 16) / 255.0
    b = int(hex_clean[4:6], 16) / 255.0
    return r, g, b

def srgb_channel_to_linear(c: float) -> float:
    if c <= 0.04045:
        return c / 12.92
    else:
        return ((c + 0.055) / 1.055) ** 2.4

def relative_luminance(hex_code: str) -> float:
    r, g, b = hex_to_rgb(hex_code)
    r_lin = srgb_channel_to_linear(r)
    g_lin = srgb_channel_to_linear(g)
    b_lin = srgb_channel_to_linear(b)
    return 0.2126 * r_lin + 0.7152 * g_lin + 0.0722 * b_lin

def contrast_ratio(hex1: str, hex2: str) -> float:
    lum1 = relative_luminance(hex1)
    lum2 = relative_luminance(hex2)
    l_max = max(lum1, lum2)
    l_min = min(lum1, lum2)
    return round((l_max + 0.05) / (l_min + 0.05), 2)

def main():
    # Studio Theme Pairs used across screens
    pairs = [
        # Large / bold button text & controls: WCAG AA >= 3.0:1
        {"name": "btn_primary_white_on_emerald", "foreground": "#ffffff", "background": "#059669", "minTarget": 3.0},
        {"name": "btn_danger_white_on_red", "foreground": "#ffffff", "background": "#dc2626", "minTarget": 3.0},
        {"name": "chip_active_emerald_on_dark_emerald", "foreground": "#34d399", "background": "#065f46", "minTarget": 3.0},
        {"name": "segmented_active_white_on_emerald", "foreground": "#ffffff", "background": "#059669", "minTarget": 3.0},
        # Standard body & title text: WCAG AA >= 4.5:1, AAA >= 7.0:1
        {"name": "body_text_on_dark_bg", "foreground": "#f8fafc", "background": "#0b1120", "minTarget": 7.0},
        {"name": "secondary_text_on_dark_bg", "foreground": "#94a3b8", "background": "#0b1120", "minTarget": 4.5},
        {"name": "alert_title_white_on_dark_red", "foreground": "#ffffff", "background": "#7f1d1d", "minTarget": 7.0},
        {"name": "alert_body_light_red_on_dark_red", "foreground": "#fca5a5", "background": "#7f1d1d", "minTarget": 4.5},
    ]

    results = []
    for p in pairs:
        ratio = contrast_ratio(p["foreground"], p["background"])
        passes = ratio >= p["minTarget"]
        results.append({
            "name": p["name"],
            "foreground": p["foreground"],
            "background": p["background"],
            "calculatedRatio": ratio,
            "minRequired": p["minTarget"],
            "passes": passes,
        })

    out_dir = os.path.join(os.path.dirname(__file__), "..", "tests", "fixtures")
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "theme-contrast-corpus.json")

    with open(out_file, "w", encoding="utf-8") as f:
        json.dump({"generator": "scripts/gen-theme-contrast-corpus.py", "pairs": results}, f, indent=2)

    print(f"Generated {len(results)} theme contrast pairs -> {out_file}")

if __name__ == "__main__":
    main()
