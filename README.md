# SpeedLab

**Precision CPS, typing & reaction testing — in one place.**

SpeedLab measures three kinds of speed: clicks per second, typing speed, and reaction time. Every mode records your history and personal bests, and typing mode adds a ghost race — your previous best runs against your current attempt.

## Live App

**[speedtaps.netlify.app](https://speedtaps.netlify.app/)** — installable as a PWA.

## Features

- **CPS sprints** — 5s to 60s click-rate tests
- **Typing modes** — time, words, quote and endurance runs, with WPM and accuracy
- **Reaction time** — 5 or 10 rounds, with average and best
- **Ghost racing** — typing mode races your current attempt against your previous best
- **Personal bests & history** — every result is kept on your device
- **Offline PWA** — installable, works with no connection, needs no account
- **Themes & sound** — dark, light and gray themes; optional sound effects

## Tech Stack

| Layer | Choice |
| --- | --- |
| Language | Vanilla JavaScript |
| PWA | Manifest + service worker |
| Hosting | Netlify |

## Running locally

```bash
# Requires only a static file server
npx serve .
```

Then open `http://localhost:5000`.

## Privacy

All results, bests and settings are stored in `localStorage` on your device. No account, no analytics, no server-side storage.