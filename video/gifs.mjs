/**
 * Five looping GIFs that show the deck, one idea each. Rendered by
 * `npm run render:gifs`, or one at a time with
 * `npm run render:video -- --config video/gifs.mjs --gif door`.
 *
 * Every shot is `{ at, slide }` in seconds from the start of that GIF, with the
 * same extras as `video/shots.mjs` (`speed`, `cat`, `spin`, `key`, `click`).
 * `length` is where the GIF ends and loops; leave a second or so on the last
 * frame so the loop does not feel cut off.
 */
export default {
  lang: 'en',
  /** Laid out at 1280×720 and drawn at 1.5×, then scaled to `gifWidth`, so text stays sharp. */
  width: 1280,
  height: 720,
  scale: 1.5,
  /** 25 fps: a GIF counts in hundredths of a second, and 4/100 is exact. */
  fps: 25,
  gifWidth: 1280,
  outputDir: 'video/out/gifs',
  catBy: 'Momo',
  /** The cat the live slide shows. Leave it out for a random one from thecatapi.com. */
  pinnedCat: { id: 'MTg2NTExMw', url: 'https://s3.us-west-2.amazonaws.com/cdn2.thecatapi.com/images/MTg2NTExMw.jpg' },
  css: `
    .debug, .teleprompter { display: none !important; }
    #nuxt-devtools-container, #nuxt-devtools-anchor, vite-error-overlay { display: none !important; }
  `,

  gifs: {
    // Everyday decisions land one by one, then all of them turn over into the
    // same if / then / else pattern.
    everyday: {
      length: 13.5,
      shots: [
        { at: 0, slide: 'PRE-0208' },
        { at: 1.8, slide: 'PRE-0215' },
        { at: 3.4, slide: 'PRE-0216' },
        { at: 5, slide: 'PRE-0217' },
        { at: 6.6, slide: 'PRE-0218' },
        { at: 8.2, slide: 'PRE-0219' },
        { at: 10, slide: 'PRE-0209' },
      ],
    },

    // Momo's door: the story plays out both ways, becomes pseudo-code, then Python.
    door: {
      length: 12,
      shots: [
        { at: 0, slide: 'PRE-0034' },
        { at: 1.8, slide: 'PRE-0035' },
        { at: 6.4, slide: 'PRE-0036' },
        { at: 8.4, slide: 'PRE-0037' },
      ],
    },

    // Why loops: comparing every fish with every other gets out of hand, so Momo
    // walks the basket once instead.
    loops: {
      length: 13,
      shots: [
        { at: 0, slide: 'PRE-0067' },
        { at: 3.6, slide: 'PRE-0068' },
        { at: 6.4, slide: 'PRE-0072' },
      ],
    },

    // A real request: requests.get goes out, and a real cat comes back.
    cat: {
      length: 10,
      shots: [
        { at: 0, slide: 'PRE-0133' },
        { at: 3.6, slide: 'PRE-0135' },
        { at: 4.2, cat: true, catAfter: 0.8 },
      ],
    },

    // Twenty bars, sorted for real: bubble sort, then quick sort.
    sorting: {
      length: 14.5,
      shots: [
        { at: 0, slide: 'PRE-0182', speed: 2.6 },
        { at: 7.4, slide: 'PRE-0207', speed: 3 },
      ],
    },
  },
}
