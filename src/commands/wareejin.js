const { EmbedBuilder } = require('discord.js');
const db = require('../../database');

module.exports = {
    name: 'wareejin',
    description: 'Wareeji wheel-ka nasiibka si aad u hesho abaalmarin',
    execute(message) {
        db.get(`SELECT wallet FROM users WHERE user_id = ?`, [message.author.id], (err, row) => {
            if (!row) return message.channel.send("Fadlan marka hore is diiwaan geli.");

            const rewards = [100, 250, 500, 1000, 2000, 5000];
            const prize = rewards[Math.floor(Math.random() * rewards.length)];

            db.run(`UPDATE users SET wallet = wallet + ? WHERE user_id = ?`, [prize, message.author.id]);

            const embed = new EmbedBuilder()
                .setTitle("🎡 SOMALIARENA - LUCK WHEEL")
                .setColor(0x4189DD)
                .setDescription(`🎡 Wheel-ku wuu wareegay oo wuxuu ku joogsaday **${prize} Coins**!\n✅ Si guul leh ayaa loogu daray wallet-kaaga.`)
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        });
    }
};
