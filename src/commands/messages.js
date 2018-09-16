const { Client, Message, RichEmbed } = require('discord.js');
const members = require('../models/member');

/**
 * 
 * @param {Client} client 
 */
module.exports = client => {
    /**
     * @param {Message} msg
     */
    const command = async (msg, user, ...args) => {
        if (!user) {
            user = msg.author;
        } else if (user === 'top') {
            user = 'top';
        } else if (msg.mentions.users.size > 0) {
            user = msg.mentions.users.first();
        }

        const accounts = await members.aggregate([
            {
                "$sort": {
                    "posts": -1
                }
            },
            {
                "$group": {
                    "_id": false,
                    "user": {
                        "$push": {
                            "_id": "$_id",
                            "discordid": "$discordid",
                            "posts": "$posts"
                        }
                    }
                }
            },
            {
                "$unwind": {
                    "path": "$user",
                    "includeArrayIndex": "rank"
                }
            },
            {
                "$match": (user !== 'top' ? { "user.discordid": user.id } : {})
            },
            {
                '$limit': 10
            }
        ]);

        if (accounts.length > 1) {
            const topEmbed = new RichEmbed({
                color: '000000',
                title: "Top du serveur",
                fields: accounts.map(account => {
                    const user = msg.guild.members.get(account.user.discordid);

                    return {
                        name: user.nickname || user.user.username,
                        value: `Rank ${account.rank + 1}/${msg.guild.memberCount} - ${account.user.posts} messages`
                    };
                }),
            });

            msg.channel.send(topEmbed);
        } else {
            const [member] = accounts;
            msg.channel.send(`<@${msg.author.id}>, ${user.id === msg.author.id ? 'you' : user.username} said ${member.user.posts} messages. (Rank ${member.rank + 1}/${msg.guild.memberCount}).`);
        }
    }

    return command;
}
