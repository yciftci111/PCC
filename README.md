# PCCD Audit

Een statische website met drie vragenlijsten over persoonsgerichte zorg (Person-Centred Care Delivery), elk met een spinnenwebdiagram. Gemaakt voor gebruik tijdens veldsessies bij zorgorganisaties.

**Live:** `https://<gebruikersnaam>.github.io/<repositorynaam>/`

---

## Wat de site doet

| Blok | Inhoud | Diagram |
|---|---|---|
| **Patiënten** | 38 items, 8 dimensies — persoonsgerichte zorg zoals ervaren door de patiënt of cliënt | spinnenweb over 8 dimensies |
| **Professionals** | 38 items, dezelfde 8 dimensies — vanuit het perspectief van de zorgverlener | spinnenweb over 8 dimensies |
| **PCPI-S** | 59 items, 17 constructen in 3 domeinen — Persoonsgerichte Praktijk Inventaris voor medewerkers | spinnenweb over 17 constructen |
| **Mantelzorgers** | 8 open hoofdvragen met doorvraag, plus 8 stellingen — afgeleid van de professionalslijst, vanuit de naaste | spinnenweb over 8 dimensies |
| **Vergelijken** | patiënten en professionals over elkaar heen, plus een verschiltabel | overlay, of beide afzonderlijk |

Daarnaast is er een **analysedashboard** (`analyse.html`) met vier tabbladen — overzicht, steekproef, schalen en correlaties — en een filterkolom op achtergrondkenmerken.

Elk blok levert naast het diagram een **geschreven advies**: een samenvatting van het profiel, de dimensies met de meeste ruimte (met per dimensie wat de score laat zien en wat ermee te doen valt), en wat goed gaat.

Verder:

- **Meerdere respondenten per lijst.** Voeg per interview een respondent toe; het diagram toont het gemiddelde over alle respondenten, of alleen de geselecteerde.
- **Tweetalig.** Knop rechtsboven wisselt tussen Nederlands en Engels. Navigatie, uitleg, resultaten, voetteksten en de volledige adviesteksten wisselen mee. Alleen de vragen zelf blijven Nederlands, omdat dat de taal is waarin de vragenlijsten zijn gevalideerd en waarin de gesprekken gevoerd worden.
- **Lichte en donkere weergave**, met een knop en automatisch volgens de systeeminstelling.
- **Export.** Diagram als PNG, gegevens als CSV, en afdrukken naar PDF voor de presentatie aan het eind van de dag.
- **Toegankelijkheid.** Elk diagram heeft een tabelweergave; de scores staan nooit alleen in kleur.

## Het analysedashboard

`analyse.html` toont per vragenlijst wat er uit de antwoorden komt. Links staat een filterkolom, rechts vier tabbladen.

**Overzicht** — per schaal een kaart met het gemiddelde, de standaarddeviatie, het aantal respondenten, de positie op de schaal 1–5, en **Cronbachs alfa** als betrouwbaarheidsmaat. Daaronder hetzelfde beeld als spinnenweb, plus het geschreven advies over de huidige selectie.

**Steekproef** — wie heeft de vragenlijst ingevuld: kerncijfers bovenaan, daaronder per achtergrondvraag de aantallen en percentages met staafjes.

**Schalen** — per schaal de afzonderlijke items met gemiddelde, standaarddeviatie, aantal antwoorden en de verdeling over de vijf antwoordcategorieën. Hiermee zie je welke vraag een lage schaalscore veroorzaakt.

**Correlaties** — een matrix met de samenhang tussen de schalen, en een lijst van de vijf sterkste verbanden. Onder ongeveer twintig respondenten waarschuwt de pagina zelf dat de uitkomsten onstabiel zijn.

### Filteren

De filterkolom werkt op de achtergrondvragen. Vink bijvoorbeeld twee leeftijdsgroepen aan en alle vier de tabbladen herberekenen zich over die selectie. Achter elke optie staat hoeveel respondenten eraan voldoen; opties zonder respondenten zijn uitgeschakeld.

Let op: een respondent die een achtergrondvraag heeft overgeslagen valt buiten elk filter op die vraag. Dat is bewust — anders zou je niet weten over wie een uitkomst gaat — maar het verklaart waarom een selectie soms kleiner is dan verwacht.

### Achtergrondvragen

Elke respondent krijgt, boven aan de vragenlijst, een kort blok **Over uzelf**. Alle velden zijn optioneel.

| | Vragen |
|---|---|
| Iedereen | geslacht, leeftijd, hoogst afgeronde opleiding |
| Zorgverleners en medewerkers | afdeling of team (vrij veld), functie, jaren werkervaring |
| Patiënten en cliënten | hoe lang men hier zorg ontvangt, vorm van zorg, of er een naaste betrokken is |

Deze antwoorden reizen mee in de antwoordcode, dus na importeren kun je er meteen op filteren. Vul je een respondent zelf in op de onderzoekerspagina, dan doe je dat via het uitklapbare blok **Achtergrond van deze respondent**. De CSV-export bevat alle achtergrondkolommen.

### Hoe de cijfers berekend worden

- **Schaalscore van een respondent**: het gemiddelde van de items die hij of zij beantwoordde, mits minstens de helft van de items van die schaal is ingevuld. Anders telt die respondent niet mee voor die schaal.
- **Schaalgemiddelde**: het gemiddelde van die respondentscores; de standaarddeviatie gaat over dezelfde verzameling.
- **Cronbachs alfa**: berekend over de respondenten die álle items van die schaal beantwoordden, en alleen bij drie of meer van zulke respondenten. Vanaf 0,70 wordt doorgaans van voldoende interne consistentie gesproken.
- **Correlaties**: Pearson, over respondenten met een score op beide schalen.
- Items op "niet van toepassing" en onbeantwoorde items tellen nergens mee.

Het spinnenweb op de vragenlijstpagina's gebruikt een iets andere berekening — daar worden de antwoorden op itemniveau samengevoegd over alle respondenten. Bij volledig ingevulde lijsten scheelt dat vrijwel niets; bij veel ontbrekende antwoorden kunnen de twee getallen iets uiteenlopen.

## De mantelzorgerslijst en de thematische analyse

De mantelzorgerslijst (`mantelzorgers.html`, en als vierde rol op de deelnemerslink) werkt anders dan de andere drie: per dimensie eerst een **open hoofdvraag en een doorvraag**, en daarna één stelling om te scoren. Zo krijg je het verhaal én een profiel dat naast dat van patiënten en professionals te leggen is.

### Opnemen en transcriberen

Bij elke open vraag zit een opnameknop. De opname blijft in IndexedDB **op het apparaat waarop is opgenomen** en reist nooit mee in een code of bestand; alleen de uitgewerkte tekst gaat mee. Terugluisteren en wissen kan per vraag.

Spraak wordt automatisch omgezet naar tekst in **Chrome en Edge**; Safari en Firefox ondersteunen dat niet, en daar verschijnt een melding. Automatische omzetting vraagt internet, want de browser stuurt de audio naar de spraakdienst van de browserfabrikant — vertel dat aan de mantelzorger voordat je opneemt. De tekst is altijd met de hand te corrigeren, en typen zonder opname kan ook.

Omdat een verhaal niet in een korte code past, levert deze lijst aan het eind een **JSON-bestand**. Dat stuur je naar de onderzoeker, die het importeert met de knop *Bestand importeren* op de startpagina. De korte code bevat alleen de cijfers.

### Thematische analyse met één klik

Op `codering.html` staat één knop. Die voert drie stappen uit:

1. **Open coderen** — de antwoorden worden opgeknipt in fragmenten (zinnen van minstens vier woorden). Per fragment worden de drie sterkste betekenisdragende termen toegekend, gekozen op hoe kenmerkend ze zijn voor dat fragment ten opzichte van de rest. Nederlandse stopwoorden vallen af en woorden worden teruggebracht tot hun stam, zodat *afgestemd* en *afstemming* als één code tellen.
2. **Axiaal coderen** — codes die vaak in dezelfde fragmenten voorkomen worden samengevoegd tot categorieën, net zolang tot er een hanteerbaar aantal over is (vijf tot twaalf, afhankelijk van de hoeveelheid tekst). Wat geen samenhang vertoont, gaat naar een zichtbare restcategorie in plaats van kunstmatig te worden ingedeeld.
3. **Selectief coderen** — de categorie die het breedst over de dimensies ligt en het vaakst voorkomt, wordt aangewezen als kerncategorie, met een beschrijving van het verband met de andere categorieën en een illustratief citaat.

Alle namen van codes en categorieën zijn ter plekke aan te passen; je wijzigingen worden bewaard en gaan mee in het rapport. Het rapport downloadt als Markdown. Er is ook een knop die alle fragmenten kopieert met een kant-en-klare opdracht voor een taalmodel, als je de analyse door een AI wilt laten doen of controleren.

> **Wat dit wel en niet is.** De tool groepeert op **taalgebruik**, niet op betekenis. Twee mantelzorgers die hetzelfde bedoelen met andere woorden komen niet vanzelf bij elkaar, en ironie, ontkenning en context worden niet begrepen. Wat eruit komt is een reproduceerbare eerste ordening die je veel leeswerk bespaart — geen interpretatie. Vermeld in je verslag dat de eerste ordening machinaal tot stand kwam, dat je de fragmenten zelf hebt gelezen en de categorieën hebt bijgesteld, en welke keuzes je daarbij maakte. Zonder die stap is het geen gefundeerde theorie.

## Twee kanten: deelnemers en onderzoeker

De site heeft twee ingangen.

**`deelnemen.html` — dit is de link die je naar respondenten stuurt.**
De respondent kiest zelf welke rol op hem of haar van toepassing is (ik ontvang zorg / ik verleen zorg / over mijn eigen praktijk), vult die ene lijst in en krijgt daarna een bedankscherm met het eigen spinnenweb en een geschreven advies. Deze pagina heeft geen navigatie naar de onderzoekersweergave, toont geen andere respondenten en geen vergelijking.

**`index.html` — de onderzoekersweergave.**
Alle respondenten bij elkaar, de vergelijking, de export en het importeren van antwoorden. Deze kant staat achter een toegangscode. Die staat in `assets/config.js` bij `onderzoekerscode` en is standaard **`pccd`** — verander hem voordat je de site publiceert. Wil je helemaal geen code, zet dan `codeVereist` op `false`.

> Die code is een **drempel, geen beveiliging**. Op een openbare GitHub Pages-site kan iedereen de broncode lezen, dus ook de code. De werkelijke bescherming is dat er nergens antwoorden op een server staan: alles blijft in de browser van degene die het invulde. Zet je gevoelige gegevens in deze tool, gebruik dan geen openbare site.

### Antwoorden terugkrijgen

GitHub Pages is een statische site: er is geen server die antwoorden kan opslaan. Daarom krijgt de respondent aan het eind een **korte code** (ongeveer honderd tekens) van zijn of haar antwoorden.

1. Vul `onderzoekerEmail` in `assets/config.js` in. De respondent krijgt dan een knop **Antwoorden doorsturen** die zijn e-mailprogramma opent met de code er al in.
2. Laat je dat veld leeg, dan kan de respondent de code alleen kopiëren en zelf sturen.
3. Jij plakt de ontvangen codes op de startpagina bij **Antwoorden importeren**. Meerdere codes tegelijk mag; ze worden als afzonderlijke respondenten toegevoegd.

De code bevat alleen de scores en de opgegeven aanduiding — geen vrije tekst, geen contactgegevens.

Wil je het zonder codes, dan heb je een backend nodig: een formulierdienst of een eigen server. Dat valt buiten wat GitHub Pages kan.

## Waar de gegevens blijven

Alle antwoorden staan in `localStorage` van de browser waarin ze zijn ingevuld. Er is geen server en er wordt niets verstuurd. Dat betekent ook:

- antwoorden zijn **niet** zichtbaar op een ander apparaat of in een andere browser — daarvoor zijn de antwoordcodes hierboven;
- de knop **Alles wissen** verwijdert de gegevens van die vragenlijst definitief;
- exporteer de CSV voordat je browsergegevens wist.

Voor een veldsessie is dit meestal precies wat je wilt: geen patiëntgegevens die ergens anders terechtkomen. Werk je met meerdere studenten aan één organisatie, spreek dan af wie invult, en deel de CSV of PNG achteraf.

## Publiceren op GitHub Pages

1. Maak een repository aan op GitHub, bijvoorbeeld `pccd-audit`.
2. Zet de inhoud van deze map in de hoofdmap van de repository (dus `index.html` direct in de root, niet in een submap).
3. Push naar de branch `main`.
4. Ga in de repository naar **Settings → Pages**.
5. Kies bij *Source* de optie **Deploy from a branch**, branch `main`, map `/ (root)`. Klik op **Save**.
6. Na ongeveer een minuut staat de site op `https://<gebruikersnaam>.github.io/<repositorynaam>/`.

Via de opdrachtregel:

```bash
git init
git add .
git commit -m "PCCD Audit: drie vragenlijsten met spinnenwebdiagram"
git branch -M main
git remote add origin https://github.com/<gebruikersnaam>/<repositorynaam>.git
git push -u origin main
```

Het lege bestand `.nojekyll` staat er al in. Dat vertelt GitHub Pages dat het de bestanden ongewijzigd moet serveren.

### Lokaal bekijken

Open `index.html` gewoon in een browser, of start een lokale server:

```bash
python3 -m http.server 8000
```

Daarna: `http://localhost:8000`.

## Opbouw van de bestanden

```
index.html            onderzoekersweergave: de drie blokken, delen en importeren
deelnemen.html        de link die je naar respondenten stuurt
analyse.html          dashboard: overzicht, steekproef, schalen, correlaties
mantelzorgers.html    open vragen met opname, plus een score per dimensie
codering.html         open, axiaal en selectief coderen met een klik
patienten.html        vragenlijst patiënten
professionals.html    vragenlijst professionals
pcpi-s.html           vragenlijst PCPI-S
vergelijking.html     overlay en verschiltabel
assets/
  config.js           organisatienaam, e-mailadres en toegangscode
  data.js             alle vragen, dimensies en constructen
  advice.js           adviesteksten per dimensie en scoreband, en de adviesgenerator
  analysis.js         statistiek (gemiddelden, alfa, correlaties) en het dashboard
  coding.js           thematisering: fragmenten, open codes, categorieen, kerncategorie
  coding-page.js      de codeerpagina en de export van het rapport
  participant.js      deelnemersmodus: rolkeuze, invullen, bedankscherm, antwoordcode
  i18n.js             Nederlandse en Engelse interfaceteksten, taal- en themakeuze
  radar.js            spinnenwebdiagram (eigen SVG-renderer) en PNG-export
  app.js              opslag, paginaopbouw, berekening en CSV-export
  styles.css          vormgeving, licht en donker
.nojekyll
```

Geen build-stap, geen afhankelijkheden, geen externe bronnen. De site werkt ook zonder internetverbinding zodra de pagina geladen is — handig in een gebouw met slechte wifi.

## Aanpassen

**Vragen wijzigen of toevoegen** — `assets/data.js`. Elk item is `['id', 'dimensie-id', 'vraagtekst', nvtToegestaan]`. Zet `true` op de laatste positie als "niet van toepassing" een geldig antwoord is; die items tellen dan niet mee in het gemiddelde.

**Dimensienamen** — ook in `assets/data.js`, in `PCC_DIMS` en `PCPIS_DIMS`. Voeg `shortNl` en `shortEn` toe als de volledige naam te lang is voor een as in het diagram; de volledige naam blijft dan in de tabel en de tooltip staan.

**Adviesteksten** — `assets/advice.js`, met een Nederlandse en een Engelse set (`PCC_NL` / `PCC_EN` en `PCPIS_NL` / `PCPIS_EN`). Per dimensie staan er drie versies: voor een lage score (onder 2,5), een middenscore (2,5 tot 3,5) en een hoge score (3,5 en hoger). Bij de acht PCC-dimensies is er een variant voor de organisatie (`org`) en een voor de patiënt (`pat`); de patiëntvariant gaat over wat iemand zelf kan doen of bespreken, niet over wat de organisatie moet verbeteren.

**Instellingen per veldsessie** — `assets/config.js`: naam van de organisatie, het e-mailadres waar codes naartoe gaan, en de toegangscode voor de onderzoekersweergave.

**Mantelzorgervragen** — `assets/data.js`, in `MANTEL_OPEN` (de open vragen per dimensie) en `MANTEL_ITEMS` (de stellingen).

**Stopwoorden en codeerinstellingen** — `assets/coding.js`. De Nederlandse stopwoordenlijst staat bovenaan; het aantal categorieën volgt uit `target` in de axiale stap.

**Achtergrondvragen** — `assets/data.js`, onderaan in `BG_COMMON`, `BG_PROF` en `BG_PAT`. Elke optie is `['code', 'Nederlands', 'English']`; de code wordt opgeslagen, dus verander die niet meer nadat je gegevens hebt verzameld.

**Interfaceteksten** — `assets/i18n.js`.

**Kleuren** — de CSS-variabelen boven in `assets/styles.css` en het `VIZ`-object boven in `assets/radar.js`. De drie reekskleuren zijn gecontroleerd op onderscheidbaarheid bij kleurenblindheid, in zowel de lichte als de donkere weergave; vervang je ze, controleer dat dan opnieuw.

## Berekening van de scores

Per dimensie wordt het gemiddelde genomen over **alle beantwoorde items van alle geselecteerde respondenten samen** (pooling op itemniveau). Dat is stabieler dan eerst per respondent middelen, omdat respondenten verschillende items op "niet van toepassing" kunnen zetten. Items zonder antwoord en items op "niet van toepassing" tellen niet mee.

De kolom *Beantwoord* in de tabelweergave laat zien op hoeveel antwoorden elk dimensiegemiddelde berust. Bij een laag aantal is het gemiddelde niet meer dan een indicatie — vermeld dat in je presentatie. Het advies zegt dat er onder de vijftien antwoorden zelf ook bij.

Het advies kiest per dimensie een tekst op basis van drie banden: onder 2,5 is een aandachtspunt, 2,5 tot 3,5 is in ontwikkeling, 3,5 en hoger is een sterk punt. Het toont de dimensies onder 3,5 als aandachtspunt (hooguit vier) en de dimensies vanaf 3,5 als sterk punt (hooguit drie). Die grenzen zijn een keuze van deze tool, geen norm uit de literatuur.

## Bronnen

- **PCC-dimensies (patiënten en professionals)** — Nederlandse vragenlijsten, gebaseerd op de dimensies van persoonsgerichte zorg van het Picker Institute.
- **PCPI-S** — Person-centred Practice Inventory – Staff (Slater, McCance & McCormack), Nederlandse vertaling. Gebaseerd op het Person-centred Practice Framework.

De vragenlijsten zijn hulpmiddelen voor het gesprek, geen gevalideerde meting op organisatieniveau. Het aantal respondenten tijdens een veldsessie is klein; behandel de uitkomsten als aanleiding voor een gesprek, niet als een oordeel.
