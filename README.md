# PitLane UK

Car meets and events across the United Kingdom — one app for finding what is on
this weekend, from a Tuesday night car park meet to a full weekend of historic
racing.

Built with Expo and React Native, so a single codebase ships to the **Apple App
Store**, **Google Play** and the **web**.

## What it does

- **Discover** — every upcoming meet, grouped by how soon it is, with full-text
  search across titles, venues, towns, postcodes and organisers.
- **Map** — all meets plotted across the UK, with a carousel that stays in sync
  with the selected pin. Native uses the platform map; web uses Leaflet with
  dark raster tiles. See [Maps on each platform](#maps-on-each-platform).
- **Filters** — region, type of meet, time window and free-entry-only.
- **Event detail** — times, entry price, whether booking is required, what is on
  site, the organiser, and turn-by-turn directions in **Waze**, Google Maps or
  Apple Maps. Each option uses a public https link, so it opens the app when it
  is installed and the website when it is not — no scheme declarations needed
  on either platform.
- **Saved** — a shortlist kept on the device, no account needed.
- **Photos** — attach a picture to any listing. Listings with a photo get
  full-width cover art while the rest stay compact, so a photo is what makes a
  listing stand out. Device-only for now — see
  [monetisation.md](docs/monetisation.md#photos-on-listings).
- **Ad slots** — one every six listings and one on the detail screen, labelled
  and currently filled with house ads that track nobody. See
  [monetisation.md](docs/monetisation.md).
- **Near me** — optional location access sorts by distance. The app is fully
  usable without granting it, and never asks on first launch.

## Running it

```bash
npm install
```

```bash
npm start
```

Then press `i` for the iOS simulator, `a` for an Android emulator, or `w` for
the browser. To open it on your own phone, install **Expo Go** and scan the QR
code the dev server prints.

Other scripts:

| Command | Purpose |
| --- | --- |
| `npm run web` | Web dev server only |
| `npm run typecheck` | TypeScript, no emit |
| `npm run build:web` | Static web export into `dist/` |

## How it is put together

```
app/                    Screens — file paths are the routes (expo-router)
  (tabs)/               Discover, Map, Saved, More
  event/[id].tsx        Event detail
  filters.tsx           Filter sheet
src/
  data/seed.ts          The bundled UK meet catalogue
  data/repository.ts    The only thing the screens read data through
  state/                Saved list, filters, location, event loading
  components/           EventCard, EventMap, Chip, SaveButton, EmptyState
  lib/                  Date formatting, distance maths, filtering
  theme.ts              Colours, spacing, type scale
assets/brand/           Icon artwork (SVG source)
scripts/                Icon generation
```

### Swapping the bundled data for a real backend

Every screen reads events through `EventRepository` in
[`src/data/repository.ts`](src/data/repository.ts). To move to a hosted API,
write a second implementation of that interface and export it instead:

```ts
class ApiEventRepository implements EventRepository {
  async listEvents() {
    const res = await fetch('https://api.example.com/events');
    return res.json();
  }
  async getEvent(id: string) { /* ... */ }
}

export const eventRepository: EventRepository = new ApiEventRepository();
```

Nothing in `app/` changes. The screens already handle loading and error states
because they were written as though the source were remote from the start.

### Note on the bundled dates

Seed events carry an offset in days from today rather than fixed dates, snapped
forward to the weekday each meet actually runs on. That keeps the catalogue
populated with plausible upcoming meets while there is no backend. Real data
will carry absolute timestamps.

### Maps on each platform

| Platform | Renderer | Needs a key? |
| --- | --- | --- |
| iOS | Apple Maps via `react-native-maps` | No |
| Android | Google Maps via `react-native-maps` | **Yes** |
| Web | Leaflet + CARTO dark raster tiles | No |

**Android will show a blank grey map until you add a Google Maps API key.**
This is not a bug in the app — `PROVIDER_DEFAULT` on Android is Google Maps,
and it renders nothing without a key. To fix it:

1. In the Google Cloud console, enable **Maps SDK for Android** and create an
   API key, restricted to your `uk.co.pitlane.app` package and signing
   certificate.
2. Add it to `app.json`:

```json
"android": {
  "config": { "googleMaps": { "apiKey": "YOUR_ANDROID_MAPS_API_KEY" } }
}
```

A key committed to a repo is a key someone else can bill you for. If this repo
ever goes public, move the config to an `app.config.js` that reads the key from
the environment, and set it as an EAS secret.

iOS needs nothing — Apple Maps works out of the box.

The web build uses CARTO's free basemap tiles. Attribution is rendered on the
map, which their terms require. Free-tier usage is fine for testing and modest
traffic; a popular public site should move to a paid tile plan or self-hosted
tiles.

### Regenerating the icons

Artwork lives in `assets/brand/*.svg`. After editing:

```bash
npm install --no-save sharp && node scripts/generate-icons.mjs
```

## Shipping to the app stores

The build tooling is [EAS](https://docs.expo.dev/eas/). You do **not** need a
Mac — iOS builds happen on Expo's machines.

### One-off setup

```bash
npm install -g eas-cli && eas login && eas init
```

Then fill in the placeholder values in [`eas.json`](eas.json) under
`submit.production`.

### Build

```bash
eas build --platform all --profile production
```

### Submit

```bash
eas submit --platform ios --profile production
```

```bash
eas submit --platform android --profile production
```

### Web

`npm run build:web` produces a static site in `dist/` that can be dropped on any
static host.

## Before you can actually submit

These are on you, not the code — both stores will reject the app without them.

1. **Developer accounts.** Apple Developer Program (£79/year, and Apple requires
   a D-U-N-S number if you enrol as a company rather than an individual) and a
   Google Play Developer account (one-off $25). Google also requires new
   personal accounts to run a closed test with 12 testers for 14 days before
   production access opens up.
2. **A hosted privacy policy.** Both stores need a public URL.
   [`docs/privacy-policy.md`](docs/privacy-policy.md) is a complete draft that
   matches what this app actually does — host it and put the URL in both store
   listings and in `app.json`.
3. **Screenshots.** Required at several sizes per platform. Run the app in
   simulators and capture Discover, Map and an event detail screen.
4. **The name.** "PitLane" is a placeholder. Check it against the UK IPO trade
   mark register and both app stores before you commit to it — changing a
   bundle identifier after release is painful.
5. **Data accuracy.** The bundled catalogue is realistic sample data built
   around real venues, not a verified live feed. Before a public release, either
   confirm each listing with its organiser or swap in a real backend. Listing
   events that do not happen is the fastest route to one-star reviews.

Store listing copy is drafted in
[`docs/store-listing.md`](docs/store-listing.md).

## Licence

See [LICENSE](LICENSE).
