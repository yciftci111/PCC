/* PCCD Audit — adviesteksten en adviesgenerator.
   Drie scorebanden op de schaal 1-5:
     laag   < 2,5   aandachtspunt
     midden 2,5-3,49 in ontwikkeling
     hoog   >= 3,5  sterk punt
   Per dimensie: 'beeld' (wat de score zegt), 'org' (wat de organisatie kan doen)
   en 'pat' (wat de patient ermee kan). PCPI-S gebruikt 'beeld' en 'org'. */

const BANDS = [
  { id: 'laag',   max: 2.5, nl: 'Aandachtspunt',    en: 'Needs attention' },
  { id: 'midden', max: 3.5, nl: 'In ontwikkeling',  en: 'Developing' },
  { id: 'hoog',   max: 99,  nl: 'Sterk punt',       en: 'Strength' }
];
function bandOf(v) {
  if (v === null || v === undefined || isNaN(v)) return null;
  return BANDS.find(b => v < b.max) || BANDS[BANDS.length - 1];
}

/* ---------- PCC-dimensies (patienten en professionals) ---------- */
const ADVICE_PCC = {
d1: {
  laag: {
    beeld: 'Wensen en voorkeuren spelen nauwelijks een rol in wat er gebeurt; de behandeling volgt vooral de professionele route.',
    org: 'Leg per persoon vast wat er voor hem of haar toe doet en koppel dat aan concrete afspraken in het zorgplan. Begin bij een handvol mensen en bespreek in het team wat het oplevert — dat overtuigt sterker dan een instructie.',
    pat: 'Schrijf voor uw volgende afspraak op wat u belangrijk vindt en wat u wilt kunnen blijven doen, en begin het gesprek daarmee. U mag vragen dat dit in uw dossier komt te staan.'
  },
  midden: {
    beeld: 'Er wordt naar voorkeuren gevraagd, maar het werkt niet altijd door in wat er daadwerkelijk gebeurt.',
    org: 'Toets in dossieronderzoek of vastgelegde voorkeuren terug te zien zijn in de geleverde zorg. Vastleggen zonder doorwerking geeft schijnzekerheid.',
    pat: 'Vraag bij een volgende afspraak hoe uw voorkeuren zijn meegenomen in het plan. Merkt u dat er iets niet mee gedaan is, benoem dat dan.'
  },
  hoog: {
    beeld: 'Voorkeuren en wat iemand belangrijk vindt sturen aantoonbaar de zorg.',
    org: 'Besteed gerichte aandacht aan mensen die zich moeilijk uiten — daar zit nu het resterende risico. Actualiseer het beeld bij elke verandering in de situatie.',
    pat: 'Dit gaat goed. Blijf aangeven wanneer uw situatie of uw wensen veranderen, zodat het plan mee blijft bewegen.'
  }
},
d2: {
  laag: {
    beeld: 'Lichamelijk comfort en de omgeving krijgen weinig aandacht: pijn, vermoeidheid, rust of privacy blijven liggen.',
    org: 'Dit is meestal de snelste winst. Verbeteringen aan comfort, schoonmaak, geluid en privacy zijn tastbaar en direct merkbaar. Meet pijn systematisch en evalueer of de behandeling werkt — dat laatste wordt het vaakst overgeslagen.',
    pat: 'Meld pijn, vermoeidheid of ongemak actief, ook als er niet naar gevraagd wordt. Geef ook aan wanneer u zich niet op uw gemak voelt door de ruimte of het gebrek aan privacy.'
  },
  midden: {
    beeld: 'De basis is op orde, maar comfort, rust en privacy zijn niet consequent geregeld.',
    org: 'Loop een dienst mee en kijk waar het misgaat: nachtelijk geluid, wachttijd in een ongemakkelijke ruimte, een gesprek dat meeluisterbaar is. Los de concrete gevallen op in plaats van beleid te maken.',
    pat: 'Benoem de momenten waarop het ongemakkelijk was. Juist die concrete voorbeelden helpen een organisatie meer dan een algemeen oordeel.'
  },
  hoog: {
    beeld: 'Comfort, rust en privacy zijn goed geregeld en worden ook zo ervaren.',
    org: 'Blijf alert op terugval bij drukte en onderbezetting — dit is het eerste wat sneuvelt. Meet geluid en nachtelijke verstoringen in plaats van ze in te schatten.',
    pat: 'Dit gaat goed. Blijf het melden wanneer iets verandert, zodat het op peil blijft.'
  }
},
d3: {
  laag: {
    beeld: 'De zorg valt uiteen in losse contacten: informatie wordt niet gedeeld en het is onduidelijk wie het overzicht heeft.',
    org: 'Regel een vast aanspreekpunt per persoon als eerste stap, en zorg dat het zorgplan standaard meegaat in elke overdracht. Dit is vaak organisatorisch klein en voor de patient groot.',
    pat: 'Vraag wie uw vaste aanspreekpunt is en noteer de naam. Moet u uw verhaal opnieuw vertellen, zeg dan dat u dat al eerder heeft gedaan en aan wie.'
  },
  midden: {
    beeld: 'De afstemming werkt meestal, maar hapert bij drukte, weekenden of wisselende diensten.',
    org: 'Kijk waar de informatie precies verdwijnt — meestal bij dienstwissel, ontslag of overplaatsing. Zorg dat de persoonsgerichte werkwijze ook geldt voor invallers en uitzendkrachten.',
    pat: 'Vraag bij elke nieuwe zorgverlener of hij of zij op de hoogte is. Dat voelt ongemakkelijk, maar voorkomt fouten.'
  },
  hoog: {
    beeld: 'De zorg voelt als een samenhangend geheel met een duidelijk aanspreekpunt.',
    org: 'Toets de ervaren samenhang bij de patient zelf; organisatorische continuiteit en ervaren continuiteit zijn niet hetzelfde. Werk aan de overgang naar ketenpartners, doorgaans de zwakste schakel.',
    pat: 'Dit gaat goed. Laat het weten wanneer uw aanspreekpunt verandert of onbereikbaar blijkt.'
  }
},
d4: {
  laag: {
    beeld: 'Bij doorverwijzing en overdracht gaat informatie verloren; adviezen van verschillende behandelaars sluiten niet op elkaar aan.',
    org: 'Dit is het meest concreet auditeerbare probleem in de hele lijst en tegelijk het gevaarlijkst, met name rond medicatie. Controleer een reeks recente overdrachten op volledigheid en maak van de uitkomst een verbeterpunt met eigenaar en termijn.',
    pat: 'Neem bij elke nieuwe behandelaar een actueel medicatieoverzicht mee. Krijgt u tegenstrijdige adviezen, leg die dan naast elkaar en vraag welke voorgaat.'
  },
  midden: {
    beeld: 'Overdrachten verlopen meestal goed, maar niet betrouwbaar genoeg om op te vertrouwen.',
    org: 'Spreek af wat er minimaal mee moet bij een overdracht en controleer steekproefsgewijs of dat gebeurt. Betrek de huisarts expliciet; daar loopt de afstemming het vaakst mis.',
    pat: 'Vraag bij een doorverwijzing wat er precies wordt doorgegeven en aan wie. Vraag ook wanneer u iets terughoort.'
  },
  hoog: {
    beeld: 'Overgangen verlopen soepel en informatie komt volledig mee.',
    org: 'Borg dit bij ketenpartners en bij wisseling van systemen; een ICT-migratie ondermijnt vaak onbedoeld wat is opgebouwd.',
    pat: 'Dit gaat goed. Blijf zelf een overzicht bijhouden van wie waarbij betrokken is, als achtervang.'
  }
},
d5: {
  laag: {
    beeld: 'De aandacht gaat naar het lichamelijke; angst, somberheid en de gevolgen voor het dagelijks leven blijven onbesproken.',
    org: 'Beleg emotionele ondersteuning op de momenten die ertoe doen: diagnose, achteruitgang, levenseinde. Zorg dat medewerkers weten waar zij naartoe kunnen verwijzen — het ontbreken van een route is vaker de oorzaak dan onwil.',
    pat: 'Geef aan wanneer u ergens mee zit, ook als er niet naar gevraagd wordt. Vraag welke ondersteuning er is; die is er vaak wel, maar wordt niet uit zichzelf aangeboden.'
  },
  midden: {
    beeld: 'Er is aandacht voor hoe het met iemand gaat, maar het hangt af van wie er voor je staat.',
    org: 'Maak van aandacht een afspraak in plaats van een eigenschap: een vast moment, een vaste vraag. Oefen met lastige gesprekken in plaats van erop te hopen.',
    pat: 'Merkt u verschil tussen zorgverleners, benoem dat dan. Dat is bruikbare informatie voor de organisatie.'
  },
  hoog: {
    beeld: 'Er is werkelijk aandacht voor hoe het met iemand gaat, ook buiten het medische.',
    org: 'Ondersteun medewerkers in hun eigen emotionele belasting; dit niveau is niet vol te houden zonder dat. Houd de aandacht vast op de momenten waarop het onder druk staat.',
    pat: 'Dit gaat goed. Blijf ook de minder zichtbare dingen benoemen, zoals de gevolgen thuis of op het werk.'
  }
},
d6: {
  laag: {
    beeld: 'De zorg is moeilijk te bereiken: wachttijden, afspraken maken, of kosten staan in de weg.',
    org: 'Meet bereikbaarheid en reactietijden in plaats van ze aan te nemen, en bespreek de uitkomst met patienten. Kijk apart naar financiele drempels; die blijven vaak onzichtbaar omdat mensen er niet over beginnen.',
    pat: 'Geef aan wanneer u zorg heeft uitgesteld en waarom. Loopt het op kosten vast, vraag dan naar de mogelijkheden — die zijn er vaak, maar worden zelden uit zichzelf genoemd.'
  },
  midden: {
    beeld: 'De toegang werkt, maar niet altijd op het moment dat het nodig is.',
    org: 'Kijk naar de momenten buiten kantooruren en bij verslechtering; daar zit meestal het gat. Spreek reactietijden af en maak die bekend bij patienten.',
    pat: 'Vraag wat u moet doen als het buiten kantooruren niet goed gaat, en noteer dat. Onzekerheid daarover weegt zwaar.'
  },
  hoog: {
    beeld: 'Mensen kunnen terecht wanneer zij dat nodig hebben.',
    org: 'Bespreek de gemeten toegang periodiek met patienten en houd de financiele drempel in beeld.',
    pat: 'Dit gaat goed. Laat het weten als dit verandert.'
  }
},
d7: {
  laag: {
    beeld: 'Informatie komt niet aan: te weinig, te laat, of niet in begrijpelijke taal.',
    org: 'Voer een terugvraagmethode in: controleer of de uitleg is begrepen, niet of zij is gegeven. Zorg voor materiaal dat past bij laaggeletterdheid en een taalbarriere — dit mag geen uitzonderingsgrond zijn.',
    pat: 'Vraag door tot u het begrijpt, en vraag of u het mag herhalen in uw eigen woorden. Neem iemand mee naar een belangrijk gesprek; twee mensen onthouden meer dan een.'
  },
  midden: {
    beeld: 'Er wordt geinformeerd, maar of het aankomt wordt niet gecontroleerd.',
    org: 'Verschuif van informeren naar controleren of het begrepen is. Kijk ook naar de toegang tot het eigen dossier; daar valt vaak eenvoudig winst te halen.',
    pat: 'Vraag om schriftelijke informatie of om toegang tot uw eigen gegevens, zodat u het rustig kunt nalezen.'
  },
  hoog: {
    beeld: 'Mensen zijn goed geinformeerd en begrijpen wat er gebeurt.',
    org: 'Betrek patienten bij het verbeteren van het informatiemateriaal en bewaak de kwaliteit bij nieuwe medewerkers.',
    pat: 'Dit gaat goed. Blijf vragen stellen wanneer er iets verandert.'
  }
},
d8: {
  laag: {
    beeld: 'Naasten blijven buiten beeld: zij worden niet betrokken en hun eigen belasting wordt niet gezien.',
    org: 'Vraag met toestemming van de patient standaard wie er belangrijk is en betrek die persoon. Signaleer mantelzorgbelasting actief; wie overbelast raakt valt uiteindelijk ook als steunbron weg.',
    pat: 'Geef aan wie u bij uw zorg betrokken wilt hebben. Zorgt iemand voor u, benoem dan ook hoe het met hem of haar gaat.'
  },
  midden: {
    beeld: 'Naasten worden betrokken, maar vooral praktisch en niet als partner in de zorg.',
    org: 'Maak van naasten een expliciete partij in het gesprek, met eigen vragen en een eigen aanbod bij overbelasting.',
    pat: 'Vraag of uw naaste bij een volgend gesprek aanwezig kan zijn en of zijn of haar vragen ook aan bod kunnen komen.'
  },
  hoog: {
    beeld: 'Naasten zijn betrokken en hun rol wordt erkend.',
    org: 'Houd de belasting van mantelzorgers in beeld, ook wanneer het goed lijkt te gaan.',
    pat: 'Dit gaat goed. Blijf aangeven wanneer de situatie thuis verandert.'
  }
}
};

/* ---------- PCPI-S: 17 constructen ---------- */
function pcpi(beeldL, actieL, beeldM, actieM, beeldH, actieH) {
  return { laag: { beeld: beeldL, org: actieL }, midden: { beeld: beeldM, org: actieM }, hoog: { beeld: beeldH, org: actieH } };
}
const ADVICE_PCPIS = {
v1: pcpi(
 'De eigen vakbekwaamheid schiet tekort of wordt niet onderhouden.',
 'Breng in beeld welke kennis deze clientgroep vraagt en waar het gat zit. Vraag gericht om scholing in plaats van te wachten op aanbod.',
 'De vakbekwaamheid is op orde, maar het onderhoud is toevallig.',
 'Maak van bijscholing een vast onderdeel van het jaar in plaats van iets wat erbij komt. Zoek actief naar wat je nog niet weet.',
 'De vakbekwaamheid is op orde en wordt actief onderhouden.',
 'Deel wat je weet met collega’s en nieuwe medewerkers; dat is de manier om dit niveau in het team te houden.'),
v2: pcpi(
 'Communicatie blijft bij het overbrengen van informatie; het perspectief van de ander komt er niet in mee.',
 'Oefen concreet met gespreksvoering: luisteren, doorvragen, het perspectief van de ander teruggeven. Vraag een collega mee te kijken.',
 'De communicatie is respectvol, maar het gesprek blijft vaak eenrichtingsverkeer.',
 'Let op je eigen aandeel in het gesprek: hoeveel praat je zelf? Oefen met situaties waarin de ander het verhaal stuurt.',
 'Er wordt werkelijk tweerichtingsverkeer gevoerd, ook non-verbaal.',
 'Gebruik deze vaardigheid in de lastige gesprekken: tegengestelde opvattingen, slecht nieuws, conflict.'),
v3: pcpi(
 'De betrokkenheid bij de persoon achter de client is beperkt; het werk blijft bij de taak.',
 'Maak ruimte om mensen te leren kennen, hoe klein ook. Een kwartier zonder taak levert vaak meer op dan een uur eraan vast.',
 'De toewijding is er, maar komt in de knel door tijd en werkdruk.',
 'Bescherm de tijd voor aandacht juist bij drukte; anders is dat altijd het eerste wat sneuvelt. Bespreek dit in het team, niet alleen met jezelf.',
 'De toewijding aan de persoon is zichtbaar in het dagelijks werk.',
 'Let op de eigen belasting; deze inzet is alleen vol te houden met steun van het team.'),
v4: pcpi(
 'Er wordt weinig gereflecteerd op het eigen handelen en het effect daarvan.',
 'Neem na een moeilijke situatie vijf minuten om op te schrijven wat er gebeurde en wat het met je deed. Breng er een in intervisie in.',
 'Er wordt gereflecteerd, maar onregelmatig en meestal alleen na incidenten.',
 'Maak reflectie een terugkerend moment in plaats van een reactie. Kijk ook naar wat goed ging en waarom.',
 'Reflectie op het eigen handelen is een vast onderdeel van de praktijk.',
 'Betrek ook je eigen levenservaring en waarden in de reflectie; daar zit de diepere laag.'),
v5: pcpi(
 'Waarden en overtuigingen worden niet expliciet gemaakt en collega’s worden niet aangesproken.',
 'Begin met feedback vragen over je eigen praktijk; dat is minder beladen dan een ander aanspreken. Werk in het team aan gedeelde waarden, anders is aanspreken willekeurig.',
 'De waarden zijn bekend, maar elkaar aanspreken gebeurt zelden.',
 'Spreek in het team af hoe je elkaar aanspreekt en oefen dat. Zonder die afspraak blijft het bij een goede intentie.',
 'Waarden zijn expliciet en collega’s spreken elkaar aan.',
 'Bewaak de veiligheid waarin dat kan; aanspreken werkt alleen in een team waar fouten bespreekbaar zijn.'),
v6: pcpi(
 'Tekorten in kennis en vaardigheden in het team worden niet herkend of niet benoemd.',
 'Breng in kaart welke deskundigheid deze clientgroep vraagt en waar het team tekortschiet. Leg dat onderbouwd voor aan de leidinggevende.',
 'Tekorten worden gezien, maar niet consequent geagendeerd.',
 'Maak de samenstelling van het team een terugkerend agendapunt, gekoppeld aan clientervaringen en niet alleen aan formatiecijfers.',
 'Het team ziet zijn eigen sterke en zwakke plekken en benoemt die.',
 'Zorg dat ook de inbreng van minder formeel geschoolde collega’s meetelt in dat beeld.'),
v7: pcpi(
 'Medewerkers hebben geen plek in de besluitvorming over hun eigen werk.',
 'Zoek een concreet besluit waar je invloed op wilt en vraag daar een plaats aan tafel. Begin klein en zichtbaar.',
 'Er zijn overlegvormen, maar de invloed daarvan op besluiten is beperkt.',
 'Vraag na een overleg wat er met de inbreng is gebeurd. Zonder terugkoppeling verwordt meepraten tot een ritueel.',
 'Medewerkers hebben werkelijke invloed op besluiten die hun werk raken.',
 'Let erop dat ook collega’s met minder formeel mandaat aan tafel zitten.'),
v8: pcpi(
 'Het team werkt naast elkaar in plaats van met elkaar; bijdragen worden niet gezien.',
 'Benoem wat een collega goed deed, hardop en concreet. Dat klinkt klein, maar het is de kortste route naar een ander teamklimaat.',
 'De samenwerking werkt, maar persoonsgerichte zorg wordt niet actief aangemoedigd.',
 'Maak het gesprek over persoonsgerichtheid een vast onderdeel van het teamoverleg, aan de hand van een casus in plaats van een principe.',
 'Het team waardeert en stimuleert ieders bijdrage aan persoonsgerichte zorg.',
 'Gebruik deze basis om ook de moeilijke gesprekken te voeren: verschillen tussen beroepsgroepen, hierarchie, schuring.'),
v9: pcpi(
 'Zeggenschap ligt eenzijdig bij de leiding; er is weinig ruimte om zelf ontwikkelingen te trekken.',
 'Zoek een verbetering die je zelf kunt starten en vraag daar mandaat voor. Een geslaagd klein initiatief opent meer dan een discussie over zeggenschap.',
 'Er is ruimte om mee te denken, maar het initiatief ligt zelden bij het team.',
 'Vraag om een concreet mandaat met een termijn en een eigenaar, niet om ruimte in het algemeen.',
 'Macht en verantwoordelijkheid worden gedeeld, en initiatief wordt ondersteund.',
 'Let op bij wisseling van leidinggevende; dit is precies wat dan als eerste verdwijnt.'),
v10: pcpi(
 'Afwijken van de standaard wordt niet ondersteund; risico’s worden vermeden in plaats van afgewogen.',
 'Beproef een kleine verandering, leg vooraf vast wat je verwacht en bespreek de uitkomst. Zo wordt afwijken een methode in plaats van een overtreding.',
 'Er is enige ruimte om dingen anders te doen, maar het blijft afhankelijk van wie het vraagt.',
 'Maak afspraken over hoe je verantwoorde risico’s samen met de client afweegt en vastlegt. Dan is de ruimte niet meer persoonsgebonden.',
 'Er is ruimte om te vernieuwen en verantwoord risico te nemen.',
 'Zorg dat wat je leert uit die experimenten ook bij andere teams terechtkomt.'),
v11: pcpi(
 'De invloed van de fysieke omgeving op waardigheid en welbevinden blijft buiten beeld.',
 'Loop je afdeling eens door met de ogen van een client: geluid, licht, privacy, wat er aan de muur hangt. Dit levert vrijwel altijd snel te verhelpen punten op.',
 'Er is aandacht voor de omgeving, maar vooral als er iets stukgaat.',
 'Maak de omgeving een terugkerend onderwerp in het teamoverleg en betrek clienten bij wat er beter kan.',
 'De fysieke omgeving wordt actief gebruikt om zorg persoonsgerichter te maken.',
 'Betrek clienten bij verbouwing en herinrichting; daar wordt hun stem het vaakst overgeslagen.'),
v12: pcpi(
 'De organisatie ondersteunt niet: successen worden niet gezien, zorgen niet gehoord, ontwikkeling niet besproken.',
 'Dit is zelden alleen op te lossen. Agendeer het als team en maak concreet wat er ontbreekt: een gesprek, erkenning, een route voor zorgen.',
 'Er is enige ondersteuning, maar zij is onregelmatig en persoonsafhankelijk.',
 'Vraag om een vast moment voor je eigen ontwikkeling en om een duidelijke route wanneer je zorgen hebt over de zorg.',
 'De organisatie ziet en ondersteunt wat medewerkers bijdragen.',
 'Vier successen ook echt; het klinkt licht, maar het is een van de sterkste voorspellers van of een verandering beklijft.'),
v13: pcpi(
 'Wat iemand belangrijk vindt wordt niet opgehaald en niet gebruikt in de zorg.',
 'Vraag bij een volgende client wat er voor hem of haar toe doet, leg het vast in diens eigen woorden en gebruik het diezelfde dag nog.',
 'Kennis over de persoon wordt opgehaald, maar niet consequent gebruikt.',
 'Koppel wat je weet aan een concrete afspraak in het plan; kennis die nergens landt, verdwijnt bij de eerste dienstwissel.',
 'Kennis over de persoon en diens context stuurt de zorg.',
 'Vraag ook feedback over hoe mensen hun zorgervaring begrijpen; dat is de blinde vlek bij een hoge score.'),
v14: pcpi(
 'Beslissingen worden voor mensen genomen in plaats van met hen.',
 'Formuleer met een client samen een doel, in diens eigen woorden. Een doel is een concreter beginpunt dan het principe van samen beslissen.',
 'Mensen worden betrokken, maar vooral bij besluiten die al genomen zijn.',
 'Bespreek alternatieven voordat de keuze is gemaakt, inclusief wat niet haalbaar is. Betrek de familie waar dat past bij de wens van de persoon.',
 'Beslissingen komen werkelijk samen tot stand.',
 'Richt de aandacht op de lastige gevallen: afwijkende keuzes, botsende opvattingen, risico’s die samen gedragen moeten worden.'),
v15: pcpi(
 'Het perspectief van de ander wordt niet opgezocht; bij verschil van inzicht wint de professionele route.',
 'Vraag bij het eerstvolgende meningsverschil expliciet hoe de ander ernaar kijkt, voordat je je eigen voorstel herhaalt.',
 'Er is betrokkenheid, maar bij botsende doelen valt het gesprek stil.',
 'Oefen met het zoeken naar een derde weg wanneer jouw doel en dat van de persoon verschillen. Dat is een vaardigheid, geen kwestie van instelling.',
 'Er wordt werkelijk aangesloten bij het perspectief van de ander, ook bij verschil.',
 'Bewaak dit bij tijdsdruk; betrokkenheid is het eerste wat verdwijnt als het druk wordt.'),
v16: pcpi(
 'De aandacht is verdeeld; er wordt geluisterd terwijl er al iets anders gebeurt.',
 'Geef bij een handeling per dag je volledige aandacht, zonder iets anders erbij. Het effect daarvan is groter dan de tijd die het kost.',
 'Er wordt geluisterd, maar onvervulde behoeften worden niet altijd opgepikt.',
 'Luister ook naar wat er niet gezegd wordt en vraag door op wat je opvalt. Verzamel extra informatie voordat je conclusies trekt.',
 'Er is werkelijke, onverdeelde aanwezigheid bij mensen.',
 'Bescherm dit tegen de organisatie van het werk; aanwezigheid vraagt tijd die zichtbaar moet zijn in het rooster.'),
v17: pcpi(
 'De zorg richt zich op de zorgvraag, niet op de persoon als geheel.',
 'Neem bij een volgende beoordeling ook het sociale, psychische en zingevingsaspect mee. Vraag wat er buiten de zorg speelt.',
 'Er is aandacht voor de hele persoon, maar niet systematisch.',
 'Maak van de brede beoordeling een vast onderdeel in plaats van iets wat je erbij doet als er tijd is.',
 'De zorg gaat uit van de persoon in al zijn aspecten.',
 'Let erop dat dit bij toenemende zorgzwaarte niet verschuift naar overnemen; eigen regie blijft ook dan het uitgangspunt.')
};

/* ---------- adviesgenerator ---------- */
/**
 * @param {string} qKey    'patienten' | 'professionals' | 'pcpis'
 * @param {Object} means   {dimId: {mean, n}}
 * @param {string} L       'nl' | 'en'
 * @param {string} voice   'pat' (patient) of 'org' (organisatie/medewerker)
 * @returns {{overall, band, summary, sections:[{dim, mean, band, beeld, actie}], strengths:[], nTotal}}
 */
function buildAdvice(qKey, means, L, voice) {
  const q = QUESTIONNAIRES[qKey];
  const table = qKey === 'pcpis' ? ADVICE_PCPIS : ADVICE_PCC;
  const rows = q.dims
    .map(d => ({ dim: d, mean: means[d.id].mean, n: means[d.id].n }))
    .filter(r => r.mean !== null);
  if (!rows.length) return null;

  const nTotal = rows.reduce((a, b) => a + b.n, 0);
  const overall = rows.reduce((a, b) => a + b.mean * b.n, 0) / nTotal;
  const sorted = rows.slice().sort((a, b) => a.mean - b.mean);

  // aandachtspunten: alles onder 3,5, hooguit vier, altijd minstens de laagste
  let attention = sorted.filter(r => r.mean < 3.5).slice(0, 4);
  if (!attention.length) attention = sorted.slice(0, 1);
  const strengths = sorted.slice().reverse().filter(r => r.mean >= 3.5).slice(0, 3);

  const pick = (r) => {
    const b = bandOf(r.mean);
    const entry = (table[r.dim.id] || {})[b.id] || {};
    const actie = voice === 'pat' ? (entry.pat || entry.org) : entry.org;
    return { dim: r.dim, mean: r.mean, n: r.n, band: b, beeld: entry.beeld || '', actie: actie || '' };
  };

  const band = bandOf(overall);
  const low = sorted[0], high = sorted[sorted.length - 1];
  const spread = high.mean - low.mean;

  const T = {
    nl: {
      o: {
        laag: 'Over de hele linie is er nog veel ruimte voor verbetering.',
        midden: 'Het beeld is gemengd: de basis staat, maar het is nog niet overal vanzelfsprekend.',
        hoog: 'Het beeld is overwegend positief.'
      },
      sterkst: 'Het sterkst scoort',
      zwakst: 'de meeste ruimte zit bij',
      breed: 'De verschillen tussen de onderdelen zijn groot; dat wijst er meestal op dat het aan een specifiek onderdeel ligt en niet aan het geheel.',
      smal: 'De scores liggen dicht bij elkaar; het beeld is vrij gelijkmatig.',
      klein: 'Let op: dit advies berust op een klein aantal antwoorden en is niet meer dan een eerste indruk.'
    },
    en: {
      o: {
        laag: 'Across the board there is considerable room for improvement.',
        midden: 'The picture is mixed: the basics are in place, but it is not yet consistent.',
        hoog: 'The picture is largely positive.'
      },
      sterkst: 'The strongest area is',
      zwakst: 'the most room lies in',
      breed: 'The differences between areas are large, which usually points to a specific area rather than the whole.',
      smal: 'The scores lie close together; the picture is fairly even.',
      klein: 'Note: this advice rests on a small number of answers and is no more than a first impression.'
    }
  }[L];

  const nm = d => (L === 'nl' ? d.nl : d.en);
  const summary = [
    T.o[band.id],
    `${T.sterkst} ${nm(high.dim)} (${high.mean.toFixed(1)}); ${T.zwakst} ${nm(low.dim)} (${low.mean.toFixed(1)}).`,
    spread >= 1.2 ? T.breed : T.smal,
    nTotal < 15 ? T.klein : ''
  ].filter(Boolean).join(' ');

  return {
    overall, band, summary, nTotal,
    sections: attention.map(pick),
    strengths: strengths.map(pick)
  };
}
