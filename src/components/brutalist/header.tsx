"use client";
import { useState, useEffect } from "react";
import { useLang } from "@/components/brutalist/lang-context";

const MARQUEE = {
  ca: ["▒ INCLASSIFICABLE","▲ TALLER · CARDONA · BAGES. BARCELONA. NEW YORK","■ GIRA EN BICI 2013 · 2.080 KM · 60 LOCALITATS","● PAULS PLANET · IN-EDIT 2013","✚ GO-BETWEEN · MINNESOTA ↔ CATALUNYA","▓ LUTIER DEL REICICLATGE · FUSTA · XAPA · TUBS D'ACER","FILLET BRAZING"],
  en: ["▒ INCLASSIFICABLE","▲ WORKSHOP · CARDONA · BAGES. BARCELONA. NEW YORK","■ BIKE TOUR 2013 · 2,080 KM · 60 LOCALITIES","● PAULS PLANET · IN-EDIT 2013","✚ GO-BETWEEN · MINNESOTA ↔ CATALONIA","▓ LUTHIER OF RECYCLING · WOOD · SHEET METAL · STEEL TUBES","FILLET BRAZING"],
};
const T = {
  ca: { statusOnline:"SYS_STATUS: ONLINE", reg:"REG: PF-ARCHIVE-0001", coord:"COORD:", langAria:"Canvia idioma", module00:"MÒDUL · 00 / CAPÇALERA TÈCNICA", title:"PAUL FUSTER", subtitle:{"//":"//"}+" ARCHIVE & WORKSHOP — CARDONA · BAGES", ref:"REF: PF-2025", inventory:"FULL D'INVENTARI", drawing:"PLÀNOL MECÀNIC" },
  en: { statusOnline:"SYS_STATUS: ONLINE", reg:"REG: PF-ARCHIVE-0001", coord:"COORD:", langAria:"Change language", module00:"MODULE · 00 / TECHNICAL HEADER", title:"PAUL FUSTER", subtitle:{"//":"//"}+" ARCHIVE & WORKSHOP — CARDONA · BAGES", ref:"REF: PF-2025", inventory:"WORKSHOP INVENTORY SHEET", drawing:"MECHANICAL DRAWING" },
};

export function Header({ lang, onLangToggle }: { lang: "CA"|"EN"; onLangToggle: () => void }) {
  const [time, setTime] = useState("");
  const coords = "41.9130° N · 1.6854° E";
  useEffect(() => {
    const tick = () => { const d = new Date(); const p = (n:number) => String(n).padStart(2,"0"); setTime(`${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())} UTC`); };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);
  const l = lang.toLowerCase() as "ca"|"en";
  const t = T[l]; const items = MARQUEE[l];
  const sub = "// ARCHIVE & WORKSHOP — CARDONA · BAGES";
  return (
    <header className="bru-border-b bg-white sticky top-0 z-50">
      <div className="bru-border-b text-[10px] tracking-widest uppercase px-3 py-1 flex items-center justify-between gap-3 bg-white">
        <div className="flex items-center gap-2"><span className="inline-block w-2 h-2 bg-black bru-blink" />{t.statusOnline}</div>
        <div className="hidden md:flex items-center gap-3 text-neutral-600"><span>{t.reg}</span><span className="opacity-50">·</span><span>UTC {time||"--:--:--"}</span><span className="opacity-50">·</span><span>{t.coord} {coords}</span></div>
        <button onClick={onLangToggle} className="bru-border px-2 py-0.5 bru-pressable hover:bg-black hover:text-white font-bold" aria-label={t.langAria}>
          <span className={lang==="CA"?"":"opacity-50"}>CA</span><span className="opacity-50 mx-1">/</span><span className={lang==="EN"?"":"opacity-50"}>EN</span>
        </button>
      </div>
      <div className="px-3 md:px-6 py-3 md:py-5 flex items-end justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="text-[10px] tracking-[0.3em] uppercase text-neutral-600 mb-1">{t.module00}</div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold uppercase leading-none tracking-tight">{t.title}</h1>
          <div className="text-xs md:text-sm tracking-widest uppercase mt-1 text-neutral-700">{"//"} ARCHIVE &amp; WORKSHOP — CARDONA · BAGES</div>
        </div>
        <div className="hidden md:block bru-border-l bru-border-t bru-border-r bru-border-b p-2 text-[10px] uppercase tracking-widest leading-tight">
          <div className="font-bold">{t.ref}</div><div className="text-neutral-600">{t.inventory}</div><div className="text-neutral-600">{t.drawing}</div>
        </div>
      </div>
      <div className="bru-border-t bg-black text-white overflow-hidden py-1">
        <div className="bru-marquee text-[10px] md:text-xs uppercase tracking-widest">
          <span className="bru-marquee-inner flex items-center">
            {items.map((s,j) => (<span key={j} className="px-4">{s} <span className="opacity-50">{"//"}</span></span>))}
          </span>
        </div>
      </div>
    </header>
  );
}
