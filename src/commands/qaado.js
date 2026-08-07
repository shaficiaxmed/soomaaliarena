const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require('../../database');

module.exports = {
    name: 'qaado',
    description: 'Soo saar airdrop lacag ah oo qofkii ugu horreeya uu qaadan karo adoo isticmaalaya !qaado',
    execute(message) {
        const reward = Math.floor(Math.random() * 2000) + 500; // Inta u dhaxeysa 500 ilaa 2500 Coins

        const embed = new EmbedBuilder()
            .setTitle("🪂 SOMALIARENA - AIRDROP WEYN!")
            .setColor(0x00FF00)
            .setDescription(`Airdrop ayaa soo dhacay! Qofkii ugu horreeya ee riixa badhanka hoose wuxuu helayaa **${reward} Coins**!`)
            .setTimestamp();

        const button = new ButtonBuilder()
            .setCustomId('claim_airdrop')
            .setLabel('Qaado Airdrop-ka 💰')
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder().addComponents(button);

        message.channel.send({ embeds: [embed], components: [row] }).then(sentMessage => {
            const filter = i => i.customId === 'claim_airdrop';
            const collector = sentMessage.createMessageComponentCollector({ filter, time: 30000, max: 1 });

            collector.on('collect', async interaction => {
                db.get(`SELECT user_id FROM users WHERE user_id = ?`, [interaction.user.id], (err, row) => {
                    if (!row) {
                        return interaction.reply({ content: "❌ Waa inaad is diiwaan gelisaa marka hore adoo isticmaalaya `!aniga` si aad u qaadato airdrop-ka!", ephemeral: true });
                    }

                    db.run(`UPDATE users SET wallet = wallet + ? WHERE user_id = ?`, [reward, interaction.user.id], async () => {
                        const claimedEmbed = new EmbedBuilder()
                            .setTitle("🪂 AIRDROP WAA LA QAATAY")
                            .setColor(0x4189DD)
                            .setDescription(`🎉 Waxaa airdrop-kii helay oo qaatay **${interaction.user.username}**! Wuxuu ku guuleystay **${reward} Coins**.`);

                        await interaction.update({ embeds: [claimedEmbed], components: [] });
                    });
                });
            });

            collector.on('end', collected => {
                if (collected.size === 0) {
                    const expiredEmbed = new EmbedBuilder()
                        .setTitle("🪂 AIRDROP WAA DHACAY")
                        .setColor(0xFF0000)
                        .setDescription(`⏰ Waqtigii airdrop-ka wuu dhacay mana jiro qof qaatay.`);
                    sentMessage.edit({ embeds: [expiredEmbed], components: [] }).catch(() => {});
                }
            });
        });
    }
};
