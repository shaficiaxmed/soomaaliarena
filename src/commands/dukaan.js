const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require('../../database');

module.exports = {
    name: 'dukaan',
    description: 'Fur dukaanka oo iibso agab adoo isticmaalaaya buttons-ka',
    execute(message) {
        db.get(`SELECT * FROM users WHERE user_id = ?`, [message.author.id], (err, row) => {
            if (err) return message.channel.send("❌ Cilad ayaa dhacday, fadlan dib u sooco.");

            if (!row) {
                db.run(`INSERT INTO users (user_id, wallet, diamonds, hp, energy) VALUES (?, 1000, 10, 100, 100)`, [message.author.id], () => {});
            }

            const embed = new EmbedBuilder()
                .setTitle("🛡️ SOMALIARENA - DUKAANKA WEYN")
                .setColor(0x4189DD)
                .setDescription("Halkan waxaad ka iibsan kartaa agabka badbaadada iyo tamarta adoo gujinaya badhamada hoose:")
                .addFields(
                    { name: '1. 🛡️ Shield (Gaashaan Difaaca)', value: 'Qiimaha: **14 Diamonds** (Shaqeeya 6 saacadood)', inline: false },
                    { name: '2. 💖 HP (Caafimaad)', value: 'Qiimaha: **200 Coins**', inline: false },
                    { name: '3. ⚡ Energy (Tamarta)', value: 'Qiimaha: **100 Coins**', inline: false }
                )
                .setTimestamp();

            const rowButtons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('buy_shield')
                        .setLabel('Shield (14 💎)')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('buy_hp')
                        .setLabel('HP (200 🪙)')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('buy_energy')
                        .setLabel('Energy (100 🪙)')
                        .setStyle(ButtonStyle.Success)
                );

            message.channel.send({ embeds: [embed], components: [rowButtons] }).then(sentMessage => {
                const collector = sentMessage.createMessageComponentCollector({
                    filter: i => i.user.id === message.author.id,
                    time: 60000 // Badhamadu waxay shaqaynayaan 1 daqiiqo
                });

                collector.on('collect', async interaction => {
                    db.get(`SELECT * FROM users WHERE user_id = ?`, [message.author.id], async (err, userRow) => {
                        if (!userRow) {
                            return interaction.reply({ content: "❌ Xogtaada lama helin.", ephemeral: true });
                        }

                        // 1. IIBASHADA SHIELD
                        if (interaction.customId === 'buy_shield') {
                            const diamonds = userRow.diamonds || 0;
                            if (diamonds < 14) {
                                return interaction.reply({ content: `❌ Diamonds-kaaga kuguma filna! Waxaad haysataa **${diamonds} 💎** (Waxaad u baahan tahay 14).`, ephemeral: true });
                            }

                            const newExpiry = new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString();
                            db.run(`UPDATE users SET diamonds = diamonds - 14, shield_expiry = ? WHERE user_id = ?`, [newExpiry, message.author.id], (err) => {
                                if (err) return interaction.reply({ content: "❌ Cilad ayaa dhacday.", ephemeral: true });
                                return interaction.reply({ content: `🎉 Hambalyo! Si guul leh ayaad u iibsatay **Shield** muddo 6 saacadood ah.`, ephemeral: true });
                            });
                        } 
                        
                        // 2. IIBASHADA HP (Qiimaha: 200 Coins)
                        else if (interaction.customId === 'buy_hp') {
                            const wallet = userRow.wallet || 0;
                            if (wallet < 200) {
                                return interaction.reply({ content: `❌ Lacagtaada Wallet-ka kuguma filna! Waxaad haysataa **${wallet} 🪙** (Waxaad u baahan tahay 200).`, ephemeral: true });
                            }

                            db.run(`UPDATE users SET wallet = wallet - 200, hp = 100 WHERE user_id = ?`, [message.author.id], (err) => {
                                if (err) return interaction.reply({ content: "❌ Cilad ayaa dhacday.", ephemeral: true });
                                return interaction.reply({ content: `🎉 Hambalyo! Si guul leh ayaad u iibsatay **HP** adoo bixiyay **200 Coins** (Caafimaadkiisu wuxuu noqday 100%).`, ephemeral: true });
                            });
                        } 
                        
                        // 3. IIBASHADA ENERGY (Qiimaha: 100 Coins)
                        else if (interaction.customId === 'buy_energy') {
                            const wallet = userRow.wallet || 0;
                            if (wallet < 100) {
                                return interaction.reply({ content: `❌ Lacagtaada Wallet-ka kuguma filna! Waxaad haysataa **${wallet} 🪙** (Waxaad u baahan tahay 100).`, ephemeral: true });
                            }

                            db.run(`UPDATE users SET wallet = wallet - 100, energy = 100 WHERE user_id = ?`, [message.author.id], (err) => {
                                if (err) return interaction.reply({ content: "❌ Cilad ayaa dhacday.", ephemeral: true });
                                return interaction.reply({ content: `🎉 Hambalyo! Si guul leh ayaad u iibsatay **Energy** adoo bixiyay **100 Coins** (Tamartaadu waxay noqotay 100%).`, ephemeral: true });
                            });
                        }
                    });
                });

                collector.on('end', () => {
                    const disabledRow = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder().setCustomId('buy_shield').setLabel('Shield (Waa dhamaaday)').setStyle(ButtonStyle.Primary).setDisabled(true),
                            new ButtonBuilder().setCustomId('buy_hp').setLabel('HP (Waa dhamaaday)').setStyle(ButtonStyle.Success).setDisabled(true),
                            new ButtonBuilder().setCustomId('buy_energy').setLabel('Energy (Waa dhamaaday)').setStyle(ButtonStyle.Success).setDisabled(true)
                        );
                    sentMessage.edit({ components: [disabledRow] }).catch(() => {});
                });
            });
        });
    }
};
