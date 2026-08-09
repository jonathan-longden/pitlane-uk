# Monetisation

## What is in the app today

Ad slots are live and laid out, but they are **house ads** — PitLane's own
promos, defined in [`src/lib/ads.ts`](../src/lib/ads.ts). They call no ad
network, load no third-party script, and collect nothing about anyone.

- Discover feed: one slot every 6 listings (`ADS_EVERY_N_ITEMS`)
- Event detail: one slot below the organiser
- Every slot carries a visible **Ad** label and a dashed border, so it cannot be
  mistaken for a listing
- `ADS_ENABLED` in `src/lib/ads.ts` strips advertising entirely when false

This means the app can ship to both stores right now with its current privacy
posture intact: **no data collected**.

---

## The catch with switching on a real ad network

This is the part worth reading before you commit to AdMob.

Today the app collects nothing, which is why
[the privacy policy](privacy-policy.md) can honestly say so and why both stores
can be answered with "no data collected". **The moment an ad network SDK is
added, that stops being true**, and a chain of obligations follows:

| What changes | What you must do |
| --- | --- |
| The SDK reads the advertising identifier and device data | Rewrite the privacy policy — it can no longer say "data not collected" |
| Apple App Privacy | Declare Identifiers and Usage Data as collected, and linked to the user |
| Apple ATT | If ads are personalised, show the App Tracking Transparency prompt (`expo-tracking-transparency`) before any tracking. Shipping without it is a rejection, and a common one |
| Google Play Data safety | Update the declaration, and declare the `AD_ID` permission |
| UK GDPR / PECR | UK and EEA users need a consent flow before personalised ads. Google requires a **certified CMP** — their UMP SDK is the usual choice |
| Age rating | Ads can push the rating up and restrict who sees the app |
| Build tooling | `react-native-google-mobile-ads` is native code, so it needs a development build. **It will not run in Expo Go** |

None of that is a reason not to do it. It is a reason not to do it the week
before submission, and a reason not to declare "no data collected" and bolt ads
on afterwards — that mismatch is what gets apps pulled rather than rejected.

### If you do go with AdMob

1. `npx expo install react-native-google-mobile-ads`
2. Add your app IDs to `app.json` under the plugin config
3. Create a development build — `eas build --profile development`
4. Add Google's UMP consent flow before requesting any ad
5. Add `expo-tracking-transparency` and request ATT on iOS
6. Replace the body of `AdSlot` with a `BannerAd`; the placement and labelling
   logic around it does not need to change
7. Update [privacy-policy.md](privacy-policy.md) and both store declarations

The integration point is deliberately one component. Nothing outside
`AdSlot.tsx` and `ads.ts` knows how an ad is filled.

---

## The honest revenue maths

Worth setting expectations before building the plumbing.

UK banner ads earn roughly **£0.50–£3 per thousand impressions**, and that upper
end assumes good fill and engaged users. An app with 500 regular users, each
seeing 10 ad slots a week, produces about 20,000 impressions a month — call it
**£10 to £60 a month**, against an Apple developer fee of £79 a year.

Ads pay when you have scale. Before that, two things pay considerably better:

**Direct sponsorship.** One local detailer, tuner, insurer or wheel refurbisher
paying £50 a month to be the sponsor of a region beats tens of thousands of
banner impressions, and costs you nothing in privacy obligations — a direct
sponsor is just content you serve yourself, exactly like the house ads already
in the app. The `HouseAd` shape in `ads.ts` is already the right shape for a
sold campaign.

**Promoted listings.** Charge organisers to pin a meet to the top of its region
or to feature it in the week's roundup. Same mechanism, and it aligns with the
product — a promoted meet is still a meet someone wants to find.

Both work at the scale you will actually have in the first year, both keep the
app's "collects nothing" position, and both can run through the existing slot
without adding a single SDK.

My suggestion: sell direct sponsorship first, and only add a network once the
slots are consistently unsold — at which point the network is filling
inventory you could not sell, rather than being the whole strategy.

---

## Photos on listings

Users can attach a photo to any listing, and listings with a photo get
full-width cover art in the feed while the rest stay compact — so a photo is
what makes a listing stand out. That is the incentive doing the work.

**Right now those photos are stored on the device only.** Publishing a photo so
other people see it needs three things the app does not yet have:

1. **Somewhere to upload it** — object storage, and a backend to sign uploads
2. **An account to attribute it to** — so a photo can be traced and removed
3. **Moderation** — both stores require a way to report and remove objectionable
   user content, and Apple in particular rejects apps with user-generated
   content and no moderation path

The UI says the photo is device-only rather than implying it has been shared,
because a user who thinks they have posted publicly and later finds nobody saw
it has been misled. When a backend lands,
[`PhotosContext`](../src/state/PhotosContext.tsx) is where the upload call goes
and no screen above it changes.
