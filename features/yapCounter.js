const { EmbedBuilder } = require('discord.js');
const config = require('../config');
const logger = require('../utils/logger');
const { ShuffleBag } = require('../utils/random');
const yapWarnings = require('../data/yapWarnings');

const warningBag = new ShuffleBag(yapWarnings);
let messageCount = 0;

// Embed titles don't render mentions, so titles get the plain name.
function buildWarningEmbed(message) {
    const warning = warningBag.next();
    const name = message.member?.displayName ?? message.author.displayName;
    const mention = `${message.author}`;

    const embed = new EmbedBuilder()
        .setTitle(warning.title.replaceAll('{user}', name))
        .setDescription(warning.description.replaceAll('{user}', mention))
        .setColor(warning.color);

    if (warning.footer) {
        embed.setFooter({ text: warning.footer });
    }
    return embed;
}

async function handleMessage(message) {
    if (message.author.id !== config.yapCounter.targetUserId) return;

    messageCount += 1;
    if (messageCount < config.yapCounter.threshold) return;
    messageCount = 0;

    await message.channel.send({ embeds: [buildWarningEmbed(message)] });
    logger.info('YAP', `Sent yap warning to ${message.author.tag}`);
}

module.exports = { handleMessage };
