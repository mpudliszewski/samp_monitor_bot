const { EmbedBuilder } = require('discord.js');
const samp = require('samp-query');
const AsciiTable = require('ascii-table');

module.exports = {
    name: 'players',
    aliases: ['player'],
    description: 'Lists all online players if players number is lower or equal 100',
    run: async (client, message, args) => {
        if(!process.env.SAMP_IP)
            return message.channel.send('IP address is not set in the .env file!');

            const color = await message.guild?.members.fetch(message.client.user.id).then(color => color.displayHexColor) || '#000000';

        const table1 = new AsciiTable().setHeading(' ID','NICK                ','   SCORE').setAlign(2, AsciiTable.RIGHT);
        const table2 = new AsciiTable().setHeading(' ID','NICK                ','   SCORE').setAlign(2, AsciiTable.RIGHT);
        const table3 = new AsciiTable().setHeading(' ID','NICK                ','   SCORE').setAlign(2, AsciiTable.RIGHT);
        const table4 = new AsciiTable().setHeading(' ID','NICK                ','   SCORE').setAlign(2, AsciiTable.RIGHT);
        const table5 = new AsciiTable().setHeading(' ID','NICK                ','   SCORE').setAlign(2, AsciiTable.RIGHT);

        const ip = process.env.SAMP_IP.split(':');
        const options = {
            host: ip[0],
            port: ip[1] || 7777
        };

        await samp(options, (error, query) => {
            if(error){
                console.log(error);
                const embed = new EmbedBuilder()
                .setColor(color)
                .setTitle(`${options.host}:${options.port}`)
                .setDescription('Server is offline');
        
                return message.channel.send({ embeds: [embed] });
            }

            else{
                const embed = new EmbedBuilder()
                    .setColor(color)
                    .setTitle(`**${query['hostname']}**`)

                if(query['online'] > 0) {
                    if (query['online'] > 100) {
                        embed.addFields({ name: 'PLAYERS LIST', value: '*Number of players is grather than 100. I cannot list them!*' });
                    }
                    else if (query['players'].length == 0) {
                        embed.addFields({ name: 'PLAYERS LIST', value: '*I could not get the players list. Try again...*' });
                    }
                    else {
                        if(query['online'] > 0){
                            for(var i=0;i<20;i++){
                                if(query['players'][i] !== undefined){
                                    table1.addRow(query['players'][i]['id'],query['players'][i]['name'],query['players'][i]['score']);
                                }
                            }
                            embed.addFields({ name: `${query['online']}/${query['maxplayers']}`, value: '```\n'+table1+'```' });
                        }
                        if(query['online'] > 20){
                            for(var i=20;i<40;i++){
                                if(query['players'][i] !== undefined){
                                    table2.addRow(query['players'][i]['id'],query['players'][i]['name'],query['players'][i]['score']);
                                }
                            }
                            embed.addFields({ name: '\u200B', value: '```\n'+table2+'```' });
                        }
                        if(query['online'] > 40){
                            for(var i=40;i<60;i++){
                                if(query['players'][i] !== undefined){
                                    table3.addRow(query['players'][i]['id'],query['players'][i]['name'],query['players'][i]['score']);
                                }
                            }
                            embed.addFields({ name: '\u200B', value: '```\n'+table3+'```' });
                        }
                        if(query['online'] > 60){
                            for(var i=60;i<80;i++){
                                if(query['players'][i] !== undefined){
                                    table4.addRow(query['players'][i]['id'],query['players'][i]['name'],query['players'][i]['score']);
                                }
                            }
                            embed.addFields({ name: '\u200B', value: '```\n'+table4+'```' });
                        }
                        if(query['online'] > 80){
                            for(var i=80;i<100;i++){
                                if(query['players'][i] !== undefined){
                                    table5.addRow(query['players'][i]['id'],query['players'][i]['name'],query['players'][i]['score']);
                                }
                            }
                            embed.addFields({ name: '\u200B', value: '```\n'+table5+'```' });
                        }
                    }
                    return message.channel.send({ embeds: [embed] });
                }
                else if (query['online'] == 0) {
                    embed.addFields({ name: 'PLAYERS LIST', value: '*Server is empty*'});
                    return message.channel.send({ embeds: [embed] });
                }
            }
        });
    }
}