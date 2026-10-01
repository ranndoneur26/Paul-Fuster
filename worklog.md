# Worklog

## 2024 — modul-01-hero.tsx (complete rewrite)

**File:** `/home/z/my-project/src/components/brutalist/modul-01-hero.tsx`

**Task:** Complete from-scratch rewrite of the brutalist B/W Paul Fuster hero module as an interactive mechanical-plan with Web Audio API.

### What was implemented

1. **Types & data**
   - `StemId` union type (`"stem-1" | "stem-2" | "stem-3"`)
   - `Stem` interface with bilingual `{ca,en}` fields: `mat`, `title`, `desc`, `cue` + `defaultVolume`
   - `STEMS` array (3 entries: Steel/Electric, Wood/Acoustic, Welding noise)
   - `GUITAR_NOTES` array (EADGBE tuning, high→low: E4/B3/G3/D3/A2/E2)

2. **Bilingual `T` dictionary** — full CA/EN strings for module header, drawing annotations, mixer UI, status messages, bio-button label, etc.

3. **Audio synthesis (Web Audio API)**
   - `createReverbIR(ctx, duration=2.5, decay=2.5)` — stereo decaying-noise impulse response
   - `createSteelElectric(ctx, dest)` — distorted sawtooth chord (E2/B2/E3) through tanh WaveShaper (4× oversample) + band-passed noise sparks every 700 ms
   - `createSlapBass(ctx, dest)` — E1=41.20 Hz slap loop (THUMP noise + BODY sine + 2nd harmonic + POP noise)
   - `createWeldingLoop(ctx, dest)` — continuous hiss (bandpass @ 4500 Hz) + random sharp bursts (bandpass @ 7000 Hz, Q=3) every 80–360 ms, 35% double-shot chance
   - `SYNTH_BUILDERS` map wiring StemId → builder

4. **`HeroModule({ onOpenBio })` component**
   - State: `stemStates` (playing/volume/reverb per stem), `activeString`, `hovering`
   - Refs: `audioCtxRef`, `masterGainRef`, `convolverRef`, `stemAudioRef`, `activeStringAudioRef`, `activeStringIndexRef`, `svgRef`
   - `ensureCtx()` lazy-init AudioContext (masterGain 0.85 → destination, convolver + reverbReturn 1 → masterGain), resumes if suspended
   - Stem control: `startStem`, `stopStem`, `toggleStem`, `onVolumeChange`, `onReverbToggle`, `stopAll`
   - Guitar strings: `playString` (additive synthesis — pluck transient + triangle fundamental 6 s decay + 3 sine harmonics 3/1.5/0.8 s + dynamic lowpass 5000→1500 Hz + tanh WaveShaper with `setDistortion(n)` method on the controller), `stopString` (300 ms gain+lowpass fade), `onStringMouseMove` (manual DOMMatrix 2-D inverse transform to map client → SVG coords, `t = (svgX-460)/340` → `setDistortion(t)`)
   - `useEffect` cleanup stops all stem audio + closes AudioContext on unmount

5. **Render structure**
   - Section header with `bg-[#660000] text-white` badge
   - `lg:grid-cols-12` grid: left `col-span-8` technical drawing, right `col-span-4` instructions + mixer
   - SVG `viewBox="0 0 800 500"` over `bru-grid-fine` background with `defs` for `hatch1`, `dots1`, and `sketch` filter (feTurbulence baseFrequency=0.012 numOctaves=2 seed=3 + feDisplacementMap scale=2.2)
   - Sketched bicycle frame group + sketched guitar group (6 visible strings, stroke 0.5 default / 1.6 when active)
   - Interactive string hit-areas (transparent lines, `strokeWidth=12`, `pointerEvents="all"`, `onMouseEnter/Leave/Move/Click`) OUTSIDE the filter group
   - Note labels at headstock end, dimension lines, part callouts (P.01.A/B/C)
   - Status line at bottom (drawing label + EST: ref/STAND-BY + active stem count)
   - Bio button BELOW status line (full-width, `bru-border-t`, `bru-marquee` text repeating `t.openBio` 3× separated by `//`)
   - Right column: instructions panel + mixer panel (`bg-black text-white bru-flicker`) with 3 stem rows (status badge, title+desc, play/stop toggle, `bru-slider bru-slider-dark` volume 0–100, reverb ON/OFF toggle) and Stop-All button (disabled when 0 active)

6. **`Hotspot` sub-component** — absolutely positioned button with pulsing ring (`bru-blink` when active), white/black center dot, hover label showing `ref · cue` in the active language.

### Verification

- `bun run lint` → 0 errors (after wrapping `//` separator in `{"//"}` to avoid the `react/jsx-no-comment-textnodes` rule)
- `npx tsc --noEmit` → no errors in `modul-01-hero.tsx` (remaining errors are in unrelated `examples/` and `skills/` files)
- Dev server (`bun run dev`) compiles and serves `/` with HTTP 200

### Notes

- Audio is lazily initialised on first user interaction (browser autoplay-policy friendly).
- All Web Audio calls wrapped in `try/catch` with `/* noop */` comments.
- Component accepts the `onOpenBio: () => void` prop as expected by `src/app/page.tsx`.
- The badge colour `bg-[#660000]` is the requested dark-red (60% black + 40% red).
