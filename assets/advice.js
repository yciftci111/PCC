/* PCCD Audit — adviesteksten en adviesgenerator / advice texts and generator.
   Drie scorebanden op de schaal 1-5 / three score bands on the 1-5 scale:
     laag   < 2,5    aandachtspunt / needs attention
     midden 2,5-3,49 in ontwikkeling / developing
     hoog   >= 3,5   sterk punt / strength
   Per dimensie: 'beeld' (wat de score zegt), 'org' (wat de organisatie of de
   medewerker kan doen) en 'pat' (wat de patient ermee kan). */

const BANDS = [
  { id: 'laag',   max: 2.5, nl: 'Aandachtspunt',    en: 'Needs attention' },
  { id: 'midden', max: 3.5, nl: 'In ontwikkeling',  en: 'Developing' },
  { id: 'hoog',   max: 99,  nl: 'Sterk punt',       en: 'Strength' }
];
function bandOf(v) {
  if (v === null || v === undefined || isNaN(v)) return null;
  return BANDS.find(b => v < b.max) || BANDS[BANDS.length - 1];
}

/* ================= NEDERLANDS ================= */
const PCC_NL = {
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

/* ================= ENGLISH ================= */
const PCC_EN = {
d1: {
  laag: {
    beeld: 'Wishes and preferences barely shape what happens; treatment mainly follows the professional route.',
    org: 'Record for each person what matters to them and tie it to concrete agreements in the care plan. Start with a handful of people and discuss in the team what it produced — that convinces more than an instruction.',
    pat: 'Before your next appointment, write down what matters to you and what you want to keep being able to do, and open the conversation with that. You may ask for this to be recorded in your file.'
  },
  midden: {
    beeld: 'Preferences are asked about, but they do not always carry through into what actually happens.',
    org: 'Check in a file review whether recorded preferences are visible in the care delivered. Recording without follow-through gives false assurance.',
    pat: 'At your next appointment, ask how your preferences were taken into account in the plan. If something was not acted on, say so.'
  },
  hoog: {
    beeld: 'Preferences and what matters to someone demonstrably shape the care.',
    org: 'Pay deliberate attention to people who find it hard to speak up — that is where the remaining risk now sits. Refresh the picture whenever the situation changes.',
    pat: 'This is going well. Keep saying when your situation or your wishes change, so the plan keeps up.'
  }
},
d2: {
  laag: {
    beeld: 'Physical comfort and the environment get little attention: pain, fatigue, rest or privacy are left unaddressed.',
    org: 'This is usually the fastest win. Improvements to comfort, cleaning, noise and privacy are tangible and immediately noticeable. Measure pain systematically and evaluate whether the treatment works — that last step is the one most often skipped.',
    pat: 'Report pain, fatigue or discomfort actively, even when nobody asks. Also say when the room or the lack of privacy makes you uncomfortable.'
  },
  midden: {
    beeld: 'The basics are in place, but comfort, rest and privacy are not consistently arranged.',
    org: 'Shadow a shift and see where it goes wrong: night-time noise, waiting in an uncomfortable room, a conversation others can overhear. Fix the concrete cases rather than writing policy.',
    pat: 'Name the moments when it was uncomfortable. Concrete examples help an organisation more than a general verdict.'
  },
  hoog: {
    beeld: 'Comfort, rest and privacy are well arranged and are experienced that way.',
    org: 'Stay alert to slippage under pressure and understaffing — this is the first thing to go. Measure noise and night-time disturbances rather than estimating them.',
    pat: 'This is going well. Keep reporting when something changes, so it stays that way.'
  }
},
d3: {
  laag: {
    beeld: 'Care falls apart into separate contacts: information is not shared and it is unclear who holds the overview.',
    org: 'Arrange a fixed point of contact per person as a first step, and make sure the care plan travels with every handover. This is often organisationally small and large for the patient.',
    pat: 'Ask who your fixed point of contact is and write down the name. If you have to tell your story again, say that you already told it and to whom.'
  },
  midden: {
    beeld: 'Coordination usually works, but falters under pressure, at weekends or across changing shifts.',
    org: 'Find where the information actually disappears — usually at shift change, discharge or transfer. Make sure the person-centred way of working also applies to bank and agency staff.',
    pat: 'Ask each new care provider whether they have been briefed. It feels awkward, but it prevents mistakes.'
  },
  hoog: {
    beeld: 'The care feels like a coherent whole with a clear point of contact.',
    org: 'Test the experienced coherence with the patient; organisational continuity and experienced continuity are not the same thing. Work on the handover to partner organisations, usually the weakest link.',
    pat: 'This is going well. Let them know when your point of contact changes or turns out to be unreachable.'
  }
},
d4: {
  laag: {
    beeld: 'Information is lost at referral and handover; advice from different clinicians does not line up.',
    org: 'This is the most concretely auditable problem in the whole list and also the most dangerous, particularly around medication. Check a series of recent handovers for completeness and turn the result into an improvement point with an owner and a deadline.',
    pat: 'Bring an up-to-date medication list to every new clinician. If you get conflicting advice, put it side by side and ask which takes precedence.'
  },
  midden: {
    beeld: 'Handovers usually go well, but not reliably enough to count on.',
    org: 'Agree what must travel with a handover as a minimum and sample-check that it happens. Involve the GP explicitly; that is where coordination most often breaks down.',
    pat: 'At a referral, ask exactly what is being passed on and to whom. Also ask when you will hear back.'
  },
  hoog: {
    beeld: 'Transitions run smoothly and information travels intact.',
    org: 'Secure this with partner organisations and through system changes; an IT migration often unintentionally undoes what was built.',
    pat: 'This is going well. Keep your own overview of who is involved in what, as a backstop.'
  }
},
d5: {
  laag: {
    beeld: 'Attention goes to the physical; anxiety, low mood and the consequences for daily life go undiscussed.',
    org: 'Assign emotional support to the moments that matter: diagnosis, deterioration, end of life. Make sure staff know where they can refer to — a missing route is more often the cause than unwillingness.',
    pat: 'Say when something is weighing on you, even if nobody asks. Ask what support is available; it usually exists, but is rarely offered unprompted.'
  },
  midden: {
    beeld: 'There is attention for how someone is doing, but it depends on who is in front of you.',
    org: 'Make attention an agreement rather than a trait: a fixed moment, a fixed question. Practise the difficult conversations instead of hoping for them.',
    pat: 'If you notice a difference between care providers, say so. That is usable information for the organisation.'
  },
  hoog: {
    beeld: 'There is genuine attention for how someone is doing, beyond the medical.',
    org: 'Support staff with their own emotional load; this level is not sustainable without it. Hold the attention at the moments when it is under pressure.',
    pat: 'This is going well. Keep naming the less visible things too, such as the effects at home or at work.'
  }
},
d6: {
  laag: {
    beeld: 'Care is hard to reach: waiting times, making appointments, or costs get in the way.',
    org: 'Measure reachability and response times rather than assuming them, and discuss the result with patients. Look separately at financial barriers; they often stay invisible because people do not raise them.',
    pat: 'Say when you have postponed care and why. If cost is the obstacle, ask what is possible — there usually is something, but it is rarely mentioned unprompted.'
  },
  midden: {
    beeld: 'Access works, but not always at the moment it is needed.',
    org: 'Look at out-of-hours moments and at deterioration; that is usually where the gap sits. Agree response times and make them known to patients.',
    pat: 'Ask what to do if things go wrong outside office hours, and write it down. Uncertainty about that weighs heavily.'
  },
  hoog: {
    beeld: 'People can get help when they need it.',
    org: 'Discuss the measured access with patients periodically and keep the financial barrier in view.',
    pat: 'This is going well. Let them know if this changes.'
  }
},
d7: {
  laag: {
    beeld: 'Information does not land: too little, too late, or not in understandable language.',
    org: 'Introduce a teach-back method: check whether the explanation was understood, not whether it was given. Provide material suited to low literacy and a language barrier — this must not be a ground for exception.',
    pat: 'Keep asking until you understand, and ask whether you may repeat it in your own words. Bring someone to an important conversation; two people remember more than one.'
  },
  midden: {
    beeld: 'Information is given, but whether it lands is not checked.',
    org: 'Shift from informing to checking understanding. Also look at access to the patient record; there is often easy ground to gain there.',
    pat: 'Ask for written information or for access to your own records, so you can read it back calmly.'
  },
  hoog: {
    beeld: 'People are well informed and understand what is happening.',
    org: 'Involve patients in improving the information material and safeguard the quality with new staff.',
    pat: 'This is going well. Keep asking questions whenever something changes.'
  }
},
d8: {
  laag: {
    beeld: 'Family and friends stay out of view: they are not involved and their own load goes unseen.',
    org: 'With the patient’s consent, ask as standard who matters to them and involve that person. Actively identify carer strain; someone who becomes overloaded eventually drops away as a source of support too.',
    pat: 'Say who you want involved in your care. If someone cares for you, also say how they are doing.'
  },
  midden: {
    beeld: 'Family are involved, but mainly practically and not as partners in the care.',
    org: 'Make family an explicit party in the conversation, with their own questions and their own offer of support when strain builds.',
    pat: 'Ask whether your relative can join a next conversation and whether their questions can be covered too.'
  },
  hoog: {
    beeld: 'Family are involved and their role is recognised.',
    org: 'Keep carer strain in view, also when things appear to be going well.',
    pat: 'This is going well. Keep saying when the situation at home changes.'
  }
}
};

/* ---------- PCPI-S: 17 constructen / constructs ---------- */
function pcpi(bL, aL, bM, aM, bH, aH) {
  return { laag: { beeld: bL, org: aL }, midden: { beeld: bM, org: aM }, hoog: { beeld: bH, org: aH } };
}
const PCPIS_NL = {
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

const PCPIS_EN = {
v1: pcpi(
 'Professional competence falls short or is not maintained.',
 'Map what knowledge this client group demands and where the gap sits. Ask for specific training rather than waiting for something to be offered.',
 'Competence is adequate, but keeping it up to date is left to chance.',
 'Make continuing education a fixed part of the year rather than something added on. Actively look for what you do not yet know.',
 'Competence is sound and actively maintained.',
 'Share what you know with colleagues and new staff; that is how this level stays in the team.'),
v2: pcpi(
 'Communication stops at passing on information; the other person’s perspective does not come into it.',
 'Practise conversation skills concretely: listening, probing, reflecting back the other’s perspective. Ask a colleague to observe.',
 'Communication is respectful, but the conversation often stays one-way.',
 'Watch your own share of the conversation: how much are you talking? Practise situations where the other person leads the story.',
 'There is genuine two-way communication, non-verbally as well.',
 'Use this skill in the hard conversations: opposing views, bad news, conflict.'),
v3: pcpi(
 'Engagement with the person behind the client is limited; the work stops at the task.',
 'Make room to get to know people, however little. A quarter of an hour without a task often yields more than an hour attached to one.',
 'The commitment is there, but time and workload squeeze it out.',
 'Protect the time for attention precisely when it is busy; otherwise it is always the first thing to go. Raise this in the team, not only with yourself.',
 'Commitment to the person is visible in the daily work.',
 'Watch your own load; this level of effort is only sustainable with support from the team.'),
v4: pcpi(
 'There is little reflection on one’s own actions and their effect.',
 'After a difficult situation, take five minutes to write down what happened and what it did to you. Bring one of them to peer supervision.',
 'There is reflection, but irregularly and usually only after incidents.',
 'Make reflection a recurring moment rather than a reaction. Look at what went well and why, too.',
 'Reflection on one’s own practice is a fixed part of the work.',
 'Bring your own life experience and values into the reflection as well; that is where the deeper layer sits.'),
v5: pcpi(
 'Values and beliefs are not made explicit and colleagues are not challenged.',
 'Start by asking for feedback on your own practice; that is less loaded than challenging someone else. Work on shared values in the team, otherwise challenging is arbitrary.',
 'The values are known, but challenging each other rarely happens.',
 'Agree in the team how you challenge each other and practise it. Without that agreement it stays a good intention.',
 'Values are explicit and colleagues do challenge each other.',
 'Guard the safety that makes this possible; challenging only works in a team where mistakes can be discussed.'),
v6: pcpi(
 'Gaps in the team’s knowledge and skills are not recognised or not named.',
 'Map what expertise this client group demands and where the team falls short. Put that to the manager with evidence.',
 'Gaps are seen, but not consistently put on the agenda.',
 'Make the team’s composition a recurring agenda item, tied to client experience and not only to staffing figures.',
 'The team sees and names its own strong and weak spots.',
 'Make sure the input of less formally qualified colleagues counts in that picture too.'),
v7: pcpi(
 'Staff have no place in decisions about their own work.',
 'Find one concrete decision you want influence over and ask for a seat at that table. Start small and visible.',
 'There are meeting structures, but their influence on decisions is limited.',
 'After a meeting, ask what happened with the input. Without feedback, participation becomes a ritual.',
 'Staff have real influence on decisions that affect their work.',
 'Watch that colleagues with less formal standing are at the table too.'),
v8: pcpi(
 'The team works alongside each other rather than with each other; contributions go unseen.',
 'Name what a colleague did well, out loud and concretely. It sounds small, but it is the shortest route to a different team climate.',
 'Collaboration works, but person-centred care is not actively encouraged.',
 'Make the conversation about person-centredness a fixed part of the team meeting, using a case rather than a principle.',
 'The team values and encourages everyone’s contribution to person-centred care.',
 'Use this foundation for the hard conversations too: differences between professions, hierarchy, friction.'),
v9: pcpi(
 'Authority sits one-sidedly with management; there is little room to lead developments yourself.',
 'Find an improvement you could start yourself and ask for a mandate for it. One small success opens more than a discussion about authority.',
 'There is room to contribute, but the initiative rarely lies with the team.',
 'Ask for a concrete mandate with a deadline and an owner, not for room in general.',
 'Power and responsibility are shared, and initiative is supported.',
 'Watch out when a manager changes; this is exactly what disappears first.'),
v10: pcpi(
 'Departing from the standard is not supported; risks are avoided rather than weighed.',
 'Try a small change, record beforehand what you expect and discuss the outcome. That turns departing from the standard into a method rather than a breach.',
 'There is some room to do things differently, but it depends on who asks.',
 'Agree how you weigh and record responsible risks together with the client. Then the room is no longer tied to individuals.',
 'There is room to innovate and to take responsible risks.',
 'Make sure what you learn from those experiments reaches other teams too.'),
v11: pcpi(
 'The effect of the physical environment on dignity and wellbeing stays out of view.',
 'Walk your ward once with a client’s eyes: noise, light, privacy, what is on the walls. This almost always produces quickly fixable points.',
 'There is attention for the environment, but mainly when something breaks.',
 'Make the environment a recurring subject in the team meeting and involve clients in what could be better.',
 'The physical environment is actively used to make care more person-centred.',
 'Involve clients in refurbishment and redesign; that is where their voice is most often skipped.'),
v12: pcpi(
 'The organisation does not support: successes go unseen, concerns unheard, development undiscussed.',
 'This is rarely solvable alone. Put it on the agenda as a team and make concrete what is missing: a conversation, recognition, a route for concerns.',
 'There is some support, but it is irregular and depends on the individual.',
 'Ask for a fixed moment for your own development and for a clear route when you have concerns about the care.',
 'The organisation sees and supports what staff contribute.',
 'Actually celebrate successes; it sounds light, but it is one of the strongest predictors of whether a change sticks.'),
v13: pcpi(
 'What matters to someone is not elicited and not used in the care.',
 'With your next client, ask what matters to them, record it in their own words and use it that same day.',
 'Knowledge about the person is elicited, but not consistently used.',
 'Tie what you know to a concrete agreement in the plan; knowledge that lands nowhere disappears at the first shift change.',
 'Knowledge of the person and their context drives the care.',
 'Ask for feedback on how people understand their care experience too; that is the blind spot at a high score.'),
v14: pcpi(
 'Decisions are made for people rather than with them.',
 'Formulate a goal together with a client, in their own words. A goal is a more concrete starting point than the principle of shared decision making.',
 'People are involved, but mainly in decisions that have already been made.',
 'Discuss alternatives before the choice is made, including what is not achievable. Involve family where that fits the person’s wishes.',
 'Decisions genuinely come about together.',
 'Turn your attention to the hard cases: divergent choices, conflicting views, risks that have to be carried together.'),
v15: pcpi(
 'The other person’s perspective is not sought out; when views differ, the professional route wins.',
 'At the next disagreement, ask explicitly how the other person sees it, before you repeat your own proposal.',
 'There is engagement, but when goals conflict the conversation stalls.',
 'Practise looking for a third way when your goal and the person’s goal differ. That is a skill, not a matter of attitude.',
 'There is genuine engagement with the other’s perspective, including where views differ.',
 'Guard this under time pressure; engagement is the first thing to disappear when it gets busy.'),
v16: pcpi(
 'Attention is divided; listening happens while something else is already going on.',
 'Give one task a day your full attention, with nothing else alongside. Its effect is larger than the time it costs.',
 'There is listening, but unmet needs are not always picked up.',
 'Listen for what is not said and probe on what strikes you. Gather more information before drawing conclusions.',
 'There is genuine, undivided presence with people.',
 'Protect this against how the work is organised; presence takes time that has to be visible in the roster.'),
v17: pcpi(
 'The care addresses the care need, not the person as a whole.',
 'At your next assessment, include the social, psychological and meaning-related aspects. Ask what is going on outside the care.',
 'There is attention for the whole person, but not systematically.',
 'Make the broad assessment a fixed part rather than something you add when there is time.',
 'The care starts from the person in all their aspects.',
 'Watch that this does not shift into taking over as care needs increase; self-direction stays the starting point.')
};

const ADVICE = {
  nl: { pcc: PCC_NL, pcpis: PCPIS_NL },
  en: { pcc: PCC_EN, pcpis: PCPIS_EN }
};

/* ---------- adviesgenerator / advice generator ---------- */
/**
 * @param {string} qKey    'patienten' | 'professionals' | 'pcpis'
 * @param {Object} means   {dimId: {mean, n}}
 * @param {string} L       'nl' | 'en'
 * @param {string} voice   'pat' (patient) of 'org' (organisatie / medewerker)
 */
function buildAdvice(qKey, means, L, voice) {
  const q = QUESTIONNAIRES[qKey];
  const lang = ADVICE[L] || ADVICE.nl;
  const table = qKey === 'pcpis' ? lang.pcpis : lang.pcc;
  const rows = q.dims
    .map(d => ({ dim: d, mean: means[d.id].mean, n: means[d.id].n }))
    .filter(r => r.mean !== null);
  if (!rows.length) return null;

  const nTotal = rows.reduce((a, b) => a + b.n, 0);
  const overall = rows.reduce((a, b) => a + b.mean * b.n, 0) / nTotal;
  const sorted = rows.slice().sort((a, b) => a.mean - b.mean);

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
  }[L] || null;

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
