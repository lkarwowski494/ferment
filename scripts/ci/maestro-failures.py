#!/usr/bin/env python3
"""
Apps4Brew Studio — Maestro CI Artifact & Failure Triaging Parser (Wzorzec T19)
Parses Maestro E2E test execution output and generates a clean Markdown failure report
suitable for GitHub Actions Step Summary ($GITHUB_STEP_SUMMARY).
"""

import sys
import os
import re

def parse_maestro_log(log_text: str) -> dict:
    failures = []
    current_flow = "Unknown Flow"
    current_step = None

    for line in log_text.splitlines():
        flow_match = re.search(r"Running flow:\s*(.*)", line, re.IGNORECASE)
        if flow_match:
            current_flow = flow_match.group(1).strip()

        step_match = re.search(r"(\[[0-9]+\]|\s*-\s*)(tapOn|assertVisible|assertNotVisible|inputText|launchApp|back)\s*:?\s*(.*)", line)
        if step_match:
            current_step = f"{step_match.group(2)} {step_match.group(3)}".strip()

        if "FAILED" in line or "Assertion failed" in line or "Element not found" in line:
            failures.append({
                "flow": current_flow,
                "step": current_step or "Unknown step",
                "error": line.strip(),
            })

    return {
        "total_failures": len(failures),
        "failures": failures,
    }

def format_markdown_summary(parsed: dict) -> str:
    if parsed["total_failures"] == 0:
        return "###  Maestro E2E: All User Flows Passed Successfully\n\nNo assertion errors detected in flow execution."

    md = [
        "###  Maestro E2E Failure Summary\n",
        f"**Failed Assertions Count:** {parsed['total_failures']}\n",
        "| Flow | Failed Step | Error Message |",
        "| :--- | :--- | :--- |",
    ]

    for f in parsed["failures"]:
        md.append(f"| `{f['flow']}` | `{f['step']}` | `{f['error']}` |")

    md.append("\n> [!NOTE]\n> Detailed view hierarchy and failure screenshot attached as job artifacts.")
    return "\n".join(md)

def main():
    if len(sys.argv) > 1 and os.path.exists(sys.argv[1]):
        with open(sys.argv[1], "r", encoding="utf-8") as f:
            log_content = f.read()
    else:
        log_content = sys.stdin.read() if not sys.stdin.isatty() else ""

    parsed = parse_maestro_log(log_content)
    md_report = format_markdown_summary(parsed)

    summary_file = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary_file:
        with open(summary_file, "a", encoding="utf-8") as f:
            f.write("\n" + md_report + "\n")
    else:
        print(md_report)

    if parsed["total_failures"] > 0:
        sys.exit(1)

if __name__ == "__main__":
    main()
