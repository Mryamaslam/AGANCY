# -*- coding: utf-8 -*-
"""Generate product-demo style MP4s for AI automation pages."""
from pathlib import Path
import subprocess
import math
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parent / "videos"
OUT.mkdir(exist_ok=True)
FFMPEG = r"C:\Users\Administrator\Downloads\ffmpeg-2026-01-22-git-4561fc5e48-essentials_build\ffmpeg-2026-01-22-git-4561fc5e48-essentials_build\bin\ffmpeg.exe"
W, H = 1280, 720
FPS = 15
SCENE_SEC = 3.5

BG = (10, 6, 16)
CARD = (19, 12, 34)
CARD2 = (23, 15, 42)
BORDER = (55, 40, 85)
PURPLE = (155, 92, 255)
PURPLE2 = (194, 100, 255)
TEXT = (255, 255, 255)
MUTED = (167, 159, 184)
OK = (61, 214, 140)
HOT = (255, 107, 138)
WARN = (245, 197, 66)

def font(size, bold=False):
    candidates = [
        r"C:\Windows\Fonts\segoeuib.ttf" if bold else r"C:\Windows\Fonts\segoeui.ttf",
        r"C:\Windows\Fonts\arialbd.ttf" if bold else r"C:\Windows\Fonts\arial.ttf",
    ]
    for p in candidates:
        if Path(p).exists():
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

F_TITLE = font(28, True)
F_H = font(22, True)
F_B = font(16, True)
F_P = font(15)
F_S = font(13)
F_XS = font(12)

def round_rect(draw, xy, r, fill=None, outline=None, width=1):
    draw.rounded_rectangle(xy, radius=r, fill=fill, outline=outline, width=width)

def draw_window(base, title="Market Makers · Automation"):
    d = ImageDraw.Draw(base)
    d.rectangle((0, 0, W, H), fill=BG)
    # soft glow
    for i in range(6):
        alpha = 18 - i * 2
        glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        gd = ImageDraw.Draw(glow)
        gd.ellipse((180 - i * 20, -80 - i * 10, 700 + i * 20, 320 + i * 10), fill=(155, 92, 255, alpha))
        base.alpha_composite(glow)
    # top bar
    round_rect(d, (40, 36, W - 40, H - 36), 18, fill=CARD, outline=BORDER, width=2)
    d.rectangle((40, 36, W - 40, 84), fill=CARD2)
    d.ellipse((58, 52, 72, 66), fill=(255, 95, 87))
    d.ellipse((80, 52, 94, 66), fill=(255, 189, 46))
    d.ellipse((102, 52, 116, 66), fill=(40, 200, 64))
    d.text((140, 50), title, font=F_B, fill=TEXT)
    return d

def pill(d, x, y, text, bg, fg=TEXT):
    tw = d.textlength(text, font=F_XS)
    round_rect(d, (x, y, x + tw + 22, y + 26), 13, fill=bg)
    d.text((x + 11, y + 5), text, font=F_XS, fill=fg)

def lerp(a, b, t):
    return a + (b - a) * t

def ease(t):
    return 1 - (1 - t) ** 3

# ---- Lead Inbox scenes ----
def frame_lead(scene, t):
    img = Image.new("RGBA", (W, H), BG + (255,))
    d = draw_window(img, "Lead Inbox AI · Live product demo")
    te = ease(t)

    if scene == 0:
        # Website form
        round_rect(d, (120, 120, 620, 620), 16, fill=CARD2, outline=BORDER, width=1)
        d.text((150, 145), "Contact form", font=F_H, fill=TEXT)
        d.text((150, 180), "yourwebsite.com/contact", font=F_S, fill=MUTED)
        fields = [
            ("Name", "Sarah Chen"[: max(1, int(11 * te))]),
            ("Email", "sarah@northpeak.io"[: max(1, int(20 * te))]),
            ("Message", "We need Instantly + LinkedIn outbound. Budget ready for a demo."[: max(1, int(58 * te))]),
        ]
        y = 230
        for label, val in fields:
            d.text((150, y), label, font=F_S, fill=MUTED)
            h = 70 if label == "Message" else 44
            round_rect(d, (150, y + 22, 580, y + 22 + h), 10, fill=(13, 8, 24), outline=BORDER)
            d.text((164, y + 34), val, font=F_P, fill=TEXT)
            y += h + 36
        btn_y = 560
        if te > 0.75:
            round_rect(d, (150, btn_y, 320, btn_y + 44), 22, fill=PURPLE)
            d.text((190, btn_y + 12), "Submit inquiry", font=F_B, fill=TEXT)
        # side note
        round_rect(d, (660, 200, 1160, 420), 16, fill=CARD2, outline=BORDER)
        d.text((690, 230), "What happens next", font=F_H, fill=TEXT)
        d.text((690, 280), "1. Form is submitted", font=F_P, fill=OK if te > 0.85 else MUTED)
        d.text((690, 320), "2. AI reads the message", font=F_P, fill=MUTED)
        d.text((690, 360), "3. Team gets an alert", font=F_P, fill=MUTED)

    elif scene == 1:
        round_rect(d, (120, 120, 1160, 620), 16, fill=CARD2, outline=BORDER)
        d.text((150, 145), "AI scoring engine", font=F_H, fill=TEXT)
        d.text((150, 180), "Checking buyer intent…", font=F_S, fill=MUTED)
        score = int(lerp(0, 92, te))
        # gauge bar
        round_rect(d, (150, 240, 1130, 280), 12, fill=(13, 8, 24))
        fill_w = 150 + int(980 * (score / 100))
        round_rect(d, (150, 240, fill_w, 280), 12, fill=PURPLE)
        d.text((150, 300), f"Lead score: {score}/100", font=F_TITLE, fill=TEXT)
        pill(d, 150, 360, "Serious buyer", (40, 80, 60), OK)
        pill(d, 300, 360, "Demo request", (60, 40, 90), PURPLE2)
        pill(d, 450, 360, "Budget mentioned", (60, 40, 90), PURPLE2)
        # result card
        round_rect(d, (150, 430, 900, 580), 14, fill=CARD, outline=BORDER)
        d.text((180, 455), "Sarah Chen · VP Growth, Northpeak", font=F_H, fill=TEXT)
        d.text((180, 495), "Route to: Ayesha  ·  Priority: High  ·  SLA: under 2 minutes", font=F_P, fill=MUTED)
        if te > 0.6:
            pill(d, 180, 535, "CRM deal created", (40, 80, 60), OK)

    else:
        # Alert + CRM
        round_rect(d, (120, 130, 620, 520), 16, fill=CARD2, outline=BORDER)
        d.text((150, 155), "Team alert", font=F_H, fill=TEXT)
        # whatsapp-like bubble
        y = 220
        for i, msg in enumerate([
            "New hot lead",
            "Sarah Chen asked for a demo",
            "Budget mentioned — call now"
        ]):
            appear = te > i * 0.25
            if not appear:
                continue
            round_rect(d, (160, y, 560, y + 56), 14, fill=(18, 70, 50) if i == 0 else CARD)
            d.text((180, y + 16), msg, font=F_P, fill=OK if i == 0 else TEXT)
            y += 70
        round_rect(d, (660, 130, 1160, 520), 16, fill=CARD2, outline=BORDER)
        d.text((690, 155), "CRM card", font=F_H, fill=TEXT)
        d.text((690, 220), "Owner: Ayesha", font=F_P, fill=TEXT)
        d.text((690, 260), "Status: New — Hot", font=F_P, fill=HOT)
        d.text((690, 300), "Channel: Website form", font=F_P, fill=MUTED)
        d.text((690, 340), "Next step: Book discovery call", font=F_P, fill=MUTED)
        if te > 0.5:
            pill(d, 690, 400, "Alert sent · WhatsApp + Slack", (40, 80, 60), OK)
        d.text((120, 560), "Result: serious leads reach sales in under 2 minutes", font=F_B, fill=TEXT)

    # caption bar
    captions = [
        "Step 1 — Visitor submits the form",
        "Step 2 — AI scores the lead",
        "Step 3 — Sales gets an instant alert",
    ]
    d.rectangle((40, H - 90, W - 40, H - 36), fill=(0, 0, 0, 180))
    # PIL RGB draw on RGBA - need to redraw caption on final RGB
    return img, captions[scene]

def frame_reply(scene, t):
    img = Image.new("RGBA", (W, H), BG + (255,))
    d = draw_window(img, "Reply Copilot · Live product demo")
    te = ease(t)

    if scene == 0:
        round_rect(d, (120, 120, 1160, 560), 16, fill=CARD2, outline=BORDER)
        d.text((150, 145), "Outreach inbox", font=F_H, fill=TEXT)
        d.text((150, 180), "New replies from Instantly / Smartlead", font=F_S, fill=MUTED)
        rows = [
            ("Marcus R.", "Can we book a call Thursday?", HOT),
            ("Priya N.", "Send case studies when you can.", WARN),
            ("Office Mgr", "Please remove me from this list.", MUTED),
            ("Lee A.", "Out of office until Monday.", MUTED),
        ]
        y = 230
        n = max(1, int(len(rows) * te + 0.3))
        for name, preview, color in rows[:n]:
            round_rect(d, (150, y, 1130, y + 64), 12, fill=CARD, outline=BORDER)
            d.ellipse((170, y + 18, 202, y + 50), fill=color)
            d.text((220, y + 12), name, font=F_B, fill=TEXT)
            d.text((220, y + 36), preview, font=F_P, fill=MUTED)
            y += 76

    elif scene == 1:
        cols = [
            ("HOT — reply now", HOT, [("Marcus R.", "Call Thursday?")]),
            ("WARM — nurture", WARN, [("Priya N.", "Wants case studies")]),
            ("SKIP — ignore", MUTED, [("Office Mgr", "Unsubscribe"), ("Lee A.", "OOO")]),
        ]
        x = 120
        for title, color, items in cols:
            round_rect(d, (x, 120, x + 350, 600), 16, fill=CARD2, outline=BORDER)
            pill(d, x + 20, 145, title, (40, 30, 55), color)
            yy = 200
            show_n = 1 if te < 0.45 else len(items)
            if title.startswith("SKIP") and te < 0.7:
                show_n = 1
            for name, txt in items[:show_n]:
                round_rect(d, (x + 20, yy, x + 330, yy + 90), 12, fill=CARD, outline=BORDER)
                d.text((x + 36, yy + 18), name, font=F_B, fill=TEXT)
                d.text((x + 36, yy + 48), txt, font=F_P, fill=MUTED)
                yy += 105
            x += 370

    else:
        round_rect(d, (120, 120, 1160, 600), 16, fill=CARD2, outline=BORDER)
        d.text((150, 145), "Draft ready for Marcus", font=F_H, fill=TEXT)
        round_rect(d, (150, 210, 1130, 420), 14, fill=CARD, outline=BORDER)
        draft = "Hi Marcus — Thursday 2–4pm works on our side. Here's my calendar link — pick any slot and we'll confirm."
        shown = draft[: max(1, int(len(draft) * te))]
        d.text((180, 240), shown, font=F_P, fill=TEXT)
        if te > 0.7:
            round_rect(d, (150, 460, 360, 520), 22, fill=PURPLE)
            d.text((200, 478), "Send reply", font=F_B, fill=TEXT)
            pill(d, 390, 470, "Human-approved draft", (40, 80, 60), OK)
        d.text((150, 560), "Result: reply 3× faster — only real interest gets attention", font=F_B, fill=TEXT)

    captions = [
        "Step 1 — Replies land in one inbox",
        "Step 2 — AI sorts Hot / Warm / Skip",
        "Step 3 — A ready draft appears",
    ]
    return img, captions[scene]

def frame_linkedin(scene, t):
    """Clearer, larger-type LinkedIn → CRM walkthrough."""
    img = Image.new("RGBA", (W, H), BG + (255,))
    d = draw_window(img, "LinkedIn Save · How it works")
    te = ease(t)

    # Big step badge top-left inside content
    step_labels = ["STEP 1 of 3", "STEP 2 of 3", "STEP 3 of 3"]
    step_titles = [
        "Someone accepts on LinkedIn",
        "Contact is saved to your list",
        "You get a reminder to message them",
    ]

    # Left step indicator
    round_rect(d, (70, 110, 360, 620), 16, fill=CARD2, outline=BORDER)
    d.text((95, 140), step_labels[scene], font=F_B, fill=PURPLE2)
    # wrap title
    title = step_titles[scene]
    d.text((95, 185), title[:22], font=F_H, fill=TEXT)
    if len(title) > 22:
        d.text((95, 218), title[22:].strip(), font=F_H, fill=TEXT)

    tips = [
        "Notification pops up\nwhen they accept",
        "Name + company go into\nCRM automatically",
        "Task: Message Daniel\ntoday — do not forget",
    ]
    tip = tips[scene]
    y = 300
    for part in tip.split("\n"):
        d.text((95, y), part, font=F_P, fill=MUTED)
        y += 32

    # Progress dots
    for i in range(3):
        cx = 120 + i * 50
        fill = PURPLE if i <= scene else (50, 40, 70)
        d.ellipse((cx, 560, cx + 18, 578), fill=fill)

    # Right main panel
    round_rect(d, (390, 110, 1210, 620), 16, fill=CARD2, outline=BORDER)

    if scene == 0:
        d.text((430, 150), "LinkedIn notification", font=F_H, fill=(120, 180, 255))
        # notification card
        ny = 210 + int((1 - te) * 20)
        round_rect(d, (450, ny, 1150, ny + 220), 18, fill=CARD, outline=(10, 102, 194))
        d.ellipse((480, ny + 40, 560, ny + 120), fill=(10, 102, 194))
        d.text((490, ny + 65), "DO", font=F_H, fill=TEXT)
        d.text((590, ny + 50), "Daniel Okonkwo", font=F_TITLE, fill=TEXT)
        d.text((590, ny + 100), "accepted your connection request", font=F_P, fill=MUTED)
        d.text((590, ny + 140), "Founder at RelayOps", font=F_P, fill=MUTED)
        if te > 0.55:
            pill(d, 590, ny + 175, "Accepted just now", (20, 50, 90), (120, 180, 255))
        if te > 0.75:
            d.text((450, 500), "Next: save this person to your CRM list...", font=F_B, fill=OK)

    elif scene == 1:
        d.text((430, 150), "Your CRM / contact list", font=F_H, fill=TEXT)
        # table header
        round_rect(d, (450, 210, 1150, 270), 10, fill=(13, 8, 24))
        for x, h in ((470, "NAME"), (720, "COMPANY"), (940, "TITLE")):
            d.text((x, 228), h, font=F_S, fill=MUTED)
        # animated row
        round_rect(d, (450, 290, 1150, 380), 12, fill=CARD, outline=OK if te > 0.5 else BORDER)
        name = "Daniel Okonkwo"
        d.text((470, 320), name[: max(1, int(len(name) * te))], font=F_H, fill=TEXT)
        if te > 0.35:
            d.text((720, 325), "RelayOps", font=F_P, fill=TEXT)
        if te > 0.55:
            d.text((940, 325), "Founder", font=F_P, fill=MUTED)
        if te > 0.7:
            pill(d, 470, 430, "Saved — no typing needed", (40, 80, 60), OK)
            d.text((470, 490), "You did not copy or paste anything.", font=F_P, fill=MUTED)

    else:
        d.text((430, 150), "Today's reminder", font=F_H, fill=TEXT)
        round_rect(d, (450, 210, 1150, 480), 16, fill=CARD, outline=HOT)
        d.text((490, 250), "TO-DO", font=F_B, fill=HOT)
        d.text((490, 300), "Message Daniel Okonkwo", font=F_TITLE, fill=TEXT)
        d.text((490, 360), "Send a short LinkedIn DM today", font=F_P, fill=MUTED)
        d.text((490, 400), "Suggested: share 1 case study + ask for a 15-min chat", font=F_P, fill=MUTED)
        if te > 0.45:
            round_rect(d, (490, 450, 700, 510), 22, fill=PURPLE)
            d.text((530, 468), "Open LinkedIn", font=F_B, fill=TEXT)
            pill(d, 730, 460, "Due today", (80, 50, 40), HOT)
        if te > 0.75:
            d.text((450, 545), "Result: no lost connections — follow-up is automatic", font=F_B, fill=OK)

    captions = [
        "Step 1 — They accept your LinkedIn invite",
        "Step 2 — Their name is saved to your list",
        "Step 3 — You get a task: message them today",
    ]
    return img, captions[scene]


def composite_caption(rgba_img, caption):
    rgb = Image.new("RGB", (W, H), BG)
    rgb.paste(rgba_img, mask=rgba_img.split()[-1])
    d = ImageDraw.Draw(rgb)
    d.rectangle((40, H - 88, W - 40, H - 36), fill=(8, 4, 14))
    d.text((60, H - 72), caption, font=F_B, fill=TEXT)
    # progress dots based on nothing - ok
    return rgb

def render_video(name, frame_fn):
    frames_dir = OUT / f"_frames_{name}"
    frames_dir.mkdir(exist_ok=True)
    for p in frames_dir.glob("*.png"):
        p.unlink()
    idx = 0
    for scene in range(3):
        n = int(SCENE_SEC * FPS)
        for i in range(n):
            t = i / max(1, n - 1)
            rgba, caption = frame_fn(scene, t)
            frame = composite_caption(rgba, caption)
            frame.save(frames_dir / f"f{idx:04d}.png")
            idx += 1
    mp4 = OUT / f"{name}.mp4"
    # pattern
    cmd = [
        FFMPEG, "-y",
        "-framerate", str(FPS),
        "-i", str(frames_dir / "f%04d.png"),
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-crf", "20",
        "-b:v", "1200k",
        "-movflags", "+faststart",
        str(mp4),
    ]
    print("encoding", name, "…")
    subprocess.run(cmd, check=True, capture_output=True)
    print("wrote", mp4, "size", mp4.stat().st_size)
    # cleanup frames to keep repo smaller
    for p in frames_dir.glob("*.png"):
        p.unlink()
    frames_dir.rmdir()
    return mp4

def frame_sdr(scene, t):
    """Clearer AI Research SDR walkthrough — same layout style as LinkedIn Save."""
    img = Image.new("RGBA", (W, H), BG + (255,))
    d = draw_window(img, "AI Research SDR · How it works")
    te = ease(t)

    step_labels = ["STEP 1 of 3", "STEP 2 of 3", "STEP 3 of 3"]
    step_titles = [
        "Load the company + contact",
        "AI finds a personal hook",
        "You get LinkedIn + email + call",
    ]
    tips = [
        "Start with one lead\nfrom your list",
        "News, hiring, tools\n= why message them NOW",
        "Ready-to-send copy\nfor 3 channels",
    ]

    round_rect(d, (70, 110, 360, 620), 16, fill=CARD2, outline=BORDER)
    d.text((95, 140), step_labels[scene], font=F_B, fill=PURPLE2)
    title = step_titles[scene]
    # split long titles across 2 lines
    words = title.split()
    line1 = " ".join(words[:4])
    line2 = " ".join(words[4:])
    d.text((95, 185), line1, font=F_H, fill=TEXT)
    if line2:
        d.text((95, 218), line2, font=F_H, fill=TEXT)
    y = 300
    for part in tips[scene].split("\n"):
        d.text((95, y), part, font=F_P, fill=MUTED)
        y += 32
    for i in range(3):
        cx = 120 + i * 50
        fill = PURPLE if i <= scene else (50, 40, 70)
        d.ellipse((cx, 560, cx + 18, 578), fill=fill)

    round_rect(d, (390, 110, 1210, 620), 16, fill=CARD2, outline=BORDER)

    if scene == 0:
        d.text((430, 150), "Lead from your list", font=F_H, fill=TEXT)
        round_rect(d, (450, 210, 1150, 400), 18, fill=CARD, outline=BORDER)
        d.ellipse((480, 250, 580, 350), fill=PURPLE)
        d.text((505, 285), "SC", font=F_TITLE, fill=TEXT)
        d.text((610, 255), "Sarah Chen", font=F_TITLE, fill=TEXT)
        d.text((610, 305), "VP Growth  ·  Northpeak.io", font=F_P, fill=MUTED)
        if te > 0.4:
            pill(d, 610, 350, "In queue", (60, 40, 90), PURPLE2)
        checks = ["Company domain loaded", "Contact email found", "Ready to research"]
        y = 430
        for i, c in enumerate(checks):
            if te < 0.35 + i * 0.2:
                break
            pill(d, 450, y, "OK", (40, 80, 60), OK)
            d.text((520, y + 4), c, font=F_P, fill=TEXT)
            y += 42
        if te > 0.85:
            d.text((450, 560), "Next: AI researches this company...", font=F_B, fill=OK)

    elif scene == 1:
        d.text((430, 150), "What AI discovered", font=F_H, fill=TEXT)
        findings = [
            ("Funding", "Series B closed 6 weeks ago"),
            ("Hiring", "Posting 4 SDR jobs on LinkedIn"),
            ("Tools", "Uses HubSpot + Instantly"),
            ("Hook", "Scale outbound after the raise"),
        ]
        y = 210
        for i, (label, body) in enumerate(findings):
            if te < i * 0.2:
                break
            round_rect(d, (450, y, 1150, y + 78), 12, fill=CARD, outline=BORDER)
            pill(d, 470, y + 24, label, (60, 40, 90), PURPLE2)
            d.text((600, y + 26), body, font=F_P, fill=TEXT)
            y += 90
        if te > 0.8:
            pill(d, 450, 560, "ICP fit: High", (40, 80, 60), OK)
            pill(d, 640, 560, "Priority: A", (80, 50, 40), HOT)

    else:
        d.text((430, 150), "Your outreach pack (ready to send)", font=F_H, fill=TEXT)
        blocks = [
            ("1. LinkedIn", "Congrats on the Series B — curious how you're staffing outbound."),
            ("2. Email", "Saw you're hiring SDRs; we help teams lift reply rates in 30 days."),
            ("3. Call opener", "Calling about post-raise outbound capacity..."),
        ]
        y = 205
        for i, (label, body) in enumerate(blocks):
            if te < i * 0.22:
                break
            round_rect(d, (450, y, 1150, y + 95), 12, fill=CARD, outline=BORDER)
            pill(d, 470, y + 18, label, (60, 40, 90), PURPLE2)
            # wrap-ish by truncating with progress
            shown = body[: max(1, int(len(body) * min(1.0, 0.4 + te)))]
            d.text((470, y + 55), shown, font=F_P, fill=TEXT)
            y += 108
        if te > 0.75:
            d.text((450, 560), "Result: personalized outreach in about 30 seconds", font=F_B, fill=OK)

    captions = [
        "Step 1 — Pick a company and contact",
        "Step 2 — AI finds why to message them now",
        "Step 3 — LinkedIn + email + call scripts ready",
    ]
    return img, captions[scene]


def frame_meeting(scene, t):
    img = Image.new("RGBA", (W, H), BG + (255,))
    d = draw_window(img, "Meeting Follow-up OS · Advanced product demo")
    te = ease(t)
    if scene == 0:
        round_rect(d, (120, 120, 1160, 560), 16, fill=CARD2, outline=BORDER)
        d.text((150, 145), "Discovery call transcript", font=F_H, fill=TEXT)
        d.text((150, 185), "Sarah Chen · 28 minutes · Zoom", font=F_S, fill=MUTED)
        lines = [
            "Sarah: Our team is drowning in cold email replies…",
            "You: What's the current response SLA?",
            "Sarah: Sometimes a full day — buyers go cold.",
            "Sarah: We need something before next quarter.",
        ]
        y = 240
        shown = max(1, int(len(lines) * te + 0.2))
        for line in lines[:shown]:
            round_rect(d, (150, y, 1130, y + 48), 10, fill=CARD, outline=BORDER)
            d.text((170, y + 14), line[: max(1, int(len(line) * min(1, te + 0.3)))], font=F_P, fill=TEXT)
            y += 58
    elif scene == 1:
        round_rect(d, (120, 120, 600, 600), 16, fill=CARD2, outline=BORDER)
        d.text((150, 150), "AI summary", font=F_H, fill=TEXT)
        items = ["Pain: slow reply handling", "Budget: open this quarter", "Objection: integration time", "Next: pricing + tech demo"]
        y = 220
        for i, it in enumerate(items):
            if te < i * 0.2:
                break
            d.text((160, y), "•  " + it, font=F_P, fill=TEXT)
            y += 50
        round_rect(d, (640, 120, 1160, 600), 16, fill=CARD2, outline=BORDER)
        d.text((670, 150), "CRM update", font=F_H, fill=TEXT)
        if te > 0.3:
            d.text((670, 220), "Stage → Proposal", font=F_P, fill=OK)
        if te > 0.5:
            d.text((670, 270), "Owner → Ayesha", font=F_P, fill=TEXT)
        if te > 0.7:
            d.text((670, 320), "Amount → $4,800 / mo", font=F_P, fill=TEXT)
            pill(d, 670, 400, "Deal fields written", (40, 80, 60), OK)
    else:
        round_rect(d, (120, 120, 1160, 600), 16, fill=CARD2, outline=BORDER)
        d.text((150, 145), "Follow-up pack", font=F_H, fill=TEXT)
        round_rect(d, (150, 200, 1130, 380), 14, fill=CARD, outline=BORDER)
        draft = "Hi Sarah — great speaking today. Attached is pricing and a Loom of the reply workflow we discussed. Free Thu 2–4 for the tech demo?"
        d.text((180, 230), draft[: max(1, int(len(draft) * te))], font=F_P, fill=TEXT)
        if te > 0.55:
            round_rect(d, (150, 420, 1130, 540), 14, fill=CARD, outline=BORDER)
            d.text((180, 445), "Tasks", font=F_B, fill=TEXT)
            d.text((180, 485), "Ayesha — send proposal by Thu   ·   Bilal — record Loom walkthrough", font=F_P, fill=MUTED)
        if te > 0.8:
            d.text((150, 570), "Result: admin done in under 5 minutes after the call", font=F_B, fill=TEXT)
    captions = [
        "Step 1 — Ingest the call transcript",
        "Step 2 — Summarize + update CRM",
        "Step 3 — Draft email + create tasks",
    ]
    return img, captions[scene]


def main():
    render_video("research-sdr", frame_sdr)
    print("DONE")

if __name__ == "__main__":
    main()
