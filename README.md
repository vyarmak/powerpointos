# PowerPointOS.com — Satirical Product Site + Bootable Mini-OS

## Overview
PowerPointOS.com is a **satirical marketing site for a fictional operating system "built on PowerPoint"** — the premise being that in PowerPoint everything always works, so we shipped an OS with no bugs, no crashes, no missed deadlines, and where every command succeeds. It is a deadpan enterprise-SaaS parody that never breaks character.

The experience has two parts:
1. **A polished single-page marketing site** (the "product page").
2. **A fullscreen, interactive bootable mini-desktop demo** launched from the primary CTA "Boot PowerPointOS" — a fake OS where everything succeeds, with an always-visible "Return to reality" affordance.

A key feature is a **live theme switcher** offering three complete visual aesthetics (Glass / Cyber / Retro) that swap palette, typography, and decorative layers while keeping all copy, structure, and interactions identical.

## About the Design Files
The files in this bundle are **design references created in vanilla HTML/CSS/JS** — a working prototype showing intended look and behavior, **not production code to copy directly**. The task is to **recreate these designs in the target codebase's environment** (React, Vue, Svelte, etc.) using its established patterns, component libraries, and conventions. If no environment exists yet, choose the most appropriate framework (a component-based SPA like React or Vue is well-suited here) and implement there.

That said: this prototype is unusually complete and framework-agnostic (no build step, no dependencies). The CSS token system and the content/data layer (`js/data.js`) are directly portable. The interaction logic is plain DOM code that maps cleanly onto component state.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, motion, and interactions are all specified and implemented. Recreate the UI pixel-perfectly. All three themes are fully realized via CSS custom properties — see Design Tokens.

---

## Architecture at a Glance

```
index.html               # Markup shell: nav, landing sections, boot overlay, OS overlay
css/themes.css           # Theme token system (3 themes) + ambient decorative layers
css/landing.css          # Landing page styles
css/desktop.css          # Bootable OS desktop, windows, dialogs, boot sequence
js/data.js               # ALL copy/content (taglines, features, terminal responses, etc.)
js/landing.js            # Landing behaviors: theme switch, counters, rotator, parallax, confetti
js/apps.js               # The 7 OS apps (window content builders)
js/desktop.js            # OS orchestrator: boot, window manager, dock, dialogs, BSOS
favicon.svg / og.svg     # Original slide+checkmark wordmark assets
```

**Recommended component breakdown for a framework port:**
- `<ThemeProvider>` — holds active theme (`a`/`b`/`c`), applies `data-theme` to root, persists to localStorage.
- Landing sections as components: `<Nav>`, `<Hero>`, `<StatsBand>`, `<FeatureGrid>`, `<DemoInvite>`, `<DayInLife>`, `<Testimonials>`, `<Pricing>`, `<Footer>`.
- `<BootSequence>` — fullscreen overlay, skippable, reduced-motion aware.
- `<Desktop>` — wallpaper, menubar, icon grid, dock, and a `<WindowManager>`.
- `<Window>` — draggable/resizable chrome wrapping per-app content.
- App components: `<Terminal>`, `<NewProject>`, `<TaskManager>`, `<Meeting>`, `<RecycleBin>`, `<Antivirus>`, `<Settings>`.
- `<SystemDialog>`, `<BlueSlideOfSuccess>`, `<Confetti>` (canvas).

---

## Screens / Views

### 1. Landing — Nav (sticky)
- **Layout**: Sticky top bar, `padding: 16px 28px`, space-between. Translucent background `color-mix(in srgb, var(--bg) 72%, transparent)` with `backdrop-filter: blur(18px)`, bottom border `1px solid color-mix(in srgb, var(--text) 8%, transparent)`.
- **Left**: Brand — 30×30 SVG wordmark (slide rectangle + checkmark) + "PowerPoint**OS**" (the "OS" is heavier weight). Font `var(--font-display)`, 19px, weight 700.
- **Right**: Nav links (Features / A Day In / Pricing) at 14px `var(--text-dim)`; a **theme switcher** pill group (Glass / Cyber / Retro); primary CTA "Boot PowerPointOS".
- **Theme switcher**: rounded pill container, three buttons; active button has `background: var(--grad)` and dark text; inactive are `var(--text-faint)`. Mono font, 11px, uppercase, letter-spacing .06em.
- **Responsive**: below 860px, non-CTA links hide.

### 2. Landing — Hero
- **Layout**: 2-col grid `1.05fr .95fr`, gap 48px, `padding: 90px 0 60px`, max-width 1200px centered.
- **Left column**:
  - Eyebrow pill: dot (success-green, glowing) + "PowerPointOS™ 2025.∞ · Generally Available, Specifically Perfect". Mono 12px uppercase, letter-spacing per `--label-spacing`.
  - H1: `clamp(44px, 6.4vw, 92px)`, line-height .98, weight `var(--display-weight)`. Text: "The operating system where **everything works.**" — "everything works." uses gradient text fill (`var(--grad)` clipped to text).
  - **Rotating tagline** (`#rotator`): single line, height 1.4em, overflow hidden. Cycles every 3s with a vertical slide+fade (incoming from `translateY(100%)`, outgoing to `translateY(-100%)`, 0.6s ease). Taglines listed in Content.
  - CTA row: primary "▸ Boot PowerPointOS" (btn-lg), ghost "Download Reality 2.0" (btn-lg).
  - Trust line: "✓ No credit card. No bugs. No reason it wouldn't work." Mono 13px, faint.
- **Right column (`#heroPreview`)**: a glass card (aspect 16/11, `var(--radius-lg)`) containing a **static mini-OS thumbnail** (painted by `paintMiniOS()` — a tiny rendition of the desktop with menubar, icons, an open terminal window, and a dock). Three **floating cards** absolutely positioned around it (build passing / 0 bugs·0 incidents·∞ uptime / deadline met). 
  - **Parallax**: on pointermove over the preview, the glass card rotates (`rotateY(x*9deg) rotateX(-y*9deg)`) and each float-card translates by its `data-depth` (22/34/46px). Resets on pointerleave. Disabled under reduced-motion.

### 3. Landing — Stats Band
- **Layout**: full-width band, top+bottom hairline borders. 5-col grid; each stat has a left hairline divider (first none). Below 900px → 2 cols, no dividers.
- **Stats** (numbers animate when scrolled into view, threshold 0.4):
  - "**0** bugs shipped. Ever." — *gag counter*: counts UP to 1,487 over ~1.1s, pauses ~350ms, then counts back DOWN to 0 over ~500ms and stays 0.
  - "**0** viruses detected. There is nothing to detect." (same gag)
  - "**100%** of deadlines met · ∞% of stretch goals exceeded." (counts up to 100%, with `%` suffix)
  - "**N/A** mean time to recovery — nothing has ever failed." (static, no animation)
  - "**1.0s** average build time, including coffee." (counts to 1.0, 1 decimal, `s` suffix)
- **Number style**: `var(--font-display)`, weight 700, `clamp(30px, 3.4vw, 46px)`, letter-spacing -.02em. Caption: `var(--text-dim)`, 13px.

### 4. Landing — Feature Grid ("Why PowerPointOS")
- **Section head**: label "Why PowerPointOS" (accent, mono uppercase) + H2 "Enterprise-grade certainty, shipped by default." + supporting paragraph.
- **Grid**: 4 cols (→2 at 1000px →1 at 560px), gap 16px. Each card: glass panel, `padding: 26px 24px 28px`, `var(--radius)`. Icon tile 42×42 (`var(--grad-soft)` bg, accent glyph), H3 (18px) with trademark superscript in accent, body `var(--text-dim)` 14px.
- **Hover**: `translateY(-6px)`, border → accent, adds `var(--glow)`.
- **8 features** (see Content for full copy): SlideKernel™, ZeroBug Architecture®, Deadline Compliance Engine, Synergy Scheduler, Infinite Undo, Alignment Daemon, 100% Uptime, AutoComplete Projects.

### 5. Landing — Demo Invite
- Centered section: label "Live Desktop", H2 "See an OS that has never once said no.", paragraph, then a framed 16/9 preview (the same mini-OS thumbnail) with a centered radial-dimmed overlay holding a large "▸ Boot PowerPointOS" button.

### 6. Landing — A Day In PowerPointOS
- **Layout**: 2-col grid (→1 at 800px), gap 22px. Two cards, each with a header (label + H3 + description) and a **live looping demo** in a dark inset panel.
- **Card 1 — Terminal**: auto-types commands and shows green success output, looping. Sequence: `rm -rf /`, `deploy --no-tests`, `git push --force`, `make it-work`. Typewriter effect ~38ms/char with a blinking cursor.
- **Card 2 — New Project**: auto-loops a build — a progress bar fills while 6 steps check off one-by-one, bar turns gold at 100%, then shows "✅ Shipped 3 days before you started.", pauses, repeats.

### 7. Landing — Testimonials
- Section head + 2-col grid (→1 at 760px) of glass quote cards. Each: large quote (`var(--font-display)`, 19px), then avatar (initials in gradient circle) + name + role. 4 quotes (see Content).

### 8. Landing — Pricing
- Section head + 4-col grid (→2 at 1000px →1 at 540px). Four tiers (Intern / Professional / Enterprise / Founder). "Professional" is **featured** (accent border + glow). Each: tier name (accent mono), price (32px display), sub-line, feature list with green checkmarks, CTA button (featured = primary, others = ghost). Clicking any pricing CTA fires confetti + a checkmark bloom (it has `data-celebrate`).
- **Hover**: `translateY(-6px)`, border → accent.

### 9. Landing — Footer
- Brand + tagline column, then 3 link columns (Product / Company / Legal) with joke links. Fine-print block (mono 12px, faint) with the dramatization disclaimers and the **parody disclaimer** (states it is an original parody, not affiliated with any real software/company). Copyright line ends with a green ✓.

---

### 10. Boot Sequence (`#boot`)
- Triggered by ANY "Boot PowerPointOS" CTA (`[data-action="boot"]`). Fullscreen `z-index: 300`, near-black `#04060b`, left-aligned, mono font.
- Logo lockup (54px wordmark + "PowerPointOS™" 30px), then **loading lines** appear one at a time (~360ms apart) each ending in green "ok"; a progress bar fills alongside. Lines: Mounting /optimism · Calibrating buzzwords · Disabling bugs (permanently) · Aligning stakeholders · Loading SlideKernel™ · Synergizing · Pre-meeting all deadlines · **✓ Ready.**
- Then prompt "Press any key to succeed." pulses. Any keydown or click enters the desktop.
- **Skip button** (bottom-right) jumps straight to the desktop.
- **Reduced-motion**: all lines render instantly, bar full, then prompt.
- **Important**: boot lines have resting `opacity: 1` and only animate a slide (`bootIn` shifts `translateX`), so a frozen first frame / print / reduced-motion still shows them. Do NOT gate visibility on an animation that starts at opacity 0.

### 11. Desktop (`#os`)
- Fullscreen overlay `z-index: 200`. Opens with `.open` (display + opacity). Sets `document.body.overflow = hidden`.
- **Wallpaper**: `var(--bg-grad)` + a soft radial accent glow. Retro theme adds horizontal CRT scanlines. Centered faint wordmark + "Everything Works Edition".
- **Menubar** (top, 34px): brand + menu items (File / Succeed / Ship / Help (not needed)); right side shows "● All systems perfect" (green), a live clock, and the **"✕ Return to reality"** exit button.
- **Desktop icons** (top-left column): one per app, 92px wide, 46×46 glyph tile + label. Click opens the app.
- **Dock** (bottom-center): glass pill with the 4 core apps, a separator, 3 extra apps, another separator, and an "⟱ Check for updates" button. Hover lifts each icon (`translateY(-10px) scale(1.12)`) and shows a tooltip; running apps show a green dot beneath.
- **On first boot**, Terminal auto-opens, then New Project (~300ms / 700ms later).

### 12. Windows (`.win`)
- Glass panel, `var(--window-radius)`. **Titlebar** (40px, `cursor: grab`) with 3 traffic-light dots (close #ff5f57 / minimize #febc2e / maximize #28c840 — square corners in Cyber/Retro themes) and a mono title with accent glyph. **Body** scrolls.
- **Window manager behavior**:
  - Open: if already open, just focus (raise z-index); else create, cascade-position (centered + offset by open-count), build content, raise.
  - **Close / Minimize**: both remove the window (with a `.closing` scale-fade, 240ms) and clear the dock running-dot. Calls the body's `_cleanup()` if present (e.g. Meeting clears its interval).
  - **Maximize**: toggles between cascaded size and near-fullscreen (inset 14px / top 44px), stored via `dataset.max`.
  - **Focus**: pointerdown raises z-index (`++zTop`).
  - **Drag**: pointerdown on titlebar (ignored if on `.win-dots`) → pointer capture → move updates `left/top`, clamped so the window stays reachable (top ≥ 40px).
- **CRITICAL BUG TO AVOID** (learned during build): the system-dialog backdrop (`.dlg-scrim`) sits at `z-index: 80`, above windows. When NOT shown it MUST have `pointer-events: none` (only `.show` restores `pointer-events: auto`). Otherwise the invisible scrim swallows every window click and drag. In a framework port, only mount/enable the scrim when a dialog is actually open.
- Window entrance animates **transform only** (opacity stays 1) so frozen frames/exports remain visible.

### 13. The 7 Apps
1. **Terminal** (`>_`, 560×400) — input row at bottom; every Enter echoes the command then prints a green success line. Hardcoded responses for ~25 commands (see `termResponses` in data.js); unknown commands return "✅ Success. (We weren't sure what that did, but it worked.)". Commands matching `deploy|ship|push|make|new|build` also fire confetti. Matching is exact-key first, then longest-prefix, then unknown fallback. HTML-escape user input.
2. **New Project** (`◇`, 520×440) — 3 stages: (a) template picker (4 templates), (b) build — progress bar fills as 6 steps check off, bar turns gold, (c) done card: 🎉 + "<Template> is live." + tags [Built · Tested · Deployed · Profitable · Acquired] + buttons "Build another" / "Brag about it" (the latter triggers the Blue Slide of Success). Fires confetti on completion.
3. **Task Manager** (`◷`, 520×360) — a table of 5 processes (Success etc.), all 0% CPU, green status, tiny green usage bars. Footer: "CPU 0% · Memory 32 KB · Threats 0 · Vibes immaculate · Nothing is wrong, and nothing ever was."
4. **Meeting** (`⟳`, 560×440) — a 3×2 grid of participant tiles (avatars, name tags, mute icons), a running clock that never stops, control buttons, and a red "Let's take this offline" button that opens a dialog ("the meeting continues, forever, in spirit") instead of leaving. Clears its clock interval on close via `_cleanup`.
5. **Recycle Bin / "Out of Scope"** (`🗑`, 460×400) — a dashed drop zone + draggable chips ("Technical debt", "The redesign", etc.). Dropping a chip shows "<item> has been deprioritized to next quarter", fires confetti, then resets the prompt after ~2.2s.
6. **Antivirus / "PerfectGuard™"** (`◉`, 420×400) — a conic-gradient progress ring + percentage + a Scan button. Scanning animates the ring 0→100%, then "0 threats. There has never been a threat. You are safe forever." + confetti.
7. **Settings** (`⚙`, 500×420) — rows of toggles, every one locked ON; clicking a toggle makes it briefly try to turn off then **snaps back to ON**. A difficulty slider stuck on "EASY" — dragging the knob springs it back.

### 14. System Dialogs
- **Generic dialog** (`.dlg-scrim` + `.dlg`): icon tile + title + body + button row. Default content is the "Everything Is Fine" gag (title "Everything Is Fine", body "An unexpected success has occurred.", buttons [Celebrate][Ship It]). Buttons can fire confetti and/or trigger BSOS. Backdrop click closes. **Remember the pointer-events trap above.**
- **Update dialog**: "PowerPointOS is up to date / It was up to date before you checked. … perfection does not patch." Buttons [Astonishing][Thank you].
- **Blue Slide of Success** (`.bsos`, `z-index: 90`, BSOD parody): full-panel happy-blue gradient (different per theme), ":)" face, "Your project completed successfully and unexpectedly early.", a progress bar filling to 100%, "100% complete · 0% concerning", and "Press any key to keep succeeding ▸". Fires confetti on show; any key/click dismisses (wired after a 400ms guard).

---

## Interactions & Behavior

- **Theme switch**: clicking Glass/Cyber/Retro sets `body[data-theme]` to `a`/`b`/`c`, updates active button, persists to `localStorage('ppos-theme')`. On load, restores saved theme. The entire visual system is driven by CSS variables — no per-element rewrites.
- **Tagline rotator**: 3s interval, slide+fade. Stops at one line under reduced-motion.
- **Counters**: animate on scroll into view (IntersectionObserver, threshold 0.4, fires once). The "0" stats do the count-up-then-reset gag. Reduced-motion shows final values immediately.
- **Reveal on scroll**: elements with `.reveal` fade+rise into view (IntersectionObserver threshold 0.12), staggered via inline `transition-delay`.
- **Hero parallax**: pointer-reactive 3D tilt + layered depth; disabled under reduced-motion.
- **Confetti**: shared canvas (`#confetti`, `z-index: 250`, `pointer-events: none`). `window.fireConfetti(x, y)` spawns ~130 gravity particles colored from the current theme's accents + gold. No-op under reduced-motion.
- **Checkmark bloom**: any `[data-celebrate]` click floats a green ✓ upward + fires confetti.
- **Download Reality 2.0**: opens a dialog ("Reality 2.0 is already installed. You are using it right now. … the free tier.") with a button that boots the OS.
- **Boot / exit**: `[data-action="boot"]` boots (or jumps straight to desktop on repeat visits); `[data-action="exit"]` and **Esc** return to reality (Esc ignored while a dialog or BSOS is open).
- **Keyboard**: any key advances the boot prompt and dismisses BSOS; Esc exits the OS.

## State Management
- **Global**: `activeTheme` (a/b/c, persisted), `osOpen` (bool), `hasBooted` (bool — repeat boots skip the sequence).
- **Window manager**: a map of open windows by app id; a running z-index counter; per-window `position {left, top}`, `size {w, h}`, `isMaximized`, and pre-maximize geometry.
- **Per-app local state**: Terminal (command history lines), New Project (stage: pick/build/done + chosen template + progress), Antivirus (scanning + percent), Meeting (elapsed seconds + interval id), Recycle Bin (drag state). 
- **Dialog/BSOS**: open + content payload.
- No data fetching — entirely client-side. All copy lives in the data layer (`js/data.js`).

## Animations & Transitions (key values)
- Spring easing: `cubic-bezier(.2,.9,.25,1.2)`; out easing: `cubic-bezier(.16,1,.3,1)`.
- Tagline cycle: 3s; slide/fade 0.6s. Window close: 240ms scale-fade. Dock hover lift: 0.2s spring. Reveal: 0.7s. Theme cross-transition: ~0.5–0.6s on bg/color/decorative layers.
- Counters ~1.1s up / ~0.5s reset. Boot lines ~360ms cadence. New Project steps ~230ms each; Antivirus ring ~26ms per 4%.
- **All motion must honor `prefers-reduced-motion`** — the prototype shortens/disables every animation and renders end-states directly.

## Responsive Behavior
- Hero collapses to 1 col under 900px (preview moves above copy; the deepest float-card hides). Stats → 2 cols at 900px. Features → 2 cols at 1000px, 1 at 560px. Pricing → 2 at 1000px, 1 at 540px. Testimonials → 1 col at 760px.
- Under 680px the OS adapts: desktop icons become a horizontal row, windows go near-fullscreen with side margins, Meeting grid becomes 2×3, New Project templates single-column. Brief says mobile may simplify the boot demo to a guided, tappable version.

---

## Design Tokens

All tokens are CSS custom properties scoped to `body[data-theme="a|b|c"]`. Port these as theme objects. Shared scalars: `--maxw: 1200px`.

### Theme A — Glass / Spatial (default)
| Token | Value |
|---|---|
| `--bg` | `#0B0D12` |
| `--bg-2` | `#11141c` |
| `--text` | `#EAF0FA` |
| `--text-dim` | `#aab4c8` |
| `--text-faint` | `#6b768c` |
| `--accent` | `#5BA8FF` |
| `--accent-2` | `#9B7BFF` |
| `--accent-3` | `#4FE3D0` |
| `--grad` | `linear-gradient(110deg, #5BA8FF 0%, #9B7BFF 50%, #4FE3D0 100%)` |
| `--success` | `#5dffa0` |
| `--panel-bg` | `rgba(255,255,255,.07)` |
| `--panel-bg-strong` | `rgba(255,255,255,.11)` |
| `--panel-blur` | `26px` |
| `--panel-border` | `1px solid rgba(255,255,255,.14)` |
| `--radius` / `--radius-lg` | `16px` / `26px` |
| `--btn-radius` / `--window-radius` | `12px` / `18px` |
| display font | `-apple-system, BlinkMacSystemFont, 'Space Grotesk', system-ui` |
| mono font | `'JetBrains Mono', ui-monospace` |
| `--display-weight` | `300` |
| decorative | film grain (subtle), no uppercase display |

### Theme B — Cyberpunk Holographic
| Token | Value |
|---|---|
| `--bg` | `#05060A` |
| `--bg-2` | `#090b13` |
| `--text` | `#E9FBFF` |
| `--text-dim` | `#7fa7b8` |
| `--accent` | `#00F0FF` |
| `--accent-2` | `#FF2E97` |
| `--accent-3` | `#7CFF5B` |
| `--grad` | `linear-gradient(110deg, #FF2E97 0%, #b04bff 40%, #00F0FF 100%)` |
| `--success` | `#7CFF5B` |
| `--panel-bg` | `rgba(10,14,26,.55)` |
| `--panel-blur` | `10px` |
| `--panel-border` | `1px solid rgba(0,240,255,.28)` |
| `--radius` / `--radius-lg` | `6px` / `8px` |
| `--btn-radius` / `--window-radius` | `4px` / `6px` |
| display/mono | `'Space Grotesk'` / `'Space Mono'` |
| `--display-weight` | `700`, **uppercase** display |
| decorative | scanlines, synthwave grid horizon, neon glow |

### Theme C — Retro-Futurism
| Token | Value |
|---|---|
| `--bg` | `#140a1e` |
| `--bg-2` | `#1c0f2b` |
| `--text` | `#FFF3E8` |
| `--text-dim` | `#d3a9c8` |
| `--accent` | `#FF8A3D` |
| `--accent-2` | `#FF3DAE` |
| `--accent-3` | `#19C7C7` |
| `--grad` | `linear-gradient(110deg, #FF3DAE 0%, #FF8A3D 50%, #19C7C7 100%)` |
| `--success` | `#5dffb0` |
| `--panel-bg` | `rgba(33,16,48,.62)` |
| `--panel-blur` | `8px` |
| `--panel-border` | `1px solid rgba(255,138,61,.35)` |
| `--radius` / `--radius-lg` | `10px` / `14px` |
| `--btn-radius` / `--window-radius` | `8px` / `10px` |
| display/mono | `'Orbitron'` / `'Space Mono'` |
| `--display-weight` | `800`, **uppercase** display |
| decorative | starfield, CRT scanlines, chrome grid horizon, sunset gradients |

### Traffic-light dot colors (windows)
Close `#ff5f57` · Minimize `#febc2e` · Maximize `#28c840` (square corners in themes B/C).

### Fonts (Google Fonts)
`Space Grotesk` (300–700), `Space Mono` (400/700), `Orbitron` (500–900), `JetBrains Mono` (400/500/700). Glass theme prefers the system font stack first.

---

## Assets
- **`favicon.svg`** — original wordmark: rounded slide rectangle filled with the theme gradient + a checkmark. **Original parody mark — not Microsoft's logo, no Microsoft marks.** Reuse this as the app logo throughout.
- **`og.svg`** — 1200×630 social/OG card with the wordmark, headline, and three ✓ stat lines.
- No raster images, icon fonts, or third-party icon libs — all glyphs are Unicode characters (`▤ ◇ ◷ ⟳ ↶ ▦ ◉ ⌁ >_ ⚙ 🗑`) rendered in the mono font. In a real codebase, consider swapping these for your icon system, but keep the deadpan look.
- Confetti is drawn on a `<canvas>`; no asset needed.

## Content / Copy
**All user-facing copy is the joke** and must be preserved verbatim — it lives in `js/data.js` (taglines, 8 features, 4 testimonials, 4 pricing tiers, ~25 terminal command→response pairs, 4 New Project templates, 6 build steps) and inline in `index.html` (hero, section heads, footer fine print, boot lines, dialog text). Treat `js/data.js` as the content source of truth and port it as a data module. Do not paraphrase — specificity is the comedy.

## Legal Note
"PowerPoint" is a Microsoft trademark; this is **parody**. Keep it clearly satirical, use the original "PowerPointOS" wordmark only, and never use Microsoft's actual logo or marks. The footer fine print already carries the parody disclaimer — keep it.

## Files in this bundle
- `index.html` — markup shell
- `css/themes.css`, `css/landing.css`, `css/desktop.css`
- `js/data.js`, `js/landing.js`, `js/apps.js`, `js/desktop.js`
- `favicon.svg`, `og.svg`

Open `index.html` directly in a browser to interact with the working reference (no build step, no dependencies).
