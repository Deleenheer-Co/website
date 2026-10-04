# De Leenheer & C°

Een snelle, responsieve website op één doorlopende pagina voor De Leenheer & C°, een familiaal accountancykantoor in Roeselare.

## Lokaal bekijken

```sh
python3 -m http.server 4175 --directory dist
```

Open http://localhost:4175. Geen installatie of build nodig: `dist/` bevat de volledige website.

## Inhoud

- Transparante vaste navigatie bovenaan met geleidelijk naar transparant vervagende achtergrondblur, rustige tekstlinks, hoverbeweging en een schermvullend mobiel menu.
- Vier uitklapbare expertisedomeinen.
- Familieverhaal van drie generaties, grote typografie, strakke lijnen en bestaande teamportretten.
- Publicatie en bestaand Webwin-sectornieuws, pas geladen na een klik.
- Telefoon, e-mail, route en een formulier dat een e-mailconcept opent.
- Rustige verschijningseffecten, een meebewegend breed sfeerbeeld en kleur bij hover op teamfoto’s. Alle beweging respecteert verminderde beweging.
- Privacy-informatie, metadata en favicon.

Het formulier verstuurt zelf geen berichten. De bezoeker opent een voorbereid bericht in het eigen e-mailprogramma en verstuurt het daar. Er is geen formulierbackend of opslag van persoonsgegevens. De externe nieuwsfeed kan eigen cookies plaatsen nadat de bezoeker deze opent.

## Bestanden

- `dist/index.html`: alle inhoud, semantische structuur en metadata.
- `dist/styles.css`: ontwerp en responsive lay-outs.
- `dist/app.js`: menu, sectiemarkering, nieuws en e-mailconcept.
- `dist/assets/`: lokaal opgeslagen teamportretten, logo en een gelicentieerde sfeerfoto.
- `.openai/hosting.json`: Sites-hostingconfiguratie.

## Bronnen en beeldrechten

Bedrijfsgegevens en diensten zijn gebaseerd op https://www.deleenheer.be/ en de contact- en inhousepagina's, geraadpleegd op 4 oktober 2026. Het logo en de vier teamportretten zijn hergebruikt uit die website voor dit herontwerp. Deze repository kent geen nieuwe licentie toe aan dat bestaande beeldmateriaal. Het brede sfeerbeeld is illustratief en stelt niet het eigen kantoor voor.

Het familiale verhaal en de overdracht door drie generaties zijn gebaseerd op de correctie van de opdrachtgever. De oorspronkelijke witte en lichtgrijze basis is behouden. Op verzoek van de opdrachtgever zijn grote donkerblauwe vlakken vervangen door een lichte uitstraling; het originele logo blijft behouden. De contactgegevens en teambezetting zijn overgenomen zoals gepubliceerd; er zijn geen functies, beoordelingen, klanten, keurmerken of ervaringsjaren verzonnen. De bestaande website en het bestaande domein zijn niet gewijzigd.

## Hosting

Elke statische webhost kan `dist/` publiceren. Sites gebruikt de configuratie in `.openai/hosting.json`. De preview is privé; dit project wijzigt geen DNS-instellingen van deleenheer.be.

De compositie en navigatie zijn geïnspireerd op de ruimtelijkheid en typografie van skinn.agency/branding. De visuele hero combineert drie generaties accountancy met een abstracte papiercompositie en een concrete introductie. Er zijn geen teksten, logo’s of beelden van SKINN gekopieerd.

### Nieuwe sfeerfoto

- Fotograaf: Matt Hoffman.
- Bron: https://unsplash.com/photos/two-white-wooden-tables-near-glass-window-Q0AM87PsYkE
- Beeld: https://images.unsplash.com/photo-1496681859237-6039cd585c4e
- Licentie: https://unsplash.com/license (commercieel gebruik en wijzigingen toegestaan; geraadpleegd op 4 oktober 2026).
- Gebruikt als illustratieve werkruimte, niet als het daadwerkelijke kantoor.

### Accountancy-artwork

`dist/assets/accountancy-sculpture.png` is origineel artwork, gemaakt met de ingebouwde imagegen-tool op verzoek van de opdrachtgever. Drie abstracte gevouwen grootboekvormen verbinden precisie, balans en de drie generaties van het kantoor. Het beeld bevat geen echte financiële gegevens. De exacte prompt en herkomst staan in `artwork-notes.json`.
