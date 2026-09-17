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
    professionals: 'Professionals'
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
    professionals: 'Professionals'
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
