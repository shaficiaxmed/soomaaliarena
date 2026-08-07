const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'suuq',
    description: 'Fur suuqa hubka iyo difaaca',
    execute(message) {
        const embed = new EmbedBuilder()
            .setTitle("🛡️ SOMALIARENA - SUUQA WEYN")
            .setColor(0x4189DD)
            .setDescription("Halkan waxaad ka iibsan kartaa agabka badbaadada:")
            .addFields(
                { name: '1. Shield (Gaashaan Difaaca)', value: 'Qiimaha: **15 Diamonds** (Shaqeeya 6 saacadood)\nAmarka: `!iibso shield`', inline: false }
            )
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};
