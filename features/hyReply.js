const config = require('../config');
const logger = require('../utils/logger');
const { ShuffleBag } = require('../utils/random');
const replyMessages = require('../data/replyMessages');

const replyBag = new ShuffleBag(replyMessages);

async function handleMessage(message) {
    if (!message.content.toLowerCase().includes('hy')) return;

    if (message.author.id === config.hyReply.targetUserId) {
        const reply = replyBag.next();
        await message.reply(reply);
        logger.info('HY', `Replied to ${message.author.tag} with: ${reply}`);
        return;
    }

    await message.reply({ content: config.hyReply.strangerReply, files: [config.hyReply.strangerGif] });
    logger.info('HY', `Replied to stranger ${message.author.tag}`);
}

module.exports = { handleMessage };
