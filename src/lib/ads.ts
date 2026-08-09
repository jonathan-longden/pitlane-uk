/**
 * Advertising configuration and the seam a real ad network plugs into.
 *
 * Nothing here talks to an ad network yet, and that is deliberate — see
 * docs/monetisation.md. Turning on a network like AdMob changes what the app
 * collects about people, which means the privacy policy and both stores' data
 * disclosures have to change with it. Until that decision is made, these slots
 * render house ads: PitLane's own promos, which track nobody.
 */

export type AdPlacement = 'discover-feed' | 'event-detail';

export interface HouseAd {
  id: string;
  eyebrow: string;
  headline: string;
  body: string;
  cta: string;
  /** Where the CTA goes. Internal route or external URL. */
  href: string;
}

/**
 * Slots are filled from this list until a network or a sold campaign replaces
 * them. A house ad is better than an empty box and better than a blank
 * "advertisement" placeholder, which just looks broken.
 */
const HOUSE_ADS: Record<AdPlacement, HouseAd[]> = {
  'discover-feed': [
    {
      id: 'house-list-your-meet',
      eyebrow: 'From PitLane',
      headline: 'Run a meet?',
      body: 'Get your event in front of drivers across the UK. Listings for organisers are opening soon.',
      cta: 'Register interest',
      href: 'mailto:hello@pitlane.uk?subject=Listing%20my%20meet',
    },
    {
      id: 'house-advertise',
      eyebrow: 'From PitLane',
      headline: 'Advertise to the UK car scene',
      body: 'Detailers, tuners, insurers and parts suppliers — reach people on their way to a meet.',
      cta: 'Get the media pack',
      href: 'mailto:hello@pitlane.uk?subject=Advertising%20on%20PitLane',
    },
  ],
  'event-detail': [
    {
      id: 'house-detail-advertise',
      eyebrow: 'From PitLane',
      headline: 'Your brand here',
      body: 'Sponsor listings in a region and reach drivers deciding where to go this weekend.',
      cta: 'Get the media pack',
      href: 'mailto:hello@pitlane.uk?subject=Advertising%20on%20PitLane',
    },
  ],
};

/** Picks a house ad for a placement, varied by a caller-supplied seed. */
export function houseAdFor(placement: AdPlacement, seed: number): HouseAd {
  const pool = HOUSE_ADS[placement];
  return pool[Math.abs(seed) % pool.length];
}

/** How many listings appear between ad slots in the Discover feed. */
export const ADS_EVERY_N_ITEMS = 6;

/**
 * Master switch. Flip to false to strip advertising entirely — useful for
 * screenshots, and for any future paid tier.
 */
export const ADS_ENABLED = true;
