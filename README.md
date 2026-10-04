# De Leenheer & C°

Een snelle, responsieve website op één doorlopende pagina voor De Leenheer & C°, een familiaal accountancykantoor in Roeselare.

## Lokaal bekijken

```sh
python3 -m http.server 4175 --directory dist
```

Open http://localhost:4175. Geen installatie of build nodig: `dist/` bevat de volledige website.

## Inhoud

- Vaste navigatie met ankerlinks en een toegankelijk mobiel menu.
- Vier uitklapbare expertisedomeinen.
- Kantoorverhaal en bestaande teamportretten.
- Publicatie en bestaand Webwin-sectornieuws, pas geladen na een klik.
- Telefoon, e-mail, route en een formulier dat een e-mailconcept opent.
- Privacy-informatie, metadata, favicon en ondersteuning voor verminderde beweging.

Het formulier verstuurt zelf geen berichten. De bezoeker opent een voorbereid bericht in het eigen e-mailprogramma en verstuurt het daar. Er is geen formulierbackend of opslag van persoonsgegevens. De externe nieuwsfeed kan eigen cookies plaatsen nadat de bezoeker deze opent.

## Bestanden

- `dist/index.html`: alle inhoud, semantische structuur en metadata.
- `dist/styles.css`: ontwerp en responsive lay-outs.
- `dist/app.js`: menu, sectiemarkering, nieuws en e-mailconcept.
- `dist/assets/`: lokaal opgeslagen beeldmateriaal van de bestaande website.
- `.openai/hosting.json`: Sites-hostingconfiguratie.

## Bronnen en beeldrechten

Bedrijfsgegevens en diensten zijn gebaseerd op https://www.deleenheer.be/ en de contact- en inhousepagina's, geraadpleegd op 4 oktober 2026. Logo en beelden zijn hergebruikt uit die website voor dit herontwerp. De portretfoto's zijn echte bestaande teamfoto's; de andere foto's zijn illustratief en worden niet voorgesteld als foto's van het kantoor. Deze repository kent geen nieuwe licentie toe aan dat bestaande beeldmateriaal.

Het familiale verhaal en de overdracht door drie generaties zijn gebaseerd op de correctie van de opdrachtgever. Het oorspronkelijke donkerblauw (#000035), wit en lichtgrijs zijn behouden. De contactgegevens en teambezetting zijn overgenomen zoals gepubliceerd; er zijn geen functies, beoordelingen, klanten, keurmerken of ervaringsjaren verzonnen. De bestaande website en het bestaande domein zijn niet gewijzigd.

## Hosting

Elke statische webhost kan `dist/` publiceren. Sites gebruikt de configuratie in `.openai/hosting.json`. De preview is privé; dit project wijzigt geen DNS-instellingen van deleenheer.be.
