/* PCCD Audit — vragenlijstdefinities
   Bronnen:
   - PCC dimensions (patients / professionals), Nederlandse versie, gebaseerd op de
     dimensies van het Picker Institute.
   - PCPI-S: Person-centred Practice Inventory – Staff (Slater, McCance & McCormack),
     Nederlandse vertaling.
   Schaal: 1 = helemaal mee oneens ... 5 = helemaal mee eens. nvt:true => optie
   "Niet van toepassing", die niet meetelt in het gemiddelde.
*/

const SCALE = { min: 1, max: 5 };

const SCALE_LABELS = {
  nl: ['Helemaal mee oneens', 'Mee oneens', 'Noch eens / noch oneens', 'Mee eens', 'Helemaal mee eens'],
  en: ['Strongly disagree', 'Disagree', 'Neither agree nor disagree', 'Agree', 'Strongly agree']
};
const NVT_LABEL = { nl: 'Niet van toepassing', en: 'Not applicable' };

/* ---------- gedeelde dimensies: patiënten & professionals ---------- */
const PCC_DIMS = [
  { id: 'd1', nl: 'Rekening houden met voorkeuren', en: 'Respect for preferences' },
  { id: 'd2', nl: 'Fysiek comfort', en: 'Physical comfort' },
  { id: 'd3', nl: 'Coördinatie van zorg', en: 'Coordination of care' },
  { id: 'd4', nl: 'Continuïteit en transitie', en: 'Continuity and transition' },
  { id: 'd5', nl: 'Emotionele ondersteuning', en: 'Emotional support' },
  { id: 'd6', nl: 'Toegankelijkheid van de zorg', en: 'Access to care' },
  { id: 'd7', nl: 'Informatie en educatie', en: 'Information and education' },
  { id: 'd8', nl: 'Familie en vrienden', en: 'Family and friends' }
];

const PATIENT_ITEMS = [
  ['p1',  'd1', 'Ik voelde mij serieus genomen', false],
  ['p2',  'd1', 'De zorg was gericht op het verbeteren van mijn algehele welzijn', false],
  ['p3',  'd1', 'Er werd rekening gehouden met mijn wensen en voorkeuren bij de keuze voor een behandeling', false],
  ['p4',  'd1', 'Ik werd betrokken bij beslissingen over mijn behandeling', false],
  ['p5',  'd1', 'Er werd rekening gehouden met de invloed die de behandeling kan hebben op mijn leven', false],
  ['p6',  'd1', 'Ik werd geholpen om mijn eigen behandeldoelen te bepalen', false],
  ['p7',  'd1', 'Ik voelde mij ondersteund om mijn behandeldoelen te bereiken', false],
  ['p8',  'd1', 'Ik kreeg advies waar ik ook echt wat mee kon', false],

  ['p9',  'd2', 'Er werd aandacht gegeven aan mijn lichamelijke comfort (zoals het behandelen van pijn, kortademigheid)', true],
  ['p10', 'd2', 'Er werd aandacht gegeven aan vermoeidheid en slapeloosheid', false],
  ['p11', 'd2', 'De (wacht)ruimtes waren schoon', false],
  ['p12', 'd2', 'De (wacht)ruimtes waren comfortabel', false],
  ['p13', 'd2', 'In de behandelkamer(s) en bij de balie was sprake van voldoende privacy', false],

  ['p14', 'd3', 'Iedereen was goed geïnformeerd; ik hoefde mijn verhaal maar één keer te vertellen', true],
  ['p15', 'd3', 'De zorg was goed afgestemd tussen de betrokken behandelaars', true],
  ['p16', 'd3', 'Ik wist wie mijn zorg coördineerde', false],
  ['p17', 'd3', 'Ik kon gemakkelijk bij iemand terecht met vragen', false],

  ['p18', 'd4', 'Ik werd bij een doorverwijzing naar een andere zorgverlener (specialist / diëtist / fysiotherapeut / psycholoog / psychiater) goed geïnformeerd over waar ik naartoe moest gaan en waarom', true],
  ['p19', 'd4', 'Bij een doorverwijzing werd al mijn informatie goed doorgegeven', true],
  ['p20', 'd4', 'Adviezen (zoals medicatie) van verschillende behandelaars (medisch specialisten en huisarts) werden goed op elkaar afgestemd', true],
  ['p21', 'd4', 'De behandeling van de huisarts sluit aan op de behandeling van andere zorgverleners', true],

  ['p22', 'd5', 'Er werd ook emotionele ondersteuning geboden', false],
  ['p23', 'd5', 'Er was aandacht voor mogelijke gevoelens van angst, somberheid en bezorgdheid', false],
  ['p24', 'd5', 'Ik werd gewezen op de mogelijkheden voor meer intensieve emotionele ondersteuning', true],
  ['p25', 'd5', 'Er werd aandacht besteed aan het effect van mijn gezondheid op mijn privéleven (gezin, familie, werk, sociaal leven)', false],

  ['p26', 'd6', 'Het was geen probleem om van mijn huis naar de behandelaar/instelling te gaan en weer terug', false],
  ['p27', 'd6', 'De instelling zelf was goed toegankelijk', false],
  ['p28', 'd6', 'Mijn eigen bijdrage en het eigen risico vormden voor mij geen belemmering om de benodigde zorg en/of medicijnen te krijgen', false],
  ['p29', 'd6', 'Ik kon gemakkelijk op korte termijn een afspraak inplannen', false],
  ['p30', 'd6', 'Ik hoefde bij een bezoek niet lang te wachten voordat ik aan de beurt was', false],
  ['p31', 'd6', 'Ik kon gemakkelijk een herhaalrecept aanvragen', true],

  ['p32', 'd7', 'Ik werd goed geïnformeerd', false],
  ['p33', 'd7', 'De informatie die ik kreeg werd goed uitgelegd', false],
  ['p34', 'd7', 'Ik had makkelijk toegang tot mijn eigen gegevens (laboratoriumuitslagen, medicatieoverzicht, doorverwijzingen)', false],
  ['p35', 'd7', 'Ik kon alle vragen stellen die ik wilde', false],

  ['p36', 'd8', 'Met mijn instemming werden familieleden betrokken bij mijn behandeling', true],
  ['p37', 'd8', 'Er werd aandacht gegeven aan de zorg en ondersteuning gegeven door familieleden', true],
  ['p38', 'd8', 'Er werd aandacht gegeven aan mogelijke vragen van mijn familieleden', true]
];

const PROF_ITEMS = [
  ['f1',  'd1', '… worden patiënten serieus genomen', false],
  ['f2',  'd1', '… is de zorg gericht op het verbeteren van het algehele welzijn van patiënten', false],
  ['f3',  'd1', '… wordt er rekening gehouden met de persoonlijke wensen en voorkeuren van patiënten bij de keuze voor een behandeling', false],
  ['f4',  'd1', '… worden patiënten betrokken bij beslissingen over de behandeling', false],
  ['f5',  'd1', '… wordt er rekening gehouden met de invloed die de behandeling kan hebben op het leven van patiënten', false],
  ['f6',  'd1', '… worden patiënten geholpen om hun eigen behandeldoelen te bepalen', false],
  ['f7',  'd1', '… worden patiënten ondersteund om de opgestelde behandeldoelen te bereiken', false],
  ['f8',  'd1', '… worden adviezen gegeven waar patiënten ook echt wat mee kunnen', false],

  ['f9',  'd2', '… wordt aandacht gegeven aan het lichamelijke comfort van patiënten (zoals het behandelen van pijn, kortademigheid)', true],
  ['f10', 'd2', '… wordt aandacht gegeven aan vermoeidheid en slapeloosheid', false],
  ['f11', 'd2', '… zijn de (wacht)ruimtes schoon', false],
  ['f12', 'd2', '… zijn de (wacht)ruimtes comfortabel', false],
  ['f13', 'd2', '… is er in de behandelkamer(s) en bij de balie sprake van voldoende privacy', false],

  ['f14', 'd3', '… is iedereen goed geïnformeerd; patiënten hoeven hun verhaal maar één keer te vertellen', true],
  ['f15', 'd3', '… is de zorg goed afgestemd tussen de betrokken behandelaars', true],
  ['f16', 'd3', '… is voor patiënten duidelijk wie hun zorg coördineert', false],
  ['f17', 'd3', '… kunnen patiënten gemakkelijk bij iemand terecht met vragen', false],

  ['f18', 'd4', '… worden patiënten bij een doorverwijzing naar een andere zorgverlener (specialist / diëtist / fysiotherapeut / psycholoog / psychiater) goed geïnformeerd over waar ze naartoe moeten gaan en waarom', true],
  ['f19', 'd4', '… wordt bij een doorverwijzing alle informatie over de patiënt goed doorgegeven aan de andere zorgverleners', true],
  ['f20', 'd4', '… worden adviezen (zoals medicatie) van verschillende behandelaars (medisch specialisten en huisarts) goed op elkaar afgestemd', true],
  ['f21', 'd4', '… sluit de behandeling van de huisarts goed aan op de behandeling van andere zorgverleners', true],

  ['f22', 'd5', '… wordt er ook emotionele ondersteuning geboden', false],
  ['f23', 'd5', '… is er aandacht voor gevoelens van angst, somberheid en bezorgdheid van patiënten', false],
  ['f24', 'd5', '… wordt er gewezen op de mogelijkheden voor meer intensieve emotionele ondersteuning door (in)formele zorg', true],
  ['f25', 'd5', '… wordt er aandacht besteed aan de mogelijke gevolgen voor het privéleven van patiënten (gezin, familie, werk, sociaal leven)', false],

  ['f26', 'd6', '… is het geen probleem voor patiënten om ons te bereiken', false],
  ['f27', 'd6', '… is de instelling zelf goed toegankelijk', false],
  ['f28', 'd6', '… vormen de eigen bijdrage en het eigen risico geen belemmering voor patiënten om de benodigde zorg en/of medicijnen te krijgen', false],
  ['f29', 'd6', '… kunnen patiënten gemakkelijk op korte termijn een afspraak inplannen', false],
  ['f30', 'd6', '… hoeven patiënten bij een bezoek niet lang te wachten totdat zij aan de beurt zijn', false],
  ['f31', 'd6', '… kunnen patiënten gemakkelijk een herhaalrecept aanvragen', true],

  ['f32', 'd7', '… worden patiënten goed geïnformeerd', false],
  ['f33', 'd7', '… wordt de informatie goed uitgelegd aan patiënten', false],
  ['f34', 'd7', '… hebben patiënten gemakkelijk toegang tot hun eigen gegevens (laboratoriumuitslagen, medicatieoverzicht, doorverwijzingen)', false],
  ['f35', 'd7', '… kunnen patiënten alle vragen stellen die ze willen', false],

  ['f36', 'd8', '… worden familieleden — met toestemming van de patiënt — ook betrokken bij de behandeling van patiënten', true],
  ['f37', 'd8', '… wordt aandacht gegeven aan de rol van familieleden als mantelzorgers van patiënten', true],
  ['f38', 'd8', '… wordt aandacht gegeven aan mogelijke vragen van familieleden van patiënten', true]
];

/* ---------- PCPI-S ---------- */
const PCPIS_DIMS = [
  { id: 'v1', domain: 'pre', nl: 'Professioneel bekwaam', en: 'Professionally competent' },
  { id: 'v2', domain: 'pre', nl: 'Ontwikkelde interpersoonlijke vaardigheden', en: 'Developed interpersonal skills',
    shortNl: 'Interpersoonlijke vaardigheden', shortEn: 'Interpersonal skills' },
  { id: 'v3', domain: 'pre', nl: 'Toegewijd aan het werk', en: 'Commitment to the job' },
  { id: 'v4', domain: 'pre', nl: 'Zelfkennis', en: 'Knowing self' },
  { id: 'v5', domain: 'pre', nl: 'Duidelijkheid over overtuigingen en waarden', en: 'Clarity of beliefs and values',
    shortNl: 'Duidelijkheid over waarden', shortEn: 'Clarity of beliefs' },
  { id: 'v6', domain: 'env', nl: 'Samenstelling van vaardigheden', en: 'Appropriate skill mix' },
  { id: 'v7', domain: 'env', nl: 'Systemen voor gedeelde besluitvorming', en: 'Shared decision-making systems',
    shortNl: 'Systemen voor besluitvorming', shortEn: 'Decision-making systems' },
  { id: 'v8', domain: 'env', nl: 'Effectieve samenwerking tussen medewerkers', en: 'Effective staff relationships',
    shortNl: 'Effectieve samenwerking', shortEn: 'Staff relationships' },
  { id: 'v9', domain: 'env', nl: 'Macht delen', en: 'Power sharing' },
  { id: 'v10', domain: 'env', nl: 'Ruimte voor innovatie en risico nemen', en: 'Potential for innovation and risk-taking',
    shortNl: 'Innovatie en risico nemen', shortEn: 'Innovation and risk-taking' },
  { id: 'v11', domain: 'env', nl: 'De fysieke omgeving', en: 'The physical environment' },
  { id: 'v12', domain: 'env', nl: 'Ondersteunende organisatiesystemen', en: 'Supportive organisational systems',
    shortNl: 'Organisatiesystemen', shortEn: 'Organisational systems' },
  { id: 'v13', domain: 'proc', nl: 'Werken met overtuigingen en waarden', en: "Working with the patient's beliefs and values",
    shortNl: 'Werken met waarden', shortEn: "Patient's beliefs and values" },
  { id: 'v14', domain: 'proc', nl: 'Gedeelde besluitvorming', en: 'Shared decision making' },
  { id: 'v15', domain: 'proc', nl: 'Betrokkenheid', en: 'Engaging authentically' },
  { id: 'v16', domain: 'proc', nl: 'Meelevende aanwezigheid', en: 'Being sympathetically present' },
  { id: 'v17', domain: 'proc', nl: 'Holistische zorg verlenen', en: 'Providing holistic care' }
];

const PCPIS_DOMAINS = [
  { id: 'pre',  nl: 'Vereisten',      en: 'Prerequisites' },
  { id: 'env',  nl: 'Zorgomgeving',   en: 'Care environment' },
  { id: 'proc', nl: 'Zorgprocessen',  en: 'Care processes' }
];

const PCPIS_ITEMS = [
  ['s1','v1','Ik beschik over de benodigde vaardigheden om zorgopties te bespreken.'],
  ['s2','v1','Bij het verlenen van zorg let ik op meer dan alleen de directe fysieke handeling.'],
  ['s3','v1','Ik zoek actief naar mogelijkheden om mijn professionele bekwaamheid te vergroten.'],
  ['s4','v2','Ik zorg ervoor dat ik de perspectieven van anderen hoor en erken.'],
  ['s5','v2','In mijn communicatie toon ik respect voor anderen.'],
  ['s6','v2','Ik gebruik verschillende communicatietechnieken om gezamenlijk overeengekomen oplossingen te vinden.'],
  ['s7','v2','Ik let op hoe mijn non-verbale signalen mijn contact met anderen beïnvloeden.'],
  ['s8','v3','Ik streef ernaar om zorg van hoge kwaliteit te leveren aan mensen.'],
  ['s9','v3','Ik zoek mogelijkheden om de persoon en hun familie te leren kennen om holistische zorg te bieden.'],
  ['s10','v3','Ik doe extra mijn best om tijd door te brengen met mensen die zorg ontvangen.'],
  ['s11','v3','Ik streef ernaar om zorg te bieden die gebaseerd is op bewijs.'],
  ['s12','v3','Ik zoek voortdurend naar mogelijkheden om de zorgervaring te verbeteren.'],
  ['s13','v4','Ik neem de tijd om te onderzoeken waarom ik in bepaalde situaties op een bepaalde manier reageer.'],
  ['s14','v4','Ik gebruik reflectie om te controleren of mijn handelingen in lijn zijn met mijn manier van zijn.'],
  ['s15','v4','Ik let op hoe mijn levenservaringen mijn praktijk beïnvloeden.'],
  ['s16','v5','Ik vraag actief om feedback van anderen over mijn praktijk.'],
  ['s17','v5','Ik spreek collega’s aan wanneer hun praktijk niet overeenkomt met de gedeelde waarden en overtuigingen van ons team.'],
  ['s18','v5','Ik ondersteun collega’s bij het ontwikkelen van hun praktijk in overeenstemming met de gedeelde waarden en overtuigingen van het team.'],
  ['s19','v6','Ik herken wanneer er een tekort aan kennis en vaardigheden in het team is en wat de impact daarvan is op de zorgverlening.'],
  ['s20','v6','Ik kan beargumenteren wanneer de teamvaardigheden onder het acceptabele niveau liggen.'],
  ['s21','v6','Ik waardeer de inbreng van alle teamleden en hun bijdrage aan de zorg.'],
  ['s22','v7','Ik neem actief deel aan teamvergaderingen die mijn besluitvorming beïnvloeden.'],
  ['s23','v7','Ik neem deel aan organisatiebrede besluitvormingsfora die invloed hebben op de praktijk.'],
  ['s24','v7','Ik krijg de kans om actief deel te nemen aan besluitvorming binnen mijn afdeling/dienst.'],
  ['s25','v7','Mijn mening wordt gevraagd in klinische besluitvorming (bijvoorbeeld tijdens overdrachten, casusbesprekingen, ontslagplanning).'],
  ['s26','v8','Ik werk in een team dat mijn bijdrage aan persoonsgerichte zorg waardeert.'],
  ['s27','v8','Ik werk in een team dat ieders bijdrage aan persoonsgerichte zorg aanmoedigt.'],
  ['s28','v8','Mijn collega’s zijn positieve voorbeelden in het opbouwen van effectieve relaties.'],
  ['s29','v9','De bijdrage van collega’s wordt erkend en gewaardeerd.'],
  ['s30','v9','Ik draag actief bij aan het ontwikkelen van gedeelde doelen.'],
  ['s31','v9','De leidinggevende bevordert participatie.'],
  ['s32','v9','Ik word aangemoedigd en ondersteund om ontwikkelingen in de praktijk te leiden.'],
  ['s33','v10','Ik word ondersteund om dingen op een andere manier te doen om mijn praktijk te verbeteren.'],
  ['s34','v10','Ik kan het gebruik van bewijs combineren met het nemen van verantwoorde risico’s.'],
  ['s35','v10','Ik zet me in om de zorg te verbeteren door praktijken ter discussie te stellen.'],
  ['s36','v11','Ik let op hoe de fysieke omgeving de waardigheid van mensen beïnvloedt.'],
  ['s37','v11','Ik moedig anderen aan om na te denken over hoe elementen zoals geluid, licht of temperatuur persoonsgerichtheid beïnvloeden.'],
  ['s38','v11','Ik zoek creatieve manieren om de fysieke omgeving te verbeteren.'],
  ['s39','v12','In mijn team nemen we de tijd om onze successen te vieren.'],
  ['s40','v12','Mijn organisatie erkent en beloont succes.'],
  ['s41','v12','Mijn bijdrage aan een goede zorgervaring wordt erkend.'],
  ['s42','v12','Ik word ondersteund in het uiten van zorgen over een aspect van de zorg.'],
  ['s43','v12','Ik krijg regelmatig de gelegenheid om mijn praktijk en professionele ontwikkeling te bespreken.'],
  ['s44','v13','Ik verwerk mijn kennis over de persoon in de zorgverlening.'],
  ['s45','v13','Ik werk met de persoon binnen de context van hun familie en mantelzorgers.'],
  ['s46','v13','Ik vraag feedback over hoe mensen hun zorgervaring begrijpen.'],
  ['s47','v13','Ik moedig mensen aan om te bespreken wat voor hen belangrijk is.'],
  ['s48','v14','Ik betrek de familie bij zorgbeslissingen wanneer dat gepast is en/of in lijn is met de wensen van de persoon.'],
  ['s49','v14','Ik stel samen met de persoon gezondheidsdoelen op voor de toekomst.'],
  ['s50','v14','Ik stimuleer mensen om informatie over hun zorg op te vragen bij andere zorgverleners.'],
  ['s51','v15','Ik probeer het perspectief van de persoon te begrijpen.'],
  ['s52','v15','Ik zoek naar oplossingen wanneer mijn doelen verschillen van die van de persoon.'],
  ['s53','v15','Ik betrek mensen bij het zorgproces waar dat gepast is.'],
  ['s54','v16','Ik luister actief naar mensen om onvervulde behoeften te identificeren.'],
  ['s55','v16','Ik verzamel extra informatie om mensen beter te ondersteunen in hun zorg.'],
  ['s56','v16','Ik geef mensen mijn volledige aandacht wanneer ik bij hen ben.'],
  ['s57','v17','Ik probeer een volledig beeld van de persoon te krijgen.'],
  ['s58','v17','Ik beoordeel de behoeften van de persoon, rekening houdend met alle aspecten van hun leven.'],
  ['s59','v17','Ik lever zorg die rekening houdt met de gehele persoon.']
];

function mkItems(rows) {
  return rows.map(([id, dim, text, nvt]) => ({ id, dim, text, nvt: !!nvt }));
}

const QUESTIONNAIRES = {
  patienten: {
    key: 'patienten',
    file: 'patienten.html',
    series: 1,
    nl: { title: 'Patiënten', subtitle: 'Persoonsgerichte zorg zoals ervaren door patiënten of cliënten',
          intro: 'Vragen over persoonsgerichte zorg zoals door de patiënt ervaren, over de afgelopen zes maanden. Vraag door op wat er achter een score zit — de toelichting is tijdens de presentatie waardevoller dan het cijfer.',
          stem: '' },
    en: { title: 'Patients', subtitle: 'Person-centred care as experienced by patients or clients',
          intro: 'Questions about person-centred care as experienced by the patient over the past six months. Probe what sits behind a score — the explanation is worth more in your presentation than the number.',
          stem: '' },
    dims: PCC_DIMS,
    items: mkItems(PATIENT_ITEMS)
  },
  professionals: {
    key: 'professionals',
    file: 'professionals.html',
    series: 2,
    nl: { title: 'Professionals', subtitle: 'Persoonsgerichte zorg zoals ervaren door zorgverleners',
          intro: 'Dezelfde acht dimensies, nu vanuit het perspectief van de zorgverlener. Vul eerst de naam van de organisatie in; die verschijnt dan in elke vraag.',
          stem: 'Binnen {org}…' },
    en: { title: 'Professionals', subtitle: 'Person-centred care as experienced by care providers',
          intro: 'The same eight dimensions, now from the care provider’s perspective. Enter the organisation’s name first; it then appears in every question.',
          stem: 'Within {org}…' },
    dims: PCC_DIMS,
    items: mkItems(PROF_ITEMS)
  },
  pcpis: {
    key: 'pcpis',
    file: 'pcpi-s.html',
    series: 3,
    nl: { title: 'PCPI-S', subtitle: 'Persoonsgerichte Praktijk Inventaris — Medewerkers',
          intro: 'Negenenvijftig uitspraken over de eigen praktijk, verdeeld over zeventien constructen in drie domeinen: vereisten bij de medewerker, de zorgomgeving en de zorgprocessen.',
          stem: '' },
    en: { title: 'PCPI-S', subtitle: 'Person-centred Practice Inventory — Staff',
          intro: 'Fifty-nine statements about one’s own practice, across seventeen constructs in three domains: prerequisites, the care environment and the care processes.',
          stem: '' },
    dims: PCPIS_DIMS,
    domains: PCPIS_DOMAINS,
    items: mkItems(PCPIS_ITEMS)
  }
};

/* ---------- achtergrondvragen (voor filteren en groepsvergelijking) ---------- */
// type: 'choice' = keuzelijst, 'text' = vrij veld (niet filterbaar als reeks)
const BG_COMMON = [
  { id: 'g', type: 'choice', nl: 'Geslacht', en: 'Gender',
    opts: [['v','Vrouw','Woman'],['m','Man','Man'],['x','Anders','Other'],['z','Zeg ik liever niet','Prefer not to say']] },
  { id: 'a', type: 'choice', nl: 'Leeftijd', en: 'Age',
    opts: [['1','18–24','18–24'],['2','25–34','25–34'],['3','35–44','35–44'],['4','45–54','45–54'],['5','55–64','55–64'],['6','65+','65+']] },
  { id: 'o', type: 'choice', nl: 'Hoogst afgeronde opleiding', en: 'Highest completed education',
    opts: [['0','Geen opleiding afgerond','No qualification'],['1','Basisonderwijs','Primary education'],
           ['2','VMBO','VMBO (pre-vocational)'],['3','MAVO','MAVO'],['4','HAVO','HAVO'],['5','VWO','VWO'],
           ['6','MBO','MBO (vocational)'],['7','HBO','HBO (applied university)'],['8','WO','University']] }
];
const BG_PROF = [
  { id: 't', type: 'text', nl: 'Afdeling of team', en: 'Ward or team', ph: 'bijv. Afdeling 2 / Wijkteam Noord' },
  { id: 'f', type: 'choice', nl: 'Functie', en: 'Role',
    opts: [['h','Helpende of zorgassistent','Care assistant'],['v','Verzorgende','Nursing assistant'],
           ['p','Verpleegkundige','Nurse'],['b','Arts of behandelaar','Doctor or clinician'],
           ['r','Paramedicus','Allied health professional'],['l','Leidinggevende','Manager'],
           ['o','Ondersteunend of facilitair','Support or facilities'],['x','Anders','Other']] },
  { id: 'e', type: 'choice', nl: 'Jaren werkervaring in de zorg', en: 'Years of experience in care',
    opts: [['1','Minder dan 1 jaar','Less than 1 year'],['2','1–5 jaar','1–5 years'],['3','6–10 jaar','6–10 years'],
           ['4','11–20 jaar','11–20 years'],['5','Meer dan 20 jaar','More than 20 years']] }
];
const BG_PAT = [
  { id: 'd', type: 'choice', nl: 'Hoe lang ontvangt u hier zorg', en: 'How long have you received care here',
    opts: [['1','Korter dan 3 maanden','Less than 3 months'],['2','3 tot 12 maanden','3 to 12 months'],
           ['3','1 tot 5 jaar','1 to 5 years'],['4','Langer dan 5 jaar','More than 5 years']] },
  { id: 'v', type: 'choice', nl: 'Vorm van zorg', en: 'Type of care',
    opts: [['t','Thuiszorg','Home care'],['w','Verpleeghuis of woonzorg','Nursing home or residential care'],
           ['z','Ziekenhuis of polikliniek','Hospital or outpatient clinic'],['h','Huisartsenzorg','GP care'],
           ['g','Geestelijke gezondheidszorg','Mental health care'],['x','Anders','Other']] },
  { id: 'n', type: 'choice', nl: 'Is er een naaste bij uw zorg betrokken', en: 'Is a relative involved in your care',
    opts: [['j','Ja','Yes'],['s','Soms','Sometimes'],['n','Nee','No']] }
];

function bgFields(qKey) {
  return BG_COMMON.concat(qKey === 'patienten' ? BG_PAT : BG_PROF);
}
