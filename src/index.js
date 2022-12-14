import { Client, GatewayIntentBits, TextChannel, Routes, AutoModerationActionExecution, SlashCommandBuilder, PermissionFlagsBits, Guild, GuildChannel } from 'discord.js'
import { config } from 'dotenv'
import { checker } from './utilities/4090_checker.js'
import { curr_checker } from './utilities/currency_checker.js'
import { checkRate } from './utilities/currency.js'
import { formatter } from './utilities/message_formatter.js'
import { REST } from '@discordjs/rest'
import _ from 'underscore'
import thanos from './commands/thanos.js'
import { Music_API_Controller } from './utilities/get_music_from_spotify.js'

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

    //register playmusic command
    const playMusic_cmd = new SlashCommandBuilder()
        .setName("playmusic")
        .setDescription("Play a piece of music from Spotify")
        .addStringOption(option =>
            option
                .setName('song_name')
                .setDescription('The song to be played')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('artist_name')
                .setDescription('The artist of the song')
                .setRequired(false))

    const checkRate_cmd = new SlashCommandBuilder()
        .setName("checkrate")
        .setDescription("check conversion rate for 2 different currencies, in all caps e.g. USD, CNY, GPD, EUR")
        .addStringOption(option =>
            option
                .setName('currency_1')
                .setDescription('The first currency')
                .setRequired(true)).addStringOption(option =>
                    option
                        .setName('currency_2')
                        .setDescription('The second currency')
                        .setRequired(true))


    commands.push(playMusic_cmd.toJSON())
    commands.push(checkRate_cmd.toJSON())

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
            checker(60000 * 2, (product) => {
                message = product
                channel.send(
                    ' :alarm_clock: *New Stock on Best Buy Now Available!*:alarm_clock: @everyone'
                )
                channel.send(
                    { embeds: [formatter(message)] }
                );
            });
        })


        //currency_checker
        client.on('ready', () => {
            const channel = client.channels.cache.get(process.env.LOBBY_ID)

            curr_checker(1000 * 60 * 60 * 6, (rate) => {
                // console.log(rate)
                if (rate < 7.0)
                    channel.send(
                        ` :alarm_clock: *Current USD to CNY rate is ${rate} *:alarm_clock: @everyone`
                    )
                channel.send(`USD to CNY conversion at ${new Date()} is ${rate}`)
            });
        });


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

        //Use Spotify API to play music
        client.on('interactionCreate', async (interaction) => {
            const channel = client.channels.cache.get(process.env.LOBBY_ID)

            if (interaction.commandName == 'playmusic') {
                const music_player = Music_API_Controller
                var artist_name = (interaction.options.get('artist_name'))
                if (artist_name)
                    artist_name = artist_name.value

                const song_name = interaction.options.get('song_name').value;
                const token = await music_player.get_token()
                const track = await music_player.track_searcher(token, song_name, artist_name)

                if (track.length == 0)
                    interaction.reply({ content: 'No track found, check with your input.' })
                else {
                    channel.send(
                        track
                    )
                    interaction.reply({ content: 'Now Playing...' })
                }
            }


        });

        //currency rate checker
        client.on('interactionCreate', async (interaction) => {
            const channel = client.channels.cache.get(process.env.LOBBY_ID)

            if (interaction.commandName == 'checkrate') {
                const curr_1 = interaction.options.get('currency_1').value;
                const curr_2 = interaction.options.get('currency_2').value;
                console.log(curr_1, curr_2);

                checkRate(curr_1, curr_2, null, (err, rate) => {
                    if (err)
                        console.log(err);
                    else if (rate == null)
                        interaction.reply({ content: 'Not rate found, check with your input.' })
                    else {
                        interaction.reply({ content: 'Result:' })
                        channel.send(
                            `The rate from ${curr_1} to ${curr_2} is ${rate} at ${new Date()}`
                        )
                    }
                })
            }

        });


    } catch (err) {
        console.log(err);
    }
}

main();