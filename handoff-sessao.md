# Session Handoff — Carioca Viagens: mockup iteration (Editorial+Wayfinding synthesis) through v3, plus screenshot tooling

## Where it started
Session began with a structure diagnostic of the Carioca Viagens project (CLAUDE.md, design-brief.md, project-card.md, conteudo-apresentacao.md), found the folder mostly correct after Pedro removed some stray pre-built design assets. From there it moved into building and iterating static HTML mockups in `design/mocks/`, explicitly not implementing the final site and not creating `design/design.md` yet — Pedro has been deferring that lock until the layout direction is settled.

## Decisions locked + what shipped
- Official brand hex colors locked in `G:\Pedro\Brain\01_Projetos\Carioca Viagens\design-brief.md`: Carioca Blue `#2E83C5`, Green `#71B73B`, Light Blue `#51B6E8`, Light Green `#9DC86C`, Graphite `#615E5D`, Light Graphite `#7B7B79`. Yellow explicitly excluded from the confirmed palette. Deep Blue documented as a derived-darkened-shade of Carioca Blue, not an invented color.
- WCAG contrast fact recorded in design-brief.md: Light Graphite on off-white `#F7F3EC` = 3.83:1 (ok for large text/labels, fails 4.5:1 for small body text — use Graphite there instead, 5.81:1).
- Real logo assets confirmed usable from `references/` — colored versions for light backgrounds, `*-lettering-claro.svg` (horizontal/vertical) for dark backgrounds, used at large size directly (no plate/box behind them per Pedro's instruction).
- Three original direction mockups (`01-airport-wayfinding.html`, `02-corporate-carioca.html`, `03-editorial-journey.html`) updated in place with real logo + official colors; Direction 2 got a "route-divider" (mountain+wave) motif added so it wouldn't read as a generic landing page.
- A 4th "synthesis" direction was built and iterated three times based on explicit Pedro feedback, converging on `04-sintese-editorial-wayfinding-v3.html` — Editorial Journey as structural/tonal base, Airport Wayfinding contributes only microtypography/signage details (IBM Plex Mono, utility strip, RIO·GIG chip, dotted hero border, checkmarks, chips), Corporate Carioca explicitly NOT used as a visual base.
- v3-specific changes: eyebrows left-aligned at 0.85rem while titles/text centered per section; inline "Carioca Viagens" chip restyled (0.95rem, 2px 8px padding, weight 500); Atendimento section rebuilt as centered green rounded cards using real Google Material Symbols icons (`volunteer_activism`, `airplane_ticket`, `handshake`) loaded via Google Fonts; Contato rebuilt with 3-line address (incl. CEP `22230-001`, supplied directly by Pedro, not from `conteudo-apresentacao.md`), a hand-drawn WhatsApp icon distinct from the phone icon, Facebook stacked under Instagram, and the two contato columns height-equalized via flex `space-between`; Operacional's block divider lost its visible line, keeping only spacing.
- Documented a reusable technique for full-page screenshots of local static HTML in `G:\Pedro\Brain\10_Knowledge\Screenshots de página inteira em ambiente de dev local — Playwright e as armadilhas do vh.md`, and referenced it by **absolute path** from this project's `CLAUDE.md` (a relative reference was tried first and Pedro correctly flagged it as ambiguous across sessions).

## Key files for next session
- `G:\Pedro\Brain\01_Projetos\Carioca Viagens\design\mocks\04-sintese-editorial-wayfinding-v3.html` — current best/latest synthesis mockup, read this first.
- `G:\Pedro\Brain\01_Projetos\Carioca Viagens\design-brief.md` — locked color palette + contrast rules.
- `G:\Pedro\Brain\01_Projetos\Carioca Viagens\CLAUDE.md` — workflow rules, incl. the screenshot-tooling pointer.
- `G:\Pedro\Brain\10_Knowledge\Screenshots de página inteira em ambiente de dev local — Playwright e as armadilhas do vh.md` — required reading before taking any more screenshots.
- `G:\Pedro\Brain\01_Projetos\Carioca Viagens\references\` — contains all real logo variants and every screenshot generated this session (`screenshot-01/02/03-*-v2.png`, `screenshot-04-sintese-editorial-wayfinding.png` / `-v2.png` / `-v3.png`).
- No plan file drove this session (no `.planning/` or `~/.claude/plans` artifact was used).

## Running state
- Background processes: none. Every `python -m http.server` instance started for screenshotting (shell IDs `b97dzl8zf`, `b0ffvg42e`, `b9p6i48ba`, `b0mo8g839`, `bthcfs03x`) was stopped via `TaskStop` immediately after use.
- Dev servers / ports: none currently running.
- Open worktrees / branches: none touched this session (a pre-existing worktree `G:\Pedro\Brain\.worktrees\correcao-ciclo-memoria` was noticed while locating the hand-off skill, but not used or modified).
- Python env note: `playwright` was `pip install`-ed this session (not present before). Browser automation uses `channel="chrome"` (the system-installed Chrome), so no extra Chromium download was needed.

## Verification — how to confirm things still work
- Open any file in `design/mocks/` directly via double-click (`file://`) — logo images use relative paths (`../../references/...`) so they resolve without a server.
- To regenerate a screenshot: serve the project root with `python -m http.server <port>` from `G:\Pedro\Brain\01_Projetos\Carioca Viagens`, then run a Playwright script with `viewport={"width":1536,"height":900}` and `page.screenshot(..., full_page=True)` — see the 10_Knowledge note for the exact snippet and why the viewport height must stay "normal" (not resized to page height).

## Deferred + open questions
- Deferred: `design/design.md` — explicitly not created yet; Pedro has repeated this instruction across the whole session.
- Deferred: typography — still unlocked/exploratory across all four mockups by design.
- Open: Pedro said he has a prepared prompt for "a próxima etapa e fase" involving animations, video, and images, to be started once the layout is settled — that prompt has not been shared yet.
- Open (low-stakes): the CEP `22230-001` in the v3 Contato section came directly from Pedro's instruction, not from `conteudo-apresentacao.md` — flagged to him already, no pushback received yet.

## Pick up here
Wait for Pedro's prepared next-phase prompt (animations/video/images); no action pending on the mockups themselves unless he requests another round of adjustments to v3 first.
