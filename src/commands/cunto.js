const { EmbedBuilder } = require('discord.js');
const db = require('../../database');

module.exports = {
    name: 'cunto',
    description: 'Cun cunto si aad u kordhiso tamartaada (Energy)',
    execute(message) {
        db.get(`SELECT * FROM users WHERE user_id = ?`, [message.author.id], (err, row) => {
            if (!row) return message.channel.send("Fadlan marka hore isticmaal `!aniga` si aad u diiwaan gashato.");

            db.run(`UPDATE users SET energy = 100 WHERE user_id = ?`, [message.author.id]);

            const embed = new EmbedBuilder()
                .setTitle("🍽️ SOMALIARENA - MAQAAYAD")
                .setColor(0x4189DD)
                .setDescription(`🍲 Waad cuntey! Tamartaadu (Energy) waxay ku noqotay **100%** oo buuxda. Hadda waad dagaalami kartaa!`)
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        });
    }
};
