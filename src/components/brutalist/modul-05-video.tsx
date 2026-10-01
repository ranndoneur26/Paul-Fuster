"use client";
import { useState } from "react";
import { useLang } from "@/components/brutalist/lang-context";
type VideoType = "TRAILER"|"TV"|"LIVE";
interface VideoItem { ref:string; tipus:VideoType; titol:string; origen:string; any:number; durada:string; desc:{ca:string;en:string}; directors?:string; platform:"VIMEO"|"YOUTUBE"; embedUrl:string; embedTitle:string; }
const VIDEOS: VideoItem[] = [
  { ref:"V.01", tipus:"TRAILER", titol:"PAULS PLANET", origen:"FESTIVAL IN-EDIT 2013", any:2013, durada:"—", desc:{ca:"Tràiler del llargmetratge documental sobre la gira en bicicleta de Paul Fuster pel Repte. Sense filtres ni censura: el taller, la duresa del trajecte i testimonis del seu entorn creatiu i familiar.",en:"Trailer of the feature documentary on Paul Fuster's bicycle tour for Repte. Unfiltered: the workshop, the hardship of the journey and testimonies from his creative and family circle."}, directors:"dir. Aleix Barba & Marc Sirisi", platform:"VIMEO", embedUrl:"https://player.vimeo.com/video/76268878?h=28d5a55ed6", embedTitle:"Pauls Planet — Tràiler (Vimeo)" },
  { ref:"V.02", tipus:"TV", titol:"SPUTNIK — ENTREVISTA + ACTUACIÓ", origen:"CANAL 33 · TV3", any:1999, durada:"23M", desc:{ca:"Primera aparició a televisió pública. Entrevista durant la promoció de 'Battleship' i actuació acústica en directe a l'estudi.",en:"First appearance on public TV. Interview during the 'Battleship' promotion and acoustic live performance at the studio."}, platform:"YOUTUBE", embedUrl:"https://www.youtube.com/embed/0RleEW0Xqf0?si=-IZbTqClx9mjdnRG", embedTitle:"Sputnik — Paul Fuster (YouTube)" },
  { ref:"V.03", tipus:"LIVE", titol:"LES FERES", origen:"ESTUDI CASAFONT · NAVÈS", any:2012, durada:"—", desc:{ca:"En directe des de l'estudi de Casafont i El Pujol de la Vall d'Ora, a Navès.",en:"Live from the Casafont studio and El Pujol, in Vall d'Ora, Navès."}, platform:"YOUTUBE", embedUrl:"https://www.youtube.com/embed/YIx1KsnJXtU?si=ukSbsUM-OGnx1e2m", embedTitle:"Les Feres — Paul Fuster (YouTube)" },
];
const TYPE_LABELS: Record<VideoType,{ca:string;en:string}> = { TRAILER:{ca:"TRÀILER",en:"TRAILER"}, TV:{ca:"TV",en:"TV"}, LIVE:{ca:"DIRECTE",en:"LIVE"} };
const T = {
  ca: { module:"MÒDUL · 05", title:"ARXIU DOCUMENTAL I MITJANS — VIDEO VAULT", library:"HEMEROTECA AUDIOVISUAL", player:"REPRODUCTOR INTEGRAT", title2:"LLANÇADORA DE VÍDEO", sources:"HEMEROTECA · FONTS AUDIOVISUALS", description:"Llançadora integrada que funciona com a hemeroteca audiovisual. Accés directe al tràiler de Pauls Planet (In-Edit 2013), l'aparició històrica a Sputnik (Canal 33, 1999) i la sessió en directe de Les Feres des de Navès.", sourcesList:"FONTS — {n} REGISTRES", activeRecord:"REGISTRE ACTIU", ref:"REF", sourceLabel:"FONT", runtime:"DURADA / ANY", directors:"DIRECTORS", note:"▒ FONT: {src} · {platform} EMBED DIRECTE · REPRODUIBLE A LA PREVIEW", noVideo:"▒ SENSE VÍDEO SELECCIONAT" },
  en: { module:"MODULE · 05", title:"DOCUMENTARY ARCHIVE & MEDIA — VIDEO VAULT", library:"AUDIOVISUAL LIBRARY", player:"EMBEDDED PLAYER", title2:"VIDEO LAUNCHER", sources:"LIBRARY · AUDIOVISUAL SOURCES", description:"Integrated launcher working as an audiovisual library. Direct access to the Pauls Planet trailer (In-Edit 2013), the historic Sputnik appearance (Canal 33, 1999) and the live session of Les Feres from Navès.", sourcesList:"SOURCES — {n} RECORDS", activeRecord:"ACTIVE RECORD", ref:"REF", sourceLabel:"SOURCE", runtime:"RUNTIME / YEAR", directors:"DIRECTORS", note:"▒ SOURCE: {src} · {platform} DIRECT EMBED · PLAYABLE IN PREVIEW", noVideo:"▒ NO VIDEO SELECTED" },
};
export function VideoModule() {
  const { lang } = useLang();
  const l = lang.toLowerCase() as "ca"|"en";
  const t = T[l];
  const [selected, setSelected] = useState<VideoItem | null>(VIDEOS.find(v=>v.ref==="V.03") ?? VIDEOS[0]);
  return (
    <section id="modul-05" className="bru-border-b bg-white" aria-labelledby="modul-05-title">
      <div className="bru-border-b flex items-stretch">
        <div className="bru-border-r px-3 py-2 text-[10px] uppercase tracking-widest font-bold bg-[#330033] text-white">{t.module}</div>
        <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-neutral-600 flex-1 flex items-center"><span className="font-bold text-black">{t.title}</span></div>
        <div className="hidden md:flex items-center px-3 py-2 text-[10px] uppercase tracking-widest text-neutral-600 bru-border-l">{t.library}</div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-8 bru-border-r">
          <div className="p-4">
            <div className="text-[10px] uppercase tracking-widest text-neutral-600 mb-1">{t.player}</div>
            <h2 id="modul-05-title" className="text-xl font-bold uppercase leading-none tracking-tight mb-3">{t.title2}</h2>
            <div className="relative aspect-video bg-black bru-border overflow-hidden">
              {selected ? (
                <iframe className="w-full h-full" src={selected.embedUrl} title={selected.embedTitle} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
              ) : (<div className="absolute inset-0 flex items-center justify-center text-white text-xs uppercase tracking-widest opacity-60">▒ {t.noVideo}</div>)}
            </div>
            {selected && (
              <div className="mt-3 bru-border p-2 bg-white">
                <div className="flex items-baseline justify-between gap-2 mb-1 flex-wrap"><span className="text-xs uppercase tracking-widest font-bold">{selected.ref} · {selected.titol}</span><span className="text-[10px] uppercase tracking-widest text-neutral-600">{selected.any} · {selected.durada}</span></div>
                {selected.directors && <div className="text-[10px] uppercase tracking-widest text-neutral-700 mb-2">{selected.directors}</div>}
                <p className="text-xs leading-relaxed">{selected.desc[l]}</p>
                <div className="mt-2 text-[10px] uppercase tracking-widest text-neutral-600">{t.note.replace("{src}",selected.origen).replace("{platform}",selected.platform)}</div>
              </div>
            )}
          </div>
        </div>
        <div className="lg:col-span-4 flex flex-col">
          <div className="bru-border-b p-4"><div className="text-[10px] uppercase tracking-widest text-neutral-600 mb-1">{t.sources}</div><p className="text-xs leading-relaxed text-neutral-800">{t.description}</p></div>
          <div className="bru-border-b">
            <div className="px-4 py-2 text-[10px] uppercase tracking-widest bg-neutral-100 bru-border-b font-bold">{t.sourcesList.replace("{n}",String(VIDEOS.length))}</div>
            <ul>
              {VIDEOS.map((v) => (
                <li key={v.ref} className={`bru-border-b last:bru-border-b-0 ${selected?.ref===v.ref?"bg-black text-white":"bg-white"}`}>
                  <button onClick={() => setSelected(v)} className="w-full text-left px-4 py-2 bru-pressable hover:bg-neutral-200">
                    <div className="flex items-baseline justify-between gap-2"><span className="text-[10px] tracking-widest font-bold opacity-80">{v.ref}</span><span className="text-[10px] tracking-widest opacity-70 uppercase">{TYPE_LABELS[v.tipus][l]} · {v.platform}</span></div>
                    <div className="text-xs uppercase font-bold mt-1">{v.titol}</div>
                    <div className="text-[10px] tracking-widest opacity-70 mt-0.5">{v.origen} · {v.any} · {v.durada}</div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 bg-black text-white flex-1 bru-flicker">
            <div className="text-[10px] uppercase tracking-widest opacity-60 mb-2">{t.activeRecord}</div>
            {selected && (
              <div>
                <div className="text-[10px] uppercase tracking-widest opacity-60">{t.ref}</div>
                <div className="text-xs font-bold uppercase">{selected.ref} · {TYPE_LABELS[selected.tipus][l]}</div>
                <div className="text-[10px] uppercase tracking-widest opacity-60 mt-2">{t.sourceLabel}</div>
                <div className="text-xs">{selected.origen}</div>
                <div className="text-[10px] uppercase tracking-widest opacity-60 mt-2">{t.runtime}</div>
                <div className="text-xs">{selected.durada} · {selected.any}</div>
                {selected.directors && (<><div className="text-[10px] uppercase tracking-widest opacity-60 mt-2">{t.directors}</div><div className="text-xs">{selected.directors}</div></>)}
                <div className="text-[10px] uppercase tracking-widest opacity-60 mt-3">PLATFORM</div>
                <div className="text-xs font-bold">{selected.platform}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
