# Kettlebell Focus PWA

Static offline workout timer for Mark's kettlebell sessions.

## Features

- Runs from GitHub Pages with no backend.
- Installable PWA; service worker caches the app for offline use.
- Generates one of Mark's current kettlebell programs, avoiding recent local choices.
- Focus mode with 45s work blocks, 15s transitions, and 60s round rests.
- Attempts to keep the screen awake via the Wake Lock API.
- Optional voice guidance using browser text-to-speech.
- Records tap/timer timings and produces a copyable workout summary.
- Pause freezes the exercise countdown while elapsed session time keeps running, so summaries include pauses.

## Deployment

This folder is intended to be served by GitHub Pages from `docs/`.
The app path is `/kettlebell/` relative to the Pages site root.

No secrets, accounts, or backend calls are used.

## Updates

- Focus mode displays cropped local exercise illustrations from `assets/`.
- Work intervals stop at 0 and wait for a manual Next/Start rest click.
- Rest and transition intervals still auto-advance to the next exercise.
