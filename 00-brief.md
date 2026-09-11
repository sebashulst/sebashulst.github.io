# Portfolio Sebastiaan Hulst — Brief

## Wie
- Sebastiaan Hulst, 28, Amstelveen
- UX/UI Designer bij WP Masters (agency, Amsterdam)
- Opleiding: CMD, Hogeschool van Amsterdam
- Zwaartepunt: UI (visueel, interface, systeem) met UX-basis

## Doel
- Werk laten zien aan recruiters en hiring managers
- Gewenste actie bezoeker: mailen of bellen
- Markt: Nederland
- Geen deadline; kwaliteit boven snelheid

## Vaardigheden
- Figma (primair), Photoshop, Magnific, Claude
- WordPress: zelfstandig in de backend (geen code)
- Basiskennis HTML/CSS
- AI-tooling: image generation, research, visuele uitwerking, vibe-coding

## Positionering (concept)
UI-designer die ontwerpt met de bouw in het achterhoofd, en AI inzet om
sneller van idee naar hi-fi te komen. Zie 01-positionering.md.

## Vorm
- Eigen gecodeerde site
- Strak, minimalistisch, modern
- Kleur: wit / zwart + lime accent
- Mix van korte visuele proof en enkele diepere cases
- Must-haves: over-mij met foto, contactformulier, contactgegevens

## Referenties
- https://heynesh.com/
- https://dennissnellenberg.com/
- https://www.bramvanvugt.com/
- https://www.kunalrajelli.com/works

Gemene deler: veel witruimte, grote typografie, rustige maar zelfverzekerde
motion, werk staat centraal, weinig chrome, sterke persoonlijke toon.

## Technische keuzes
- Taal: Nederlands
- Bouw: statisch HTML/CSS/JS, geen framework of build-stap
- Motion: uitgesproken (scroll-gedreven, page transitions, custom cursor)
- Structuur: one-pager (hero, werk, over mij, contact) + losse case-pagina's
- Hosting: Netlify of Vercel, gratis tier

## Open punten
- Contactgegevens (mail, telefoon, LinkedIn)
- Domeinnaam
- Groentint kiezen
- Projecten + beeldmateriaal aanleveren in assets/raw/

## Status (3 september 2026)
Eerste versie van de site staat: `index.html` (one-pager) en
`werk-jonkers-yachts.html` (eerste case). Styling in `css/style.css`,
gedrag in `js/main.js`. GSAP, ScrollTrigger en Lenis komen van een CDN.

Nog nodig van Sebastiaan:
1. Twee tot vier extra projecten met beeld en context
2. Tekst over Jonkers Yachts checken op feitelijke juistheid (zie CHECK-comments)
3. Formspree-endpoint voor het contactformulier
4. Domeinnaam

## Toegepast uit de taste-skill (3 september 2026)
- Punt 1: alle em-dashes uit de zichtbare tekst, inclusief de title-tags.
- Punt 12: Inter Tight en Inter vervangen door Geist (Google Fonts).
Overige punten uit de audit (cursor, scroll-cue, stippen, eyebrows, hero,
formulierlabels, theme lock, dark mode, lege werkregels, feitenlijst,
H1-schaal, accentverzadiging, middenpunten, iconen, dvh) staan open.

## Portret
Portretfoto staat in de site. Origineel: `assets/raw/portret-origineel.jpg`
(1333x2000). Webversie: `assets/img/portret.jpg` (1199x1800, 328 kB).
Uitsnede via CSS: 4:5 kader, `object-position: center 18%`.

## Accentkleur (definitief)
`--accent: #B4FF3B` (lime), overal dezelfde tint. Keuze van Sebastiaan,
bewust gemaakt nadat het contrastprobleem was benoemd.
- Op zwart 16,2:1. Sterk.
- Op wit 1,2:1. Op de witte delen is lime dus puur decoratie en mag er nooit
  informatie in staan die gelezen moet worden.
- Aandachtspunt: de hover van "Al het werk" onderaan de casepagina kleurt
  lime op wit en is daardoor onleesbaar. Alternatief als dat gaat storen:
  de kop zwart laten en er een lime onderlijn onder zetten.
- De punt achter de naam in de header volgt de tekstkleur, niet het accent.
  De header gebruikt mix-blend-mode difference, waardoor lime daar als paars
  zou renderen.
De tijdelijke kleurkiezer en `js/accent.js` zijn verwijderd.
