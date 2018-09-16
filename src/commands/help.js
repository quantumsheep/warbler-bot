const { RichEmbed } = require("discord.js");
const config = require('../../config.json')

module.exports = client => {
    const helpEmbed = new RichEmbed({
        thumbnail: {
            url: client.user.avatarURL
        },
        color: '000000',
        title: "Aide pour Warbler",
        description: `Tapez \`${config.prefix}\` ou mentionnez moi (<@${client.user.id}>) pour avoir accès à mes commandes.`,
        fields: [
            {
                name: 'help',
                value: `Ouvre le menu d'aide (celui-ci)`
            },
            {
                name: 'Invitation link',
                value: `...`
            }
        ]
    });

    return msg => {
        msg.channel.send(helpEmbed);
    }
} 