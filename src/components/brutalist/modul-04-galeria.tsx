"use client";
import { useState } from "react";
import { useLang } from "@/components/brutalist/lang-context";
interface Foto { ref:string; titol:{ca:string;en:string}; tema:{ca:string;en:string}; desc:{ca:string;en:string}; src:string; photographer?:string; }
const FOTOS: Foto[] = [
  { ref:"C.01", titol:{ca:"TALL I SOLDADURA DE TUBS",en:"WELDING OF STEEL TUBES"}, tema:{ca:"TALLER · ACER",en:"WORKSHOP · STEEL"}, desc:{ca:"Tubs d'acer tallats i soldats a la caixa pedalier amb el sistema de soldadura «fillet brazing». Taller de Cardona.",en:"Steel tubes cut and fillet-brazed to the bottom bracket shell. Cardona workshop."}, src:"/gallery/filled_brazing.png" },
  { ref:"C.02", titol:{ca:"MUNTATGE DE GUITARRA",en:"GUITAR ASSEMBLY"}, tema:{ca:"LUTERIA · FUSTA",en:"LUTHIERY · WOOD"}, desc:{ca:"Muntatge d'una guitarra de reciclatge: mast de fusta trobada al riu Llobregat + xapa de portó.",en:"Assembly of a recycling guitar: driftwood mast + recycled car door sheet."}, src:"/gallery/paul-fuster-4.png" },
  { ref:"C.03", titol:{ca:"LLIMES",en:"FILES"}, tema:{ca:"VITAL · BAGES",en:"VITAL · BAGES"}, desc:{ca:"Les llimes i més llimes que permeten eliminar restes i sobrants del metall i deixar un acabat impecable.",en:"Files and more files that allow removing metal residues to leave a flawless finish."}, src:"/gallery/llimes.png" },
  { ref:"C.04", titol:{ca:"DIRECTE A SORT",en:"LIVE AT SORT"}, tema:{ca:"GIRA · 2013",en:"TOUR · 2013"}, desc:{ca:"Instantània de Fuster en el seu Cargo Bike en una de les etapes del tour de Pauls Planet.",en:"Snapshot of Fuster on his Cargo Bike in one of the stages of the Pauls Planet tour."}, src:"/gallery/pau-fuster-cargo.png" },
  { ref:"C.05", titol:{ca:"Paul Fuster",en:"Paul Fuster"}, tema:{ca:"El Molino · Barcelona",en:"El Molino · Barcelona"}, desc:{ca:"Festival Mil·lenni · 17 de maig de 2017",en:"Festival Mil·lenni · May 17, 2017"}, src:"/gallery/Paul-Fuster-guitar.png", photographer:"Foto Xavi Mercader" },
  { ref:"C.06", titol:{ca:"PROCÉS DE CONSTRUCCIÓ",en:"BUILDING PROCESS"}, tema:{ca:"LUTERIA · BICI",en:"LUTHIERY · BIKE"}, desc:{ca:"Seqüència de soldadura d'una peça per quadre de bicicleta.",en:"Welding sequence of a piece for a bicycle frame."}, src:"/gallery/treballant.png" },
  { ref:"C.07", titol:{ca:"RENTADORA SÒNICA",en:"SONIC WASHING MACHINE"}, tema:{ca:"VITAL · FERRALLA",en:"VITAL · SCRAP METAL"}, desc:{ca:"La feina de lutier més enllà de la percepció tradicional, centrada també en el reciclatge de materials, en aquest cas una rentadora.",en:"The lutier's work beyond traditional perception, also focused on recycling materials — in this case, a washing machine."}, src:"/gallery/paul-rentadora.png" },
  { ref:"C.08", titol:{ca:"DIRECTE NOCTURN",en:"NIGHT LIVE"}, tema:{ca:"REPTE · 2012",en:"REPTE · 2012"}, desc:{ca:"Concert de presentació del disc Repte. Actuació nocturna, il·luminació d'una sola bombeta.",en:"Concert presenting the album Repte. Nighttime performance, single bare bulb as stage lighting."}, src:"/gallery/Repte-tour.png" },
  { ref:"C.09", titol:{ca:"LA VANGUARDIA",en:"LA VANGUARDIA"}, tema:{ca:"PREMSA · BARCELONA",en:"PRESS · BARCELONA"}, desc:{ca:"Retrat de Paul Fuster publicat al diari La Vanguardia.",en:"Portrait of Paul Fuster published in the La Vanguardia newspaper."}, src:"/gallery/Paul-Fuster_2.png", photographer:"Foto Xavi Mercadé - Enderrock.cat /Rockviu.cat" },
];
const T = {
  ca: { module:"MÒDUL · 04", title:"GALERIA D'ARXIU — CALIDOSCOPI", archive:"ARXIU FOTOGRÀFIC · TREBALL MANUAL", name:"CALIDOSCOPI", description:"Imatges que aturen el temps del gest: la soldadura del tub d'acer, el muntatge lent d'una guitarra feta a mà, el soroll i la llum dels concerts. Fotografies que no documenten només un resultat, sinó el pols del procés, la matèria treballada i l'ofici com a forma de llibertat.", archiveFooter:"ARXIU · {n} FOTOGRAFIES", resFooter:"RES · 1024×1024 · PNG · FILTRE B/N", datasheet:"FITXA", close:"✕ TANCAR", titleLabel:"TÍTOL", themeLabel:"TEMA", descLabel:"DESCRIPCIÓ", techFooter:"RES · PF-ARXIV · 1024×1024 · PNG · TRI-X 400 SIM" },
  en: { module:"MODULE · 04", title:"ARCHIVE GALLERY — CALIDOSCOPI", archive:"PHOTOGRAPHIC ARCHIVE · MANUAL WORK", name:"CALIDOSCOPI", description:"Images that freeze the gesture in time: the welding of the steel tube, the slow assembly of a handmade guitar, the sound and light of the concerts. Photographs that document not just a result, but the pulse of the process, the worked matter, and the craft as a form of freedom.", archiveFooter:"ARCHIVE · {n} PHOTOGRAPHS", resFooter:"RES · 1024×1024 · PNG · B&W FILTER", datasheet:"DATASHEET", close:"✕ CLOSE", titleLabel:"TITLE", themeLabel:"THEME", descLabel:"DESCRIPTION", techFooter:"RES · PF-ARCHIVE · 1024×1024 · PNG · TRI-X 400 SIM" },
};
export function GaleriaModule() {
  const { lang } = useLang();
  const l = lang.toLowerCase() as "ca"|"en";
  const t = T[l];
  const [active, setActive] = useState<Foto | null>(null);
  return (
    <section id="modul-04" className="bg-white" aria-labelledby="modul-04-title">
      <div className="bru-border-b flex items-stretch">
        <div className="bru-border-r px-3 py-2 text-[10px] uppercase tracking-widest font-bold bg-[#664c00] text-white">{t.module}</div>
        <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-neutral-600 flex-1 flex items-center"><span className="font-bold text-black">{t.title}</span></div>
      </div>
      <div className="bru-border-b p-4">
        <div className="text-[10px] uppercase tracking-widest text-neutral-600 mb-1">{t.archive}</div>
        <h2 id="modul-04-title" className="text-xl font-bold uppercase leading-none tracking-tight mb-2">{t.name}</h2>
        <p className="text-xs leading-relaxed text-neutral-800">{t.description}</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {FOTOS.map((f) => (
          <button key={f.ref} onClick={() => setActive(f)} className="bru-border-r last:bru-border-r-0 bru-border-b group relative aspect-square bru-pressable hover:bg-neutral-100 text-left bg-white">
            <img src={f.src} alt={f.titol[l]} className="absolute inset-0 w-full h-full object-cover bru-bw" loading="lazy" />
            <div className="absolute top-2 left-2 text-[9px] tracking-widest font-bold bg-white bru-border px-1.5 py-0.5">{f.ref}</div>
            <div className="absolute bottom-2 left-2 right-2 bg-white bru-border px-2 py-1">
              <div className="text-[10px] tracking-widest font-bold uppercase truncate">{f.titol[l]}</div>
              <div className="text-[9px] tracking-widest text-neutral-600 uppercase truncate">{f.tema[l]}</div>
            </div>
          </button>
        ))}
      </div>
      <div className="bru-border-t bg-black text-white px-4 py-2 text-[10px] uppercase tracking-widest flex justify-between">
        <span>{t.archiveFooter.replace("{n}", String(FOTOS.length))}</span>
        <span className="opacity-70">{t.resFooter}</span>
      </div>
      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setActive(null)}>
          <div className="bg-white max-w-4xl w-full bru-border bru-shadow p-4" onClick={(e) => e.stopPropagation()}>
            <div className="bru-border-b pb-2 mb-2 flex items-baseline justify-between">
              <div className="text-[10px] uppercase tracking-widest font-bold">{t.datasheet} · {active.ref}</div>
              <button onClick={() => setActive(null)} className="text-xs uppercase bru-border px-2 py-1 bru-pressable hover:bg-neutral-200 font-bold" aria-label={t.close}>{t.close}</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="aspect-square bru-border overflow-hidden bg-white"><img src={active.src} alt={active.titol[l]} className="w-full h-full object-cover bru-bw" /></div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-neutral-600">{t.titleLabel}</div>
                <h3 className="text-lg font-bold uppercase mb-2">{active.titol[l]}</h3>
                <div className="text-[10px] uppercase tracking-widest text-neutral-600 mt-3">{t.themeLabel}</div>
                <div className="text-xs uppercase font-bold mb-2">{active.tema[l]}</div>
                <div className="text-[10px] uppercase tracking-widest text-neutral-600 mt-3">{t.descLabel}</div>
                <p className="text-xs leading-relaxed">{active.desc[l]}</p>
                {active.photographer && (<div className="mt-3 bru-border-t pt-2"><div className="text-xs font-bold uppercase">{active.photographer}</div></div>)}
                <div className="mt-4 text-[10px] uppercase tracking-widest text-neutral-600 bru-border-t pt-2">{t.techFooter}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
