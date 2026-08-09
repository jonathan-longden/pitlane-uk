# Store listing copy — PitLane UK

Draft copy for both stores. Character limits are noted; counts are current as of
writing but worth re-checking in the console before you paste.

---

## Apple App Store

**App name** (30 max)

```
PitLane: UK Car Meets
```

**Subtitle** (30 max)

```
Find car events near you
```

**Promotional text** (170 max — editable without a new build)

```
New meets added across every UK region. Filter by what you drive, save what you fancy, and get directions in a tap.
```

**Description** (4000 max)

```
Every car meet in Britain, in one place.

PitLane finds what's on near you — from a Tuesday night car park meet to a full weekend of historic racing at Donington. Cars and coffee, show and shine, track days, JDM, Euro, American, classics and supercars, from Cornwall to the Highlands.

WHAT'S ON, WHEN
Meets are sorted by how soon they are, so you always see this week first. Search by town, postcode, venue or club.

EVERY REGION
London, the South East and South West, East of England, the Midlands, North West, North East, Yorkshire, Wales, Scotland and Northern Ireland.

FILTER TO WHAT YOU CARE ABOUT
Narrow by region, type of meet, time window, or free entry only. The map and the list always show the same results.

SEE IT ON A MAP
Every meet plotted across the UK. Tap a pin to see the details, tap again for the full listing.

NEAR ME
Share your location and PitLane sorts by distance and shows how far each meet is. Entirely optional — everything else works without it.

SAVE FOR LATER
Bookmark anything that catches your eye. No account, no sign-up, no email address. Your shortlist stays on your phone.

TURN UP PREPARED
Every listing shows start and finish times, entry price, whether you need to book, what's on site, and who's running it. One tap sends you there in Waze, Google Maps or Apple Maps — your choice.

KEEPING MEETS ALIVE
Car meets survive on goodwill. Keep the noise down, never take part in anti-social driving, and follow whatever the organisers ask on the day. A single bad night is how car parks get closed to everyone.

Event details are gathered from public listings and can change at short notice. Always check with the organiser before setting off.
```

**Keywords** (100 max, comma-separated, no spaces)

```
car,meet,meets,cars,coffee,show,shine,jdm,classic,trackday,motoring,automotive,supercar,events,uk
```

**Category:** Primary — Travel. Secondary — Sports.

**Age rating:** 4+

**Support URL / Marketing URL / Privacy Policy URL:** required — see
[privacy-policy.md](privacy-policy.md).

---

## Google Play

**App name** (30 max)

```
PitLane: UK Car Meets
```

**Short description** (80 max)

```
Find car meets, shows and track days happening near you, anywhere in the UK.
```

**Full description** (4000 max)

```
Every car meet in Britain, in one place.

PitLane finds what's on near you — from a Tuesday night car park meet to a full weekend of historic racing. Cars and coffee, show and shine, track days, JDM, Euro, American, classics and supercars, from Cornwall to the Highlands.

• WHAT'S ON, WHEN — meets grouped by how soon they are, so this week comes first
• SEARCH — by town, postcode, venue or club
• EVERY REGION — England, Scotland, Wales and Northern Ireland
• FILTERS — region, type of meet, time window, free entry only
• MAP — every meet plotted across the UK
• NEAR ME — optional location access sorts by distance
• SAVE — bookmark meets with no account and no sign-up
• DIRECTIONS — navigate with Waze, Google Maps or Apple Maps

WHAT EACH LISTING TELLS YOU
Start and finish times, entry price, whether you need to book ahead, what's on site, and who's organising it.

NO ACCOUNT REQUIRED
PitLane doesn't ask for your email address, doesn't have a login, and doesn't collect your data. Your saved meets stay on your device.

KEEPING MEETS ALIVE
Car meets survive on goodwill. Keep the noise down, never take part in anti-social driving, and follow whatever the organisers ask on the day. A single bad night is how car parks get closed to everyone.

Event details are gathered from public listings and can change at short notice. Always check with the organiser before setting off.
```

**Category:** Events. **Tags:** Car meets, Automotive, Local events.

**Content rating:** complete the IARC questionnaire — expect Everyone / PEGI 3.

**Data safety:** no data collected, no data shared. See
[privacy-policy.md](privacy-policy.md).

---

## Screenshots needed

Capture on a simulator with the status bar clean.

**iOS** — 6.9" (1320×2868) and 6.5" (1242×2688) are the two required sets;
iPad 13" only if you keep `supportsTablet` enabled in `app.json`.

**Android** — phone screenshots at 1080×1920 or larger, minimum 2, plus a
1024×500 feature graphic.

Suggested order, same on both platforms:

1. Discover — the list, showing "This week"
2. Map — pins across the UK with a card selected
3. Event detail — Caffeine & Machine or Ace Cafe reads well
4. Filters — chips selected
5. Saved

## Pre-submission checklist

- [ ] App name checked against the UK IPO trade mark register and both stores
- [ ] `ios.bundleIdentifier` and `android.package` set to a domain you own
      (currently `uk.co.pitlane.app`)
- [ ] Privacy policy hosted at a public URL and entered in both consoles
- [ ] Support URL live
- [ ] Screenshots captured at every required size
- [ ] Event listings verified with organisers, or a real backend connected
- [ ] Android Google Maps API key added — the map is blank grey without one
      (see "Maps on each platform" in the README)
- [ ] Apple: export compliance answered (`usesNonExemptEncryption` is already
      set to `false` in `app.json`)
- [ ] Google: closed test completed if the account requires it
