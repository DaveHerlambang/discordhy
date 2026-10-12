const fs = require('fs');
const path = require('path');

const COMMANDS_DIR = path.join(__dirname, '..', 'commands');

// Files prefixed with "_" are shared helpers, not commands.
// A command can opt out with `enabled: false` (driven by config.features).
function loadCommands() {
    const commands = new Map();
    const entries = fs.readdirSync(COMMANDS_DIR, { withFileTypes: true, recursive: true });

    for (const entry of entries) {
        if (!entry.isFile() || !entry.name.endsWith('.js') || entry.name.startsWith('_')) continue;

        const filePath = path.join(entry.parentPath, entry.name);
        const command = require(filePath);

        if (!command.data || typeof command.execute !== 'function') {
            throw new Error(`Command file ${filePath} must export "data" and "execute"`);
        }
        if (command.enabled === false) continue;

        commands.set(command.data.name, command);
    }

    return commands;
}

module.exports = { loadCommands };
