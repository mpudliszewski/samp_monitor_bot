const msToTime=ms=>{if(ms<1e3)return`ms`;var str=[];return days=Math.floor(ms/864e5),daysms=ms%864e5,hours=Math.floor(daysms/36e5),hoursms=ms%36e5,minutes=Math.floor(hoursms/6e4),minutesms=ms%6e4,sec=Math.floor(minutesms/1e3),days&&str.push(days+'d'),hours&&str.push(hours+'h'),minutes&&str.push(minutes+'m'),sec&&str.push(sec+'s'),str.join(' ')};
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ping',
    aliases: [],
    description: 'Returns latency and API ping',
    run: async (client, message, args) => {
        const color = await message.guild?.members.fetch(message.client.user.id).then(color => color.displayHexColor) || '#000000';
        return message.channel.send(`Pinging...`).then((msg) => {
            const embed = new EmbedBuilder()
                .setTitle(`Pong!`)
                .setDescription(`Server: \`${msg.createdAt - message.createdAt}ms\`\nAPI: \`${Math.round(client.ws.ping)}ms\`\nUptime: \`${msToTime(client.uptime)}\`\nMemory usage: \`${(process.memoryUsage().rss/1024/1024).toFixed(2)} MiB\``)
                .setColor(color);

            msg.edit({ content: '\u200B', embeds: [embed] });
        });
    }
}