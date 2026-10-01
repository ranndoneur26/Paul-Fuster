"use client";
import { useLang } from "@/components/brutalist/lang-context";
const T = {
  ca: { location:"LOCALITZACIÓ", license:"LLICÈNCIA", noArtifice:"SENSE ARTIFICIS", openLicense:"LLICÈNCIA OBERTA — FER SERVIR I REAPROFITAR", workshopProd:"PRODUCCIÓ DE TALLER · SENSE FILTRES", goBetween:"GO-BETWEEN · MINNESOTA ↔ CATALUNYA", prototype:"BY VAN DE CUL / XICOLA", maternalRoots:"ARRELS MATERNES — VILA DES DE 1080", contact:"CONTACTE", contactHint:"PER CONTACTE DIRECTE — RESPOSTA AL TALLER", eof:"EOF · FITXER TANCAT", back:"▲ TORNAR A L'ORIGEN (MÒDUL 01)" },
  en: { location:"LOCATION", license:"LICENSE", noArtifice:"NO ARTIFICE", openLicense:"OPEN LICENSE — USE & REPURPOSE", workshopProd:"WORKSHOP PRODUCTION · NO FILTERS", goBetween:"GO-BETWEEN · MINNESOTA ↔ CATALONIA", prototype:"BY VAN DE CUL / XICOLA", maternalRoots:"MATERNAL ROOTS — TOWN DATING TO 1080", contact:"CONTACT", contactHint:"DIRECT CONTACT — REPLY FROM THE WORKSHOP", eof:"EOF · FILE CLOSED", back:"▲ BACK TO ORIGIN (MODULE 01)" },
};
export function Footer() {
  const { lang } = useLang();
  const l = lang.toLowerCase() as "ca"|"en";
  const t = T[l];
  return (
    <footer className="bg-black text-white mt-auto">
      <div className="h-2 bru-hatch" />
      <div className="px-3 md:px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="text-[10px] uppercase tracking-widest opacity-60 mb-1">{t.location}</div>
          <div className="text-lg font-bold uppercase leading-none">CARDONA · BAGES</div>
          <div className="text-[10px] uppercase tracking-widest opacity-70 mt-1">41.9130° N · 1.6854° E · 504 m</div>
          <div className="text-[10px] uppercase tracking-widest opacity-50 mt-3">{t.maternalRoots}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest opacity-60 mb-1">{t.license}</div>
          <div className="text-lg font-bold uppercase leading-none">{t.noArtifice}</div>
          <div className="text-[10px] uppercase tracking-widest opacity-70 mt-1">{t.openLicense}</div>
          <div className="text-[10px] uppercase tracking-widest opacity-50 mt-3">{t.workshopProd}</div>
        </div>
        <div>
          <div className="text-lg font-bold uppercase leading-none">PAUL FUSTER</div>
          <div className="text-[10px] uppercase tracking-widest opacity-70 mt-1">{t.goBetween}</div>
          <div className="text-[10px] uppercase tracking-widest opacity-50 mt-3">{t.prototype}</div>
        </div>
      </div>
      <div className="bru-border-t border-white/40 px-3 md:px-6 py-3 flex flex-wrap items-center justify-between gap-2 text-[10px] uppercase tracking-widest">
        <div className="flex flex-col"><span className="opacity-60">{t.contact}</span><span className="opacity-50 text-[9px]">{t.contactHint}</span></div>
        <div className="flex flex-wrap items-center gap-2">
          <a href="https://www.instagram.com/paul_fuster/" target="_blank" rel="noopener noreferrer" className="text-sm font-bold tracking-widest lowercase bru-border border-white/60 px-3 py-1 bru-pressable hover:bg-white hover:text-black" aria-label="Instagram @paul_fuster">@paul_fuster</a>
          <a href="mailto:paulfustermusic@gmail.com" className="text-sm font-bold tracking-widest lowercase bru-border border-white/60 px-3 py-1 bru-pressable hover:bg-white hover:text-black">paulfustermusic@gmail.com</a>
        </div>
      </div>
      <div className="bru-border-t border-white/40 px-3 py-2 text-[10px] uppercase tracking-widest opacity-70 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3"><span className="inline-block w-2 h-2 bg-white bru-blink" />{t.eof}</div>
        <div className="hidden md:block opacity-50">PF-ARCHIVE-0001 · SHEET 01/05 · NORMALIZED</div>
        <a href="#modul-01" className="hover:text-white bru-pressable underline-offset-2 hover:underline">{t.back}</a>
      </div>
    </footer>
  );
}
