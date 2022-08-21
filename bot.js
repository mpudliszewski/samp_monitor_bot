require('dotenv').config();
const { readdirSync } = require('fs');
const { Client, Collection, GatewayIntentBits, Partials, ActivityType, ChannelType } = require('discord.js');

const client = new Client({
    failIfNotExists: false,
    partials: [
        Partials.Channel
    ],
    intents: [
        GatewayIntentBits.DirectMessages, // comment or remove this if bot shouldn't receive DM messages
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();
const pCommandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of pCommandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', async () => {
    console.log(`${client.user.username} is ready!`);
    client.user.setActivity("SA-MP", { type: ActivityType.Competing }); // use ActivityType enum to change it to Watching, Playing or Listening
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    if(!message.content.toLowerCase().startsWith(process.env.PREFIX.toLowerCase())) return;

    const args = message.content.slice(process.env.PREFIX.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    try{
        await command.run(client, message, args);

        if(message.channel.type == ChannelType.DM)
            console.log(`[CMD_DM] ${message.author.tag} (${message.author.id}) | ${message.content}`);
        else
            console.log(`[CMD] ${message.guild.name}(${message.guild.id}) | ${message.author.tag}(${message.author.id}) | ${message.content}`);
    }
    catch (error){
        if(message.channel.type == ChannelType.DM)
            console.log(`[CMD_DM_ERR] ${message.author.tag} (${message.author.id}) | ${message.content}`);
        else
            console.log(`[CMD_ERR] ${message.guild.name}(${message.guild.id}) | ${message.author.tag}(${message.author.id}) | ${message.content}`);

        console.error(error);

        message.reply('An error occurred!');
    }
});

client.on('warn', console.warn);
client.on('error', console.error);

client.login(process.env.BOT_TOKEN);