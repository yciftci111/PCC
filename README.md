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
| **Vergelijken** | patiënten en professionals over elkaar heen, plus een verschiltabel | overlay, of beide afzonderlijk |

Elk blok levert naast het diagram een **geschreven advies**: een samenvatting van het profiel, de dimensies met de meeste ruimte (met per dimensie wat de score laat zien en wat ermee te doen valt), en wat goed gaat.

Verder:

- **Meerdere respondenten per lijst.** Voeg per interview een respondent toe; het diagram toont het gemiddelde over alle respondenten, of alleen de geselecteerde.
- **Tweetalig.** Knop rechtsboven wisselt tussen Nederlands en Engels. De vragen blijven Nederlands; navigatie, uitleg en resultaten wisselen mee.
- **Lichte en donkere weergave**, met een knop en automatisch volgens de systeeminstelling.
- **Export.** Diagram als PNG, gegevens als CSV, en afdrukken naar PDF voor de presentatie aan het eind van de dag.
- **Toegankelijkheid.** Elk diagram heeft een tabelweergave; de scores staan nooit alleen in kleur.

## Twee kanten: deelnemers en onderzoeker

De site heeft twee ingangen.

**`deelnemen.html` — dit is de link die je naar respondenten stuurt.**
De respondent kiest zelf welke rol op hem of haar van toepassing is (ik ontvang zorg / ik verleen zorg / over mijn eigen praktijk), vult die ene lijst in en krijgt daarna een bedankscherm met het eigen spinnenweb en een geschreven advies. Deze pagina heeft geen navigatie naar de onderzoekersweergave, toont geen andere respondenten en geen vergelijking.

**`index.html` — de onderzoekersweergave.**
Alle respondenten bij elkaar, de vergelijking, de export en het importeren van antwoorden. Deze kant staat achter een toegangscode, in te stellen in `assets/config.js` (standaard `pccd`).

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
patienten.html        vragenlijst patiënten
professionals.html    vragenlijst professionals
pcpi-s.html           vragenlijst PCPI-S
vergelijking.html     overlay en verschiltabel
assets/
  config.js           organisatienaam, e-mailadres en toegangscode
  data.js             alle vragen, dimensies en constructen
  advice.js           adviesteksten per dimensie en scoreband, en de adviesgenerator
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

**Adviesteksten** — `assets/advice.js`. Per dimensie staan er drie versies: voor een lage score (onder 2,5), een middenscore (2,5 tot 3,5) en een hoge score (3,5 en hoger). Bij de acht PCC-dimensies is er een variant voor de organisatie (`org`) en een voor de patiënt (`pat`); de patiëntvariant gaat over wat iemand zelf kan doen of bespreken, niet over wat de organisatie moet verbeteren.

**Instellingen per veldsessie** — `assets/config.js`: naam van de organisatie, het e-mailadres waar codes naartoe gaan, en de toegangscode voor de onderzoekersweergave.

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
