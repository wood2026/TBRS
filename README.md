# Thy Brain Rotteth Surely

**[Play Thy Brain Rotteth Surely in your browser](https://wood2026.github.io/TBRS/)**

*An ENGL 1030 multimodal adaptation project at Clemson University and a browser strategy game built with TypeScript and Phaser AE.*

## Overview

Adapted from Josh Wood’s inquiry essay of the same name, *Thy Brain Rotteth Surely* turns a debate about “brain rot” into a battle. The Brain and the Inner Voice argue about attention and digital distraction while the player recruits defenders to keep waves of distractions from overwhelming the Brain.

## Gameplay

- **Recruit defenders in real time.** Spend Focus during battle to recruit Reading, Exercise, Sleep, Social Connection, and Mindfulness as they become available. Defenders fight automatically, so timing and team composition shape each attempt.
- **Build between attempts.** Earn Insight in combat and spend it on permanent upgrades. Campaign progress and upgrades are saved in the browser.
- **Play through five story rounds.** Each round has four waves. Dialogue unfolds around battles, and endless play continues after the story ending.
- **Inspect the battlefield.** Click a defender to see its stats and press **P** or **Esc** to pause.

## Educational purpose

The adaptation carries the essay’s inquiry into dialogue, visual design, music, and player decisions. Choosing when to spend Focus gives players a concrete example of planning with limited resources. The exchanges between the Brain and the Inner Voice invite players to examine what research on executive function and everyday habits can support, including where reported trends leave the causes open.

The defender abilities and upgrade effects are fictional gameplay mechanics. The project makes no claim that playing improves cognition. Open **References & Credits** from the title screen to browse the works cited, reread the dialogue, and find the CC0 background music credit. Source buttons in the dialogue provide context for individual claims.

## Technology stack

- **TypeScript and Phaser AE v3** power the browser game. The Phaser AE bakery composes the engine from the game manifest and bundles the production build.
- **Node.js and npm** run the development commands. The combat tests use Node’s test runner with the TypeScript loader supplied by the Phaser AE installation.
- **GitHub Actions and GitHub Pages** build and host the static game.

The app lives in [`thy-brain-rotteth-surely/`](thy-brain-rotteth-surely/). The [game source](thy-brain-rotteth-surely/game/) contains the scenes, battle simulation, progression, and dialogue. The [test suite](thy-brain-rotteth-surely/tests/) covers combat and campaign behavior.

## Local development

Use Node.js 24 and npm to match CI. From the repository root, enter the game directory.

```sh
cd thy-brain-rotteth-surely
```

For a fresh checkout, set `PHASER_AE_TOKEN` in your shell environment to a Phaser AE token with access to download the engine and packs. Then run the same dependency setup used by CI.

```sh
npm install --prefix .phaser/ci --no-audit --no-fund @phaser-ae/cli@0.8.0
node scripts/install-pages-dependencies.mjs
```

The installer populates the local Phaser AE engine and packs and checks their versions against [the manifest lockfile](thy-brain-rotteth-surely/game/manifest.lock.json). If the engine and packs are already installed, start with the commands below.

| Command | Purpose |
| --- | --- |
| `npm run serve` | Serve the game at [localhost:4173](http://localhost:4173) and rebuild as files change. |
| `npm run build` | Build the static game into `dist/` inside the game directory. |
| `npm run typecheck` | Run the game’s TypeScript checks. |
| `npm test` | Run the automated combat and progression tests. |

The [GitHub Pages workflow](.github/workflows/deploy.yml) runs on pushes to `main`. It uses the repository’s `PHASER_AE_TOKEN` Actions secret to install the engine and packs, builds the game, and deploys the resulting `dist/` directory.

## AI-use disclosure

OpenAI Codex reviewed the repository and drafted this README. The repository also documents an AI-assisted Phaser AE workflow for development and asset creation. It does not provide an itemized record of AI contributions to the game code, art, or dialogue. The original inquiry essay is credited in-game to Josh Wood.
