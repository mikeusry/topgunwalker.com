import type { APIRoute } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { join } from 'node:path';
import { getOgFonts } from '../lib/og';
import r from '../data/feature-result.json';

const NAVY = '#2C3669';
const ORANGE = '#DE5E2F';

// Lead credential comes from the homepage feature result (sourced there).
// Secondary line: verified by Mike, Nov 3 2026. Keep to Mike-approved claims only.
const LEAD_EVENT = `${r.org} ${r.eventShort}`;
const LEAD_RESULT = `${r.headline} · ${r.record}`.toUpperCase();
const SECONDARY = '2026 Alliance National Tier 3 Runner-Up';

const div = (style: Record<string, unknown>, children: unknown) => ({ type: 'div', props: { style: { display: 'flex', ...style }, children } });

export const GET: APIRoute = async () => {
  const fonts = getOgFonts();
  const logo = await sharp(join(process.cwd(), 'public/topgun-logo-full.png')).resize(900).png().toBuffer();
  const logoDataUrl = `data:image/png;base64,${logo.toString('base64')}`;

  const svg = await satori(
    div({ width: '100%', height: '100%', backgroundColor: NAVY, flexDirection: 'row' }, [
      // Logo panel (white so the logo's navy wing bars read)
      div({ width: '500px', height: '100%', backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', padding: '40px' }, [
        { type: 'img', props: { src: logoDataUrl, width: 420, height: 215, style: { objectFit: 'contain' } } },
      ]),
      div({ width: '14px', height: '100%', backgroundColor: ORANGE }, []),
      div({ flex: 1, flexDirection: 'column', justifyContent: 'center', padding: '0 56px' }, [
        div({ fontSize: 26, fontWeight: 700, color: ORANGE, letterSpacing: '4px', marginBottom: '14px' }, '16U · CHARLOTTE, NC'),
        div({ flexDirection: 'column', fontSize: 70, fontWeight: 700, color: '#FFFFFF', lineHeight: 0.98, letterSpacing: '-1px' }, [
          div({}, 'TOP GUN'),
          div({}, 'NATIONAL'),
          div({}, 'WALKER'),
        ]),
        div({ width: '120px', height: '8px', backgroundColor: ORANGE, marginTop: '22px', marginBottom: '20px' }, []),
        div({ fontSize: 34, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.05 }, LEAD_EVENT),
        div({ fontSize: 26, fontWeight: 700, color: ORANGE, letterSpacing: '2px', marginTop: '6px' }, LEAD_RESULT),
        div({ fontSize: 20, fontWeight: 700, color: 'rgba(255,255,255,0.75)', marginTop: '12px', marginBottom: '22px' }, SECONDARY),
        div({ fontSize: 24, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '3px' }, 'TOPGUNWALKER.COM'),
      ]),
    ]) as any,
    { width: 1200, height: 630, fonts }
  );

  const pngBuffer = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  return new Response(pngBuffer, {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=300, must-revalidate' },
  });
};
