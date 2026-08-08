const { EmbedBuilder } = require('discord.js');
const db = require('../../database');

module.exports = {
    name: 'sameebank',
    description: 'Fur account bank ah (Wuxuu u baahan yahay Level 5+)',
    execute(message, args) {
        db.get(`SELECT * FROM users WHERE user_id = ?`, [message.author.id], (err, row) => {
            if (err) {
                const errEmbed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setDescription("❌ Cilad ayaa dhacday, fadlan dib u sooco.");
                return message.channel.send({ embeds: [errEmbed] });
            }

            // 1. Hubinta inuu diiwaan gashan yahay iyo inuu gaaray Level 5
            if (!row || row.level < 5) {
                const currentLevel = row ? (row.level || 0) : 0;
                const levelEmbed = new EmbedBuilder()
                    .setColor(0xFF4444)
                    .setTitle("❌ Waa la diiday")
                    .setDescription(`Waa inaad gaartaa **Level 5** si aad u furato account bank ah!\n\n• **Level-kaaga hadda:** ${currentLevel}`);
                return message.channel.send({ embeds: [levelEmbed] });
            }

            // 2. Hubi haddii uu horay u lahaa bank (bank_account = 1)
            if (row.bank_account === 1) {
                const existEmbed = new EmbedBuilder()
                    .setColor(0xFFA500)
                    .setTitle("⚠️ Digniin")
                    .setDescription("Horay ayaad u leedahay account bank ah! Waxaad isticmaali kartaa `!bank` ama `!bangi`.");
                return message.channel.send({ embeds: [existEmbed] });
            }

            // 3. Furidda account-ka bankiga
            db.run(`UPDATE users SET bank_account = 1 WHERE user_id = ?`, [message.author.id], (err) => {
                if (err) {
                    const failEmbed = new EmbedBuilder()
                        .setColor(0xFF0000)
                        .setDescription("❌ Cilad ayaa dhacday markii la furayay bankiga.");
                    return message.channel.send({ embeds: [failEmbed] });
                }

                const successEmbed = new EmbedBuilder()
                    .setColor(0x00FF00)
                    .setTitle("🎉 SomaliArena - Bank Account")
                    .setDescription(`Hambalyo **${message.author.username}**! Si guul leh ayaad u furtay account bank ah.\n\nHadda waxaad isticmaali kartaa \`!bank\` ama \`!bangi\`.`)
                    .setTimestamp();

                return message.channel.send({ embeds: [successEmbed] });
            });
        });
    }
};
