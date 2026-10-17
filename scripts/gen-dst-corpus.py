#!/usr/bin/env python3
"""
Apps4Brew Studio — DST & Timezone Truth Oracle (BR-TEST-015)
Generates test vectors for 23h, 24h, 25h days across 7 global timezones:
- Europe/Warsaw (Spring DST, Autumn DST)
- America/New_York (US Spring DST, US Autumn DST)
- UTC (Zero DST)
- Asia/Tokyo (No DST, UTC+9)
- Asia/Kathmandu (Quarter-hour offset UTC+5:45, No DST)
- Pacific/Auckland (Southern hemisphere reverse DST)
- Pacific/Kiritimati (Far eastern date boundary UTC+14)
"""

import json
import os
from datetime import datetime, timezone
import zoneinfo

def analyze_day_duration(tz_name: str, year: int, month: int, day: int) -> dict:
    tz = zoneinfo.ZoneInfo(tz_name)
    start_dt = datetime(year, month, day, 0, 0, 0, tzinfo=tz)
    
    # Next calendar day at 00:00
    if day == 31 and month == 12:
        end_dt = datetime(year + 1, 1, 1, 0, 0, 0, tzinfo=tz)
    elif day >= 28:
        # safely handle month increments via UTC timestamps
        start_utc = start_dt.astimezone(timezone.utc)
        # advance by 28 hours and snap to midnight
        probe_dt = datetime.fromtimestamp(start_utc.timestamp() + 28 * 3600, tz)
        end_dt = datetime(probe_dt.year, probe_dt.month, probe_dt.day, 0, 0, 0, tzinfo=tz)
    else:
        end_dt = datetime(year, month, day + 1, 0, 0, 0, tzinfo=tz)

    duration_seconds = (end_dt.astimezone(timezone.utc) - start_dt.astimezone(timezone.utc)).total_seconds()
    duration_hours = round(duration_seconds / 3600.0, 2)

    return {
        "timezone": tz_name,
        "date": f"{year:04d}-{month:02d}-{day:02d}",
        "startTimestampUtc": int(start_dt.astimezone(timezone.utc).timestamp()),
        "endTimestampUtc": int(end_dt.astimezone(timezone.utc).timestamp()),
        "durationHours": duration_hours,
        "isShortDay23h": duration_hours < 24.0,
        "isLongDay25h": duration_hours > 24.0,
        "isStandardDay24h": duration_hours == 24.0,
    }

def main():
    test_cases = [
        # Europe/Warsaw 2026 transitions
        ("Europe/Warsaw", 2026, 3, 29),  # Spring forward -> 23h
        ("Europe/Warsaw", 2026, 10, 25), # Fall back -> 25h
        ("Europe/Warsaw", 2026, 6, 15),  # Summer standard -> 24h
        ("Europe/Warsaw", 2026, 1, 15),  # Winter standard -> 24h

        # America/New_York 2026 transitions
        ("America/New_York", 2026, 3, 8),   # Spring forward -> 23h
        ("America/New_York", 2026, 11, 1),  # Fall back -> 25h
        ("America/New_York", 2026, 7, 4),   # Standard summer -> 24h

        # UTC
        ("UTC", 2026, 3, 29),
        ("UTC", 2026, 10, 25),

        # Asia/Kathmandu (UTC+5:45)
        ("Asia/Kathmandu", 2026, 3, 29),
        ("Asia/Kathmandu", 2026, 10, 25),

        # Pacific/Auckland (Southern hemisphere reverse)
        ("Pacific/Auckland", 2026, 4, 5),   # Fall back (end of summer) -> 25h
        ("Pacific/Auckland", 2026, 9, 27),  # Spring forward -> 23h

        # Pacific/Kiritimati (UTC+14)
        ("Pacific/Kiritimati", 2026, 1, 1),
        ("Pacific/Kiritimati", 2026, 6, 21),
    ]

    results = [analyze_day_duration(tz, y, m, d) for tz, y, m, d in test_cases]

    out_dir = os.path.join(os.path.dirname(__file__), "..", "tests", "fixtures")
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "dst-corpus.json")

    with open(out_file, "w", encoding="utf-8") as f:
        json.dump({"generator": "scripts/gen-dst-corpus.py", "cases": results}, f, indent=2)

    print(f"Generated {len(results)} DST timezone test cases -> {out_file}")

if __name__ == "__main__":
    main()
