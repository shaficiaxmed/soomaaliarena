const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'caawin',
    description: 'Eeg liiska amarrada uu bot-ka leeyahay',
    execute(message) {
        const embed = new EmbedBuilder()
            .setTitle("🛡️ SOMALIARENA - LIISKA AMARRADA")
            .setColor(0x4189DD)
            .setDescription("Halkan waxaa ku xusan amarrada aad ku ciyaari karto:")
            .addFields(
                { name: '👤 `!aniga`', value: 'Eeg profile-kaaga iyo hantidaada ku jirta wallet-ka.', inline: false },
                { name: '💼 `!shaqo`', value: 'Ka shaqee magaalada si aad u hesho Coins iyo XP.', inline: false },
                { name: '🎁 `!gunno`', value: 'Qaado gunnadaada maalinlaha ah (Daily Reward).', inline: false },
                { name: '🍽️ `!cunto`', value: 'Cun cunto si aad tamartaada (Energy) dib ugu celiso 100%.', inline: false },
                { name: '🏦 `!bank dhig <lacag>`', value: 'Lacagtaada wallet-ka ku jirta dhig bankiga.', inline: false },
                { name: '⚔️ `!dirir @user`', value: 'La dagaalan ciyaaryahan kale adoo isticmaalaya tamartaada.', inline: false },
                { name: '🛒 `!suuq`', value: 'Eeg suuqa weyn iyo agabka badbaadada ee la iibsado.', inline: false },
                { name: '🏆 `!taajir`', value: 'Eeg 10-ka qof ee ugu hantida badan server-ka.', inline: false }
            )
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    }
};
