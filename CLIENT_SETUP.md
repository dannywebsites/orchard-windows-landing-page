# CLIENT_SETUP.md — Agent Playbook

> **This document is for you, the AI agent.** When the user says "set up this client," "onboard [name]," or points you to a folder of client information — follow these steps in order.

---

## Step 1: Scan the Client Folder

The user drops everything they've gathered about the client into the `client-info/` folder at the project root. There is no fixed structure — expect a flat dump of files (text, images, screenshots, notes).

Read every file in the folder. Inventory what you find and tell the user.

**Important — images have two destinations:**

| What | Where | Why |
|------|-------|-----|
| Photos to use on the site (hero shots, quiz images, logos) | `public/images/` | Served by Next.js, committed to the repo |
| Raw notes, briefs, research, reference screenshots | `client-info/` | Gitignored, not deployed |

When you find images the user wants on the page, copy them to `public/images/` and reference them in TEMPLATE.json as `/images/filename.jpg`.

---

## Step 2: Extract & Audit Information

Pull every usable detail from the files. Then check it against this list:

### Must Have (stop and ask if missing)

- Company name
- Service or product they offer
- Service area / location
- Target customer (who is the landing page for?)

### Should Have (ask the user, suggest a default if needed)

- 3–5 key selling points or differentiators
- Brand colors (hex codes or visual reference)
- Instagram handle
- Currency (`$`, `€`, `£`)
- Real customer reviews (or permission to write representative ones)

### Nice to Have (use placeholders, flag for later)

- Meta Pixel ID (default to `"XXXXXXXXXXXXXXXXX"`)
- Terms of use / privacy policy URLs (default to `"#"`)
- Client-provided images for hero or quiz (fall back to Unsplash)
- Footer legal entity name (default to company name)

**Present a summary to the user:** "Here's what I found, here's what's missing." Do not proceed past this step until all Must Have fields are confirmed.

---

## Step 3: Quiz Qualifying Questions

The quiz is the core conversion mechanism — 3 qualifying steps + 1 binary step (4 total by default).

**If the user provided qualifying questions** → use them. Map them to the correct step types:
- Step 1 must be `image-grid` (visual, low friction)
- Steps 2–3 are `list` type (budget, timeline, scope, etc.)
- Final step is always `binary` (service area / readiness gate)

**If no questions were provided** → draft smart defaults based on the client's industry and target customer. Follow the quiz psychology rules from `CRO_PROMPT.md`:
- Easy → personal (escalating commitment)
- Each question should feel like a consultation
- 3–6 options per step
- Use "your" and "you"

**Always present your drafted questions to the user for approval before proceeding.** Do not skip this — the qualifying questions are critical to funnel performance.

---

## Step 4: Write All Copy

You are a copywriter. Use the frameworks from `CRO_PROMPT.md`. Work only with what the user provided — do not research or fabricate business details.

### Headline
- AIDA + pattern interrupt
- Format: `Arrange your FREE <span class='text-emerald-500'>[core offer]</span> [benefit/timeframe]!`
- The `<span>` wraps the 2–3 word core offer
- Under 15 words, conversational, no jargon

### Body Copy (Why Choose Us intro)
- PAS: Problem → Agitate → Solution
- 2–3 short paragraphs as an array
- One `<span class='font-bold underline'>` for emphasis
- Adapt language to the niche

### Why Choose Us Items
- 4 bullet points, benefit-led (not feature-led)
- Each under 25 words
- Use `<span class='font-bold text-gray-900'>` for the key claim
- Pick relevant Lucide icons

### Hero Benefits
- 2 benefit cards with title, text, and Lucide icon

### CTAs
- Yes/No binary choice (micro-commitment psychology)
- CTA headline: desire-based question
- CTA subtext: "Tap a button below ↓"

### Reviews
- If real reviews were provided → use them (clean up for length, keep authentic)
- If not → write 4 realistic reviews, each addressing a different buying objection:
  1. Quality / craftsmanship
  2. Speed / reliability
  3. Value / ROI
  4. Trust / professionalism
- Local-sounding names, under 25 words each, all 5 stars

### Thank-You Page
- Short celebratory heading
- 1–2 sentence reassuring message about next steps

### Not-In-Area Page
- Polite heading
- Short message encouraging Instagram follow
- CTA button label

---

## Step 5: Handle Images

### Client-provided images
Copy images from `client-info/` to `public/images/`. Use clear filenames (e.g., `hero-main.jpg`, `quiz-option-1.jpg`). Then map them to the appropriate TEMPLATE.json slots using local paths:

| Slot | Path format | Pick |
|------|-------------|------|
| `hero.mainImage` | `/images/hero-main.jpg` | Widest / best landscape |
| `hero.secondaryImage` | `/images/hero-secondary.jpg` | Lifestyle / context shot |
| `hero.tertiaryImage` | `/images/hero-tertiary.jpg` | Detail / close-up |
| `quiz.steps[0].options[].image` | `/images/quiz-[label].jpg` | Square or product shots |

### No images provided (or not enough)
Fall back to Unsplash URLs for any missing slots:
- Hero images: `https://images.unsplash.com/photo-[ID]?auto=format&fit=crop&q=80&w=1200`
- Quiz images: `https://images.unsplash.com/photo-[ID]?auto=format&fit=crop&q=80&w=400`

Pick images that match the client's industry and service.

---

## Step 6: Assemble TEMPLATE.json

Build the complete JSON matching the schema in `CRO_PROMPT.md`. Use:
- All confirmed information from Step 2
- Approved quiz questions from Step 3
- Written copy from Step 4
- Images from Step 5

Key defaults:
- `theme.radius`: `"1.5rem"`
- `theme.font`: `"Inter"`
- `theme.colors.accent`: `"#facc15"`
- `theme.colors.surface`: `"#FDFDFD"`
- `theme.colors.text`: `"#111827"`
- `metaPixelId`: `"XXXXXXXXXXXXXXXXX"` (unless user provided a real one)
- `footer.copyright`: `"© 2026 [Company Name]. All rights reserved."`
- `footer.links`: Terms, Privacy, Manage Cookies — all `"#"` unless real URLs provided

Write the completed JSON to `TEMPLATE.json`.

---

## Step 7: Validate & Present

1. Run `npm run validate` to catch structural issues
2. Fix any **FAIL** items
3. Present the result to the user with a summary of:
   - What copy was written and the angle taken
   - Which images were used (client-provided vs. Unsplash)
   - Any fields still using placeholders (Pixel ID, footer URLs)
   - Anything that needs their attention

**Do not** run `npm run dev` or deploy. That is the user's call.

---

## Rules

- **Only touch `TEMPLATE.json`.** The golden rule from `CLAUDE.md` applies — never modify code, components, or pages.
- **You are a copywriter, not a researcher.** Write from the materials provided. Do not invent business claims, statistics, or details.
- **Ask before assuming.** Missing critical info = ask. Missing nice-to-have = default and flag.
- **`CRO_PROMPT.md` is your copywriting framework.** Follow its structures for every piece of copy.
- **Quiz questions always need approval.** Whether provided or drafted — confirm with the user before building the JSON.
