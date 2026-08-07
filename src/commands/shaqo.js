const { EmbedBuilder } = require('discord.js');
const db = require('../../database');

module.exports = {
    name: 'shaqo',
    description: 'Ka shaqee magaalada si aad u hesho lacag',
    execute(message) {
        db.get(`SELECT * FROM users WHERE user_id = ?`, [message.author.id], (err, row) => {
            if (!row) return message.channel.send("Fadlan marka hore isticmaal `!aniga` si aad u diiwaan gashato.");

            const earned = Math.floor(Math.random() * 200) + 50; // Lacag u dhaxaysa 50 ilaa 250
            db.run(`UPDATE users SET wallet = wallet + ?, xp = xp + 10 WHERE user_id = ?`, [earned, message.author.id]);

            const embed = new EmbedBuilder()
                .setTitle("💼 SOMALIARENA - SHAQO")
                .setColor(0x4189DD)
                .setDescription(`✅ Waad shaqaysay oo waxaad soo saartay **${earned} Coins** iyo **10 XP**!`)
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        });
    }
};
