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
            if (err) {
                const errEmbed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setDescription("❌ Cilad ayaa dhadcay, fadlan dib u sooco.");
                return message.channel.send({ embeds: [errEmbed] });
            }

            if (!row) {
                const regEmbed = new EmbedBuilder()
                    .setColor(0xFF4444)
                    .setDescription("❌ Fadlan marka hore isticmaal `!sameebank` si aad u diiwaan gashato.");
                return message.channel.send({ embeds: [regEmbed] });
            }

            // Hubinta inuu qofku qoray amarka !sameebank oo uu bank leeyahay
            if (!row.bank_account || row.bank_account === 0) {
                const bankEmbed = new EmbedBuilder()
                    .setColor(0xFF4444)
                    .setDescription("❌ Wali ma aadan lahayn account bank ah! Fadlan marka hore qor **`!sameebank`** si aad u furato.");
                return message.channel.send({ embeds: [bankEmbed] });
            }

            // 1. QAYBTA DHIGASHADA
            if (action === 'dhig') {
                if (row.level < 5) {
                    const lvlEmbed = new EmbedBuilder()
                        .setColor(0xFF4444)
                        .setDescription(`❌ Waa inaad gaartaa **Level 5** si aad lacag ugu shuban karto bankiga! (Level-kaaga hadda waa: ${row.level || 0})`);
                    return message.channel.send({ embeds: [lvlEmbed] });
                }
                
                const amount = parseInt(argValue);
                if (isNaN(amount) || amount <= 0 || row.wallet < amount) {
                    const amtEmbed = new EmbedBuilder()
                        .setColor(0xFF4444)
                        .setDescription("❌ Lacagtaada wallet-ka ku jirta kuguma filna ama tiro khaldan baad gelisay.");
                    return message.channel.send({ embeds: [amtEmbed] });
                }
                
                db.run(`UPDATE users SET wallet = wallet - ?, bank = bank + ? WHERE user_id = ?`, [amount, amount, message.author.id]);
                const successDhig = new EmbedBuilder()
                    .setColor(0x00FF00)
                    .setDescription(`✅ Si guul leh baad bankiga ugu shubatay **${amount} Coins**.`);
                return message.channel.send({ embeds: [successDhig] });
            }

            // 2. QAYBTA LABAXDA
            else if (action === 'labax') {
                if (row.bank <= 0) {
                    const emptyEmbed = new EmbedBuilder()
                        .setColor(0xFF4444)
                        .setDescription("❌ Bankigaaga wax lacag ah kuma jirto!");
                    return message.channel.send({ embeds: [emptyEmbed] });
                }

                let amountToWithdraw;
                if (argValue === 'dhammaan' || argValue === 'all') {
                    amountToWithdraw = row.bank;
                } else {
                    amountToWithdraw = parseInt(argValue);
                }

                if (isNaN(amountToWithdraw) || amountToWithdraw <= 0 || row.bank < amountToWithdraw) {
                    const errWithDraw = new EmbedBuilder()
                        .setColor(0xFF4444)
                        .setDescription("❌ Tirada aad gelisay waa khalad ama bangigaaga lacag intaas le'eg kama jirto.");
                    return message.channel.send({ embeds: [errWithDraw] });
                }
                
                db.run(`UPDATE users SET wallet = wallet + ?, bank = bank - ? WHERE user_id = ?`, [amountToWithdraw, amountToWithdraw, message.author.id]);
                const successLabax = new EmbedBuilder()
                    .setColor(0x00FF00)
                    .setDescription(`✅ Si guul leh baad bankiga ugala baxday **${amountToWithdraw} Coins**.`);
                return message.channel.send({ embeds: [successLabax] });
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
