# PitLane UK — Privacy Policy

**Last updated: 9 August 2026**

This policy describes how the PitLane UK mobile and web application handles
information. It is written to match what the app actually does. If you change
the app — particularly if you add accounts, analytics, or advertising — this
policy must be updated before the change ships.

> Replace the contact details and the publisher name below with your own before
> publishing. Both Apple and Google require this policy to be reachable at a
> public URL, and that URL must be entered in your store listings.

## The short version

You can use PitLane UK entirely without an account, and if you do, nothing
leaves your device. If you choose to create an account, we store your email
address and name so we can sign you in — nothing else, and never for
advertising.

## What we collect

### If you do not sign in

**Nothing.** There is no analytics SDK, no advertising network and no tracking.
We do not know you are using the app.

### If you create an account

Accounts are handled by [Supabase](https://supabase.com), which stores the data
on our behalf inside the UK/EU region.

| What | Why |
| --- | --- |
| Email address | To identify your account and let you sign in |
| Name you provide | To show who you are in the app |
| Password | Stored only as a secure hash. We never see it. |
| Account identifier | A random ID used to link your account to your data |

If you sign in with **Google**, we receive your email address, name and profile
picture from Google. We do not receive your Google password and cannot act on
your Google account.

We do not sell your data, share it with advertisers, or use it to build a
profile of you.

## Deleting your account

You can delete your account from **More → Delete my account** inside the app.
This permanently removes your account and everything attached to it, and cannot
be undone. You do not have to contact us or explain why.

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

These reflect the app **with accounts enabled**, which is its current state.

**Apple App Store — App Privacy:**

| Data type | Collected | Linked to user | Used for tracking | Purpose |
| --- | --- | --- | --- | --- |
| Email address | Yes | Yes | No | App Functionality |
| Name | Yes | Yes | No | App Functionality |
| User ID | Yes | Yes | No | App Functionality |
| Coarse/Precise Location | **No** | — | — | Used on-device only, never transmitted |
| Photos | **No** | — | — | Stored on-device only, never uploaded |

**Google Play — Data safety:** declare Personal info → Name and Email address,
collected but **not** shared, required for account creation, encrypted in
transit, and **deletable in-app** (point the deletion URL at the in-app route
described above).

**Location and photos are genuinely not collected.** Location is read on the
device to calculate distance and is never sent anywhere; photos attached to
listings stay on the device. Declaring them as collected would be inaccurate in
the other direction, which is also worth avoiding.
