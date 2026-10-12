# AGENTS.md

Guidance for AI coding agents working on Silvler, a Discord bot built with discord.js v14 on Node.js (CommonJS, Node >= 20).

## Project layout

```
config.js        All IDs, colors, timezone and feature flags. Reads secrets from .env.
index.js         Thin entry point: creates the client, loads commands and events.
commands/        Slash commands, auto-loaded (subfolders allowed).
events/          Discord event handlers (ready, messageCreate, interactionCreate), auto-loaded.
features/        Bot behavior that is not a slash command (yap counter, "hy" reply, birthday).
services/        Wrappers for external APIs (TMDB).
utils/           Shared helpers (random/ShuffleBag, logger, safeExecute, loadCommands).
data/            Static content lists and runtime data.
docs/            Specs. See docs/VERSIONING.md.
```

## Conventions

- **Commands:** export `{ data, execute }`. Optional: `handleComponent(interaction)` for buttons and select menus, `errorMessage` for the user-facing failure text, `enabled: false` to disable.
- **Helper files in `commands/`** start with `_` and are not loaded as commands.
- **Component IDs** follow `<commandName>:<step>[:<arg>]`, so `interactionCreate` can route to the right command.
- **Error handling:** do not wrap command bodies in try/catch. Throw, and `safeExecute` replies to the user.
- **Reuse:** use `ShuffleBag` for "random without repeats", and the existing factories (`createAnimalCommand`, `createMediaListCommand`) before writing near-duplicates.
- **Feature flags:** features that can be switched off live under `config.features`. Do not hardcode IDs or colors outside `config.js`.
- **Secrets:** never hardcode API keys. Add them to `.env` and `.env.example`, and read them through `config.js`. Never commit `.env` or `data/birthdays.json`.
- **Language:** code, comments, docs and commit messages are in English. Text the bot sends to users is Indonesian and informal, matching the existing tone.
- **Comments:** only where the reason is non-obvious. No comments that restate the code.

## Running and checking

```
npm start            run the bot
npm run dev          run with auto-restart
npm run deploy       register slash commands with Discord (needed after changing any command's `data`)
```

There is no test suite yet. Check syntax with `node --check <file>`, and exercise changed code with a throwaway script (use fake `interaction` or `message` objects) instead of starting the live bot, which would run alongside the maintainer's own instance.

## Git

- Commit only when the maintainer asks. Push only when the maintainer asks.
- Commit messages are in English. Describe features, changes, and improvements in plain language. Do not list files or say "modified/added/deleted file". Add a short `Features` and `Improvements` structure for larger commits.
- This folder is owned by a different Windows account, so plain `git` may fail with "dubious ownership". Use `git -c safe.directory=E:/Development/DiscordHy <command>` rather than changing git config.

## Versioning

The project uses `MAJOR.MINOR.PATCH` and follows `docs/VERSIONING.md`. In short:

- `X.0.0` fundamental change, `0.X.0` new feature or addition, `0.0.X` fix or improvement with no new capability.
- Highest applicable level wins, and lower parts reset to 0.
- Bump per release, not per commit. Track changes under `Unreleased` in `CHANGELOG.md`.
- Propose the bump and wait for confirmation. Never push tags unless asked.

Read `docs/VERSIONING.md` before changing a version number, `package.json` `version`, `CHANGELOG.md`, or creating a tag.
