const { EmbedBuilder } = require('discord.js');
const db = require('../../database');

module.exports = {
    name: 'boorso',
    description: 'Eeg agabka iyo hubka aad haysato',
    execute(message) {
        db.get(`SELECT shield_expiry FROM users WHERE user_id = ?`, [message.author.id], (err, row) => {
            if (!row) return message.channel.send("Fadlan marka hore is diiwaan geli adoo isticmaalaya `!aniga`.");

            const hasShield = row.shield_expiry && new Date(row.shield_expiry) > new Date();
            const shieldStatus = hasShield ? `✅ Waa shaqaynayaa ilaa: ${row.shield_expiry}` : `❌ Ma haysatid gaashaan shaqaynaya`;

            const embed = new EmbedBuilder()
                .setTitle(`🎒 BOORSADA CIYAARYAHANKA: ${message.author.username}`)
                .setColor(0x4189DD)
                .addFields(
                    { name: '🛡️ Shield (Gaashaan Difaaca)', value: shieldStatus, inline: false }
                )
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        });
    }
};
