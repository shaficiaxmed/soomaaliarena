const { EmbedBuilder } = require('discord.js');
const db = require('../../database');

module.exports = {
    name: 'bank',
    description: 'Maamul bankigaaga',
    execute(message, args) {
        const action = args[0];
        const amount = parseInt(args[1]);

        db.get(`SELECT * FROM users WHERE user_id = ?`, [message.author.id], (err, row) => {
            if (!row) return message.channel.send("Fadlan marka hore isticmaal `!aniga` si aad u diiwaan gashato.");

            if (action === 'dhig') {
                if (isNaN(amount) || row.wallet < amount) return message.channel.send("❌ Lacagtaada wallet-ka ku jirta kuguma filna ama tiro khaldan baad gelisay.");
                db.run(`UPDATE users SET wallet = wallet - ?, bank = bank + ? WHERE user_id = ?`, [amount, amount, message.author.id]);
                return message.channel.send(`✅ Si guul leh baad bankiga ugu shubatay **${amount} Coins**.`);
            }

            const embed = new EmbedBuilder()
                .setTitle("🏦 SomaliArena Bankiga Dhexe")
                .setColor(0x4189DD)
                .setDescription(`Hantidaada Bankiga: **${row.bank} Coins**\nShuruudda Bankiga: Level 5+ iyo 1M Coins.`)
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        });
    }
};
