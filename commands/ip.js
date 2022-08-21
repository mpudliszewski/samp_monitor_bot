const { EmbedBuilder } = require('discord.js');
const samp = require('samp-query');

const embed = new EmbedBuilder();

module.exports = {
    name: 'ip',
    aliases: [],
    description: 'Shows IP address of a SA:MP Server',
    run: async (client, message, args) => {
        if(!process.env.SAMP_IP)
            return message.channel.send('IP address is not set in the .env file!');

        const ip = process.env.SAMP_IP.split(':');
        const options = {
            host: ip[0],
            port: ip[1] || 7777
        };

        const color = await message.guild?.members.fetch(message.client.user.id).then(color => color.displayHexColor) || '#000000';
        await samp(options, (error, query) => {
            if(error){
                embed.setColor(color);
                embed.setTitle('Server is offline');
                embed.setDescription(`**IP:** \`${options.host}:${options.port}\``);
                return message.channel.send({ embeds: [embed] });
            }
            else{
                embed.setColor(color);
                embed.setTitle('Server is online!');
                embed.setDescription(`**IP:** \`${options.host}:${options.port}\``);
                return message.channel.send({ embeds: [embed] });
            }
        });

        return;
    }
}