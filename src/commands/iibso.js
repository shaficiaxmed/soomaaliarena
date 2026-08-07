const { EmbedBuilder } = require('discord.js');
const db = require('../../database');

module.exports = {
    name: 'iibso',
    description: 'Ka iibso agab suuqa (tusaale: !iibso shield)',
    execute(message, args) {
        const item = args[0]?.toLowerCase();

        if (item !== 'shield') {
            return message.channel.send("❌ Agabkaas magiciisa ma jiro ama lama heli karo. Isticmaal `!suuq` si aad u eegto waxa la iibinayo.");
        }

        db.get(`SELECT wallet FROM users WHERE user_id = ?`, [message.author.id], (err, row) => {
            if (!row) return message.channel.send("Fadlan marka hore is diiwaan geli adoo isticmaalaya `!aniga`.");

            const cost = 500; // Qiimaha shield-ka oo coins ah
            if (row.wallet < cost) {
                return message.channel.send(`❌ Lacagtu kuguma filna! Shield-ku wuxuu ku kacayaa **${cost} Coins**.`);
            }

            db.run(`UPDATE users SET wallet = wallet - ?, shield_expiry = DATETIME('now', '+6 hours') WHERE user_id = ?`, [cost, message.author.id]);

            const embed = new EmbedBuilder()
                .setTitle("🛡️ SOMALIARENA - IIBSASHADIING ABAG")
                .setColor(0x4189DD)
                .setDescription(`🎉 Hambalyo! Waxaad si guul leh u iibsatay **Shield** (Gaashaan Difaaca) kaasoo shaqeynaya **6-da saacadood** ee soo socota!`)
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        });
    }
};
