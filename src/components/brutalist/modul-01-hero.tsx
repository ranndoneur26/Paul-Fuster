"use client";
import { useState, useRef, useEffect } from "react";
import { useLang } from "@/components/brutalist/lang-context";

// =====================================================================
// TYPES
// =====================================================================

type StemId = "stem-1" | "stem-2" | "stem-3";

interface Stem {
  id: StemId;
  ref: string;
  mat: { ca: string; en: string };
  title: { ca: string; en: string };
  desc: { ca: string; en: string };
  cue: { ca: string; en: string };
  defaultVolume: number;
}

interface StemState {
  playing: boolean;
  volume: number;
  reverb: boolean;
}

interface StemAudioEntry {
  stemGain: GainNode;
  reverbSend: GainNode;
  cleanup: () => void;
}

interface StringController {
  stop: () => void;
  setDistortion?: (n: number) => void;
}

// =====================================================================
// STEMS DATA
// =====================================================================

const STEMS: Stem[] = [
  {
    id: "stem-1",
    ref: "01.A",
    mat: { ca: "ACER / XAPA DE COTXE", en: "STEEL / CAR BODY SHEET" },
    title: { ca: "HOTSPOT #1 — Acer / Elèctric", en: "HOTSPOT #1 — Steel / Electric" },
    desc: {
      ca: "Xapa de cotxe reciclada soldada al clàxon. Timbre metàl·lic cru, distorsió sense filtres. Loop continu d'acord elèctric + guspires.",
      en: "Recycled car body sheet welded to the resonator. Raw metallic timbre, unfiltered distortion. Continuous loop of electric chord + sparks.",
    },
    cue: { ca: "STEM ACER/ELÈCTRIC", en: "STEM STEEL/ELECTRIC" },
    defaultVolume: 50,
  },
  {
    id: "stem-2",
    ref: "01.B",
    mat: { ca: "FUSTA / CORDES", en: "WOOD / STRINGS" },
    title: { ca: "HOTSPOT #2 — Fusta / Acústic", en: "HOTSPOT #2 — Wood / Acoustic" },
    desc: {
      ca: "Mast de fusta trobada al riu Llobregat. Cordes de niló monofilament. Loop continu de puntejada acústica.",
      en: "Driftwood mast found in the Llobregat river. Monofilament nylon strings. Continuous loop of acoustic plucking.",
    },
    cue: { ca: "STEM FUSTA/ACÚSTIC", en: "STEM WOOD/ACOUSTIC" },
    defaultVolume: 50,
  },
  {
    id: "stem-3",
    ref: "01.C",
    mat: { ca: "QUADRE DE TUBS", en: "STEEL TUBE FRAME" },
    title: { ca: "HOTSPOT #3 — Quadre de tubs / Soroll de soldadura", en: "HOTSPOT #3 — Tube Frame / Welding Noise" },
    desc: {
      ca: "Quadre de tubs d'acer soldat (gira en bici 2013). Loop continu de soroll de soldadura — xiulet agut + guspires metàl·liques aleatòries.",
      en: "Welded steel tube frame (bicycle tour 2013). Continuous welding noise loop — high-frequency hiss + random metallic sparks.",
    },
    cue: { ca: "LOOP SOROLL DE SOLDADURA", en: "WELDING NOISE LOOP" },
    defaultVolume: 60,
  },
];

// Guitar tuning EADGBE high → low (index 0 = high E at top of drawing)
const GUITAR_NOTES = [
  { index: 0, note: "E4", freq: 329.63 },
  { index: 1, note: "B3", freq: 246.94 },
  { index: 2, note: "G3", freq: 196.0 },
  { index: 3, note: "D3", freq: 146.83 },
  { index: 4, note: "A2", freq: 110.0 },
  { index: 5, note: "E2", freq: 82.41 },
];

// =====================================================================
// BILINGUAL T DICTIONARY
// =====================================================================

const T: Record<
  "ca" | "en",
  {
    module: string;
    title: string;
    subtitle: string;
    scale: string;
    origin: string;
    drawing: string;
    format: string;
    sheet: string;
    instructions: string;
    description: string;
    mixerTitle: string;
    mixerHint: string;
    playing: string;
    stopped: string;
    play: string;
    stop: string;
    vol: string;
    reverb: string;
    on: string;
    off: string;
    stopAll: string;
    noStem: string;
    est: string;
    standBy: string;
    stemPlaying: string;
    ready: string;
    liveMono: string;
    planLabel: string;
    noStemsActive: string;
    stemsActive: string;
    openBio: string;
  }
> = {
  ca: {
    module: "MÒDUL · 01",
    title: "PLÀNOL MECÀNIC D'INICI",
    subtitle: "HERO INTERACTIVE GRID",
    scale: "ESC. 1:1 · NORMALITZAT",
    origin: "ORIGEN · 0,0",
    drawing: "PLÀNOL: PF-HERO-001",
    format: "FORMAT: A3 LANDSCAPE",
    sheet: "FULL 01/05",
    instructions: "INSTRUCCIONS D'ÚS",
    description:
      "Aquest és un esquema vectorial de la guitarra de reciclatge i del quadre de bicicleta soldat al taller de Cardona. Cliqueu sobre les peces per iniciar o aturar els loops d'àudio — els 3 stems poden sonar simultàniament. El mesclador de sota permet ajustar el volum i la reverberació de cada so per separat.",
    mixerTitle: "MESCLADOR · 3 STEMS",
    mixerHint: "INTENSITAT + REVERBERACIÓ PER CADA SO",
    playing: "EN MARXA",
    stopped: "ATURAT",
    play: "▶ INICIAR",
    stop: "◼ ATURAR",
    vol: "VOL",
    reverb: "REVERB",
    on: "ON",
    off: "OFF",
    stopAll: "◼ ATURAR TOT",
    noStem: "▒ CAP STEM ACTIU — CLIQUEU UN HOTSPOT O ▶ INICIAR",
    est: "EST",
    standBy: "STAND-BY",
    stemPlaying: "STEM ACTIU",
    ready: "READY",
    liveMono: "LIVE · WEB AUDIO API · MONO · 32BIT",
    planLabel: "PLÀNOL",
    noStemsActive: "0/3 STEMS ACTIUS",
    stemsActive: "{n}/3 STEMS ACTIUS",
    openBio: "▼ OBRIR BIOGRAFIA COMPLETA",
  },
  en: {
    module: "MODULE · 01",
    title: "MECHANICAL PLAN OF ENTRY",
    subtitle: "HERO INTERACTIVE GRID",
    scale: "SCALE 1:1 · NORMALIZED",
    origin: "ORIGIN · 0,0",
    drawing: "PLAN: PF-HERO-001",
    format: "FORMAT: A3 LANDSCAPE",
    sheet: "SHEET 01/05",
    instructions: "OPERATING INSTRUCTIONS",
    description:
      "This is a vector drawing of the recycling guitar and the welded bicycle frame built at the Cardona workshop. Click on the parts to start or stop the audio loops — all 3 stems can play simultaneously. The mixer below lets you adjust the volume and reverb of each sound independently.",
    mixerTitle: "MIXER · 3 STEMS",
    mixerHint: "INTENSITY + REVERB PER SOUND",
    playing: "PLAYING",
    stopped: "STOPPED",
    play: "▶ START",
    stop: "◼ STOP",
    vol: "VOL",
    reverb: "REVERB",
    on: "ON",
    off: "OFF",
    stopAll: "◼ STOP ALL",
    noStem: "▒ NO STEM ACTIVE — CLICK A HOTSPOT OR ▶ START",
    est: "EST",
    standBy: "STAND-BY",
    stemPlaying: "STEM PLAYING",
    ready: "READY",
    liveMono: "LIVE · WEB AUDIO API · MONO · 32BIT",
    planLabel: "PLAN",
    noStemsActive: "0/3 STEMS ACTIVE",
    stemsActive: "{n}/3 STEMS ACTIVE",
    openBio: "▼ OPEN FULL BIOGRAPHY",
  },
};

// =====================================================================
// AUDIO SYNTHESIS FUNCTIONS
// =====================================================================

/**
 * Creates a stereo decaying-noise impulse response buffer for the convolver.
 */
function createReverbIR(ctx: AudioContext, duration = 2.5, decay = 2.5): AudioBuffer {
  const sr = ctx.sampleRate;
  const len = Math.max(1, Math.floor(sr * duration));
  const ir = ctx.createBuffer(2, len, sr);
  for (let c = 0; c < 2; c++) {
    const ch = ir.getChannelData(c);
    for (let i = 0; i < len; i++) {
      const t = i / len;
      ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, decay);
    }
  }
  return ir;
}

/**
 * STEM 1 — Steel / Electric
 * Distorted sawtooth chord (E2 + B2 + E3) through a tanh WaveShaper
 * with 4x oversample, plus band-passed noise sparks every 700ms.
 */
function createSteelElectric(ctx: AudioContext, dest: AudioNode): () => void {
  let stopped = false;

  // WaveShaper (tanh distortion, 4x oversample)
  const shaper = ctx.createWaveShaper();
  shaper.oversample = "4x";
  const curve = new Float32Array(1024);
  for (let i = 0; i < 1024; i++) {
    const x = i / 512 - 1; // -1..1
    curve[i] = Math.tanh(x * 3);
  }
  shaper.curve = curve;
  shaper.connect(dest);

  // Continuous sawtooth chord (E2=82.4, B2=123.5, E3=164.8)
  const freqs = [82.4, 123.5, 164.8];
  const oscs: OscillatorNode[] = freqs.map((f) => {
    const o = ctx.createOscillator();
    o.type = "sawtooth";
    o.frequency.value = f;
    const g = ctx.createGain();
    g.gain.value = 0.18;
    o.connect(g);
    g.connect(shaper);
    try {
      o.start();
    } catch (e) {
      /* noop */
    }
    return o;
  });

  // Band-passed noise bursts every 700ms (sparks)
  const sparkTimer = () => {
    if (stopped) return;
    try {
      const dur = 0.08;
      const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
      const ch = buf.getChannelData(0);
      for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 3500;
      bp.Q.value = 1.2;
      const g = ctx.createGain();
      g.gain.value = 0.18;
      src.connect(bp);
      bp.connect(g);
      g.connect(dest);
      src.start();
      src.stop(ctx.currentTime + dur);
    } catch (e) {
      /* noop */
    }
    setTimeout(sparkTimer, 700);
  };
  setTimeout(sparkTimer, 100);

  return () => {
    stopped = true;
    try {
      oscs.forEach((o) => {
        try {
          o.stop();
        } catch (e) {
          /* noop */
        }
      });
    } catch (e) {
      /* noop */
    }
  };
}

/**
 * STEM 2 — Wood / Acoustic (slap bass)
 * Deep bass slap loop at E1 = 41.20Hz. Each slap (every 700ms) has:
 *   1. THUMP — 50ms noise burst through lowpass @ 200Hz, gain 0.9
 *   2. BODY — sine @ 41.20Hz with 5ms attack + 600ms exp decay, peak 0.9
 *            2nd harmonic @ 82.41Hz peak 0.27, 300ms decay. Lowpass @ 300Hz Q=4.
 *   3. POP — 8ms noise burst through highpass @ 1500Hz, gain 0.45,
 *            delayed 20ms after the thump.
 */
function createSlapBass(ctx: AudioContext, dest: AudioNode): () => void {
  let stopped = false;

  const playSlap = (when: number) => {
    if (stopped) return;
    try {
      // THUMP
      const tDur = 0.05;
      const tBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * tDur), ctx.sampleRate);
      const tCh = tBuf.getChannelData(0);
      for (let i = 0; i < tCh.length; i++) tCh[i] = Math.random() * 2 - 1;
      const tSrc = ctx.createBufferSource();
      tSrc.buffer = tBuf;
      const tLp = ctx.createBiquadFilter();
      tLp.type = "lowpass";
      tLp.frequency.value = 200;
      const tG = ctx.createGain();
      tG.gain.value = 0.9;
      tSrc.connect(tLp);
      tLp.connect(tG);
      tG.connect(dest);
      tSrc.start(when);
      tSrc.stop(when + tDur);

      // BODY (sine @ 41.20Hz + 2nd harmonic @ 82.41Hz) through shared lowpass Q=4 @ 300Hz
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 300;
      lp.Q.value = 4;

      const g1 = ctx.createGain();
      g1.gain.setValueAtTime(0.0001, when);
      g1.gain.exponentialRampToValueAtTime(0.9, when + 0.005);
      g1.gain.exponentialRampToValueAtTime(0.0001, when + 0.6);
      const o1 = ctx.createOscillator();
      o1.type = "sine";
      o1.frequency.value = 41.2;
      o1.connect(g1);
      g1.connect(lp);

      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0.0001, when);
      g2.gain.exponentialRampToValueAtTime(0.27, when + 0.005);
      g2.gain.exponentialRampToValueAtTime(0.0001, when + 0.3);
      const o2 = ctx.createOscillator();
      o2.type = "sine";
      o2.frequency.value = 82.41;
      o2.connect(g2);
      g2.connect(lp);

      lp.connect(dest);
      o1.start(when);
      o1.stop(when + 0.7);
      o2.start(when);
      o2.stop(when + 0.35);

      // POP — delayed 20ms after thump
      const pDur = 0.008;
      const pBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * pDur), ctx.sampleRate);
      const pCh = pBuf.getChannelData(0);
      for (let i = 0; i < pCh.length; i++) pCh[i] = Math.random() * 2 - 1;
      const pSrc = ctx.createBufferSource();
      pSrc.buffer = pBuf;
      const pHp = ctx.createBiquadFilter();
      pHp.type = "highpass";
      pHp.frequency.value = 1500;
      const pG = ctx.createGain();
      pG.gain.value = 0.45;
      pSrc.connect(pHp);
      pHp.connect(pG);
      pG.connect(dest);
      const popWhen = when + 0.02;
      pSrc.start(popWhen);
      pSrc.stop(popWhen + pDur);
    } catch (e) {
      /* noop */
    }
  };

  const loop = () => {
    if (stopped) return;
    playSlap(ctx.currentTime);
    setTimeout(loop, 700);
  };
  setTimeout(loop, 100);

  return () => {
    stopped = true;
  };
}

/**
 * STEM 3 — Welding noise loop
 * Continuous hiss (1.5s noise loop, bandpass @ 4500Hz, gain 0.12)
 * + random sharp bursts (0.15s noise with exp decay, bandpass @ 7000Hz Q=3,
 * gain 0.5) every 80-360ms. 35% chance of a double-shot.
 */
function createWeldingLoop(ctx: AudioContext, dest: AudioNode): () => void {
  let stopped = false;

  // Continuous hiss
  const hissBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 1.5), ctx.sampleRate);
  const hc = hissBuf.getChannelData(0);
  for (let i = 0; i < hc.length; i++) hc[i] = Math.random() * 2 - 1;
  const hiss = ctx.createBufferSource();
  hiss.buffer = hissBuf;
  hiss.loop = true;
  const hissBp = ctx.createBiquadFilter();
  hissBp.type = "bandpass";
  hissBp.frequency.value = 4500;
  hissBp.Q.value = 0.7;
  const hissG = ctx.createGain();
  hissG.gain.value = 0.12;
  hiss.connect(hissBp);
  hissBp.connect(hissG);
  hissG.connect(dest);
  try {
    hiss.start();
  } catch (e) {
    /* noop */
  }

  const burst = () => {
    if (stopped) return;
    try {
      const dur = 0.15;
      const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
      const ch = buf.getChannelData(0);
      for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 7000;
      bp.Q.value = 3;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.5, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      src.connect(bp);
      bp.connect(g);
      g.connect(dest);
      src.start();
      src.stop(ctx.currentTime + dur);

      // Double-shot (35% chance)
      if (Math.random() < 0.35) {
        const when2 = ctx.currentTime + 0.05 + Math.random() * 0.05;
        try {
          const buf2 = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
          const ch2 = buf2.getChannelData(0);
          for (let i = 0; i < ch2.length; i++) ch2[i] = Math.random() * 2 - 1;
          const src2 = ctx.createBufferSource();
          src2.buffer = buf2;
          const bp2 = ctx.createBiquadFilter();
          bp2.type = "bandpass";
          bp2.frequency.value = 7000;
          bp2.Q.value = 3;
          const g2 = ctx.createGain();
          g2.gain.setValueAtTime(0.5, when2);
          g2.gain.exponentialRampToValueAtTime(0.001, when2 + dur);
          src2.connect(bp2);
          bp2.connect(g2);
          g2.connect(dest);
          src2.start(when2);
          src2.stop(when2 + dur);
        } catch (e) {
          /* noop */
        }
      }
    } catch (e) {
      /* noop */
    }
    setTimeout(burst, 80 + Math.random() * 280);
  };
  setTimeout(burst, 100);

  return () => {
    stopped = true;
    try {
      hiss.stop();
    } catch (e) {
      /* noop */
    }
  };
}

const SYNTH_BUILDERS: Record<StemId, (ctx: AudioContext, dest: AudioNode) => () => void> = {
  "stem-1": createSteelElectric,
  "stem-2": createSlapBass,
  "stem-3": createWeldingLoop,
};

// =====================================================================
// COMPONENT
// =====================================================================

export function HeroModule({ onOpenBio }: { onOpenBio: () => void }) {
  const { lang } = useLang();
  const l = lang.toLowerCase() as "ca" | "en";
  const t = T[l];

  const [stemStates, setStemStates] = useState<Record<StemId, StemState>>({
    "stem-1": { playing: false, volume: STEMS[0].defaultVolume, reverb: false },
    "stem-2": { playing: false, volume: STEMS[1].defaultVolume, reverb: false },
    "stem-3": { playing: false, volume: STEMS[2].defaultVolume, reverb: false },
  });
  const [activeString, setActiveString] = useState<number | null>(null);
  const [hovering, setHovering] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const convolverRef = useRef<ConvolverNode | null>(null);
  const stemAudioRef = useRef<Partial<Record<StemId, StemAudioEntry>>>({});
  const activeStringAudioRef = useRef<StringController | null>(null);
  const activeStringIndexRef = useRef<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // -------- Audio context lazy init --------

  const ensureCtx = (): AudioContext | null => {
    if (typeof window === "undefined") return null;
    if (!audioCtxRef.current) {
      try {
        const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return null;
        const ctx: AudioContext = new Ctor();
        audioCtxRef.current = ctx;

        // masterGain (0.85) → destination
        const master = ctx.createGain();
        master.gain.value = 0.85;
        master.connect(ctx.destination);
        masterGainRef.current = master;

        // convolver with reverb IR → reverbReturn (1) → masterGain
        const conv = ctx.createConvolver();
        conv.buffer = createReverbIR(ctx);
        const reverbReturn = ctx.createGain();
        reverbReturn.gain.value = 1;
        conv.connect(reverbReturn);
        reverbReturn.connect(master);
        convolverRef.current = conv;
      } catch (e) {
        /* noop */
      }
    }
    const ctx = audioCtxRef.current;
    if (ctx && ctx.state === "suspended") {
      try {
        ctx.resume();
      } catch (e) {
        /* noop */
      }
    }
    return ctx;
  };

  // -------- Stem audio control --------

  const startStem = (id: StemId) => {
    const ctx = ensureCtx();
    if (!ctx || !masterGainRef.current || !convolverRef.current) return;
    if (stemAudioRef.current[id]) return; // already running
    try {
      const state = stemStates[id];
      const stemGain = ctx.createGain();
      stemGain.gain.value = state.volume / 100;
      stemGain.connect(masterGainRef.current); // dry

      const reverbSend = ctx.createGain();
      reverbSend.gain.value = state.reverb ? 0.4 : 0;
      stemGain.connect(reverbSend);
      reverbSend.connect(convolverRef.current); // wet

      const cleanup = SYNTH_BUILDERS[id](ctx, stemGain);
      stemAudioRef.current[id] = { stemGain, reverbSend, cleanup };
    } catch (e) {
      /* noop */
    }
  };

  const stopStem = (id: StemId) => {
    const entry = stemAudioRef.current[id];
    if (!entry) return;
    try {
      const ctx = audioCtxRef.current;
      const now = ctx ? ctx.currentTime : 0;
      entry.stemGain.gain.cancelScheduledValues(now);
      entry.stemGain.gain.setValueAtTime(Math.max(0.0001, entry.stemGain.gain.value), now);
      entry.stemGain.gain.linearRampToValueAtTime(0, now + 0.1);
    } catch (e) {
      /* noop */
    }
    setTimeout(() => {
      try {
        entry.cleanup();
      } catch (e) {
        /* noop */
      }
      try {
        entry.stemGain.disconnect();
      } catch (e) {
        /* noop */
      }
      try {
        entry.reverbSend.disconnect();
      } catch (e) {
        /* noop */
      }
    }, 120);
    delete stemAudioRef.current[id];
  };

  const toggleStem = (id: StemId) => {
    const isPlaying = stemStates[id].playing;
    if (isPlaying) {
      stopStem(id);
      setStemStates((prev) => ({ ...prev, [id]: { ...prev[id], playing: false } }));
    } else {
      startStem(id);
      setStemStates((prev) => ({ ...prev, [id]: { ...prev[id], playing: true } }));
    }
  };

  const onVolumeChange = (id: StemId, vol: number) => {
    setStemStates((prev) => ({ ...prev, [id]: { ...prev[id], volume: vol } }));
    const entry = stemAudioRef.current[id];
    const ctx = audioCtxRef.current;
    if (entry && ctx) {
      try {
        const now = ctx.currentTime;
        entry.stemGain.gain.cancelScheduledValues(now);
        entry.stemGain.gain.setValueAtTime(Math.max(0.0001, entry.stemGain.gain.value), now);
        entry.stemGain.gain.linearRampToValueAtTime(vol / 100, now + 0.05);
      } catch (e) {
        /* noop */
      }
    }
  };

  const onReverbToggle = (id: StemId) => {
    const nextReverb = !stemStates[id].reverb;
    setStemStates((prev) => ({ ...prev, [id]: { ...prev[id], reverb: nextReverb } }));
    const entry = stemAudioRef.current[id];
    const ctx = audioCtxRef.current;
    if (entry && ctx) {
      try {
        const now = ctx.currentTime;
        entry.reverbSend.gain.cancelScheduledValues(now);
        entry.reverbSend.gain.setValueAtTime(Math.max(0.0001, entry.reverbSend.gain.value), now);
        entry.reverbSend.gain.linearRampToValueAtTime(nextReverb ? 0.4 : 0, now + 0.1);
      } catch (e) {
        /* noop */
      }
    }
  };

  const stopAll = () => {
    (Object.keys(stemAudioRef.current) as StemId[]).forEach((id) => stopStem(id));
    setStemStates((prev) => {
      const next = { ...prev };
      (Object.keys(next) as StemId[]).forEach((id) => {
        next[id] = { ...next[id], playing: false };
      });
      return next;
    });
  };

  // -------- Guitar strings --------

  const playString = (index: number) => {
    const ctx = ensureCtx();
    if (!ctx || !masterGainRef.current) return;
    // Stop any currently active string first
    if (activeStringIndexRef.current !== null) {
      const prev = activeStringAudioRef.current;
      if (prev) {
        try {
          prev.stop();
        } catch (e) {
          /* noop */
        }
      }
      activeStringAudioRef.current = null;
      activeStringIndexRef.current = null;
    }

    try {
      const note = GUITAR_NOTES[index];
      if (!note) return;
      const now = ctx.currentTime;

      // preGain — permanently HIGH for a dirty/distorted sound like Fuster's recycling guitars.
      // Default 3.0 (heavy distortion); mouse x position pushes it further toward 6.0.
      const preGain = ctx.createGain();
      preGain.gain.value = 3.0;

      // WaveShaper (tanh ×5 — aggressive distortion like the Steel/Electric stem)
      const shaper = ctx.createWaveShaper();
      shaper.oversample = "4x";
      const curve = new Float32Array(1024);
      for (let i = 0; i < 1024; i++) {
        const x = i / 512 - 1;
        curve[i] = Math.tanh(x * 5);
      }
      shaper.curve = curve;

      // Dynamic lowpass: darker for a "brut" character — 3500Hz → 1200Hz over 1.5s
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(3500, now);
      lp.frequency.exponentialRampToValueAtTime(1200, now + 1.5);
      lp.Q.value = 0.7;

      // Output gain
      const outGain = ctx.createGain();
      outGain.gain.value = 0.45;

      // Pluck transient: 50ms noise burst, bandpass @ freq*4
      const pluckDur = 0.05;
      const pluckBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * pluckDur), ctx.sampleRate);
      const pch = pluckBuf.getChannelData(0);
      for (let i = 0; i < pch.length; i++) pch[i] = Math.random() * 2 - 1;
      const pluckSrc = ctx.createBufferSource();
      pluckSrc.buffer = pluckBuf;
      const pluckBp = ctx.createBiquadFilter();
      pluckBp.type = "bandpass";
      pluckBp.frequency.value = note.freq * 4;
      pluckBp.Q.value = 1;
      const pluckG = ctx.createGain();
      pluckG.gain.value = 0.3;
      pluckSrc.connect(pluckBp);
      pluckBp.connect(pluckG);
      pluckG.connect(preGain);

      // Fundamental (triangle) — 6s decay
      const o1 = ctx.createOscillator();
      o1.type = "triangle";
      o1.frequency.value = note.freq;
      const g1 = ctx.createGain();
      g1.gain.setValueAtTime(0.0001, now);
      g1.gain.exponentialRampToValueAtTime(0.5, now + 0.005);
      g1.gain.exponentialRampToValueAtTime(0.0001, now + 6);
      o1.connect(g1);
      g1.connect(preGain);

      // Harmonic 2 (sine) — 3s decay
      const o2 = ctx.createOscillator();
      o2.type = "sine";
      o2.frequency.value = note.freq * 2;
      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0.0001, now);
      g2.gain.exponentialRampToValueAtTime(0.25, now + 0.005);
      g2.gain.exponentialRampToValueAtTime(0.0001, now + 3);
      o2.connect(g2);
      g2.connect(preGain);

      // Harmonic 3 (sine) — 1.5s decay
      const o3 = ctx.createOscillator();
      o3.type = "sine";
      o3.frequency.value = note.freq * 3;
      const g3 = ctx.createGain();
      g3.gain.setValueAtTime(0.0001, now);
      g3.gain.exponentialRampToValueAtTime(0.15, now + 0.005);
      g3.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
      o3.connect(g3);
      g3.connect(preGain);

      // Harmonic 4 (sine) — 0.8s decay
      const o4 = ctx.createOscillator();
      o4.type = "sine";
      o4.frequency.value = note.freq * 4;
      const g4 = ctx.createGain();
      g4.gain.setValueAtTime(0.0001, now);
      g4.gain.exponentialRampToValueAtTime(0.1, now + 0.005);
      g4.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      o4.connect(g4);
      g4.connect(preGain);

      // Chain: preGain → shaper → lp → outGain → master
      preGain.connect(shaper);
      shaper.connect(lp);
      lp.connect(outGain);
      outGain.connect(masterGainRef.current);

      try {
        o1.start(now);
        o1.stop(now + 6.1);
      } catch (e) {
        /* noop */
      }
      try {
        o2.start(now);
        o2.stop(now + 3.1);
      } catch (e) {
        /* noop */
      }
      try {
        o3.start(now);
        o3.stop(now + 1.6);
      } catch (e) {
        /* noop */
      }
      try {
        o4.start(now);
        o4.stop(now + 0.9);
      } catch (e) {
        /* noop */
      }
      try {
        pluckSrc.start(now);
        pluckSrc.stop(now + pluckDur);
      } catch (e) {
        /* noop */
      }

      const controller: StringController = {
        stop: () => {
          try {
            const now2 = ctx.currentTime;
            outGain.gain.cancelScheduledValues(now2);
            outGain.gain.setValueAtTime(Math.max(0.0001, outGain.gain.value), now2);
            outGain.gain.linearRampToValueAtTime(0, now2 + 0.3);
            lp.frequency.cancelScheduledValues(now2);
            lp.frequency.setValueAtTime(Math.max(0.0001, lp.frequency.value), now2);
            lp.frequency.linearRampToValueAtTime(200, now2 + 0.3);
            setTimeout(() => {
              try {
                o1.stop();
              } catch (e) {
                /* noop */
              }
              try {
                o2.stop();
              } catch (e) {
                /* noop */
              }
              try {
                o3.stop();
              } catch (e) {
                /* noop */
              }
              try {
                o4.stop();
              } catch (e) {
                /* noop */
              }
              try {
                preGain.disconnect();
                shaper.disconnect();
                lp.disconnect();
                outGain.disconnect();
              } catch (e) {
                /* noop */
              }
            }, 320);
          } catch (e) {
            /* noop */
          }
        },
        setDistortion: (n: number) => {
          try {
            // Range 2.0..6.0 — always distorted, mouse x adds more
            const v = 2.0 + Math.max(0, Math.min(1, n)) * 4.0;
            preGain.gain.value = v;
          } catch (e) {
            /* noop */
          }
        },
      };
      activeStringAudioRef.current = controller;
      activeStringIndexRef.current = index;
      setActiveString(index);
    } catch (e) {
      /* noop */
    }
  };

  const stopString = (index: number) => {
    if (activeStringIndexRef.current !== index) return;
    const ctrl = activeStringAudioRef.current;
    if (ctrl) {
      try {
        ctrl.stop();
      } catch (e) {
        /* noop */
      }
    }
    activeStringAudioRef.current = null;
    activeStringIndexRef.current = null;
    setActiveString(null);
  };

  const onStringMouseMove = (e: React.MouseEvent) => {
    const svg = svgRef.current;
    const ctrl = activeStringAudioRef.current;
    if (!svg || !ctrl || !ctrl.setDistortion) return;
    try {
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const inv = ctm.inverse();
      // Manual 2D matrix transform: [a c e; b d f] · [x; y; 1]
      const svgX = inv.a * e.clientX + inv.c * e.clientY + inv.e;
      const tt = (svgX - 460) / 340;
      ctrl.setDistortion(tt);
    } catch (err) {
      /* noop */
    }
  };

  // -------- Cleanup on unmount --------

  useEffect(() => {
    return () => {
      // Stop all stem audio
      (Object.keys(stemAudioRef.current) as StemId[]).forEach((id) => {
        const entry = stemAudioRef.current[id];
        if (entry) {
          try {
            entry.cleanup();
          } catch (e) {
            /* noop */
          }
          try {
            entry.stemGain.disconnect();
          } catch (e) {
            /* noop */
          }
          try {
            entry.reverbSend.disconnect();
          } catch (e) {
            /* noop */
          }
        }
      });
      stemAudioRef.current = {};
      // Stop active string
      const ctrl = activeStringAudioRef.current;
      if (ctrl) {
        try {
          ctrl.stop();
        } catch (e) {
          /* noop */
        }
      }
      activeStringAudioRef.current = null;
      activeStringIndexRef.current = null;
      // Close AudioContext
      const ctx = audioCtxRef.current;
      if (ctx) {
        try {
          ctx.close();
        } catch (e) {
          /* noop */
        }
      }
      audioCtxRef.current = null;
      masterGainRef.current = null;
      convolverRef.current = null;
    };
  }, []);

  const activeCount = (Object.keys(stemStates) as StemId[]).filter(
    (id) => stemStates[id].playing
  ).length;
  const activeRefs = STEMS.filter((s) => stemStates[s.id].playing)
    .map((s) => s.ref)
    .join(",");

  return (
    <section id="modul-01" className="bru-border-b bg-white relative" aria-labelledby="modul-01-title">
      {/* Section header */}
      <div className="bru-border-b flex items-stretch">
        <div className="bru-border-r px-3 py-2 text-[10px] uppercase tracking-widest font-bold bg-[#660000] text-white">
          {t.module}
        </div>
        <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-neutral-600 flex-1 flex items-center gap-2">
          <span className="font-bold text-black">{t.title}</span>
          <span className="opacity-50">/</span>
          <span>{t.subtitle}</span>
        </div>
        <div className="hidden md:flex items-center px-3 py-2 text-[10px] uppercase tracking-widest text-neutral-600 bru-border-l">
          {t.scale}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* LEFT: technical drawing */}
        <div className="lg:col-span-8 bru-border-r">
          <div className="relative aspect-[16/10] bg-white bru-grid-fine overflow-hidden">
            {/* Drawing registration annotations */}
            <div className="absolute top-2 left-2 text-[9px] tracking-widest text-neutral-500 flex items-center gap-1 pointer-events-none z-10">
              <span className="inline-block w-3 h-3 border-2 border-black" />
              {t.origin}
            </div>
            <div className="absolute top-2 right-2 text-[9px] tracking-widest text-neutral-500 pointer-events-none z-10">
              {t.drawing}
            </div>
            <div className="absolute bottom-9 left-2 text-[9px] tracking-widest text-neutral-500 pointer-events-none z-10">
              {t.format}
            </div>
            <div className="absolute bottom-9 right-2 text-[9px] tracking-widest text-neutral-500 pointer-events-none z-10">
              {t.sheet}
            </div>

            <svg
              ref={svgRef}
              viewBox="0 0 800 500"
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label={
                l === "ca"
                  ? "Plànol tècnic de la guitarra de reciclatge i el quadre de bicicleta soldat al taller de Cardona"
                  : "Technical drawing of the recycling guitar and the welded bicycle frame built at the Cardona workshop"
              }
            >
              <defs>
                <pattern
                  id="hatch1"
                  width="6"
                  height="6"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(45)"
                >
                  <line x1="0" y1="0" x2="0" y2="6" stroke="#000" strokeWidth="0.6" />
                </pattern>
                <pattern id="dots1" width="8" height="8" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="0.8" fill="#000" />
                </pattern>
                <filter id="sketch">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.012"
                    numOctaves="2"
                    seed="3"
                    result="noise"
                  />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" />
                </filter>
              </defs>

              {/* Bicycle frame (sketched) */}
              <g
                stroke="#000"
                strokeWidth="1.6"
                fill="none"
                strokeLinecap="round"
                opacity="0.85"
                filter="url(#sketch)"
              >
                {/* Main triangle */}
                <line x1="120" y1="350" x2="280" y2="350" />
                <line x1="280" y1="350" x2="320" y2="200" />
                <line x1="120" y1="350" x2="320" y2="200" />
                {/* Rear fork */}
                <line x1="120" y1="350" x2="80" y2="380" />
                {/* Front fork */}
                <line x1="280" y1="350" x2="310" y2="380" />
                {/* Seat post + handlebar post */}
                <line x1="320" y1="200" x2="320" y2="140" />
                <line x1="280" y1="350" x2="270" y2="150" />
                {/* Handlebar */}
                <line x1="270" y1="150" x2="240" y2="135" />
                <line x1="270" y1="150" x2="295" y2="155" />
                {/* Seat */}
                <line x1="320" y1="140" x2="345" y2="140" />
                {/* Wheels */}
                <circle cx="100" cy="380" r="35" />
                <circle cx="100" cy="380" r="30" />
                <circle cx="100" cy="380" r="3" fill="#000" />
                <circle cx="300" cy="380" r="35" />
                <circle cx="300" cy="380" r="30" />
                <circle cx="300" cy="380" r="3" fill="#000" />
                {/* Spokes */}
                {[0, 60, 120, 180, 240, 300].map((a) => {
                  const rad = (a * Math.PI) / 180;
                  return (
                    <g key={`w-${a}`}>
                      <line
                        x1="100"
                        y1="380"
                        x2={100 + 30 * Math.cos(rad)}
                        y2={380 + 30 * Math.sin(rad)}
                      />
                      <line
                        x1="300"
                        y1="380"
                        x2={300 + 30 * Math.cos(rad)}
                        y2={380 + 30 * Math.sin(rad)}
                      />
                    </g>
                  );
                })}
                {/* Welded cargo box behind seat */}
                <rect
                  x="340"
                  y="160"
                  width="80"
                  height="60"
                  fill="url(#hatch1)"
                  stroke="#000"
                  strokeWidth="1.6"
                />
                {/* Amp + guitar inside cargo */}
                <rect x="350" y="170" width="40" height="40" />
              </g>

              {/* Guitar of recycling (sketched) */}
              <g
                stroke="#000"
                strokeWidth="1.6"
                fill="none"
                strokeLinecap="round"
                opacity="0.85"
                filter="url(#sketch)"
              >
                {/* Body shape */}
                <path d="M 460 200 L 600 200 L 620 220 L 620 320 L 600 340 L 460 340 Z" />
                {/* Soundhole (square brutalist) */}
                <rect x="500" y="240" width="60" height="60" />
                <rect x="510" y="250" width="40" height="40" fill="url(#dots1)" stroke="none" />
                {/* Neck */}
                <rect x="620" y="250" width="160" height="40" />
                {/* Headstock */}
                <rect x="780" y="240" width="20" height="60" />
                {/* Tuning pegs */}
                {[0, 1, 2, 3].map((i) => (
                  <circle key={`peg-${i}`} cx="788" cy={250 + i * 14} r="2" fill="#000" />
                ))}
                {/* Visible strings — extends across body and neck */}
                {GUITAR_NOTES.map((n) => (
                  <line
                    key={`vis-str-${n.index}`}
                    x1="460"
                    y1={230 + n.index * 14}
                    x2="800"
                    y2={250 + n.index * 4}
                    stroke="#000"
                    strokeWidth={activeString === n.index ? 1.6 : 0.5}
                  />
                ))}
                {/* Bridge */}
                <rect x="475" y="310" width="120" height="12" />
                {/* License plate */}
                <rect x="475" y="328" width="140" height="10" fill="url(#hatch1)" stroke="none" />
              </g>

              {/* Interactive string hit-areas (outside filter group) */}
              {GUITAR_NOTES.map((n) => (
                <line
                  key={`hit-${n.index}`}
                  x1="460"
                  y1={230 + n.index * 14}
                  x2="800"
                  y2={250 + n.index * 4}
                  stroke="transparent"
                  strokeWidth={12}
                  pointerEvents="all"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => playString(n.index)}
                  onMouseLeave={() => stopString(n.index)}
                  onMouseMove={onStringMouseMove}
                  onClick={() => playString(n.index)}
                />
              ))}

              {/* Note labels at headstock end */}
              {GUITAR_NOTES.map((n) => (
                <text
                  key={`note-${n.index}`}
                  x="795"
                  y={250 + n.index * 4 - 4}
                  textAnchor="end"
                  fontSize="8"
                  fontFamily="monospace"
                  fill="#000"
                >
                  {n.note}
                </text>
              ))}

              {/* Dimension lines (no filter) */}
              <g stroke="#000" strokeWidth="0.6" fill="#000" fontSize="8" fontFamily="monospace">
                <line x1="60" y1="440" x2="340" y2="440" />
                <line x1="60" y1="435" x2="60" y2="445" />
                <line x1="340" y1="435" x2="340" y2="445" />
                <text x="200" y="435" textAnchor="middle" fontSize="8">
                  280 mm
                </text>
                <line x1="460" y1="380" x2="800" y2="380" />
                <line x1="460" y1="375" x2="460" y2="385" />
                <line x1="800" y1="375" x2="800" y2="385" />
                <text x="630" y="375" textAnchor="middle" fontSize="8">
                  340 mm (MAST+BODY)
                </text>
              </g>

              {/* Part callouts */}
              <g fontSize="8" fontFamily="monospace" fill="#000">
                <line x1="510" y1="270" x2="540" y2="160" stroke="#000" strokeWidth="0.6" />
                <circle cx="510" cy="270" r="2" fill="#000" />
                <text x="545" y="158">
                  P.01.A — XAPA RECYCLED/SHEET METAL RECYCLED
                </text>

                <line x1="660" y1="270" x2="700" y2="160" stroke="#000" strokeWidth="0.6" />
                <circle cx="660" cy="270" r="2" fill="#000" />
                <text x="795" y="158" textAnchor="end">
                  P.01.B — MAST FUSTA/WOODEN MAST
                </text>

                <line x1="220" y1="280" x2="180" y2="120" stroke="#000" strokeWidth="0.6" />
                <circle cx="220" cy="280" r="2" fill="#000" />
                <text x="80" y="118">
                  P.01.C — QUADRE TUBS SOLDAT/WELDED STEEL TUBE FRAME
                </text>
              </g>
            </svg>

            {/* Hotspot buttons overlay */}
            {STEMS.map((s, i) => (
              <Hotspot
                key={s.id}
                x={["62%", "80%", "28%"][i]}
                y={["52%", "52%", "58%"][i]}
                stem={s}
                active={stemStates[s.id].playing}
                hovering={hovering === s.id}
                onClick={() => toggleStem(s.id)}
                onHover={(v) => setHovering(v ? s.id : null)}
                l={l}
              />
            ))}

            {/* Status line bottom */}
            <div className="absolute bottom-0 left-0 right-0 bru-border-t bg-white px-3 py-1 flex items-center justify-between text-[10px] uppercase tracking-widest">
              <span className="font-bold">{t.drawing}</span>
              <span className="text-neutral-600">
                {t.est}: {activeCount > 0 ? activeRefs : t.standBy}
                {" · "}
                {activeCount === 0
                  ? t.noStemsActive
                  : t.stemsActive.replace("{n}", String(activeCount))}
              </span>
            </div>
          </div>

          {/* Bio button (below status line, full width, marquee) */}
          <button
            type="button"
            onClick={onOpenBio}
            className="w-full bru-border-t bg-black text-white overflow-hidden bru-pressable hover:bg-neutral-900"
            aria-label={t.openBio}
          >
            <div className="bru-marquee text-xs uppercase tracking-widest py-2">
              <span className="bru-marquee-inner flex items-center">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="px-4">
                    {t.openBio}
                    <span className="opacity-50 ml-4">{"//"}</span>
                  </span>
                ))}
              </span>
            </div>
          </button>
        </div>

        {/* RIGHT: instructions + mixer */}
        <div className="lg:col-span-4 flex flex-col">
          {/* Instructions */}
          <div className="bru-border-b p-4">
            <div className="text-[10px] uppercase tracking-widest text-neutral-600 mb-1">
              {t.instructions}
            </div>
            <h2
              id="modul-01-title"
              className="text-lg font-bold uppercase leading-none tracking-tight mb-2"
            >
              {t.title}
            </h2>
            <p className="text-xs leading-relaxed text-neutral-800">{t.description}</p>
          </div>

          {/* Mixer */}
          <div className="flex-1 bg-black text-white bru-flicker">
            <div className="bru-border-b bru-border-white/30 px-3 py-2">
              <div className="flex items-baseline justify-between">
                <span className="text-[10px] uppercase tracking-widest font-bold">
                  {t.mixerTitle}
                </span>
                <span className="text-[9px] uppercase tracking-widest opacity-70 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 bg-white bru-blink" />
                  {t.ready}
                </span>
              </div>
              <div className="text-[9px] uppercase tracking-widest opacity-60 mt-0.5">
                {t.mixerHint}
              </div>
            </div>

            <ul>
              {STEMS.map((s) => {
                const state = stemStates[s.id];
                return (
                  <li
                    key={s.id}
                    className="bru-border-b bru-border-white/30 last:bru-border-b-0 p-3"
                  >
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <span className="text-[10px] tracking-widest font-bold opacity-80">
                        {s.ref}
                      </span>
                      <span
                        className={`text-[9px] tracking-widest font-bold ${
                          state.playing ? "bru-blink" : "opacity-60"
                        }`}
                      >
                        {state.playing ? t.playing : t.stopped}
                      </span>
                    </div>
                    <div className="text-xs uppercase font-bold mb-1">{s.title[l]}</div>
                    <div className="text-[10px] leading-relaxed opacity-80 mb-2">{s.desc[l]}</div>
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        type="button"
                        onClick={() => toggleStem(s.id)}
                        className="bru-border bru-border-white px-2 py-1 text-[10px] uppercase tracking-widest font-bold bru-pressable hover:bg-white hover:text-black"
                        aria-pressed={state.playing}
                      >
                        {state.playing ? t.stop : t.play}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-[9px] uppercase tracking-widest opacity-70 mb-0.5">
                          <span>{t.vol}</span>
                          <span>{state.volume}</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={state.volume}
                          onChange={(e) => onVolumeChange(s.id, Number(e.target.value))}
                          className="bru-slider bru-slider-dark"
                          aria-label={`${t.vol} ${s.ref}`}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => onReverbToggle(s.id)}
                        className={`bru-border bru-border-white px-2 py-1 text-[10px] uppercase tracking-widest font-bold bru-pressable ${
                          state.reverb ? "bg-white text-black" : "text-white hover:bg-white/10"
                        }`}
                        aria-pressed={state.reverb}
                      >
                        {t.reverb} {state.reverb ? t.on : t.off}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="p-3">
              <button
                type="button"
                onClick={stopAll}
                disabled={activeCount === 0}
                className="w-full bru-border bru-border-white px-3 py-2 text-[10px] uppercase tracking-widest font-bold bru-pressable hover:bg-white hover:text-black disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white"
              >
                {t.stopAll}
              </button>
              <div className="mt-2 text-[9px] uppercase tracking-widest opacity-60 text-center">
                {activeCount === 0 ? t.noStem : t.stemsActive.replace("{n}", String(activeCount))}
              </div>
              <div className="mt-1 text-[9px] uppercase tracking-widest opacity-40 text-center">
                {t.liveMono}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =====================================================================
// HOTSPOT COMPONENT
// =====================================================================

function Hotspot({
  x,
  y,
  stem,
  active,
  hovering,
  onClick,
  onHover,
  l,
}: {
  x: string;
  y: string;
  stem: Stem;
  active: boolean;
  hovering: boolean;
  onClick: () => void;
  onHover: (v: boolean) => void;
  l: "ca" | "en";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
      aria-label={`${stem.ref} — ${stem.title[l]}`}
      aria-pressed={active}
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
      style={{ left: x, top: y }}
    >
      {/* Outer pulsing ring (active) */}
      <span
        className={`absolute inset-0 -m-3 rounded-full border-2 border-black ${
          active ? "bg-black bru-blink" : ""
        } ${hovering ? "scale-110" : ""} transition-transform pointer-events-none`}
      />
      {/* Center dot */}
      <span className={`block w-3 h-3 ${active ? "bg-white" : "bg-black"}`} />
      {/* Label on hover */}
      {hovering && (
        <span className="absolute left-1/2 -translate-x-1/2 -top-7 whitespace-nowrap bru-border bg-white px-1.5 py-0.5 text-[10px] uppercase tracking-widest font-bold pointer-events-none">
          {stem.ref} · {stem.cue[l]}
        </span>
      )}
    </button>
  );
}
