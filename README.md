# Kettlebell Focus PWA

Static offline workout timer for Mark's kettlebell sessions.

## Features

- Runs from GitHub Pages with no backend.
- Installable PWA; service worker caches the app for offline use.
- Generates one of Mark's current kettlebell programs, avoiding recent local choices.
- Focus mode with 45s work blocks, 15s transitions, and 60s round rests.
- Attempts to keep the screen awake via the Wake Lock API.
- Records tap/timer timings and produces a copyable workout summary.

## Deployment

This folder is intended to be served by GitHub Pages from `docs/`.
The app path is `/kettlebell/` relative to the Pages site root.

No secrets, accounts, or backend calls are used.
