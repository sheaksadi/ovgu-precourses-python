/**
 * The showcase video: which slide is on screen on which bar of the song.
 * Rendered by `npm run render:video` (see `scripts/render-video.mjs`).
 *
 * Bad Apple!! runs at 136 BPM, so one bar is 1.765 s and an eight-bar phrase
 * 14.1 s. The first beat is at 4.551 s; bar 0 starts there, and everything
 * before it is the quiet intro. Where the song changes:
 *
 *   0:00  quiet intro            title, about me, the spin
 *   0:18  bar 8,  builds         everyday decisions, Momo's door
 *   0:35  bar 17, full           the lessons, one scene every two bars
 *   1:28  bar 47, quieter break  the click-through demos
 *   1:54  bar 62, full again     functions, libraries, the live cat, objects
 *   2:35  bar 85                 sorting, fast, then the goodbye
 *
 * A shot is one of:
 *
 *   { bar, slide }               go to the slide on that bar (or `at` in seconds)
 *   speed: 2                     play the slide twice as fast until the next shot
 *   spin: 3                      play the icebreaker spin, landing on question 3
 *   cat: true                    the room asks for a cat; a real one arrives
 *   key: 'Enter' / click: 'sel'  press a key or click something on the slide
 *
 * Change a bar or a slide here and render again; nothing else needs touching.
 */
export default {
  music: 'video/music/bad-apple.mp3',
  bpm: 135.99,
  firstBeat: 4.551,
  beatsPerBar: 4,
  /** Where the video ends, faded out over `fadeOut` seconds. */
  endBar: 96,
  fadeIn: 0.6,
  fadeOut: 3,

  lang: 'en',
  /** 1280×720 laid out, drawn at 2× : a 2560×1440 video of the laptop-sized deck. */
  width: 1280,
  height: 720,
  scale: 2,
  fps: 60,
  output: 'video/out/showcase.mp4',
  previewOutput: 'video/out/showcase-preview.mp4',

  /** Who spun and who asked for the cat, as the slides show it. */
  spinBy: { audienceId: 'video', name: 'Momo' },
  catBy: 'Momo',

  /** Anything on the page that belongs to a live room rather than to the video. */
  css: `
    .debug, .teleprompter { display: none !important; }
    /* Nuxt DevTools, when the deck runs with npm run dev. */
    #nuxt-devtools-container, #nuxt-devtools-anchor, vite-error-overlay { display: none !important; }
  `,

  shots: [
    // Intro: quiet.
    { at: 0, slide: 'PRE-0033' },
    { bar: 2, slide: 'PRE-0185' },
    { bar: 5, slide: 'PRE-0038' },
    { bar: 5.5, spin: 2 },

    // It builds: decisions everybody makes, then Momo's door.
    { bar: 8, slide: 'PRE-0208' },
    { bar: 10, slide: 'PRE-0215' },
    { bar: 12, slide: 'PRE-0219' },
    { bar: 14, slide: 'PRE-0209' },
    { bar: 16, slide: 'PRE-0035' },
    { bar: 19, slide: 'PRE-0037' },

    // Full: the lessons, one scene every two bars.
    { bar: 21, slide: 'PRE-0187' },
    { bar: 23, slide: 'PRE-0044' },
    { bar: 25, slide: 'PRE-0190' },
    { bar: 27, slide: 'PRE-0222' },
    { bar: 29, slide: 'PRE-0060' },
    { bar: 31, slide: 'PRE-0196', speed: 2 },
    { bar: 33, slide: 'PRE-0067' },
    { bar: 35, slide: 'PRE-0068' },
    { bar: 37, slide: 'PRE-0072' },
    { bar: 40, slide: 'PRE-0083', speed: 1.5 },
    { bar: 42, slide: 'PRE-0086' },
    { bar: 44, slide: 'PRE-0092' },
    { bar: 46, slide: 'PRE-0093' },

    // The break: the click-through demos, sped up.
    { bar: 48, slide: 'PRE-0048', speed: 2 },
    { bar: 53, slide: 'PRE-0053', speed: 2.5 },
    { bar: 58, slide: 'PRE-0150', speed: 1.8 },

    // Full again.
    { bar: 62, slide: 'PRE-0098', speed: 1.25 },
    { bar: 64, slide: 'PRE-0100' },
    { bar: 66, slide: 'PRE-0101' },
    { bar: 68, slide: 'PRE-0104' },
    { bar: 70, slide: 'PRE-0107', speed: 1.5 },
    { bar: 72, slide: 'PRE-0128' },
    { bar: 74, slide: 'PRE-0130' },
    { bar: 76, slide: 'PRE-0131' },
    { bar: 78, slide: 'PRE-0133' },
    { bar: 80, slide: 'PRE-0135' },
    { bar: 80.5, cat: true },
    { bar: 83, slide: 'PRE-0172' },

    // Sorting, all of it in a few seconds each.
    { bar: 85, slide: 'PRE-0182', speed: 5.5 },
    { bar: 87, slide: 'PRE-0206', speed: 7 },
    { bar: 89, slide: 'PRE-0207', speed: 4 },
    { bar: 91, slide: 'PRE-0164', speed: 1.5 },

    // Goodbye.
    { bar: 93, slide: 'PRE-0181' },
  ],
}
