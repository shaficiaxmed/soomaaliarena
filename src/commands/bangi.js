const { EmbedBuilder } = require('discord.js');
const db = require('../../database');

module.exports = {
    name: 'bank',
    aliases: ['bangi'],
    description: 'Maamul bankigaaga (dhig ama labax)',
    execute(message, args) {
        const action = args[0]; 
        const argValue = args[1]; 

        db.get(`SELECT * FROM users WHERE user_id = ?`, [message.author.id], (err, row) => {
            if (!row) return message.channel.send("❌ Fadlan marka hore isticmaal `!aniga` si aad u diiwaan gashato.");

            // Hubinta inuu qofku qoray amarka !sameebank oo uu bank leeyahay
            if (!row.bank_account || row.bank_account === 0) {
                return message.channel.send("❌ Wali ma aadan lahayn account bank ah! Fadlan marka hore qor **`!sameebank`** si aad u furato.");
            }

            // 1. QAYBTA DHIGASHADA
            if (action === 'dhig') {
                if (row.level < 5) return message.channel.send(`❌ Waa inaad gaartaa **Level 5** si aad lacag ugu shuban karto bankiga!`);
                
                const amount = parseInt(argValue);
                if (isNaN(amount) || amount <= 0 || row.wallet < amount) {
                    return message.channel.send("❌ Lacagtaada wallet-ka ku jirta kuguma filna ama tiro khaldan baad gelisay.");
                }
                
                db.run(`UPDATE users SET wallet = wallet - ?, bank = bank + ? WHERE user_id = ?`, [amount, amount, message.author.id]);
                return message.channel.send(`✅ Si guul leh baad bankiga ugu shubatay **${amount} Coins**.`);
            }

            // 2. QAYBTA LABAXDA
            else if (action === 'labax') {
                if (row.bank <= 0) return message.channel.send("❌ Bankigaaga wax lacag ah kuma jirto!");

                let amountToWithdraw;
                if (argValue === 'dhammaan' || argValue === 'all') {
                    amountToWithdraw = row.bank;
                } else {
                    amountToWithdraw = parseInt(argValue);
                }

                if (isNaN(amountToWithdraw) || amountToWithdraw <= 0 || row.bank < amountToWithdraw) {
                    return message.channel.send("❌ Tirada aad gelisay waa khalad ama bangigaaga lacag intaas le'eg kama jirto.");
                }
                
                db.run(`UPDATE users SET wallet = wallet + ?, bank = bank - ? WHERE user_id = ?`, [amountToWithdraw, amountToWithdraw, message.author.id]);
                return message.channel.send(`✅ Si guul leh baad bankiga ugala baxday **${amountToWithdraw} Coins**.`);
            }

            // 3. HADDII AADAN QORIN DHIG AMA LABAX (Muujinta hantida)
            const embed = new EmbedBuilder()
                .setTitle("🏦 SomaliArena Bankiga Dhexe")
                .setColor(0x4189DD)
                .setDescription(`Hantidaada Bankiga: **${row.bank} Coins**\nWallet-kaaga: **${row.wallet} Coins**\nLevel-kaaga: **Level ${row.level || 0}**\n\n**Sida loo isticmaalo:**\n• \`!bank dhig <tirada>\`\n• \`!bank labax <tirada>\`\n• \`!bank labax dhammaan\``)
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        });
    }
};
