const { EmbedBuilder } = require('discord.js');
const db = require('../../database');

module.exports = {
    name: 'daawo',
    description: 'Tag cisbitaalka si aad u soo celiso caafimaadkaaga (HP) adoo isticmaalaya !daawo',
    execute(message) {
        db.get(`SELECT wallet, hp FROM users WHERE user_id = ?`, [message.author.id], (err, row) => {
            if (!row) return message.channel.send("Fadlan marka hore is diiwaan geli adoo isticmaalaya `!aniga`.");
            if (row.hp >= 100) return message.channel.send("💚 Caafimaadkaaga (HP) waa 100% buuxa, uma baahnid daaweyn!");

            const cost = 200; // Qiimaha daaweynta
            if (row.wallet < cost) {
                return message.channel.send(`❌ Lacagtaadu kuguma filna cisbitaalka! Waxaad u baahan tahay **${cost} Coins**.`);
            }

            db.run(`UPDATE users SET wallet = wallet - ?, hp = 100 WHERE user_id = ?`, [cost, message.author.id]);

            const embed = new EmbedBuilder()
                .setTitle("🏥 SOMALIARENA - CISBITAALKA")
                .setColor(0x4189DD)
                .setDescription(`💉 Waad is daawaysay oo caafimaadkaaga (HP) wuxuu ku noqday **100%**! Waxaa lagaa jaray **${cost} Coins**.`)
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        });
    }
};
