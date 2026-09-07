"""Generate images/preview.svg for the README (static, no JS)."""
from __future__ import annotations

import math
from pathlib import Path

CX, CY = 200, 200
R_OUT, R_MID, R_IN = 180, 115, 50
GREEN = "#10b981"
WHITE = "#ffffff"
INK = "#374151"
MUTED = "#6b7280"
STROKE = "#e5e7eb"
SELECT = "#3b82f6"
NOW = "#ff6b6b"
HEADER = "#212121"
OK_BG = "#d1fae5"
OK_FG = "#059669"

BANDS = [
    (0, (R_MID + R_OUT) / 2, R_OUT),
    (15, R_MID, (R_MID + R_OUT) / 2),
    (30, (R_IN + R_MID) / 2, R_MID),
    (45, R_IN, (R_IN + R_MID) / 2),
]


def sector(i: int, n: int, r_in: float, r_out: float) -> str:
    a0 = (i * 360 / n - 90) * math.pi / 180
    a1 = ((i + 1) * 360 / n - 90) * math.pi / 180
    x1, y1 = CX + r_in * math.cos(a0), CY + r_in * math.sin(a0)
    x2, y2 = CX + r_out * math.cos(a0), CY + r_out * math.sin(a0)
    x3, y3 = CX + r_out * math.cos(a1), CY + r_out * math.sin(a1)
    x4, y4 = CX + r_in * math.cos(a1), CY + r_in * math.sin(a1)
    large = 0 if (a1 - a0) <= math.pi else 1
    return (
        f"M {x1:.2f} {y1:.2f} L {x2:.2f} {y2:.2f} "
        f"A {r_out} {r_out} 0 {large} 1 {x3:.2f} {y3:.2f} "
        f"L {x4:.2f} {y4:.2f} A {r_in} {r_in} 0 {large} 0 {x1:.2f} {y1:.2f}"
    )


def text_pos(i: int, n: int, r: float) -> tuple[float, float]:
    a = ((i + 0.5) * 360 / n - 90) * math.pi / 180
    return CX + r * math.cos(a), CY + r * math.sin(a)


def rot(i: int, n: int) -> float:
    deg = (i + 0.5) * (360 / n) - 90
    if deg > 90 or deg < -90:
        deg += 180
    return deg


def pad(n: int) -> str:
    return f"{n:02d}"


def demo_on() -> set[tuple[int, int]]:
    on: set[tuple[int, int]] = set()
    for hour in list(range(6, 9)) + [11] + list(range(18, 22)):
        for minute in (0, 15, 30, 45):
            on.add((hour, minute))
    on.add((12, 0))
    on.add((12, 30))
    return on


def clock(on: set[tuple[int, int]], mode: int, selected: int | None, now_h: int, now_m: int) -> str:
    parts: list[str] = []
    parts.append(
        f'<circle cx="{CX}" cy="{CY}" r="{R_OUT}" fill="none" stroke="{STROKE}" stroke-width="2"/>'
    )
    parts.append(
        f'<circle cx="{CX}" cy="{CY}" r="{R_MID}" fill="none" stroke="#d1d5db" stroke-width="1.5"/>'
    )
    parts.append(
        f'<circle cx="{CX}" cy="{CY}" r="{R_IN}" fill="none" stroke="{STROKE}" stroke-width="2"/>'
    )
    for i in range(24):
        a = (i * 360 / 24 - 90) * math.pi / 180
        x1, y1 = CX + R_IN * math.cos(a), CY + R_IN * math.sin(a)
        x2, y2 = CX + R_OUT * math.cos(a), CY + R_OUT * math.sin(a)
        parts.append(
            f'<line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" '
            f'stroke="{STROKE}" stroke-width="1"/>'
        )
    def label(hour: int, radius: float, text: str, size: int, fill: str) -> None:
        tx, ty = text_pos(hour, 24, radius)
        rdeg = rot(hour, 24)
        parts.append(
            f'<g transform="translate({tx:.2f} {ty:.2f}) rotate({rdeg:.2f})">'
            f'<text x="0" y="0" text-anchor="middle" dy="0.35em" font-size="{size}" '
            f'font-weight="700" style="direction:ltr" fill="{fill}">{text}</text></g>'
        )

    if mode == 15:
        for hour in range(24):
            for minute, inner, outer in BANDS:
                active = (hour, minute) in on
                selected_hour = selected == hour
                parts.append(
                    f'<path d="{sector(hour, 24, inner, outer)}" '
                    f'fill="{GREEN if active else WHITE}" '
                    f'stroke="{SELECT if selected_hour else STROKE}" '
                    f'stroke-width="{2.5 if selected_hour else 1}"/>'
                )
                if selected_hour and minute != 0:
                    label(hour, (inner + outer) / 2, str(minute), 9, "#ffffff" if active else INK)
        outer_label_r = (BANDS[0][1] + BANDS[0][2]) / 2
        for hour in range(24):
            all_on = all((hour, minute) in on for minute in (0, 15, 30, 45))
            label(hour, outer_label_r, pad(hour), 11, "#ffffff" if all_on else INK)
    else:
        rings = (
            (0, (0, 15), R_MID, R_OUT),
            (30, (30, 45), R_IN, R_MID),
        )
        for hour in range(24):
            for pair, minutes, inner, outer in rings:
                active = all((hour, minute) in on for minute in minutes)
                fill = GREEN if active else (WHITE if pair == 0 else "#f8f9fa")
                parts.append(
                    f'<path d="{sector(hour, 24, inner, outer)}" fill="{fill}" '
                    f'stroke="{STROKE}" stroke-width="1"/>'
                )
            hour_on = all((hour, minute) in on for minute in (0, 15))
            half_on = all((hour, minute) in on for minute in (30, 45))
            label(hour, (R_MID + R_OUT) / 2, f"{pad(hour)}:00", 11, "#ffffff" if hour_on else INK)
            label(hour, (R_IN + R_MID) / 2, f"{pad(hour)}:30", 9, "#ffffff" if half_on else MUTED)
    if mode == 15:
        band = next(item for item in BANDS if item[0] == now_m)
        highlight = sector(now_h, 24, band[1], band[2])
        sw = 4
    else:
        if now_m < 30:
            highlight = sector(now_h, 24, R_MID, R_OUT)
        else:
            highlight = sector(now_h, 24, R_IN, R_MID)
        sw = 5
    parts.append(
        f'<path d="{highlight}" fill="none" stroke="{NOW}" stroke-width="{sw}" '
        f'stroke-linejoin="round"/>'
    )
    parts.append(f'<circle cx="{CX}" cy="{CY}" r="{R_IN}" fill="{GREEN}"/>')
    parts.append(
        f'<text x="{CX}" y="{CY + 5}" text-anchor="middle" font-size="16" '
        f'font-weight="700" fill="#fff">ON</text>'
    )
    parts.append(
        f'<text x="{CX}" y="{CY + 22}" text-anchor="middle" font-size="9" fill="#fff" '
        f'opacity="0.9">1 entity</text>'
    )
    return "\n".join(parts)


def card(x: int, title: str, subtitle: str, inner: str) -> str:
    return f"""
  <g transform="translate({x},16)">
    <rect x="0" y="0" width="420" height="488" rx="16" fill="#ffffff" stroke="#e5e7eb"/>
    <text x="16" y="28" font-size="16" font-weight="700" fill="{HEADER}">{title}</text>
    <rect x="318" y="12" width="86" height="22" rx="6" fill="{OK_BG}"/>
    <text x="361" y="28" text-anchor="middle" font-size="12" font-weight="600" fill="{OK_FG}">Active</text>
    <text x="210" y="48" text-anchor="middle" font-size="12" fill="{MUTED}">{subtitle}</text>
    <svg x="10" y="56" width="400" height="400" viewBox="0 0 400 400">
      {inner}
    </svg>
  </g>"""


def main() -> None:
    on = demo_on()
    svg = f"""<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 860 520" width="860" height="520" role="img" aria-label="Timer 24H 15 and 30 minute preview">
  <rect width="860" height="520" fill="#f4f6f8"/>
  {card(8, "Timer 24H", "30-minute view", clock(on, 30, None, 14, 0))}
  {card(432, "Timer 24H", "15-minute view — hour 12 selected", clock(on, 15, 12, 14, 0))}
</svg>
"""
    root = Path(__file__).resolve().parents[2]
    out_dir = root / "images"
    out_dir.mkdir(exist_ok=True)
    for name in ("preview.svg", "preview-1.3.0.svg"):
        out = out_dir / name
        out.write_text(svg, encoding="utf-8")
        print(f"wrote {out} ({out.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
