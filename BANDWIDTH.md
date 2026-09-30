# Keeping Render bandwidth down

The homepage previously referenced about 35 MB of images plus a 12 MB autoplay
video. Optimized WebP copies total 1.10 MB; the autoplay video is about 1.3 MB.
Original images are retained for editing. Portraits load near the viewport;
the smaller video autoplays while visible, respects reduced-motion preferences,
and pauses when the tab or hero is hidden. Registration/admin bundles load on their
routes, and public visits no longer make a backend wake-up request.

Before deploying, run from the repository root:

```sh
npm run check:bandwidth --prefix front-end
npm run build --prefix front-end
```

Regenerate images with `python3 front-end/scripts/optimize-homepage.py` (requires
`cwebp`, available via `brew install webp`). Video was encoded with:

```sh
ffmpeg -i front-end/public/meadow/moving_airplane_5_loop.mp4 -an \
  -vf 'scale=1280:-2,fps=24' -c:v libx264 -crf 30 -preset slow \
  -pix_fmt yuv420p -movflags +faststart \
  front-end/src/components/pictures/meadow/airplane-loop.mp4
```

## Existing Render static site

Deploy the updated frontend using its existing Render service. If suspended,
resume it in the dashboard. Changes here do not reset already consumed usage.

In the static site's **Headers** settings, add:

| Path | Header | Value |
| --- | --- | --- |
| `/static/*` | `Cache-Control` | `public, max-age=31536000, immutable` |

CRA puts content hashes in these URLs, including the new images and video, so
updated files receive new URLs. Do not apply this long cache lifetime to HTML,
unversioned public files, or API responses. This dashboard setting is not
applied automatically by files in this repository.

Render already compresses static responses with Brotli. Browser caching avoids
repeat downloads; CDN delivery still counts as outbound bandwidth.

The 5 GB allowance is shared across the workspace's services. At 1 MB per visit,
5 GB allows roughly 5,000 uncached visits; at 2 MB, roughly 2,500, before other
services, bots, and video. Measure actual usage after deployment and
leave headroom. Asset optimization cannot guarantee a monthly ceiling for
unbounded traffic.

References: [Render static sites](https://render.com/docs/static-sites),
[custom headers](https://render.com/docs/static-site-headers),
[outbound bandwidth](https://render.com/docs/outbound-bandwidth).
