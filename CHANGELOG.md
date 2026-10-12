# Changelog

## [Unreleased]

## [1.1.0] - 2026-10-12
### Added
- /mabar command to invite people to play together, with Gas! and Skip buttons shown in a live-updating embed
- Pressing Gas! moves members who are already in a voice channel straight into the host's voice channel, and a Voice Channel button opens it for everyone else
- If the host is not in a voice channel, /mabar works as a simple poll that counts Gas! and Skip votes
- Optional player limit, with an announcement that pings everyone who joined once the slots are full
- Sessions close on their own after 2 hours
- The host can close a session early with the Tutup button so nobody can join anymore, while the player lists stay visible
- A short, casual hint line in the embed
- /ship command that tags two people and rates how well they match, with a love meter, an emoji and a casual verdict for each score range; the same pair always gets the same result

Run "npm run deploy" to register command changes. The bot needs the Move Members permission to move people between voice channels; without it, Gas! is still counted and the Voice Channel button is offered instead.

## [1.0.0] - 2026-10-12
### Added
- Yap counter with 19 firm-but-funny warning styles
- Movie and series recommendations, popular and top-rated lists, with streaming platforms
- Cat and dog pictures, dad jokes, and random excuses
- Birthday reminders and the "hy" auto-reply, both switched off by default
