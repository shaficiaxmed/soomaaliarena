const { EmbedBuilder } = require('discord.js');
const db = require('../../database');

module.exports = {
    name: 'taajir',
    description: 'Eeg liiska 10-ka qof ee lacagta ugu badan ku haysta Wallet-kooda',
    async execute(message) {
        db.all(`SELECT user_id, username, COALESCE(wallet, 0) as wallet FROM users ORDER BY wallet DESC LIMIT 10`, [], async (err, rows) => {
            if (err) {
                console.error(err);
                return message.channel.send("❌ **Cilad ayaa dhacday:** Fadlan dib u day.");
            }
            if (!rows || rows.length === 0) {
                return message.channel.send("⚠️ **Ogeysiis:** Wali lama helin xogta taajiriinta.");
            }

            let leaderboardText = "";
            for (let index = 0; index < rows.length; index++) {
                const r = rows[index];
                const medals = ["👑", "🥈", "🥉", "`#4`", "`#5`", "`#6`", "`#7`", "`#8`", "`#9`", "`#10`"];
                
                // Soo qaadashada magaca uu qofku ka leeyahay Server-ka (Nickname) ama Username-kiisa
                let displayName = r.username;
                if (message.guild) {
                    try {
                        const member = await message.guild.members.fetch(r.user_id).catch(() => null);
                        if (member) {
                            displayName = member.displayName;
                        }
                    } catch (e) {}
                }
                if (!displayName) displayName = `<@${r.user_id}>`;

                const rankBadge = medals[index] || `\`#${index + 1}\``;
                leaderboardText += `${rankBadge} **${displayName}**\n┗ 🪙 **${r.wallet.toLocaleString()} Coins** (Wallet)\n\n`;
            }

            const embed = new EmbedBuilder()
                .setTitle("🌟 SOMALIARENA • CYBER LEADERBOARD")
                .setColor(0x00D2FF)
                .setDescription("Halkan waxaad ku arkeysaa xidigaha ugu hantida badan ee lacagta caddaanka ah ku haysta gacanta:\n\n" + leaderboardText)
                .addFields({ 
                    name: '🛡️ Nidaamka Badbaadada & Dhaca (Shield Alert):', 
                    value: '> ⚠️ Qof walba oo wallet-ka ku haysta in ka badan **200 🪙** waa la dhici karaa!\n> 🛒 *Isticmaal `!dukaan` si aad u iibsato Shield aad uga hortagto in hantidaada la dhaco.*' 
                })
                .setFooter({ text: 'SomaliaRena Economy System • Live Ranking', iconURL: message.client.user.displayAvatarURL() })
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
        });
    }
};
