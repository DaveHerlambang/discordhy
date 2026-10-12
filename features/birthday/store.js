const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, '..', '..', 'data', 'birthdays.json');

let birthdays = null;

function load() {
    if (!fs.existsSync(FILE_PATH)) return {};
    // Let parse errors throw: returning {} here would let the next save wipe every stored birthday.
    return JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));
}

function data() {
    birthdays ??= load();
    return birthdays;
}

function save() {
    const tempPath = `${FILE_PATH}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(birthdays, null, 2));
    fs.renameSync(tempPath, FILE_PATH);
}

function set(userId, date) {
    data()[userId] = date;
    save();
}

function get(userId) {
    return data()[userId];
}

function getAll() {
    return { ...data() };
}

function getUserIdsOn(date) {
    return Object.entries(data())
        .filter(([, birthday]) => birthday === date)
        .map(([userId]) => userId);
}

module.exports = { set, get, getAll, getUserIdsOn };
