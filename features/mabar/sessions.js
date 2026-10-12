const config = require('../../config');
const logger = require('../../utils/logger');
const { buildClosedMessage } = require('./view');

// Sessions live in memory, keyed by the id of the message that carries the buttons.
// They are lost on restart; buttons on such stale messages are cleaned up when clicked.
const sessions = new Map();

function create({ game, hostId, guildId, voiceChannelId, slot }) {
    return {
        game,
        hostId,
        guildId,
        voiceChannelId,
        slot,
        joined: new Set([hostId]),
        skipped: new Set(),
        expiresAt: Date.now() + config.mabar.sessionMinutes * 60_000,
    };
}

// Registers a session once its message exists, and schedules it to close itself.
function start(session, message) {
    session.message = message;
    session.timer = setTimeout(() => expire(session), session.expiresAt - Date.now());
    session.timer.unref();
    sessions.set(message.id, session);
}

// Stops tracking a session: further clicks on its message are treated as ended.
function close(session) {
    clearTimeout(session.timer);
    sessions.delete(session.message.id);
}

async function expire(session) {
    close(session);
    try {
        await session.message.edit(buildClosedMessage(session, 'expired'));
    } catch (error) {
        logger.warn('MABAR', `Could not close session ${session.message.id}:`, error.message);
    }
}

function get(messageId) {
    return sessions.get(messageId);
}

const isFull = session => Boolean(session.slot) && session.joined.size >= session.slot;

// Returns { status: 'joined' | 'already' | 'full', becameFull }.
function join(session, userId) {
    if (session.joined.has(userId)) {
        return { status: 'already', becameFull: false };
    }
    if (isFull(session)) {
        return { status: 'full', becameFull: false };
    }

    session.skipped.delete(userId);
    session.joined.add(userId);
    return { status: 'joined', becameFull: isFull(session) };
}

function skip(session, userId) {
    session.joined.delete(userId);
    session.skipped.add(userId);
}

module.exports = { create, start, close, expire, get, join, skip };
