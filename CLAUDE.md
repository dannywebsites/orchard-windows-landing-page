# CLAUDE.md — Instructions for AI Agents

## Golden Rule

**The layout and design of this site NEVER change.** This is a white-label lead generation funnel template used across many different clients. The only thing that changes per client is the content inside `TEMPLATE.json`.

## What You CAN Change

- `TEMPLATE.json` — text, images, colors, company name, quiz questions, metaPixelId, instagramHandle, CTAs
- `app/globals.css` — CSS variables (`:root` block) MUST be kept in sync with `TEMPLATE.json` → `theme.colors`. When updating TEMPLATE.json colors, always update globals.css to match.

## What You MUST NOT Change

- Any file in `components/` — the layout, structure, and styling are locked
- Any file in `app/` — page structure, layout.tsx, thank-you/page.tsx, not-in-area/page.tsx are locked (exception: globals.css `:root` variables)
- Do not add new components, pages, or routes beyond those that already exist
- Do not refactor, reorganize, or "improve" the existing code
- Do not change fonts, animations, or visual design
- Do not modify the quiz overlay behavior or flow

## Design Rules

- **CTA above the fold**: The YES / NO buttons (green tick and red X) must ALWAYS be visible above the fold on all screen sizes, including mobile. Hero image and text are sized smaller on mobile to guarantee this.
- **Hero image height**: Mobile `h-[288px]`, tablet `md:h-[281px]`, desktop `lg:h-[338px]`. These values are locked and must not change across builds.
- **Subheadline text color**: The star-rating subheadline (e.g. "5.0 customer reviews") is always `text-black`. Do not use `text-primary` or any other color.
- **Header bar color**: The header background is controlled by `header.bgColor` in TEMPLATE.json. Use `"#000000"` (black) or `"#ffffff"` (white) depending on the client logo. Text color is set via `header.textColor`.
- **Logo is an image**: The header displays the company logo as an image (`header.logoImage`), not a Lucide icon. Falls back to `header.logoIcon` (Lucide icon name) only if `logoImage` is not set.

## Architecture

- Next.js App Router with Tailwind CSS v4 and Framer Motion
- All content is driven by `TEMPLATE.json` at the project root
- Colors use CSS variables via `@theme inline` in globals.css; CTA/quiz buttons use inline `style={}` with hex values from TEMPLATE.json
- Quiz is a full-screen fixed overlay (`QuizOverlay.tsx`) with 3 qualifying questions + 1 binary step (4 steps total, no form)
- Binary step branches: YES → `/thank-you`, NO → `/not-in-area`
- `DynamicIcon.tsx` renders Lucide icons by name string from TEMPLATE.json

## Pages

- `/` — Landing page with quiz overlay
- `/thank-you` — Success page shown after YES on binary step; fires Meta Pixel `Lead` event
- `/not-in-area` — Rejection page shown after NO on binary step; shows Instagram follow CTA

## Meta Pixel

- Base pixel code (PageView) is loaded in `app/layout.tsx` for all pages
- Pixel ID is read from `TEMPLATE.json` → `metadata.metaPixelId`
- If `metaPixelId` is the placeholder `"XXXXXXXXXXXXXXXXX"` or empty, no pixel code is injected
- The `/thank-you` page fires an additional `fbq('track', 'Lead')` conversion event

## TEMPLATE.json Key Fields

- `metadata.metaPixelId` — Facebook/Meta Pixel ID (string of digits). Use placeholder `"XXXXXXXXXXXXXXXXX"` to disable.
- `metadata.instagramHandle` — Instagram handle (e.g., `"@brandname"`) or full URL (e.g., `"https://instagram.com/brandname"`). Used on the `/not-in-area` page.
- `header.logoImage` — Path to the company logo image (e.g., `"/images/logo.jpg"`). Displayed in the header on all pages.
- `header.bgColor` — Header background color. Use `"#000000"` or `"#ffffff"` depending on logo.
- `header.textColor` — Header text color for label/subLabel. Use the inverse of `bgColor`.

## Per-Client Workflow

1. Duplicate this entire folder for the new client
2. Use `CRO_PROMPT.md` + client info to generate a new `TEMPLATE.json` (see `CLIENT_SETUP.md`)
3. Replace `TEMPLATE.json` with the generated output
4. Update `app/globals.css` `:root` CSS variables to match `TEMPLATE.json` → `theme.colors`
5. Run `npm install`, then `npm run validate`
6. Preview with `npm run dev`, then deploy
