import { Client, GatewayIntentBits, TextChannel, Routes, AutoModerationActionExecution, SlashCommandBuilder, PermissionFlagsBits, Guild, GuildChannel } from 'discord.js'
import { config } from 'dotenv'
import { checker } from './utilities/4090_checker.js'
import { curr_checker } from './utilities/currency_checker.js'
import { checkRate } from './utilities/currency.js'
import { formatter } from './utilities/message_formatter.js'
import { REST } from '@discordjs/rest'
import roles_cmd from './commands/role_operation.js'
import play_music_cmd from './commands/play_music.js'
import check_rate_cmd from './commands/check_rate.js'
import _ from 'underscore'
import { ChatGPTAPIBrowser } from 'chatgpt'
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

    commands.push(play_music_cmd)
    commands.push(check_rate_cmd)
    commands.push(roles_cmd)

    try {

        // const chat_gpt_api = new ChatGPTAPIBrowser({
        //     email: process.env.OPENAI_EMAIL,
        //     password: process.env.OPENAI_PASSWORD,
        //     isGoogleLogin: true
        // })
        // await chat_gpt_api.initSession();

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
            if (message.content.includes('??????')) {
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

        //chatgpt api integration
        client.on('messageCreate', async (message) => {
            const channel = client.channels.cache.get(process.env.CHAT_GPT_ID)
            const result = await chat_gpt_api.sendMessage(message)
            channel.send(result.response);
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