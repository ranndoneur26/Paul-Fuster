"use client";
import { useState, useCallback } from "react";
import { LangContext, useLang, type Lang } from "@/components/brutalist/lang-context";
import { Header } from "@/components/brutalist/header";
import { HeroModule } from "@/components/brutalist/modul-01-hero";
import { MapModule } from "@/components/brutalist/modul-02-mapa";
import { DiscogModule } from "@/components/brutalist/modul-03-discog";
import { GaleriaModule } from "@/components/brutalist/modul-04-galeria";
import { VideoModule } from "@/components/brutalist/modul-05-video";
import { Footer } from "@/components/brutalist/footer";

const BIO = {
  ca: { ctx:"CONTEXT:", items:["Cantautor inclassificable","Nascut a Minnesota (1969) — pares catalans","Fill del cardiòleg Valentí Fuster","Arrelat a Cardona des de 1997","Luteria de reciclatge + gira en bici de 2.080 km"], open:"▼ OBRIR BIOGRAFIA COMPLETA", bioTitle:"BIOGRAFIA — PAUL FUSTER · L'ARTISTA INCLASSIFICABLE", bioHeader:"CONTEXT BIOGRÀFIC COMPLET", close:"✕ TANCAR", source:"▒ FONT: ARXIU PAUL FUSTER · CONTEXT VITAL I CREATIU",
    secs: [
      { h:"01 · ORÍGENS I ASCENDÈNCIA", p:"Paul Fuster va néixer a Minnesota (Estats Units) en una família d'origen català. És fill del reconegut cardiòleg Valentí Fuster i d'una línia materna la història de la qual es remunta a la vila de Cardona des de l'any 1080. La seva trajectòria ha transcorregut en una oscil·lació permanent entre els Estats Units i Catalunya, una condició bicultural que ha definit el seu espai expressiu, on el folk-rock d'arrel nord-americana es fusiona amb una filosofia de vida artesanal i independent." },
      { h:"02 · ETAPA FORMATIVA I ESCENA UNDERGROUND ALS EUA", p:"Durant la joventut es va traslladar a Nova York i va recórrer diversos estats nord-americans (Colorado, Arizona, Nou Mèxic, Maine, Michigan) en furgonetes i caravanes d'improvisació musical. Abans de dedicar-se de ple a la cançó, va exercir feines molt diverses — mecànic, fuster, pintor, rentaplats o repartidor de pizzes —. Després d'haver treballat com a mecànic, fuster i soldador als Estats Units, Fuster va canalitzar el seu talent manual instal·lant un taller artesanal al barri de Brooklyn, Nova York, produint bicicletes de càrrega (cargo bikes). Més tard va arribar a fundar una escola de percussió i dansa africana a Michigan. A Nova York es va formar com a percussionista i va participar en l'escena alternativa dels anys 90 amb bandes de jazz afrocubà com G Spot Diesel i, més endavant, el grup de rock experimental i post-hardcore Proton Proton." },
      { h:"03 · ARRELAMENT A CARDONA I INICI COM A CANTAUTOR", p:"L'any 1997 va viatjar a Cardona per visitar la seva àvia materna i va decidir instal·lar-hi la residència i el taller de manera permanent. Aquest establiment al Bages va marcar el punt de partida de la seva trajectòria com a cantautor. Al taller de Cardona no només compon, sinó que dissenya i solda les seves pròpies guitarres (fetes amb fustes trobades, xapes de cotxe o peces de rentadores) i les seves bicicletes, unint la mecànica de taller a la seva producció sonora i trobant en la imperfecció humana una estètica pròpia." },
      { h:"04 · TRAJECTÒRIA DISCOGRÀFICA INDEPENDENT", p:"Va debutar amb 36 Weeks (1998) — que incloïa el tema 'Montserrat', present a la pel·lícula Krámpack — i Battleship (1999). Va consolidar el seu prestigi amb Happy Nothing (2002), produït per Quimi Portet i guardonat amb el Premi Altaveu per la seva proposta independent i rupturista. Posteriorment va publicar el seu debut en català Repte (2012), el retorn a l'anglès amb Go/Between (2016), el projecte de rock experimental i lliure Big OK (juntament amb Edi Pou i Sara Fontán) i l'EP autoeditat Organ-ism (2023)." },
      { h:"05 · EL DIRECTE COM A RITUAL IMPREVIST", p:"Als escenaris, Fuster destaca per una connexió física i visceral amb el públic, on les cançons s'entrecreuen amb monòlegs improvisats, reflexions i una gestualitat desbordant sense guió preestablert. Entén la música com un acte comunal i una experiència compartida de proximitat, oposada a la lògica del consum de masses i a la grandiloqüència comercial." },
      { h:"06 · L'UNIVERS DE LA BICICLETA", p:"La bicicleta no és un complement, sinó un pilar central que connecta la faceta de músic amb el treball manual i l'autonomia personal. Per presentar Repte va rebutjar el circuit convencional de sales i va organitzar una gira de 60 dies i 2.080 km per tot Catalunya pedalant una bicicleta de prop de 100 kg dissenyada i soldada per ell mateix, oferint prop de 60 concerts en places, carrers, locals autogestionats i menjadors particulars. Aquesta gira i el seu estil de vida van quedar immortalitzats al llargmetratge Pauls Planet (2013), dirigit per Aleix Barba i Marc Sirisi, amb testimonis del seu entorn creatiu i familiar — Gerard Quintana, Joan Pons 'El Petit de Cal Eril' o el seu pare Valentí Fuster." },
      { h:"07 · POSICIONAMENT EXISTENCIAL — GO-BETWEEN", p:"Fuster es defineix a ell mateix com un go-between — un intermediari o un estat transitori permanent — que defuig la grandiloqüència comercial i la cerca de reconeixement formal. Defensa una estètica de la imperfecció humana, la franquesa de l'execució i l'absència de filtres o processaments de producció industrial. La fabricació de la bicicleta i de la guitarra respon a una mateixa poètica d'autonomia tècnica i sostenibilitat funcional, eliminant la frontera entre l'escenari i la vida quotidiana." },
    ] },
  en: { ctx:"CONTEXT:", items:["Unclassifiable songwriter","Born in Minnesota (1969) — Catalan parents","Son of cardiologist Valentí Fuster","Rooted in Cardona since 1997","Recycling luthiery + 2,080 km bike tour"], open:"▼ OPEN FULL BIOGRAPHY", bioTitle:"BIOGRAPHY — PAUL FUSTER · THE UNCLASSIFIABLE ARTIST", bioHeader:"FULL BIOGRAPHICAL CONTEXT", close:"✕ CLOSE", source:"▒ SOURCE: PAUL FUSTER ARCHIVE · VITAL AND CREATIVE CONTEXT",
    secs: [
      { h:"01 · ORIGINS AND ANCESTRY", p:"Paul Fuster was born in Minnesota (United States) into a family of Catalan origin. He is the son of renowned cardiologist Valentí Fuster and a maternal line whose history traces back to the town of Cardona since the year 1080. His trajectory has unfolded as a permanent oscillation between the United States and Catalonia — a bicultural condition that has shaped his expressive space, where American-rooted folk-rock fuses with a philosophy of artisanal and independent life." },
      { h:"02 · FORMATIVE YEARS AND US UNDERGROUND SCENE", p:"In his youth he moved to New York and traveled through several American states (Colorado, Arizona, New Mexico, Maine, Michigan) in vans and caravans of musical improvisation. Before fully devoting himself to songwriting, he held many different jobs — mechanic, carpenter, painter, dishwasher, pizza delivery —. After working as a mechanic, carpenter, and welder in the United States, Fuster channeled his manual talent by setting up an artisanal workshop in the Brooklyn neighborhood of New York, producing cargo bikes. He later founded a school of African percussion and dance in Michigan. In New York he trained as a percussionist and took part in the alternative scene of the 1990s with Afro-Cuban jazz bands like G Spot Diesel and later the experimental post-hardcore group Proton Proton." },
      { h:"03 · ROOTING IN CARDONA AND DEBUT AS A SONGWRITER", p:"In 1997 he traveled to Cardona to visit his maternal grandmother and decided to settle his residence and workshop there permanently. This establishment in the Bages region marked the starting point of his career as a singer-songwriter. In his Cardona workshop he not only composes but also designs and welds his own guitars (built with found woods, car body sheets, washing machine parts) and his bicycles, welding workshop mechanics to his sonic production and finding his own aesthetic in human imperfection." },
      { h:"04 · INDEPENDENT DISCOGRAPHIC TRAJECTORY", p:"He debuted with 36 Weeks (1998) — featuring the song 'Montserrat', present in the film Krámpack — and Battleship (1999). He consolidated his prestige with Happy Nothing (2002), produced by Quimi Portet and awarded the Premi Altaveu for its independent, breakaway proposal. He subsequently published his Catalan-language debut Repte (2012), the return to English with Go/Between (2016), the experimental free-rock project Big OK (alongside Edi Pou and Sara Fontán) and the self-released EP Organ-ism (2023)." },
      { h:"05 · LIVE PERFORMANCE AS UNPREDICTABLE RITUAL", p:"On stage, Fuster stands out for a physical and visceral connection with the audience, where songs intertwine with improvised monologues, reflections and an overflowing gestural language with no pre-established script. He understands music as a communal act and a shared experience of proximity, opposed to the logic of mass consumption and commercial grandiloquence." },
      { h:"06 · THE UNIVERSE OF THE BICYCLE", p:"The bicycle is not a complement but a central pillar connecting his facet as a musician with manual work and personal autonomy. To present Repte he rejected the conventional venue circuit and organized a 60-day, 2,080 km tour across all of Catalonia pedaling a roughly 100 kg bicycle he designed and welded himself, offering around 60 concerts in squares, streets, self-managed venues and private dining rooms. This tour and his way of life were immortalized in the feature documentary Pauls Planet (2013), directed by Aleix Barba and Marc Sirisi, with testimonies from his creative and family circle — Gerard Quintana, Joan Pons 'El Petit de Cal Eril', or his father Valentí Fuster." },
      { h:"07 · EXISTENTIAL POSITIONING — GO-BETWEEN", p:"Fuster defines himself as a go-between — an intermediary or a permanent transitional state — who shuns commercial grandiloquence and the pursuit of formal recognition. He defends an aesthetic of human imperfection, frankness of execution, and the absence of filters or industrial production processing. The construction of the bicycle and the guitar responds to the same poetics of technical autonomy and functional sustainability, erasing the boundary between stage and everyday life." },
    ] },
};

export default function Home() {
  const [lang, setLang] = useState<Lang>("CA");
  const [bioOpen, setBioOpen] = useState(false);
  const toggle = useCallback(() => setLang((l) => (l === "CA" ? "EN" : "CA")), []);
  const l = lang.toLowerCase() as "ca"|"en";
  const t = BIO[l];
  return (
    <LangContext.Provider value={{ lang, toggle }}>
      <div className="min-h-screen flex flex-col bg-white text-black">
        <Header lang={lang} onLangToggle={toggle} />
        <div className="bru-border-b bg-white">
          <div className="px-3 md:px-6 py-2 flex items-center gap-3 flex-wrap text-[10px] uppercase tracking-widest">
            <span className="font-bold text-black">{t.ctx}</span>
            {t.items.map((it,i) => (<span key={i} className="flex items-center gap-3"><span className="text-neutral-700">{it}</span>{i<t.items.length-1 && <span className="opacity-50">/</span>}</span>))}
          </div>
        </div>
        <main className="flex-1 flex flex-col">
          <HeroModule onOpenBio={() => setBioOpen(true)} />
          <MapModule />
          <div className="grid grid-cols-1 lg:grid-cols-2 bru-border-b"><DiscogModule /><GaleriaModule /></div>
          <VideoModule />
        </main>
        <Footer />
        {bioOpen && (
          <div className="fixed inset-0 z-50 bg-black/95 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setBioOpen(false)}>
            <div className="bg-white max-w-4xl w-full bru-border p-4 md:p-6 mt-4" onClick={(e) => e.stopPropagation()}>
              <div className="bru-border-b pb-2 mb-4 flex items-baseline justify-between">
                <div className="text-[10px] uppercase tracking-widest font-bold">{t.bioHeader}</div>
                <button onClick={() => setBioOpen(false)} className="text-xs uppercase bru-border px-2 py-1 bru-pressable hover:bg-neutral-200 font-bold" aria-label={t.close}>{t.close}</button>
              </div>
              <h2 className="text-xl md:text-2xl font-bold uppercase leading-none mb-4">{t.bioTitle}</h2>
              <div className="space-y-4">{t.secs.map((s,i) => (<div key={i}><h3 className="text-sm font-bold uppercase tracking-widest mb-1">{s.h}</h3><p className="text-xs leading-relaxed text-neutral-800">{s.p}</p></div>))}</div>
              <div className="mt-6 bru-border-t pt-3 text-[10px] uppercase tracking-widest text-neutral-600">{t.source}</div>
            </div>
          </div>
        )}
      </div>
    </LangContext.Provider>
  );
}
