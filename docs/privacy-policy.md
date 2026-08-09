# PitLane UK — Privacy Policy

**Last updated: 9 August 2026**

This policy describes how the PitLane UK mobile and web application handles
information. It is written to match what the app actually does. If you change
the app — particularly if you add accounts, analytics, or advertising — this
policy must be updated before the change ships.

> Replace the contact details and the publisher name below with your own before
> publishing. Both Apple and Google require this policy to be reachable at a
> public URL, and that URL must be entered in your store listings.

> **This policy describes the app WITHOUT accounts connected, which is how it
> currently ships.** The sign-in screens exist but no Supabase project is
> attached, so no account data is collected. **Before releasing a build with
> accounts enabled, the sections below must be rewritten** — see
> `docs/auth-setup.md` section 8. Shipping accounts under a policy that says
> "no data collected" is the mismatch that gets apps removed rather than
> rejected.

## The short version

PitLane UK does not have user accounts, does not collect personal information,
and does not send your data anywhere. Everything the app stores stays on your
device.

## What we collect

**Nothing is sent to us.** The app has no server of its own and no analytics
SDK. We do not collect your name, email address, phone number, contacts, photos,
advertising identifier, or any other identifier.

## Information stored on your device

| What | Why | Where it goes |
| --- | --- | --- |
| Your saved meets | So your shortlist is still there next time you open the app | Stored locally only. Never transmitted. |
| Your filter selections | To keep the map and list in step during a session | Held in memory, cleared when you close the app. |
| Photos you attach to a listing | So you can add a picture to a meet | Stored locally only. Not uploaded, not shared with other users. |

## Advertising

The app shows a small number of ad slots. These currently carry PitLane's own
promotions only — there is no ad network, no third-party advertising SDK, and
no advertising identifier is read or shared.

> If an ad network is ever added, this section and the store disclosures below
> must be rewritten before that build ships. See `docs/monetisation.md`.

Deleting the app removes all of it.

## Location

If — and only if — you tap "Near me" or the locate button on the map, the app
asks your device for permission to read your approximate location.

- It is used solely to calculate how far each meet is from you, and to centre
  the map.
- The calculation happens entirely on your device.
- Your location is never stored, logged, or transmitted to us or to anyone else.
- The app never requests background location and does not track you.
- Declining is fully supported. Every feature except distance sorting works
  exactly the same without it.

You can withdraw permission at any time in your device settings.

## Links out of the app

Tapping "Directions" opens your device's own maps application. Tapping an
organiser's website opens your browser. Tapping "Share" uses your device's
standard share sheet. Once you leave PitLane UK, the privacy policy of that
other app or website applies, not this one.

## Children

The app is not directed at children and collects no information from anyone,
including children.

## Event information

Listings describe public events run by third-party organisers, venues and clubs.
We are not the organiser and are not responsible for those events. Details can
change at short notice — always confirm with the organiser before travelling.

## Changes to this policy

If this policy changes, the "last updated" date above will change with it, and a
revised version will be published at the same URL.

## Contact

Questions about this policy or about a listing:

**[YOUR NAME OR COMPANY]**
**[YOUR CONTACT EMAIL]**
**[YOUR POSTAL ADDRESS — required by Google Play for the developer listing]**

## Store data-disclosure answers

For convenience, the answers matching this policy:

**Apple App Store — App Privacy:** Select **"Data Not Collected"**. Location is
used only on-device and is not collected or transmitted, so it is not declared
as collected data.

**Google Play — Data safety:** Declare **no data collected** and **no data
shared**. Note that the app uses location on-device for a user-initiated
feature, and that data is not sent off the device.
