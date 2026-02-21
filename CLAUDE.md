# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PuzzleFuzz is a multiplayer word association game (similar to Codenames) built with React and hosted on Vercel. Players guess words based on AI-generated clues from Google's Gemini API.

**Tech Stack:** React 18 + Firebase Firestore + Vite + Vercel Serverless Functions + Gemini 1.5 Flash

## Commands

```bash
bun run dev       # Development server (http://localhost:3000)
bun run dev:api   # API server for local development (http://localhost:3002)
bun run build     # Production build to /build
bun run preview   # Preview production build locally
```

## Architecture

```
React SPA (Vite)
    │
    ├── Firestore (real-time game state sync)
    │   └── Collection: game-lobbies
    │       └── Doc fields: LobbyCode, words[], currentTurn, pinkLeft, greenLeft, gameOver
    │
    └── Vercel Serverless (/api/gemini-test.js)
        └── Gemini 1.5 Flash (clue generation)
```

**Key Data Flow:**
- `Welcome.js` creates/joins lobbies using 6-char codes from `nanoid`
- `Game.js` fetches 20 words from `/public/words.txt`, assigns colors (8 pink, 7 green, 4 neutral, 1 bomb)
- `ClueGiver.js` watches Firestore with `onSnapshot`, calls `/api/gemini-test` for AI clues
- Game state syncs via Firestore for multiplayer

**Component Structure:**
- `App.js` - Router (/, /:lobbyCode)
- `Game.js` - Core game logic and state
- `Board.js` → `WordBox.js` - Word grid display
- `ScoreTracker.js` - Turn/score display
- `ClueGiver.js` - AI clue integration

## Key Files

| File | Purpose |
|------|---------|
| `src/components/Game.jsx` | Core game logic, word fetching, Firestore updates |
| `src/components/ClueGiver.jsx` | Real-time listener, AI clue requests/display |
| `src/firebase.js` | Firebase initialization |
| `api/gemini-test.js` | Serverless endpoint for secure Gemini API calls |
| `public/words.txt` | Word list (newline-separated) |

## Game Rules (for context)

- Clicking correct team color: continue turn
- Clicking neutral: end turn
- Clicking bomb: instant loss for clicking team
- Game ends when either team has 0 words remaining

## Deployment

GitHub Actions auto-deploys on push to `main` (Vercel). PRs get preview deployments.
