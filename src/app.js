const { Client } = require("discord.js");
const config = require("../config.json");

const client = new Client();

client.on('ready', () => {
    const commands = {
        help: require('./commands/help')(client),
        messages: require('./commands/messages')(client),
    }

    const updateStats = () => {
        const servers = client.guilds.array();
        const members = servers.map(x => x.memberCount).reduce((a, b) => a + b, 0);

        client.user.setActivity(`Warbler in ${servers.length} servers with a total of ${members} members.`, {
            type: 'PLAYING'
        });
    };

    updateStats();
    setInterval(updateStats, 3600000);

    const members = require('./models/member');

    client.on('message', async msg => {
        try {
            const account = await members.findOne({
                discordid: msg.author.id
            });
    
            if(!account) {
                await new members({
                    discordid: msg.author.id,
                    server: msg.guild.id,
                }).save();
            } else {
                account.posts++;
                await account.save();
            }
    
            if (msg.author.bot) return;
    
            if (msg.content.indexOf(config.prefix) === 0 || msg.content.indexOf(`<@${client.user.id}>`) === 0) {
                const [, command, ...args] = msg.content.trim().split(/ +/g);
    
                if (command in commands) {
                    commands[command](msg, ...args);
                }
            }
        } catch(e) {
            console.log(e);
        }
    });
});

client.on('error', err => {
    console.log(err);
});

client.login(config.token);