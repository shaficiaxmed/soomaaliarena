const { EmbedBuilder } = require('discord.js');
const db = require('../../database');

module.exports = {
    name: 'boorso',
    description: 'Eeg agabka iyo hubka aad haysato',
    execute(message) {
        db.get(`SELECT * FROM users WHERE user_id = ?`, [message.author.id], (err, row) => {
            if (err) {
                const errEmbed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setDescription("❌ Cilad ayaa dhacday, fadlan dib u sooco.");
                return message.channel.send({ embeds: [errEmbed] });
            }

            // Haddii uusan isticmaalahu jirin, si toos ah ayaanu u diiwaan gelineynaa
            if (!row) {
                db.run(`INSERT INTO users (user_id) VALUES (?)`, [message.author.id], (err) => {
                    if (err) {
                        const failEmbed = new EmbedBuilder()
                            .setColor(0xFF0000)
                            .setDescription("❌ Cilad ayaa dhacday markii la diiwaan gelinayay.");
                        return message.channel.send({ embeds: [failEmbed] });
                    }

                    // Muuji boorsada oo madhan marka la diiwaan geliyo
                    const emptyEmbed = new EmbedBuilder()
                        .setTitle(`🎒 BOORSADA CIYAARYAHANKA: ${message.author.username}`)
                        .setColor(0x4189DD)
                        .addFields(
                            { name: '🛡️ Shield (Gaashaan Difaaca)', value: '❌ Ma haysatid gaashaan shaqaynaya', inline: false }
                        )
                        .setTimestamp();

                    return message.channel.send({ embeds: [emptyEmbed] });
                });
                return;
            }

            // Haddii uu horay u diiwaan gashanaa
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
