const { EmbedBuilder } = require('discord.js');
const db = require('../../database');

module.exports = {
    name: 'slot',
    description: 'Ku ciyaar mashiinka nasiibka ee Slot',
    execute(message, args) {
        const amount = parseInt(args[0]);
        if (isNaN(amount) || amount <= 0) return message.channel.send("❌ Fadlan geli lacagta aad ku ciyaareyso (`!slot 500`).");

        db.get(`SELECT wallet FROM users WHERE user_id = ?`, [message.author.id], (err, row) => {
            if (!row || row.wallet < amount) return message.channel.send("❌ Lacagtaada wallet-ka ku jirta kuguma filna!");

            const symbols = ["🍎", "🍋", "🍒", "💎", "⭐"];
            const s1 = symbols[Math.floor(Math.random() * symbols.length)];
            const s2 = symbols[Math.floor(Math.random() * symbols.length)];
            const s3 = symbols[Math.floor(Math.random() * symbols.length)];

            if (s1 === s2 && s2 === s3) {
                const win = amount * 5;
                db.run(`UPDATE users SET wallet = wallet + ? WHERE user_id = ?`, [win, message.author.id]);
                message.channel.send(`🎰 [ ${s1} | ${s2} | ${s3} ]\n🎉 Hambalyo! Saddexduba wey midoobeen! Waxaad guulaysatay **${win} Coins**!`);
            } else {
                db.run(`UPDATE users SET wallet = wallet - ? WHERE user_id = ?`, [amount, message.author.id]);
                message.channel.send(`🎰 [ ${s1} | ${s2} | ${s3} ]\n😢 Waa Nasiib-darro! Waxaad khasaarisay **${amount} Coins**.`);
            }
        });
    }
};
