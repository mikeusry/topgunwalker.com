// One source for the homepage trophy case, shared by TrophyCase (renders it)
// and ProofBand (skips any team.achievements line the trophy case already shows).
import r from '../data/feature-result.json';
import schedule from '../data/schedule.json';
import { buildCloudinaryUrl } from './cloudinary';

export type Trophy = {
  result: string;
  event: string;
  when: string;
  where: string;
  img?: string;
  href?: string;
  record?: string;
  /** Words used to recognise the same finish written another way. */
  match: string;
};

export function trophyCase(): Trophy[] {
  const feature: Trophy = {
    result: `${r.org} ${r.eventShort}`,
    event: `${r.headline} · ${r.region}`,
    when: r.dates,
    where: r.location,
    img: r.photo,
    href: r.source.url,
    record: r.record,
    match: `${r.event} ${r.headline}`,
  };

  // The feature result also lives in pastEvents (so the schedule's Past Results
  // list it) — skip it here so the lead tile isn't repeated.
  const past: Trophy[] = (schedule.pastEvents ?? [])
    .filter((e: any) => e.result && e.name !== r.event)
    .map((e: any) => ({
      result: e.result,
      event: e.name,
      when: e.dates,
      where: e.location,
      img:
        e.trophyPhoto ??
        (e.photos?.[0]?.publicId
          ? buildCloudinaryUrl({ publicId: e.photos[0].publicId, width: 640, height: 400, crop: 'fill', gravity: 'auto' })
          : undefined),
      href: e.featured ? '#schedule' : undefined,
      match: `${e.name} ${e.result}`,
    }));

  return [feature, ...past];
}

const STOP = new Set(['the', 'a', 'at', 'of', 'and', '16u']);

function tokens(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/\biii\b/g, '3')
      .split(/[^a-z0-9]+/)
      .filter((t) => t && !STOP.has(t) && !/^\d{4}$/.test(t)),
  );
}

/**
 * True when an achievement line names a finish already in the trophy case
 * ("2026 Alliance National Tier 3 runner-up" vs "Alliance Fastpitch
 * Championship Series · 16U Tier III National Runner-Up"). Three shared
 * significant words is the bar — "AFCA Atlantic Champions" shares only two
 * with the 2025 Atlantic Region title, so it is NOT treated as a duplicate.
 */
export function inTrophyCase(achievement: string, trophies: Trophy[] = trophyCase()): boolean {
  const words = tokens(achievement);
  return trophies.some((t) => {
    let shared = 0;
    for (const w of tokens(t.match)) if (words.has(w)) shared++;
    return shared >= 3;
  });
}
