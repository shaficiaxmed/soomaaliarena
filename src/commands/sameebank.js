const db = require('../../database');

module.exports = {
    name: 'sameebank',
    description: 'Fur account bank ah (Wuxuu u baahan yahay Level 5+)',
    execute(message, args) {
        db.get(`SELECT * FROM users WHERE user_id = ?`, [message.author.id], (err, row) => {
            if (err) {
                return message.channel.send("❌ Cilad ayaa dhacday, fadlan dib u sooco.");
            }

            // 1. Hubinta inuu diiwaan gashan yahay iyo inuu gaaray Level 5
            if (!row || row.level < 5) {
                const currentLevel = row ? (row.level || 0) : 0;
                return message.channel.send(`❌ Waa inaad gaartaa **Level 5** si aad u furato account bank ah! (Level-kaaga hadda waa: ${currentLevel})`);
            }

            // 2. Hubi haddii uu horay u lahaa bank (bank_account = 1)
            if (row.bank_account === 1) {
                return message.channel.send("⚠️ Horay ayaad u leedahay account bank ah! Waxaad isticmaali kartaa `!bank` ama `!bangi`.");
            }

            // 3. Furidda account-ka bankiga
            db.run(`UPDATE users SET bank_account = 1 WHERE user_id = ?`, [message.author.id], (err) => {
                if (err) return message.channel.send("❌ Cilad ayaa dhacday markii la furayay bankiga.");
                return message.channel.send(`🎉 Hambalyo **${message.author.username}**! Si guul leh ayaad u furtay account bank ah. Hadda waxaad isticmaali kartaa \`!bank\` ama \`!bangi\`.`);
            });
        });
    }
};
