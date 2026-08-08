const db = require('../../database');

module.exports = {
    name: 'sameebank',
    description: 'Fur account bank ah si aad u isticmaasho bankiga',
    execute(message, args) {
        db.get(`SELECT * FROM users WHERE user_id = ?`, [message.author.id], (err, row) => {
            if (!row) return message.channel.send("❌ Fadlan marka hore is diiwaan geli oo isticmaal `!aniga`.");

            // Hubi haddii uu horay u lahaa bank (bank_account = 1)
            if (row.bank_account === 1) {
                return message.channel.send("⚠️ Horay ayaad u leedahay account bank ah! Waxaad isticmaali kartaa `!bank`.");
            }

            // Furidda account-ka bankiga
            db.run(`UPDATE users SET bank_account = 1 WHERE user_id = ?`, [message.author.id], (err) => {
                if (err) return message.channel.send("❌ Cilad ayaa dhacday markii la furayay bankiga.");
                return message.channel.send(`🎉 Hambalyo **${message.author.username}**! Si guul leh ayaad u furtay account bank ah. Hadda waxaad isticmaali kartaa \`!bank\` ama \`!bangi\`.`);
            });
        });
    }
};
