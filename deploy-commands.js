const { REST, Routes } = require('discord.js');
const config = require('./config');
const { loadCommands } = require('./utils/loadCommands');

const commands = [...loadCommands().values()].map(command => command.data.toJSON());
const rest = new REST({ version: '10' }).setToken(config.discord.token);

(async () => {
    try {
        console.log(`Registering ${commands.length} slash commands...`);
        const registered = await rest.put(Routes.applicationCommands(config.discord.clientId), { body: commands });
        console.log(`Successfully registered ${registered.length} commands!`);
        registered.forEach(command => console.log(` - /${command.name}`));
    } catch (error) {
        console.error('Failed to register commands:', error);
        process.exitCode = 1;
    }
})();
