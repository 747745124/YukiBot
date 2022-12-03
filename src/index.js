import { Client, GatewayIntentBits, TextChannel } from 'discord.js'
import { config } from 'dotenv'
import { checker } from './utilities/index.js'
import { formatter } from './utilities/message_formatter.js'

config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});


client.login(process.env.YUKI_BOT_TOKEN);
console.log('Bot logged in');

client.on('ready', () => {
    if (client.user)
        console.log(`${client.user.username} has logged in`)
})

//check stock of 4090 on bestbuy
//each time the user send a message
client.on('messageCreate', (message) => {
    if (message.content.includes('你好')) {
        const channel = client.channels.cache.get(process.env.LOBBY_ID)
        channel.send('Hi!')
    }
})


//RTX 4090 tracker
client.on('ready', () => {
    const channel = client.channels.cache.get(process.env.STOCK_ID)
    let message = {}
    checker(60000, (product) => {
        message = product
        channel.send(
            ' :alarm_clock: *New Stock on Best Buy Now Available!*:alarm_clock:'
        )
        channel.send(
            { embeds: [formatter(message)] }
        );
    });

})