const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const config = require('../config');
const store = require('../features/birthday/store');

// 2024 is a leap year, so 29-02 is accepted.
function isValidDayMonth(date) {
    const match = /^(\d{2})-(\d{2})$/.exec(date);
    if (!match) return false;
    const day = Number(match[1]);
    const month = Number(match[2]);
    if (month < 1 || month > 12) return false;
    return day >= 1 && day <= new Date(2024, month, 0).getDate();
}

async function addBirthday(interaction, user) {
    const date = interaction.options.getString('date');
    if (!isValidDayMonth(date)) {
        await interaction.reply({ content: 'Format tanggal harus DD-MM yang valid (contoh: 25-12)', flags: MessageFlags.Ephemeral });
        return;
    }

    store.set(user.id, date);
    await interaction.reply({ content: `Berhasil menambahkan ulang tahun ${user} pada tanggal ${date}!`, flags: MessageFlags.Ephemeral });
}

async function checkBirthday(interaction, user) {
    const birthday = store.get(user.id);
    const content = birthday
        ? `Ulang tahun ${user} adalah pada tanggal ${birthday}`
        : `Belum ada data ulang tahun untuk ${user}`;
    await interaction.reply({ content, flags: MessageFlags.Ephemeral });
}

async function listBirthdays(interaction) {
    const list = Object.entries(store.getAll())
        .map(([userId, date]) => `<@${userId}>: ${date}`)
        .join('\n');

    const embed = new EmbedBuilder()
        .setTitle('🎂 Daftar Ulang Tahun')
        .setDescription(list || 'Belum ada data ulang tahun')
        .setColor(config.colors.birthday);

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
}

module.exports = {
    enabled: config.features.birthday,

    data: new SlashCommandBuilder()
        .setName('birthday')
        .setDescription('ayo ultah ultah ultah!')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Tambah/update ulang tahun')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('User yang ultah')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('date')
                        .setDescription('Tanggal ulang tahun (DD-MM)')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('check')
                .setDescription('Cek tanggal ulang tahun')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('User yang ingin dicek')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('Lihat daftar ulang tahun')),

    async execute(interaction) {
        const user = interaction.options.getUser('user') ?? interaction.user;

        switch (interaction.options.getSubcommand()) {
            case 'add': return addBirthday(interaction, user);
            case 'check': return checkBirthday(interaction, user);
            case 'list': return listBirthdays(interaction);
        }
    },
};
