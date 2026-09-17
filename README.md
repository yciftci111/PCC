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

Verder:

- **Meerdere respondenten per lijst.** Voeg per interview een respondent toe; het diagram toont het gemiddelde over alle respondenten, of alleen de geselecteerde.
- **Tweetalig.** Knop rechtsboven wisselt tussen Nederlands en Engels. De vragen blijven Nederlands; navigatie, uitleg en resultaten wisselen mee.
- **Lichte en donkere weergave**, met een knop en automatisch volgens de systeeminstelling.
- **Export.** Diagram als PNG, gegevens als CSV, en afdrukken naar PDF voor de presentatie aan het eind van de dag.
- **Toegankelijkheid.** Elk diagram heeft een tabelweergave; de scores staan nooit alleen in kleur.

## Waar de gegevens blijven

Alle antwoorden staan in `localStorage` van de browser waarin ze zijn ingevuld. Er is geen server en er wordt niets verstuurd. Dat betekent ook:

- antwoorden zijn **niet** zichtbaar op een ander apparaat of in een andere browser;
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
index.html            startpagina met de drie blokken
patienten.html        vragenlijst patiënten
professionals.html    vragenlijst professionals
pcpi-s.html           vragenlijst PCPI-S
vergelijking.html     overlay en verschiltabel
assets/
  data.js             alle vragen, dimensies en constructen
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

**Interfaceteksten** — `assets/i18n.js`.

**Kleuren** — de CSS-variabelen boven in `assets/styles.css` en het `VIZ`-object boven in `assets/radar.js`. De drie reekskleuren zijn gecontroleerd op onderscheidbaarheid bij kleurenblindheid, in zowel de lichte als de donkere weergave; vervang je ze, controleer dat dan opnieuw.

## Berekening van de scores

Per dimensie wordt het gemiddelde genomen over **alle beantwoorde items van alle geselecteerde respondenten samen** (pooling op itemniveau). Dat is stabieler dan eerst per respondent middelen, omdat respondenten verschillende items op "niet van toepassing" kunnen zetten. Items zonder antwoord en items op "niet van toepassing" tellen niet mee.

De kolom *Beantwoord* in de tabelweergave laat zien op hoeveel antwoorden elk dimensiegemiddelde berust. Bij een laag aantal is het gemiddelde niet meer dan een indicatie — vermeld dat in je presentatie.

## Bronnen

- **PCC-dimensies (patiënten en professionals)** — Nederlandse vragenlijsten, gebaseerd op de dimensies van persoonsgerichte zorg van het Picker Institute.
- **PCPI-S** — Person-centred Practice Inventory – Staff (Slater, McCance & McCormack), Nederlandse vertaling. Gebaseerd op het Person-centred Practice Framework.

De vragenlijsten zijn hulpmiddelen voor het gesprek, geen gevalideerde meting op organisatieniveau. Het aantal respondenten tijdens een veldsessie is klein; behandel de uitkomsten als aanleiding voor een gesprek, niet als een oordeel.
