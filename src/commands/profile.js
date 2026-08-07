const { EmbedBuilder } = require('discord.js');
const db = require('../../database');

module.exports = {
    name: 'aniga',
    description: 'Eeg profile-kaaga iyo hantidaada',
    execute(message) {
        db.get(`SELECT * FROM users WHERE user_id = ?`, [message.author.id], (err, row) => {
            if (!row) {
                db.run(`INSERT INTO users (user_id, username) VALUES (?, ?)`, [message.author.id, message.author.username]);
                row = { wallet: 1000, bank: 0, level: 1, xp: 0, hp: 100, energy: 100 };
            }

            const embed = new EmbedBuilder()
                .setTitle(`🛡️ Kaarka Ciyaaryahanka: ${message.author.username}`)
                .setColor(0x4189DD)
                .addFields(
                    { name: '💰 Wallet', value: `${row.wallet} Coins`, inline: true },
                    { name: '🏦 Bank', value: `${row.bank} Coins`, inline: true },
                    { name: '⚡ Level', value: `${row.level} (XP: ${row.xp}/100)`, inline: true },
                    { name: '❤️ HP', value: `${row.hp}%`, inline: true },
                    { name: '🔋 Energy', value: `${row.energy}%`, inline: true }
                )
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        });
    }
};
