const { EmbedBuilder } = require('discord.js');
const db = require('../../database');

module.exports = {
    name: 'sii',
    description: 'Lacag u wareeji ciyaaryahan kale',
    execute(message, args) {
        const target = message.mentions.users.first();
        const amount = parseInt(args[1]);

        if (!target) return message.channel.send("❌ Fadlan sheeg qofka aad lacagta u direyso (`!sii @user 500`).");
        if (target.id === message.author.id) return message.channel.send("❌ Naftaada lacag uma diri kartid!");
        if (isNaN(amount) || amount <= 0) return message.channel.send("❌ Fadlan geli tiro lacag ah oo sax ah.");

        db.get(`SELECT wallet FROM users WHERE user_id = ?`, [message.author.id], (err, sender) => {
            if (!sender || sender.wallet < amount) {
                return message.channel.send("❌ Lacagtaada wallet-ka ku jirta kuguma filna inaad wareejiso!");
            }

            // Hubi in qofka la dirayo uu diiwaan gashanyahay
            db.get(`SELECT user_id FROM users WHERE user_id = ?`, [target.id], (err, receiver) => {
                if (!receiver) return message.channel.send("❌ Qofkan aad lacagta u direyso wali lama diiwaan gelin ciyaarta.");

                // Ka jar diraha kana geli kan la siinayo
                db.run(`UPDATE users SET wallet = wallet - ? WHERE user_id = ?`, [amount, message.author.id]);
                db.run(`UPDATE users SET wallet = wallet + ? WHERE user_id = ?`, [amount, target.id]);

                const embed = new EmbedBuilder()
                    .setTitle("💸 SOMALIARENA - Xawilaad")
                    .setColor(0x4189DD)
                    .setDescription(`✅ Si guul leh baad **${amount} Coins** ugu dirtay **${target.username}**!`)
                    .setTimestamp();

                message.channel.send({ embeds: [embed] });
            });
        });
    }
};
