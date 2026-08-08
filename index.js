const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { TOKEN, PREFIX } = require('./config');
const db = require('./database'); // ⚠️ Waa muhiim inaan halkan ku darnaa db-ka

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent 
    ] 
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'src', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log(`🏟️ SomaliArena Bot waa diyaar oo shaqaynaya: ${client.user.tag}`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    // 1. Si otomaatig ah ayuu qof walba oo chat-ka wax ka qora u galayaa database-ka
    db.run(`INSERT OR IGNORE INTO users (user_id, username, wallet, diamonds, hp, energy) VALUES (?, ?, 1000, 10, 100, 100)`, 
        [message.author.id, message.author.username], (err) => {
            if (err) console.error("Cilad diiwaan gelin otomaatig ah:", err);
        });

    // 2. Hubinta in fariintu ku bilaabato Prefix-ka (tusaale: !)
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        await command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('❌ Waxaa dhacay khalad markii la fulinayay amarkan!');
    }
});

client.login(TOKEN);
