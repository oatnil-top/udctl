#!/usr/bin/env python3
"""Regenerate the placeholder social cards static/img/social-card.png and
static/img/social-card.zh-Hans.png (1200x630, the site's og:image).

Provenance: this is NOT the script that first drew the cards on 2026-09-19
(ud-docs baab774). That script was never committed. Every parameter below was
reverse-engineered from the baab774 output on 2026-09-20 (card 674aa679):
each text band was matched against the committed PNG by trying fonts and sizes
until the rendered band was pixel-identical (mean absolute difference 0), and
the whole card was then redrawn from scratch and compared pixel for pixel.
So the layout is a confirmed reproduction, not the original source.

Text is taken from the branding card 38c286b2 section 1 (the one source of the
positioning sentence). Change the words there first, then here.

Usage
    python3 scripts/social-card.py --verify
        Draw both cards in memory and compare them pixel for pixel with the
        files in static/img. Exit 0 only if both are identical. Run this before
        editing anything: it proves the parameters still match the committed
        images on this machine (fonts are macOS system fonts, so a different
        machine can legitimately differ).
    python3 scripts/social-card.py --write
        Overwrite the two files in static/img.

Expected (2026-09-20, ud-docs add1e63, macOS 26, Pillow 11.3.0):
    --verify prints "identical" for both cards;
    --write reproduces md5 569bd52516d7b1b894cc94f2806fec8c (en) and
    d12855be4237cc043e958ba8287b5490 (zh). Pixel identity is the claim that
    matters; the md5 also depends on Pillow's PNG encoder.
"""
import argparse
import hashlib
import io
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "static" / "img"
SIZE = (1200, 630)
FONT_MENLO = "/System/Library/Fonts/Menlo.ttc"
FONT_HELVETICA = "/System/Library/Fonts/Helvetica.ttc"
FONT_HIRAGINO = "/System/Library/Fonts/Hiragino Sans GB.ttc"

# (text, font path, size, fill, draw origin). Origins are the PIL draw
# coordinates that put each band exactly where baab774 put it. The footer
# has two spaces on each side of the middle dot; one space does not match.
CARDS = {
    "social-card.png": [
        ("udctl", FONT_MENLO, 150, (0, 0, 0), (88, 150)),
        ("Explore. Capture. Distill.", FONT_HELVETICA, 46, (0, 0, 0), (80, 360)),
        ("A private workspace for people and AI agents.", FONT_HELVETICA, 36, (60, 60, 60), (80, 424)),
        ("udctl.com  ·  udctl (UnDercontrol)  ·  free for personal use", FONT_HELVETICA, 26, (120, 120, 120), (80, 516)),
    ],
    "social-card.zh-Hans.png": [
        ("udctl", FONT_MENLO, 150, (0, 0, 0), (88, 150)),
        ("探索、记录、沉淀。", FONT_HIRAGINO, 44, (0, 0, 0), (80, 360)),
        ("人与 AI agent 共用的私密工作空间。", FONT_HIRAGINO, 34, (60, 60, 60), (80, 424)),
        ("udctl.com  ·  udctl(UnDercontrol)  ·  个人使用免费", FONT_HIRAGINO, 24, (120, 120, 120), (80, 516)),
    ],
}
# Two 2px black rules, x 80..1120, at rows 78-79 and 548-549.
RULES = [(80, 78, 1120, 79), (80, 548, 1120, 549)]


def draw(name):
    im = Image.new("RGB", SIZE, "white")
    d = ImageDraw.Draw(im)
    for box in RULES:
        d.rectangle(box, fill=(0, 0, 0))
    for text, font, size, fill, origin in CARDS[name]:
        d.text(origin, text, font=ImageFont.truetype(font, size, index=0), fill=fill)
    return im


def encode(im):
    buf = io.BytesIO()
    im.save(buf, format="PNG", optimize=True)
    return buf.getvalue()


def main():
    ap = argparse.ArgumentParser()
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--verify", action="store_true")
    g.add_argument("--write", action="store_true")
    args = ap.parse_args()
    ok = True
    for name in CARDS:
        im = draw(name)
        data = encode(im)
        target = OUT / name
        if args.write:
            target.write_bytes(data)
            print(f"{name}: written, md5 {hashlib.md5(data).hexdigest()}")
            continue
        cur = Image.open(target).convert("RGB")
        same = cur.size == im.size and cur.tobytes() == im.tobytes()
        ok &= same
        print(f"{name}: {'identical' if same else 'DIFFERENT'} (pixels); "
              f"regenerated md5 {hashlib.md5(data).hexdigest()}, "
              f"file md5 {hashlib.md5(target.read_bytes()).hexdigest()}")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
