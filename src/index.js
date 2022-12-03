import { Client, GatewayIntentBits, TextChannel, Routes, AutoModerationActionExecution, SlashCommandBuilder, PermissionFlagsBits, Guild, GuildChannel } from 'discord.js'
import { config } from 'dotenv'
import { checker } from './utilities/4090_checker.js'
import { formatter } from './utilities/message_formatter.js'
import { REST } from '@discordjs/rest'
import _ from 'underscore'
import thanos from './commands/thanos.js'
// import { Music_API_Controller } from './utilities/get_music_from_spotify.js'

config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ]
});

const rest = new REST({ version: '10' }).setToken(process.env.YUKI_BOT_TOKEN);

async function main() {
    //self-defined slash commands
    const commands = [
        {
            name: 'todo',
            description: 'Show my todo list on Notion'
        },
        {
            name: 'thanos',
            description: 'Randomly timeout a user for a random period of time, the upper limit would be 2 minutes.'
        }]

    try {
        //login
        client.login(process.env.YUKI_BOT_TOKEN);
        client.on('ready', () => {
            if (client.user)
                console.log(`${client.user.username} has logged in`)
        })

        //register self-defined slash command
        console.log('Started refreshing application commands.')
        await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {
            body: commands
        });

        //register playmusic command
        const guildCommand = new SlashCommandBuilder()
            .setName("playmusic")
            .setDescription("Play a piece of music from Spotify")
            .addStringOption(option =>
                option
                    .setName('song_name')
                    .setDescription('The song to be played')
                    .setRequired(true))

        await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {
            body: [guildCommand.toJSON()]
        })

        //Basic greetings
        client.on('messageCreate', (message) => {
            if (message.content.includes('你好')) {
                const channel = client.channels.cache.get(process.env.LOBBY_ID)
                channel.send('Hi!')
            }
        })


        //RTX 4090 tracker
        //check stock of 4090 on bestbuy
        //each time the user send a message
        client.on('ready', () => {
            const channel = client.channels.cache.get(process.env.STOCK_ID)
            let message = {}
            checker(60000, (product) => {
                message = product
                channel.send(
                    ' :alarm_clock: *New Stock on Best Buy Now Available!*:alarm_clock: @everyone'
                )
                channel.send(
                    { embeds: [formatter(message)] }
                );
            });
        })

        //show todo list (notion)
        client.on('interactionCreate', (interaction) => {
            if (interaction.commandName == 'todo') {
                interaction.reply({ content: 'https://notion.so' })
            }
        })

        //randomly timeout a user in the guild for 0~100 seconds
        client.on('interactionCreate', (interaction) => {
            if (interaction.commandName == 'thanos') {
                const guild = client.guilds.resolve(process.env.GUILD_ID);


                // Iterate through the collection of GuildMembers from the Guild getting the username property of each member 
                guild.members.fetch()
                    .then((members) => {

                        function getRandomKey(collection) {
                            let keys = Array.from(collection.keys());
                            return keys[Math.floor(Math.random() * keys.length)];
                        }

                        // console.log(members.get(getRandomKey(members)))
                        const member = members.get(getRandomKey(members))
                        const seconds = Math.random() * 100

                        member.timeout(seconds, 'You deserved it')
                            .then(console.log)
                            .catch(console.error);

                        interaction.reply({ content: `${member.user.username}. You deserved it!\n${member.user.username} has been muted for ${seconds.toFixed(2)} seconds` })

                    })
                    .catch(console.error);
            }
        })

        client.on('interactionCreate', async (interaction) => {

            const channel = client.channels.cache.get(process.env.LOBBY_ID)
            if (interaction.commandName == 'playmusic') {
                const song_name = interaction.options.get('song_name').value;

                channel.send(
                    'https://open.spotify.com/track/4rDpP5uHieSTcblNk7wQ2y'
                )
                interaction.reply({ content: 'Now Playing...' })
            }

        });


    } catch (err) {
        console.log(err);
    }
}

main();