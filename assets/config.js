/* PCCD Audit — instellingen die je per veldsessie aanpast.
   Dit is het enige bestand dat je hoeft te wijzigen om de tool voor een
   andere organisatie of een andere onderzoeker te gebruiken. */

const CONFIG = {
  // Naam van de organisatie die bezocht wordt. Verschijnt in de vragen van de
  // professionalslijst en boven de resultaten. Laat leeg om hem zelf in te vullen.
  organisatie: '',

  // E-mailadres waar respondenten hun antwoordcode naartoe sturen.
  // Laat leeg om de verstuurknop te verbergen; de code kan dan alleen gekopieerd worden.
  onderzoekerEmail: '',

  // Toegangscode voor de onderzoekersweergave (de pagina's met alle respondenten,
  // de vergelijking en de export). LET OP: dit is een drempel, geen beveiliging.
  // Op een openbare website kan iedereen de broncode lezen. De werkelijke
  // bescherming is dat er geen enkel antwoord op de server staat: alles blijft
  // in de browser van degene die het invulde.
  onderzoekerscode: 'pccd',

  // Zet op false als je de toegangscode niet wilt gebruiken.
  codeVereist: true
};
