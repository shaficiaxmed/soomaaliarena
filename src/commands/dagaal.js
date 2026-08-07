const { EmbedBuilder } = require('discord.js');
const db = require('../../database');

module.exports = {
    name: 'dirir',
    description: 'Bilow dagaal fool-ka-fool ah',
    execute(message, args) {
        const target = message.mentions.users.first();
        if (!target) return message.channel.send("❌ Fadlan sheeg qofka aad la dagaalamayso (`!dirir @user`).");

        db.get(`SELECT * FROM users WHERE user_id = ?`, [message.author.id], (err, row) => {
            if (!row) return message.channel.send("Fadlan is diiwaan geli marka hore.");

            if (row.energy < 15) {
                return message.channel.send("⚠️ Tamartaadu waa ka hooseysaa **15**! Waa inaad wax cuntaa adoo adeegsanaya `!cunto` inta aadan dagaalin.");
            }

            const embed = new EmbedBuilder()
                .setTitle("⚔️ SOMALIARENA - DAGAAL")
                .setColor(0x4189DD)
                .setDescription(`🔥 ${message.author.username} ayaa dagaal la bilaabay ${target.username}!`)
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        });
    }
};
