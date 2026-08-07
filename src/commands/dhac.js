const { EmbedBuilder } = require('discord.js');
const db = require('../../database');

module.exports = {
    name: 'dhac',
    description: 'Isku day inaad howlo halis ah qabato si aad lacag u hesho',
    execute(message) {
        db.get(`SELECT wallet, energy FROM users WHERE user_id = ?`, [message.author.id], (err, row) => {
            if (!row) return message.channel.send("Fadlan marka hore is diiwaan geli adoo isticmaalaya `!aniga`.");
            if (row.energy < 20) return message.channel.send("⚠️ Tamartaadu way hooseysaa! Cuno cunto adoo adeegsanaya `!cunto`.");

            const success = Math.random() > 0.5;
            if (success) {
                const loot = Math.floor(Math.random() * 500) + 100;
                db.run(`UPDATE users SET wallet = wallet + ?, energy = energy - 20 WHERE user_id = ?`, [loot, message.author.id]);
                message.channel.send(`🦹‍♂️ Si guul leh baad howlgalkii u soo afjartay oo aad ku soo gurtay **${loot} Coins**!`);
            } else {
                const penalty = Math.floor(Math.random() * 300) + 50;
                db.run(`UPDATE users SET wallet = MAX(0, wallet - ?), energy = energy - 20 WHERE user_id = ?`, [penalty, message.author.id]);
                message.channel.send(`🚨 Booliskii ayaa ku qabtay ama waa lagu soo weeraray! Waxaad khasaarisay **${penalty} Coins**.`);
            }
        });
    }
};
