# CLAUDE.md

This file gives Claude Code the working context and execution rules for the Carioca Viagens digital presentation project.

## Project

Build a new digital presentation / marketing website for Carioca Viagens, with a later PDF version derived from the same visual system.

The project is not just a slide redesign. It must first establish a coherent Design System and then use that system to create a responsive digital experience.

## Client

Carioca Viagens is a Brazilian travel agency operating since 1999 in the national and international market. It serves corporate travel, leisure travel and receptive services.

The brand should communicate:

- Proximity
- Agility
- Operational confidence
- Personalized service
- Human attention
- Professional travel support

Core positioning:

> Viagens corporativas com atendimento próximo e operação eficiente.

## Language

All visible client-facing content must be in Brazilian Portuguese.

Do not translate brand names, slogans, service names, contact details or visible UI copy into English.

The working documentation may be in English, but the final presentation and website must be in Portuguese.

## Source of truth

Use the following files as project references:

- `design-brief.md` — brand, design system and creative direction.
- `references/conteudo-apresentacao.md` — official source for all visible client-facing copy.
- `docs/apresentação-carioca-viagens-aparesentação-antiga.pdf` — main visual and conceptual reference.
- `docs/apresentação-carioca-viagens-apresentação-nova.pdf` — updated content and secondary visual reference.
- `docs/higgsfield-playbook.md` — **read this at the start of any session involving media generation (Higgsfield).** Which model fits which situation, verified costs, measured limits and process principles. It exists to prevent re-learning by trial and error.

Rules:

- Use `references/conteudo-apresentacao.md` as the only authoritative source for visible text.
- Do not invent, rewrite, summarize, shorten, expand or translate client-facing copy unless explicitly requested.
- PDFs are visual and historical references, not the final text source.
- If there is a conflict between the PDFs and `conteudo-apresentacao.md`, ask for clarification or prioritize `conteudo-apresentacao.md`.

## Source hierarchy

Use these files in this order:

1. `references/conteudo-apresentacao.md`
   - Authoritative source for all visible client-facing copy.
   - Do not rewrite, summarize, invent or translate this content unless explicitly asked.

2. `design-brief.md`
   - Authoritative source for the visual strategy, brand direction and design principles.

3. `project-card.md`
   - Strategic project context.
   - Use it to understand the client, positioning and background decisions.
   - If it conflicts with `design-brief.md`, follow `design-brief.md`.
   - If it conflicts with `references/conteudo-apresentacao.md`, follow `references/conteudo-apresentacao.md`.

## Creative workflow

Do not start coding immediately.

Always follow this order:

1. Read `CLAUDE.md`.
2. Read `design-brief.md`.
3. Read `references/conteudo-apresentacao.md`.
4. Review the reference PDFs.
5. Produce three clearly different static visual directions.
6. Wait for approval or feedback.
7. Create or update `design/design.md` with the chosen Design System.
8. Implement the responsive digital presentation.
9. Add motion only after layout and content are approved.
10. Optimize responsiveness, accessibility and performance.
11. Prepare the PDF version only after the digital version is stable.

## Initial design exploration

Before implementing the final website, create three static HTML mockups in `design/mocks/`.

Each mockup must explore a different direction:

1. **Airport Wayfinding**
   - Inspired by signage, routes, clarity, movement and airport systems.
   - More structured, precise and navigational.

2. **Corporate Carioca**
   - Professional, human, direct and warm.
   - Strong use of the brand blue and green.
   - Best candidate for the final direction unless another direction clearly works better.

3. **Editorial Journey**
   - More visual and narrative.
   - Larger photography, stronger scroll rhythm and more atmospheric travel storytelling.

Mockup rules:

- Use real content from `references/conteudo-apresentacao.md`.
- Do not use lorem ipsum.
- Do not implement the final site yet.
- Do not add complex animations yet.
- Use placeholders for video or images when assets are not available.
- The goal is to evaluate visual direction, not technical completeness.

## Page architecture

The digital presentation should be structured like a marketing website, not just static slides.

Recommended sections:

1. Hero
2. About
3. Client Benefits
4. Operational Support
5. Corporate Services
6. Receptive Services
7. Clients
8. Contact

The exact wording and section content must come from `references/conteudo-apresentacao.md`.

## Hero requirements

Purpose:

Introduce Carioca Viagens immediately as a professional travel partner with human, personalized service.

Content:

- Logo
- Strong headline
- Short positioning statement
- CTA: Fale conosco / Solicite atendimento

Media guidelines:

- Support either a still image or a short cinematic background video.
- Prefer a subtle atmospheric video, 6–10 seconds, seamless loop.
- Suggested themes: business travel, airport, airplane window, corporate mobility, city arrival.
- Mood: elegant, calm, professional and human.
- Avoid generic vacation or tourism clichés.
- Avoid overly flashy visual effects.
- Video must never reduce text readability.
- Always provide a static image fallback.
- During early mockups, use a visual placeholder and define the media area; do not generate or depend on final video assets.

## Design system

The Design System must be defined in `design/design.md` after the visual direction is approved.

It must include:

- Brand principles
- Color tokens
- Typography tokens
- Grid and spacing
- Radius and shape language
- Components
- Image treatment
- Icon style
- Motion principles
- Accessibility rules
- Anti-AI-slop rules

Use `design-brief.md` as the main strategic input.

## Skills

Use project skills intentionally.

- `marketing-ui` should guide marketing pages, visual direction, landing pages and the digital presentation.
- `gsap` should be used only after the layout and content structure are approved, for polished and purposeful motion.
- `shadcn` should be used during the React implementation phase as the technical foundation for reusable UI components such as buttons, cards, navigation, accordions and forms.

Important shadcn rule:

Do not let shadcn define the visual identity of the project. The appearance of every component must follow the Carioca Viagens Design System, not the default shadcn aesthetics.

Avoid using `functional-ui` unless the project later includes dashboards, admin tools, forms-heavy workflows or internal systems.

Use `clone` only if explicitly asked to analyze or borrow structure from a specific reference website or screenshot.

## Screenshots durante o desenvolvimento

Para gerar screenshots de página inteira de HTML estático local (mockups, previews, etc.), seguir a receita documentada em `G:\Pedro\Brain\10_Knowledge\Screenshots de página inteira em ambiente de dev local — Playwright e as armadilhas do vh.md` (caminho absoluto — este arquivo não vive dentro da pasta do projeto). Ela evita repetir limitações já mapeadas nesta sessão: a extensão Claude in Chrome não abre `file://`, redimensionar a janela para a altura da página quebra qualquer CSS que use `vh`, e o caminho confiável é servir a pasta via `python -m http.server` + Playwright (`channel="chrome"`, viewport normal, `full_page=True`).

## Suggested implementation stack

Use React + TypeScript + Vite + Tailwind when implementation begins.

Use shadcn/ui for reusable components when appropriate, but customize everything through the project Design System.

Use GSAP for signature motion only when it improves comprehension, rhythm or emotional impact.

## Motion direction

Motion should be subtle, elegant and useful.

Recommended motion concept:

- A route line that draws across selected sections as the user scrolls.
- Gentle hero entrance.
- Small reveal transitions for cards and service blocks.
- Optional parallax or movement in visual shapes, if performance remains good.

Rules:

- Do not animate everything.
- Avoid generic scroll-reveal effects on every block.
- Prefer transform and opacity.
- Respect `prefers-reduced-motion`.
- Avoid layout-thrashing properties.
- Motion must support the story of travel, route, guidance and service.

## Anti-AI-slop rules

Avoid:

- Generic purple/blue gradients unrelated to the brand.
- Random glassmorphism.
- Overused SaaS landing page patterns.
- Excessive shadows.
- Decorative blobs with no connection to the logo or travel routes.
- Lorem ipsum.
- Rewriting client text without permission.
- Using shadcn defaults as the final visual identity.
- Adding too many animations.
- Generic stock-photo tourism clichés.

Prefer:

- Clear hierarchy.
- Brand blue and green as anchors.
- Warm off-white backgrounds.
- Route, path, mobility and wayfinding motifs.
- Professional but human photography.
- Strong spacing and readable text.
- Components that feel designed specifically for Carioca Viagens.

## Acceptance criteria

A successful result should feel:

- More refined than the old presentation.
- More brand-specific than the newer presentation.
- Professional enough for corporate travel clients.
- Warm enough to preserve personalized service.
- Digital, responsive and polished.
- Not generic or obviously AI-generated.
