const { EmbedBuilder } = require('discord.js');
const db = require('../../database');

module.exports = {
    name: 'aniga',
    description: 'Eeg profile-kaaga, hantidaada, iyo agabka boorsadaada hal mar',
    async execute(message) {
        db.get(`SELECT * FROM users WHERE user_id = ?`, [message.author.id], async (err, row) => {
            if (err) {
                console.error(err);
                return message.channel.send("❌ Cilad ayaa dhacday akhrinta xogta.");
            }

            // Haddii uusan isticmaalahu jirin, diiwaan geli oo sii qiimaha bilowga ah
            if (!row) {
                db.run(`INSERT OR IGNORE INTO users (user_id, username, wallet, bank, level, xp, hp, energy, diamonds) VALUES (?, ?, 1000, 0, 1, 0, 100, 100, 10)`, 
                    [message.author.id, message.author.username], 
                    (insertErr) => {
                        if (insertErr) console.error(insertErr);
                });
                
                row = {
                    wallet: 1000,
                    bank: 0,
                    level: 1,
                    xp: 0,
                    hp: 100,
                    energy: 100,
                    shield_expiry: null
                };
            }

            // Soo qaadashada magaca Server-ka (Nickname) haddii uu jiro
            let displayName = message.author.username;
            if (message.guild) {
                try {
                    const member = await message.guild.members.fetch(message.author.id).catch(() => null);
                    if (member) {
                        displayName = member.displayName;
                    }
                } catch (e) {}
            }

            // Hubinta in Shield-ku shaqaynayo iyo inkale
            const hasShield = row.shield_expiry && new Date(row.shield_expiry) > new Date();
            const shieldStatus = hasShield ? `✅ Waa shaqaynayaa ilaa:\n\`${row.shield_expiry}\`` : `❌ Ma haysatid gaashaan shaqaynaya`;

            // Abuurista Embed-ka mideysan
            const embed = new EmbedBuilder()
                .setTitle(`🛡️ KAARKA CIYAARYAHANKA & BOORSADA`)
                .setDescription(`*Macluumaadka iyo agabka uu leeyahay **${displayName}***`)
                .setColor(0x4189DD)
                .addFields(
                    { name: '💰 Wallet', value: `${(row.wallet || 0).toLocaleString()} Coins`, inline: true },
                    { name: '🏦 Bank', value: `${(row.bank || 0).toLocaleString()} Coins`, inline: true },
                    { name: '⚡ Level & XP', value: `Level ${row.level || 1} (${row.xp || 0}/100 XP)`, inline: true },
                    { name: '❤️ HP (Caafimaad)', value: `${row.hp || 100}%`, inline: true },
                    { name: '🔋 Energy (Tamarta)', value: `${row.energy || 100}%`, inline: true },
                    { name: '\u200b', value: '\u200b', inline: true }, // Meel banaan si uu u nidaammo layout-ku
                    { name: '🎒 Gaashaan Difaaca (Shield)', value: shieldStatus, inline: false }
                )
                .setFooter({ text: 'SomaliaRena Economy & Inventory System', iconURL: message.client.user.displayAvatarURL() })
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        });
    }
};
