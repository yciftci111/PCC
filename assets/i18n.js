/* PCCD Audit — interfaceteksten NL / EN */

const I18N = {
  nl: {
    siteTitle: 'PCCD Audit',
    siteTagline: 'Person-Centred Care Delivery — veldsessie-instrument',
    home: 'Home',
    compare: 'Vergelijken',
    langLabel: 'English',
    themeLight: 'Lichte weergave',
    themeDark: 'Donkere weergave',

    heroTitle: 'Persoonsgerichte zorg in beeld',
    heroLead: 'Drie vragenlijsten voor de veldsessie. Vul in tijdens het gesprek, zie het profiel direct in een spinnenwebdiagram, en neem het beeld mee naar de presentatie aan het eind van de dag.',
    heroNote: 'Alle antwoorden blijven in deze browser. Er wordt niets verstuurd of opgeslagen op een server.',

    openList: 'Open vragenlijst',
    respondents: 'respondenten',
    respondent: 'respondent',
    noData: 'Nog geen gegevens',
    avgScore: 'Gemiddelde',
    dimensions: 'dimensies',
    items: 'items',

    compareTitle: 'Vergelijken',
    compareLead: 'Patiënten en professionals beantwoorden dezelfde acht dimensies. Leg de profielen over elkaar en het verschil wordt de bevinding.',
    overlay: 'Over elkaar',
    separate: 'Afzonderlijk',
    difference: 'Verschil',
    diffExplain: 'Positief betekent dat professionals hoger scoren dan patiënten.',
    noCompareData: 'Vul minimaal één respondent in bij Patiënten en bij Professionals om de vergelijking te zien.',
    largestGap: 'Grootste verschil',
    pcpisSeparate: 'De PCPI-S heeft eigen constructen en staat daarom apart.',

    // vragenlijstpagina
    backHome: 'Terug naar overzicht',
    orgLabel: 'Naam organisatie',
    orgPlaceholder: 'bijv. Verpleeghuis De Linden',
    respondentLabel: 'Respondent',
    addRespondent: 'Nieuwe respondent',
    deleteRespondent: 'Verwijderen',
    renameRespondent: 'Naam wijzigen',
    confirmDelete: 'Deze respondent en alle antwoorden verwijderen?',
    newRespondentName: 'Naam of aanduiding van de respondent',
    progress: 'beantwoord',
    of: 'van',
    clearAnswer: 'Wissen',
    resultTitle: 'Profiel',
    resultLead: 'Gemiddelde per dimensie over alle respondenten.',
    currentOnly: 'Alleen deze respondent',
    allRespondents: 'Alle respondenten',
    tableView: 'Tabel',
    chartView: 'Diagram',
    exportPng: 'Diagram als PNG',
    exportCsv: 'Gegevens als CSV',
    exportPdf: 'Afdrukken / PDF',
    resetAll: 'Alles wissen',
    confirmReset: 'Alle respondenten en antwoorden van deze vragenlijst verwijderen?',
    dimension: 'Dimensie',
    score: 'Score',
    answered: 'Beantwoord',
    na: 'n.v.t.',
    notAnswered: 'niet beantwoord',
    scaleNote: 'Schaal 1 tot 5. Een item op “niet van toepassing” telt niet mee in het gemiddelde.',
    noAnswersYet: 'Beantwoord een paar vragen om het profiel te zien.',
    jumpTo: 'Ga naar',
    savedNote: 'Automatisch bewaard in deze browser',
    patients: 'Patiënten',
    professionals: 'Professionals',

    // advies
    adviceTitle: 'Advies',
    adviceIntro: 'Automatisch opgesteld op basis van de scores per dimensie.',
    attentionPoints: 'Waar de meeste ruimte zit',
    strengthPoints: 'Wat goed gaat',
    whatItMeans: 'Wat dit laat zien',
    whatToDo: 'Wat hiermee te doen',
    basedOn: 'op basis van',
    answers: 'antwoorden',

    // deelnemersmodus
    pTagline: 'Vragenlijst persoonsgerichte zorg',
    pStart: 'Welkom',
    pIntro: 'Deze korte vragenlijst gaat over persoonsgerichte zorg. Uw antwoorden blijven op dit apparaat staan; er wordt niets verstuurd zonder dat u daar zelf op klikt.',
    pChoose: 'Welke rol heeft u?',
    pChooseNote: 'Kies de lijst die bij u past. U kunt er maar \u00e9\u00e9n invullen.',
    pRolePat: 'Ik ontvang zorg',
    pRolePatSub: 'Pati\u00ebnt, cli\u00ebnt of bewoner. Vragen over de zorg zoals u die zelf ervaart.',
    pRoleProf: 'Ik verleen zorg',
    pRoleProfSub: 'Zorgverlener of behandelaar. Vragen over de zorg die uw organisatie levert.',
    pRoleStaff: 'Ik werk hier, over mijn eigen praktijk',
    pRoleStaffSub: 'Uitgebreidere lijst over uw eigen manier van werken en de omgeving waarin u werkt.',
    pMinutes: 'minuten',
    pQuestions: 'vragen',
    pBack: 'Andere lijst kiezen',
    pBackConfirm: 'Terug naar de keuze? Uw antwoorden in deze lijst blijven bewaard.',
    pFinish: 'Afronden en resultaat bekijken',
    pFinishIncomplete: 'U heeft nog niet alles beantwoord. Toch afronden?',
    pThanks: 'Hartelijk dank',
    pThanksLead: 'Hieronder ziet u uw eigen profiel en wat daaruit naar voren komt.',
    pYourName: 'Uw naam of een aanduiding (optioneel)',
    pNamePlaceholder: 'bijvoorbeeld: bewoner afdeling 2',
    pSend: 'Antwoorden doorsturen',
    pCopyCode: 'Code kopi\u00ebren',
    pCopied: 'Gekopieerd',
    pCodeTitle: 'Uw antwoorden doorsturen',
    pCodeLead: 'De onderzoeker heeft deze code nodig om uw antwoorden mee te tellen. Klik op doorsturen, of kopieer de code en stuur hem zelf.',
    pRestart: 'Opnieuw beginnen',
    pRestartConfirm: 'Alles wissen en opnieuw beginnen?',
    pPrint: 'Resultaat afdrukken',

    // importeren
    importTitle: 'Antwoorden importeren',
    importLead: 'Plak hier de code die een respondent u heeft gestuurd. U kunt meerdere codes onder elkaar plakken.',
    importBtn: 'Toevoegen',
    importPlaceholder: 'Plak hier een of meer codes',
    importDone: 'toegevoegd',
    importFail: 'niet herkend',

    // toegang
    lockTitle: 'Onderzoekersweergave',
    lockLead: 'Deze weergave is bedoeld voor de onderzoeker. Voer de toegangscode in.',
    lockBtn: 'Openen',
    lockWrong: 'Die code klopt niet.',
    lockNote: 'Dit is een drempel, geen beveiliging: op een openbare website is de broncode altijd leesbaar. Er staan hier geen antwoorden van respondenten op de server \u2014 alles blijft in de browser.',
    lockCode: 'Toegangscode',
  },

  en: {
    siteTitle: 'PCCD Audit',
    siteTagline: 'Person-Centred Care Delivery — field session instrument',
    home: 'Home',
    compare: 'Compare',
    langLabel: 'Nederlands',
    themeLight: 'Light mode',
    themeDark: 'Dark mode',

    heroTitle: 'Person-centred care, made visible',
    heroLead: 'Three questionnaires for the field session. Fill them in during the interview, see the profile appear in a radar chart, and take the picture into your presentation at the end of the day.',
    heroNote: 'All answers stay in this browser. Nothing is sent to or stored on a server.',

    openList: 'Open questionnaire',
    respondents: 'respondents',
    respondent: 'respondent',
    noData: 'No data yet',
    avgScore: 'Average',
    dimensions: 'dimensions',
    items: 'items',

    compareTitle: 'Compare',
    compareLead: 'Patients and professionals answer the same eight dimensions. Overlay the profiles and the gap becomes the finding.',
    overlay: 'Overlaid',
    separate: 'Separate',
    difference: 'Difference',
    diffExplain: 'Positive means professionals score higher than patients.',
    noCompareData: 'Enter at least one respondent under Patients and under Professionals to see the comparison.',
    largestGap: 'Largest gap',
    pcpisSeparate: 'The PCPI-S has its own constructs and is therefore shown separately.',

    backHome: 'Back to overview',
    orgLabel: 'Organisation name',
    orgPlaceholder: 'e.g. De Linden nursing home',
    respondentLabel: 'Respondent',
    addRespondent: 'New respondent',
    deleteRespondent: 'Delete',
    renameRespondent: 'Rename',
    confirmDelete: 'Delete this respondent and all their answers?',
    newRespondentName: 'Name or label for the respondent',
    progress: 'answered',
    of: 'of',
    clearAnswer: 'Clear',
    resultTitle: 'Profile',
    resultLead: 'Mean per dimension across all respondents.',
    currentOnly: 'This respondent only',
    allRespondents: 'All respondents',
    tableView: 'Table',
    chartView: 'Chart',
    exportPng: 'Chart as PNG',
    exportCsv: 'Data as CSV',
    exportPdf: 'Print / PDF',
    resetAll: 'Clear all',
    confirmReset: 'Delete all respondents and answers for this questionnaire?',
    dimension: 'Dimension',
    score: 'Score',
    answered: 'Answered',
    na: 'n/a',
    notAnswered: 'not answered',
    scaleNote: 'Scale 1 to 5. An item marked “not applicable” is excluded from the mean.',
    noAnswersYet: 'Answer a few questions to see the profile.',
    jumpTo: 'Jump to',
    savedNote: 'Saved automatically in this browser',
    patients: 'Patients',
    professionals: 'Professionals',

    adviceTitle: 'Advice',
    adviceIntro: 'Generated automatically from the scores per dimension.',
    attentionPoints: 'Where the most room lies',
    strengthPoints: 'What is going well',
    whatItMeans: 'What this shows',
    whatToDo: 'What to do with it',
    basedOn: 'based on',
    answers: 'answers',

    pTagline: 'Person-centred care questionnaire',
    pStart: 'Welcome',
    pIntro: 'This short questionnaire is about person-centred care. Your answers stay on this device; nothing is sent unless you choose to send it.',
    pChoose: 'What is your role?',
    pChooseNote: 'Choose the list that fits you. You can fill in only one.',
    pRolePat: 'I receive care',
    pRolePatSub: 'Patient, client or resident. Questions about the care as you experience it.',
    pRoleProf: 'I provide care',
    pRoleProfSub: 'Care provider or clinician. Questions about the care your organisation delivers.',
    pRoleStaff: 'I work here, about my own practice',
    pRoleStaffSub: 'A longer list about your own way of working and the environment you work in.',
    pMinutes: 'minutes',
    pQuestions: 'questions',
    pBack: 'Choose another list',
    pBackConfirm: 'Back to the choice? Your answers in this list are kept.',
    pFinish: 'Finish and see the result',
    pFinishIncomplete: 'You have not answered everything yet. Finish anyway?',
    pThanks: 'Thank you',
    pThanksLead: 'Below is your own profile and what stands out in it.',
    pYourName: 'Your name or a label (optional)',
    pNamePlaceholder: 'for example: resident, ward 2',
    pSend: 'Send answers',
    pCopyCode: 'Copy code',
    pCopied: 'Copied',
    pCodeTitle: 'Sending your answers',
    pCodeLead: 'The researcher needs this code to include your answers. Click send, or copy the code and send it yourself.',
    pRestart: 'Start again',
    pRestartConfirm: 'Clear everything and start again?',
    pPrint: 'Print result',

    importTitle: 'Import answers',
    importLead: 'Paste the code a respondent sent you. You can paste several codes below each other.',
    importBtn: 'Add',
    importPlaceholder: 'Paste one or more codes here',
    importDone: 'added',
    importFail: 'not recognised',

    lockTitle: 'Researcher view',
    lockLead: 'This view is meant for the researcher. Enter the access code.',
    lockBtn: 'Open',
    lockWrong: 'That code is not correct.',
    lockNote: 'This is a threshold, not security: on a public website the source is always readable. No respondent answers are stored on the server \u2014 everything stays in the browser.',
    lockCode: 'Access code',
  }
};

const Lang = {
  get() {
    try { return localStorage.getItem('pccd.lang') || 'nl'; } catch (e) { return 'nl'; }
  },
  set(v) {
    try { localStorage.setItem('pccd.lang', v); } catch (e) {}
  },
  t(key) { return I18N[Lang.get()][key] ?? key; }
};

const Theme = {
  get() {
    try { return localStorage.getItem('pccd.theme') || 'auto'; } catch (e) { return 'auto'; }
  },
  set(v) {
    try { localStorage.setItem('pccd.theme', v); } catch (e) {}
    Theme.apply();
  },
  apply() {
    const v = Theme.get();
    if (v === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', v);
  },
  toggle() {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark' ||
      (Theme.get() === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    Theme.set(dark ? 'light' : 'dark');
  }
};
Theme.apply();
