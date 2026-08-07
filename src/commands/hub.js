const { EmbedBuilder } = require('discord.js');
const db = require('../../database');

module.exports = {
    name: 'hub',
    description: 'Iibso ama eeg hubkaaga dagaalka',
    execute(message) {
        db.get(`SELECT wallet FROM users WHERE user_id = ?`, [message.author.id], (err, row) => {
            if (!row) return message.channel.send("Fadlan marka hore is diiwaan geli adoo isticmaalaya `!aniga`.");

            const embed = new EmbedBuilder()
                .setTitle("⚔️ SOMALIARENA - XARUNTA HUBKA")
                .setColor(0x4189DD)
                .setDescription("Halkan waxaad ka iibsan kartaa hubka culus ee dagaalka:\n\n1. **AK-47** — Qiimaha: `5,000 Coins` (`!iibso ak47`)\n2. **Bazuuke** — Qiimaha: `15,000 Coins` (`!iibso bazuuke`)")
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        });
    }
};
