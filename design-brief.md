# design-brief.md

Strategic design brief for the Carioca Viagens digital presentation and Design System.

## Brand summary

Carioca Viagens is a travel agency operating since 1999 in the national and international market. It serves corporate travel, leisure travel and receptive services.

The brand is not only about tourism. It is about professional travel support, operational agility, trusted service and personalized attention.

The new visual system must evolve from the older presentation without simply repeating it.

## Core design idea

The Design System should be built around three ideas:

1. Proximity
2. Agility
3. Operational confidence

Core visual positioning:

> Viagem corporativa com atendimento humano.

The brand should feel close and accessible, but also efficient, safe and structured.

## What to preserve from the older presentation

The older presentation contains important brand assets and ideas that should be preserved and refined.

### Logo

The logo combines blue, green and gray. Its symbol suggests landscape, mountain, path, wave, route or movement. This is highly relevant to a travel company and should inspire the broader visual language.

### Signature phrase

“Nossa agência. Sua agência.” should remain an important brand expression. It communicates personalized service, continuity and proximity.

### Service attitude

The idea of “muito prazer em lhe atender” expresses warmth and hospitality. It can be reused as a refined verbal texture or secondary graphic pattern, especially in covers, transitions or closing sections.

### Travel imagery

Themes such as airports, airplanes, cities, corporate travelers, service and displacement remain correct. The treatment must become more refined and consistent.

## What to avoid from the older presentation

Avoid directly reproducing the dated aspects of the older deck.

- Beige textured backgrounds that feel old or heavy.
- Large heavy blue rounded boxes.
- Inconsistent logo applications.
- Triangular bullets.
- Long text blocks with weak hierarchy.
- Heterogeneous stock imagery.
- Layouts that feel like static slides rather than a digital experience.

## What to borrow carefully from the newer presentation

The newer presentation has a more contemporary direction.

Useful aspects:

- Cleaner layouts.
- More space.
- Stronger titles.
- Organic photo masks.
- Linear icons.
- More digital feeling.

Risks:

- Yellow can become too dominant and move the identity away from the logo.
- The style can become generic if not tied to Carioca’s own visual assets.
- The design must not look like a template.

## Color system

The palette must start from the logo colors: blue, green and gray.

Official institutional hex values (locked — do not re-extract from the logo, do not approximate):

| Token | Hex |
|---|---|
| Carioca Blue | `#2E83C5` |
| Carioca Green | `#71B73B` |
| Carioca Light Blue | `#51B6E8` |
| Carioca Light Green | `#9DC86C` |
| Carioca Graphite | `#615E5D` |
| Carioca Light Graphite | `#7B7B79` |

These six are the confirmed institutional base. Everything else in this section (Deep Blue, Sand/Cream, Solar Yellow, Blue Night) remains exploratory — no confirmed hex, use with judgment, and never let it compete with the six official colors above.

### Primary palette

**Carioca Blue** — `#2E83C5`

Main institutional color. Use for titles, buttons, links, active states, route lines, icons and navigation highlights.

Meaning: trust, sky, travel, operation, security.

**Carioca Green** — `#71B73B`

Secondary institutional color. Use for accents, success states, highlights, service details and support elements.

Meaning: solution, efficiency, care, progress.

**Carioca Graphite** — `#615E5D`

Main text color for light backgrounds. Prefer graphite over pure black. This is the exact color used in the wordmark of the real logo.

Meaning: professionalism, clarity, sophistication.

**Carioca Light Graphite** — `#7B7B79`

Secondary text color for light backgrounds — captions, subtitles, muted labels. This is the exact color used in the "eventos & viagens" subtitle of the real logo.

**Accessibility note (verified):** contrast ratio of `#7B7B79` against the working off-white `#F7F3EC` is **3.83:1** (WCAG relative-luminance formula). That clears the 3:1 minimum for large text (≥24px, or ≥19px bold) but falls short of the 4.5:1 minimum for normal body text. Rule: use Light Graphite for captions, eyebrows, labels and large/secondary headings — never for small paragraph copy. For small body text on light backgrounds, use Carioca Graphite (`#615E5D`, 5.81:1 against the same off-white), which passes AA.

**Warm Off-white**

Main background color. It should preserve warmth without reproducing the old beige texture. No confirmed hex yet — currently `#F7F3EC` in the mockups, treated as a neutral rather than a brand color.

Meaning: openness, readability, calm, hospitality.

### Expanded palette (official, support role)

**Carioca Light Blue** — `#51B6E8`

Digital support color. Use for texture, detail, small accents, hover states or UI chips — not as a large dominant wash. It must remain secondary to Carioca Blue.

**Carioca Light Green** — `#9DC86C`

Support version of the institutional green — texture, detail, small accents, quiet highlights. Same rule as Light Blue: support role, not a dominant background wash.

### Expanded palette (exploratory, unconfirmed hex)

**Deep Blue**

Useful for high-contrast sections, footers, premium/corporate areas and digital navigation. No official hex given — when a dark section needs it, derive a darkened shade of Carioca Blue (`#2E83C5`) rather than inventing an unrelated dark color.

**Sand / Cream**

Modern replacement for the old beige. Use for warm section backgrounds.

**Solar Yellow**

Not part of the confirmed official palette. Avoid using yellow as a dominant color in any direction — if an accent is needed, prefer Carioca Light Blue or Carioca Light Green instead.

**Blue Night / Purple Shadow**

Use with caution only for image overlays or depth. It should not become a main institutional color.

### Color rule

Blue and green come from the brand and are official. Light Blue and Light Green are official but support-only — texture and detail, never the dominant field. Graphite and Light Graphite organize reading on light backgrounds. Yellow is not part of the confirmed palette and should not be treated as dominant.

## Typography

Typography is not fully locked during the exploration phase.

The current preferred combination is:

- Titles: Montserrat
- Body text: Inter

However, during the initial visual direction phase, the agent may propose alternative title fonts if they better support one of the proposed creative directions.

Body copy should preferably remain Inter unless there is a strong reason to change it.

### Exploration rules

For each visual direction, the agent may suggest a different title font, but must explain:

- Why the font fits Carioca Viagens.
- How it supports proximity, agility and operational confidence.
- Whether it feels more corporate, editorial, premium, digital or wayfinding-oriented.
- Whether it works well with Portuguese text.
- Whether it is practical for web implementation.

### Possible typographic territories

**Airport / Wayfinding direction**
- Fonts may feel clear, functional, highly legible and connected to orientation systems.
- Possible references: Avenir, Frutiger-like sans-serifs, Inter, IBM Plex Sans, Source Sans 3.

**Corporate / Human direction**
- Fonts may feel professional, warm, accessible and trustworthy.
- Possible references: Montserrat, Lato, Nunito Sans, Sora, Open Sans.

**Editorial / Cinematic direction**
- Fonts may feel more refined, premium and narrative, while still remaining clear.
- Possible references: Avenir, Manrope, Plus Jakarta Sans, DM Sans, Satoshi-like sans-serifs.

### Final typography decision

Typography must be locked only after the visual direction is approved.

The final decision must be documented in:

design/design.md

Once locked, all headings, body text, labels, buttons and UI components must follow the final typography system.

### Typography hierarchy

H1:

- Large, confident, strong presence
- Use for hero and main section openings

H2:

- Use for internal section titles
- Prefer Carioca Blue or Graphite

H3:

- Use for service groups, cards and subsections

Body:

- Comfortable line height
- Graphite or dark neutral

Emphasis:

- Use sparingly

Labels:

- Uppercase only for short labels such as OPERACIONAIS, CORPORATIVO, RECEPTIVO, CLIENTES
- Consider slight letter spacing

## Shape language

The visual language should be inspired by the logo and travel routes.

Preferred shapes:

- Organic photo masks.
- Rounded cards.
- Route lines.
- Dotted paths.
- Semicircles and soft geometric fragments.
- Curves that suggest movement, wave, landscape or route.

Avoid random decorative blobs. Shapes must feel connected to movement, path, service, route or the logo.

## Layout and grid

The digital version should feel like a responsive marketing website, not a sequence of flat slides.

Use:

- 12-column grid for desktop.
- Generous margins.
- Strong vertical rhythm.
- Clear section transitions.
- Cards and content blocks with consistent spacing.
- Limited text width for readability.
- Responsive behavior for tablet and mobile.

The PDF version should later be derived from the same Design System, using a more editorial 16:9 layout.

## Photography and media

Photography should communicate:

- Business travel.
- Airports.
- Airplane windows.
- Corporate mobility.
- City arrival.
- Human service.
- Calm professionalism.

Avoid:

- Generic vacation imagery.
- Overly happy tourist clichés.
- Chaotic airports.
- Images that look obviously artificial or disconnected.

Image treatment:

- Use brand-color overlays when needed.
- Prefer blue/green or blue/deep-blue treatments.
- Use yellow only as a small accent.
- Preserve readability when text overlaps imagery.
- Use organic masks or structured wayfinding-like layouts.

## Hero media

The hero may use either a still image or short cinematic video.

Preferred video direction:

- 6–10 seconds.
- Seamless loop.
- Subtle atmospheric motion.
- Business travel theme.
- Airport, airplane window, city arrival, luggage, corporate mobility.
- Elegant, calm, professional and human mood.

Rules:

- Do not rely on video to communicate essential content.
- Always include a static fallback.
- Text readability comes first.
- Avoid flashy transitions.
- Avoid generic travel advertising clichés.

## Icons

Use linear icons with a consistent style.

Icon style:

- Simple line icons.
- Rounded stroke endings.
- Consistent stroke weight.
- Minimal detail.
- Prefer blue on light backgrounds or white on blue backgrounds.

Icon families:

- Travel: airplane, suitcase, passport, map, location.
- Corporate: building, chart, report, cost center.
- Operations: gear, check, clock, support.
- Services: hotel, car, insurance, event, room, equipment.
- Contact: email, phone, WhatsApp, Instagram, Facebook.

## Components

Core components:

- Hero section.
- CTA button.
- Secondary CTA button.
- Service card.
- Benefit card.
- Operational support block.
- Corporate services list.
- Receptive services block.
- Client logo grid.
- Contact panel.
- Route line / path motif.
- Badge / chip for service labels.
- Quote or signature phrase block.

Component principles:

- Rounded but not childish.
- Clean but not cold.
- Branded but not overdecorated.
- Consistent spacing and hierarchy.

## Motion principles

Motion should support the travel metaphor and the reading rhythm.

Preferred motion:

- Route line drawing as the user scrolls.
- Elegant hero entrance.
- Gentle movement in visual masks or route elements.
- Controlled card reveals.

Avoid:

- Animating every section in the same way.
- Generic scroll reveal everywhere.
- Flashy effects.
- Heavy parallax that harms performance.

Use GSAP when motion becomes part of the experience.

Always respect `prefers-reduced-motion`.

## Verbal tone

Tone should be:

- Direct.
- Warm.
- Professional.
- Clear.
- Service-oriented.
- Confident without exaggeration.

Avoid overly touristic, exaggerated or playful language. Carioca Viagens serves leisure and receptive travel, but the new digital presentation should also feel credible to corporate clients.

## Final design target

The final result should feel like:

- A refined evolution of the older presentation.
- More brand-specific than the newer presentation.
- A professional travel partner with human service.
- A digital experience with clear structure, strong hierarchy and subtle motion.
- A brand system that can later support both website and PDF presentation.

## Creative workflow
During the mockup phase, visual foundations may be explored. During the final Design System phase, foundations must be locked and consistently applied.
