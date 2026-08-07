const { EmbedBuilder } = require('discord.js');
const db = require('../../database');

module.exports = {
    name: 'taajir',
    description: 'Eeg liiska 10-ka qof ee ugu hantida badan server-ka',
    execute(message) {
        db.all(`SELECT username, (wallet + bank) as total FROM users ORDER BY total DESC LIMIT 10`, [], (err, rows) => {
            if (err || !rows.length) return message.channel.send("❌ Wali xog taajiriin ah lama helin.");

            let desc = "";
            rows.forEach((r, index) => {
                const medals = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
                desc += `${medals[index] || '👤'} **${r.username}** — **${r.total} Coins**\n`;
            });

            const embed = new EmbedBuilder()
                .setTitle("🏆 SOMALIARENA - 10-KA HOGAAMIYAHA EE SARE")
                .setColor(0x4189DD)
                .setDescription(desc)
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        });
    }
};
