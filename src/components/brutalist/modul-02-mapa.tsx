"use client";
import { useState } from "react";
import { useLang } from "@/components/brutalist/lang-context";
interface Stop { id:string; ref:string; name:string; comarca:string; date:string; coords:{x:number;y:number}; distance:{ca:string;en:string}; notes:{ca:string;en:string}; type:"concert"|"tallers"|"etapa"; }
const S: Stop[] = [
{ id:"cardona",ref:"P.01",name:"CARDONA",comarca:"BAGES",date:"01.JUL.2013",coords:{x:32,y:55},distance:{ca:"0 KM — SORTIDA",en:"0 KM — START"},notes:{ca:"Punt de partida. Taller de Fuster, sortida amb bici carregada (≈100kg).",en:"Departure point. Fuster's workshop, leaving with loaded bike (~100kg)."},type:"etapa"},
{ id:"sallent",ref:"P.02",name:"SALLENT",comarca:"BAGES",date:"02.JUL.2013",coords:{x:36,y:53},distance:{ca:"12 KM",en:"12 KM"},notes:{ca:"Primera parada. Concert a la plaça major.",en:"First stop. Concert at the main square."},type:"concert"},
{ id:"santpedor",ref:"P.03",name:"SANTPEDOR",comarca:"BAGES",date:"02.JUL.2013",coords:{x:34,y:59},distance:{ca:"28 KM",en:"28 KM"},notes:{ca:"Concert a la plaça del mercat. Trobada amb músics locals.",en:"Concert at the market square. Encounter with local musicians."},type:"concert"},
{ id:"manresa",ref:"P.04",name:"MANRESA",comarca:"BAGES",date:"03.JUL.2013",coords:{x:38,y:60},distance:{ca:"45 KM",en:"45 KM"},notes:{ca:"Actuació al carrer, diari obert al públic.",en:"Street performance, open diary."},type:"concert"},
{ id:"suria",ref:"P.05",name:"SÚRIA",comarca:"BAGES",date:"04.JUL.2013",coords:{x:30,y:53},distance:{ca:"65 KM",en:"65 KM"},notes:{ca:"Concert al peu del castell.",en:"Concert at the foot of the castle."},type:"concert"},
{ id:"navarcles",ref:"P.06",name:"NAVARCLÉS",comarca:"BAGES",date:"04.JUL.2013",coords:{x:34,y:53},distance:{ca:"78 KM",en:"78 KM"},notes:{ca:"Parada a la riba del Llobregat.",en:"Stopover at the Llobregat riverbank."},type:"etapa"},
{ id:"artes",ref:"P.07",name:"ARTÉS",comarca:"BAGES",date:"05.JUL.2013",coords:{x:36,y:51},distance:{ca:"92 KM",en:"92 KM"},notes:{ca:"Concert a la plaça. Visita a la cooperativa de cava.",en:"Concert at the plaza. Cava cooperative visit."},type:"concert"},
{ id:"navas",ref:"P.08",name:"NAVÀS",comarca:"BERGUEDÀ",date:"05.JUL.2013",coords:{x:37,y:49},distance:{ca:"108 KM",en:"108 KM"},notes:{ca:"Pujada cap al Berguedà.",en:"Climb toward Berguedà."},type:"etapa"},
{ id:"berga",ref:"P.09",name:"BERGA",comarca:"BERGUEDÀ",date:"06.JUL.2013",coords:{x:40,y:45},distance:{ca:"130 KM",en:"130 KM"},notes:{ca:"Concert a la plaça Porxada. Taller amb luthiers locals.",en:"Concert at plaça Porxada. Workshop with local luthiers."},type:"tallers"},
{ id:"gironella",ref:"P.10",name:"GIRONELLA",comarca:"BERGUEDÀ",date:"06.JUL.2013",coords:{x:41,y:45},distance:{ca:"142 KM",en:"142 KM"},notes:{ca:"Parada al pont del Llobregat.",en:"Stop at the Llobregat bridge."},type:"etapa"},
{ id:"puig-reig",ref:"P.11",name:"PUIG-REIG",comarca:"BERGUEDÀ",date:"07.JUL.2013",coords:{x:41,y:47},distance:{ca:"155 KM",en:"155 KM"},notes:{ca:"Concert a la plaça de la cooperativa.",en:"Concert at the cooperativa square."},type:"concert"},
{ id:"mont-major",ref:"P.12",name:"MONTMAJOR",comarca:"BERGUEDÀ",date:"07.JUL.2013",coords:{x:39,y:44},distance:{ca:"172 KM",en:"172 KM"},notes:{ca:"Desviació a dalt del turó. Acústic als graons.",en:"Hilltop detour. Acoustic set at the church steps."},type:"concert"},
{ id:"gavarra",ref:"P.13",name:"LA GAVARRA",comarca:"BERGUEDÀ",date:"08.JUL.2013",coords:{x:38,y:41},distance:{ca:"188 KM",en:"188 KM"},notes:{ca:"Petita parada rural, menjador particular.",en:"Tiny village stop, private dining room."},type:"etapa"},
{ id:"olot",ref:"P.14",name:"OLOT",comarca:"GARROTXA",date:"09.JUL.2013",coords:{x:55,y:36},distance:{ca:"210 KM",en:"210 KM"},notes:{ca:"Concert a la plaça major. Documentació fotogràfica.",en:"Concert at the main square. Photographic documentation."},type:"concert"},
{ id:"les-preses",ref:"P.15",name:"LES PRESES",comarca:"GARROTXA",date:"09.JUL.2013",coords:{x:54,y:35},distance:{ca:"225 KM",en:"225 KM"},notes:{ca:"Parada al Parc Volcànic. Presa acústica al basalt.",en:"Stop at the Volcanic Park. Acoustic take in basalt."},type:"etapa"},
{ id:"besalu",ref:"P.16",name:"BESALÚ",comarca:"GARROTXA",date:"10.JUL.2013",coords:{x:56,y:33},distance:{ca:"240 KM",en:"240 KM"},notes:{ca:"Actuació al pont medieval.",en:"Performance at the medieval bridge."},type:"concert"},
{ id:"banyoles",ref:"P.17",name:"BANYOLES",comarca:"PLA DE L'ESTANY",date:"10.JUL.2013",coords:{x:58,y:33},distance:{ca:"255 KM",en:"255 KM"},notes:{ca:"Concert a la vora del llac.",en:"Concert at the lakeside."},type:"concert"},
{ id:"cassa",ref:"P.18",name:"CASSÀ DE LA SELVA",comarca:"GIRONÈS",date:"11.JUL.2013",coords:{x:60,y:38},distance:{ca:"275 KM",en:"275 KM"},notes:{ca:"Taller amb mecànics de bici.",en:"Workshop with bike mechanics."},type:"tallers"},
{ id:"girona",ref:"P.19",name:"GIRONA",comarca:"GIRONÈS",date:"12.JUL.2013",coords:{x:64,y:36},distance:{ca:"295 KM",en:"295 KM"},notes:{ca:"Tallers de luteria al barri vell. Concert nocturn al carrer de la Força.",en:"Recycling lutherie workshops. Night concert at Força street."},type:"tallers"},
{ id:"sant-feliu",ref:"P.20",name:"SANT FELIU DE GUÍXOLS",comarca:"BAIX EMPORDÀ",date:"13.JUL.2013",coords:{x:67,y:40},distance:{ca:"335 KM",en:"335 KM"},notes:{ca:"Concert vora el monestir. Diari costaner.",en:"Concert by the monastery. Coastal diary."},type:"concert"},
{ id:"palamos",ref:"P.21",name:"PALAMÓS",comarca:"BAIX EMPORDÀ",date:"13.JUL.2013",coords:{x:68,y:41},distance:{ca:"345 KM",en:"345 KM"},notes:{ca:"Concert al barri del port.",en:"Portside concert."},type:"concert"},
{ id:"palafrugell",ref:"P.22",name:"PALAFRUGELL",comarca:"BAIX EMPORDÀ",date:"14.JUL.2013",coords:{x:69,y:40},distance:{ca:"358 KM",en:"358 KM"},notes:{ca:"Concert a la plaça. Intercanvi de taller de suro.",en:"Concert at the plaça. Cork workshop exchange."},type:"concert"},
{ id:"torroella",ref:"P.23",name:"TORROELLA DE MONTGRÍ",comarca:"BAIX EMPORDÀ",date:"14.JUL.2013",coords:{x:67,y:38},distance:{ca:"372 KM",en:"372 KM"},notes:{ca:"Concert al peu del massís del Montgrí.",en:"Concert at the foot of the Montgrí massif."},type:"concert"},
{ id:"la-bisbal",ref:"P.24",name:"LA BISBAL D'EMPORDÀ",comarca:"BAIX EMPORDÀ",date:"15.JUL.2013",coords:{x:64,y:40},distance:{ca:"390 KM",en:"390 KM"},notes:{ca:"Poble de ceramistes. Concert al pati del castell.",en:"Ceramics town. Concert in the castle courtyard."},type:"concert"},
{ id:"figueres",ref:"P.25",name:"FIGUERES",comarca:"ALT EMPORDÀ",date:"15.JUL.2013",coords:{x:70,y:33},distance:{ca:"415 KM",en:"415 KM"},notes:{ca:"Concert a la Rambla. Visita al museu Dalí.",en:"Concert at the rambla. Visit to the Dalí museum."},type:"concert"},
{ id:"roses",ref:"P.26",name:"ROSES",comarca:"ALT EMPORDÀ",date:"16.JUL.2013",coords:{x:73,y:30},distance:{ca:"440 KM",en:"440 KM"},notes:{ca:"Parada costanera. Concert a la platja.",en:"Coastal stop. Beach concert."},type:"concert"},
{ id:"cadagues",ref:"P.27",name:"CADAQUÉS",comarca:"ALT EMPORDÀ",date:"16.JUL.2013",coords:{x:73,y:32},distance:{ca:"455 KM",en:"455 KM"},notes:{ca:"Poble blanc. Concert a la platja.",en:"Whitewashed village. Concert at the seaside."},type:"concert"},
{ id:"portbou",ref:"P.28",name:"PORTBOU",comarca:"ALT EMPORDÀ",date:"17.JUL.2013",coords:{x:75,y:27},distance:{ca:"480 KM",en:"480 KM"},notes:{ca:"Poble fronterer. Acústic a l'estació.",en:"Border town. Acoustic set at the station."},type:"etapa"},
{ id:"llanca",ref:"P.29",name:"LLANÇÀ",comarca:"ALT EMPORDÀ",date:"17.JUL.2013",coords:{x:74,y:29},distance:{ca:"495 KM",en:"495 KM"},notes:{ca:"Concert al port de pesca.",en:"Concert at the fishing port."},type:"concert"},
{ id:"ripoll",ref:"P.30",name:"RIPOLL",comarca:"RIPOLLÈS",date:"18.JUL.2013",coords:{x:60,y:35},distance:{ca:"530 KM",en:"530 KM"},notes:{ca:"Concert a la plaça del monestir. Reparació de radi.",en:"Concert at the monastery square. Spoke repair."},type:"concert"},
{ id:"sant-joan",ref:"P.31",name:"SANT JOAN DE LES ABDESSES",comarca:"RIPOLLÈS",date:"18.JUL.2013",coords:{x:58,y:34},distance:{ca:"545 KM",en:"545 KM"},notes:{ca:"Concert al pont medieval.",en:"Medieval bridge concert."},type:"concert"},
{ id:"campdevanol",ref:"P.32",name:"CAMPDEVANÒL",comarca:"RIPOLLÈS",date:"19.JUL.2013",coords:{x:56,y:32},distance:{ca:"560 KM",en:"560 KM"},notes:{ca:"Taller de soldadura amb club ciclista.",en:"Bike welding workshop with cycling club."},type:"tallers"},
{ id:"ribes",ref:"P.33",name:"RIBES DE FRESER",comarca:"RIPOLLÈS",date:"19.JUL.2013",coords:{x:55,y:30},distance:{ca:"580 KM",en:"580 KM"},notes:{ca:"Concert pirinenc. Prova del quadre a 1.200m.",en:"Pyrenean concert. Frame test at 1,200m."},type:"concert"},
{ id:"seu",ref:"P.34",name:"LA SEU D'URGELL",comarca:"ALT URGELL",date:"20.JUL.2013",coords:{x:50,y:26},distance:{ca:"620 KM",en:"620 KM"},notes:{ca:"Port de muntanya abans de Sort. Etapa dura.",en:"Mountain pass before Sort. Hard stage."},type:"etapa"},
{ id:"sort",ref:"P.35",name:"SORT",comarca:"PALLARS SOBIRÀ",date:"21.JUL.2013",coords:{x:44,y:22},distance:{ca:"690 KM",en:"690 KM"},notes:{ca:"Concert a la plaça Major. Diari: pluja, vent, Pirineu.",en:"Concert at the main square. Diary: rain, wind, Pyrenees."},type:"concert"},
{ id:"peramola",ref:"P.36",name:"PERAMOLA",comarca:"ALT URGELL",date:"22.JUL.2013",coords:{x:47,y:27},distance:{ca:"710 KM",en:"710 KM"},notes:{ca:"Baixada de tornada. Concert al riu Segre.",en:"Descent back. Riverside concert."},type:"concert"},
{ id:"tremp",ref:"P.37",name:"TREMP",comarca:"PALLARS JUSSÀ",date:"23.JUL.2013",coords:{x:40,y:32},distance:{ca:"760 KM",en:"760 KM"},notes:{ca:"Actuació espontània al carrer.",en:"Spontaneous street performance."},type:"concert"},
{ id:"pobla",ref:"P.38",name:"POBLA DE SEGUR",comarca:"PALLARS JUSSÀ",date:"23.JUL.2013",coords:{x:42,y:30},distance:{ca:"780 KM",en:"780 KM"},notes:{ca:"Concert a la plaça de l'estació.",en:"Concert at the train station square."},type:"concert"},
{ id:"salles",ref:"P.39",name:"SALÀS DE PALLARS",comarca:"PALLARS JUSSÀ",date:"24.JUL.2013",coords:{x:41,y:31},distance:{ca:"795 KM",en:"795 KM"},notes:{ca:"Poble medieval. Concert a la muralla.",en:"Medieval village. Concert on the ramparts."},type:"concert"},
{ id:"guissona",ref:"P.40",name:"GUISSONA",comarca:"URGELL",date:"24.JUL.2013",coords:{x:44,y:40},distance:{ca:"820 KM",en:"820 KM"},notes:{ca:"Concert a la cruïlla. Poble de fira.",en:"Crossroads concert. Trade fair town."},type:"concert"},
{ id:"cervera",ref:"P.41",name:"CERVERA",comarca:"URGELL",date:"25.JUL.2013",coords:{x:43,y:44},distance:{ca:"850 KM",en:"850 KM"},notes:{ca:"Concert a la plaça de la universitat.",en:"University square concert."},type:"concert"},
{ id:"tarrega",ref:"P.42",name:"TÀRREGA",comarca:"URGELL",date:"25.JUL.2013",coords:{x:41,y:46},distance:{ca:"875 KM",en:"875 KM"},notes:{ca:"Concert a la plaça major.",en:"Concert at the main square."},type:"concert"},
{ id:"mollerussa",ref:"P.43",name:"MOLLERUSSA",comarca:"PLA D'URGELL",date:"26.JUL.2013",coords:{x:33,y:49},distance:{ca:"905 KM",en:"905 KM"},notes:{ca:"Poble del canal. Concert al pont.",en:"Canal town. Concert at the bridge."},type:"concert"},
{ id:"lleida",ref:"P.44",name:"LLEIDA",comarca:"SEGRÀ",date:"27.JUL.2013",coords:{x:28,y:64},distance:{ca:"1.640 KM",en:"1,640 KM"},notes:{ca:"Concert al barri de Cappont. Tallers.",en:"Concert at Cappont. Workshops."},type:"tallers"},
{ id:"alcarras",ref:"P.45",name:"ALCARRÀS",comarca:"SEGRÀ",date:"28.JUL.2013",coords:{x:24,y:60},distance:{ca:"1.680 KM",en:"1,680 KM"},notes:{ca:"Concert a la frontera. Diari de secà.",en:"Border-fringe concert. Dryland diary."},type:"concert"},
{ id:"seros",ref:"P.46",name:"SERÓS",comarca:"SEGRÀ",date:"28.JUL.2013",coords:{x:22,y:64},distance:{ca:"1.700 KM",en:"1,700 KM"},notes:{ca:"Parada al riu. Concert vora el Segre.",en:"Riverside stop. Concert by the Segre."},type:"etapa"},
{ id:"mequinensa",ref:"P.47",name:"MEQUINENSA",comarca:"BAIX SEGRE",date:"29.JUL.2013",coords:{x:26,y:70},distance:{ca:"1.730 KM",en:"1,730 KM"},notes:{ca:"Poble de pantà. Acústic al mur de la resclosa.",en:"Dam town. Acoustic at the reservoir wall."},type:"etapa"},
{ id:"faio",ref:"P.48",name:"FAIÓ",comarca:"MATARRANYA",date:"29.JUL.2013",coords:{x:25,y:76},distance:{ca:"1.750 KM",en:"1,750 KM"},notes:{ca:"Travessa a la Catalunya aragonesa.",en:"Crossing into Aragonese Catalonia."},type:"concert"},
{ id:"maella",ref:"P.49",name:"MAELLA",comarca:"MATARRANYA",date:"30.JUL.2013",coords:{x:30,y:80},distance:{ca:"1.780 KM",en:"1,780 KM"},notes:{ca:"Bucle fronterer. Concert entre oliveres.",en:"Border loop. Olive-grove concert."},type:"concert"},
{ id:"beseit",ref:"P.50",name:"BESEIT",comarca:"MATARRANYA",date:"30.JUL.2013",coords:{x:32,y:78},distance:{ca:"1.800 KM",en:"1,800 KM"},notes:{ca:"Tornada pel port de muntanya. Farges històriques.",en:"Mountain pass return. Historic forges."},type:"tallers"},
{ id:"horta",ref:"P.51",name:"HORTA DE SANT JOAN",comarca:"TERRA ALTA",date:"31.JUL.2013",coords:{x:38,y:84},distance:{ca:"1.830 KM",en:"1,830 KM"},notes:{ca:"Poble de Picasso. Concert a la plaça.",en:"Picasso's town. Concert at the plaça."},type:"concert"},
{ id:"arnes",ref:"P.52",name:"ARNES",comarca:"TERRA ALTA",date:"31.JUL.2013",coords:{x:40,y:82},distance:{ca:"1.850 KM",en:"1,850 KM"},notes:{ca:"Concert a l'ajuntament.",en:"Town-hall concert."},type:"concert"},
{ id:"bot",ref:"P.53",name:"BOT",comarca:"TERRA ALTA",date:"01.AGO.2013",coords:{x:40,y:80},distance:{ca:"1.865 KM",en:"1,865 KM"},notes:{ca:"Visita a la cooperativa de vi.",en:"Wine cooperative visit."},type:"concert"},
{ id:"gandesa",ref:"P.54",name:"GANDESA",comarca:"TERRA ALTA",date:"01.AGO.2013",coords:{x:39,y:78},distance:{ca:"1.880 KM",en:"1,880 KM"},notes:{ca:"Poble de la batalla de l'Ebre.",en:"Ebre battlefield town."},type:"concert"},
{ id:"pinell",ref:"P.55",name:"EL PINELL DE BRAI",comarca:"TERRA ALTA",date:"02.AGO.2013",coords:{x:37,y:78},distance:{ca:"1.895 KM",en:"1,895 KM"},notes:{ca:"Cooperativa vi-catedral. Concert dins l'edifici.",en:"Wine-cathedral cooperative. Concert inside."},type:"concert"},
{ id:"mora",ref:"P.56",name:"MORA D'EBRE",comarca:"RIBERA D'EBRE",date:"02.AGO.2013",coords:{x:36,y:80},distance:{ca:"1.910 KM",en:"1,910 KM"},notes:{ca:"Concert vora el riu.",en:"Riverside concert."},type:"concert"},
{ id:"asco",ref:"P.57",name:"ASCÓ",comarca:"RIBERA D'EBRE",date:"03.AGO.2013",coords:{x:35,y:78},distance:{ca:"1.925 KM",en:"1,925 KM"},notes:{ca:"Poble de central nuclear. Diari antinuclear.",en:"Nuclear-plant town. Anti-nuclear diary."},type:"concert"},
{ id:"roquetes",ref:"P.58",name:"ROQUETES",comarca:"BAIX EBRE",date:"03.AGO.2013",coords:{x:38,y:84},distance:{ca:"1.940 KM",en:"1,940 KM"},notes:{ca:"Poble de l'observatori.",en:"Observatory town."},type:"concert"},
{ id:"tortosa",ref:"P.59",name:"TORTOSA",comarca:"BAIX EBRE",date:"04.AGO.2013",coords:{x:36,y:90},distance:{ca:"1.960 KM",en:"1,960 KM"},notes:{ca:"Final de la baixada pel sud. Concert a la Catedral.",en:"End of southern descent. Cathedral concert."},type:"concert"},
{ id:"cardona-return",ref:"P.60",name:"CARDONA (RETORN)",comarca:"BAGES",date:"30.AGO.2013",coords:{x:32,y:55},distance:{ca:"2.080 KM — FINAL",en:"2,080 KM — END"},notes:{ca:"Tornada al taller. Fi de la gira.",en:"Return to the workshop. End of the tour."},type:"etapa"},
];
const TYPE_LABELS = { concert:{ca:"CONCERT",en:"CONCERT"}, tallers:{ca:"TALLERS",en:"WORKSHOP"}, etapa:{ca:"ETAPA",en:"LEG"} };
const T = {
  ca: { module:"MÒDUL · 02", title:"CARTOGRAFIA INTERACTIVA — GIRA EN BICI", subtitle:"REPTE · 2013", gis:"GIS · 2.080 KM · 60 LOCALITATS", mapLabel:"MAPA · CATALUNYA · ESC 1:1.500.000", legend:"LLEGENDA:", legendConcert:"CONCERT", legendWorkshop:"TALLERS", legendLeg:"ETAPA", legendRoute:"RUTA PEDALANT — 2.080 KM · 60 PARADES", doc:"DOCUMENT · GIRA 2013", title2:"CARTOGRAFIA INTERACTIVA", description:"Per presentar l'àlbum Repte (2012), Paul Fuster va rebutjar el circuit convencional de sales i va organitzar una gira de 60 dies i 2.080 km per tot Catalunya pedalant una bicicleta de prop de 100 kg dissenyada i soldada per ell mateix. Cliqueu qualsevol punt del trajecte per obrir la fitxa de parada.", stopsTitle:"PARADES — {n} DOCUMENTADES", scroll:"SCROLL ▼", sheetTitle:"FITXA DE PARADA", active:"ACTIU", activeFooter:"CLIP/DIARI/FOTO DISPONIBLE", closeBtn:"◼ TANCAR FITXA", selectStop:"▒ SELECCIONEU UN PUNT DE LA RUTA PER OBRIR LA FITXA" },
  en: { module:"MODULE · 02", title:"INTERACTIVE CARTOGRAPHY — BIKE TOUR", subtitle:"REPTE · 2013", gis:"GIS · 2,080 KM · 60 LOCALITIES", mapLabel:"MAP · CATALONIA · SCALE 1:1,500,000", legend:"LEGEND:", legendConcert:"CONCERT", legendWorkshop:"WORKSHOP", legendLeg:"LEG", legendRoute:"ROUTE PEDALING — 2,080 KM · 60 STOPS", doc:"DOCUMENT · 2013 TOUR", title2:"INTERACTIVE CARTOGRAPHY", description:"To present the album Repte (2012), Paul Fuster rejected the conventional venue circuit and organized a 60-day, 2,080 km tour across all of Catalonia pedaling a ~100 kg bicycle he designed and welded himself. Click any point of the route to open the stop datasheet.", stopsTitle:"STOPS — {n} DOCUMENTED", scroll:"SCROLL ▼", sheetTitle:"STOP DATASHEET", active:"ACTIVE", activeFooter:"CLIP/DIARY/PHOTO AVAILABLE", closeBtn:"◼ CLOSE DATASHEET", selectStop:"▒ SELECT A ROUTE POINT TO OPEN ITS DATASHEET" },
};
export function MapModule() {
  const { lang } = useLang();
  const l = lang.toLowerCase() as "ca"|"en";
  const t = T[l];
  const [active, setActive] = useState<Stop | null>(null);
  const [hovering, setHovering] = useState<string | null>(null);
  return (
    <section id="modul-02" className="bru-border-b bg-white" aria-labelledby="modul-02-title">
      <div className="bru-border-b flex items-stretch">
        <div className="bru-border-r px-3 py-2 text-[10px] uppercase tracking-widest font-bold bg-[#003333] text-white">{t.module}</div>
        <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-neutral-600 flex-1 flex items-center"><span className="font-bold text-black">{t.title}</span><span className="mx-2 opacity-50">/</span>{t.subtitle}</div>
        <div className="hidden md:flex items-center px-3 py-2 text-[10px] uppercase tracking-widest text-neutral-600 bru-border-l">{t.gis}</div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-8 bru-border-r relative">
          <div className="relative aspect-[4/3] bg-white bru-grid overflow-hidden">
            <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet" aria-label={l==="ca"?"Mapa de Catalunya amb la ruta":"Map of Catalonia with the route"}>
              <path d="M 60 220 L 90 230 L 110 210 L 130 90 L 180 70 L 230 60 L 280 80 L 300 110 L 290 150 L 280 200 L 260 250 L 200 270 L 140 270 L 90 250 Z" stroke="#000" strokeWidth="2" fill="none" />
              <defs><pattern id="hatchmap" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="#000" strokeWidth="0.4" opacity="0.4" /></pattern></defs>
              <path d="M 60 220 L 90 230 L 110 210 L 130 90 L 180 70 L 230 60 L 280 80 L 300 110 L 290 150 L 280 200 L 260 250 L 200 270 L 140 270 L 90 250 Z" fill="url(#hatchmap)" />
              <g transform="translate(360, 30)" stroke="#000" strokeWidth="1.5" fill="#000"><line x1="0" y1="-15" x2="0" y2="15" /><line x1="-15" y1="0" x2="15" y2="0" /><polygon points="0,-18 -3,-12 3,-12" fill="#000" /><text x="0" y="-22" textAnchor="middle" fontSize="8" fontFamily="monospace">N</text></g>
              <polyline points={S.map(s=>`${(s.coords.x*4).toFixed(0)},${(s.coords.y*3).toFixed(0)}`).join(" ")} stroke="#000" strokeWidth="1.5" fill="none" strokeDasharray="4,3" />
              {S.map((s) => { const cx=s.coords.x*4, cy=s.coords.y*3; const isActive=active?.id===s.id; const isHover=hovering===s.id; const isFinal=s.id==="cardona"||s.id==="cardona-return"; return (
                <g key={s.id} transform={`translate(${cx},${cy})`} className="cursor-pointer" onMouseEnter={()=>setHovering(s.id)} onMouseLeave={()=>setHovering(null)} onClick={()=>setActive(s)}>
                  {isActive && <circle cx="0" cy="0" r="12" fill="none" stroke="#000" strokeWidth="2" className="bru-blink" />}
                  <rect x="-3" y="-3" width="6" height="6" fill={isActive?"#000":isHover?"#fff":"#000"} stroke="#000" strokeWidth="1.5" />
                  {isFinal && <rect x="-6" y="-6" width="12" height="12" fill="none" stroke="#000" strokeWidth="1" />}
                  {(isHover||isActive) && <text x="8" y="3" fontSize="7" fontFamily="monospace" fontWeight="bold" fill="#000">{s.ref} · {s.name}</text>}
                </g>
              ); })}
            </svg>
            <div className="absolute top-2 left-2 text-[9px] tracking-widest text-neutral-600 uppercase">{t.mapLabel}</div>
            <div className="absolute bottom-0 left-0 right-0 bru-border-t bg-white px-3 py-1 flex flex-wrap items-center gap-3 text-[9px] uppercase tracking-widest">
              <span className="font-bold">{t.legend}</span>
              <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 bg-black" />{t.legendConcert}</span>
              <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 bg-white border-2 border-black" />{t.legendWorkshop}</span>
              <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 border-2 border-black" />{t.legendLeg}</span>
              <span className="opacity-50">/</span><span>{t.legendRoute}</span>
            </div>
          </div>
        </div>
        <div className="lg:col-span-4 flex flex-col">
          <div className="bru-border-b p-4"><div className="text-[10px] uppercase tracking-widest text-neutral-600 mb-1">{t.doc}</div><h2 id="modul-02-title" className="text-xl font-bold uppercase leading-none tracking-tight mb-2">{t.title2}</h2><p className="text-xs leading-relaxed text-neutral-800">{t.description}</p></div>
          <div className="bru-border-b">
            <div className="px-4 py-2 text-[10px] uppercase tracking-widest bg-neutral-100 bru-border-b font-bold flex justify-between"><span>{t.stopsTitle.replace("{n}",String(S.length))}</span><span className="text-neutral-600">{t.scroll}</span></div>
            <ul className="max-h-64 overflow-y-auto bru-scroll">
              {S.map((s) => (<li key={s.id} className={`bru-border-b last:bru-border-b-0 ${active?.id===s.id?"bg-black text-white":"bg-white"}`}><button onClick={()=>setActive(s)} onMouseEnter={()=>setHovering(s.id)} onMouseLeave={()=>setHovering(null)} className="w-full text-left px-3 py-1 bru-pressable hover:bg-neutral-200 flex items-center justify-between gap-2"><span className="text-[10px] tracking-widest font-bold w-12 shrink-0">{s.ref}</span><span className="text-[11px] uppercase flex-1 truncate">{s.name}</span><span className="text-[9px] tracking-widest opacity-70 shrink-0">{s.distance[l].split("—")[0].trim()}</span></button></li>))}
            </ul>
          </div>
          <div className="p-4 flex-1 bg-black text-white bru-flicker">
            <div className="text-[10px] uppercase tracking-widest opacity-60 mb-1">{t.sheetTitle}</div>
            {active ? (<div><div className="flex items-baseline justify-between mb-2"><span className="text-[10px] tracking-widest font-bold opacity-80">{active.ref}</span><span className="text-[10px] tracking-widest opacity-60 uppercase">{TYPE_LABELS[active.type][l]}</span></div><div className="text-2xl font-bold uppercase leading-none">{active.name}</div><div className="text-[11px] uppercase tracking-widest opacity-70 mt-1">{active.comarca} · {active.date}</div><div className="text-[11px] uppercase tracking-widest opacity-90 mt-2 bru-border-t bru-border-white pt-2">▶ {active.distance[l]}</div><p className="text-[11px] leading-relaxed opacity-80 mt-3">{active.notes[l]}</p><div className="mt-3 text-[10px] uppercase tracking-widest opacity-50">{t.active}: {active.ref} · {t.activeFooter}</div><button onClick={()=>setActive(null)} className="mt-3 bru-border bru-border-white px-3 py-1 text-[10px] uppercase tracking-widest bru-pressable hover:bg-white hover:text-black">{t.closeBtn}</button></div>) : <div className="text-xs uppercase tracking-widest opacity-70">{t.selectStop}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}
