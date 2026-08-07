const { EmbedBuilder } = require('discord.js');
const db = require('../../database');

module.exports = {
    name: 'gunno',
    description: 'Qaado gunnadaada maalinlaha ah',
    execute(message) {
        db.get(`SELECT * FROM users WHERE user_id = ?`, [message.author.id], (err, row) => {
            if (!row) return message.channel.send("Fadlan marka hore isticmaal `!aniga` si aad u diiwaan gashato.");

            const bonus = 500;
            db.run(`UPDATE users SET wallet = wallet + ? WHERE user_id = ?`, [bonus, message.author.id]);

            const embed = new EmbedBuilder()
                .setTitle("🎁 SOMALIARENA - GUNNO MAALINLAHE")
                .setColor(0x4189DD)
                .setDescription(`🎉 Hambalyo! Waxaad qaadatay gunnadaada maalinlaha ah oo ah **${bonus} Coins**!`)
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        });
    }
};
