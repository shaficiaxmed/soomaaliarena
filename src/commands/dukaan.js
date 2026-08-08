const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require('../../database');

module.exports = {
    name: 'dukaan',
    description: 'Fur dukaanka oo iibso agab adoo isticmaalaaya buttons-ka',
    execute(message) {
        // Hubi oo marka hore abuur table-ka haddii uusan jirin si aysan cilad u dhicin
        db.run(`CREATE TABLE IF NOT EXISTS users (
            user_id TEXT PRIMARY KEY,
            wallet INTEGER DEFAULT 1000,
            diamonds INTEGER DEFAULT 10,
            hp INTEGER DEFAULT 100,
            energy INTEGER DEFAULT 100,
            shield_expiry TEXT
        )`, (tableErr) => {
            if (tableErr) {
                console.error(tableErr);
                return message.channel.send("❌ Cilad ayaa ka jirta abuurista Database-ka.");
            }

            db.get(`SELECT * FROM users WHERE user_id = ?`, [message.author.id], (err, row) => {
                if (err) return message.channel.send("❌ Cilad ayaa dhacday akhrinta xogta.");

                const proceedShop = () => {
                    const embed = new EmbedBuilder()
                        .setTitle("🛡️ SOMALIARENA - DUKAANKA WEYN")
                        .setColor(0x4189DD)
                        .setDescription("Halkan waxaad ka iibsan kartaa agabka badbaadada iyo tamarta:")
                        .addFields(
                            { name: '1. 🛡️ Shield', value: 'Qiimaha: **14 Diamonds** (Shaqeeya 6 saacadood)', inline: false },
                            { name: '2. 💖 HP (Caafimaad)', value: 'Qiimaha: **200 Coins**', inline: false },
                            { name: '3. ⚡ Energy (Tamarta)', value: 'Qiimaha: **100 Coins**', inline: false }
                        );

                    const rowButtons = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder().setCustomId('buy_shield').setLabel('Shield (14 💎)').setStyle(ButtonStyle.Primary),
                            new ButtonBuilder().setCustomId('buy_hp').setLabel('HP (200 🪙)').setStyle(ButtonStyle.Success),
                            new ButtonBuilder().setCustomId('buy_energy').setLabel('Energy (100 🪙)').setStyle(ButtonStyle.Success)
                        );

                    message.channel.send({ embeds: [embed], components: [rowButtons] }).then(sentMessage => {
                        const collector = sentMessage.createMessageComponentCollector({
                            filter: i => i.user.id === message.author.id,
                            time: 60000
                        });

                        collector.on('collect', async interaction => {
                            db.get(`SELECT * FROM users WHERE user_id = ?`, [message.author.id], async (err, uRow) => {
                                if (err || !uRow) return interaction.reply({ content: "❌ Xogtaada lama helin.", ephemeral: true });

                                // 1. SHIELD LOGIC
                                if (interaction.customId === 'buy_shield') {
                                    const isShieldActive = uRow.shield_expiry && new Date(uRow.shield_expiry) > new Date();
                                    if (isShieldActive) return interaction.reply({ content: "🛡️ Waxaad horey u haysatay Shield shaqaynaya! Uma baahnid mid cusub.", ephemeral: true });
                                    
                                    const diamonds = uRow.diamonds || 0;
                                    if (diamonds < 14) return interaction.reply({ content: `❌ Diamonds-kaaga kuguma filna! Waxaad haysataa **${diamonds} 💎** (Waxaad u baahan tahay 14).`, ephemeral: true });

                                    const newExpiry = new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString();
                                    db.run(`UPDATE users SET diamonds = diamonds - 14, shield_expiry = ? WHERE user_id = ?`, [newExpiry, message.author.id], (err) => {
                                        if (err) return interaction.reply({ content: "❌ Cilad ayaa dhacday.", ephemeral: true });
                                        return interaction.reply({ content: "🎉 Waad iibsatay Shield! Muddo 6 saacadood ah ayaad badbaado tahay.", ephemeral: true });
                                    });
                                } 
                                
                                // 2. HP LOGIC
                                else if (interaction.customId === 'buy_hp') {
                                    if (uRow.hp >= 50) return interaction.reply({ content: `💖 Caafimaadkaagu wuu fiican yahay (**${uRow.hp}%**). Uma baahnid inaad HP iibsato.`, ephemeral: true });
                                    
                                    const wallet = uRow.wallet || 0;
                                    if (wallet < 200) return interaction.reply({ content: `❌ Lacagtaadu kuguma filna! Waxaad haysataa **${wallet} 🪙** (Waxaad u baahan tahay 200).`, ephemeral: true });

                                    db.run(`UPDATE users SET wallet = wallet - 200, hp = 100 WHERE user_id = ?`, [message.author.id], (err) => {
                                        if (err) return interaction.reply({ content: "❌ Cilad ayaa dhacday.", ephemeral: true });
                                        return interaction.reply({ content: "🎉 Waad iibsatay HP! Caafimaadkaagu wuxuu noqday 100%.", ephemeral: true });
                                    });
                                } 
                                
                                // 3. ENERGY LOGIC
                                else if (interaction.customId === 'buy_energy') {
                                    if (uRow.energy >= 50) return interaction.reply({ content: `⚡ Tamartaadu way fiican tahay (**${uRow.energy}%**). Uma baahnid inaad Energy iibsato.`, ephemeral: true });
                                    
                                    const wallet = uRow.wallet || 0;
                                    if (wallet < 100) return interaction.reply({ content: `❌ Lacagtaadu kuguma filna! Waxaad haysataa **${wallet} 🪙** (Waxaad u baahan tahay 100).`, ephemeral: true });

                                    db.run(`UPDATE users SET wallet = wallet - 100, energy = 100 WHERE user_id = ?`, [message.author.id], (err) => {
                                        if (err) return interaction.reply({ content: "❌ Cilad ayaa dhacday.", ephemeral: true });
                                        return interaction.reply({ content: "🎉 Waad iibsatay Energy! Tamartaadu waxay noqotay 100%.", ephemeral: true });
                                    });
                                }
                            });
                        });
                    });
                };

                if (!row) {
                    db.run(`INSERT OR IGNORE INTO users (user_id, wallet, diamonds, hp, energy) VALUES (?, 1000, 10, 100, 100)`, [message.author.id], (err) => {
                        if (err) {
                            console.error(err);
                            return message.channel.send("❌ Cilad ayaa dhacday markii la diiwaan gelinayay.");
                        }
                        proceedShop();
                    });
                } else {
                    proceedShop();
                }
            });
        });
    }
};
