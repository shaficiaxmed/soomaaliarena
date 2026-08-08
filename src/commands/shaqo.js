const { EmbedBuilder } = require('discord.js');
const db = require('../../database');

module.exports = {
    name: 'shaqo',
    description: 'Ka shaqee magaalada si aad u hesho lacag (Cooldown: 5 saacadood)',
    execute(message) {
        db.get(`SELECT * FROM users WHERE user_id = ?`, [message.author.id], (err, row) => {
            if (err) {
                return message.channel.send("❌ Cilad ayaa dhacday, fadlan dib u sooco.");
            }

            // Haddii uusan qofku jirin, si toos ah ayaanu u diiwaan gelineynaa (Auto-register)
            if (!row) {
                db.run(`INSERT INTO users (user_id, wallet, xp, last_work) VALUES (?, 0, 0, 0)`, [message.author.id], (err) => {
                    if (err) return message.channel.send("❌ Cilad ayaa dhacday markii la diiwaan gelinayay.");
                });
                return message.channel.send("❌ Fadlan mar labaad qor amarka `!shaqo`, hadda waa la diiwaan geliyay xogtaada.");
            }

            const cooldownTime = 2 * 60 * 60 * 1000; // 5 saacadood (Miliseconds)
            // Haddi aad rabto 2 saacadood beddel oo ka dhig: 2 * 60 * 60 * 1000
            
            const lastWork = row.last_work || 0;
            const now = Date.now();

            // Hubinta in waqtigii uusan weli dhamaan
            if (now - lastWork < cooldownTime) {
                const remainingTime = cooldownTime - (now - lastWork);
                const hours = Math.floor(remainingTime / (1000 * 60 * 60));
                const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));

                const waitEmbed = new EmbedBuilder()
                    .setColor(0xFF4444)
                    .setTitle("⏳ Waqtiga Nasashada (Cooldown)")
                    .setDescription(`Wali waqtigii shaqada kaama dhamaan!\n\nFadlan sug **${hours} saacadood iyo ${minutes} daqiiqo** inta aadan dib u shaqayn.`);
                return message.channel.send({ embeds: [waitEmbed] });
            }

            // Haddii waqtigii dhammaaday, sii lacagta oo cusboonaysii wakhtiga
            const earned = Math.floor(Math.random() * 200) + 50; // Lacag u dhaxaysa 50 ilaa 250
            
            db.run(`UPDATE users SET wallet = wallet + ?, xp = xp + 10, last_work = ? WHERE user_id = ?`, [earned, now, message.author.id], (err) => {
                if (err) {
                    return message.channel.send("❌ Cilad ayaa dhacday markii la kaydiyayay xogta.");
                }

                const embed = new EmbedBuilder()
                    .setTitle("💼 SOMALIARENA - SHAQO")
                    .setColor(0x4189DD)
                    .setDescription(`✅ Waad shaqaysay oo waxaad soo saartay **${earned} Coins** iyo **10 XP**!`)
                    .setTimestamp();

                message.channel.send({ embeds: [embed] });
            });
        });
    }
};
