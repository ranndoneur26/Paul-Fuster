"use client";
import { useState } from "react";
import { useLang } from "@/components/brutalist/lang-context";
type TextureTag = "STEEL/ELECTRIC"|"WOOD/ACOUSTIC"|"CATALAN"|"EXP";
interface Credit { name:string; role:{ca:string;en:string}; }
interface Album { ref:string; title:string; year:number; lang:"EN"|"CA"; textures:TextureTag[]; desc:{ca:string;en:string}; catalog:string; spotifyId:string|null; discogsArtistUrl?:string; collaborators:Credit[]; recordedAt:{ca:string;en:string}; label:string; }
const ALBUMS: Album[] = [
  { ref:"A.01", title:"36 WEEKS", year:1998, lang:"EN", textures:["WOOD/ACOUSTIC"], desc:{ca:"Debut. Inclou el tema 'Montserrat', present a la pel·lícula Krámpack. Folk cru, sense producció industrial.",en:"Debut. Includes 'Montserrat', featured in the film Krámpack. Raw folk, no industrial production."}, catalog:"PF-REC-1998-01", spotifyId:"6IeG1ibbmLyIVQvIy05N4Y", collaborators:[], recordedAt:{ca:"Catalunya (estudi no documentat)",en:"Catalonia (studio undocumented)"}, label:"Jepo Disc / Zanfonia S.L. (catno PCCD 0013)" },
  { ref:"A.02", title:"BATTLESHIP", year:1999, lang:"EN", textures:["STEEL/ELECTRIC","EXP"], desc:{ca:"Segon treball. Rock cru, freqüències elèctriques sense filtre. Inici del gir metàl·lic.",en:"Second record. Raw rock, unfiltered electric frequencies. Beginning of the metallic turn."}, catalog:"PF-REC-1999-02", spotifyId:null, discogsArtistUrl:"https://www.discogs.com/release/4643654", collaborators:[], recordedAt:{ca:"Catalunya (estudi no documentat)",en:"Catalonia (studio undocumented)"}, label:"Jepo Disc / Zanfonia S.L. (catno H-10.0017)" },
  { ref:"A.03", title:"HAPPY NOTHING", year:2002, lang:"EN", textures:["WOOD/ACOUSTIC","STEEL/ELECTRIC"], desc:{ca:"Produït per Quimi Portet. Guanyador del Premi Altaveu — proposta independent i rupturista.",en:"Produced by Quimi Portet. Premi Altaveu winner — independent, breakaway proposal."}, catalog:"PF-REC-2002-03", spotifyId:"4d0yiq4rvsUOPPezkSI3qq", collaborators:[{name:"Quimi Portet",role:{ca:"Producció",en:"Producer"}}], recordedAt:{ca:"Catalunya (estudi no documentat)",en:"Catalonia (studio undocumented)"}, label:"Quisso Records (catno CD 1002)" },
  { ref:"A.04", title:"REPTE", year:2012, lang:"CA", textures:["WOOD/ACOUSTIC","CATALAN"], desc:{ca:"Debut en català. Gira de 2.080 km pedalant en bici (2013). Cantautor d'arrel catalana.",en:"Debut in Catalan. Pedaled 2,080 km bike tour (2013). Catalan-rooted songwriter."}, catalog:"PF-REC-2012-04", spotifyId:"7b0NWcPY1JVOydNZAHgPkJ", collaborators:[{name:"Juanjo Muñoz",role:{ca:"Masterització",en:"Mastered By"}}], recordedAt:{ca:"Catalunya — Chesapik / CatMastering",en:"Catalonia — Chesapik / CatMastering"}, label:"Chesapik" },
  { ref:"A.05", title:"GO/BETWEEN", year:2016, lang:"EN", textures:["WOOD/ACOUSTIC","EXP"], desc:{ca:"Retorn a l'anglès. Auto-definit com a estat transitori permanent — el go-between.",en:"Return to English. Self-defined as a permanent transitional state — the go-between."}, catalog:"PF-REC-2016-05", spotifyId:"66DdcpONVWFpfxQgjhBRwA", collaborators:[{name:"Juanjo Muñoz",role:{ca:"Masterització",en:"Mastered By"}}], recordedAt:{ca:"Catalunya — CatMastering (catno CPK-023CD)",en:"Catalonia — CatMastering (catno CPK-023CD)"}, label:"Chesapik" },
  { ref:"A.06", title:"BIG OK", year:2017, lang:"EN", textures:["STEEL/ELECTRIC","EXP"], desc:{ca:"Projecte de rock experimental i lliure amb Edi Pou i Sara Fontán. Improvisació radical.",en:"Free experimental rock project with Edi Pou and Sara Fontán. Radical improvisation."}, catalog:"PF-REC-2017-06", spotifyId:"1feB7jMP7Iiq1JTkwbzGGk", collaborators:[{name:"Edi Pou",role:{ca:"Intèrpret",en:"Performer"}},{name:"Sara Fontán",role:{ca:"Intèrpret",en:"Performer"}},{name:"Paul Fuster",role:{ca:"Intèrpret",en:"Performer"}}], recordedAt:{ca:"Catalunya — Gandula / Chesapik",en:"Catalonia — Gandula / Chesapik"}, label:"Gandula / Chesapik / A Tant Rêver Du Roi" },
  { ref:"A.07", title:"ORGAN-ISM", year:2023, lang:"EN", textures:["STEEL/ELECTRIC","EXP","WOOD/ACOUSTIC"], desc:{ca:"EP autoeditat. Textures d'orgue artesanal i guitarres de reciclatge. Disc que obre un nou cicle.",en:"Self-released EP. Textures of handmade organ and recycling guitars. Opening of a new cycle."}, catalog:"PF-REC-2023-07", spotifyId:"4IHV3dcFaHGnmuSpXefWSF", collaborators:[{name:"Aleix Barba",role:{ca:"Direcció",en:"Directed By"}},{name:"Marc Sirisi",role:{ca:"Direcció",en:"Directed By"}},{name:"Paul Fuster",role:{ca:"Música",en:"Music By"}},{name:"Juanjo Muñoz",role:{ca:"Supervisió + Masterització",en:"Supervised By + Mastered By"}},{name:"Gerard Quintana",role:{ca:"Veu",en:"Vocals"}}], recordedAt:{ca:"Catalunya — Jepo Disc / Zanfonia + taller de Cardona",en:"Catalonia — Jepo Disc / Zanfonia + Cardona workshop"}, label:"Jepo Disc / Zanfonia S.L. / Quisso Records" },
];
const FILTERS: {tag:TextureTag;desc:{ca:string;en:string}}[] = [
  {tag:"STEEL/ELECTRIC",desc:{ca:"Distorsió, xapa de cotxe, cordes elèctriques",en:"Distortion, car body sheet, electric strings"}},
  {tag:"WOOD/ACOUSTIC",desc:{ca:"Mast de fusta trobada, so orgànic cru",en:"Driftwood mast, raw organic sound"}},
  {tag:"CATALAN",desc:{ca:"Trajectòria en llengua catalana",en:"Catalan-language trajectory"}},
  {tag:"EXP",desc:{ca:"Lliure / experimental / fora de gènere",en:"Free / experimental / off-genre"}},
];
const T = {
  ca: { module:"MÒDUL · 03", title:"REPRODUCTOR DISCOGRÀFIC TEXTURAL", filtersTitle:"FILTRES PER SONORITAT — MATÈRIA PRIMA / TEXTURA", clearBtn:"◼ NETEJAR FILTRES ({n})", catalogLabel:"CATÀLEG — {a}/{b} DISCS", sort:"ORDRE: TEXTURA → ANY", noMatch:"▒ CAP DISC AMB AQUESTA COMBINACIÓ DE TEXTURES", activePlayer:"REPRODUCTOR ACTIU", langLabel:"LANG", texturesLabel:"TEXTURES", collaboratorsLabel:"COL·LABORADORS", noCollaborators:"— sense col·laboradors documentats —", recordedAtLabel:"GRAVAT A", labelLabel:"SEGELL", spotifyTitle:"▶ ESCOLTA'L A SPOTIFY", spotifyFooter:"▒ EMBED SPOTIFY · 30s PREVIEW · COMpte LOGAT: CANÇÓ COMPLETA", notOnSpotifyTitle:"▒ NO DISPONIBLE A SPOTIFY", notOnSpotifyDesc:"Aquest disc no està pujat a Spotify. Llançament independent — consulta Discogs per més info.", searchDiscogs:"▶ VEURE A DISCOGS", notOnSpotifyFooter:"▒ VERIFICAT: ARTIST SPOTIFY PAGE 52HjaH77woqeY3K6D7WFeS" },
  en: { module:"MODULE · 03", title:"TEXTURAL DISCOGRAPHIC PLAYER", filtersTitle:"FILTERS BY SOUND — RAW MATERIAL / TEXTURE", clearBtn:"◼ CLEAR FILTERS ({n})", catalogLabel:"CATALOG — {a}/{b} RECORDS", sort:"SORT: TEXTURE → YEAR", noMatch:"▒ NO RECORD MATCHES THIS TEXTURE COMBINATION", activePlayer:"ACTIVE PLAYER", langLabel:"LANG", texturesLabel:"TEXTURES", collaboratorsLabel:"COLLABORATORS", noCollaborators:"— no documented collaborators —", recordedAtLabel:"RECORDED AT", labelLabel:"LABEL", spotifyTitle:"▶ LISTEN ON SPOTIFY", spotifyFooter:"▒ SPOTIFY EMBED · 30s PREVIEW · LOGGED-IN: FULL TRACK", notOnSpotifyTitle:"▒ NOT ON SPOTIFY", notOnSpotifyDesc:"This record is not on Spotify. Independent release — check Discogs for more info.", searchDiscogs:"▶ VIEW ON DISCOGS", notOnSpotifyFooter:"▒ VERIFIED: ARTIST SPOTIFY PAGE 52HjaH77woqeY3K6D7WFeS" },
};
export function DiscogModule() {
  const { lang } = useLang();
  const l = lang.toLowerCase() as "ca"|"en";
  const t = T[l];
  const [selected, setSelected] = useState<Album | null>(ALBUMS[0]);
  const embedUrl = (id:string) => `https://open.spotify.com/embed/album/${id}?utm_source=generator&theme=0`;
  return (
    <section id="modul-03" className="bru-border-r bg-white" aria-labelledby="modul-03-title">
      <div className="bru-border-b flex items-stretch">
        <div className="bru-border-r px-3 py-2 text-[10px] uppercase tracking-widest font-bold bg-[#000066] text-white">{t.module}</div>
        <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-neutral-600 flex-1 flex items-center"><span className="font-bold text-black">{t.title}</span></div>
      </div>
      <div className="bru-border-b">
        <div className="px-4 py-2 text-[10px] uppercase tracking-widest bg-neutral-100 bru-border-b font-bold flex justify-between"><span>{t.catalogLabel.replace("{a}",String(ALBUMS.length)).replace("{b}",String(ALBUMS.length))}</span><span className="text-neutral-600">{t.sort}</span></div>
        <ul className="max-h-72 overflow-y-auto bru-scroll">
          {ALBUMS.map(a => (
            <li key={a.ref} className={`bru-border-b last:bru-border-b-0 ${selected?.ref===a.ref?"bg-black text-white":"bg-white"}`}>
              <button onClick={() => setSelected(a)} className="w-full text-left px-4 py-2 bru-pressable hover:bg-neutral-200">
                <div className="flex items-baseline justify-between gap-3">
                  <div className="flex items-baseline gap-2 min-w-0 flex-1"><span className="text-[10px] tracking-widest font-bold opacity-80">{a.ref}</span><span className="text-sm uppercase font-bold truncate">{a.title}</span>{a.spotifyId?<span className="text-[9px] tracking-widest opacity-70 shrink-0">[SPOTIFY]</span>:<span className="text-[9px] tracking-widest opacity-50 shrink-0">[—]</span>}</div>
                  <span className="text-[10px] tracking-widest opacity-70">{a.year}</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-1">{a.textures.map(tag => <span key={tag} className={`text-[9px] tracking-widest bru-border px-1 ${selected?.ref===a.ref?"bru-border-white":"bru-border-black"}`}>{tag}</span>)}</div>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 bg-black text-white bru-flicker">
        <div className="text-[10px] uppercase tracking-widest opacity-60 mb-2">{t.activePlayer}</div>
        {selected && (
          <>
            <div className="flex items-baseline justify-between mb-1"><span className="text-[10px] tracking-widest font-bold opacity-80">{selected.ref} · CATALOG: {selected.catalog}</span><span className="text-[10px] tracking-widest opacity-70">{t.langLabel}: {selected.lang}</span></div>
            <h3 id="modul-03-title" className="text-2xl font-bold uppercase leading-none mb-1">{selected.title}</h3>
            <div className="text-[11px] uppercase tracking-widest opacity-70 mb-3">{selected.year} · {t.texturesLabel}: {selected.textures.join(" · ")}</div>
            <p className="text-[11px] leading-relaxed opacity-90 mb-3">{selected.desc[l]}</p>
            <div className="bru-border bru-border-white/40 p-2 mb-3 bg-black">
              <div className="grid grid-cols-1 gap-1.5">
                <div>
                  <div className="text-[9px] uppercase tracking-widest opacity-60 mb-0.5">{t.collaboratorsLabel}</div>
                  {selected.collaborators.length > 0 ? <ul className="text-[11px] leading-snug">{selected.collaborators.map((c,i) => <li key={i} className="flex items-baseline justify-between gap-2"><span className="font-bold">{c.name}</span><span className="text-[10px] tracking-widest opacity-70 uppercase">{c.role[l]}</span></li>)}</ul> : <div className="text-[10px] uppercase tracking-widest opacity-50">{t.noCollaborators}</div>}
                </div>
                <div className="bru-border-t bru-border-white/30 pt-1.5"><div className="text-[9px] uppercase tracking-widest opacity-60 mb-0.5">{t.recordedAtLabel}</div><div className="text-[11px] leading-snug">{selected.recordedAt[l]}</div></div>
                <div className="bru-border-t bru-border-white/30 pt-1.5"><div className="text-[9px] uppercase tracking-widest opacity-60 mb-0.5">{t.labelLabel}</div><div className="text-[11px] leading-snug">{selected.label}</div></div>
              </div>
            </div>
            {selected.spotifyId ? (
              <div className="bru-border bru-border-white">
                <div className="px-2 py-1 text-[10px] uppercase tracking-widest bg-white text-black font-bold flex items-center justify-between"><span>{t.spotifyTitle}</span><span className="opacity-70">[SPOTIFY · {selected.year}]</span></div>
                <iframe className="w-full" style={{height:"352px",border:0}} src={embedUrl(selected.spotifyId)} title={`Spotify embed: ${selected.title}`} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" />
                <div className="px-2 py-1 text-[9px] uppercase tracking-widest opacity-60">{t.spotifyFooter}</div>
              </div>
            ) : (
              <div className="bru-border bru-border-white p-3 bg-black">
                <div className="text-[10px] uppercase tracking-widest font-bold mb-1">{t.notOnSpotifyTitle}</div>
                <p className="text-[11px] leading-relaxed opacity-80 mb-3">{t.notOnSpotifyDesc}</p>
                {selected.discogsArtistUrl && <a href={selected.discogsArtistUrl} target="_blank" rel="noopener noreferrer" className="inline-block bru-border bru-border-white px-2 py-1 text-[10px] uppercase tracking-widest font-bold bru-pressable hover:bg-white hover:text-black">{t.searchDiscogs} →</a>}
                <div className="mt-3 text-[9px] uppercase tracking-widest opacity-50">{t.notOnSpotifyFooter}</div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
