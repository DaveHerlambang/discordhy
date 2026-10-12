# Versioning Spec

Applies to: Silvler Discord bot (`discordhy`).
Baseline: `1.0.0` (initial release, commit `4b94cc4`).
Audience: AI coding agents working in this repo, and the maintainer who reviews their work.

## 1. Format

`MAJOR.MINOR.PATCH`, for example `1.4.2`. Plain numbers only. No pre-release or build suffixes.

| Part | Meaning |
|---|---|
| `X.0.0` MAJOR | Fundamental change |
| `0.X.0` MINOR | New feature or addition to a feature |
| `0.0.X` PATCH | Fix or improvement that adds no new capability |

Bumping a part resets every part to its right to `0` (`1.4.2` -> minor -> `1.5.0` -> major -> `2.0.0`).
Versions only go up. Never decrement, never reuse a number.

## 2. Source of truth

- `package.json` `version` is the single source of truth. `package-lock.json` must match it.
- Git tag `vX.Y.Z` (annotated) marks the release commit.
- `CHANGELOG.md` records what each version contains.

## 3. Choosing the bump

Pick the **highest** level that applies to anything in the release. One release gets one bump.

### MAJOR: fundamental change

Use when existing users or operators must adapt, or a core foundation is replaced.

- Removing or renaming a slash command, subcommand, or option that people already use.
- Changing a stored data format in a way that needs manual migration.
- A new required environment variable, privileged gateway intent, or permission without which the bot fails to start or a core feature stops working.
- Replacing a core foundation: storage engine (for example JSON files to SQLite), or a major-version upgrade of `discord.js` that forces code changes.
- Rewriting the project architecture or the contracts between its parts (command module shape, component `customId` scheme, `config.js` shape).

### MINOR: new feature or addition

Backward compatible, and users can now do or see something new.

- A new slash command, subcommand, or option.
- A new feature module under `features/`, or new user-visible message behavior.
- Switching a shipped-but-disabled feature on (a `config.features` flag going from `false` to `true`, such as `birthday`).
- A new external integration or API.
- A meaningful behavior change to an existing feature (for example making the yap counter time-based).

### PATCH: no new capability

- Bug fixes.
- Behavior-preserving refactors and cleanup inside the existing architecture, including moving files within it.
- Wording, embed styling, and other cosmetic tweaks.
- Content-only additions to data lists: new jokes, yap warnings, or reply lines.
- Dependency updates that change no behavior, including security fixes (`npm audit fix`).
- Performance improvements.

### NO BUMP

These changes do not need a release on their own. Record them under `Unreleased` only if useful.

- Documentation, comments, `AGENTS.md`, and this spec.
- `.gitignore` and tooling configuration with no runtime effect.

### Edge cases

- **Mixed release:** highest level wins. A release with one fix and one new command is a minor.
- **Revert:** a revert of released work is a new PATCH, not a rollback of the number. If the revert removes a released feature, use the level that removing it would normally need.
- **Unsure between two levels:** ask the maintainer. Do not guess downward.
- **Feature added but left disabled:** PATCH at most. It becomes MINOR when the flag is switched on.

### Examples from this project

| Change | Bump |
|---|---|
| Add the yap counter feature | MINOR |
| Add 10 more yap warning styles | PATCH |
| Fix streaming platform always showing a placeholder | PATCH |
| Make `/jokes` stop repeating until all jokes are used | PATCH |
| Add a `/remind` command | MINOR |
| Re-enable birthday reminders | MINOR |
| Rename `/movie` to `/film` | MAJOR |
| Move storage from JSON files to SQLite | MAJOR |
| Upgrade `discord.js` from v14 to v15 with code changes | MAJOR |
| Update AGENTS.md or docs/ | NO BUMP |

## 4. Release unit

Bump per **release**, not per commit. This avoids version inflation.

1. While working, add each change to `## [Unreleased]` in `CHANGELOG.md` under the right heading.
2. When the maintainer decides to release, choose the bump from everything under `Unreleased` (section 3).
3. Rename `Unreleased` to the new version and date, then start a fresh empty `Unreleased`.

## 5. Changelog format

`CHANGELOG.md` at the repo root, newest first, based on Keep a Changelog.

```markdown
# Changelog

## [Unreleased]

## [1.1.0] - 2026-11-02
### Added
- /remind command to schedule reminders

### Changed
- Yap counter now counts messages sent within a time window

### Fixed
- Streaming platforms showing the wrong service

### Removed
### Security
```

- Allowed headings: `Added`, `Changed`, `Fixed`, `Removed`, `Security`. Omit empty ones in real entries.
- Write for people using the bot. English, no file paths, no "modified/added/deleted file" wording.
- If slash command definitions changed, add the line `Run "npm run deploy" to register command changes.` to that version.
- If operators must act (new env variable, data migration), say so first under that version.

## 6. Procedure for agents

Follow in order when asked to release or "bump the version".

1. List the changes since the last tag: `git log vLAST..HEAD` (or the whole history if no tag exists yet).
2. Decide the bump using section 3. State the level and the one-line reason, for example: `Proposed 1.2.0 (minor): adds /remind.`
3. Wait for the maintainer to confirm the version unless they already named it.
4. Set the version without letting npm tag or commit: `npm version X.Y.Z --no-git-tag-version`. This updates both `package.json` and `package-lock.json`.
5. Update `CHANGELOG.md` (section 4).
6. Commit with the message `Release vX.Y.Z` plus a short body summarizing features, changes, and improvements (see `AGENTS.md` commit style).
7. Tag the commit: `git tag -a vX.Y.Z -m "vX.Y.Z"`.
8. Stop. **Do not push commits or tags** unless the maintainer asks.

## 7. Open decisions

Defaults above are the maintainer's rules (x.0.0 / 0.x.0 / 0.0.x) plus these judgment calls. Change them here if the maintainer disagrees, so agents stay consistent.

- Content-only additions (jokes, warnings, replies) are PATCH, not MINOR.
- Switching a disabled feature on is MINOR.
- Removing or renaming a slash command is MAJOR even though it is small.
- Docs-only changes do not bump the version.
